/**
 * MVP 지원 파일 4개의 메타데이터를 정의한다.
 * 파일별 생성기 페이지([configFile].astro)와 생성기 허브에서 공통으로 사용한다.
 */
export const FILE_DEFINITIONS = [
  {
    slug: 'eslint-config',
    fileName: 'eslint.config.mjs',
    titleEn: 'ESLint Config Generator',
    titleKo: 'ESLint 설정 생성기',
    descriptionEn:
      'Generate a modern ESLint flat config with TypeScript, framework support, and custom rules.',
    descriptionKo:
      'TypeScript, 프레임워크 지원, 커스텀 규칙이 포함된 최신 ESLint flat config를 생성합니다.',
    supportsMigration: true,
    presets: ['Minimal', 'Recommended', 'Strict'],
    sections: [
      {
        titleEn: 'Language',
        titleKo: '언어',
        descriptionEn: 'Choose the base language for your project.',
        descriptionKo: '프로젝트의 기본 언어를 선택하세요.',
        type: 'radio' as const,
        name: 'language',
        options: [
          { label: 'JavaScript', value: 'javascript', checked: false },
          { label: 'TypeScript', value: 'typescript', checked: true },
        ],
      },
      {
        titleEn: 'Framework',
        titleKo: '프레임워크',
        descriptionEn: 'Select your project framework for tailored rules.',
        descriptionKo: '프로젝트 프레임워크를 선택하면 맞춤 규칙이 적용됩니다.',
        type: 'radio' as const,
        name: 'framework',
        options: [
          { label: 'None', value: 'none', checked: true },
          { label: 'React', value: 'react', checked: false },
          { label: 'Vue', value: 'vue', checked: false },
          { label: 'Next.js', value: 'nextjs', checked: false },
          { label: 'Node', value: 'node', checked: false },
        ],
      },
      {
        titleEn: 'Rules',
        titleKo: '규칙',
        descriptionEn: 'Enable individual lint rules for your project.',
        descriptionKo: '프로젝트에 적용할 린트 규칙을 선택하세요.',
        type: 'checkbox' as const,
        options: [
          { label: 'Import sorting', value: 'import-sorting', checked: true },
          { label: 'No console (warn)', value: 'no-console', checked: true },
          { label: 'Prefer const', value: 'prefer-const', checked: true },
          { label: 'No unused vars', value: 'no-unused-vars', checked: false },
        ],
      },
      {
        titleEn: 'Integrations',
        titleKo: '통합',
        descriptionEn: 'Add support for additional tools and frameworks.',
        descriptionKo: '추가 도구 및 프레임워크 지원을 추가하세요.',
        type: 'checkbox' as const,
        options: [
          { label: 'Prettier integration', value: 'prettier', checked: true },
          { label: 'Svelte support', value: 'svelte', checked: false },
          { label: 'Astro support', value: 'astro', checked: false },
        ],
      },
    ],
    sampleCode: `// eslint.config.mjs
import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

export default [
  ...tseslint.configs.strict,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]`,
  },
  {
    slug: 'prettier-config',
    fileName: 'prettier.config.mjs',
    titleEn: 'Prettier Config Generator',
    titleKo: 'Prettier 설정 생성기',
    descriptionEn: 'Generate a Prettier config with your preferred formatting rules.',
    descriptionKo: '선호하는 포맷팅 규칙으로 Prettier 설정을 생성합니다.',
    supportsMigration: false,
    presets: ['Default', 'Minimal', 'Opinionated'],
    sections: [
      {
        titleEn: 'Formatting',
        titleKo: '포맷팅',
        descriptionEn: 'Configure your formatting preferences.',
        descriptionKo: '포맷팅 환경설정을 구성하세요.',
        type: 'checkbox' as const,
        options: [
          { label: 'singleQuote', value: 'single-quote', checked: true },
          { label: 'semi', value: 'semi', checked: false },
          { label: 'trailingComma: all', value: 'trailing-comma', checked: true },
        ],
      },
    ],
    sampleCode: `/** @type {import("prettier").Config} */
export default {
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
}`,
  },
  {
    slug: 'tsconfig',
    fileName: 'tsconfig.json',
    titleEn: 'TypeScript Config Generator',
    titleKo: 'TypeScript 설정 생성기',
    descriptionEn: 'Generate a tsconfig.json with strict mode, path aliases, and modern settings.',
    descriptionKo: 'strict 모드, 경로 별칭, 최신 설정이 포함된 tsconfig.json을 생성합니다.',
    supportsMigration: false,
    presets: ['Minimal', 'Recommended', 'Strict'],
    sections: [
      {
        titleEn: 'Compiler Options',
        titleKo: '컴파일러 옵션',
        descriptionEn: 'Configure TypeScript compiler options.',
        descriptionKo: 'TypeScript 컴파일러 옵션을 구성하세요.',
        type: 'checkbox' as const,
        options: [
          { label: 'Enable strict mode', value: 'strict', checked: true },
          { label: 'Skip lib check', value: 'skip-lib-check', checked: true },
          { label: 'ES module interop', value: 'es-module-interop', checked: true },
        ],
      },
    ],
    sampleCode: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
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
  },
  {
    slug: 'gitignore',
    fileName: '.gitignore',
    titleEn: '.gitignore Generator',
    titleKo: '.gitignore 생성기',
    descriptionEn: 'Generate a .gitignore file for your OS, IDE, and framework.',
    descriptionKo: 'OS, IDE, 프레임워크에 맞는 .gitignore 파일을 생성합니다.',
    supportsMigration: false,
    presets: ['Node', 'React', 'Full Stack'],
    sections: [
      {
        titleEn: 'Patterns',
        titleKo: '패턴',
        descriptionEn: 'Select which patterns to include.',
        descriptionKo: '포함할 패턴을 선택하세요.',
        type: 'checkbox' as const,
        options: [
          { label: 'Node (node_modules, npm-debug.log)', value: 'node', checked: true },
          { label: 'macOS (.DS_Store, .AppleDouble)', value: 'macos', checked: true },
          { label: 'VS Code (.vscode/, *.code-workspace)', value: 'vscode', checked: true },
          { label: 'JetBrains (.idea/, *.iml)', value: 'jetbrains', checked: false },
          { label: 'Build output (dist/, build/)', value: 'build', checked: true },
        ],
      },
    ],
    sampleCode: `# Dependencies
node_modules/
npm-debug.log*

# Build output
dist/
build/

# OS
.DS_Store
.AppleDouble

# IDE
.vscode/
*.code-workspace`,
  },
] as const

export type FileDefinition = (typeof FILE_DEFINITIONS)[number]
