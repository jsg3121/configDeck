/**
 * Cursor MDC `globs` 범용 패턴.
 * `.cursor/rules/stack.mdc`에 들어가 파일 패턴 매칭 시 자동 적용된다.
 *
 * Phase A에서 스택 입력을 제거하면서 모든 프로젝트에 적용 가능한 범용 패턴으로 단일화한다.
 * 추후 스택 입력이 다시 필요해지면 스택별 분기를 추가할 수 있다.
 */

/**
 * Cursor MDC globs 범용 패턴 (쉼표 구분 문자열, RES-0003 §1.1).
 * TypeScript/JavaScript/Astro/Vue/Svelte 등 일반적인 프로젝트 소스 파일을 폭넓게 커버한다.
 */
export const DEFAULT_CURSOR_GLOBS = '**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.astro, **/*.vue, **/*.svelte'
