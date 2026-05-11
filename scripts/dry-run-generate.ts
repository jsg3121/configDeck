/**
 * 페이즈 3 sample dry-run 스크립트 (SPEC-0007 §6.3 체크포인트)
 *
 * RSS 5개 소스에서 최신 글 1건씩 가져와 새 Editorial Commentary 파이프라인으로
 * 마크다운을 생성한다. 결과는 `src/content/articles/.dry-run/`에 저장되며 본
 * Astro Content Collection 빌드 대상에 포함되지 않는다.
 *
 * 실행: pnpm tsx scripts/dry-run-generate.ts
 *
 * 비용: ~$0.29 (10 calls = 5 items × 2 locales)
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import Anthropic from '@anthropic-ai/sdk'

import { generateOneArticle, generateSlug } from './generate-summary'
import { FEED_CONFIGS, fetchFeed, type RSSItem, type Tool } from './fetch-rss'
import type { ArticleTool } from '../src/lib/constants'

const DRY_RUN_DIR = path.join(process.cwd(), 'src/content/articles/.dry-run')

// 검증 가치가 높은 5개 소스 — Generator 매핑 있는 도구 4개 + null 매핑 1개
// (null 매핑 케이스에서 CTA가 자연스럽게 생략되는지 확인 목적)
const SAMPLE_TOOLS: Tool[] = ['typescript', 'nextjs', 'react', 'astro', 'csstricks']

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

const main = async (): Promise<void> => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set')
    process.exit(1)
  }

  console.log(`Dry-run sample generation: ${SAMPLE_TOOLS.length} sources × 2 locales\n`)

  // 1. 각 소스에서 최신 글 1건씩 수집
  const samples: RSSItem[] = []
  for (const tool of SAMPLE_TOOLS) {
    const config = FEED_CONFIGS.find((c) => c.tool === tool)
    if (!config) {
      console.warn(`  ⚠️  No feed config for tool: ${tool}`)
      continue
    }

    const items = await fetchFeed(config)
    if (items.length === 0) {
      console.warn(`  ⚠️  ${tool}: feed empty, skipping`)
      continue
    }

    const latest = items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())[0]
    samples.push(latest)
    console.log(`  ✓ ${tool}: ${latest.title}`)
  }

  console.log(`\nCollected ${samples.length} sample items. Generating articles...\n`)

  // 2. 결과 저장 디렉토리 준비
  if (!fs.existsSync(DRY_RUN_DIR)) {
    fs.mkdirSync(DRY_RUN_DIR, { recursive: true })
  }

  // 3. generation
  const client = new Anthropic({ apiKey })
  const locales: ('ko' | 'en')[] = ['ko', 'en']
  const results: Array<{
    tool: ArticleTool
    locale: 'ko' | 'en'
    success: boolean
    issues?: string[]
    reason?: string
    metrics?: {
      wordCount: number
      detectedLocale: 'ko' | 'en'
      bannedHits: string[]
      missingSections: string[]
    }
  }> = []

  for (const item of samples) {
    for (const locale of locales) {
      process.stdout.write(`  ${item.tool.padEnd(15)} ${locale} ... `)
      const outcome = await generateOneArticle(item, locale, client, {
        delayMs: 1000,
        maxRetries: 2,
      })

      const tool = item.tool as ArticleTool

      if (outcome.article) {
        // 성공: dry-run 디렉토리에 저장
        const slug = generateSlug(outcome.article)
        const filename = `${tool}-${locale}-${slug}.md`
        fs.writeFileSync(
          path.join(DRY_RUN_DIR, filename),
          outcome.article.markdown,
          'utf-8',
        )
        console.log(
          `✅ saved → .dry-run/${filename} (${outcome.lastValidation?.metrics.wordCount} words)`,
        )
        results.push({
          tool,
          locale,
          success: true,
          metrics: outcome.lastValidation?.metrics,
        })
      } else {
        // 실패: 마지막 시도 결과를 dry-run에 .failed 접미사로 저장 (디버깅)
        if (outcome.lastMarkdown) {
          const filename = `${tool}-${locale}-FAILED.md`
          const header = [
            '<!--',
            `  DRY-RUN FAILED`,
            `  reason: ${outcome.reason}`,
            outcome.lastValidation
              ? `  issues:\n    - ${outcome.lastValidation.issues.join('\n    - ')}`
              : '',
            '-->',
            '',
          ]
            .filter(Boolean)
            .join('\n')
          fs.writeFileSync(
            path.join(DRY_RUN_DIR, filename),
            `${header}${outcome.lastMarkdown}`,
            'utf-8',
          )
        }
        console.log(`❌ ${outcome.reason}`)
        results.push({
          tool,
          locale,
          success: false,
          issues: outcome.lastValidation?.issues,
          reason: outcome.reason,
          metrics: outcome.lastValidation?.metrics,
        })
      }

      await sleep(1000)
    }
  }

  // 4. 결과 보고
  console.log('\n' + '='.repeat(70))
  console.log('  Dry-Run Generation Report')
  console.log('='.repeat(70))

  const successCount = results.filter((r) => r.success).length
  const successRate = (successCount / results.length) * 100

  console.log(`\nTotal: ${results.length} generation attempts`)
  console.log(`Passed validation: ${successCount} (${successRate.toFixed(1)}%)`)
  console.log(`Failed: ${results.length - successCount}`)
  console.log(`Target: ≥ 70% (SPEC-0007 §8.1)`)
  console.log(`Status: ${successRate >= 70 ? '✅ PASS' : '⚠️  BELOW TARGET'}\n`)

  console.log('Per-result detail:')
  console.log('-'.repeat(70))
  for (const r of results) {
    const status = r.success ? '✅' : '❌'
    const m = r.metrics
    const summary = r.success
      ? `${m?.wordCount} words, ${m?.detectedLocale}, banned=${m?.bannedHits.length}`
      : `${r.reason} | issues: ${r.issues?.join(', ') ?? 'n/a'}`
    console.log(`  ${status} ${r.tool.padEnd(15)} ${r.locale}: ${summary}`)
  }

  console.log('\n' + '='.repeat(70))
  console.log(`\nGenerated files saved to: ${DRY_RUN_DIR}`)
  console.log(`(These files are NOT picked up by Astro Content Collections)\n`)
  process.exit(0)
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
