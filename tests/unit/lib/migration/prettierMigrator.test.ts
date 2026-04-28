/**
 * Prettier 2.x → 3.x 변환기 테스트
 */
import { describe, expect, it } from 'vitest'

import { migratePrettierConfig } from '@/lib/migration/prettierMigrator'

describe('migratePrettierConfig - 단순 리네임', () => {
  it('jsxBracketSameLine 키를 bracketSameLine으로 변환한다', () => {
    const result = migratePrettierConfig({ jsxBracketSameLine: true })
    expect(result.config).toEqual({ bracketSameLine: true })
    expect(result.config?.jsxBracketSameLine).toBeUndefined()
  })

  it('jsxBracketSameLine의 값을 그대로 보존한다', () => {
    const result = migratePrettierConfig({ jsxBracketSameLine: false })
    expect(result.config?.bracketSameLine).toBe(false)
  })

  it('리네임 시 다른 옵션은 보존된다', () => {
    const result = migratePrettierConfig({
      jsxBracketSameLine: true,
      semi: true,
      tabWidth: 2,
    })
    expect(result.config).toEqual({
      bracketSameLine: true,
      semi: true,
      tabWidth: 2,
    })
  })
})

describe('migratePrettierConfig - 제거 + 경고', () => {
  it('pluginSearchDirs를 제거하고 경고를 추가한다', () => {
    const result = migratePrettierConfig({ pluginSearchDirs: ['./node_modules'], semi: true })
    expect(result.config?.pluginSearchDirs).toBeUndefined()
    expect(result.config?.semi).toBe(true)
    expect(result.warnings.some((w) => w.message.includes('pluginSearchDirs'))).toBe(true)
  })

  it('경고에 영문/한글 메시지가 모두 포함된다', () => {
    const result = migratePrettierConfig({ pluginSearchDirs: [] })
    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0].message).toBeTruthy()
    expect(result.warnings[0].messageKo).toBeTruthy()
    expect(result.warnings[0].message).not.toBe(result.warnings[0].messageKo)
  })
})

describe('migratePrettierConfig - 옵션 보존', () => {
  it('변환 대상이 아닌 옵션은 그대로 유지된다', () => {
    const input = {
      semi: true,
      tabWidth: 2,
      printWidth: 100,
      singleQuote: false,
    }
    const result = migratePrettierConfig(input)
    expect(result.config).toEqual(input)
  })

  it('빈 입력은 빈 출력을 생성한다', () => {
    const result = migratePrettierConfig({})
    expect(result.config).toEqual({})
    expect(result.warnings).toHaveLength(0)
  })
})

describe('migratePrettierConfig - 출력 형식', () => {
  it('output은 JSON 형식의 문자열을 생성한다', () => {
    const result = migratePrettierConfig({ semi: true, tabWidth: 2 })
    const parsed = JSON.parse(result.output)
    expect(parsed).toEqual({ semi: true, tabWidth: 2 })
  })

  it('output은 2칸 들여쓰기로 정렬된다', () => {
    const result = migratePrettierConfig({ semi: true })
    expect(result.output).toContain('  "semi": true')
  })

  it('output과 config는 동일한 결과를 나타낸다', () => {
    const result = migratePrettierConfig({ jsxBracketSameLine: true, semi: false })
    expect(JSON.parse(result.output)).toEqual(result.config)
  })
})

describe('migratePrettierConfig - 복합 케이스', () => {
  it('리네임 + 제거 + 보존을 동시에 처리한다', () => {
    const input = {
      jsxBracketSameLine: true, // → bracketSameLine
      pluginSearchDirs: ['./plugins'], // → 제거 + 경고
      semi: true, // 보존
      tabWidth: 2, // 보존
    }
    const result = migratePrettierConfig(input)
    expect(result.config).toEqual({
      bracketSameLine: true,
      semi: true,
      tabWidth: 2,
    })
    expect(result.warnings.some((w) => w.message.includes('pluginSearchDirs'))).toBe(true)
  })
})
