/**
 * 아티클 업데이트 메인 스크립트
 *
 * RSS 피드 수집 → 신규 항목 필터링 → AI 마크다운 생성 → 파일 저장
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

import { fetchAllFeeds, filterNewItems, selectBalanced, type Tool } from './fetch-rss'
import { generateArticles, generateSlug, type GeneratedArticle } from './generate-summary'

const ARTICLES_DIR = path.join(process.cwd(), 'src/content/articles')
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
 * 파일명 prefix({YYYY-MM-DD}-)와 cutoff 날짜를 문자열로 비교하여 타임존 영향을 제거한다.
 * frontmatter의 tool 필드를 읽어 도구 집합을 만든다.
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

  // 최근 N일간 사용된 도구는 디우선순위화하여 다양성 확보
  const recentlyUsedTools = getRecentlyUsedTools(DEPRIORITIZE_DAYS)
  if (recentlyUsedTools.size > 0) {
    console.log(
      `Deprioritizing tools used in the last ${DEPRIORITIZE_DAYS} days: ${Array.from(recentlyUsedTools).join(', ')}`,
    )
  }

  // 각 도구에서 균등하게 2개 선택 (언어별 개별 호출로 API 비용 증가 고려)
  const itemsToProcess = selectBalanced(newItems, 2, { deprioritize: recentlyUsedTools })

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
