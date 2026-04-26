/**
 * 레거시 ESLint 설정 파서 테스트
 */
import { describe, expect, it } from 'vitest'

import { detectConfigFormat, parseEslintLegacyConfig } from '@/lib/migration/parser'

describe('detectConfigFormat', () => {
  it('"{"로 시작하면 json으로 감지한다', () => {
    expect(detectConfigFormat('{ "extends": [] }')).toBe('json')
  })

  it('module.exports를 포함하면 commonjs로 감지한다', () => {
    expect(detectConfigFormat('module.exports = { extends: [] }')).toBe('commonjs')
  })

  it('export default를 포함하면 esm으로 감지한다', () => {
    expect(detectConfigFormat('export default { extends: [] }')).toBe('esm')
  })

  it('패턴이 없으면 unknown을 반환한다', () => {
    expect(detectConfigFormat('not a config')).toBe('unknown')
  })

  it('앞쪽 공백을 트리밍하고 감지한다', () => {
    expect(detectConfigFormat('   \n  { "rules": {} }')).toBe('json')
  })
})

describe('parseEslintLegacyConfig - JSON', () => {
  it('단순 JSON config를 파싱한다', () => {
    const input = `{
      "extends": ["eslint:recommended"],
      "rules": {
        "no-console": "warn"
      }
    }`
    const result = parseEslintLegacyConfig(input, 'json')
    expect(result.extends).toEqual(['eslint:recommended'])
    expect(result.rules).toEqual({ 'no-console': 'warn' })
  })

  it('extends가 문자열이면 배열로 정규화한다', () => {
    const input = `{ "extends": "eslint:recommended" }`
    const result = parseEslintLegacyConfig(input, 'json')
    expect(result.extends).toEqual(['eslint:recommended'])
  })

  it('한 줄 주석을 제거한다', () => {
    const input = `{
      // 주석
      "rules": { "no-console": "warn" }
    }`
    const result = parseEslintLegacyConfig(input, 'json')
    expect(result.rules).toEqual({ 'no-console': 'warn' })
  })

  it('블록 주석을 제거한다', () => {
    const input = `{
      /* 블록 주석 */
      "rules": { "no-console": "warn" }
    }`
    const result = parseEslintLegacyConfig(input, 'json')
    expect(result.rules).toEqual({ 'no-console': 'warn' })
  })

  it('trailing comma를 처리한다', () => {
    const input = `{
      "rules": {
        "no-console": "warn",
      },
    }`
    const result = parseEslintLegacyConfig(input, 'json')
    expect(result.rules).toEqual({ 'no-console': 'warn' })
  })

  it('env, plugins, parser를 파싱한다', () => {
    const input = `{
      "env": { "browser": true, "node": true },
      "plugins": ["react"],
      "parser": "@typescript-eslint/parser"
    }`
    const result = parseEslintLegacyConfig(input, 'json')
    expect(result.env).toEqual({ browser: true, node: true })
    expect(result.plugins).toEqual(['react'])
    expect(result.parser).toBe('@typescript-eslint/parser')
  })

  it('plugins가 문자열이면 배열로 정규화한다', () => {
    const input = `{ "plugins": "react" }`
    const result = parseEslintLegacyConfig(input, 'json')
    expect(result.plugins).toEqual(['react'])
  })
})

describe('parseEslintLegacyConfig - CommonJS', () => {
  it('module.exports 객체를 파싱한다', () => {
    const input = `module.exports = {
      extends: ['eslint:recommended'],
      rules: {
        'no-console': 'warn'
      }
    }`
    const result = parseEslintLegacyConfig(input, 'commonjs')
    expect(result.extends).toEqual(['eslint:recommended'])
    expect(result.rules).toEqual({ 'no-console': 'warn' })
  })

  it('따옴표 없는 키를 처리한다', () => {
    const input = `module.exports = {
      env: { browser: true },
      rules: {}
    }`
    const result = parseEslintLegacyConfig(input, 'commonjs')
    expect(result.env).toEqual({ browser: true })
  })

  it('module.exports가 없으면 빈 객체를 반환한다', () => {
    const input = `const config = {}; export default config;`
    const result = parseEslintLegacyConfig(input, 'commonjs')
    expect(result).toEqual({})
  })
})

describe('parseEslintLegacyConfig - 알 수 없는 형식', () => {
  it('unknown 형식이면 빈 객체를 반환한다', () => {
    const result = parseEslintLegacyConfig('garbage', 'unknown')
    expect(result).toEqual({})
  })
})
