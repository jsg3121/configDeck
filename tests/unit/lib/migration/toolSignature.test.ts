/**
 * 도구 유형 추정 휴리스틱 테스트
 */
import { describe, expect, it } from 'vitest'

import { detectToolType } from '@/lib/migration/toolSignature'

describe('detectToolType - 명확한 단독 도구', () => {
  it('ESLint 강한 시그니처(rules)가 있으면 eslint로 판정', () => {
    const input = `{ "rules": { "no-unused-vars": "error" } }`
    expect(detectToolType(input)).toBe('eslint')
  })

  it('ESLint env/parserOptions가 있으면 eslint로 판정', () => {
    const input = `{ "env": { "browser": true }, "parserOptions": { "ecmaVersion": 2022 } }`
    expect(detectToolType(input)).toBe('eslint')
  })

  it('Prettier 강한 시그니처(printWidth, semi 등)가 있으면 prettier로 판정', () => {
    const input = `{ "printWidth": 100, "semi": false, "singleQuote": true }`
    expect(detectToolType(input)).toBe('prettier')
  })

  it('TSConfig compilerOptions가 있으면 tsconfig로 판정', () => {
    const input = `{ "compilerOptions": { "strict": true, "target": "ES2022" } }`
    expect(detectToolType(input)).toBe('tsconfig')
  })

  it('TSConfig references가 있으면 tsconfig로 판정', () => {
    const input = `{ "references": [{ "path": "./packages/core" }] }`
    expect(detectToolType(input)).toBe('tsconfig')
  })
})

describe('detectToolType - empty / 판별 불가', () => {
  it('빈 문자열은 empty로 판정', () => {
    expect(detectToolType('')).toBe('empty')
  })

  it('공백만 있는 입력은 empty로 판정', () => {
    expect(detectToolType('   \n\t   ')).toBe('empty')
  })

  it('빈 객체는 empty로 판정', () => {
    expect(detectToolType('{}')).toBe('empty')
  })

  it('JSON 파싱 실패 시 empty로 판정 (차단 안 함)', () => {
    expect(detectToolType('{ broken json')).toBe('empty')
  })

  it('객체가 아닌 JSON(배열)은 empty로 판정', () => {
    expect(detectToolType('[1, 2, 3]')).toBe('empty')
  })

  it('extends만 있는 객체는 empty로 판정 (모호한 키만 있음 → 차단 안 함)', () => {
    const input = `{ "extends": "@tsconfig/strictest" }`
    expect(detectToolType(input)).toBe('empty')
  })
})

describe('detectToolType - ambiguous', () => {
  it('여러 도구의 강한 시그니처가 동점이면 ambiguous', () => {
    // ESLint(rules) 1개 + Prettier(printWidth) 1개 → 동점
    const input = `{ "rules": {}, "printWidth": 100 }`
    expect(detectToolType(input)).toBe('ambiguous')
  })

  it('세 도구 모두 동점이면 ambiguous', () => {
    const input = `{ "rules": {}, "printWidth": 100, "compilerOptions": {} }`
    expect(detectToolType(input)).toBe('ambiguous')
  })
})

describe('detectToolType - 점수 비교', () => {
  it('ESLint 시그니처가 더 많으면 eslint로 판정 (Prettier 1개 vs ESLint 2개)', () => {
    const input = `{ "rules": {}, "env": {}, "printWidth": 100 }`
    expect(detectToolType(input)).toBe('eslint')
  })

  it('Prettier 시그니처가 더 많으면 prettier로 판정', () => {
    const input = `{ "printWidth": 100, "semi": false, "tabWidth": 2, "rules": {} }`
    expect(detectToolType(input)).toBe('prettier')
  })

  it('extends가 있어도 강한 시그니처가 결정함 (TSConfig)', () => {
    const input = `{ "extends": "./base.json", "compilerOptions": { "strict": true } }`
    expect(detectToolType(input)).toBe('tsconfig')
  })

  it('extends가 있어도 강한 시그니처가 결정함 (ESLint)', () => {
    const input = `{ "extends": ["airbnb"], "rules": { "no-console": "warn" } }`
    expect(detectToolType(input)).toBe('eslint')
  })
})

describe('detectToolType - 주석 / trailing comma 허용', () => {
  it('한 줄 주석 포함 입력도 정상 판정', () => {
    const input = `{
      // ESLint 설정
      "rules": { "no-unused-vars": "error" }
    }`
    expect(detectToolType(input)).toBe('eslint')
  })

  it('trailing comma 포함 입력도 정상 판정', () => {
    const input = `{
      "compilerOptions": { "strict": true, },
    }`
    expect(detectToolType(input)).toBe('tsconfig')
  })
})
