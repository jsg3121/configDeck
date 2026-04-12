/**
 * 모든 생성기를 통합 export하고, slug 기반 통합 진입점을 제공한다.
 */
import type { GeneratorOutput } from '@/types/generator'

import { generateEditorconfig } from './editorconfigGenerator'
import { generateEnvExample } from './envExampleGenerator'
import { generateEslintConfig } from './eslintGenerator'
import { generateGitignore } from './gitignoreGenerator'
import { generateNextConfig } from './nextConfigGenerator'
import { generatePrettierConfig } from './prettierGenerator'
import { generateTsconfigJson } from './tsconfigGenerator'
import { generateViteConfig } from './viteGenerator'
import { generateVitestConfig } from './vitestGenerator'

export {
  generateEditorconfig,
  generateEnvExample,
  generateEslintConfig,
  generateGitignore,
  generateNextConfig,
  generatePrettierConfig,
  generateTsconfigJson,
  generateViteConfig,
  generateVitestConfig,
}

/** slug → 생성 함수 + 파일명 + 언어 매핑 */
const GENERATOR_MAP: Record<
  string,
  { generate: (options: never) => string; fileName: string; language: string }
> = {
  'eslint-config': {
    generate: generateEslintConfig as (options: never) => string,
    fileName: 'eslint.config.mjs',
    language: 'javascript',
  },
  'prettier-config': {
    generate: generatePrettierConfig as (options: never) => string,
    fileName: 'prettier.config.mjs',
    language: 'javascript',
  },
  tsconfig: {
    generate: generateTsconfigJson as (options: never) => string,
    fileName: 'tsconfig.json',
    language: 'json',
  },
  gitignore: {
    generate: generateGitignore as (options: never) => string,
    fileName: '.gitignore',
    language: 'gitignore',
  },
  'vite-config': {
    generate: generateViteConfig as (options: never) => string,
    fileName: 'vite.config.ts',
    language: 'typescript',
  },
  'vitest-config': {
    generate: generateVitestConfig as (options: never) => string,
    fileName: 'vitest.config.ts',
    language: 'typescript',
  },
  'next-config': {
    generate: generateNextConfig as (options: never) => string,
    fileName: 'next.config.js',
    language: 'javascript',
  },
  editorconfig: {
    generate: generateEditorconfig as (options: never) => string,
    fileName: '.editorconfig',
    language: 'ini',
  },
  env: {
    generate: generateEnvExample as (options: never) => string,
    fileName: '.env',
    language: 'shell',
  },
}

/** slug와 옵션으로 설정 파일 코드를 생성한다 */
export const generateConfigBySlug = (slug: string, options: unknown): GeneratorOutput => {
  const entry = GENERATOR_MAP[slug]
  if (!entry) {
    return { fileName: '', code: '', language: '' }
  }

  return {
    fileName: entry.fileName,
    code: entry.generate(options as never),
    language: entry.language,
  }
}
