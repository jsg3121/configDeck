/**
 * Article 생성 파이프라인 보조 헬퍼 (SPEC-0007 §3.2.3, ADR-0021)
 *
 * Editorial Commentary 프롬프트에서 참조하는 출처명·Generator URL 매핑 로직을
 * 한 곳에 모은다. 매핑 자체는 src/lib/constants.ts에서 단일 소스로 관리하며,
 * 이 파일은 그 매핑을 안전하게 조회하는 헬퍼만 제공한다.
 */

import {
  SOURCE_NAME_MAP,
  TOOL_TO_GENERATOR,
  type ArticleTool,
} from '../src/lib/constants'

type Locale = 'ko' | 'en'

/**
 * 도구 식별자와 원문 URL을 받아 사람이 읽는 출처명을 반환한다.
 * 매핑에 없는 경우(이론상 발생 안 하나 안전망) URL hostname을 fallback으로 사용한다.
 */
export const getSourceName = (tool: ArticleTool, link: string): string => {
  const mapped = SOURCE_NAME_MAP[tool]
  if (mapped) return mapped

  try {
    return new URL(link).hostname.replace(/^www\./, '')
  } catch {
    return tool
  }
}

/**
 * 도구 식별자와 locale을 받아 ConfigDeck Generator 경로를 반환한다.
 * Generator가 없는 도구(매체명 카테고리 등)는 null을 반환하며, 프롬프트는 이 경우
 * CTA를 강제로 삽입하지 않도록 분기한다.
 *
 * @example
 *   getGeneratorUrl('typescript', 'en') // → '/en/generator/tsconfig'
 *   getGeneratorUrl('csstricks', 'ko')  // → null
 */
export const getGeneratorUrl = (tool: ArticleTool, locale: Locale): string | null => {
  const path = TOOL_TO_GENERATOR[tool]
  return path ? `/${locale}/generator/${path}` : null
}

/**
 * AI 생성 글에서 자주 등장하는 클리셰·과장 표현 목록 (SPEC-0007 §3.2.4, RES-0006 §3 Rule 3).
 *
 * 검증 단계에서 이 목록에 해당하는 문구가 발견되면 재생성을 트리거한다.
 * 출처 표기·인용 등에 자연스럽게 들어가야 하는 표현은 의도적으로 제외했다.
 *
 * 대소문자 무관 검사를 가정하므로 모두 소문자로 정의한다. 한국어는 소문자 개념이
 * 없으므로 그대로.
 */
export const BANNED_PHRASES: readonly string[] = [
  // English — 과장/클리셰
  'groundbreaking',
  'revolutionary',
  'transformative',
  'game-changing',
  'game changing',
  'fundamentally changes',
  'represents a significant shift',
  'developers need to understand',
  'in today\'s rapidly evolving',
  'critical takeaways include',
  'paradigm shift',
  // Korean — 동등 표현
  '획기적',
  '혁신적',
  '근본적으로 바꾸',
  '주목해야 할',
  '반드시 알아야',
  '급변하는 시대',
  '주요 시사점',
] as const

/**
 * 자동 검증/프롬프트에서 공통으로 사용하는 필수 문자열 (영문/한글 각 1종).
 *
 * 두 표현 중 하나라도 본문에 포함되어 있으면 CTA가 있는 것으로 간주한다.
 */
export const REQUIRED_CTA_PHRASES: readonly string[] = [
  'Read the full announcement',
  '원문 전체 보기',
] as const

/**
 * 필수 섹션 헤더 (3섹션 고정). 영문 글은 영문 헤더, 한글 글은 한글 헤더를 가진다.
 * 검증 단계에서 글 안에 두 세트 중 한 세트의 헤더가 모두 있으면 통과.
 */
export const REQUIRED_SECTION_HEADERS_EN: readonly string[] = [
  "## What's actually new",
  '## What it means for your config',
  '## Recommended next step',
] as const

export const REQUIRED_SECTION_HEADERS_KO: readonly string[] = [
  '## 무엇이 새로운가',
  '## 설정 파일에 어떤 의미인가',
  '## 다음 단계 제안',
] as const

/**
 * frontmatter 또는 본문에 절대 그대로 나타나면 안 되는 placeholder 문자열.
 *
 * generate-summary의 buildPrompt는 한국어 글의 frontmatter title 자리에
 * '여기에 번역된 제목 작성'을 placeholder로 넣고 LLM이 번역하도록 유도한다.
 * 만약 LLM이 지시를 누락해 placeholder를 그대로 반환하면, 검증에서 차단해
 * 잘못된 글이 사이트에 노출되지 않도록 한다.
 *
 * 프롬프트의 placeholder 표현이 바뀌면 이 목록도 함께 갱신해야 한다.
 */
export const FORBIDDEN_PLACEHOLDERS: readonly string[] = [
  '여기에 번역된 제목 작성',
  '여기에 요약 작성',
  '여기에', // 안전망 — 새 placeholder가 "여기에 X"로 추가되더라도 잡아냄
] as const
