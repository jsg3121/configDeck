/**
 * AI 설정 파일에 삽입될 베스트 프랙티스 카탈로그.
 *
 * - 카테고리: GitHub Blog 6대 핵심 섹션 (RES-0003 §2.2)
 * - outputText는 영어 (AI 모델 정확도 ↑)
 * - UI 라벨(label)은 한국어. 영어 UI 라벨은 M5 i18n에서 처리
 * - appliesTo 'all'은 모든 스택 공통, 그 외는 해당 스택 선택 시에만 노출
 */

import type { BestPracticeItem } from '@/types/aiConfig'

/** 범용 — 스택과 무관하게 모든 프로젝트에 적용 가능 */
export const UNIVERSAL_BEST_PRACTICES: readonly BestPracticeItem[] = [
  // commands
  {
    id: 'use-conventional-commands',
    label: '빌드/테스트 명령어를 항상 명시한다',
    outputText:
      'Always provide the exact build, test, and lint commands when proposing changes (e.g., `pnpm build`, `pnpm test`). Never assume the agent knows them.',
    category: 'commands',
    appliesTo: ['all'],
  },
  // testing
  {
    id: 'tests-must-pass-before-merge',
    label: '머지 전 모든 테스트 통과 필수',
    outputText: 'All tests must pass locally before opening a pull request. Do not push failing tests.',
    category: 'testing',
    appliesTo: ['all'],
  },
  {
    id: 'add-tests-for-new-code',
    label: '신규 기능에는 테스트를 함께 추가한다',
    outputText: 'Every new feature or bug fix must include corresponding unit or integration tests.',
    category: 'testing',
    appliesTo: ['all'],
  },
  // project-structure
  {
    id: 'follow-existing-folder-structure',
    label: '기존 폴더 구조와 네이밍을 따른다',
    outputText:
      'Follow the existing folder structure and naming conventions of this repository. Do not introduce new top-level directories without justification.',
    category: 'project-structure',
    appliesTo: ['all'],
  },
  // code-style
  {
    id: 'no-typescript-any',
    label: 'TypeScript any 금지',
    outputText: 'Never use the `any` type in TypeScript. Prefer `unknown` with type narrowing or precise types.',
    category: 'code-style',
    appliesTo: ['typescript'],
  },
  {
    id: 'avoid-type-assertions',
    label: 'TypeScript as 단언 지양',
    outputText:
      'Avoid using `as` type assertions. Prefer type guards, `satisfies`, or proper schema validation (Zod, etc.).',
    category: 'code-style',
    appliesTo: ['typescript'],
  },
  {
    id: 'function-line-limit',
    label: '함수당 50줄 제한',
    outputText:
      'Keep individual functions under 50 lines. If a function grows larger, refactor into smaller composable pieces.',
    category: 'code-style',
    appliesTo: ['all'],
  },
  {
    id: 'meaningful-naming',
    label: '명확한 변수/함수 이름 사용',
    outputText:
      'Use descriptive, intention-revealing names for variables, functions, and types. Avoid abbreviations and single-letter names except in tight loops.',
    category: 'code-style',
    appliesTo: ['all'],
  },
  {
    id: 'no-magic-numbers',
    label: '매직 넘버 사용 금지',
    outputText:
      'Do not use magic numbers or strings inline. Extract them into named constants with descriptive names.',
    category: 'code-style',
    appliesTo: ['all'],
  },
  {
    id: 'minimal-comments',
    label: '필요한 곳에만 주석 작성',
    outputText:
      'Default to writing no comments. Only add a comment when the WHY is non-obvious (a hidden constraint, subtle invariant, or a workaround for a specific bug).',
    category: 'code-style',
    appliesTo: ['all'],
  },
  // git-workflow
  {
    id: 'conventional-commits',
    label: 'Conventional Commits 형식 준수',
    outputText:
      'All commit messages must follow the Conventional Commits specification: `<type>(<scope>): <description>`. Valid types: feat, fix, refactor, docs, chore, test, perf, style.',
    category: 'git-workflow',
    appliesTo: ['all'],
  },
  {
    id: 'small-focused-prs',
    label: 'PR은 작고 단일 목적으로 유지',
    outputText:
      'Keep pull requests small and focused on a single concern. If multiple unrelated changes are needed, open separate PRs.',
    category: 'git-workflow',
    appliesTo: ['all'],
  },
  // boundaries
  {
    id: 'no-secrets-in-code',
    label: '코드에 시크릿/API 키 직접 작성 금지',
    outputText:
      'Never commit secrets, API keys, or credentials to the repository. Use environment variables and `.env` files (gitignored).',
    category: 'boundaries',
    appliesTo: ['all'],
  },
  {
    id: 'ask-before-deps',
    label: '신규 의존성 추가 전 사용자에게 확인',
    outputText:
      'Before adding a new npm dependency, confirm with the user. Prefer existing utilities or write a small helper instead.',
    category: 'boundaries',
    appliesTo: ['all'],
  },
  {
    id: 'no-destructive-git',
    label: '파괴적 git 명령은 사용자 승인 필요',
    outputText:
      'Never run destructive git commands (force push, reset --hard, branch -D) without explicit user approval.',
    category: 'boundaries',
    appliesTo: ['all'],
  },
] as const

/** React 스택 의존 항목 */
const REACT_BEST_PRACTICES: readonly BestPracticeItem[] = [
  {
    id: 'react-functional-components-only',
    label: '함수형 컴포넌트만 사용 (class 컴포넌트 금지)',
    outputText:
      'Use functional components exclusively. Do not write class components. Manage state with hooks (`useState`, `useReducer`).',
    category: 'code-style',
    appliesTo: ['react-vite-ts', 'nextjs'],
  },
  {
    id: 'react-explicit-effect-deps',
    label: 'useEffect 의존성 배열 명시 필수',
    outputText:
      'Always specify the full dependency array for `useEffect`, `useMemo`, and `useCallback`. Never use empty arrays unless intentionally running once on mount.',
    category: 'code-style',
    appliesTo: ['react-vite-ts', 'nextjs'],
  },
  {
    id: 'react-no-default-export-components',
    label: '컴포넌트는 named export 사용',
    outputText:
      'Use named exports for React components, not default exports. This improves refactoring and consistency.',
    category: 'code-style',
    appliesTo: ['react-vite-ts', 'nextjs'],
  },
] as const

/** Next.js 스택 의존 항목 */
const NEXTJS_BEST_PRACTICES: readonly BestPracticeItem[] = [
  {
    id: 'nextjs-app-router-preferred',
    label: 'App Router (app/) 사용 — Pages Router 지양',
    outputText:
      'Use the App Router (`app/` directory) for all new pages. Do not add new files to `pages/` unless required for legacy compatibility.',
    category: 'project-structure',
    appliesTo: ['nextjs'],
  },
  {
    id: 'nextjs-server-components-default',
    label: 'Server Component 기본, Client Component는 명시적으로',
    outputText:
      'Default to React Server Components. Add `"use client"` only when interactivity (state, effects, event handlers) is required.',
    category: 'code-style',
    appliesTo: ['nextjs'],
  },
] as const

/** Astro 스택 의존 항목 */
const ASTRO_BEST_PRACTICES: readonly BestPracticeItem[] = [
  {
    id: 'astro-zero-js-default',
    label: '기본은 정적 — 인터랙션 필요 시에만 island 사용',
    outputText:
      'Astro pages should ship zero JavaScript by default. Add interactive islands (`client:*` directives) only when actually needed.',
    category: 'code-style',
    appliesTo: ['astro'],
  },
  {
    id: 'astro-prefer-content-collections',
    label: 'Markdown/MDX는 Content Collections로 관리',
    outputText:
      'Manage Markdown and MDX content through Astro Content Collections with Zod schemas for type safety.',
    category: 'project-structure',
    appliesTo: ['astro'],
  },
] as const

/** Node.js 스택 의존 항목 */
const NODEJS_BEST_PRACTICES: readonly BestPracticeItem[] = [
  {
    id: 'nodejs-async-await-only',
    label: 'async/await 사용, 콜백 지양',
    outputText:
      'Use async/await for asynchronous code. Do not use callback-style APIs unless interfacing with legacy code.',
    category: 'code-style',
    appliesTo: ['nodejs'],
  },
  {
    id: 'nodejs-validate-inputs',
    label: '외부 입력은 항상 스키마로 검증',
    outputText:
      'Validate all external inputs (HTTP request bodies, environment variables, file contents) with a schema validator like Zod.',
    category: 'boundaries',
    appliesTo: ['nodejs'],
  },
] as const

/** Tailwind 사용 시 적용 가능한 항목 */
const TAILWIND_BEST_PRACTICES: readonly BestPracticeItem[] = [
  {
    id: 'tailwind-utility-first',
    label: '유틸리티 우선 사용, @apply 지양',
    outputText:
      'Use Tailwind utility classes directly in markup. Avoid `@apply` except for genuinely reusable component patterns.',
    category: 'code-style',
    appliesTo: ['tailwind'],
  },
  {
    id: 'tailwind-no-arbitrary-values',
    label: '임의 값(arbitrary values) 사용 최소화',
    outputText:
      'Prefer Tailwind theme tokens over arbitrary values. Use `[]` syntax only when no theme token fits.',
    category: 'code-style',
    appliesTo: ['tailwind'],
  },
] as const

/**
 * 전체 베스트 프랙티스 카탈로그.
 * 호출 측에서 사용자 선택한 스택에 맞게 필터링한다.
 */
export const BEST_PRACTICES_CATALOG: readonly BestPracticeItem[] = [
  ...UNIVERSAL_BEST_PRACTICES,
  ...REACT_BEST_PRACTICES,
  ...NEXTJS_BEST_PRACTICES,
  ...ASTRO_BEST_PRACTICES,
  ...NODEJS_BEST_PRACTICES,
  ...TAILWIND_BEST_PRACTICES,
]
