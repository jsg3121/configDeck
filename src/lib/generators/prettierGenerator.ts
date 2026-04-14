/**
 * Prettier config 코드를 생성한다.
 * 신규 옵션 구조(18개 옵션) 기반으로, 기본값과 같은 옵션은 생략하여 깔끔한 출력을 만든다.
 */

/** Prettier 공식 기본값 — 기본값과 같은 옵션은 출력에서 생략한다 */
const PRETTIER_DEFAULTS: Record<string, unknown> = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: 'all',
  arrowParens: 'always',
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: false,
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  singleAttributePerLine: false,
  proseWrap: 'preserve',
  embeddedLanguageFormatting: 'auto',
  experimentalTernaries: false,
}

/** 값을 JS 리터럴 문자열로 변환한다 */
const toJsValue = (value: unknown): string => {
  if (typeof value === 'string') return `'${value}'`
  return String(value)
}

/** Prettier config 전체 코드를 생성한다 */
export const generatePrettierConfig = (options: Record<string, unknown>): string => {
  const lines: string[] = []

  lines.push('/** @type {import("prettier").Config} */')
  lines.push('export default {')

  // 사용자가 명시적으로 설정한 모든 옵션을 출력한다.
  // 기본값과 같더라도 options에 포함되어 있으면 출력한다.
  for (const [key] of Object.entries(PRETTIER_DEFAULTS)) {
    if (key in options) {
      lines.push(`  ${key}: ${toJsValue(options[key])},`)
    }
  }

  lines.push('}')

  return lines.join('\n')
}
