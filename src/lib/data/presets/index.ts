/**
 * 파일 slug → 프리셋 목록 맵.
 * 각 파일의 마이그레이션이 완료되면 여기에 등록한다.
 */
import type { Preset } from '@/types/generator'

import { editorconfigPresets } from './editorconfig'
import { envExamplePresets } from './envExample'
import { gitignorePresets } from './gitignore'
import { nextConfigPresets } from './nextConfig'
import { prettierPresets } from './prettier'
import { tsconfigPresets } from './tsconfig'
import { vitePresets } from './vite'
import { vitestPresets } from './vitest'

/** slug → Preset 배열 맵 */
const presetDefinitions: Record<string, Preset[]> = {
  'prettier-config': prettierPresets,
  editorconfig: editorconfigPresets,
  tsconfig: tsconfigPresets,
  'vite-config': vitePresets,
  'vitest-config': vitestPresets,
  'next-config': nextConfigPresets,
  gitignore: gitignorePresets,
  env: envExamplePresets,
  // M10: 'eslint-config': eslintPresets,
}

/** slug로 프리셋 목록을 조회한다. 미등록 파일은 빈 배열을 반환한다 */
export const getPresets = (slug: string): Preset[] => {
  return presetDefinitions[slug] ?? []
}

export default presetDefinitions
