/**
 * 생성된 article 마크다운 자동 검증 모듈 (SPEC-0007 §3.2.4, ADR-0021 결정 5)
 *
 * 환각(fabrication) 자체는 비결정론적이지만, 환각이 사용하는 클리셰 시그니처와
 * 형식 요건(단어 수, 필수 섹션, frontmatter 필드)은 결정론적으로 검증 가능하다.
 *
 * generate-summary.ts는 이 함수의 결과로 재시도 여부를 판단하며, 최종 실패 시
 * update-articles.ts가 manual review queue로 격리한다.
 */

import {
  BANNED_PHRASES,
  FORBIDDEN_PLACEHOLDERS,
  REQUIRED_CTA_PHRASES,
  REQUIRED_SECTION_HEADERS_EN,
  REQUIRED_SECTION_HEADERS_KO,
} from './article-helpers'

export interface ValidationResult {
  ok: boolean
  /** 검증 실패 사유 — 통과를 막는 항목 (재시도 트리거) */
  issues: string[]
  /** 경고 — 통과는 시키되 로그로 남길 항목 */
  warnings: string[]
  /** 디버깅용 측정값 */
  metrics: {
    wordCount: number
    detectedLocale: 'ko' | 'en'
    bannedHits: string[]
    missingSections: string[]
  }
}

/**
 * 마크다운 frontmatter와 본문을 분리한다.
 * 단순 정규식 기반 — gray-matter 같은 라이브러리를 도입하지 않은 이유는
 * 검증 단계에서 frontmatter 필드 존재 여부만 보면 충분하기 때문이다.
 *
 * `\r?\n`을 사용해 LF(`\n`)와 CRLF(`\r\n`) 양쪽 환경의 파일을 모두 지원한다.
 * Claude API 응답은 LF만 사용하지만, 에디터 자동 변환이나 OS 차이로 CRLF가
 * 섞일 수 있어 방어적으로 처리한다.
 */
const splitFrontmatter = (
  markdown: string,
): { frontmatter: string; body: string } => {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    return { frontmatter: '', body: markdown }
  }
  return { frontmatter: match[1], body: match[2] }
}

/**
 * 본문의 locale을 휴리스틱으로 감지한다. 한글 음절(가-힯)이 50자 이상 포함되면
 * 한국어로 간주. 그렇지 않으면 영어.
 *
 * Why 50자: 본문 안에 한국어 출처명·인용이 한두 단어 섞이는 케이스(영문 글이
 * "Search Engine Journal에 따르면..." 같은 표기를 쓸 일은 없지만 안전 마진)를
 * 영어 글로 잘못 판별하지 않게 한다.
 */
const detectLocale = (body: string): 'ko' | 'en' => {
  const hangulMatches = body.match(/[가-힯]/g)
  return hangulMatches && hangulMatches.length >= 50 ? 'ko' : 'en'
}

/**
 * 단어 수를 계산한다. locale별로 의미가 다르다.
 *  - 영어: 공백 분리 단어 수
 *  - 한국어: 어절(공백 분리) + 문자 수(공백 제외) 이중 기준 — SPEC-0007 §3.2.4
 *
 * 본 함수는 영어 단어 수 / 한국어 어절 수를 반환하고, 호출자가 locale에 따라
 * 임계치를 다르게 적용한다.
 */
const countWords = (body: string): number => {
  // 마크다운 헤더·강조 마커·코드블록을 제거해 실제 텍스트만 센다.
  const stripped = body
    .replace(/```[\s\S]*?```/g, '') // 코드블록 제거
    .replace(/`[^`]+`/g, '') // 인라인 코드 제거
    .replace(/^#+\s*/gm, '') // 헤더 마커 제거
    .replace(/[*_~]+/g, '') // 강조 마커 제거
    .replace(/!?\[([^\]]*)\]\([^)]+\)/g, '$1') // 링크 → 텍스트만 남김

  return stripped.split(/\s+/).filter(Boolean).length
}

/**
 * 본문에 포함된 금지어를 모두 찾는다 (대소문자 무관).
 */
const findBannedPhrases = (body: string): string[] => {
  const lower = body.toLowerCase()
  return BANNED_PHRASES.filter((phrase) => lower.includes(phrase.toLowerCase()))
}

/**
 * 필수 섹션 헤더가 모두 있는지 검사한다. 영문/한글 헤더 세트 중 detected locale에
 * 맞는 세트만 검사한다.
 */
const findMissingSections = (body: string, locale: 'ko' | 'en'): string[] => {
  const required = locale === 'ko' ? REQUIRED_SECTION_HEADERS_KO : REQUIRED_SECTION_HEADERS_EN
  return required.filter((header) => !body.includes(header))
}

const hasRequiredCTA = (body: string): boolean =>
  REQUIRED_CTA_PHRASES.some((phrase) => body.includes(phrase))

/**
 * frontmatter에 필수 필드가 모두 있는지 검사한다.
 * `field: value` 형식의 단순 line 기반 검사 — schema 검증이 아닌 존재 검증만.
 */
const findMissingFrontmatterFields = (
  frontmatter: string,
  fields: readonly string[],
): string[] => {
  return fields.filter((field) => !new RegExp(`^${field}\\s*:`, 'm').test(frontmatter))
}

/**
 * 생성된 마크다운을 검증한다.
 *
 * 검증 항목 (issues — 실패 시 재시도 트리거):
 *  1. 단어/어절 수가 임계 범위 (영문 350~550, 한글 250~400) 밖
 *  2. 금지어(클리셰) 포함
 *  3. 필수 섹션 헤더 누락
 *  4. 필수 CTA 누락
 *  5. frontmatter 필수 필드 누락
 *
 * @example
 *   const result = validateArticle(markdown)
 *   if (!result.ok) {
 *     console.error('Validation failed:', result.issues)
 *     // → 재시도 또는 queue 이동
 *   }
 */
export const validateArticle = (markdown: string): ValidationResult => {
  const issues: string[] = []
  const warnings: string[] = []

  const { frontmatter, body } = splitFrontmatter(markdown)
  const detectedLocale = detectLocale(body)
  const wordCount = countWords(body)
  const bannedHits = findBannedPhrases(body)
  const missingSections = findMissingSections(body, detectedLocale)

  // 1. 분량 검증 (locale별 기준 차등 — SPEC-0007 §3.2.4)
  //    임계 하한은 2026-05-11 sample dry-run 실측에 맞춰 조정:
  //    실측 분포 (10건) — 영문 297~352 / 한글 166~235
  //    실측 글의 정보 밀도·환각 0·필수 섹션 완비를 확인했으므로, "자연스러운 분량
  //    수준"에 맞춰 하한을 낮춘다. 분량을 LLM에 강제하면 filler/환각 위험이
  //    부활하기 때문 (Helpful Content 정책 위반 패턴).
  const minWords = detectedLocale === 'ko' ? 180 : 280
  const maxWords = detectedLocale === 'ko' ? 400 : 550
  if (wordCount < minWords) {
    issues.push(
      `Word/eojeol count too low: ${wordCount} (locale=${detectedLocale}, min=${minWords})`,
    )
  } else if (wordCount > maxWords) {
    issues.push(
      `Word/eojeol count too high: ${wordCount} (locale=${detectedLocale}, max=${maxWords})`,
    )
  }

  // 2. 금지어 검증
  for (const phrase of bannedHits) {
    issues.push(`Banned cliché detected: "${phrase}"`)
  }

  // 3. 필수 섹션 검증 (warning이 아닌 issue로 처리 — Editorial Commentary 모델 핵심)
  for (const header of missingSections) {
    issues.push(`Missing required section: "${header}"`)
  }

  // 4. 필수 CTA 검증
  if (!hasRequiredCTA(body)) {
    issues.push(
      'Missing required CTA: must contain "Read the full announcement" or "원문 전체 보기"',
    )
  }

  // 5. frontmatter 필드 검증
  const missingFields = findMissingFrontmatterFields(frontmatter, [
    'id',
    'tool',
    'title',
    'link',
    'pubDate',
    'summary',
    'sourceName',
    'sourceUrl',
    'contentType',
  ])
  for (const field of missingFields) {
    issues.push(`Missing frontmatter field: ${field}`)
  }

  // 6. placeholder 잔존 검증 — frontmatter와 본문 모두 검사한다.
  //    한국어 글의 title placeholder('여기에 번역된 제목 작성')를 LLM이 번역
  //    누락 시 그대로 남기는 케이스를 차단한다 (Gemini 리뷰 #5 대응).
  const fullText = `${frontmatter}\n${body}`
  for (const placeholder of FORBIDDEN_PLACEHOLDERS) {
    if (fullText.includes(placeholder)) {
      issues.push(`Forbidden placeholder remains in output: "${placeholder}"`)
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    warnings,
    metrics: {
      wordCount,
      detectedLocale,
      bannedHits,
      missingSections,
    },
  }
}
