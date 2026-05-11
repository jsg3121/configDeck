/**
 * Editorial Commentary 모델 기반 article 생성 모듈
 *
 * SPEC-0007 §3.2.2, ADR-0021 결정 1·2·4·5·6 구현부.
 *
 * 변경 요약 (vs 이전 버전):
 *  - "comprehensive reporter" → "editorial commentary writer" 프롬프트
 *  - 출력 분량: 800자+ long-form → 350~550 단어(영문) / 250~400 어절(한글)
 *  - 섹션 구조: 4섹션 가변 → 3섹션 고정 (What's actually new / What it means
 *    for your config / Recommended next step)
 *  - 입력: RSS description만 → RSS description + 원문 fetch 본문
 *  - 검증: 없음 → validateArticle 기반 자동 검증 + 최대 2회 재시도
 *  - frontmatter: id/tool/title/link/pubDate/summary 6개 →
 *    sourceName, sourceUrl, contentType 3개 추가
 *  - slug: {date}-{tool}-{title 50자} → 도구명·날짜 prefix 제거, 6단어 제한
 */

import type { ArticleTool } from '../src/lib/constants'
import Anthropic from '@anthropic-ai/sdk'

import { getGeneratorUrl, getSourceName } from './article-helpers'
import { fetchArticleContent } from './fetch-article-content'
import type { RSSItem } from './fetch-rss'
import { getToolName } from './fetch-rss'
import { validateArticle, type ValidationResult } from './validate-article'

export interface GeneratedArticle {
  id: string
  tool: ArticleTool
  title: string
  link: string
  pubDate: Date
  locale: 'ko' | 'en'
  markdown: string
}

type Locale = 'ko' | 'en'

const cleanTitle = (title: string): string =>
  title
    .replace(/\s+via\s+@[\w,\s@]+$/i, '')
    .replace(/\s+by\s+@[\w,\s@]+$/i, '')
    .trim()

/**
 * Editorial Commentary 프롬프트를 구성한다 (SPEC-0007 §3.2.2, RES-0006 §3).
 *
 * 핵심 변경: 분량 강제·코드 강제·"comprehensive coverage" 요구를 모두 제거하고,
 * 절대 규칙 5개와 fact-only 정책을 명시한다. 원문 본문(fetched)이 있으면 source
 * excerpt 자리에 그것을 사용하고, 없으면 RSS description으로 fallback.
 */
const buildPrompt = (item: RSSItem, locale: Locale, fetchedContent: string | null): string => {
  const tool = item.tool as ArticleTool
  const toolName = getToolName(tool)
  const isKorean = locale === 'ko'
  const cleanedTitle = cleanTitle(item.title)
  const sourceName = getSourceName(tool, item.link)
  const generatorUrl = getGeneratorUrl(tool, locale)

  const titleValue = isKorean ? '여기에 번역된 제목 작성' : cleanedTitle.replace(/"/g, '\\"')
  const lang = isKorean ? 'Korean (한국어)' : 'English'

  const titleInstruction = isKorean
    ? 'Translate frontmatter `title` into natural Korean. Do not leave English words untranslated unless they are proper nouns (product/library names).'
    : 'Use the original title as-is, lightly edited for natural English only if needed.'

  const sourceExcerpt = fetchedContent
    ? `Full article body (extracted from ${item.link}):
"""
${fetchedContent}
"""`
    : item.description
      ? `Source excerpt (RSS feed):
"""
${item.description}
"""

Note: Only a short RSS excerpt is available — the original page could not be fetched. Keep your commentary high-level and point readers to the original.`
      : 'No source excerpt available. Keep your commentary very short and high-level — direct readers to the original announcement immediately.'

  // 한국어/영어에 따라 본문에 사용할 헤더 텍스트와 CTA 표현을 분기한다.
  // validateArticle에서 이 헤더와 CTA 존재를 검증하므로 정확히 일치해야 한다.
  const sectionsBlock = isKorean
    ? `## 무엇이 새로운가

[원문에서 직접 확인 가능한 사실만. 3~5문장. 부풀리지 말 것. 원문 발췌가 짧다면 이 섹션도 짧게 유지하고 원문으로 안내.]

## 설정 파일에 어떤 의미인가

[ConfigDeck 고유의 가치. 답할 수 있는 정보가 있을 때만 답한다 — 추측 금지.

- ${toolName} 설정 파일 작성 방식이 달라지는가?
- 마이그레이션이 필요한가? 경로는?
- 관련 설정과 상호작용하는가? (예: ESLint+Prettier, TS+Next)
- 설정 작성자가 주의해야 할 breaking change가 있는가?

답이 불충분하면 솔직하게: "원문에서 기존 설정과의 상호작용은 아직 자세히 다루지 않았다 — 공식 문서가 나오면 다시 정리하겠다." 추측으로 채우지 말 것.]

## 다음 단계 제안

[독자가 지금 할 만한 실용적인 다음 단계 1문단.${
        generatorUrl
          ? ` 자연스럽게 어울릴 때만 ConfigDeck 도구를 인라인 링크로 연결:\n  - 새 ${toolName} 설정 필요 → [${toolName} 설정 생성](${generatorUrl})`
          : ' ConfigDeck Generator 매핑이 없는 도구이므로 본문 내 도구 링크는 생략한다. 강제 CTA는 오히려 신뢰도를 깎는다.'
      }]

---

**원문 전체 보기**: [${cleanedTitle}](${item.link}) ([${sourceName}](${item.link}))`
    : `## What's actually new

[Stick strictly to facts present in the source. 3-5 sentences. Do not embellish. If the source excerpt is limited, keep this section short and point readers to the original.]

## What it means for your config

[ConfigDeck-unique value. Address these only when you can answer concretely — never guess:

- Does this change how config files for ${toolName} should be written?
- Is a migration needed? What's the path?
- Does it interact with related configs (e.g., ESLint+Prettier, TS+Next)?
- Are there breaking changes config writers should watch for?

If the source doesn't give enough info, say so honestly: "The announcement doesn't yet detail interaction with existing configs — we'll revisit once the docs land." Do NOT invent answers to fill the section.]

## Recommended next step

[One paragraph of practical guidance.${
        generatorUrl
          ? ` Inline link a ConfigDeck tool only when it genuinely helps:\n  - For new ${toolName} config → [Generate a ${toolName} config](${generatorUrl})`
          : ' This tool is not mapped to a ConfigDeck Generator, so omit ConfigDeck tool links entirely. Forced CTAs hurt credibility.'
      }]

---

**Read the full announcement on ${sourceName}** → [${cleanedTitle}](${item.link})`

  const wordRangeNote = isKorean
    ? 'Total length: 250~400 한국어 어절 (eojeol — words separated by spaces). Cut filler. Every sentence must add information beyond the headline.'
    : 'Total length: 350~550 words. Cut filler. Every sentence must add information beyond the headline.'

  return `You are an editor for ConfigDeck, a developer tooling site. You write SHORT EDITORIAL COMMENTARY on third-party announcements — you do NOT rewrite, paraphrase, or "comprehensively cover" the original article.

Think of yourself as a senior dev writing a 4-minute newsletter blurb: honest, specific, value-adding. Not a content farm.

# Absolute rules (violating these = task failure)

## Rule 1: You comment, you don't report
The original article is the source of truth. ConfigDeck's role is to add a developer-tooling perspective on top. If a reader wants the full story, they click through to the original — and that's the desired outcome.

## Rule 2: NEVER fabricate specifics
If a specific number, version, config option, command, or feature is NOT in the source material below, DO NOT mention it. Omission is always safer than invention.

Examples of forbidden fabrication:
- Performance numbers ("40-60% faster") unless quoted from the source
- Config options or compiler flags unless verifiably documented
- Migration commands you're not 100% sure are real
- Version numbers or release dates not in the source

When you don't have specifics, write at a higher level:
"The announcement details performance improvements; see the original for benchmarks."

## Rule 3: Banned clichés (rewrite if any appear)
English: groundbreaking, revolutionary, transformative, game-changing, "fundamentally changes", "represents a significant shift", "developers need to understand", "in today's rapidly evolving", "critical takeaways include", "paradigm shift".

Korean equivalents: 획기적, 혁신적, "근본적으로 바꾸~", "주목해야 할", "반드시 알아야~", "급변하는 시대", "주요 시사점".

## Rule 4: No fabricated code blocks
Include a code example ONLY if you can write something definitively correct from documented behavior. When in doubt, omit. A short article without code is much better than a long article with broken code.

## Rule 5: Length
${wordRangeNote}

# Source material

- Topic/tool: ${toolName}
- Original publication: ${sourceName}
- Original title: ${cleanedTitle}
- Original URL: ${item.link}

${sourceExcerpt}

# Output language
Write the article body in ${lang}.
${titleInstruction}

# Output structure

Output ONLY the markdown document below. No preamble, no explanation.

\`\`\`markdown
---
id: "${item.id}"
tool: "${item.tool}"
title: "${titleValue}"
link: "${item.link}"
pubDate: ${item.pubDate.toISOString()}
sourceName: "${sourceName}"
sourceUrl: "${item.link}"
contentType: "commentary"
summary: "[1-2 sentences. Factual. No hype. No clichés. ${isKorean ? 'Korean.' : 'English.'}]"
---

[Opening — 2 sentences. State what was announced, factually. Name the source: ${sourceName}.]

${sectionsBlock}
\`\`\`

# Self-check before outputting

Run through this mentally:
1. Did I invent any specific number, option, or command not in the source? (If yes — remove)
2. Did I use any banned cliché? (If yes — rewrite that sentence)
3. Is my "What it means for your config" section adding something the source doesn't say? (If no — keep it short and honest)
4. Is the "Read the full announcement"${isKorean ? ' / "원문 전체 보기"' : ''} link prominent? (Must be the last line of the body)
5. Are all three required section headers present exactly as specified above?
6. Total length within range?

Output the markdown now. Nothing else.`
}

interface APICallResult {
  success: boolean
  markdown: string | null
  retryable: boolean
}

/**
 * Claude API를 호출해 마크다운을 생성한다.
 * 응답에 코드펜스(```markdown ... ```)가 있으면 제거한다.
 */
const callClaudeAPI = async (client: Anthropic, prompt: string): Promise<APICallResult> => {
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return { success: false, markdown: null, retryable: true }
    }

    let markdown = textBlock.text.trim()

    // 모델이 ```markdown ... ``` 코드펜스로 감싸 응답하는 케이스 정규화.
    // CRLF/LF 양쪽 지원을 위해 `\r?\n` 사용.
    // ^/$ 앵커를 유지하는 이유: 응답 전체가 코드펜스로 감싸진 경우만 매칭한다.
    // 앵커를 제거하면 본문 안에 ``` 코드블록이 있는 경우(드물지만 가능) 오매칭
    // 위험이 있다. 프롬프트가 "Output ONLY the markdown"을 명시하므로 앞뒤
    // 설명 텍스트 케이스는 발생 가능성이 낮다.
    const fencedMatch = markdown.match(/^```(?:markdown)?\s*\r?\n([\s\S]*?)\r?\n```\s*$/)
    if (fencedMatch) {
      markdown = fencedMatch[1].trim()
    }

    if (!markdown.startsWith('---') || !markdown.includes('summary:')) {
      return { success: false, markdown: null, retryable: true }
    }

    return { success: true, markdown, retryable: false }
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      const nonRetryable = [429, 401, 403].includes(error.status)
      return { success: false, markdown: null, retryable: !nonRetryable }
    }
    return { success: false, markdown: null, retryable: true }
  }
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export interface GenerationOutcome {
  /** 검증 통과한 결과 (성공 시에만 채워짐) */
  article: GeneratedArticle | null
  /** 마지막 시도의 마크다운 (성공/실패 모두) — review queue 적재용 */
  lastMarkdown: string | null
  /** 마지막 시도의 검증 결과 (queue용 진단 자료) */
  lastValidation: ValidationResult | null
  /** 실패 사유 (성공 시 undefined) */
  reason?: string
}

/**
 * 단일 (item, locale) 조합에 대해 article을 생성한다.
 * 원문 fetch → 프롬프트 구성 → API 호출 → 검증의 시퀀스를 maxRetries만큼 반복한다.
 *
 * 비검증 에러(타임아웃·5xx·HTTP 401/403/429)는 retryable 판단에 따라 재시도하고,
 * 검증 실패(클리셰·분량·필수 섹션 누락 등)도 동일하게 재시도한다.
 * 모든 재시도가 실패하면 마지막 결과물(생성에 성공했다면)을 outcome에 담아
 * 호출자가 review queue로 보낼 수 있게 한다.
 */
export const generateOneArticle = async (
  item: RSSItem,
  locale: Locale,
  client: Anthropic,
  options: { maxRetries?: number; delayMs?: number } = {},
): Promise<GenerationOutcome> => {
  const { maxRetries = 2, delayMs = 1000 } = options
  let lastMarkdown: string | null = null
  let lastValidation: ValidationResult | null = null

  // 원문 fetch는 반복 시도 사이에 결과가 바뀌지 않으므로 루프 바깥에서 1회만 수행.
  const fetchResult = await fetchArticleContent(item.link)
  if (!fetchResult.ok) {
    console.warn(
      `[fetch] ${item.tool}/${locale} fallback to description: ${fetchResult.reason ?? 'unknown'}`,
    )
  }

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    const prompt = buildPrompt(item, locale, fetchResult.ok ? fetchResult.content : null)
    const apiResult = await callClaudeAPI(client, prompt)

    if (!apiResult.success || !apiResult.markdown) {
      if (!apiResult.retryable) {
        return {
          article: null,
          lastMarkdown: null,
          lastValidation: null,
          reason: 'API call failed (non-retryable)',
        }
      }
      if (attempt > maxRetries) {
        return {
          article: null,
          lastMarkdown: null,
          lastValidation: null,
          reason: `API call failed after ${maxRetries} retries`,
        }
      }
      await sleep(delayMs * attempt)
      continue
    }

    lastMarkdown = apiResult.markdown
    lastValidation = validateArticle(apiResult.markdown)

    if (lastValidation.ok) {
      return {
        article: {
          id: item.id,
          tool: item.tool as ArticleTool,
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          locale,
          markdown: apiResult.markdown,
        },
        lastMarkdown,
        lastValidation,
      }
    }

    console.warn(
      `[validate] ${item.tool}/${locale} attempt ${attempt} failed: ${lastValidation.issues.join('; ')}`,
    )
    if (attempt <= maxRetries) {
      await sleep(delayMs * attempt)
    }
  }

  return {
    article: null,
    lastMarkdown,
    lastValidation,
    reason: `Validation failed after ${maxRetries} retries`,
  }
}

/**
 * 여러 RSSItem에 대해 한국어/영어 article을 모두 생성한다.
 * 검증 실패한 결과물은 outcome 형태로 별도 반환되어 호출자가 review queue로 처리한다.
 */
export const generateArticles = async (
  items: RSSItem[],
  apiKey: string,
  options: { delayMs?: number; maxRetries?: number } = {},
): Promise<{
  articles: GeneratedArticle[]
  failures: Array<{ item: RSSItem; locale: Locale; outcome: GenerationOutcome }>
}> => {
  const { delayMs = 1000, maxRetries = 2 } = options
  const client = new Anthropic({ apiKey })
  const articles: GeneratedArticle[] = []
  const failures: Array<{ item: RSSItem; locale: Locale; outcome: GenerationOutcome }> = []
  const locales: Locale[] = ['ko', 'en']

  for (const item of items) {
    for (const locale of locales) {
      const outcome = await generateOneArticle(item, locale, client, { delayMs, maxRetries })

      if (outcome.article) {
        articles.push(outcome.article)
        console.log(`Generated: ${item.title} (${locale})`)
      } else {
        failures.push({ item, locale, outcome })
        console.error(`Failed: ${item.title} (${locale}) — ${outcome.reason ?? 'unknown'}`)
      }

      await sleep(delayMs)
    }
  }

  return { articles, failures }
}

/**
 * 새 slug 생성 로직 (SPEC-0007 §3.2.6, ADR-0021 결정 6).
 *
 * 변경 요약:
 *  - 날짜 prefix 제거 (frontmatter pubDate가 권위 있는 출처)
 *  - 도구명 prefix 제거 (URL 경로의 [tool]이 이미 있음)
 *  - 최대 6단어, 앞뒤 하이픈 제거
 *
 * @example
 *   generateSlug({ title: 'Announcing TypeScript 7.0 Beta', ... }) // → 'announcing-typescript-7-0-beta'
 */
export const generateSlug = (article: GeneratedArticle): string => {
  return article.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .filter(Boolean)
    .slice(0, 6)
    .join('-')
}
