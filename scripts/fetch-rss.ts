/**
 * RSS 피드 수집 스크립트
 *
 * 10개 개발 도구의 공식 RSS/Atom 피드를 수집하여
 * 신규 항목을 추출한다.
 */

export interface RSSItem {
  id: string
  tool: Tool
  title: string
  link: string
  pubDate: Date
  description?: string
}

export type Tool =
  | 'eslint'
  | 'prettier'
  | 'typescript'
  | 'nextjs'
  | 'react'
  | 'astro'
  | 'nodejs'
  | 'webdev'
  | 'tailwindcss'
  | 'vite'

interface FeedConfig {
  tool: Tool
  name: string
  feedUrl: string
  type: 'rss' | 'atom'
}

export const FEED_CONFIGS: FeedConfig[] = [
  {
    tool: 'eslint',
    name: 'ESLint',
    feedUrl: 'https://eslint.org/feed.xml',
    type: 'rss',
  },
  {
    tool: 'prettier',
    name: 'Prettier',
    feedUrl: 'https://prettier.io/blog/atom.xml',
    type: 'atom',
  },
  {
    tool: 'typescript',
    name: 'TypeScript',
    feedUrl: 'https://devblogs.microsoft.com/typescript/feed/',
    type: 'rss',
  },
  {
    tool: 'nextjs',
    name: 'Next.js',
    feedUrl: 'https://nextjs.org/feed.xml',
    type: 'rss',
  },
  {
    tool: 'react',
    name: 'React',
    feedUrl: 'https://react.dev/rss.xml',
    type: 'rss',
  },
  {
    tool: 'astro',
    name: 'Astro',
    feedUrl: 'https://astro.build/rss.xml',
    type: 'rss',
  },
  {
    tool: 'nodejs',
    name: 'Node.js',
    feedUrl: 'https://nodejs.org/en/feed/blog.xml',
    type: 'rss',
  },
  {
    tool: 'webdev',
    name: 'web.dev',
    feedUrl: 'https://web.dev/blog/feed.xml',
    type: 'rss',
  },
  {
    tool: 'tailwindcss',
    name: 'Tailwind CSS',
    feedUrl: 'https://tailwindcss.com/feeds/feed.xml',
    type: 'rss',
  },
  {
    tool: 'vite',
    name: 'Vite',
    feedUrl: 'https://vite.dev/blog.rss',
    type: 'rss',
  },
]

/**
 * HTML 엔티티를 디코딩한다.
 */
const decodeHtmlEntities = (text: string): string => {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&nbsp;': ' ',
  }

  let decoded = text
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replaceAll(entity, char)
  }

  // 숫자 엔티티 처리 (&#123; 형식)
  decoded = decoded.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))

  return decoded
}

/**
 * XML 텍스트에서 특정 태그의 내용을 추출한다.
 */
const extractTagContent = (xml: string, tagName: string): string | undefined => {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i')
  const match = xml.match(regex)
  if (!match) return undefined

  let content = match[1].trim()

  // CDATA 처리
  const cdataMatch = content.match(/<!\[CDATA\[([\s\S]*?)\]\]>/)
  if (cdataMatch) {
    content = cdataMatch[1]
  }

  // HTML 엔티티 디코딩
  content = decodeHtmlEntities(content)

  return content
}

/**
 * XML 텍스트에서 link 태그의 href 속성을 추출한다 (Atom 피드용).
 */
const extractAtomLink = (xml: string): string | undefined => {
  // rel="alternate" 링크 우선
  const alternateMatch = xml.match(
    /<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*\/?>/i,
  )
  if (alternateMatch) return alternateMatch[1]

  // href 속성이 있는 일반 link
  const hrefMatch = xml.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i)
  if (hrefMatch) return hrefMatch[1]

  // 태그 내용으로 된 link
  return extractTagContent(xml, 'link')
}

/**
 * RSS 피드를 파싱하여 아이템 목록을 반환한다.
 */
const parseRSSFeed = (xml: string, tool: Tool): RSSItem[] => {
  const items: RSSItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]

    const title = extractTagContent(itemXml, 'title')
    const link = extractTagContent(itemXml, 'link')
    const guid = extractTagContent(itemXml, 'guid')
    const pubDateStr = extractTagContent(itemXml, 'pubDate')
    const description = extractTagContent(itemXml, 'description')

    if (!title || !link) continue

    const pubDate = pubDateStr ? new Date(pubDateStr) : new Date()

    items.push({
      id: guid || link,
      tool,
      title: title.trim(),
      link: link.trim(),
      pubDate,
      description: description?.trim(),
    })
  }

  return items
}

/**
 * Atom 피드를 파싱하여 아이템 목록을 반환한다.
 */
const parseAtomFeed = (xml: string, tool: Tool): RSSItem[] => {
  const items: RSSItem[] = []
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi
  let match

  while ((match = entryRegex.exec(xml)) !== null) {
    const entryXml = match[1]

    const title = extractTagContent(entryXml, 'title')
    const link = extractAtomLink(entryXml)
    const id = extractTagContent(entryXml, 'id')
    const updatedStr = extractTagContent(entryXml, 'updated')
    const publishedStr = extractTagContent(entryXml, 'published')
    const summary = extractTagContent(entryXml, 'summary')
    const content = extractTagContent(entryXml, 'content')

    if (!title || !link) continue

    const dateStr = publishedStr || updatedStr
    const pubDate = dateStr ? new Date(dateStr) : new Date()

    items.push({
      id: id || link,
      tool,
      title: title.trim(),
      link: link.trim(),
      pubDate,
      description: (summary || content)?.trim(),
    })
  }

  return items
}

/**
 * 단일 피드를 fetch하고 파싱한다.
 */
export const fetchFeed = async (config: FeedConfig): Promise<RSSItem[]> => {
  try {
    const response = await fetch(config.feedUrl, {
      headers: {
        'User-Agent': 'ConfigDeck RSS Fetcher/1.0',
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch ${config.tool}: ${response.status} ${response.statusText}`)
      return []
    }

    const xml = await response.text()

    const items =
      config.type === 'atom' ? parseAtomFeed(xml, config.tool) : parseRSSFeed(xml, config.tool)

    console.log(`Fetched ${items.length} items from ${config.name}`)
    return items
  } catch (error) {
    console.error(`Error fetching ${config.tool}:`, error)
    return []
  }
}

/**
 * 2026년 이후 게시글만 필터링한다.
 */
const filterByYear = (items: RSSItem[], year: number = 2026): RSSItem[] => {
  const startDate = new Date(`${year}-01-01T00:00:00Z`)
  return items.filter((item) => item.pubDate >= startDate)
}

/**
 * 모든 피드를 병렬로 fetch한다.
 */
export const fetchAllFeeds = async (): Promise<RSSItem[]> => {
  const results = await Promise.all(FEED_CONFIGS.map((config) => fetchFeed(config)))

  const allItems = results.flat()

  // 2026년 이후 게시글만 필터링
  const recentItems = filterByYear(allItems)

  // 날짜 기준 내림차순 정렬
  recentItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())

  console.log(`Total: ${recentItems.length} items (2026+) from ${FEED_CONFIGS.length} feeds`)
  return recentItems
}

/**
 * 각 도구별로 균등하게 아이템을 선택한다.
 * Round-robin 방식으로 각 도구에서 하나씩 가져온다.
 */
export const selectBalanced = (items: RSSItem[], count: number): RSSItem[] => {
  // 도구별로 그룹화 (날짜순 유지)
  const byTool = new Map<Tool, RSSItem[]>()

  for (const item of items) {
    const toolItems = byTool.get(item.tool) || []
    toolItems.push(item)
    byTool.set(item.tool, toolItems)
  }

  const selected: RSSItem[] = []
  const toolQueues = Array.from(byTool.values())

  // Round-robin으로 각 도구에서 하나씩 선택
  let toolIndex = 0
  while (selected.length < count && toolQueues.some((q) => q.length > 0)) {
    const queue = toolQueues[toolIndex % toolQueues.length]

    if (queue.length > 0) {
      selected.push(queue.shift()!)
    }

    toolIndex++
  }

  return selected
}

/**
 * 기존 아티클 ID 목록과 비교하여 신규 항목만 필터링한다.
 */
export const filterNewItems = (items: RSSItem[], existingIds: Set<string>): RSSItem[] => {
  return items.filter((item) => !existingIds.has(item.id))
}

/**
 * 도구 이름을 반환한다.
 */
export const getToolName = (tool: Tool): string => {
  const config = FEED_CONFIGS.find((c) => c.tool === tool)
  return config?.name || tool
}
