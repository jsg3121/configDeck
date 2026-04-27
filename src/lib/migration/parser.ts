/**
 * 입력 문자열의 ESLint 설정 형식을 감지하고 파싱한다.
 */

/** 감지 가능한 설정 형식 */
export type ConfigFormat = 'json' | 'commonjs' | 'esm' | 'unknown'

/** 파싱된 레거시 ESLint 설정 구조 */
export interface LegacyEslintConfig {
  extends?: string[]
  plugins?: string[]
  rules?: Record<string, unknown>
  env?: Record<string, boolean>
  parserOptions?: Record<string, unknown>
  parser?: string
}

/** 입력 문자열의 ESLint 설정 형식을 감지한다 */
export const detectConfigFormat = (input: string): ConfigFormat => {
  const trimmedInput = input.trim()
  if (trimmedInput.startsWith('{')) return 'json'
  if (trimmedInput.includes('module.exports')) return 'commonjs'
  if (trimmedInput.includes('export default')) return 'esm'
  return 'unknown'
}

/** JSON-like 문자열을 정규 JSON으로 정리한다 (trailing comma, 주석 제거) */
const cleanJsonInput = (input: string): string => {
  return input
    .replace(/\/\/.*$/gm, '') // 한 줄 주석 제거
    .replace(/\/\*[\s\S]*?\*\//g, '') // 블록 주석 제거
    .replace(/,(\s*[}\]])/g, '$1') // trailing comma 제거
}

/** JSON 형식의 레거시 ESLint 설정을 파싱한다 */
const parseJsonConfig = (input: string): LegacyEslintConfig => {
  const cleaned = cleanJsonInput(input)
  const parsed = JSON.parse(cleaned) as Record<string, unknown>
  return {
    extends: normalizeStringOrArray(parsed.extends),
    plugins: normalizeStringOrArray(parsed.plugins),
    rules: (parsed.rules as Record<string, unknown>) ?? undefined,
    env: (parsed.env as Record<string, boolean>) ?? undefined,
    parserOptions: (parsed.parserOptions as Record<string, unknown>) ?? undefined,
    parser: typeof parsed.parser === 'string' ? parsed.parser : undefined,
  }
}

/**
 * JS 객체 리터럴을 JSON 호환 문자열로 변환한다.
 * - 작은따옴표 문자열 → 큰따옴표 문자열
 * - 따옴표 없는 객체 키 → 큰따옴표 키
 * - 하이픈 포함 키(예: 'no-console')도 따옴표가 이미 있으면 그대로 변환
 */
const jsObjectToJson = (input: string): string => {
  // 1단계: 작은따옴표로 감싼 문자열을 큰따옴표로 변환
  // (이스케이프된 작은따옴표는 유지)
  const singleQuoteToDouble = input.replace(/'((?:\\'|[^'])*)'/g, (_, content) => {
    const escaped = (content as string).replace(/"/g, '\\"').replace(/\\'/g, "'")
    return `"${escaped}"`
  })

  // 2단계: 따옴표 없는 객체 키에 따옴표 추가 (식별자: 패턴)
  // 이미 따옴표가 있는 키는 변환하지 않는다
  return singleQuoteToDouble.replace(/([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:/g, '$1"$2":')
}

/** CommonJS 형식에서 객체 리터럴을 추출하여 파싱한다 */
const parseCommonJsConfig = (input: string): LegacyEslintConfig => {
  const objectMatch = input.match(/module\.exports\s*=\s*(\{[\s\S]*\})/)
  if (!objectMatch?.[1]) return {}

  const cleaned = jsObjectToJson(cleanJsonInput(objectMatch[1]))

  try {
    return parseJsonConfig(cleaned)
  } catch {
    return {}
  }
}

/** 문자열 또는 문자열 배열을 배열로 정규화한다 */
const normalizeStringOrArray = (value: unknown): string[] | undefined => {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  return undefined
}

/** 입력 문자열을 형식에 따라 파싱하여 레거시 ESLint 설정을 반환한다 */
export const parseEslintLegacyConfig = (
  input: string,
  format: ConfigFormat,
): LegacyEslintConfig => {
  switch (format) {
    case 'json':
      return parseJsonConfig(input)
    case 'commonjs':
      return parseCommonJsConfig(input)
    default:
      return {}
  }
}
