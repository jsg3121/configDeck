/**
 * 입력 문자열의 tsconfig.json을 감지하고 파싱한다.
 *
 * tsconfig.json은 표준 JSON과 다른 점이 있다.
 *   - 주석 허용 (한 줄 및 블록 주석)
 *   - trailing comma 허용
 *   - extends 필드로 다른 tsconfig 참조 가능
 *
 * 본 파서는 codeUtils의 cleanJsonLikeInput으로 주석/trailing comma를 안전하게
 * 제거한 후 JSON.parse에 위임한다. extends가 가리키는 외부 파일은 따라가지 않는다
 * (정적 사이트 아키텍처 + 클라이언트 완결성 원칙). 사용자에게는 audit 결과로
 * "extends된 옵션은 이 진단에 포함되지 않음" 안내가 전달된다.
 *
 * SPEC-0004 §3.2.1 ConfigInspector 인터페이스의 detect/parse 구현체로 사용된다.
 */
import { cleanJsonLikeInput } from './codeUtils'
import type { ConfigFormat } from './types'

/**
 * 파싱된 tsconfig 구조.
 * compilerOptions와 그 외 최상위 키(extends/include/exclude/files/references 등)를 보존한다.
 */
export interface TsconfigJson {
  extends?: string | string[]
  compilerOptions?: Record<string, unknown>
  include?: string[]
  exclude?: string[]
  files?: string[]
  references?: Array<{ path: string }>
  [key: string]: unknown
}

/**
 * 입력 문자열의 형식을 감지한다.
 * tsconfig는 JSON만 지원하므로 "{" 시작 여부만 확인한다.
 * commonjs/esm은 tsconfig 표준이 아니므로 unknown으로 분류한다.
 */
export const detectTsconfigFormat = (input: string): ConfigFormat => {
  const trimmed = input.trim()
  if (trimmed.startsWith('{')) return 'json'
  return 'unknown'
}

/** 입력 문자열을 tsconfig 객체로 파싱한다 */
export const parseTsconfig = (input: string, format: ConfigFormat): TsconfigJson => {
  if (format !== 'json') return {}
  try {
    const cleaned = cleanJsonLikeInput(input)
    const parsed = JSON.parse(cleaned) as TsconfigJson
    return parsed
  } catch {
    return {}
  }
}

/** 입력에 extends 필드가 있는지 코드 차원에서 빠르게 감지 (audit info용) */
export const hasExtendsField = (input: string): boolean => {
  const cleaned = cleanJsonLikeInput(input)
  return /["']extends["']\s*:/.test(cleaned)
}
