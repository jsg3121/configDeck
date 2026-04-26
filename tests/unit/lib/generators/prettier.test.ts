/**
 * Prettier 설정 생성기 테스트
 */
import { describe, expect, it } from 'vitest'

import { generatePrettierConfig } from '@/lib/generators/prettierGenerator'

describe('generatePrettierConfig', () => {
  describe('기본 생성', () => {
    it('옵션 없이 호출하면 빈 config를 생성한다', () => {
      const result = generatePrettierConfig({})

      expect(result).toContain('/** @type {import("prettier").Config} */')
      expect(result).toContain('export default {')
      expect(result).toContain('}')
    })
  })

  describe('옵션 설정', () => {
    it('printWidth를 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ printWidth: 100 })

      expect(result).toContain('printWidth: 100')
    })

    it('tabWidth를 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ tabWidth: 4 })

      expect(result).toContain('tabWidth: 4')
    })

    it('useTabs를 true로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ useTabs: true })

      expect(result).toContain('useTabs: true')
    })

    it('semi를 false로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ semi: false })

      expect(result).toContain('semi: false')
    })

    it('singleQuote를 true로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ singleQuote: true })

      expect(result).toContain('singleQuote: true')
    })

    it('trailingComma를 none으로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ trailingComma: 'none' })

      expect(result).toContain("trailingComma: 'none'")
    })

    it('arrowParens를 avoid로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ arrowParens: 'avoid' })

      expect(result).toContain("arrowParens: 'avoid'")
    })

    it('endOfLine를 crlf로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ endOfLine: 'crlf' })

      expect(result).toContain("endOfLine: 'crlf'")
    })
  })

  describe('여러 옵션 조합', () => {
    it('여러 옵션을 동시에 설정할 수 있다', () => {
      const result = generatePrettierConfig({
        printWidth: 120,
        tabWidth: 4,
        semi: false,
        singleQuote: true,
      })

      expect(result).toContain('printWidth: 120')
      expect(result).toContain('tabWidth: 4')
      expect(result).toContain('semi: false')
      expect(result).toContain('singleQuote: true')
    })

    it('일반적인 프로덕션 설정을 올바르게 생성한다', () => {
      const result = generatePrettierConfig({
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        arrowParens: 'avoid',
      })

      expect(result).toContain('printWidth: 100')
      expect(result).toContain('tabWidth: 2')
      expect(result).toContain('useTabs: false')
      expect(result).toContain('semi: false')
      expect(result).toContain('singleQuote: true')
      expect(result).toContain("trailingComma: 'es5'")
      expect(result).toContain("arrowParens: 'avoid'")
    })
  })

  describe('고급 옵션', () => {
    it('jsxSingleQuote를 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ jsxSingleQuote: true })

      expect(result).toContain('jsxSingleQuote: true')
    })

    it('bracketSpacing를 false로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ bracketSpacing: false })

      expect(result).toContain('bracketSpacing: false')
    })

    it('bracketSameLine를 true로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ bracketSameLine: true })

      expect(result).toContain('bracketSameLine: true')
    })

    it('htmlWhitespaceSensitivity를 ignore로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ htmlWhitespaceSensitivity: 'ignore' })

      expect(result).toContain("htmlWhitespaceSensitivity: 'ignore'")
    })

    it('singleAttributePerLine를 true로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ singleAttributePerLine: true })

      expect(result).toContain('singleAttributePerLine: true')
    })

    it('proseWrap를 always로 설정하면 출력에 포함된다', () => {
      const result = generatePrettierConfig({ proseWrap: 'always' })

      expect(result).toContain("proseWrap: 'always'")
    })
  })

  describe('출력 형식', () => {
    it('JSDoc 타입 주석을 포함한다', () => {
      const result = generatePrettierConfig({})

      expect(result).toContain('/** @type {import("prettier").Config} */')
    })

    it('export default로 시작한다', () => {
      const result = generatePrettierConfig({})

      expect(result).toContain('export default {')
    })

    it('옵션이 있을 때 각 라인은 쉼표로 끝난다', () => {
      const result = generatePrettierConfig({ printWidth: 100 })

      expect(result).toContain('printWidth: 100,')
    })
  })
})
