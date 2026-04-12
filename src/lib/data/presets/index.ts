/**
 * 파일 slug → 프리셋 목록 맵.
 * 각 파일의 마이그레이션이 완료되면 여기에 등록한다.
 */
import type { Preset } from '@/types/generator'

import { editorconfigPresets } from './editorconfig'
import { prettierPresets } from './prettier'

/** slug → Preset 배열 맵 */
const presetDefinitions: Record<string, Preset[]> = {
  'prettier-config': prettierPresets,
  editorconfig: editorconfigPresets,
  // M4: 'tsconfig': tsconfigPresets,
  // M5: 'vite-config': vitePresets,
  // M6: 'vitest-config': vitestPresets,
  // M7: 'next-config': nextConfigPresets,
  // M8: 'gitignore': gitignorePresets,
  // M9: 'env-example': envExamplePresets,
  // M10: 'eslint-config': eslintPresets,
}

/** slug로 프리셋 목록을 조회한다. 미등록 파일은 빈 배열을 반환한다 */
export const getPresets = (slug: string): Preset[] => {
  return presetDefinitions[slug] ?? []
}

export default presetDefinitions
