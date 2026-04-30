/**
 * Boundaries 3-tier 카탈로그.
 *
 * GitHub Blog의 AGENTS.md 분석에서 도출된 ✅ Always do / ⚠️ Ask first / 🚫 Never do
 * 3-tier 시스템 (RES-0003 §2.2).
 *
 * - outputText는 영어 (AI 모델 정확도 ↑)
 * - tier별로 사용자가 선택하면 AGENTS.md/CLAUDE.md의 Boundaries 섹션에 삽입
 */

import type { BoundaryItem } from '@/types/aiConfig'

/** ✅ Always do — 항상 수행해야 하는 행동 */
const ALWAYS_DO_ITEMS: readonly BoundaryItem[] = [
  {
    id: 'always-run-tests',
    label: '변경 후 항상 테스트 실행',
    outputText: 'Always run the test suite after making changes and before reporting completion.',
    tier: 'always-do',
    appliesTo: ['all'],
  },
  {
    id: 'always-typecheck',
    label: '변경 후 타입 체크 실행',
    outputText:
      'Always run type checking (`tsc --noEmit` or equivalent) after modifying TypeScript files.',
    tier: 'always-do',
    appliesTo: ['typescript'],
  },
  {
    id: 'always-lint',
    label: '커밋 전 린트 실행',
    outputText: 'Always run the linter (`pnpm lint` or equivalent) before committing.',
    tier: 'always-do',
    appliesTo: ['all'],
  },
  {
    id: 'always-explain-failures',
    label: '실패 시 원인을 명확히 설명',
    outputText:
      'When a command fails, explain the root cause clearly. Do not silently retry or work around it.',
    tier: 'always-do',
    appliesTo: ['all'],
  },
  {
    id: 'always-prefer-existing-utilities',
    label: '신규 작성보다 기존 유틸 재사용 우선',
    outputText: 'Prefer reusing existing utilities and helpers over writing new ones.',
    tier: 'always-do',
    appliesTo: ['all'],
  },
] as const

/** ⚠️ Ask first — 진행 전 확인이 필요한 행동 */
const ASK_FIRST_ITEMS: readonly BoundaryItem[] = [
  {
    id: 'ask-before-deps',
    label: '신규 npm 패키지 추가 전 확인',
    outputText:
      'Ask the user before adding any new npm dependency. Justify why an existing utility cannot be used.',
    tier: 'ask-first',
    appliesTo: ['all'],
  },
  {
    id: 'ask-before-arch-change',
    label: '아키텍처 변경 전 확인',
    outputText:
      'Ask before making architectural changes (new top-level directories, framework upgrades, build tool swaps).',
    tier: 'ask-first',
    appliesTo: ['all'],
  },
  {
    id: 'ask-before-bulk-edits',
    label: '대규모 파일 수정 전 확인',
    outputText:
      'Ask before making bulk edits across many files (rename refactors, mass formatting changes).',
    tier: 'ask-first',
    appliesTo: ['all'],
  },
  {
    id: 'ask-before-public-api-change',
    label: '공개 API 변경 전 확인',
    outputText:
      'Ask before changing public APIs, exported types, or interfaces consumed by other packages.',
    tier: 'ask-first',
    appliesTo: ['all'],
  },
] as const

/** 🚫 Never do — 절대 하지 말아야 할 행동 */
const NEVER_DO_ITEMS: readonly BoundaryItem[] = [
  {
    id: 'never-commit-secrets',
    label: '시크릿/API 키 커밋 금지',
    outputText:
      'Never commit secrets, API keys, tokens, or credentials. Use environment variables instead.',
    tier: 'never-do',
    appliesTo: ['all'],
  },
  {
    id: 'never-force-push',
    label: 'force push, reset --hard 금지',
    outputText:
      'Never force push to shared branches or run `git reset --hard` without explicit user approval.',
    tier: 'never-do',
    appliesTo: ['all'],
  },
  {
    id: 'never-skip-hooks',
    label: '--no-verify 등 훅 우회 금지',
    outputText:
      'Never bypass git hooks (`--no-verify`) or skip CI checks. If a hook fails, fix the underlying issue.',
    tier: 'never-do',
    appliesTo: ['all'],
  },
  {
    id: 'never-disable-typescript',
    label: '@ts-ignore, @ts-nocheck 금지',
    outputText:
      'Never use `@ts-ignore`, `@ts-nocheck`, or `@ts-expect-error` to suppress type errors. Fix the underlying type issue.',
    tier: 'never-do',
    appliesTo: ['typescript'],
  },
  {
    id: 'never-eslint-disable',
    label: 'eslint-disable 광범위 사용 금지',
    outputText:
      'Never disable ESLint rules at file or block level without justification. Fix the underlying code instead.',
    tier: 'never-do',
    appliesTo: ['all'],
  },
  {
    id: 'never-modify-lockfile',
    label: '수동으로 lockfile 편집 금지',
    outputText:
      'Never edit `pnpm-lock.yaml` (or equivalent) manually. Always regenerate via the package manager.',
    tier: 'never-do',
    appliesTo: ['all'],
  },
] as const

/**
 * 전체 Boundaries 카탈로그.
 * tier 필드로 분류된 항목을 호출 측에서 적절히 필터링/그룹핑한다.
 */
export const BOUNDARIES_CATALOG: readonly BoundaryItem[] = [
  ...ALWAYS_DO_ITEMS,
  ...ASK_FIRST_ITEMS,
  ...NEVER_DO_ITEMS,
]
