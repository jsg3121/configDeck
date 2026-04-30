/**
 * GitHub Copilot 저장소 인스트럭션 생성기.
 *
 * 출력: `.github/copilot-instructions.md` (단일 파일, frontmatter 없음).
 * Phase A에서는 path-specific instructions를 생성하지 않는다 (Phase B로 이연).
 *
 * 형식 출처: RES-0003 §1.2.
 */

import type { AiConfigInput, CopilotInstructionsOutput } from '@/types/aiConfig'

import { buildSharedBody } from './shared/sectionBuilder'

/** Copilot 인스트럭션 헤더 */
const HEADER_LINES: readonly string[] = [
  '# Repository Custom Instructions',
  '',
  'These instructions guide GitHub Copilot for this repository.',
  '',
]

/**
 * 사용자 입력으로부터 .github/copilot-instructions.md 출력 모델을 만든다.
 */
export const generateCopilotInstructions = (input: AiConfigInput): CopilotInstructionsOutput => {
  const sharedBody = buildSharedBody(input)
  const body = `${HEADER_LINES.join('\n')}${sharedBody}\n`

  return {
    fileName: 'copilot-instructions.md',
    outputPath: '.github/copilot-instructions.md',
    body,
  }
}
