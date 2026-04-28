/**
 * ESLint 설정 분석기 테스트
 */
import { describe, expect, it } from 'vitest'

import { auditEslintConfig } from '@/lib/migration/eslintAuditor'

describe('auditEslintConfig - legacy 감지', () => {
  it('extends가 있는 JSON 형식을 legacy로 감지한다', () => {
    const code = `{ "extends": ["eslint:recommended"] }`
    const result = auditEslintConfig(code)
    expect(result.isLegacyConfig).toBe(true)
    expect(result.items.some((i) => i.message.includes('Legacy'))).toBe(true)
  })

  it('module.exports를 legacy로 감지한다', () => {
    const code = `module.exports = { rules: {} }`
    const result = auditEslintConfig(code)
    expect(result.isLegacyConfig).toBe(true)
  })

  it('flat config는 legacy로 감지하지 않는다', () => {
    const code = `import js from '@eslint/js'\nexport default [js.configs.recommended]`
    const result = auditEslintConfig(code)
    expect(result.isLegacyConfig).toBe(false)
  })
})

describe('auditEslintConfig - deprecated 규칙', () => {
  it('deprecated 규칙(indent)을 감지한다', () => {
    const code = `export default [{ rules: { indent: ["error", 2] } }]`
    const result = auditEslintConfig(code)
    expect(result.items.some((i) => i.message.includes('"indent"'))).toBe(true)
  })

  it('deprecated 규칙(semi)을 감지한다', () => {
    const code = `export default [{ rules: { semi: "error" } }]`
    const result = auditEslintConfig(code)
    expect(result.items.some((i) => i.message.includes('"semi"'))).toBe(true)
  })

  it('따옴표로 감싼 deprecated 규칙도 감지한다', () => {
    const code = `export default [{ rules: { "indent": ["error", 2] } }]`
    const result = auditEslintConfig(code)
    expect(result.items.some((i) => i.message.includes('"indent"'))).toBe(true)
  })
})

describe('auditEslintConfig - extractRules 중첩 객체 처리', () => {
  it('규칙 값에 중첩 객체가 있어도 모든 규칙을 추출한다', () => {
    const code = `export default [{
      rules: {
        "no-unused-vars": ["error", { args: "none" }],
        "no-console": "warn"
      }
    }]`
    const result = auditEslintConfig(code)
    // no-console이 있으므로 RECOMMENDED_RULES의 'no-console' info는 추가되지 않아야 한다
    const noConsoleInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('"no-console"'),
    )
    expect(noConsoleInfos).toHaveLength(0)
  })

  it('중첩 객체가 있어도 첫 번째 규칙에서 멈추지 않는다', () => {
    const code = `export default [{
      rules: {
        "@typescript-eslint/naming-convention": ["error", { selector: "variable", format: ["camelCase"] }],
        "eqeqeq": "error"
      }
    }]`
    const result = auditEslintConfig(code)
    // eqeqeq를 인식했으므로 추가 권장 정보가 없어야 한다
    const eqeqeqInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('"eqeqeq"'),
    )
    expect(eqeqeqInfos).toHaveLength(0)
  })

  it('rules 블록 내부 객체에 중괄호 균형이 맞아야 정확히 매칭된다', () => {
    const code = `export default [{
      rules: {
        "rule-a": ["error", { nested: { deep: true } }],
        "rule-b": "warn"
      }
    }]`
    const result = auditEslintConfig(code)
    // 정상적으로 audit 결과가 반환되면 OK (예외 없이 동작)
    expect(result.summary).toBeDefined()
  })
})

describe('auditEslintConfig - 권장 규칙 제안', () => {
  it('rules가 비어있으면 권장 규칙들을 info로 제안한다', () => {
    const code = `export default [{ rules: {} }]`
    const result = auditEslintConfig(code)
    const infos = result.items.filter((i) => i.severity === 'info')
    expect(infos.some((i) => i.message.includes('"no-console"'))).toBe(true)
    expect(infos.some((i) => i.message.includes('"no-debugger"'))).toBe(true)
  })

  it('이미 정의된 권장 규칙은 제안하지 않는다', () => {
    const code = `export default [{ rules: { "no-console": "warn" } }]`
    const result = auditEslintConfig(code)
    const noConsoleInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('"no-console"'),
    )
    expect(noConsoleInfos).toHaveLength(0)
  })
})

describe('auditEslintConfig - extends 분석', () => {
  it('eslint:recommended를 확장하지 않으면 권장한다', () => {
    const code = `{ "extends": ["airbnb"] }`
    const result = auditEslintConfig(code)
    expect(
      result.items.some((i) => i.severity === 'info' && i.message.includes('eslint:recommended')),
    ).toBe(true)
  })

  it('eslint:recommended를 이미 확장하면 권장하지 않는다', () => {
    const code = `{ "extends": ["eslint:recommended"] }`
    const result = auditEslintConfig(code)
    const recommendedInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('eslint:recommended'),
    )
    expect(recommendedInfos).toHaveLength(0)
  })
})

describe('auditEslintConfig - prettier 충돌', () => {
  it('eslint-config-prettier와 포맷팅 규칙이 충돌하면 경고한다', () => {
    const code = `{
      "extends": ["prettier"],
      "rules": { "indent": ["error", 2] }
    }`
    const result = auditEslintConfig(code)
    expect(
      result.items.some((i) => i.severity === 'warning' && i.message.includes('Prettier')),
    ).toBe(true)
  })
})

describe('auditEslintConfig - summary', () => {
  it('summary가 severity별 카운트를 정확히 반영한다', () => {
    const code = `{ "extends": ["eslint:recommended"], "rules": { "indent": "error" } }`
    const result = auditEslintConfig(code)
    expect(result.summary.warnings).toBeGreaterThan(0)
    expect(result.summary.warnings).toBe(
      result.items.filter((i) => i.severity === 'warning').length,
    )
    expect(result.summary.infos).toBe(result.items.filter((i) => i.severity === 'info').length)
    expect(result.summary.errors).toBe(result.items.filter((i) => i.severity === 'error').length)
  })
})

describe('auditEslintConfig - 다국어 메시지', () => {
  it('모든 항목에 영문/한글 메시지가 포함된다', () => {
    const code = `{ "extends": ["airbnb"], "rules": { "indent": "error" } }`
    const result = auditEslintConfig(code)
    for (const item of result.items) {
      expect(item.message).toBeTruthy()
      expect(item.messageKo).toBeTruthy()
    }
  })
})

/**
 * Audit-only 흐름 (SPEC-0004 §3.2.4)
 *
 * MigrationPanel은 입력에 대해 auditEslintConfig를 먼저 호출해 isLegacyConfig를
 * 판정하고, false이면 입력을 그대로 미리보기로 노출하면서 audit 결과만 표시한다.
 * 본 그룹은 그 분기 진입 조건과 진단 정확성을 회귀 방지 차원에서 고정한다.
 */
describe('auditEslintConfig - audit-only 흐름 (Flat config 입력)', () => {
  it('마이그레이션된 flat config 입력은 isLegacyConfig=false를 반환한다', () => {
    const code = `import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {
      "no-console": "warn",
    },
  },
]`
    const result = auditEslintConfig(code)
    expect(result.isLegacyConfig).toBe(false)
    // legacy 안내 항목은 노출되지 않아야 한다
    expect(result.items.some((i) => i.message.includes('Legacy'))).toBe(false)
  })

  it('flat config에서도 deprecated 규칙(indent)을 진단한다', () => {
    const code = `export default [
  {
    rules: {
      indent: ["error", 2],
    },
  },
]`
    const result = auditEslintConfig(code)
    expect(result.isLegacyConfig).toBe(false)
    expect(
      result.items.some((i) => i.severity === 'warning' && i.message.includes('"indent"')),
    ).toBe(true)
  })

  it('flat config에서 권장 규칙이 빠져 있으면 info로 제안한다', () => {
    const code = `import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {},
  },
]`
    const result = auditEslintConfig(code)
    expect(result.isLegacyConfig).toBe(false)
    const infos = result.items.filter((i) => i.severity === 'info')
    expect(infos.some((i) => i.message.includes('"no-console"'))).toBe(true)
  })

  it('legacy로 판정되는 입력은 audit-only 흐름을 트리거하지 않는다 (분기 회귀 방지)', () => {
    const code = `{ "extends": ["eslint:recommended"], "rules": {} }`
    const result = auditEslintConfig(code)
    expect(result.isLegacyConfig).toBe(true)
  })
})

/**
 * 1.4.0 parser-hardening 회귀 방지 (PR #32 Gemini Code Assist 후속).
 * eslintAuditor 내부의 stripComments / findRulesBlockBounds / extractRules /
 * extractExtends 4개 함수를 codeUtils의 문자열-안전 유틸로 교체한 결과,
 * 다음 케이스가 정확히 처리되어야 한다.
 */
describe('auditEslintConfig - 문자열 리터럴 보호 (1.4.0 hardening)', () => {
  it('문자열 안 URL이 한 줄 주석으로 잘못 제거되지 않아 deprecated 규칙을 정확히 감지한다', () => {
    // 문자열 값 안에 "//" 패턴이 있을 때, 그 뒤의 deprecated 규칙(indent)이
    // 주석으로 잘못 처리되어 사라지면 안 된다
    const code = `export default [{
      rules: {
        "comment": "https://example.com",
        "indent": ["error", 2]
      }
    }]`
    const result = auditEslintConfig(code)
    expect(result.items.some((i) => i.message.includes('"indent"'))).toBe(true)
  })

  it('문자열 안 "/*" 패턴이 블록 주석으로 오인되지 않는다', () => {
    // 문자열 값에 "/*" 패턴이 있을 때, 그 뒤의 규칙이 사라지면 안 된다
    const code = `export default [{
      rules: {
        "no-restricted-syntax": ["error", "Pattern: /*hidden*/"],
        "indent": ["error", 2]
      }
    }]`
    const result = auditEslintConfig(code)
    expect(result.items.some((i) => i.message.includes('"indent"'))).toBe(true)
  })

  it('extractRules가 문자열 값 안의 객체 패턴을 키로 오인하지 않는다', () => {
    // 문자열 값 안의 "key:" 패턴이 키로 추출되면 잘못된 deprecated 경고가 발생할 수 있다
    const code = `export default [{
      rules: {
        "no-restricted-syntax": ["error", { selector: "X", message: "use { semi: true } only" }],
        "no-console": "warn"
      }
    }]`
    const result = auditEslintConfig(code)
    // no-console은 권장 규칙이라 이미 있으면 info 안내가 없어야 함
    const noConsoleInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('"no-console"'),
    )
    expect(noConsoleInfos).toHaveLength(0)
    // semi가 키로 잘못 추출되어 deprecated 경고로 노출되면 안 됨 (문자열 내부)
    const falseSemiWarnings = result.items.filter(
      (i) => i.severity === 'warning' && i.message.includes('"semi"'),
    )
    expect(falseSemiWarnings).toHaveLength(0)
  })

  it('짝수 백슬래시로 끝나는 문자열 뒤의 키 추출이 정상 동작한다', () => {
    // "C:\\\\" 같이 백슬래시 2개로 끝나는 문자열 뒤에 다른 규칙이 와도
    // extractRules가 종료 따옴표를 정확히 인식해야 한다
    const code = `export default [{
      rules: {
        "comment": "C:\\\\\\\\",
        "no-console": "warn"
      }
    }]`
    const result = auditEslintConfig(code)
    // no-console이 정상 추출되어 권장 규칙 info 안내가 없어야 함
    const noConsoleInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('"no-console"'),
    )
    expect(noConsoleInfos).toHaveLength(0)
  })

  /**
   * PR #33 Gemini Code Assist 후속 — extractRules가 키 내부의 이스케이프된
   * 따옴표를 만났을 때 인덱스 indexOf로 종료 따옴표를 잘못 잡던 결함을 회귀 방지한다.
   */
  it('extractRules가 키 내부의 이스케이프된 따옴표를 정확히 처리한다', () => {
    // "key\"with-quote": true 형태 — 키 안에 이스케이프된 따옴표가 있어도
    // 종료 따옴표를 정확히 인식해야 한다
    const code = `export default [{
      rules: {
        "key\\"with-quote": "warn",
        "no-console": "warn"
      }
    }]`
    const result = auditEslintConfig(code)
    // no-console이 정상 추출되어 권장 info 안내가 없어야 함
    // (이스케이프된 따옴표 처리가 깨지면 no-console까지 도달하지 못함)
    const noConsoleInfos = result.items.filter(
      (i) => i.severity === 'info' && i.message.includes('"no-console"'),
    )
    expect(noConsoleInfos).toHaveLength(0)
  })

  it('이스케이프된 따옴표 키 뒤의 deprecated 규칙도 정확히 감지한다', () => {
    const code = `export default [{
      rules: {
        "weird\\"key": "warn",
        "indent": ["error", 2]
      }
    }]`
    const result = auditEslintConfig(code)
    // indent가 deprecated 경고로 정확히 감지되어야 함
    const indentWarnings = result.items.filter(
      (i) => i.severity === 'warning' && i.message.includes('"indent"'),
    )
    expect(indentWarnings.length).toBeGreaterThan(0)
  })
})
