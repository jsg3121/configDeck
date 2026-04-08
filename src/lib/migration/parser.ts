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

/** JSON 형식의 레거시 ESLint 설정을 파싱한다 */
const parseJsonConfig = (input: string): LegacyEslintConfig => {
  const parsed = JSON.parse(input) as Record<string, unknown>
  return {
    extends: normalizeStringOrArray(parsed.extends),
    plugins: normalizeStringOrArray(parsed.plugins),
    rules: (parsed.rules as Record<string, unknown>) ?? undefined,
    env: (parsed.env as Record<string, boolean>) ?? undefined,
    parserOptions: (parsed.parserOptions as Record<string, unknown>) ?? undefined,
    parser: typeof parsed.parser === 'string' ? parsed.parser : undefined,
  }
}

/** CommonJS 형식에서 객체 리터럴을 추출하여 파싱한다 */
const parseCommonJsConfig = (input: string): LegacyEslintConfig => {
  const objectMatch = input.match(/module\.exports\s*=\s*(\{[\s\S]*\})/)
  if (!objectMatch?.[1]) return {}

  // JSON 호환 형태로 변환 시도 (주석 제거, trailing comma 처리)
  const cleaned = objectMatch[1]
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/,(\s*[}\]])/g, '$1')
    .replace(/(['"])?(\w+)(['"])?\s*:/g, '"$2":')

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
