/**
 * 모든 스키마를 통합 export하고, slug 기반으로 프리셋 기본값을 가져오는 진입점.
 * 마이그레이션된 파일은 신규 프리셋에서, 미마이그레이션 파일은 legacy 스키마에서 조회한다.
 * M11(Legacy 정리) 때 legacy 관련 코드를 모두 제거한다.
 */
import { isMigrated } from '@/lib/data/options'
import { getPresets as getNewPresets } from '@/lib/data/presets'

import { getEditorconfigPresetDefaults } from './editorconfigSchema'
import { getEnvExamplePresetDefaults } from './envExampleSchema'
import { getEslintPresetDefaults } from './eslintSchema'
import { getGitignorePresetDefaults } from './gitignoreSchema'
import { getNextConfigPresetDefaults } from './nextConfigSchema'
import { getTsconfigPresetDefaults } from './tsconfigSchema'
import { getVitePresetDefaults } from './viteSchema'
import { getVitestPresetDefaults } from './vitestSchema'

export type { EditorconfigOptions } from './editorconfigSchema'
export type { EnvExampleOptions } from './envExampleSchema'
export type { EslintOptions } from './eslintSchema'
export type { GitignoreOptions } from './gitignoreSchema'
export type { NextConfigOptions } from './nextConfigSchema'
export type { TsconfigOptions } from './tsconfigSchema'
export type { ViteOptions } from './viteSchema'
export type { VitestOptions } from './vitestSchema'

export {
  getEditorconfigPresetDefaults,
  getEnvExamplePresetDefaults,
  getEslintPresetDefaults,
  getGitignorePresetDefaults,
  getNextConfigPresetDefaults,
  getTsconfigPresetDefaults,
  getVitePresetDefaults,
  getVitestPresetDefaults,
}

/** legacy slug → 프리셋 기본값 제공 함수 매핑. 마이그레이션 시 해당 항목을 제거한다 */
const LEGACY_PRESET_PROVIDERS: Record<string, (presetName: string) => unknown> = {
  'eslint-config': getEslintPresetDefaults,
  tsconfig: getTsconfigPresetDefaults,
  gitignore: getGitignorePresetDefaults,
  'vite-config': getVitePresetDefaults,
  'vitest-config': getVitestPresetDefaults,
  'next-config': getNextConfigPresetDefaults,
  editorconfig: getEditorconfigPresetDefaults,
  'env-example': getEnvExamplePresetDefaults,
}

/**
 * slug에 해당하는 프리셋 기본값을 반환한다.
 * 마이그레이션된 파일 → 신규 프리셋(src/lib/data/presets/)에서 조회
 * 미마이그레이션 파일 → legacy 스키마(src/lib/schemas/)에서 조회
 */
export const getPresetDefaultsBySlug = (slug: string, presetName: string): unknown => {
  if (isMigrated(slug)) {
    const presets = getNewPresets(slug)
    const matched = presets.find((p) => p.name === presetName)
    return matched ? matched.values : (presets[0]?.values ?? {})
  }

  const provider = LEGACY_PRESET_PROVIDERS[slug]
  return provider ? provider(presetName) : {}
}
