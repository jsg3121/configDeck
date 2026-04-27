/**
 * 레거시 ESLint → flat config 변환기 테스트
 */
import { describe, expect, it } from 'vitest'

import { migrateEslintConfig } from '@/lib/migration/eslintMigrator'

describe('migrateEslintConfig', () => {
  describe('extends 변환', () => {
    it('eslint:recommended를 매핑한다', () => {
      const result = migrateEslintConfig({ extends: ['eslint:recommended'] })
      expect(result.outputCode).toContain("import js from '@eslint/js'")
      expect(result.outputCode).toContain('js.configs.recommended')
    })

    it('plugin:@typescript-eslint/recommended를 매핑한다', () => {
      const result = migrateEslintConfig({
        extends: ['plugin:@typescript-eslint/recommended'],
      })
      expect(result.outputCode).toContain("import tseslint from 'typescript-eslint'")
      expect(result.outputCode).toContain('...tseslint.configs.recommended')
    })

    it('plugin:react/recommended를 매핑한다', () => {
      const result = migrateEslintConfig({ extends: ['plugin:react/recommended'] })
      expect(result.outputCode).toContain("import react from 'eslint-plugin-react'")
    })

    it('prettier를 매핑한다', () => {
      const result = migrateEslintConfig({ extends: ['prettier'] })
      expect(result.outputCode).toContain("import prettierConfig from 'eslint-config-prettier'")
    })

    it('매핑되지 않는 extends는 경고로 보고한다', () => {
      const result = migrateEslintConfig({ extends: ['airbnb'] })
      expect(result.warnings).toHaveLength(1)
      expect(result.warnings[0].message).toContain('airbnb')
      expect(result.warnings[0].messageKo).toContain('airbnb')
    })

    it('여러 extends를 모두 처리한다', () => {
      const result = migrateEslintConfig({
        extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      })
      expect(result.outputCode).toContain('@eslint/js')
      expect(result.outputCode).toContain('typescript-eslint')
      expect(result.outputCode).toContain('eslint-config-prettier')
    })
  })

  describe('env 변환', () => {
    it('env를 globals import로 변환한다', () => {
      const result = migrateEslintConfig({
        env: { browser: true, node: true },
      })
      expect(result.outputCode).toContain("import globals from 'globals'")
      expect(result.outputCode).toContain('...globals.browser')
      expect(result.outputCode).toContain('...globals.node')
    })

    it('env가 false인 항목은 제외한다', () => {
      const result = migrateEslintConfig({
        env: { browser: true, node: false },
      })
      expect(result.outputCode).toContain('...globals.browser')
      expect(result.outputCode).not.toContain('...globals.node')
    })

    it('env가 비어있으면 globals import를 추가하지 않는다', () => {
      const result = migrateEslintConfig({ env: {} })
      expect(result.outputCode).not.toContain('globals')
    })
  })

  describe('rules 변환', () => {
    it('rules를 그대로 유지한다', () => {
      const result = migrateEslintConfig({
        rules: { 'no-console': 'warn', 'no-debugger': 'error' },
      })
      expect(result.outputCode).toContain('"no-console": "warn"')
      expect(result.outputCode).toContain('"no-debugger": "error"')
    })

    it('rules가 빈 객체면 rules 블록을 추가하지 않는다', () => {
      const result = migrateEslintConfig({ rules: {} })
      expect(result.outputCode).not.toContain('rules:')
    })

    it('rules의 들여쓰기가 일관성 있게 정렬된다', () => {
      const result = migrateEslintConfig({
        rules: { 'no-console': 'warn' },
      })
      // 4칸 prefix + JSON.stringify(null, 2) → 키는 6칸, 닫는 } 는 4칸
      expect(result.outputCode).toMatch(/ {6}"no-console": "warn"/)
      expect(result.outputCode).toMatch(/ {4}\}/)
    })
  })

  describe('plugins 경고', () => {
    it('extends에 포함되지 않은 plugin은 경고를 추가한다', () => {
      const result = migrateEslintConfig({ plugins: ['custom-plugin'] })
      expect(result.warnings.some((w) => w.message.includes('custom-plugin'))).toBe(true)
    })

    it('extends에 이미 포함된 plugin은 경고하지 않는다', () => {
      const result = migrateEslintConfig({
        extends: ['plugin:react/recommended'],
        plugins: ['react'],
      })
      const reactWarnings = result.warnings.filter((w) => w.message.includes('plugin "react"'))
      expect(reactWarnings).toHaveLength(0)
    })
  })

  describe('parser 경고', () => {
    it('parser는 경고로 보고한다', () => {
      const result = migrateEslintConfig({ parser: '@typescript-eslint/parser' })
      expect(result.warnings.some((w) => w.message.includes('@typescript-eslint/parser'))).toBe(
        true,
      )
    })
  })

  describe('출력 구조', () => {
    it('export default 배열 구조를 생성한다', () => {
      const result = migrateEslintConfig({ extends: ['eslint:recommended'] })
      expect(result.outputCode).toContain('export default [')
      expect(result.outputCode).toContain(']')
    })

    it('빈 입력이면 빈 배열을 생성한다', () => {
      const result = migrateEslintConfig({})
      expect(result.outputCode).toContain('export default [')
    })
  })

  describe('warning 다국어', () => {
    it('각 warning에 영문/한글 메시지를 모두 포함한다', () => {
      const result = migrateEslintConfig({ extends: ['airbnb'] })
      expect(result.warnings[0]).toHaveProperty('message')
      expect(result.warnings[0]).toHaveProperty('messageKo')
      expect(result.warnings[0].message).not.toBe(result.warnings[0].messageKo)
    })
  })
})
