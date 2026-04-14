/**
 * TSConfig 프리셋 목록.
 * 프리셋은 core 옵션 위주로 포함한다.
 * 참고: https://github.com/tsconfig/bases
 */
import type { Preset } from '@/types/generator'

export const tsconfigPresets: Preset[] = [
  {
    name: 'Node 20',
    description: 'Node.js 20 LTS 환경에 최적화된 설정. @tsconfig/node20 설정을 상속합니다.',
    source: 'https://github.com/tsconfig/bases/blob/main/bases/node20.json',
    values: {
      extends: '@tsconfig/node20/tsconfig.json',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    },
  },
  {
    name: 'React + Vite',
    description: 'React + Vite 프로젝트 설정. JSX 자동 import와 번들러 모듈 해석을 사용합니다.',
    source: 'https://vite.dev/guide/#scaffolding-your-first-vite-project',
    values: {
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      jsx: 'react-jsx',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    },
  },
  {
    name: 'Next.js',
    description: 'Next.js 14+ App Router 설정. next/core-web-vitals 설정을 상속합니다.',
    source: 'https://nextjs.org/docs/getting-started/installation#manual-installation',
    values: {
      extends: 'next/core-web-vitals',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      include: ['**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    },
  },
  {
    name: 'Astro',
    description: 'Astro 프로젝트 설정. astro/tsconfigs/strict 설정을 상속합니다.',
    source: 'https://docs.astro.build/en/guides/typescript/',
    values: {
      extends: 'astro/tsconfigs/strict',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      include: ['src', '.astro/types.d.ts'],
      exclude: ['dist'],
    },
  },
  {
    name: 'Library',
    description: '라이브러리 배포용 설정. 타입 선언 파일과 소스맵을 생성합니다.',
    source: 'https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html',
    values: {
      target: 'ES2020',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    },
  },
  {
    name: 'Strict',
    description: '@tsconfig/strictest 기반의 최대 엄격 설정. strict에 추가 검사를 더합니다.',
    source: 'https://github.com/tsconfig/bases/blob/main/bases/strictest.json',
    values: {
      extends: '@tsconfig/strictest/tsconfig.json',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    },
  },
]
