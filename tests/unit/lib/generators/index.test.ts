/**
 * 통합 생성기 진입점 테스트
 */
import { describe, expect, it } from 'vitest'

import { generateConfigBySlug } from '@/lib/generators'

describe('generateConfigBySlug', () => {
  describe('ESLint 설정', () => {
    it('eslint-config slug로 ESLint 설정을 생성한다', () => {
      const result = generateConfigBySlug('eslint-config', {})

      expect(result.fileName).toBe('eslint.config.mjs')
      expect(result.language).toBe('javascript')
      expect(result.code).toContain('export default [')
    })

    it('ESLint 옵션이 코드에 반영된다', () => {
      const result = generateConfigBySlug('eslint-config', {
        language: 'typescript',
        noConsole: 'warn',
      })

      expect(result.code).toContain('tseslint')
      expect(result.code).toContain("'no-console': 'warn'")
    })
  })

  describe('Prettier 설정', () => {
    it('prettier-config slug로 Prettier 설정을 생성한다', () => {
      const result = generateConfigBySlug('prettier-config', {})

      expect(result.fileName).toBe('prettier.config.mjs')
      expect(result.language).toBe('javascript')
      expect(result.code).toContain('export default {')
    })

    it('Prettier 옵션이 코드에 반영된다', () => {
      const result = generateConfigBySlug('prettier-config', {
        printWidth: 120,
        singleQuote: true,
      })

      expect(result.code).toContain('printWidth: 120')
      expect(result.code).toContain('singleQuote: true')
    })
  })

  describe('TypeScript 설정', () => {
    it('tsconfig slug로 TypeScript 설정을 생성한다', () => {
      const result = generateConfigBySlug('tsconfig', {})

      expect(result.fileName).toBe('tsconfig.json')
      expect(result.language).toBe('json')
    })
  })

  describe('Vite 설정', () => {
    it('vite-config slug로 Vite 설정을 생성한다', () => {
      const result = generateConfigBySlug('vite-config', {})

      expect(result.fileName).toBe('vite.config.ts')
      expect(result.language).toBe('typescript')
    })
  })

  describe('Vitest 설정', () => {
    it('vitest-config slug로 Vitest 설정을 생성한다', () => {
      const result = generateConfigBySlug('vitest-config', {})

      expect(result.fileName).toBe('vitest.config.ts')
      expect(result.language).toBe('typescript')
    })
  })

  describe('Next.js 설정', () => {
    it('next-config slug로 Next.js 설정을 생성한다', () => {
      const result = generateConfigBySlug('next-config', {})

      expect(result.fileName).toBe('next.config.js')
      expect(result.language).toBe('javascript')
    })
  })

  describe('EditorConfig', () => {
    it('editorconfig slug로 EditorConfig를 생성한다', () => {
      const result = generateConfigBySlug('editorconfig', {})

      expect(result.fileName).toBe('.editorconfig')
      expect(result.language).toBe('ini')
    })
  })

  describe('Gitignore', () => {
    it('gitignore slug로 .gitignore를 생성한다', () => {
      const result = generateConfigBySlug('gitignore', {})

      expect(result.fileName).toBe('.gitignore')
      expect(result.language).toBe('gitignore')
    })
  })

  describe('.env 파일', () => {
    it('env slug로 .env 파일을 생성한다', () => {
      const result = generateConfigBySlug('env', {})

      expect(result.fileName).toBe('.env')
      expect(result.language).toBe('shell')
    })
  })

  describe('존재하지 않는 slug', () => {
    it('존재하지 않는 slug는 빈 결과를 반환한다', () => {
      const result = generateConfigBySlug('non-existent', {})

      expect(result.fileName).toBe('')
      expect(result.code).toBe('')
      expect(result.language).toBe('')
    })
  })
})
