/**
 * CLAUDE.md 생성기.
 *
 * Claude Code는 AGENTS.md를 직접 읽지 않으므로 CLAUDE.md에서 임포트한다 (ADR-0017, CP-3).
 *
 * - claudeCodeOnly === true: AGENTS.md를 만들지 않는다는 신호 → CLAUDE.md를 단일 진실원으로 작성
 * - claudeCodeOnly === false: 본문 첫 줄에 `@AGENTS.md` 임포트 + Claude 특화 메모만 추가
 */

import type { AiConfigInput, ClaudeMdOutput } from '@/types/aiConfig'

import { buildSharedBody } from './shared/sectionBuilder'

/** Claude Code 단독 사용 시 CLAUDE.md 헤더 */
const STANDALONE_HEADER: readonly string[] = [
  '# Project Instructions',
  '',
  'This file provides persistent instructions for Claude Code.',
  '',
]

/** AGENTS.md 임포트 시 CLAUDE.md 본문 */
const IMPORT_HEADER: readonly string[] = [
  '@AGENTS.md',
  '',
  '# Claude Code Notes',
  '',
  'This project shares its core agent instructions via AGENTS.md (imported above).',
  'Add Claude-specific guidance below if needed; otherwise the imported content is sufficient.',
  '',
]

/**
 * 사용자 입력으로부터 CLAUDE.md 출력 모델을 만든다.
 */
export const generateClaudeMd = (input: AiConfigInput): ClaudeMdOutput => {
  const importAgentsMd = !input.tools.claudeCodeOnly

  let body: string
  if (importAgentsMd) {
    // 임포트 모드 — Claude 특화 헤더만 출력 (실제 내용은 AGENTS.md)
    body = `${IMPORT_HEADER.join('\n')}\n`
  } else {
    // 단독 모드 — 6대 섹션 본문을 CLAUDE.md에 직접 작성
    const sharedBody = buildSharedBody(input)
    body = `${STANDALONE_HEADER.join('\n')}${sharedBody}\n`
  }

  return {
    fileName: 'CLAUDE.md',
    outputPath: 'CLAUDE.md',
    importAgentsMd,
    body,
  }
}
