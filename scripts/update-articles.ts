/**
 * 아티클 업데이트 메인 스크립트
 *
 * RSS 피드 수집 → 신규 항목 필터링 → AI 마크다운 생성 (검증 포함) → 파일 저장
 *
 * v1.6.0 변경 사항 (SPEC-0007 / ADR-0021):
 *  - generate-summary가 자동 검증을 거치므로 article은 통과한 것만 들어온다.
 *  - 검증 실패한 결과물은 review queue 디렉토리로 격리해 본 콘텐츠 디렉토리에는
 *    들어가지 않는다 (사이트 빌드에 영향 없음).
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import { fetchAllFeeds, filterNewItems, selectBalanced, type RSSItem, type Tool } from './fetch-rss'
import {
  generateArticles,
  generateSlug,
  type GeneratedArticle,
} from './generate-summary'
import type { GenerationOutcome } from './generate-summary'

const ARTICLES_DIR = path.join(process.cwd(), 'src/content/articles')
const REVIEW_QUEUE_DIR = path.join(ARTICLES_DIR, '.review-queue')
const DEPRIORITIZE_DAYS = 2

/**
 * 기존 아티클 ID 목록을 가져온다.
 */
const getExistingArticleIds = (): Set<string> => {
  const ids = new Set<string>()
  const locales = ['ko', 'en']

  for (const locale of locales) {
    const localeDir = path.join(ARTICLES_DIR, locale)

    if (!fs.existsSync(localeDir)) {
      continue
    }

    const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.md'))

    for (const file of files) {
      const content = fs.readFileSync(path.join(localeDir, file), 'utf-8')
      const idMatch = content.match(/^id:\s*["']?([^"'\n]+)["']?/m)
      if (idMatch) {
        ids.add(idMatch[1])
      }
    }
  }

  return ids
}

/**
 * 최근 N일간 저장된 아티클의 도구 목록을 추출한다.
 */
const getRecentlyUsedTools = (days: number): Set<Tool> => {
  const tools = new Set<Tool>()
  const locales = ['ko', 'en']

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`

  for (const locale of locales) {
    const localeDir = path.join(ARTICLES_DIR, locale)

    if (!fs.existsSync(localeDir)) {
      continue
    }

    const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.md'))

    for (const file of files) {
      const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})-/)
      if (!dateMatch) continue
      if (dateMatch[1] < cutoffStr) continue

      const content = fs.readFileSync(path.join(localeDir, file), 'utf-8')
      const toolMatch = content.match(/^tool:\s*["']?([^"'\n]+)["']?/m)
      if (toolMatch) {
        tools.add(toolMatch[1] as Tool)
      }
    }
  }

  return tools
}

/**
 * 검증 통과한 아티클을 본 콘텐츠 디렉토리에 저장한다.
 */
const saveArticle = (article: GeneratedArticle): void => {
  const localeDir = path.join(ARTICLES_DIR, article.locale)
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true })
  }
  const slug = generateSlug(article)
  const filePath = path.join(localeDir, `${slug}.md`)
  fs.writeFileSync(filePath, article.markdown, 'utf-8')
  console.log(`Saved: ${article.locale}/${slug}.md`)
}

/**
 * 검증 실패한 결과물을 review queue로 격리한다 (SPEC-0007 §3.2.4).
 *
 * 본 콘텐츠 디렉토리(`src/content/articles/{locale}/`)에는 저장하지 않으므로
 * Astro Content Collection의 빌드 대상에 포함되지 않는다. `.review-queue` 폴더는
 * `src/content.config.ts`의 glob 패턴(`** /*.md`, base `articles`)이 매칭되지만,
 * `.review-queue` 디렉토리 이름이 dotfile이라 glob 기본 동작이 무시한다.
 *
 * 파일명에 timestamp를 포함해 동일 item에 대한 재시도 결과가 겹치지 않게 한다.
 */
const saveFailureForReview = (
  item: RSSItem,
  locale: 'ko' | 'en',
  outcome: GenerationOutcome,
): void => {
  if (!fs.existsSync(REVIEW_QUEUE_DIR)) {
    fs.mkdirSync(REVIEW_QUEUE_DIR, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const safeTool = item.tool.replace(/[^a-z0-9-]/gi, '')
  const filename = `${timestamp}-${safeTool}-${locale}.md`
  const filePath = path.join(REVIEW_QUEUE_DIR, filename)

  const header = [
    '<!--',
    '  Generation queued for manual review.',
    `  tool: ${item.tool}`,
    `  locale: ${locale}`,
    `  source: ${item.link}`,
    `  reason: ${outcome.reason ?? 'unknown'}`,
    outcome.lastValidation
      ? `  issues:\n    - ${outcome.lastValidation.issues.join('\n    - ')}`
      : '  issues: (no validation result — API failure)',
    '-->',
    '',
  ].join('\n')

  const body = outcome.lastMarkdown ?? '(API call produced no output)'
  fs.writeFileSync(filePath, `${header}${body}`, 'utf-8')
  console.log(`Queued for review: .review-queue/${filename}`)
}

/**
 * 메인 실행 함수
 */
const main = async (): Promise<void> => {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is not set')
    process.exit(1)
  }

  console.log('Fetching RSS feeds...')
  const allItems = await fetchAllFeeds()

  console.log('Checking for new articles...')
  const existingIds = getExistingArticleIds()
  const newItems = filterNewItems(allItems, existingIds)

  if (newItems.length === 0) {
    console.log('No new articles found.')
    return
  }

  console.log(`Found ${newItems.length} new articles. Generating...`)

  const recentlyUsedTools = getRecentlyUsedTools(DEPRIORITIZE_DAYS)
  if (recentlyUsedTools.size > 0) {
    console.log(
      `Deprioritizing tools used in the last ${DEPRIORITIZE_DAYS} days: ${Array.from(recentlyUsedTools).join(', ')}`,
    )
  }

  const itemsToProcess = selectBalanced(newItems, 2, { deprioritize: recentlyUsedTools })

  const { articles, failures } = await generateArticles(itemsToProcess, apiKey, {
    delayMs: 1000,
    maxRetries: 2,
  })

  console.log(`\nGenerated ${articles.length} article(s) passed validation.`)
  console.log(`Failed ${failures.length} generation(s) → review queue.`)

  for (const article of articles) {
    saveArticle(article)
  }

  for (const { item, locale, outcome } of failures) {
    saveFailureForReview(item, locale, outcome)
  }

  console.log('\nDone.')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
