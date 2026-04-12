/**
 * 파일 slug → 옵션 정의 맵.
 * 각 파일의 마이그레이션이 완료되면 여기에 등록한다.
 */
import type { FileOptionDefinition } from '@/types/generator'

import { editorconfigOptions } from './editorconfig'
import { envExampleOptions } from './envExample'
import { eslintOptions } from './eslint'
import { gitignoreOptions } from './gitignore'
import { nextConfigOptions } from './nextConfig'
import { prettierOptions } from './prettier'
import { tsconfigOptions } from './tsconfig'
import { viteOptions } from './vite'
import { vitestOptions } from './vitest'

/** slug → FileOptionDefinition 맵. 마이그레이션 순서대로 등록된다 */
const optionDefinitions: Record<string, FileOptionDefinition> = {
  'prettier-config': prettierOptions,
  editorconfig: editorconfigOptions,
  tsconfig: tsconfigOptions,
  'vite-config': viteOptions,
  'vitest-config': vitestOptions,
  'next-config': nextConfigOptions,
  gitignore: gitignoreOptions,
  env: envExampleOptions,
  'eslint-config': eslintOptions,
}

/** slug로 옵션 정의를 조회한다. 미등록 파일은 undefined를 반환한다 */
export const getOptionDefinition = (slug: string): FileOptionDefinition | undefined => {
  return optionDefinitions[slug]
}

/** 해당 slug가 신규 옵션 구조로 마이그레이션되었는지 확인한다 */
export const isMigrated = (slug: string): boolean => {
  return slug in optionDefinitions
}

export default optionDefinitions
