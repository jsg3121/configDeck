/**
 * AGENTS.md 생성기.
 *
 * 1순위 산출물 — 모든 도구 사용 시 항상 생성한다 (ADR-0017).
 * 출력 형식: 자유 형식 Markdown, frontmatter 없음 (RES-0003 §1.4).
 */

import type { AgentsMdOutput, AiConfigInput } from '@/types/aiConfig'

import { buildSharedBody } from './shared/sectionBuilder'

/** AGENTS.md 헤더 라인 — 어느 도구가 읽는지 한눈에 보여준다 */
const HEADER_LINES: readonly string[] = [
  '# Agent Instructions',
  '',
  'This file provides shared instructions for AI coding agents.',
  'Following the AGENTS.md open standard (https://agents.md).',
  '',
]

/**
 * 사용자 입력으로부터 AGENTS.md 출력 모델을 만든다.
 */
export const generateAgentsMd = (input: AiConfigInput): AgentsMdOutput => {
  const sharedBody = buildSharedBody(input)
  const body = `${HEADER_LINES.join('\n')}${sharedBody}\n`

  return {
    fileName: 'AGENTS.md',
    outputPath: 'AGENTS.md',
    body,
  }
}
