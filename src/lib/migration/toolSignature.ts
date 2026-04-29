/**
 * 입력 문자열이 어느 도구(eslint/prettier/tsconfig)의 설정인지 휴리스틱 추정한다.
 *
 * 사용처: MigrationWorkbench가 페이지의 toolType과 사용자 입력의 추정 도구를
 * 비교하여 불일치 시 경고 + 변환 차단 + 이동 링크를 제공한다.
 *
 * SPEC-0004 §3.2.3 — Phase C 10단계 후속 (도구 유형 검증).
 *
 * 설계:
 *   - 강한 시그니처 키만 점수에 반영. 모호한 키(extends, plugins 등)는 무시.
 *   - 모든 도구 점수가 0이면 'empty' (빈 객체/판별 불가)
 *   - 최고 점수 도구가 단독 1위면 해당 도구로 확정
 *   - 동점이면 'ambiguous' — false positive 방지를 위해 차단하지 않음
 *
 * 차단은 'eslint'/'prettier'/'tsconfig' 중 하나로 확정된 경우에만 발생.
 */
import { cleanJsonLikeInput } from './codeUtils'

export type DetectedTool = 'eslint' | 'prettier' | 'tsconfig' | 'ambiguous' | 'empty'

const ESLINT_STRONG_KEYS = new Set([
  'rules',
  'env',
  'parserOptions',
  'parser',
  'overrides',
  'globals',
  'noInlineConfig',
  'reportUnusedDisableDirectives',
  'root',
  'ignorePatterns',
])

const PRETTIER_STRONG_KEYS = new Set([
  'printWidth',
  'tabWidth',
  'useTabs',
  'semi',
  'singleQuote',
  'trailingComma',
  'bracketSpacing',
  'arrowParens',
  'endOfLine',
  'proseWrap',
  'htmlWhitespaceSensitivity',
  'embeddedLanguageFormatting',
  'bracketSameLine',
  'jsxSingleQuote',
  'quoteProps',
  'requirePragma',
  'insertPragma',
  'vueIndentScriptAndStyle',
  'singleAttributePerLine',
  'experimentalTernaries',
])

const TSCONFIG_STRONG_KEYS = new Set([
  'compilerOptions',
  'references',
  'compileOnSave',
  'typeAcquisition',
  'watchOptions',
  'buildOptions',
])

const tryParseObject = (input: string): Record<string, unknown> | null => {
  const trimmed = input.trim()
  if (!trimmed) return null
  try {
    const cleaned = cleanJsonLikeInput(trimmed)
    const parsed = JSON.parse(cleaned)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
    return null
  } catch {
    return null
  }
}

/**
 * 입력 문자열을 분석하여 어느 도구의 설정인지 추정한다.
 *
 * 반환값:
 *   - 'empty': 빈 입력, 빈 객체, 또는 강한 시그니처가 전혀 없는 경우 (차단 안 함)
 *   - 'ambiguous': 두 개 이상 도구의 강한 시그니처가 동점인 경우 (차단 안 함)
 *   - 'eslint' / 'prettier' / 'tsconfig': 단독 최고 점수 도구로 확정
 */
export const detectToolType = (input: string): DetectedTool => {
  const parsed = tryParseObject(input)
  if (!parsed) return 'empty'

  const keys = Object.keys(parsed)
  if (keys.length === 0) return 'empty'

  let eslintScore = 0
  let prettierScore = 0
  let tsconfigScore = 0

  for (const key of keys) {
    if (ESLINT_STRONG_KEYS.has(key)) eslintScore += 1
    if (PRETTIER_STRONG_KEYS.has(key)) prettierScore += 1
    if (TSCONFIG_STRONG_KEYS.has(key)) tsconfigScore += 1
  }

  const max = Math.max(eslintScore, prettierScore, tsconfigScore)
  if (max === 0) return 'empty'

  const winners: DetectedTool[] = []
  if (eslintScore === max) winners.push('eslint')
  if (prettierScore === max) winners.push('prettier')
  if (tsconfigScore === max) winners.push('tsconfig')

  if (winners.length === 1) return winners[0]
  return 'ambiguous'
}
