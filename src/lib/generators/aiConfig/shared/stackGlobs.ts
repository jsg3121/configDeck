/**
 * 스택별 Cursor MDC `globs` 패턴.
 * `.cursor/rules/stack.mdc`에 들어가 파일 패턴 매칭 시 자동 적용된다.
 */

import type { AiConfigStackSlug } from '@/types/aiConfig'

/**
 * 스택 → Cursor MDC globs 패턴 (쉼표 구분 문자열, RES-0003 §1.1).
 * 스택의 주요 소스 파일을 가능한 넓게 커버한다.
 */
export const STACK_GLOBS: Readonly<Record<AiConfigStackSlug, string>> = {
  'react-vite-ts': 'src/**/*.ts, src/**/*.tsx',
  nextjs: 'app/**/*.ts, app/**/*.tsx, pages/**/*.ts, pages/**/*.tsx, src/**/*.ts, src/**/*.tsx',
  astro: 'src/**/*.astro, src/**/*.ts, src/**/*.tsx',
  nodejs: 'src/**/*.ts, src/**/*.js',
}
