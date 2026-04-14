/**
 * ESLint 프리셋 목록.
 * 각 프리셋은 언어/프레임워크/플러그인/주요 rule을 조합한다.
 */
import type { Preset } from '@/types/generator'

export const eslintPresets: Preset[] = [
  {
    name: 'TypeScript Strict',
    description: 'TypeScript + @typescript-eslint recommended. Prettier 연동 포함.',
    source: 'https://typescript-eslint.io/getting-started',
    values: {
      language: 'typescript',
      framework: 'none',
      prettier: true,
      importPlugin: true,
      noConsole: 'warn',
      noUnusedVars: 'error',
      preferConst: 'error',
      eqeqeq: 'error',
      noVar: 'error',
      noDebugger: 'error',
    },
  },
  {
    name: 'Next.js',
    description: 'Next.js + TypeScript + @next/eslint-plugin-next. Prettier 연동 포함.',
    source: 'https://nextjs.org/docs/app/api-reference/config/eslint',
    values: {
      language: 'typescript',
      framework: 'nextjs',
      prettier: true,
      importPlugin: true,
      noConsole: 'warn',
      noUnusedVars: 'warn',
      preferConst: 'error',
      eqeqeq: 'error',
      noVar: 'error',
    },
  },
  {
    name: 'Airbnb',
    description: 'Airbnb JavaScript Style Guide 기반. 엄격한 코드 스타일을 적용합니다.',
    source: 'https://github.com/airbnb/javascript',
    values: {
      language: 'typescript',
      framework: 'none',
      prettier: true,
      importPlugin: true,
      noConsole: 'warn',
      noUnusedVars: 'error',
      preferConst: 'error',
      eqeqeq: 'error',
      curly: 'error',
      noDebugger: 'error',
      noAlert: 'warn',
      noVar: 'error',
    },
  },
  {
    name: 'Standard',
    description: 'Standard JS 스타일. 세미콜론 없이 깔끔한 코드를 지향합니다.',
    source: 'https://standardjs.com/',
    values: {
      language: 'javascript',
      framework: 'none',
      prettier: false,
      noConsole: 'off',
      noUnusedVars: 'warn',
      preferConst: 'warn',
      eqeqeq: 'error',
      noVar: 'error',
    },
  },
  {
    name: 'Vue',
    description: 'Vue 3 + TypeScript. eslint-plugin-vue recommended 규칙 포함.',
    source: 'https://eslint.vuejs.org/',
    values: {
      language: 'typescript',
      framework: 'vue',
      prettier: true,
      importPlugin: true,
      noConsole: 'warn',
      noUnusedVars: 'warn',
      preferConst: 'error',
      eqeqeq: 'error',
      noVar: 'error',
    },
  },
]
