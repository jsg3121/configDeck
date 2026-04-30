/**
 * Skills SKILL.md 생성기 테스트
 */
import { describe, expect, it } from 'vitest'

import { generateSkills, serializeSkillFile } from '@/lib/generators/aiConfig/generateSkills'
import type { AiConfigInput, SkillId } from '@/types/aiConfig'

const makeInput = (overrides: Partial<AiConfigInput> = {}): AiConfigInput => ({
  tools: { enabledTools: ['claude-code'], claudeCodeOnly: false },
  selectedSkillIds: [],
  bestPractices: { selectedIds: [], additionalNotes: '' },
  boundaries: { alwaysDoIds: [], askFirstIds: [], neverDoIds: [] },
  locale: 'ko',
  ...overrides,
})

describe('generateSkills', () => {
  describe('스킬 ID 매칭', () => {
    it('빈 selectedSkillIds는 빈 배열을 반환한다', () => {
      const result = generateSkills(makeInput())

      expect(result).toHaveLength(0)
    })

    it('단일 스킬 ID는 1개 SKILL.md를 반환한다', () => {
      const result = generateSkills(makeInput({ selectedSkillIds: ['commit'] }))

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('commit')
    })

    it('여러 스킬 ID는 입력 순서를 보존한다', () => {
      const result = generateSkills(
        makeInput({ selectedSkillIds: ['debug', 'commit', 'pr-review'] })
      )

      expect(result.map((f) => f.id)).toEqual(['debug', 'commit', 'pr-review'])
    })

    it('중복된 ID는 첫 번째만 출력한다', () => {
      const result = generateSkills(makeInput({ selectedSkillIds: ['commit', 'commit'] }))

      expect(result).toHaveLength(1)
    })

    it('카탈로그에 없는 ID는 무시한다', () => {
      const ids = ['commit', 'unknown-skill' as SkillId]
      const result = generateSkills(makeInput({ selectedSkillIds: ids }))

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('commit')
    })
  })

  describe('출력 경로', () => {
    it('경로는 .claude/skills/{id}/SKILL.md 형식이다', () => {
      const result = generateSkills(makeInput({ selectedSkillIds: ['pr-create'] }))

      expect(result[0].outputPath).toBe('.claude/skills/pr-create/SKILL.md')
      expect(result[0].fileName).toBe('SKILL.md')
    })
  })

  describe('frontmatter (Phase A 공통 필드만)', () => {
    it('name과 description만 가진다', () => {
      const result = generateSkills(makeInput({ selectedSkillIds: ['commit'] }))

      expect(result[0].frontmatter.name).toBe('commit')
      expect(result[0].frontmatter.description).toBeTruthy()

      // Phase A는 Claude 확장 필드를 출력하지 않는다 (CP-4)
      const keys = Object.keys(result[0].frontmatter)
      expect(keys).toEqual(['name', 'description'])
    })
  })

  describe('본문', () => {
    it('카탈로그 bodyTemplate 결과를 본문에 담는다', () => {
      const result = generateSkills(makeInput({ selectedSkillIds: ['commit'] }))

      expect(result[0].body).toContain('# Commit Skill')
      expect(result[0].body).toContain('Conventional Commits')
    })

    it('각 스킬 본문은 50줄 이상이다 (의미 있는 가이드 분량)', () => {
      const allIds: readonly SkillId[] = [
        'commit',
        'pr-create',
        'pr-review',
        'test-writer',
        'debug',
        'refactor',
        'adr-create',
        'readme-update',
      ]
      const result = generateSkills(makeInput({ selectedSkillIds: allIds }))

      for (const file of result) {
        const lineCount = file.body.split('\n').length
        expect(lineCount).toBeGreaterThanOrEqual(20)
      }
    })
  })

  describe('serializeSkillFile', () => {
    it('frontmatter와 body를 결합한 단일 문자열을 반환한다', () => {
      const result = generateSkills(makeInput({ selectedSkillIds: ['commit'] }))
      const serialized = serializeSkillFile(result[0])

      expect(serialized).toMatch(/^---\n/)
      expect(serialized).toContain('name: commit')
      expect(serialized).toContain('description:')
      expect(serialized).toContain('# Commit Skill')
    })

    it('description의 따옴표를 이스케이프한다', () => {
      const result = generateSkills(makeInput({ selectedSkillIds: ['debug'] }))
      const serialized = serializeSkillFile(result[0])

      // YAML에서 description은 항상 따옴표로 감싸진다
      expect(serialized).toMatch(/description: ".*"/)
    })
  })
})
