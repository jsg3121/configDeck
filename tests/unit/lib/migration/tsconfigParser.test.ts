/**
 * TSConfig 설정 파서 테스트
 */
import { describe, expect, it } from 'vitest'

import {
  detectTsconfigFormat,
  hasExtendsField,
  parseTsconfig,
} from '@/lib/migration/tsconfigParser'

describe('detectTsconfigFormat', () => {
  it('"{"로 시작하면 json으로 감지한다', () => {
    expect(detectTsconfigFormat('{ "compilerOptions": {} }')).toBe('json')
  })

  it('앞뒤 공백을 무시한다', () => {
    expect(detectTsconfigFormat('   { "compilerOptions": {} }   ')).toBe('json')
  })

  it('module.exports 같은 비표준 형식은 unknown을 반환한다', () => {
    expect(detectTsconfigFormat('module.exports = {}')).toBe('unknown')
  })

  it('export default는 unknown을 반환한다', () => {
    expect(detectTsconfigFormat('export default {}')).toBe('unknown')
  })

  it('빈 입력은 unknown을 반환한다', () => {
    expect(detectTsconfigFormat('')).toBe('unknown')
  })
})

describe('parseTsconfig - 기본 파싱', () => {
  it('단순 tsconfig를 파싱한다', () => {
    const input = `{
      "compilerOptions": {
        "target": "ES2022",
        "strict": true
      }
    }`
    const result = parseTsconfig(input, 'json')
    expect(result.compilerOptions).toEqual({ target: 'ES2022', strict: true })
  })

  it('extends 필드를 파싱한다', () => {
    const input = `{ "extends": "@tsconfig/strictest" }`
    const result = parseTsconfig(input, 'json')
    expect(result.extends).toBe('@tsconfig/strictest')
  })

  it('extends 배열을 파싱한다', () => {
    const input = `{ "extends": ["./base.json", "./overrides.json"] }`
    const result = parseTsconfig(input, 'json')
    expect(result.extends).toEqual(['./base.json', './overrides.json'])
  })

  it('include / exclude / files / references를 보존한다', () => {
    const input = `{
      "include": ["src/**/*"],
      "exclude": ["node_modules"],
      "files": ["./global.d.ts"],
      "references": [{ "path": "./packages/core" }]
    }`
    const result = parseTsconfig(input, 'json')
    expect(result.include).toEqual(['src/**/*'])
    expect(result.exclude).toEqual(['node_modules'])
    expect(result.files).toEqual(['./global.d.ts'])
    expect(result.references).toEqual([{ path: './packages/core' }])
  })

  it('json 외 형식은 빈 객체를 반환한다', () => {
    expect(parseTsconfig('module.exports = {}', 'commonjs')).toEqual({})
    expect(parseTsconfig('export default {}', 'esm')).toEqual({})
    expect(parseTsconfig('garbage', 'unknown')).toEqual({})
  })

  it('파싱에 실패하면 빈 객체를 반환한다', () => {
    expect(parseTsconfig('{ broken json', 'json')).toEqual({})
  })
})

describe('parseTsconfig - JSON5 (주석/trailing comma)', () => {
  it('한 줄 주석을 제거하고 파싱한다', () => {
    const input = `{
      // 메인 옵션
      "compilerOptions": {
        "strict": true // strict 모드
      }
    }`
    const result = parseTsconfig(input, 'json')
    expect(result.compilerOptions).toEqual({ strict: true })
  })

  it('블록 주석을 제거하고 파싱한다', () => {
    const input = `{
      /* 컴파일 옵션 */
      "compilerOptions": { "strict": true }
    }`
    const result = parseTsconfig(input, 'json')
    expect(result.compilerOptions).toEqual({ strict: true })
  })

  it('trailing comma를 허용한다', () => {
    const input = `{
      "compilerOptions": {
        "strict": true,
        "target": "ES2022",
      },
    }`
    const result = parseTsconfig(input, 'json')
    expect(result.compilerOptions).toEqual({ strict: true, target: 'ES2022' })
  })

  it('문자열 안의 URL이 한 줄 주석으로 잘못 제거되지 않는다', () => {
    const input = `{
      "compilerOptions": {
        "baseUrl": "https://example.com/path",
        "strict": true
      }
    }`
    const result = parseTsconfig(input, 'json')
    expect(result.compilerOptions).toEqual({
      baseUrl: 'https://example.com/path',
      strict: true,
    })
  })
})

describe('hasExtendsField', () => {
  it('extends가 있으면 true를 반환한다', () => {
    expect(hasExtendsField('{ "extends": "@tsconfig/strictest" }')).toBe(true)
  })

  it('extends 배열도 감지한다', () => {
    expect(hasExtendsField('{ "extends": ["./base.json"] }')).toBe(true)
  })

  it('extends가 없으면 false를 반환한다', () => {
    expect(hasExtendsField('{ "compilerOptions": { "strict": true } }')).toBe(false)
  })

  it('주석으로 처리된 extends는 활성 필드로 간주하지 않는다', () => {
    const input = `{
      // "extends": "@tsconfig/strictest",
      "compilerOptions": { "strict": true }
    }`
    expect(hasExtendsField(input)).toBe(false)
  })
})
