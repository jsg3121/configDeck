/**
 * Gemini API를 사용한 아티클 요약 생성 스크립트
 *
 * RSS에서 수집한 아티클의 원문을 분석하여
 * 한국어/영어 요약을 생성한다.
 */

import type { RSSItem, Tool } from './fetch-rss'
import { getToolName } from './fetch-rss'

export interface ArticleContent {
  /** 짧은 요약 (카드용, 2-3문장) */
  summary: string
  /** 상세 설명 (페이지용, 마크다운 형식) */
  details: string
}

export interface ArticleSummary {
  id: string
  tool: Tool
  title: string
  link: string
  pubDate: Date
  content: {
    ko: ArticleContent
    en: ArticleContent
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
  error?: {
    message: string
  }
}

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

/** API 응답 데이터 타입 */
interface GeneratedContent {
  ko: ArticleContent
  en: ArticleContent
}

/**
 * 아티클 분석 프롬프트를 구성한다.
 * 풍부한 콘텐츠 생성을 위해 상세 분석을 요청한다.
 */
const buildPrompt = (item: RSSItem): string => {
  const toolName = getToolName(item.tool)

  return `당신은 개발 도구 전문 기술 에디터입니다. 다음 ${toolName} 업데이트 공지를 분석하고, 개발자에게 유용한 정보를 정리해주세요.

## 원문 정보
- 제목: ${item.title}
- 도구: ${toolName}
${item.description ? `- 내용: ${item.description}` : ''}

## 작성 가이드라인

### summary (카드용 요약)
- 핵심 내용을 2-3문장으로 요약
- 마크다운 문법 사용하지 않음

### details (상세 설명)
내용에 맞는 구조로 자유롭게 작성하되, 다음 형식 규칙을 따르세요:

**형식 규칙:**
- 문단 사이에 빈 줄 넣기
- 중요 용어, 기능명, 버전은 **볼드** 처리
- 코드, 명령어, 패키지명, 파일명은 \`백틱\` 사용
- 3개 이상 나열 시 bullet list(-) 사용
- 코드 예시가 있으면 코드블록(\`\`\`) 사용 (언어 명시)
- 내용에 맞는 섹션 제목(##)을 자유롭게 사용

**구조 예시 (참고용, 강제 아님):**
- 릴리스 노트 → 주요 변경사항, 업그레이드 방법 중심
- 공지/발표 → 배경, 영향, 앞으로의 방향 중심
- 보안 패치 → 취약점 설명, 영향 범위, 즉시 조치 사항 중심

## 응답 형식
반드시 아래 JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요:
{
  "ko": {
    "summary": "한국어 요약 (2-3문장, 마크다운 없이)",
    "details": "한국어 상세 설명 (마크다운 형식)"
  },
  "en": {
    "summary": "English summary (2-3 sentences, no markdown)",
    "details": "English detailed description (markdown format)"
  }
}`
}

/** API 호출 결과 타입 */
interface APICallResult {
  success: boolean
  data: GeneratedContent | null
  retryable: boolean
}

/**
 * ArticleContent 유효성 검사
 */
const isValidArticleContent = (obj: unknown): obj is ArticleContent => {
  if (!obj || typeof obj !== 'object') return false
  const content = obj as Record<string, unknown>
  return typeof content.summary === 'string' && typeof content.details === 'string'
}

/**
 * Gemini API를 호출하여 아티클 콘텐츠를 생성한다.
 */
const callGeminiAPI = async (prompt: string, apiKey: string): Promise<APICallResult> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini API error: ${response.status} - ${errorText}`)
      const nonRetryable = [429, 403, 401].includes(response.status)
      return { success: false, data: null, retryable: !nonRetryable }
    }

    const data = (await response.json()) as GeminiResponse

    if (data.error) {
      console.error(`Gemini API error: ${data.error.message}`)
      return { success: false, data: null, retryable: true }
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      console.error('No text in Gemini response')
      return { success: false, data: null, retryable: true }
    }

    // JSON 파싱 시도 (코드블록 제거 후 파싱)
    const cleanedText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON found in response:', text)
      return { success: false, data: null, retryable: true }
    }

    const parsed = JSON.parse(jsonMatch[0]) as GeneratedContent

    if (!isValidArticleContent(parsed.ko) || !isValidArticleContent(parsed.en)) {
      console.error('Invalid content format:', JSON.stringify(parsed).slice(0, 200))
      return { success: false, data: null, retryable: true }
    }

    return { success: true, data: parsed, retryable: false }
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    return { success: false, data: null, retryable: true }
  }
}

/** 요약 생성 결과 타입 */
interface SummaryResult {
  article: ArticleSummary | null
  retryable: boolean
}

/**
 * 단일 아티클의 요약을 생성한다.
 */
export const generateSummary = async (item: RSSItem, apiKey: string): Promise<SummaryResult> => {
  const prompt = buildPrompt(item)
  const result = await callGeminiAPI(prompt, apiKey)

  if (!result.success || !result.data) {
    return { article: null, retryable: result.retryable }
  }

  return {
    article: {
      id: item.id,
      tool: item.tool,
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      content: result.data,
    },
    retryable: false,
  }
}

/**
 * 여러 아티클의 요약을 생성한다.
 * Rate limit을 고려하여 순차적으로 처리한다.
 * 429/403 등 재시도 불가능한 에러 시 즉시 중단한다.
 */
export const generateSummaries = async (
  items: RSSItem[],
  apiKey: string,
  options: { delayMs?: number; maxRetries?: number } = {},
): Promise<ArticleSummary[]> => {
  const { delayMs = 1000, maxRetries = 3 } = options
  const summaries: ArticleSummary[] = []

  for (const item of items) {
    let retries = 0
    let result: SummaryResult | null = null

    while (retries < maxRetries) {
      result = await generateSummary(item, apiKey)

      if (result.article) {
        break
      }

      // 재시도 불가능한 에러(429, 403 등)면 즉시 중단
      if (!result.retryable) {
        console.error(`Non-retryable error for: ${item.title}. Stopping.`)
        return summaries
      }

      retries++
      if (retries < maxRetries) {
        console.log(`Retry ${retries}/${maxRetries} for: ${item.title}`)
        await sleep(delayMs * retries)
      }
    }

    if (result?.article) {
      summaries.push(result.article)
      console.log(`Generated summary for: ${item.title}`)
    } else {
      console.error(`Failed to generate summary for: ${item.title}`)
    }

    // Rate limit 방지를 위한 딜레이
    await sleep(delayMs)
  }

  return summaries
}

/**
 * 지정된 시간만큼 대기한다.
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 아티클을 Markdown 파일 내용으로 변환한다.
 */
export const toMarkdownContent = (article: ArticleSummary, locale: 'ko' | 'en'): string => {
  const content = article.content[locale]
  return `---
id: "${article.id}"
tool: "${article.tool}"
title: "${article.title.replace(/"/g, '\\"')}"
link: "${article.link}"
pubDate: ${article.pubDate.toISOString()}
summary: "${content.summary.replace(/"/g, '\\"')}"
---

${content.details}
`
}

/**
 * 파일명으로 사용할 수 있는 slug를 생성한다.
 */
export const generateSlug = (article: ArticleSummary): string => {
  const dateStr = article.pubDate.toISOString().split('T')[0]
  const titleSlug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)

  return `${dateStr}-${article.tool}-${titleSlug}`
}
