/**
 * 레거시 ESLint 설정(.eslintrc)을 flat config(eslint.config.mjs)로 변환한다.
 */
import type { LegacyEslintConfig } from './parser'
import type { MigrationResult, MigrationWarning } from './types'

export type { MigrationResult, MigrationWarning }

/** extends 값을 flat config import/spread로 매핑한다 */
const EXTENDS_MAP: Record<string, { importLine: string; spread: string }> = {
  'eslint:recommended': {
    importLine: "import js from '@eslint/js'",
    spread: 'js.configs.recommended',
  },
  'plugin:@typescript-eslint/recommended': {
    importLine: "import tseslint from 'typescript-eslint'",
    spread: '...tseslint.configs.recommended',
  },
  'plugin:react/recommended': {
    importLine: "import react from 'eslint-plugin-react'",
    spread: '...react.configs.flat.recommended',
  },
  'plugin:vue/vue3-recommended': {
    importLine: "import vue from 'eslint-plugin-vue'",
    spread: '...vue.configs["flat/recommended"]',
  },
  prettier: {
    importLine: "import prettierConfig from 'eslint-config-prettier'",
    spread: 'prettierConfig',
  },
  'eslint-config-prettier': {
    importLine: "import prettierConfig from 'eslint-config-prettier'",
    spread: 'prettierConfig',
  },
}

/** env 값을 globals import로 매핑한다 */
const buildGlobalsBlock = (
  env: Record<string, boolean>,
): { importLine: string; code: string } | null => {
  const activeEnvs = Object.entries(env)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key)

  if (activeEnvs.length === 0) return null

  const globalsEntries = activeEnvs.map((envName) => `      ...globals.${envName}`).join(',\n')

  return {
    importLine: "import globals from 'globals'",
    code: `    languageOptions: {\n      globals: {\n${globalsEntries},\n      },\n    }`,
  }
}

/** 레거시 ESLint 설정을 flat config로 변환한다 */
export const migrateEslintConfig = (legacyConfig: LegacyEslintConfig): MigrationResult<never> => {
  const importLines = new Set<string>()
  const configSpreads: string[] = []
  const configBlockEntries: string[] = []
  const warnings: MigrationWarning[] = []

  // extends → import + spread
  if (legacyConfig.extends) {
    for (const extendName of legacyConfig.extends) {
      const mapping = EXTENDS_MAP[extendName]
      if (mapping) {
        importLines.add(mapping.importLine)
        configSpreads.push(`  ${mapping.spread},`)
      } else {
        warnings.push({
          message: `"${extendName}" — Cannot be auto-mapped. Manual conversion required.`,
          messageKo: `"${extendName}" — 자동 매핑할 수 없습니다. 수동으로 변환이 필요합니다.`,
        })
      }
    }
  }

  // plugins → 경고 (flat config에서 직접 import 필요)
  if (legacyConfig.plugins) {
    for (const pluginName of legacyConfig.plugins) {
      if (!legacyConfig.extends?.some((e) => e.includes(pluginName))) {
        warnings.push({
          message: `plugin "${pluginName}" — In flat config, import directly and add to the plugins object.`,
          messageKo: `plugin "${pluginName}" — flat config에서는 직접 import하여 plugins 객체에 추가하세요.`,
        })
      }
    }
  }

  // env → globals
  if (legacyConfig.env) {
    const globalsBlock = buildGlobalsBlock(legacyConfig.env)
    if (globalsBlock) {
      importLines.add(globalsBlock.importLine)
      configBlockEntries.push(globalsBlock.code)
    }
  }

  // parser → 경고
  if (legacyConfig.parser) {
    warnings.push({
      message: `parser "${legacyConfig.parser}" — Set directly in languageOptions.parser for flat config.`,
      messageKo: `parser "${legacyConfig.parser}" — flat config의 languageOptions.parser로 직접 설정하세요.`,
    })
  }

  // rules → 그대로 유지
  if (legacyConfig.rules && Object.keys(legacyConfig.rules).length > 0) {
    const rulesStr = JSON.stringify(legacyConfig.rules, null, 2)
      .split('\n')
      .map((line, i) => (i === 0 ? `    rules: ${line}` : `    ${line}`))
      .join('\n')
    configBlockEntries.push(rulesStr)
  }

  // 코드 조합
  const lines: string[] = []
  lines.push(...Array.from(importLines))
  lines.push('')
  lines.push('export default [')
  lines.push(...configSpreads)

  if (configBlockEntries.length > 0) {
    lines.push('  {')
    lines.push(configBlockEntries.join(',\n'))
    lines.push('  },')
  }

  lines.push(']')

  return {
    output: lines.join('\n'),
    warnings,
  }
}
