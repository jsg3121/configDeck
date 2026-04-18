/**
 * Claude API를 사용한 아티클 요약 생성 스크립트
 *
 * RSS에서 수집한 아티클의 원문을 분석하여
 * 마크다운 문서를 직접 생성한다.
 */

import Anthropic from '@anthropic-ai/sdk'

import type { RSSItem, Tool } from './fetch-rss'
import { getToolName } from './fetch-rss'

export interface GeneratedArticle {
  id: string
  tool: Tool
  title: string
  link: string
  pubDate: Date
  locale: 'ko' | 'en'
  markdown: string
}

type Locale = 'ko' | 'en'

/**
 * 제목에서 멘션 패턴을 제거한다.
 * 예: "Title via @user, @user2" → "Title"
 */
const cleanTitle = (title: string): string => {
  return title
    .replace(/\s+via\s+@[\w,\s@]+$/i, '')
    .replace(/\s+by\s+@[\w,\s@]+$/i, '')
    .trim()
}

/**
 * 언어별 아티클 생성 프롬프트를 구성한다.
 */
const buildPrompt = (item: RSSItem, locale: Locale): string => {
  const toolName = getToolName(item.tool)
  const isKorean = locale === 'ko'
  const cleanedTitle = cleanTitle(item.title)

  const langInstruction = isKorean
    ? '한국어로 작성하세요.'
    : 'Write in English.'

  const titleInstruction = isKorean
    ? `한국어로 자연스럽게 번역한 제목을 작성하세요. 원문: "${cleanedTitle}"`
    : `Use the original title: "${cleanedTitle}"`

  const summaryInstruction = isKorean
    ? '2-3문장으로 "이 글을 왜 읽어야 하는지" 전달. 마크다운 문법 사용 금지.'
    : '2-3 sentences explaining why developers should read this. No markdown.'

  return `당신은 개발자 커뮤니티에서 인정받는 시니어 기술 에디터입니다.

## 작업
${toolName} 관련 아티클을 분석하여 개발자들이 실무에 즉시 활용할 수 있는 마크다운 문서를 작성하세요.
${langInstruction}

## 원문 정보
- 제목: ${cleanedTitle}
- 도구: ${toolName}
- 링크: ${item.link}
${item.description ? `- 원문 발췌: ${item.description}` : ''}

## 출력 형식
반드시 아래 형식의 마크다운 문서만 출력하세요. 다른 설명이나 텍스트는 포함하지 마세요.

---
id: "${item.id}"
tool: "${item.tool}"
title: "${titleInstruction}"
link: "${item.link}"
pubDate: ${item.pubDate.toISOString()}
summary: "여기에 요약 작성"
---

## 첫 번째 섹션 제목

본문 내용...

## 두 번째 섹션 제목

본문 내용...

## 작성 규칙

### summary (frontmatter 내)
${summaryInstruction}

### 본문
- 최소 800자 이상의 충실한 콘텐츠
- 4개 이상의 ## 섹션으로 구성
- 각 섹션마다 구체적인 설명과 예시 포함

### 마크다운 형식
- ## 헤딩 앞뒤에 빈 줄 필수
- 문단 사이에 빈 줄 필수
- 핵심 키워드, 버전, 기능명은 **볼드** 처리
- 코드, 명령어, 파일명은 \`백틱\` 사용
- 3개 이상 항목은 bullet list 사용
- 코드 예시는 \`\`\`언어명 코드블록 사용

### 필수 포함 내용 (해당 시)
- 주요 변경사항/기능 상세 설명
- 실제 사용 예시 코드
- 업그레이드/마이그레이션 명령어
- Breaking Changes 및 주의사항
- 개발자에게 미치는 영향과 권장 조치`
}

/** API 호출 결과 타입 */
interface APICallResult {
  success: boolean
  markdown: string | null
  retryable: boolean
}

/**
 * Claude API를 호출하여 마크다운 문서를 생성한다.
 */
const callClaudeAPI = async (
  client: Anthropic,
  prompt: string,
): Promise<APICallResult> => {
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      console.error('No text in Claude response')
      return { success: false, markdown: null, retryable: true }
    }

    const markdown = textBlock.text.trim()

    // frontmatter 검증
    if (!markdown.startsWith('---') || !markdown.includes('summary:')) {
      console.error('Invalid markdown format (missing frontmatter)')
      return { success: false, markdown: null, retryable: true }
    }

    return { success: true, markdown, retryable: false }
  } catch (error) {
    console.error('Error calling Claude API:', error)

    if (error instanceof Anthropic.APIError) {
      const nonRetryable = [429, 401, 403].includes(error.status)
      return { success: false, markdown: null, retryable: !nonRetryable }
    }

    return { success: false, markdown: null, retryable: true }
  }
}

/**
 * 단일 아티클의 마크다운을 생성한다.
 */
const generateArticleMarkdown = async (
  item: RSSItem,
  locale: Locale,
  client: Anthropic,
): Promise<{ markdown: string | null; retryable: boolean }> => {
  const prompt = buildPrompt(item, locale)
  const result = await callClaudeAPI(client, prompt)

  if (!result.success || !result.markdown) {
    return { markdown: null, retryable: result.retryable }
  }

  return { markdown: result.markdown, retryable: false }
}

/**
 * 지정된 시간만큼 대기한다.
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 여러 아티클의 마크다운을 생성한다.
 * 각 아티클마다 한국어/영어 버전을 개별 호출한다.
 */
export const generateArticles = async (
  items: RSSItem[],
  apiKey: string,
  options: { delayMs?: number; maxRetries?: number } = {},
): Promise<GeneratedArticle[]> => {
  const { delayMs = 1000, maxRetries = 3 } = options
  const client = new Anthropic({ apiKey })
  const articles: GeneratedArticle[] = []
  const locales: Locale[] = ['ko', 'en']

  for (const item of items) {
    for (const locale of locales) {
      let retries = 0
      let result: { markdown: string | null; retryable: boolean } | null = null

      while (retries < maxRetries) {
        result = await generateArticleMarkdown(item, locale, client)

        if (result.markdown) {
          break
        }

        if (!result.retryable) {
          // eslint-disable-next-line no-console
          console.error(`Non-retryable error for: ${item.title} (${locale}). Stopping.`)
          return articles
        }

        retries++
        if (retries < maxRetries) {
          console.log(`Retry ${retries}/${maxRetries} for: ${item.title} (${locale})`)
          await sleep(delayMs * retries)
        }
      }

      if (result?.markdown) {
        articles.push({
          id: item.id,
          tool: item.tool,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          locale,
          markdown: result.markdown,
        })
        console.log(`Generated: ${item.title} (${locale})`)
      } else {
        console.error(`Failed: ${item.title} (${locale})`)
      }

      await sleep(delayMs)
    }
  }

  return articles
}

/**
 * 파일명으로 사용할 수 있는 slug를 생성한다.
 */
export const generateSlug = (article: GeneratedArticle): string => {
  const dateStr = article.pubDate.toISOString().split('T')[0]
  const titleSlug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)

  return `${dateStr}-${article.tool}-${titleSlug}`
}
