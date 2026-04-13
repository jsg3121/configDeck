/**
 * 스택 프리셋 메타데이터를 정의한다.
 * 각 스택은 포함할 파일과 해당 파일에 적용할 프리셋 이름을 지정한다.
 * 실제 옵션 값은 src/lib/data/presets/ 에서 조회하여 코드를 생성한다.
 */

/** 스택에 포함된 파일 하나의 정의 */
export interface StackFile {
  /** 생성될 파일명 */
  fileName: string
  /** 파일별 생성기 slug (files.ts의 slug와 일치) */
  slug: string
  /** 이 파일에 적용할 프리셋 이름 (presets/*.ts의 name과 일치) */
  preset: string
}

export const STACK_DEFINITIONS = [
  {
    slug: 'react-vite-ts',
    name: 'React + Vite + TypeScript',
    icon: '\u269B\uFE0F',
    descriptionEn:
      'Generate all essential config files for a React project powered by Vite and TypeScript. Includes linting, formatting, and build configuration.',
    descriptionKo:
      'Vite와 TypeScript 기반 React 프로젝트에 필요한 모든 설정 파일을 생성합니다. 린팅, 포맷팅, 빌드 설정이 포함됩니다.',
    files: [
      { fileName: '.gitignore', slug: 'gitignore', preset: 'Node' },
      { fileName: 'tsconfig.json', slug: 'tsconfig', preset: 'React + Vite' },
      { fileName: 'eslint.config.mjs', slug: 'eslint-config', preset: 'TypeScript Strict' },
      { fileName: 'prettier.config.mjs', slug: 'prettier-config', preset: 'Airbnb-like' },
      { fileName: 'vite.config.ts', slug: 'vite-config', preset: 'React' },
      { fileName: 'vitest.config.ts', slug: 'vitest-config', preset: 'React' },
      { fileName: '.editorconfig', slug: 'editorconfig', preset: 'Standard' },
    ] satisfies StackFile[],
  },
  {
    slug: 'nextjs',
    name: 'Next.js + TypeScript',
    icon: '\u25B2',
    descriptionEn:
      'Generate config files for a Next.js project with TypeScript. Includes ESLint, Prettier, and Next.js configuration.',
    descriptionKo:
      'TypeScript 기반 Next.js 프로젝트에 필요한 설정 파일을 생성합니다. ESLint, Prettier, Next.js 설정이 포함됩니다.',
    files: [
      { fileName: '.gitignore', slug: 'gitignore', preset: 'Node' },
      { fileName: 'tsconfig.json', slug: 'tsconfig', preset: 'Next.js' },
      { fileName: 'eslint.config.mjs', slug: 'eslint-config', preset: 'Next.js' },
      { fileName: 'prettier.config.mjs', slug: 'prettier-config', preset: 'Airbnb-like' },
      { fileName: 'next.config.js', slug: 'next-config', preset: 'Standard' },
      { fileName: '.editorconfig', slug: 'editorconfig', preset: 'Standard' },
    ] satisfies StackFile[],
  },
  {
    slug: 'astro',
    name: 'Astro + TypeScript',
    icon: '🚀',
    descriptionEn:
      'Generate config files for an Astro project with TypeScript. Includes ESLint with Astro plugin, Prettier, and TypeScript configuration.',
    descriptionKo:
      'TypeScript 기반 Astro 프로젝트에 필요한 설정 파일을 생성합니다. Astro 플러그인이 포함된 ESLint, Prettier, TypeScript 설정이 포함됩니다.',
    files: [
      { fileName: '.gitignore', slug: 'gitignore', preset: 'Node' },
      { fileName: 'tsconfig.json', slug: 'tsconfig', preset: 'Astro' },
      { fileName: 'eslint.config.mjs', slug: 'eslint-config', preset: 'TypeScript Strict' },
      { fileName: 'prettier.config.mjs', slug: 'prettier-config', preset: 'Standard JS' },
      { fileName: '.editorconfig', slug: 'editorconfig', preset: 'Standard' },
    ] satisfies StackFile[],
  },
  {
    slug: 'node-api',
    name: 'Node.js + TypeScript',
    icon: '🟢',
    descriptionEn:
      'Generate config files for a Node.js API project with TypeScript. Includes ESLint, Prettier, TypeScript, and environment configuration.',
    descriptionKo:
      'TypeScript 기반 Node.js API 프로젝트에 필요한 설정 파일을 생성합니다. ESLint, Prettier, TypeScript, 환경 설정이 포함됩니다.',
    files: [
      { fileName: '.gitignore', slug: 'gitignore', preset: 'Node' },
      { fileName: 'tsconfig.json', slug: 'tsconfig', preset: 'Node 20' },
      { fileName: 'eslint.config.mjs', slug: 'eslint-config', preset: 'TypeScript Strict' },
      { fileName: 'prettier.config.mjs', slug: 'prettier-config', preset: 'Prettier Default' },
      { fileName: '.env', slug: 'env', preset: 'Backend' },
      { fileName: '.editorconfig', slug: 'editorconfig', preset: 'Standard' },
    ] satisfies StackFile[],
  },
] as const

export type StackDefinition = (typeof STACK_DEFINITIONS)[number]
