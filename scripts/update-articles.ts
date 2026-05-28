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
const DEPRIORITIZE_DAYS = 3
const MTIME_PREFILTER_MARGIN_DAYS = 1
const FRONTMATTER_READ_BYTES = 2048

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
 * 파일 헤드(처음 N바이트)만 읽어 frontmatter에서 `tool`과 `pubDate`를 추출한다.
 *
 * 본문(평균 3~4KB)을 건너뛰기 위해 fs.openSync + readSync로 부분 read한다.
 * frontmatter는 `---` 구분자 안에 있고 현재 400바이트 이내지만,
 * 향후 description/tags 확장 여지를 고려해 2048바이트로 잡는다.
 * 디스크 I/O는 4KB 블록 단위라 단일 read 호출로 처리되어 오버헤드는 없다.
 */
const readArticleHead = (filePath: string): { tool?: Tool; pubDate?: Date } => {
  const fd = fs.openSync(filePath, 'r')
  try {
    const buf = Buffer.alloc(FRONTMATTER_READ_BYTES)
    const bytesRead = fs.readSync(fd, buf, 0, FRONTMATTER_READ_BYTES, 0)
    const head = buf.toString('utf-8', 0, bytesRead)

    const toolMatch = head.match(/^tool:\s*["']?([^"'\n]+)["']?/m)
    const pubDateMatch = head.match(/^pubDate:\s*["']?([^"'\n]+)["']?/m)

    const pubDate = pubDateMatch ? new Date(pubDateMatch[1]) : undefined
    return {
      // 정규식 캡처 그룹은 string으로만 추론되지만 frontmatter `tool` 필드 값은
      // Tool union 중 하나임이 content collection 스키마로 보장되므로 단언한다.
      tool: toolMatch ? (toolMatch[1] as Tool) : undefined,
      pubDate: pubDate && !Number.isNaN(pubDate.getTime()) ? pubDate : undefined,
    }
  } finally {
    fs.closeSync(fd)
  }
}

/**
 * 최근 N일간 발행된 아티클의 도구 목록을 추출한다 (ADR-0023).
 *
 * - 1차: 파일 mtime이 `cutoff - margin` 이전이면 frontmatter를 안 읽고 스킵한다.
 *   mtime은 git operation으로 흔들릴 수 있어 보수적으로 1일 마진을 둔다.
 *   "이르게 컷오프"되어 누락되면 디우선 대상이 비어 효과만 약화될 뿐 사이트 빌드는 안전.
 * - 2차: frontmatter `pubDate`로 최종 판정한다 (ADR-0021 결정 6: pubDate가 권위 출처).
 *
 * 옛 로직(파일명 `YYYY-MM-DD-` prefix 매칭)은 ADR-0021의 slug 단순화 이후
 * 모든 파일에서 미스매치를 일으켜 디우선순위가 사일런트로 무력화되었다.
 */
const getRecentlyUsedTools = (days: number): Set<Tool> => {
  const tools = new Set<Tool>()
  const locales = ['ko', 'en']

  const now = Date.now()
  const cutoffMs = now - days * 24 * 60 * 60 * 1000
  const mtimeFloorMs = cutoffMs - MTIME_PREFILTER_MARGIN_DAYS * 24 * 60 * 60 * 1000

  for (const locale of locales) {
    const localeDir = path.join(ARTICLES_DIR, locale)

    if (!fs.existsSync(localeDir)) {
      continue
    }

    const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.md'))

    for (const file of files) {
      const filePath = path.join(localeDir, file)
      const stat = fs.statSync(filePath)
      if (stat.mtimeMs < mtimeFloorMs) continue

      const { tool, pubDate } = readArticleHead(filePath)
      if (!tool || !pubDate) continue
      if (pubDate.getTime() < cutoffMs) continue

      tools.add(tool)
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
