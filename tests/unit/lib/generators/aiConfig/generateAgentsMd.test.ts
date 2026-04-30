/**
 * AGENTS.md 생성기 테스트
 */
import { describe, expect, it } from 'vitest'

import { generateAgentsMd } from '@/lib/generators/aiConfig/generateAgentsMd'
import type { AiConfigInput } from '@/types/aiConfig'

const makeInput = (overrides: Partial<AiConfigInput> = {}): AiConfigInput => ({
  stack: { stack: 'react-vite-ts' },
  bestPractices: { selectedIds: [], additionalNotes: '' },
  boundaries: { alwaysDoIds: [], askFirstIds: [], neverDoIds: [] },
  tools: { enabledTools: ['cursor', 'codex'], claudeCodeOnly: false },
  selectedSkillIds: [],
  locale: 'ko',
  ...overrides,
})

describe('generateAgentsMd', () => {
  describe('출력 모델 구조', () => {
    it('파일명과 경로는 항상 AGENTS.md이다', () => {
      const result = generateAgentsMd(makeInput())

      expect(result.fileName).toBe('AGENTS.md')
      expect(result.outputPath).toBe('AGENTS.md')
    })

    it('본문은 헤더 + 표준 안내 라인을 포함한다', () => {
      const result = generateAgentsMd(makeInput())

      expect(result.body).toContain('# Agent Instructions')
      expect(result.body).toContain('https://agents.md')
    })
  })

  describe('베스트 프랙티스 출력', () => {
    it('선택한 항목이 해당 카테고리 섹션에 들어간다', () => {
      const result = generateAgentsMd(
        makeInput({
          bestPractices: {
            selectedIds: ['no-typescript-any', 'conventional-commits'],
            additionalNotes: '',
          },
        })
      )

      expect(result.body).toContain('## Code Style')
      expect(result.body).toContain('Never use the `any` type')
      expect(result.body).toContain('## Git Workflow')
      expect(result.body).toContain('Conventional Commits specification')
    })

    it('선택하지 않은 카테고리는 출력에 없다', () => {
      const result = generateAgentsMd(
        makeInput({
          bestPractices: {
            selectedIds: ['no-typescript-any'],
            additionalNotes: '',
          },
        })
      )

      expect(result.body).not.toContain('## Testing')
      expect(result.body).not.toContain('## Git Workflow')
    })

    it('boundaries 카테고리 항목은 Boundaries 섹션에 통합된다', () => {
      const result = generateAgentsMd(
        makeInput({
          bestPractices: {
            selectedIds: ['no-secrets-in-code'],
            additionalNotes: '',
          },
        })
      )

      expect(result.body).toContain('## Boundaries')
      expect(result.body).toContain('Never commit secrets')
    })

    it('알 수 없는 ID는 무시된다', () => {
      const result = generateAgentsMd(
        makeInput({
          bestPractices: {
            selectedIds: ['no-typescript-any', 'non-existent-id'],
            additionalNotes: '',
          },
        })
      )

      expect(result.body).toContain('Never use the `any` type')
      expect(result.body).not.toContain('non-existent-id')
    })
  })

  describe('Boundaries 3-tier', () => {
    it('always-do 항목은 ✅ Always do 서브섹션에 들어간다', () => {
      const result = generateAgentsMd(
        makeInput({
          boundaries: {
            alwaysDoIds: ['always-run-tests'],
            askFirstIds: [],
            neverDoIds: [],
          },
        })
      )

      expect(result.body).toContain('## Boundaries')
      expect(result.body).toContain('### ✅ Always do')
      expect(result.body).toContain('Always run the test suite')
    })

    it('3-tier가 모두 선택되면 always → ask → never 순서로 출력된다', () => {
      const result = generateAgentsMd(
        makeInput({
          boundaries: {
            alwaysDoIds: ['always-run-tests'],
            askFirstIds: ['ask-before-deps'],
            neverDoIds: ['never-commit-secrets'],
          },
        })
      )

      const alwaysIdx = result.body.indexOf('Always do')
      const askIdx = result.body.indexOf('Ask first')
      const neverIdx = result.body.indexOf('Never do')

      expect(alwaysIdx).toBeGreaterThan(0)
      expect(askIdx).toBeGreaterThan(alwaysIdx)
      expect(neverIdx).toBeGreaterThan(askIdx)
    })

    it('비어있는 tier는 출력에서 제외된다', () => {
      const result = generateAgentsMd(
        makeInput({
          boundaries: {
            alwaysDoIds: ['always-run-tests'],
            askFirstIds: [],
            neverDoIds: [],
          },
        })
      )

      expect(result.body).toContain('### ✅ Always do')
      expect(result.body).not.toContain('### ⚠️ Ask first')
      expect(result.body).not.toContain('### 🚫 Never do')
    })
  })

  describe('Additional Notes (CP-1 자유 텍스트)', () => {
    it('자유 텍스트가 있으면 Additional Notes 섹션이 추가된다', () => {
      const result = generateAgentsMd(
        makeInput({
          bestPractices: {
            selectedIds: [],
            additionalNotes: 'Use Bun instead of Node when possible.',
          },
        })
      )

      expect(result.body).toContain('## Additional Notes')
      expect(result.body).toContain('Use Bun instead of Node')
    })

    it('자유 텍스트가 비어있으면 Additional Notes 섹션이 출력되지 않는다', () => {
      const result = generateAgentsMd(makeInput())

      expect(result.body).not.toContain('## Additional Notes')
    })

    it('공백만 있는 자유 텍스트는 빈 텍스트로 처리한다', () => {
      const result = generateAgentsMd(
        makeInput({
          bestPractices: { selectedIds: [], additionalNotes: '   \n  ' },
        })
      )

      expect(result.body).not.toContain('## Additional Notes')
    })
  })

  describe('빈 입력', () => {
    it('아무 항목도 선택하지 않으면 헤더만 있는 본문을 만든다', () => {
      const result = generateAgentsMd(makeInput())

      expect(result.body).toContain('# Agent Instructions')
      expect(result.body).not.toContain('## Code Style')
      expect(result.body).not.toContain('## Boundaries')
    })
  })
})
