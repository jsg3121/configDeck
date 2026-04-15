/**
 * Claude API를 사용한 아티클 요약 생성 스크립트
 *
 * RSS에서 수집한 아티클의 원문을 분석하여
 * 한국어/영어 요약을 생성한다.
 */

import Anthropic from '@anthropic-ai/sdk'

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

  return `당신은 개발자 커뮤니티에서 인정받는 시니어 기술 에디터입니다. ${toolName} 관련 소식을 심층 분석하여 개발자들이 실무에 즉시 활용할 수 있는 풍부하고 상세한 콘텐츠를 작성해주세요.

## 원문 정보
- 제목: ${item.title}
- 도구: ${toolName}
- 링크: ${item.link}
${item.description ? `- 원문 발췌: ${item.description}` : ''}

## 콘텐츠 작성 요구사항

### summary (카드 미리보기용)
- 2-3문장으로 "이 글을 왜 읽어야 하는지" 전달
- 마크다운 문법 사용 금지
- 버전 번호, 핵심 기능명 등 구체적 정보 포함

### details (본문) - 중요!

**분량 요구사항:**
- 최소 800자 이상의 충실한 콘텐츠 작성
- 4개 이상의 섹션(## 헤딩)으로 구성
- 각 섹션마다 구체적인 설명과 예시 포함

**마크다운 형식 (반드시 준수):**
- 모든 ## 헤딩 앞뒤에 빈 줄(\\n\\n) 필수
- 문단과 문단 사이에 빈 줄(\\n\\n) 필수
- 리스트 앞뒤에 빈 줄(\\n\\n) 필수
- 코드블록 앞뒤에 빈 줄(\\n\\n) 필수

**콘텐츠 구성:**
- 섹션 제목은 \`## 제목\` 형식 사용
- 핵심 키워드, 버전, 기능명은 **볼드** 처리
- 코드, 명령어, 파일명, 패키지명은 \`백틱\` 사용
- 3개 이상 항목은 bullet list(\`-\`) 사용
- 코드 예시는 \`\`\`언어명 으로 시작하고 \`\`\`로 닫기

**필수 포함 내용 (해당되는 경우):**
- 주요 변경사항/기능 상세 설명
- 실제 사용 예시 코드
- 업그레이드/마이그레이션 명령어
- Breaking Changes 및 주의사항
- 개발자에게 미치는 영향과 권장 조치
- 관련 생태계나 다른 도구와의 연관성

**콘텐츠 유형별 필수 섹션:**
- **릴리스**: 개요 → 주요 변경사항(각각 상세히) → Breaking Changes → 업그레이드 방법 → 결론
- **공지/발표**: 배경 설명 → 주요 내용 → 개발자 영향 → 대응 방법 → 결론
- **보안**: 취약점 개요 → 영향 범위 → 즉시 조치사항 → 장기 대응 → 결론
- **튜토리얼/가이드**: 개요 → 핵심 개념 → 사용 방법(코드 포함) → 주의사항 → 결론

## 응답 형식
아래 JSON 형식으로만 응답하세요. details 필드의 마크다운에서 줄바꿈은 \\n으로 표현하세요:
{
  "ko": {
    "summary": "한국어 요약 (2-3문장)",
    "details": "## 섹션1\\n\\n내용...\\n\\n## 섹션2\\n\\n내용..."
  },
  "en": {
    "summary": "English summary (2-3 sentences)",
    "details": "## Section1\\n\\nContent...\\n\\n## Section2\\n\\nContent..."
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
 * Claude API를 호출하여 아티클 콘텐츠를 생성한다.
 */
const callClaudeAPI = async (
  client: Anthropic,
  prompt: string,
): Promise<APICallResult> => {
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      // TODO: 모델 deprecation 시 'claude-sonnet-4-6' 등으로 교체
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
      return { success: false, data: null, retryable: true }
    }

    const text = textBlock.text

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
    console.error('Error calling Claude API:', error)

    // Rate limit 또는 인증 에러는 재시도 불가
    if (error instanceof Anthropic.APIError) {
      const nonRetryable = [429, 401, 403].includes(error.status)
      return { success: false, data: null, retryable: !nonRetryable }
    }

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
export const generateSummary = async (
  item: RSSItem,
  client: Anthropic,
): Promise<SummaryResult> => {
  const prompt = buildPrompt(item)
  const result = await callClaudeAPI(client, prompt)

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
  const client = new Anthropic({ apiKey })
  const summaries: ArticleSummary[] = []

  for (const item of items) {
    let retries = 0
    let result: SummaryResult | null = null

    while (retries < maxRetries) {
      result = await generateSummary(item, client)

      if (result.article) {
        break
      }

      // 재시도 불가능한 에러(429, 403 등)면 즉시 중단
      if (!result.retryable) {
        // eslint-disable-next-line no-console
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
