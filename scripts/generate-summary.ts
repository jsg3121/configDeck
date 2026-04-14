/**
 * Gemini API를 사용한 아티클 요약 생성 스크립트
 *
 * RSS에서 수집한 아티클의 원문을 분석하여
 * 한국어/영어 요약을 생성한다.
 */

import type { RSSItem, Tool } from './fetch-rss'
import { getToolName } from './fetch-rss'

export interface ArticleSummary {
  id: string
  tool: Tool
  title: string
  link: string
  pubDate: Date
  summary: {
    ko: string
    en: string
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
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

/**
 * 요약 생성을 위한 프롬프트를 구성한다.
 */
const buildPrompt = (item: RSSItem): string => {
  const toolName = getToolName(item.tool)

  return `다음 ${toolName} 관련 개발 도구 업데이트 공지를 읽고, 개발자에게 중요한 점을 요약해주세요.

제목: ${item.title}
${item.description ? `내용: ${item.description}` : ''}

요약 작성 가이드라인:
- 주요 변경사항이 무엇인지
- 기존 사용자에게 어떤 영향이 있는지
- 마이그레이션이 필요한지 (해당되는 경우)

반드시 아래 JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요:
{
  "ko": "한국어 요약 (2-3문장)",
  "en": "English summary (2-3 sentences)"
}`
}

/**
 * Gemini API를 호출하여 요약을 생성한다.
 */
const callGeminiAPI = async (
  prompt: string,
  apiKey: string,
): Promise<{ ko: string; en: string } | null> => {
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
          maxOutputTokens: 500,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini API error: ${response.status} - ${errorText}`)
      return null
    }

    const data = (await response.json()) as GeminiResponse

    if (data.error) {
      console.error(`Gemini API error: ${data.error.message}`)
      return null
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      console.error('No text in Gemini response')
      return null
    }

    // JSON 파싱 시도
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON found in response:', text)
      return null
    }

    const parsed = JSON.parse(jsonMatch[0]) as { ko: string; en: string }

    if (!parsed.ko || !parsed.en) {
      console.error('Invalid summary format:', parsed)
      return null
    }

    return parsed
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    return null
  }
}

/**
 * 단일 아티클의 요약을 생성한다.
 */
export const generateSummary = async (
  item: RSSItem,
  apiKey: string,
): Promise<ArticleSummary | null> => {
  const prompt = buildPrompt(item)
  const summary = await callGeminiAPI(prompt, apiKey)

  if (!summary) {
    return null
  }

  return {
    id: item.id,
    tool: item.tool,
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    summary,
  }
}

/**
 * 여러 아티클의 요약을 생성한다.
 * Rate limit을 고려하여 순차적으로 처리한다.
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
    let summary: ArticleSummary | null = null

    while (retries < maxRetries && !summary) {
      summary = await generateSummary(item, apiKey)

      if (!summary) {
        retries++
        if (retries < maxRetries) {
          console.log(`Retry ${retries}/${maxRetries} for: ${item.title}`)
          await sleep(delayMs * retries) // Exponential backoff
        }
      }
    }

    if (summary) {
      summaries.push(summary)
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
 * 아티클 요약을 Markdown 파일 내용으로 변환한다.
 */
export const toMarkdownContent = (article: ArticleSummary, locale: 'ko' | 'en'): string => {
  const toolName = getToolName(article.tool)
  const dateStr = article.pubDate.toISOString().split('T')[0]

  return `---
id: "${article.id}"
tool: "${article.tool}"
title: "${article.title.replace(/"/g, '\\"')}"
link: "${article.link}"
pubDate: ${article.pubDate.toISOString()}
---

${article.summary[locale]}
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
