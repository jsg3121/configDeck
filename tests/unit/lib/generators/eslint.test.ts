/**
 * ESLint 설정 생성기 테스트
 */
import { describe, expect, it } from 'vitest'

import { generateEslintConfig } from '@/lib/generators/eslintGenerator'

describe('generateEslintConfig', () => {
  describe('기본 생성', () => {
    it('옵션 없이 호출하면 빈 config를 생성한다', () => {
      const result = generateEslintConfig({})

      expect(result).toContain('export default [')
      expect(result).toContain(']')
    })
  })

  describe('언어 설정', () => {
    it('TypeScript 옵션 활성화 시 typescript-eslint를 포함한다', () => {
      const result = generateEslintConfig({ language: 'typescript' })

      expect(result).toContain("import tseslint from 'typescript-eslint'")
      expect(result).toContain('...tseslint.configs.recommended')
    })

    it('JavaScript 옵션이면 typescript-eslint를 포함하지 않는다', () => {
      const result = generateEslintConfig({ language: 'javascript' })

      expect(result).not.toContain('tseslint')
    })
  })

  describe('프레임워크 설정', () => {
    it('React 프레임워크 선택 시 React 플러그인을 포함한다', () => {
      const result = generateEslintConfig({ framework: 'react' })

      expect(result).toContain("import react from 'eslint-plugin-react'")
      expect(result).toContain("import reactHooks from 'eslint-plugin-react-hooks'")
      expect(result).toContain('...react.configs.flat.recommended')
    })

    it('Vue 프레임워크 선택 시 Vue 플러그인을 포함한다', () => {
      const result = generateEslintConfig({ framework: 'vue' })

      expect(result).toContain("import vue from 'eslint-plugin-vue'")
      expect(result).toContain("...vue.configs['flat/recommended']")
    })

    it('Next.js 프레임워크 선택 시 Next 플러그인을 포함한다', () => {
      const result = generateEslintConfig({ framework: 'nextjs' })

      expect(result).toContain("import next from '@next/eslint-plugin-next'")
      expect(result).toContain("'@next/next': next")
    })

    it('Svelte 프레임워크 선택 시 Svelte 플러그인을 포함한다', () => {
      const result = generateEslintConfig({ framework: 'svelte' })

      expect(result).toContain("import svelte from 'eslint-plugin-svelte'")
      expect(result).toContain('...svelte.configs.recommended')
    })

    it('Astro 프레임워크 선택 시 Astro 플러그인을 포함한다', () => {
      const result = generateEslintConfig({ framework: 'astro' })

      expect(result).toContain("import eslintPluginAstro from 'eslint-plugin-astro'")
      expect(result).toContain('...eslintPluginAstro.configs.recommended')
    })
  })

  describe('추가 플러그인', () => {
    it('import 플러그인 활성화 시 eslint-plugin-import를 포함한다', () => {
      const result = generateEslintConfig({ importPlugin: true })

      expect(result).toContain("import importPlugin from 'eslint-plugin-import'")
      expect(result).toContain('import: importPlugin')
    })

    it('a11y 플러그인 활성화 시 eslint-plugin-jsx-a11y를 포함한다', () => {
      const result = generateEslintConfig({ a11yPlugin: true })

      expect(result).toContain("import jsxA11y from 'eslint-plugin-jsx-a11y'")
      expect(result).toContain("'jsx-a11y': jsxA11y")
    })

    it('prettier 활성화 시 eslint-config-prettier를 마지막에 포함한다', () => {
      const result = generateEslintConfig({ prettier: true })

      expect(result).toContain("import prettierConfig from 'eslint-config-prettier'")
      expect(result).toContain('prettierConfig,')
      // prettier config는 마지막에 와야 함
      const prettierIndex = result.indexOf('prettierConfig,')
      const closingIndex = result.lastIndexOf(']')
      expect(prettierIndex).toBeLessThan(closingIndex)
    })
  })

  describe('룰 설정', () => {
    it('noConsole 룰을 warn으로 설정하면 no-console: warn을 출력한다', () => {
      const result = generateEslintConfig({ noConsole: 'warn' })

      expect(result).toContain("'no-console': 'warn'")
    })

    it('off로 설정된 룰은 출력하지 않는다', () => {
      const result = generateEslintConfig({ noConsole: 'off' })

      expect(result).not.toContain('no-console')
    })

    it('빈 문자열로 설정된 룰은 출력하지 않는다', () => {
      const result = generateEslintConfig({ noConsole: '' })

      expect(result).not.toContain('no-console')
    })

    it('여러 룰을 동시에 설정할 수 있다', () => {
      const result = generateEslintConfig({
        noConsole: 'warn',
        noDebugger: 'error',
        preferConst: 'error',
      })

      expect(result).toContain("'no-console': 'warn'")
      expect(result).toContain("'no-debugger': 'error'")
      expect(result).toContain("'prefer-const': 'error'")
    })
  })

  describe('TypeScript 룰 변환', () => {
    it('TypeScript 환경에서 no-unused-vars는 @typescript-eslint/no-unused-vars로 변환된다', () => {
      const result = generateEslintConfig({
        language: 'typescript',
        noUnusedVars: 'error',
      })

      expect(result).toContain("'@typescript-eslint/no-unused-vars': 'error'")
      expect(result).not.toContain("'no-unused-vars': 'error'")
    })

    it('TypeScript 환경에서 no-shadow는 @typescript-eslint/no-shadow로 변환된다', () => {
      const result = generateEslintConfig({
        language: 'typescript',
        noShadow: 'warn',
      })

      expect(result).toContain("'@typescript-eslint/no-shadow': 'warn'")
    })

    it('JavaScript 환경에서는 룰 변환이 발생하지 않는다', () => {
      const result = generateEslintConfig({
        language: 'javascript',
        noUnusedVars: 'error',
      })

      expect(result).toContain("'no-unused-vars': 'error'")
      expect(result).not.toContain('@typescript-eslint')
    })
  })

  describe('통합 시나리오', () => {
    it('TypeScript + React + Prettier 조합을 올바르게 생성한다', () => {
      const result = generateEslintConfig({
        language: 'typescript',
        framework: 'react',
        prettier: true,
        noConsole: 'warn',
      })

      expect(result).toContain("import tseslint from 'typescript-eslint'")
      expect(result).toContain("import react from 'eslint-plugin-react'")
      expect(result).toContain("import prettierConfig from 'eslint-config-prettier'")
      expect(result).toContain("'no-console': 'warn'")
    })
  })
})
