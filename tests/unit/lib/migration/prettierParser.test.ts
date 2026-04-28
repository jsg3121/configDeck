/**
 * Prettier 설정 파서 테스트
 */
import { describe, expect, it } from 'vitest'

import { detectPrettierFormat, parsePrettierConfig } from '@/lib/migration/prettierParser'

describe('detectPrettierFormat', () => {
  it('JSON 시작 입력을 json으로 감지한다', () => {
    expect(detectPrettierFormat('{ "semi": true }')).toBe('json')
  })

  it('module.exports 포함 입력을 commonjs로 감지한다', () => {
    expect(detectPrettierFormat('module.exports = { semi: true }')).toBe('commonjs')
  })

  it('export default 포함 입력을 esm으로 감지한다', () => {
    expect(detectPrettierFormat('export default { semi: true }')).toBe('esm')
  })

  it('알 수 없는 입력은 unknown을 반환한다', () => {
    expect(detectPrettierFormat('semi: true')).toBe('unknown')
  })

  it('앞뒤 공백을 무시한다', () => {
    expect(detectPrettierFormat('   { "semi": true }   ')).toBe('json')
  })
})

describe('parsePrettierConfig - JSON', () => {
  it('단순 JSON을 파싱한다', () => {
    const result = parsePrettierConfig('{ "semi": true, "tabWidth": 2 }', 'json')
    expect(result).toEqual({ semi: true, tabWidth: 2 })
  })

  it('주석을 제거하고 파싱한다', () => {
    const input = `{
      // 한 줄 주석
      "semi": true,
      /* 블록 주석 */
      "tabWidth": 2
    }`
    const result = parsePrettierConfig(input, 'json')
    expect(result).toEqual({ semi: true, tabWidth: 2 })
  })

  it('trailing comma를 허용한다', () => {
    const result = parsePrettierConfig('{ "semi": true, "tabWidth": 2, }', 'json')
    expect(result).toEqual({ semi: true, tabWidth: 2 })
  })

  it('빈 객체를 파싱한다', () => {
    const result = parsePrettierConfig('{}', 'json')
    expect(result).toEqual({})
  })
})

describe('parsePrettierConfig - CommonJS', () => {
  it('module.exports 객체를 파싱한다', () => {
    const input = `module.exports = { semi: true, tabWidth: 2 }`
    const result = parsePrettierConfig(input, 'commonjs')
    expect(result).toEqual({ semi: true, tabWidth: 2 })
  })

  it('작은따옴표 문자열을 큰따옴표로 변환해 파싱한다', () => {
    const input = `module.exports = { trailingComma: 'all', endOfLine: 'lf' }`
    const result = parsePrettierConfig(input, 'commonjs')
    expect(result).toEqual({ trailingComma: 'all', endOfLine: 'lf' })
  })

  it('하이픈 없는 식별자 키를 큰따옴표로 감싸 파싱한다', () => {
    const input = `module.exports = {
      printWidth: 100,
      singleQuote: true
    }`
    const result = parsePrettierConfig(input, 'commonjs')
    expect(result).toEqual({ printWidth: 100, singleQuote: true })
  })

  it('module.exports 형식이 아니면 빈 객체를 반환한다', () => {
    const input = `const config = { semi: true }`
    const result = parsePrettierConfig(input, 'commonjs')
    expect(result).toEqual({})
  })
})

describe('parsePrettierConfig - ESM', () => {
  it('export default 객체를 파싱한다', () => {
    const input = `export default { semi: true, tabWidth: 2 }`
    const result = parsePrettierConfig(input, 'esm')
    expect(result).toEqual({ semi: true, tabWidth: 2 })
  })

  it('작은따옴표/식별자 키 모두 변환해 파싱한다', () => {
    const input = `export default {
      semi: false,
      trailingComma: 'all',
      printWidth: 100
    }`
    const result = parsePrettierConfig(input, 'esm')
    expect(result).toEqual({ semi: false, trailingComma: 'all', printWidth: 100 })
  })

  it('export default 형식이 아니면 빈 객체를 반환한다', () => {
    const input = `const config = { semi: true }; export { config }`
    const result = parsePrettierConfig(input, 'esm')
    expect(result).toEqual({})
  })
})

describe('parsePrettierConfig - unknown', () => {
  it('unknown 형식은 빈 객체를 반환한다', () => {
    const result = parsePrettierConfig('semi: true', 'unknown')
    expect(result).toEqual({})
  })
})

/**
 * Gemini Code Assist (PR #32) 코멘트 회귀 방지.
 * 본 테스트는 codeUtils.test.ts와 별도로 parser 진입점 차원의 통합을 검증한다.
 */
describe('parsePrettierConfig - 문자열 리터럴 보호 (Gemini PR #32)', () => {
  it('JSON 입력의 문자열 안 URL을 주석으로 오인하지 않는다', () => {
    const input = `{ "homepage": "https://example.com/path", "semi": true }`
    const result = parsePrettierConfig(input, 'json')
    expect(result).toEqual({ homepage: 'https://example.com/path', semi: true })
  })

  it('JSON 입력의 문자열 안 "/*" 패턴을 블록 주석으로 오인하지 않는다', () => {
    const input = `{ "regex": "a/*b/c" }`
    const result = parsePrettierConfig(input, 'json')
    expect(result).toEqual({ regex: 'a/*b/c' })
  })

  it('CommonJS 입력의 문자열 값 안 객체 패턴은 그대로 보존된다', () => {
    const input = `module.exports = { msg: 'has { key: pattern }', semi: true }`
    const result = parsePrettierConfig(input, 'commonjs')
    expect(result).toEqual({ msg: 'has { key: pattern }', semi: true })
  })
})
