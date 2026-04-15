/**
 * 아티클 업데이트 메인 스크립트
 *
 * RSS 피드 수집 → 신규 항목 필터링 → AI 마크다운 생성 → 파일 저장
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import { fetchAllFeeds, filterNewItems, selectBalanced } from './fetch-rss'
import { generateArticles, generateSlug, type GeneratedArticle } from './generate-summary'

const ARTICLES_DIR = path.join(process.cwd(), 'src/content/articles')

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
 * 아티클을 파일로 저장한다.
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

  // 각 도구에서 균등하게 2개 선택 (언어별 개별 호출로 API 비용 증가 고려)
  const itemsToProcess = selectBalanced(newItems, 2)

  const articles = await generateArticles(itemsToProcess, apiKey, {
    delayMs: 1000,
    maxRetries: 3,
  })

  console.log(`Generated ${articles.length} articles. Saving...`)

  for (const article of articles) {
    saveArticle(article)
  }

  console.log('Done!')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
