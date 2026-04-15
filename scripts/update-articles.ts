/**
 * 아티클 업데이트 메인 스크립트
 *
 * RSS 피드 수집 → 신규 항목 필터링 → AI 요약 생성 → Markdown 파일 저장
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import { fetchAllFeeds, filterNewItems, selectBalanced } from './fetch-rss'
import {
  generateSlug,
  generateSummaries,
  toMarkdownContent,
  type ArticleSummary,
} from './generate-summary'

const ARTICLES_DIR = path.join(process.cwd(), 'src/content/articles')
const LOCALES = ['ko', 'en'] as const

/**
 * 기존 아티클 ID 목록을 가져온다.
 */
const getExistingArticleIds = (): Set<string> => {
  const ids = new Set<string>()

  for (const locale of LOCALES) {
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
 * 아티클을 Markdown 파일로 저장한다.
 */
const saveArticle = (article: ArticleSummary, locale: 'ko' | 'en'): void => {
  const localeDir = path.join(ARTICLES_DIR, locale)

  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true })
  }

  const slug = generateSlug(article)
  const filePath = path.join(localeDir, `${slug}.md`)
  const content = toMarkdownContent(article, locale)

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Saved: ${locale}/${slug}.md`)
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

  console.log(`Found ${newItems.length} new articles. Generating summaries...`)

  // 각 도구에서 균등하게 4개 선택 (Rate limit 및 비용 고려)
  const itemsToProcess = selectBalanced(newItems, 4)

  const summaries = await generateSummaries(itemsToProcess, apiKey, {
    delayMs: 1000, // 1초 딜레이
    maxRetries: 3,
  })

  console.log(`Generated ${summaries.length} summaries. Saving...`)

  for (const summary of summaries) {
    for (const locale of LOCALES) {
      saveArticle(summary, locale)
    }
  }

  console.log('Done!')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
