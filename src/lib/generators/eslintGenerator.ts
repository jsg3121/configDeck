/**
 * ESLint flat config (eslint.config.mjs) 코드를 생성한다.
 * 신규 옵션 구조 기반으로, 사용자가 설정한(touched) 옵션만 출력한다.
 */

/** ESLint rule 키 → 실제 rule 이름 매핑 (camelCase key → kebab-case rule) */
const RULE_KEY_MAP: Record<string, string> = {
  noConsole: 'no-console',
  noUnusedVars: 'no-unused-vars',
  preferConst: 'prefer-const',
  eqeqeq: 'eqeqeq',
  curly: 'curly',
  noDebugger: 'no-debugger',
  noAlert: 'no-alert',
  noVar: 'no-var',
  noShadow: 'no-shadow',
  noThrowLiteral: 'no-throw-literal',
  noReturnAwait: 'no-return-await',
  noParamReassign: 'no-param-reassign',
  noNestedTernary: 'no-nested-ternary',
  preferTemplate: 'prefer-template',
  preferArrowCallback: 'prefer-arrow-callback',
  objectShorthand: 'object-shorthand',
  noUnneededTernary: 'no-unneeded-ternary',
  preferDestructuring: 'prefer-destructuring',
  noElseReturn: 'no-else-return',
  consistentReturn: 'consistent-return',
  noUselessReturn: 'no-useless-return',
  noEmptyFunction: 'no-empty-function',
  noMagicNumbers: 'no-magic-numbers',
  noAwaitInLoop: 'no-await-in-loop',
  preferSpreadElement: 'prefer-spread',
  preferRestParams: 'prefer-rest-params',
  noUselessConcat: 'no-useless-concat',
  defaultCase: 'default-case',
}

/** TypeScript에서 @typescript-eslint로 대체해야 하는 rule */
const TS_OVERRIDE_RULES = new Set([
  'no-unused-vars',
  'no-shadow',
  'no-empty-function',
  'no-magic-numbers',
  'no-return-await',
])

/** ESLint flat config 전체 코드를 생성한다 */
export const generateEslintConfig = (options: Record<string, unknown>): string => {
  const importLines: string[] = []
  const configSpreads: string[] = []
  const rules: Record<string, string> = {}

  const language = (options.language as string) ?? ''
  const framework = (options.framework as string) ?? ''
  const isTs = language === 'typescript'

  // --- imports & config spreads ---

  if (isTs) {
    importLines.push("import tseslint from 'typescript-eslint'")
    configSpreads.push('  ...tseslint.configs.recommended,')
  }

  if (framework === 'react') {
    importLines.push("import react from 'eslint-plugin-react'")
    importLines.push("import reactHooks from 'eslint-plugin-react-hooks'")
    configSpreads.push('  ...react.configs.flat.recommended,')
  } else if (framework === 'vue') {
    importLines.push("import vue from 'eslint-plugin-vue'")
    configSpreads.push("  ...vue.configs['flat/recommended'],")
  } else if (framework === 'nextjs') {
    importLines.push("import next from '@next/eslint-plugin-next'")
  } else if (framework === 'svelte') {
    importLines.push("import svelte from 'eslint-plugin-svelte'")
    configSpreads.push('  ...svelte.configs.recommended,')
  } else if (framework === 'astro') {
    importLines.push("import eslintPluginAstro from 'eslint-plugin-astro'")
    configSpreads.push('  ...eslintPluginAstro.configs.recommended,')
  }

  if (options.importPlugin === true) {
    importLines.push("import importPlugin from 'eslint-plugin-import'")
  }

  if (options.a11yPlugin === true) {
    importLines.push("import jsxA11y from 'eslint-plugin-jsx-a11y'")
  }

  if (options.prettier === true) {
    importLines.push("import prettierConfig from 'eslint-config-prettier'")
  }

  // --- rules ---

  for (const [key, value] of Object.entries(options)) {
    const ruleName = RULE_KEY_MAP[key]
    if (!ruleName || value === 'off' || value === '') continue

    // TypeScript면 @typescript-eslint로 대체
    if (isTs && TS_OVERRIDE_RULES.has(ruleName)) {
      rules[`@typescript-eslint/${ruleName}`] = value as string
    } else {
      rules[ruleName] = value as string
    }
  }

  // --- 코드 생성 ---

  const lines: string[] = []

  lines.push(...importLines)
  if (importLines.length > 0) lines.push('')
  lines.push('export default [')

  // config spreads
  lines.push(...configSpreads)

  // plugins + rules block
  const pluginEntries: string[] = []
  if (framework === 'nextjs') {
    pluginEntries.push("      '@next/next': next,")
  }
  if (framework === 'react') {
    pluginEntries.push("      'react-hooks': reactHooks,")
  }
  if (options.importPlugin === true) {
    pluginEntries.push('      import: importPlugin,')
  }
  if (options.a11yPlugin === true) {
    pluginEntries.push("      'jsx-a11y': jsxA11y,")
  }

  const ruleEntries = Object.entries(rules)
  const hasPlugins = pluginEntries.length > 0
  const hasRules = ruleEntries.length > 0

  if (hasPlugins || hasRules) {
    lines.push('  {')
    if (hasPlugins) {
      lines.push('    plugins: {')
      lines.push(...pluginEntries)
      lines.push('    },')
    }
    if (hasRules) {
      lines.push('    rules: {')
      for (const [name, severity] of ruleEntries) {
        lines.push(`      '${name}': '${severity}',`)
      }
      lines.push('    },')
    }
    lines.push('  },')
  }

  // prettier는 항상 마지막
  if (options.prettier === true) {
    lines.push('  prettierConfig,')
  }

  lines.push(']')

  return lines.join('\n')
}
