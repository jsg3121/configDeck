/**
 * MVP 지원 스택 프리셋 2개의 메타데이터를 정의한다.
 * 스택별 생성기 페이지([stack].astro)와 생성기 허브, 홈 페이지에서 공통으로 사용한다.
 */
export const STACK_DEFINITIONS = [
  {
    slug: 'react-vite-ts',
    name: 'React + Vite + TypeScript',
    icon: '\u269B\uFE0F',
    descriptionEn:
      'Generate all essential config files for a React project powered by Vite and TypeScript. Includes linting, formatting, and build configuration.',
    descriptionKo:
      'Vite와 TypeScript 기반 React 프로젝트에 필요한 모든 설정 파일을 생성합니다. 린팅, 포맷팅, 빌드 설정이 포함됩니다.',
    includedFiles: [
      {
        fileName: '.gitignore',
        slug: 'gitignore',
        options: [
          { label: 'Node (node_modules, npm-debug.log)', value: 'node', checked: true },
          { label: 'macOS (.DS_Store, .AppleDouble)', value: 'macos', checked: true },
          { label: 'VS Code (.vscode/, *.code-workspace)', value: 'vscode', checked: true },
        ],
      },
      {
        fileName: 'tsconfig.json',
        slug: 'tsconfig',
        options: [
          { label: 'Enable strict mode', value: 'strict', checked: true },
          { label: 'Path alias (@/*)', value: 'path-alias', checked: true },
        ],
      },
      {
        fileName: 'eslint.config.mjs',
        slug: 'eslint-config',
        options: [
          { label: 'TypeScript', value: 'typescript', checked: true },
          { label: 'React', value: 'react', checked: true },
          { label: 'Prettier integration', value: 'prettier', checked: true },
        ],
      },
      {
        fileName: 'prettier.config.mjs',
        slug: 'prettier-config',
        options: [
          { label: 'singleQuote', value: 'single-quote', checked: true },
          { label: 'semi', value: 'semi', checked: false },
        ],
      },
      {
        fileName: 'vite.config.ts',
        slug: 'vite-config',
        options: [
          { label: 'React plugin (@vitejs/plugin-react)', value: 'react-plugin', checked: true },
          { label: 'Path alias resolve (@/)', value: 'path-alias', checked: true },
        ],
      },
      {
        fileName: 'vitest.config.ts',
        slug: 'vitest-config',
        options: [
          { label: 'jsdom environment', value: 'jsdom', checked: true },
          { label: 'Coverage reporter (v8)', value: 'coverage', checked: false },
        ],
      },
    ],
    sampleFiles: {
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,
      '.gitignore': `# Dependencies
node_modules/
npm-debug.log*

# Build output
dist/
build/

# OS
.DS_Store

# IDE
.vscode/`,
      'eslint.config.mjs': `import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'

export default [
  ...tseslint.configs.recommended,
  {
    plugins: { react },
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
    },
  },
]`,
      'prettier.config.mjs': `export default {
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
}`,
      'vite.config.ts': `import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})`,
      'vitest.config.ts': `import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
})`,
    },
  },
  {
    slug: 'nextjs',
    name: 'Next.js + TypeScript',
    icon: '\u25B2',
    descriptionEn:
      'Generate config files for a Next.js project with TypeScript. Includes ESLint, Prettier, and Next.js configuration.',
    descriptionKo:
      'TypeScript 기반 Next.js 프로젝트에 필요한 설정 파일을 생성합니다. ESLint, Prettier, Next.js 설정이 포함됩니다.',
    includedFiles: [
      {
        fileName: '.gitignore',
        slug: 'gitignore',
        options: [
          { label: 'Node (node_modules, npm-debug.log)', value: 'node', checked: true },
          { label: 'Next.js (.next/, out/)', value: 'nextjs', checked: true },
          { label: 'macOS (.DS_Store)', value: 'macos', checked: true },
        ],
      },
      {
        fileName: 'tsconfig.json',
        slug: 'tsconfig',
        options: [
          { label: 'Enable strict mode', value: 'strict', checked: true },
          { label: 'Path alias (@/*)', value: 'path-alias', checked: true },
        ],
      },
      {
        fileName: 'eslint.config.mjs',
        slug: 'eslint-config',
        options: [
          { label: 'TypeScript', value: 'typescript', checked: true },
          { label: 'Next.js', value: 'nextjs', checked: true },
          { label: 'Prettier integration', value: 'prettier', checked: true },
        ],
      },
      {
        fileName: 'prettier.config.mjs',
        slug: 'prettier-config',
        options: [
          { label: 'singleQuote', value: 'single-quote', checked: true },
          { label: 'semi', value: 'semi', checked: false },
        ],
      },
      {
        fileName: 'next.config.js',
        slug: 'next-config',
        options: [
          { label: 'Strict mode', value: 'strict-mode', checked: true },
          { label: 'Image optimization', value: 'images', checked: false },
        ],
      },
    ],
    sampleFiles: {
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2017",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "incremental": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`,
      '.gitignore': `# Dependencies
node_modules/

# Next.js
.next/
out/

# Build
dist/

# OS
.DS_Store`,
      'eslint.config.mjs': `import tseslint from 'typescript-eslint'

export default [
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
    },
  },
]`,
      'prettier.config.mjs': `export default {
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
}`,
      'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`,
    },
  },
] as const

export type StackDefinition = (typeof STACK_DEFINITIONS)[number]
