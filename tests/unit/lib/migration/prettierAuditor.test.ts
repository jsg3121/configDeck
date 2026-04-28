/**
 * Prettier 설정 감사기 테스트
 */
import { describe, expect, it } from 'vitest'

import { auditPrettierConfig } from '@/lib/migration/prettierAuditor'

describe('auditPrettierConfig - deprecated 옵션', () => {
  it('jsxBracketSameLine 사용을 warning으로 감지한다', () => {
    const code = `{ "jsxBracketSameLine": true }`
    const result = auditPrettierConfig(code)
    expect(result.items.some((i) => i.message.includes('jsxBracketSameLine'))).toBe(true)
    expect(result.items.find((i) => i.message.includes('jsxBracketSameLine'))?.severity).toBe(
      'warning',
    )
  })

  it('pluginSearchDirs 사용을 warning으로 감지한다', () => {
    const code = `{ "pluginSearchDirs": ["./node_modules"] }`
    const result = auditPrettierConfig(code)
    expect(result.items.some((i) => i.message.includes('pluginSearchDirs'))).toBe(true)
  })

  it('따옴표 없는 식별자 키도 deprecated 옵션을 감지한다', () => {
    const code = `module.exports = { jsxBracketSameLine: true }`
    const result = auditPrettierConfig(code)
    expect(result.items.some((i) => i.message.includes('jsxBracketSameLine'))).toBe(true)
  })

  it('deprecated 옵션이 있으면 isLegacyConfig=true를 반환한다', () => {
    const code = `{ "jsxBracketSameLine": true }`
    const result = auditPrettierConfig(code)
    expect(result.isLegacyConfig).toBe(true)
  })

  it('deprecated 옵션이 없으면 isLegacyConfig=false를 반환한다', () => {
    const code = `{ "semi": true, "tabWidth": 2 }`
    const result = auditPrettierConfig(code)
    expect(result.isLegacyConfig).toBe(false)
  })
})

describe('auditPrettierConfig - 기본값 변경 안내', () => {
  it('trailingComma가 명시되지 않으면 info로 안내한다', () => {
    const code = `{ "semi": true }`
    const result = auditPrettierConfig(code)
    const trailingInfo = result.items.find(
      (i) => i.severity === 'info' && i.message.includes('trailingComma'),
    )
    expect(trailingInfo).toBeDefined()
  })

  it('trailingComma가 명시되어 있으면 안내하지 않는다', () => {
    const code = `{ "trailingComma": "all" }`
    const result = auditPrettierConfig(code)
    const trailingInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('trailingComma'),
    )
    expect(trailingInfos).toHaveLength(0)
  })

  it('CommonJS 입력의 식별자 키도 명시 여부를 감지한다', () => {
    const code = `module.exports = { trailingComma: 'all' }`
    const result = auditPrettierConfig(code)
    const trailingInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('trailingComma'),
    )
    expect(trailingInfos).toHaveLength(0)
  })
})

describe('auditPrettierConfig - 빈 설정', () => {
  it('빈 JSON 객체는 info로 안내한다', () => {
    const result = auditPrettierConfig('{}')
    expect(result.items.some((i) => i.message.includes('empty'))).toBe(true)
  })

  it('완전히 빈 입력도 info로 안내한다', () => {
    const result = auditPrettierConfig('')
    expect(result.items.some((i) => i.message.includes('empty'))).toBe(true)
  })

  it('옵션이 하나라도 있으면 빈 설정 안내는 없다', () => {
    const result = auditPrettierConfig('{ "semi": true }')
    const emptyInfos = result.items.filter((i) => i.message.includes('empty'))
    expect(emptyInfos).toHaveLength(0)
  })
})

describe('auditPrettierConfig - summary', () => {
  it('summary가 severity별 카운트를 정확히 반영한다', () => {
    const code = `{ "jsxBracketSameLine": true, "semi": true }`
    const result = auditPrettierConfig(code)
    expect(result.summary.warnings).toBe(
      result.items.filter((i) => i.severity === 'warning').length,
    )
    expect(result.summary.infos).toBe(result.items.filter((i) => i.severity === 'info').length)
    expect(result.summary.errors).toBe(result.items.filter((i) => i.severity === 'error').length)
  })
})

describe('auditPrettierConfig - 다국어 메시지', () => {
  it('모든 항목에 영문/한글 메시지가 포함된다', () => {
    const code = `{ "jsxBracketSameLine": true }`
    const result = auditPrettierConfig(code)
    for (const item of result.items) {
      expect(item.message).toBeTruthy()
      expect(item.messageKo).toBeTruthy()
      expect(item.message).not.toBe(item.messageKo)
    }
  })
})

describe('auditPrettierConfig - 주석 처리', () => {
  it('주석으로 처리된 deprecated 옵션은 활성으로 간주하지 않는다', () => {
    const code = `{
      // "jsxBracketSameLine": true,
      "semi": true
    }`
    const result = auditPrettierConfig(code)
    const deprecatedWarnings = result.items.filter(
      (i) => i.severity === 'warning' && i.message.includes('jsxBracketSameLine'),
    )
    expect(deprecatedWarnings).toHaveLength(0)
  })

  it('블록 주석으로 처리된 옵션도 활성으로 간주하지 않는다', () => {
    const code = `{
      /* "pluginSearchDirs": [] */
      "semi": true
    }`
    const result = auditPrettierConfig(code)
    const deprecatedWarnings = result.items.filter(
      (i) => i.severity === 'warning' && i.message.includes('pluginSearchDirs'),
    )
    expect(deprecatedWarnings).toHaveLength(0)
  })
})
