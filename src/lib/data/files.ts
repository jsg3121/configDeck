/**
 * 지원 파일 메타데이터를 정의한다.
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
    presets: ['TypeScript Strict', 'Next.js', 'Airbnb', 'Standard', 'Vue'],
  },
  {
    slug: 'prettier-config',
    fileName: 'prettier.config.mjs',
    titleEn: 'Prettier Config Generator',
    titleKo: 'Prettier 설정 생성기',
    descriptionEn: 'Generate a Prettier config with your preferred formatting rules.',
    descriptionKo: '선호하는 포맷팅 규칙으로 Prettier 설정을 생성합니다.',
    presets: ['Prettier Default', 'Standard JS', 'Airbnb-like', 'Minimal'],
  },
  {
    slug: 'tsconfig',
    fileName: 'tsconfig.json',
    titleEn: 'TypeScript Config Generator',
    titleKo: 'TypeScript 설정 생성기',
    descriptionEn: 'Generate a tsconfig.json with strict mode, path aliases, and modern settings.',
    descriptionKo: 'strict 모드, 경로 별칭, 최신 설정이 포함된 tsconfig.json을 생성합니다.',
    presets: ['Node 20', 'React + Vite', 'Next.js', 'Astro', 'Library', 'Strict'],
  },
  {
    slug: 'gitignore',
    fileName: '.gitignore',
    titleEn: '.gitignore Generator',
    titleKo: '.gitignore 생성기',
    descriptionEn: 'Generate a .gitignore file for your OS, IDE, and framework.',
    descriptionKo: 'OS, IDE, 프레임워크에 맞는 .gitignore 파일을 생성합니다.',
    presets: ['Node', 'Full Stack', 'Minimal'],
  },
  {
    slug: 'vite-config',
    fileName: 'vite.config.ts',
    titleEn: 'Vite Config Generator',
    titleKo: 'Vite 설정 생성기',
    descriptionEn: 'Generate a Vite config with plugins, path aliases, and dev server options.',
    descriptionKo: '플러그인, 경로 별칭, 개발 서버 옵션이 포함된 Vite 설정을 생성합니다.',
    presets: ['React', 'Vue', 'Svelte', 'Minimal'],
  },
  {
    slug: 'vitest-config',
    fileName: 'vitest.config.ts',
    titleEn: 'Vitest Config Generator',
    titleKo: 'Vitest 설정 생성기',
    descriptionEn: 'Generate a Vitest config with test environment, coverage, and setup files.',
    descriptionKo: '테스트 환경, 커버리지, 셋업 파일이 포함된 Vitest 설정을 생성합니다.',
    presets: ['React', 'Node', 'Vue', 'Minimal'],
  },
  {
    slug: 'next-config',
    fileName: 'next.config.js',
    titleEn: 'Next.js Config Generator',
    titleKo: 'Next.js 설정 생성기',
    descriptionEn: 'Generate a Next.js config with images, redirects, and webpack customization.',
    descriptionKo: '이미지, 리다이렉트, webpack 커스터마이즈를 위한 Next.js 설정을 생성합니다.',
    presets: ['Standard', 'Docker', 'Static Export', 'Minimal'],
  },
  {
    slug: 'editorconfig',
    fileName: '.editorconfig',
    titleEn: '.editorconfig Generator',
    titleKo: '.editorconfig 생성기',
    descriptionEn:
      'Generate an .editorconfig file for consistent coding styles across editors and IDEs.',
    descriptionKo: '에디터와 IDE 간 일관된 코딩 스타일을 위한 .editorconfig 파일을 생성합니다.',
    presets: ['Standard', 'Tabs', '4-Space', 'Minimal'],
  },
  {
    slug: 'env',
    fileName: '.env',
    titleEn: '.env Generator',
    titleKo: '.env 생성기',
    descriptionEn: 'Generate an .env file with environment variables for your project.',
    descriptionKo: '프로젝트에 필요한 환경 변수가 포함된 .env 파일을 생성합니다.',
    presets: ['Frontend', 'Backend', 'Full Stack'],
  },
] as const

export type FileDefinition = (typeof FILE_DEFINITIONS)[number]

/**
 * 파일 slug → 함께 자주 사용되는 관련 파일 slug 목록 매핑.
 * 파일 생성기 좌측 패널 하단 "함께 쓰면 좋아요" 섹션에서 참조한다.
 * 옵션이 적은 파일의 빈 공간을 채우고, 내부 링크로 탐색 깊이를 높이기 위함.
 */
export const RELATED_FILES: Record<string, readonly string[]> = {
  'eslint-config': ['prettier-config', 'editorconfig'],
  'prettier-config': ['eslint-config', 'editorconfig'],
  tsconfig: ['eslint-config', 'vite-config'],
  gitignore: ['editorconfig', 'env'],
  'vite-config': ['tsconfig', 'vitest-config'],
  'vitest-config': ['vite-config', 'tsconfig'],
  'next-config': ['tsconfig', 'eslint-config'],
  editorconfig: ['gitignore', 'prettier-config'],
  env: ['gitignore', 'editorconfig'],
}

/**
 * 주어진 slug의 관련 파일 메타데이터를 반환한다.
 */
export const getRelatedFiles = (slug: string): readonly FileDefinition[] => {
  const relatedSlugs = RELATED_FILES[slug] ?? []
  return relatedSlugs
    .map((relatedSlug) => FILE_DEFINITIONS.find((file) => file.slug === relatedSlug))
    .filter((file): file is FileDefinition => file !== undefined)
}
