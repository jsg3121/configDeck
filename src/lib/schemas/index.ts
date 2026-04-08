/**
 * 모든 스키마를 통합 export하고, slug 기반으로 프리셋 기본값을 가져오는 진입점.
 */
import { getEditorconfigPresetDefaults } from './editorconfigSchema'
import { getEnvExamplePresetDefaults } from './envExampleSchema'
import { getEslintPresetDefaults } from './eslintSchema'
import { getGitignorePresetDefaults } from './gitignoreSchema'
import { getNextConfigPresetDefaults } from './nextConfigSchema'
import { getPrettierPresetDefaults } from './prettierSchema'
import { getTsconfigPresetDefaults } from './tsconfigSchema'
import { getVitePresetDefaults } from './viteSchema'
import { getVitestPresetDefaults } from './vitestSchema'

export type { EditorconfigOptions } from './editorconfigSchema'
export type { EnvExampleOptions } from './envExampleSchema'
export type { EslintOptions } from './eslintSchema'
export type { GitignoreOptions } from './gitignoreSchema'
export type { NextConfigOptions } from './nextConfigSchema'
export type { PrettierOptions } from './prettierSchema'
export type { TsconfigOptions } from './tsconfigSchema'
export type { ViteOptions } from './viteSchema'
export type { VitestOptions } from './vitestSchema'

export {
  getEditorconfigPresetDefaults,
  getEnvExamplePresetDefaults,
  getEslintPresetDefaults,
  getGitignorePresetDefaults,
  getNextConfigPresetDefaults,
  getPrettierPresetDefaults,
  getTsconfigPresetDefaults,
  getVitePresetDefaults,
  getVitestPresetDefaults,
}

/** slug → 프리셋 기본값 제공 함수 매핑 */
const PRESET_PROVIDERS: Record<string, (presetName: string) => unknown> = {
  'eslint-config': getEslintPresetDefaults,
  'prettier-config': getPrettierPresetDefaults,
  tsconfig: getTsconfigPresetDefaults,
  gitignore: getGitignorePresetDefaults,
  'vite-config': getVitePresetDefaults,
  'vitest-config': getVitestPresetDefaults,
  'next-config': getNextConfigPresetDefaults,
  editorconfig: getEditorconfigPresetDefaults,
  'env-example': getEnvExamplePresetDefaults,
}

/** slug에 해당하는 프리셋 기본값을 반환한다 */
export const getPresetDefaultsBySlug = (slug: string, presetName: string): unknown => {
  const provider = PRESET_PROVIDERS[slug]
  return provider ? provider(presetName) : {}
}
