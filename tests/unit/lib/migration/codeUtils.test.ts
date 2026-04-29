/**
 * 설정 파일 파서/감사기 공통 유틸(codeUtils) 단위 테스트.
 *
 * Gemini Code Assist가 PR #32에서 지적한 3건의 잠재 결함을 회귀 방지 차원에서
 * 고정한다.
 *   #1: 주석 제거가 문자열 리터럴 내부의 URL/블록 주석 패턴을 잘못 제거
 *   #2: 식별자 키 변환이 문자열 값 내부의 객체 패턴을 잘못 변환
 *   #3: 백슬래시 이스케이프 판별이 짝수 개 백슬래시 케이스를 처리 못함
 */
import { describe, expect, it } from 'vitest'

import {
  cleanJsonLikeInput,
  jsObjectToJson,
  stripCommentsFromCode,
} from '@/lib/migration/codeUtils'

describe('stripCommentsFromCode - 일반 주석', () => {
  it('한 줄 주석을 제거한다', () => {
    const input = `{
      // 한 줄 주석
      "semi": true
    }`
    const result = stripCommentsFromCode(input)
    expect(result).not.toContain('한 줄 주석')
    expect(result).toContain('"semi": true')
  })

  it('블록 주석을 제거한다', () => {
    const input = `{
      /* 블록 주석 */
      "semi": true
    }`
    const result = stripCommentsFromCode(input)
    expect(result).not.toContain('블록 주석')
    expect(result).toContain('"semi": true')
  })
})

/**
 * Gemini #1: cleanJsonInput이 정규식으로 주석을 제거할 때 문자열 리터럴
 * 내부의 "//" 또는 "/*" 패턴을 잘못 제거하던 결함을 회귀 방지한다.
 */
describe('stripCommentsFromCode - 문자열 보호 (Gemini #1)', () => {
  it('문자열 안의 URL("//")을 주석으로 오인하지 않는다', () => {
    const input = `{ "homepage": "https://example.com/path" }`
    const result = stripCommentsFromCode(input)
    expect(result).toBe(`{ "homepage": "https://example.com/path" }`)
  })

  it('문자열 안의 "/*" 패턴을 블록 주석으로 오인하지 않는다', () => {
    const input = `{ "regex": "a/*b/c" }`
    const result = stripCommentsFromCode(input)
    expect(result).toBe(`{ "regex": "a/*b/c" }`)
  })

  it('문자열 안의 "//" 뒤 내용을 잘라내지 않는다', () => {
    const input = `{ "url": "//cdn.example.com" }`
    const result = stripCommentsFromCode(input)
    expect(result).toBe(`{ "url": "//cdn.example.com" }`)
  })

  it('문자열 외부의 주석은 그대로 제거하면서 문자열 내부는 보존한다', () => {
    const input = `{
      "url": "https://example.com", // 한 줄 주석
      "regex": "a/*b" /* 블록 주석 */
    }`
    const result = stripCommentsFromCode(input)
    expect(result).toContain(`"https://example.com"`)
    expect(result).toContain(`"a/*b"`)
    expect(result).not.toContain('한 줄 주석')
    expect(result).not.toContain('블록 주석')
  })
})

/**
 * Gemini #3: 백슬래시 이스케이프 판별이 짝수 개 백슬래시 케이스를
 * 처리하지 못하던 결함을 회귀 방지한다.
 */
describe('stripCommentsFromCode - 백슬래시 이스케이프 (Gemini #3)', () => {
  it('이스케이프된 따옴표("hello\\\"")를 종료 따옴표로 오인하지 않는다', () => {
    const input = `{ "msg": "hello\\"world", "next": "x" }`
    const result = stripCommentsFromCode(input)
    expect(result).toBe(input) // 변화 없음
  })

  it('이스케이프된 백슬래시 뒤의 따옴표("path\\\\\\\\")를 정확히 종료로 인식한다', () => {
    // 입력: { "path": "C:\\\\" } — 백슬래시 2개(JS literal로는 4개), 그다음 종료 따옴표
    // 그 뒤에 //로 시작하는 주석이 있을 때 주석이 정상 제거되어야 함
    const input = `{ "path": "C:\\\\\\\\" }
// 주석`
    const result = stripCommentsFromCode(input)
    expect(result).toContain(`"path": "C:\\\\\\\\"`)
    expect(result).not.toContain('주석')
  })

  it('홀수 개 백슬래시 뒤의 따옴표는 이스케이프된 것으로 판단', () => {
    // "a\\" + escaped quote + b" — 백슬래시 1개, 따옴표는 이스케이프된 상태
    const input = `{ "v": "a\\"b" }`
    const result = stripCommentsFromCode(input)
    expect(result).toBe(input)
  })
})

describe('cleanJsonLikeInput', () => {
  it('주석을 제거하고 trailing comma도 제거한다', () => {
    const input = `{
      "semi": true,
      "tabWidth": 2, // 한 줄 주석
    }`
    const result = cleanJsonLikeInput(input)
    expect(JSON.parse(result)).toEqual({ semi: true, tabWidth: 2 })
  })

  it('문자열 안의 trailing-comma-like 패턴은 유지된다', () => {
    // 문자열은 stripCommentsFromCode 단계에서 그대로 보존되므로
    // 이후 trailing-comma 정규식이 적용되어도 손상되지 않는다
    const input = `{ "raw": "value, ", "semi": true }`
    const result = cleanJsonLikeInput(input)
    expect(JSON.parse(result)).toEqual({ raw: 'value, ', semi: true })
  })
})

describe('jsObjectToJson - 기본 변환', () => {
  it('식별자 키를 따옴표로 감싼다', () => {
    const input = `{ semi: true, tabWidth: 2 }`
    const result = jsObjectToJson(input)
    expect(JSON.parse(result)).toEqual({ semi: true, tabWidth: 2 })
  })

  it('작은따옴표 문자열을 큰따옴표로 변환한다', () => {
    const input = `{ trailingComma: 'all' }`
    const result = jsObjectToJson(input)
    expect(JSON.parse(result)).toEqual({ trailingComma: 'all' })
  })

  it('이미 큰따옴표 키는 변환하지 않는다', () => {
    const input = `{ "semi": true }`
    const result = jsObjectToJson(input)
    expect(JSON.parse(result)).toEqual({ semi: true })
  })
})

/**
 * Gemini #2: jsObjectToJson의 식별자 키 변환 정규식이 문자열 값 내부의
 * "{ key: }" 같은 패턴까지 잘못 변환하던 결함을 회귀 방지한다.
 */
describe('jsObjectToJson - 문자열 보호 (Gemini #2)', () => {
  it('문자열 값 안의 객체 리터럴 패턴은 변환되지 않는다', () => {
    // 작은따옴표 문자열 안에 { a: 1 } 같은 패턴이 있을 때
    const input = `{ pattern: '{ a: 1 }' }`
    const result = jsObjectToJson(input)
    expect(JSON.parse(result)).toEqual({ pattern: '{ a: 1 }' })
  })

  it('큰따옴표 문자열 값 안의 식별자 키 패턴은 변환되지 않는다', () => {
    const input = `{ "msg": "value with key: pattern" }`
    const result = jsObjectToJson(input)
    expect(JSON.parse(result)).toEqual({ msg: 'value with key: pattern' })
  })

  it('문자열 외부의 식별자 키는 변환하면서 내부는 보존한다', () => {
    const input = `{ msg: 'has { key: in it }', semi: true }`
    const result = jsObjectToJson(input)
    expect(JSON.parse(result)).toEqual({ msg: 'has { key: in it }', semi: true })
  })

  it('문자열 안의 콜론 패턴이 키로 인식되지 않는다', () => {
    const input = `{ raw: 'name: value', semi: true }`
    const result = jsObjectToJson(input)
    expect(JSON.parse(result)).toEqual({ raw: 'name: value', semi: true })
  })
})

describe('jsObjectToJson - 백슬래시 이스케이프 (Gemini #3 동일 원인)', () => {
  it('이스케이프된 작은따옴표가 들어 있는 문자열도 정확히 종료를 인식한다', () => {
    // 작은따옴표 안에 이스케이프된 작은따옴표가 있는 케이스
    const input = `{ msg: 'it\\'s fine' }`
    const result = jsObjectToJson(input)
    expect(JSON.parse(result)).toEqual({ msg: "it's fine" })
  })

  it('큰따옴표 문자열은 그대로 통과되며 백슬래시 이스케이프 짝수도 정확히 처리한다', () => {
    // "a\\\\" — 백슬래시 2개로 끝나는 문자열, 그다음 다른 키
    const input = `{ "path": "C:\\\\\\\\", "next": true }`
    const result = jsObjectToJson(input)
    expect(JSON.parse(result)).toEqual({ path: 'C:\\\\', next: true })
  })
})
