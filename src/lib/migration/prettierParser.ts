/**
 * 입력 문자열의 Prettier 설정 형식을 감지하고 파싱한다.
 *
 * 지원 입력:
 *   - .prettierrc / .prettierrc.json (JSON)
 *   - .prettierrc.js / .prettierrc.cjs (CommonJS)
 *   - .prettierrc.mjs / prettier.config.mjs (ESM)
 *
 * SPEC-0004 §3.2.1 ConfigInspector 인터페이스의 detect/parse 구현체로 사용된다.
 *
 * 주석 제거/식별자 키 변환은 codeUtils의 문자열-안전 구현을 사용한다.
 * (Gemini PR #32 코멘트 반영 — 1.4.0)
 */
import { cleanJsonLikeInput, jsObjectToJson } from './codeUtils'
import type { ConfigFormat } from './types'

/** 파싱된 Prettier 설정 구조 — 옵션 키는 자유롭게 보존한다 */
export interface PrettierConfig {
  [key: string]: unknown
}

/**
 * 입력 문자열의 Prettier 설정 형식을 감지한다.
 * ESLint의 detectConfigFormat과 동일한 휴리스틱을 사용한다.
 */
export const detectPrettierFormat = (input: string): ConfigFormat => {
  const trimmedInput = input.trim()
  if (trimmedInput.startsWith('{')) return 'json'
  if (trimmedInput.includes('module.exports')) return 'commonjs'
  if (trimmedInput.includes('export default')) return 'esm'
  return 'unknown'
}

/** JSON 형식의 Prettier 설정을 파싱한다 */
const parseJsonConfig = (input: string): PrettierConfig => {
  const cleaned = cleanJsonLikeInput(input)
  const parsed = JSON.parse(cleaned) as Record<string, unknown>
  return parsed
}

/** CommonJS 형식에서 객체 리터럴을 추출하여 파싱한다 */
const parseCommonJsConfig = (input: string): PrettierConfig => {
  const objectMatch = input.match(/module\.exports\s*=\s*(\{[\s\S]*\})/)
  if (!objectMatch?.[1]) return {}
  const cleaned = jsObjectToJson(cleanJsonLikeInput(objectMatch[1]))
  try {
    return parseJsonConfig(cleaned)
  } catch {
    return {}
  }
}

/** ESM 형식에서 객체 리터럴을 추출하여 파싱한다 */
const parseEsmConfig = (input: string): PrettierConfig => {
  const objectMatch = input.match(/export\s+default\s+(\{[\s\S]*\})/)
  if (!objectMatch?.[1]) return {}
  const cleaned = jsObjectToJson(cleanJsonLikeInput(objectMatch[1]))
  try {
    return parseJsonConfig(cleaned)
  } catch {
    return {}
  }
}

/** 입력 문자열을 형식에 따라 파싱하여 Prettier 설정을 반환한다 */
export const parsePrettierConfig = (input: string, format: ConfigFormat): PrettierConfig => {
  switch (format) {
    case 'json':
      return parseJsonConfig(input)
    case 'commonjs':
      return parseCommonJsConfig(input)
    case 'esm':
      return parseEsmConfig(input)
    default:
      return {}
  }
}
