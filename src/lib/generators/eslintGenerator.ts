/**
 * ESLint flat config 코드를 생성한다.
 * 옵션 조합에 따라 import문, config 배열, rules 객체를 구성한다.
 */
import type { EslintOptions } from '@/lib/schemas'

/** import문 목록을 구성한다 */
const buildImportLines = (options: EslintOptions): string[] => {
  const lines: string[] = []

  if (options.language === 'typescript') {
    lines.push("import tseslint from 'typescript-eslint'")
  }

  if (options.framework === 'react') {
    lines.push("import react from 'eslint-plugin-react'")
    lines.push("import reactHooks from 'eslint-plugin-react-hooks'")
  } else if (options.framework === 'vue') {
    lines.push("import vue from 'eslint-plugin-vue'")
  } else if (options.framework === 'nextjs') {
    lines.push("import next from '@next/eslint-plugin-next'")
  }

  if (options.integrations.astro) {
    lines.push("import eslintPluginAstro from 'eslint-plugin-astro'")
  }

  if (options.integrations.prettier) {
    lines.push("import prettierConfig from 'eslint-config-prettier'")
  }

  if (options.rules.importSorting) {
    lines.push("import importPlugin from 'eslint-plugin-import'")
  }

  return lines
}

/** config 스프레드 항목을 구성한다 */
const buildConfigSpreads = (options: EslintOptions): string[] => {
  const spreads: string[] = []

  if (options.language === 'typescript') {
    spreads.push('  ...tseslint.configs.recommended,')
  }

  if (options.framework === 'react') {
    spreads.push('  ...react.configs.flat.recommended,')
  } else if (options.framework === 'vue') {
    spreads.push('  ...vue.configs["flat/recommended"],')
  }

  if (options.integrations.astro) {
    spreads.push('  ...eslintPluginAstro.configs.recommended,')
  }

  return spreads
}

/** rules 객체를 구성한다 */
const buildRulesBlock = (options: EslintOptions): string[] => {
  const rules: string[] = []

  if (options.rules.noConsole) {
    rules.push("      'no-console': 'warn',")
  }
  if (options.rules.preferConst) {
    rules.push("      'prefer-const': 'error',")
  }
  if (options.rules.noUnusedVars && options.language === 'typescript') {
    rules.push("      '@typescript-eslint/no-unused-vars': 'error',")
  } else if (options.rules.noUnusedVars) {
    rules.push("      'no-unused-vars': 'error',")
  }

  return rules
}

/** ESLint flat config 전체 코드를 생성한다 */
export const generateEslintConfig = (options: EslintOptions): string => {
  const importLines = buildImportLines(options)
  const configSpreads = buildConfigSpreads(options)
  const rulesLines = buildRulesBlock(options)

  const lines: string[] = []

  // import 블록
  lines.push(...importLines)
  lines.push('')
  lines.push('export default [')

  // config 스프레드
  lines.push(...configSpreads)

  // plugins + rules 블록
  const hasPlugins = options.framework === 'react' || options.framework === 'nextjs'
  const hasRules = rulesLines.length > 0

  if (hasPlugins || hasRules) {
    lines.push('  {')

    if (options.framework === 'nextjs') {
      lines.push('    plugins: {')
      lines.push("      '@next/next': next,")
      lines.push('    },')
    }
    if (options.framework === 'react') {
      lines.push('    plugins: {')
      lines.push("      'react-hooks': reactHooks,")
      lines.push('    },')
    }

    if (hasRules) {
      lines.push('    rules: {')
      lines.push(...rulesLines)
      lines.push('    },')
    }

    lines.push('  },')
  }

  // prettier는 항상 마지막
  if (options.integrations.prettier) {
    lines.push('  prettierConfig,')
  }

  lines.push(']')

  return lines.join('\n')
}
