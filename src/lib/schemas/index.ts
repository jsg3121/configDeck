/**
 * slug 기반으로 프리셋 기본값을 가져오는 진입점.
 */
import { getPresets } from '@/lib/data/presets'

/** slug에 해당하는 프리셋 기본값을 반환한다 */
export const getPresetDefaultsBySlug = (slug: string, presetName: string): unknown => {
  const presets = getPresets(slug)
  const matched = presets.find((p) => p.name === presetName)
  return matched ? matched.values : (presets[0]?.values ?? {})
}
