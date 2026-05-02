/**
 * AI 도구 설정 + Skills 통합 생성기.
 *
 * UI 진입점에서 호출한다. enabledTools에 따라 산출물을 조건부 포함한다:
 * - AGENTS.md: 항상 생성 (모든 도구의 1순위 산출물, ADR-0017)
 * - CLAUDE.md: claude-code 사용 시
 * - Cursor MDC 3파일: cursor 사용 시
 * - Copilot instructions: copilot 사용 시
 * - SKILL.md 목록: selectedSkillIds 기반
 */

import type { AiConfigInput, AiConfigOutput } from '@/types/aiConfig'

import { generateAgentsMd } from './generateAgentsMd'
import { generateClaudeMd } from './generateClaudeMd'
import { generateCopilotInstructions } from './generateCopilotInstructions'
import { generateCursorMdc } from './generateCursorMdc'
import { generateSkills } from './generateSkills'

/**
 * 사용자 입력으로부터 모든 AI 설정 + Skills 출력을 생성한다.
 */
export const generateAiConfig = (input: AiConfigInput): AiConfigOutput => {
  const enabled = new Set(input.tools.enabledTools)

  return {
    agentsMd: generateAgentsMd(input),
    claudeMd: enabled.has('claude-code') ? generateClaudeMd(input) : undefined,
    cursorMdc: enabled.has('cursor') ? generateCursorMdc(input) : undefined,
    copilotInstructions: enabled.has('copilot') ? generateCopilotInstructions(input) : undefined,
    skills: generateSkills(input),
  }
}
