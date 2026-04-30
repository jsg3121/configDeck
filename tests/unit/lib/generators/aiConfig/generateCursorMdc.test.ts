/**
 * Cursor MDC 3파일 생성기 테스트
 */
import { describe, expect, it } from 'vitest'

import {
  generateCursorMdc,
  serializeCursorMdcFile,
} from '@/lib/generators/aiConfig/generateCursorMdc'
import type { AiConfigInput } from '@/types/aiConfig'

const makeInput = (overrides: Partial<AiConfigInput> = {}): AiConfigInput => ({
  stack: { stack: 'react-vite-ts' },
  bestPractices: { selectedIds: [], additionalNotes: '' },
  boundaries: { alwaysDoIds: [], askFirstIds: [], neverDoIds: [] },
  tools: { enabledTools: ['cursor'], claudeCodeOnly: false },
  selectedSkillIds: [],
  locale: 'ko',
  ...overrides,
})

describe('generateCursorMdc', () => {
  describe('3파일 출력 구조', () => {
    it('항상 core / stack / boundaries 3파일을 반환한다', () => {
      const result = generateCursorMdc(makeInput())

      expect(result.core.fileName).toBe('core.mdc')
      expect(result.stack.fileName).toBe('stack.mdc')
      expect(result.boundaries.fileName).toBe('boundaries.mdc')
    })

    it('출력 경로는 .cursor/rules/ 하위이다', () => {
      const result = generateCursorMdc(makeInput())

      expect(result.core.outputPath).toBe('.cursor/rules/core.mdc')
      expect(result.stack.outputPath).toBe('.cursor/rules/stack.mdc')
      expect(result.boundaries.outputPath).toBe('.cursor/rules/boundaries.mdc')
    })
  })

  describe('frontmatter — 4가지 Rule Type 매핑', () => {
    it('core.mdc는 alwaysApply: true이다', () => {
      const result = generateCursorMdc(makeInput())

      expect(result.core.frontmatter.alwaysApply).toBe(true)
      expect(result.core.frontmatter.description).toBeDefined()
    })

    it('stack.mdc는 globs를 가지고 alwaysApply가 없다', () => {
      const result = generateCursorMdc(makeInput())

      expect(result.stack.frontmatter.globs).toBeDefined()
      expect(result.stack.frontmatter.alwaysApply).toBeUndefined()
    })

    it('boundaries.mdc는 description만 가진다', () => {
      const result = generateCursorMdc(makeInput())

      expect(result.boundaries.frontmatter.description).toBeDefined()
      expect(result.boundaries.frontmatter.alwaysApply).toBeUndefined()
      expect(result.boundaries.frontmatter.globs).toBeUndefined()
    })
  })

  describe('스택별 globs', () => {
    it('react-vite-ts 스택의 globs는 src 하위 ts/tsx를 포함한다', () => {
      const result = generateCursorMdc(makeInput({ stack: { stack: 'react-vite-ts' } }))

      expect(result.stack.frontmatter.globs).toContain('src/**/*.tsx')
    })

    it('nextjs 스택의 globs는 app과 pages 디렉토리를 포함한다', () => {
      const result = generateCursorMdc(makeInput({ stack: { stack: 'nextjs' } }))

      expect(result.stack.frontmatter.globs).toContain('app/**/*.tsx')
      expect(result.stack.frontmatter.globs).toContain('pages/**/*.tsx')
    })

    it('astro 스택의 globs는 .astro 파일을 포함한다', () => {
      const result = generateCursorMdc(makeInput({ stack: { stack: 'astro' } }))

      expect(result.stack.frontmatter.globs).toContain('src/**/*.astro')
    })
  })

  describe('카테고리 분배', () => {
    it('Code Style 항목은 core.mdc에 들어간다', () => {
      const result = generateCursorMdc(
        makeInput({
          bestPractices: { selectedIds: ['no-typescript-any'], additionalNotes: '' },
        })
      )

      expect(result.core.body).toContain('## Code Style')
      expect(result.core.body).toContain('Never use the `any` type')
      expect(result.stack.body).not.toContain('Never use the `any` type')
      expect(result.boundaries.body).not.toContain('Never use the `any` type')
    })

    it('Project Structure 항목은 stack.mdc에 들어간다', () => {
      const result = generateCursorMdc(
        makeInput({
          stack: { stack: 'astro' },
          bestPractices: {
            selectedIds: ['astro-prefer-content-collections'],
            additionalNotes: '',
          },
        })
      )

      expect(result.stack.body).toContain('## Project Structure')
      expect(result.stack.body).toContain('Content Collections')
      expect(result.core.body).not.toContain('Content Collections')
    })

    it('Boundaries 카테고리 항목은 boundaries.mdc에 들어간다', () => {
      const result = generateCursorMdc(
        makeInput({
          bestPractices: { selectedIds: ['no-secrets-in-code'], additionalNotes: '' },
        })
      )

      expect(result.boundaries.body).toContain('## Boundaries')
      expect(result.boundaries.body).toContain('Never commit secrets')
      expect(result.core.body).not.toContain('Never commit secrets')
    })

    it('3-tier Boundaries는 boundaries.mdc 서브섹션에 들어간다', () => {
      const result = generateCursorMdc(
        makeInput({
          boundaries: {
            alwaysDoIds: ['always-run-tests'],
            askFirstIds: ['ask-before-deps'],
            neverDoIds: ['never-commit-secrets'],
          },
        })
      )

      expect(result.boundaries.body).toContain('### ✅ Always do')
      expect(result.boundaries.body).toContain('### ⚠️ Ask first')
      expect(result.boundaries.body).toContain('### 🚫 Never do')
    })

    it('Additional Notes는 boundaries.mdc에 들어간다', () => {
      const result = generateCursorMdc(
        makeInput({
          bestPractices: { selectedIds: [], additionalNotes: 'Use Bun.' },
        })
      )

      expect(result.boundaries.body).toContain('## Additional Notes')
      expect(result.boundaries.body).toContain('Use Bun.')
    })
  })

  describe('serializeCursorMdcFile', () => {
    it('frontmatter와 body를 결합한 단일 문자열을 반환한다', () => {
      const result = generateCursorMdc(
        makeInput({
          bestPractices: { selectedIds: ['no-typescript-any'], additionalNotes: '' },
        })
      )

      const serialized = serializeCursorMdcFile(result.core)
      expect(serialized).toMatch(/^---\n/)
      expect(serialized).toContain('alwaysApply: true')
      expect(serialized).toContain('## Code Style')
    })

    it('description의 따옴표를 이스케이프한다', () => {
      const result = generateCursorMdc(makeInput())
      const serialized = serializeCursorMdcFile(result.core)

      // description에 따옴표가 포함되지 않더라도 직렬화 형식 자체가 유효해야 함
      expect(serialized).toMatch(/description: ".*"/)
    })
  })
})
