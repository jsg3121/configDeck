/**
 * slug 기반으로 프리셋 기본값을 가져오는 진입점.
 * 모든 파일이 신규 옵션 구조로 마이그레이션 완료되어 신규 프리셋에서만 조회한다.
 *
 * Legacy 스키마 파일(xxxSchema.ts)은 M11(Legacy 정리)에서 제거 예정.
 */
import { getPresets } from '@/lib/data/presets'

// Legacy 타입 re-export — 아직 참조하는 코드가 있을 수 있으므로 유지. M11에서 제거.
export type { EditorconfigOptions } from './editorconfigSchema'
export type { EnvExampleOptions } from './envExampleSchema'
export type { EslintOptions } from './eslintSchema'
export type { GitignoreOptions } from './gitignoreSchema'
export type { NextConfigOptions } from './nextConfigSchema'
export type { TsconfigOptions } from './tsconfigSchema'
export type { ViteOptions } from './viteSchema'
export type { VitestOptions } from './vitestSchema'

/** slug에 해당하는 프리셋 기본값을 반환한다 */
export const getPresetDefaultsBySlug = (slug: string, presetName: string): unknown => {
  const presets = getPresets(slug)
  const matched = presets.find((p) => p.name === presetName)
  return matched ? matched.values : (presets[0]?.values ?? {})
}
