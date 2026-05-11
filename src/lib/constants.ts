/**
 * 아티클 도구 목록
 *
 * 새로운 RSS 피드 소스를 추가할 때 이 배열에 도구를 추가한다.
 * content.config.ts의 스키마와 동기화되어야 한다.
 */
export const ARTICLE_TOOLS = [
  'eslint',
  'prettier',
  'typescript',
  'nextjs',
  'react',
  'astro',
  'nodejs',
  'webdev',
  'tailwindcss',
  'vite',
  'smashingmagazine',
  'csstricks',
  'searchenginejournal',
  'googlesearchcentral',
  'javascriptweekly',
] as const

export type ArticleTool = (typeof ARTICLE_TOOLS)[number]

/**
 * 도구별 Tailwind 색상 클래스
 */
export const TOOL_COLORS: Record<ArticleTool, string> = {
  eslint: 'bg-purple-100 text-purple-800',
  prettier: 'bg-pink-100 text-pink-800',
  typescript: 'bg-blue-100 text-blue-800',
  nextjs: 'bg-gray-100 text-gray-800',
  react: 'bg-cyan-100 text-cyan-800',
  astro: 'bg-orange-100 text-orange-800',
  nodejs: 'bg-green-100 text-green-800',
  webdev: 'bg-indigo-100 text-indigo-800',
  tailwindcss: 'bg-sky-100 text-sky-800',
  vite: 'bg-violet-100 text-violet-800',
  smashingmagazine: 'bg-red-100 text-red-800',
  csstricks: 'bg-amber-100 text-amber-800',
  searchenginejournal: 'bg-emerald-100 text-emerald-800',
  googlesearchcentral: 'bg-blue-100 text-blue-800',
  javascriptweekly: 'bg-yellow-100 text-yellow-800',
}

/**
 * 도구별 상세 색상 클래스 (배경, 텍스트, 테두리)
 */
export const TOOL_COLORS_DETAILED: Record<
  ArticleTool,
  { bg: string; text: string; border: string }
> = {
  eslint: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  prettier: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  typescript: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  nextjs: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  react: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  astro: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  nodejs: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  webdev: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  tailwindcss: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  vite: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  smashingmagazine: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  csstricks: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  searchenginejournal: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  googlesearchcentral: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  javascriptweekly: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
}

/**
 * 도구별 생성기 매핑
 * null인 경우 해당 도구의 설정 생성기가 없음
 */
export const TOOL_TO_GENERATOR: Record<ArticleTool, string | null> = {
  eslint: 'eslint-config',
  prettier: 'prettier-config',
  typescript: 'tsconfig',
  nextjs: 'nextjs',
  react: 'react-vite-ts',
  astro: 'astro',
  nodejs: 'nodejs',
  webdev: null,
  tailwindcss: null,
  vite: null,
  smashingmagazine: null,
  csstricks: null,
  searchenginejournal: null,
  googlesearchcentral: null,
  javascriptweekly: null,
}

/**
 * 도구/피드 식별자 → 사람이 읽는 출처명 매핑 (SPEC-0007 §3.2.3)
 *
 * Editorial Commentary 모델에서 본문과 JSON-LD `citation`/`isBasedOn`에 표시되는
 * 출처 표기에 사용된다. 같은 도구라도 RSS 피드 출처에 따라 표기가 달라야 할 수
 * 있으므로 도구명 자체와 분리해서 관리한다.
 */
export const SOURCE_NAME_MAP: Record<ArticleTool, string> = {
  eslint: 'ESLint Blog',
  prettier: 'Prettier Blog',
  typescript: 'Microsoft TypeScript Blog',
  nextjs: 'Next.js Blog',
  react: 'React Blog',
  astro: 'Astro Blog',
  nodejs: 'Node.js Blog',
  webdev: 'web.dev',
  tailwindcss: 'Tailwind CSS Blog',
  vite: 'Vite Blog',
  smashingmagazine: 'Smashing Magazine',
  csstricks: 'CSS-Tricks',
  searchenginejournal: 'Search Engine Journal',
  googlesearchcentral: 'Google Search Central',
  javascriptweekly: 'JavaScript Weekly',
}
