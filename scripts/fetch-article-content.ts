/**
 * 원문 페이지 본문 추출 모듈 (SPEC-0007 §3.2.1, ADR-0021 결정 4)
 *
 * RSS feed의 description은 보통 1~2문장에 불과해 LLM 입력으로 부족하다.
 * 이 모듈은 원문 URL을 HTTP fetch하여 Mozilla Readability로 본문 텍스트를
 * 추출한다. 추출된 텍스트는 generate-summary.ts의 buildPrompt에 함께 전달되어
 * 환각(fabrication) 가능성을 줄인다.
 *
 * 실패 케이스(페이월/JS 렌더링/타임아웃/HTTP 4xx-5xx)는 ok=false로 반환하며,
 * generate-summary.ts는 description-only fallback으로 동작한다.
 */

import { Readability } from '@mozilla/readability'
import { JSDOM, VirtualConsole } from 'jsdom'

export interface FetchResult {
  ok: boolean
  content: string | null
  /** 실패 시 사유 (디버깅/모니터링용) */
  reason?: string
  /** 성공 시 메타데이터 */
  title?: string
  /** 추출된 본문 길이 (절단 전) */
  rawLength?: number
}

interface FetchOptions {
  /** 본문 최대 길이 (기본 8000자). LLM 토큰 비용 통제. */
  maxLength?: number
  /** HTTP 타임아웃 (기본 10초) */
  timeoutMs?: number
  /** User-Agent (기본값으로 ConfigDeck 식별자 사용) */
  userAgent?: string
}

const DEFAULT_MAX_LENGTH = 8000
const DEFAULT_TIMEOUT_MS = 10_000
const DEFAULT_USER_AGENT = 'ConfigDeck Article Fetcher/1.0 (+https://configdeck.dev)'

/**
 * 단일 원문 URL에서 본문 텍스트를 추출한다.
 *
 * @example
 * const result = await fetchArticleContent('https://devblogs.microsoft.com/typescript/...')
 * if (result.ok) {
 *   console.log(result.content) // 본문 텍스트 (최대 8000자)
 * } else {
 *   console.warn(result.reason) // 실패 사유
 * }
 */
export const fetchArticleContent = async (
  url: string,
  options: FetchOptions = {},
): Promise<FetchResult> => {
  const {
    maxLength = DEFAULT_MAX_LENGTH,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    userAgent = DEFAULT_USER_AGENT,
  } = options

  // 1. HTTP GET
  let html: string
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
      redirect: 'follow',
    })
    clearTimeout(timeout)

    if (!response.ok) {
      return {
        ok: false,
        content: null,
        reason: `HTTP ${response.status} ${response.statusText}`,
      }
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.toLowerCase().includes('html')) {
      return {
        ok: false,
        content: null,
        reason: `Non-HTML content-type: ${contentType}`,
      }
    }

    html = await response.text()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      ok: false,
      content: null,
      reason: `Fetch error: ${message}`,
    }
  }

  // 2. JSDOM으로 DOM 트리 구성
  //    jsdom이 외부 리소스(CSS/script)를 로드하려다 발생시키는 콘솔 노이즈를 차단한다.
  let dom: JSDOM
  try {
    const virtualConsole = new VirtualConsole()
    virtualConsole.on('error', () => {
      // jsdom의 리소스 로딩 에러는 본문 추출과 무관하므로 무시
    })

    dom = new JSDOM(html, {
      url,
      virtualConsole,
      // pretendToBeVisual은 일부 사이트의 layout 측정 코드를 위해 필요할 수 있다.
      pretendToBeVisual: true,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      ok: false,
      content: null,
      reason: `JSDOM parse error: ${message}`,
    }
  }

  // 3. Readability로 본문 추출
  try {
    const reader = new Readability(dom.window.document)
    const article = reader.parse()

    if (!article || !article.textContent) {
      return {
        ok: false,
        content: null,
        reason: 'Readability could not extract article content',
      }
    }

    const rawText = article.textContent.trim()
    const rawLength = rawText.length

    // 너무 짧은 추출은 본문이 아닐 가능성이 높다 (네비게이션/푸터만 추출된 경우 등).
    // 200자 미만이면 fetch 실패로 간주해 description-only fallback을 유도한다.
    if (rawLength < 200) {
      return {
        ok: false,
        content: null,
        reason: `Extracted content too short: ${rawLength} chars`,
        rawLength,
      }
    }

    // 길이 제한 (LLM 토큰 비용 통제)
    const content = rawLength > maxLength ? rawText.slice(0, maxLength) : rawText

    return {
      ok: true,
      content,
      title: article.title ?? undefined,
      rawLength,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      ok: false,
      content: null,
      reason: `Readability error: ${message}`,
    }
  } finally {
    // JSDOM은 명시적으로 window를 닫지 않으면 메모리 누수가 발생할 수 있다.
    dom.window.close()
  }
}
