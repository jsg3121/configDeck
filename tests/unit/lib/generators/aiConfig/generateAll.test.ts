/**
 * 통합 생성기 테스트 — enabledTools 기반 조건부 산출물
 */
import { describe, expect, it } from 'vitest'

import { generateAiConfig } from '@/lib/generators/aiConfig/generateAll'
import type { AiConfigInput } from '@/types/aiConfig'

const makeInput = (overrides: Partial<AiConfigInput> = {}): AiConfigInput => ({
  tools: { enabledTools: [], claudeCodeOnly: false },
  selectedSkillIds: [],
  bestPractices: { selectedIds: [], additionalNotes: '' },
  boundaries: { alwaysDoIds: [], askFirstIds: [], neverDoIds: [] },
  locale: 'ko',
  ...overrides,
})

describe('generateAiConfig', () => {
  describe('AGENTS.md', () => {
    it('도구 선택과 무관하게 항상 생성된다 (ADR-0017 1순위 산출물)', () => {
      const result = generateAiConfig(makeInput())

      expect(result.agentsMd).toBeDefined()
      expect(result.agentsMd.fileName).toBe('AGENTS.md')
    })
  })

  describe('도구별 조건부 출력', () => {
    it('claude-code가 enabledTools에 없으면 claudeMd는 undefined', () => {
      const result = generateAiConfig(
        makeInput({ tools: { enabledTools: ['cursor'], claudeCodeOnly: false } }),
      )

      expect(result.claudeMd).toBeUndefined()
    })

    it('claude-code가 enabledTools에 있으면 claudeMd가 생성된다', () => {
      const result = generateAiConfig(
        makeInput({ tools: { enabledTools: ['claude-code'], claudeCodeOnly: true } }),
      )

      expect(result.claudeMd).toBeDefined()
    })

    it('cursor가 없으면 cursorMdc는 undefined', () => {
      const result = generateAiConfig(
        makeInput({ tools: { enabledTools: ['copilot'], claudeCodeOnly: false } }),
      )

      expect(result.cursorMdc).toBeUndefined()
    })

    it('cursor가 있으면 cursorMdc 3파일이 생성된다', () => {
      const result = generateAiConfig(
        makeInput({ tools: { enabledTools: ['cursor'], claudeCodeOnly: false } }),
      )

      expect(result.cursorMdc).toBeDefined()
      expect(result.cursorMdc?.core).toBeDefined()
      expect(result.cursorMdc?.stack).toBeDefined()
      expect(result.cursorMdc?.boundaries).toBeDefined()
    })

    it('copilot이 없으면 copilotInstructions는 undefined', () => {
      const result = generateAiConfig(
        makeInput({ tools: { enabledTools: ['cursor'], claudeCodeOnly: false } }),
      )

      expect(result.copilotInstructions).toBeUndefined()
    })

    it('copilot이 있으면 copilotInstructions가 생성된다', () => {
      const result = generateAiConfig(
        makeInput({ tools: { enabledTools: ['copilot'], claudeCodeOnly: false } }),
      )

      expect(result.copilotInstructions).toBeDefined()
    })

    it('codex가 있어도 별도 산출물은 추가되지 않는다 (AGENTS.md로 충분)', () => {
      const result = generateAiConfig(
        makeInput({ tools: { enabledTools: ['codex'], claudeCodeOnly: false } }),
      )

      expect(result.agentsMd).toBeDefined()
      expect(result.claudeMd).toBeUndefined()
      expect(result.cursorMdc).toBeUndefined()
      expect(result.copilotInstructions).toBeUndefined()
    })

    it('4개 도구 모두 활성화되면 모든 산출물이 생성된다', () => {
      const result = generateAiConfig(
        makeInput({
          tools: {
            enabledTools: ['cursor', 'copilot', 'claude-code', 'codex'],
            claudeCodeOnly: false,
          },
        }),
      )

      expect(result.agentsMd).toBeDefined()
      expect(result.claudeMd).toBeDefined()
      expect(result.cursorMdc).toBeDefined()
      expect(result.copilotInstructions).toBeDefined()
    })
  })

  describe('Skills 통합', () => {
    it('selectedSkillIds 기반으로 SKILL.md 목록이 포함된다', () => {
      const result = generateAiConfig(makeInput({ selectedSkillIds: ['commit', 'pr-review'] }))

      expect(result.skills).toHaveLength(2)
      expect(result.skills[0].id).toBe('commit')
      expect(result.skills[1].id).toBe('pr-review')
    })
  })
})
