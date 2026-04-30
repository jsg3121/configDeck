/**
 * CLAUDE.md 생성기 테스트
 */
import { describe, expect, it } from 'vitest'

import { generateClaudeMd } from '@/lib/generators/aiConfig/generateClaudeMd'
import type { AiConfigInput } from '@/types/aiConfig'

const makeInput = (overrides: Partial<AiConfigInput> = {}): AiConfigInput => ({
  stack: { stack: 'react-vite-ts' },
  bestPractices: { selectedIds: [], additionalNotes: '' },
  boundaries: { alwaysDoIds: [], askFirstIds: [], neverDoIds: [] },
  tools: { enabledTools: ['claude-code'], claudeCodeOnly: true },
  selectedSkillIds: [],
  locale: 'ko',
  ...overrides,
})

describe('generateClaudeMd', () => {
  describe('출력 모델 구조', () => {
    it('파일명과 경로는 항상 CLAUDE.md이다', () => {
      const result = generateClaudeMd(makeInput())

      expect(result.fileName).toBe('CLAUDE.md')
      expect(result.outputPath).toBe('CLAUDE.md')
    })
  })

  describe('Claude Code 단독 사용 모드 (claudeCodeOnly: true)', () => {
    it('importAgentsMd는 false이고 본문에 @AGENTS.md가 없다', () => {
      const result = generateClaudeMd(
        makeInput({
          tools: { enabledTools: ['claude-code'], claudeCodeOnly: true },
        })
      )

      expect(result.importAgentsMd).toBe(false)
      expect(result.body).not.toContain('@AGENTS.md')
    })

    it('베스트 프랙티스가 본문에 직접 작성된다', () => {
      const result = generateClaudeMd(
        makeInput({
          tools: { enabledTools: ['claude-code'], claudeCodeOnly: true },
          bestPractices: {
            selectedIds: ['no-typescript-any'],
            additionalNotes: '',
          },
        })
      )

      expect(result.body).toContain('# Project Instructions')
      expect(result.body).toContain('Never use the `any` type')
    })

    it('Boundaries 섹션도 본문에 직접 작성된다', () => {
      const result = generateClaudeMd(
        makeInput({
          tools: { enabledTools: ['claude-code'], claudeCodeOnly: true },
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
  })

  describe('AGENTS.md 임포트 모드 (claudeCodeOnly: false)', () => {
    it('importAgentsMd는 true이고 본문 첫 줄이 @AGENTS.md이다', () => {
      const result = generateClaudeMd(
        makeInput({
          tools: {
            enabledTools: ['claude-code', 'cursor'],
            claudeCodeOnly: false,
          },
        })
      )

      expect(result.importAgentsMd).toBe(true)
      expect(result.body.startsWith('@AGENTS.md')).toBe(true)
    })

    it('Claude Code Notes 섹션이 포함된다', () => {
      const result = generateClaudeMd(
        makeInput({
          tools: {
            enabledTools: ['claude-code', 'codex'],
            claudeCodeOnly: false,
          },
        })
      )

      expect(result.body).toContain('# Claude Code Notes')
    })

    it('임포트 모드에서는 베스트 프랙티스 본문이 CLAUDE.md에 중복 출력되지 않는다', () => {
      const result = generateClaudeMd(
        makeInput({
          tools: {
            enabledTools: ['claude-code', 'cursor'],
            claudeCodeOnly: false,
          },
          bestPractices: {
            selectedIds: ['no-typescript-any'],
            additionalNotes: '',
          },
        })
      )

      // 본문에는 임포트만 들어가고, AGENTS.md의 실제 컨텐츠는 들어가지 않는다 (DRY)
      expect(result.body).not.toContain('Never use the `any` type')
      expect(result.body).toContain('@AGENTS.md')
    })
  })
})
