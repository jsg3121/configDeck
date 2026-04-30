/**
 * Copilot 인스트럭션 생성기 테스트
 */
import { describe, expect, it } from 'vitest'

import { generateCopilotInstructions } from '@/lib/generators/aiConfig/generateCopilotInstructions'
import type { AiConfigInput } from '@/types/aiConfig'

const makeInput = (overrides: Partial<AiConfigInput> = {}): AiConfigInput => ({
  stack: { stack: 'react-vite-ts' },
  bestPractices: { selectedIds: [], additionalNotes: '' },
  boundaries: { alwaysDoIds: [], askFirstIds: [], neverDoIds: [] },
  tools: { enabledTools: ['copilot'], claudeCodeOnly: false },
  selectedSkillIds: [],
  locale: 'ko',
  ...overrides,
})

describe('generateCopilotInstructions', () => {
  describe('출력 모델 구조', () => {
    it('파일명은 copilot-instructions.md, 경로는 .github/ 하위이다', () => {
      const result = generateCopilotInstructions(makeInput())

      expect(result.fileName).toBe('copilot-instructions.md')
      expect(result.outputPath).toBe('.github/copilot-instructions.md')
    })

    it('본문은 Copilot 헤더로 시작한다', () => {
      const result = generateCopilotInstructions(makeInput())

      expect(result.body).toContain('# Repository Custom Instructions')
    })
  })

  describe('베스트 프랙티스 출력', () => {
    it('선택된 항목이 본문에 포함된다', () => {
      const result = generateCopilotInstructions(
        makeInput({
          bestPractices: {
            selectedIds: ['no-typescript-any', 'conventional-commits'],
            additionalNotes: '',
          },
        })
      )

      expect(result.body).toContain('Never use the `any` type')
      expect(result.body).toContain('Conventional Commits')
    })
  })

  describe('Boundaries 통합', () => {
    it('3-tier Boundaries가 본문에 포함된다', () => {
      const result = generateCopilotInstructions(
        makeInput({
          boundaries: {
            alwaysDoIds: ['always-run-tests'],
            askFirstIds: [],
            neverDoIds: ['never-commit-secrets'],
          },
        })
      )

      expect(result.body).toContain('### ✅ Always do')
      expect(result.body).toContain('### 🚫 Never do')
      expect(result.body).not.toContain('### ⚠️ Ask first')
    })
  })
})
