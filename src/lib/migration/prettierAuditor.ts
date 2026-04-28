/**
 * Prettier 설정 파일을 분석하여 deprecated 옵션과 권장 사항을 진단한다.
 *
 * Prettier 3.0.0 릴리즈 노트(2023-07-05)와 공식 옵션 문서를 데이터셋 1차 소스로 한다.
 *   - https://prettier.io/blog/2023/07/05/3.0.0.html
 *   - https://prettier.io/docs/en/options
 *
 * SPEC-0004 §3.2.1 ConfigInspector 인터페이스의 audit 구현체로 사용된다.
 *
 * isLegacyConfig 정의:
 *   Prettier는 ESLint처럼 "Legacy vs Flat" 형식 전환이 없으므로,
 *   deprecated 옵션이 하나라도 사용 중인 경우를 isLegacyConfig=true로 정의한다.
 *   MigrationPanel의 panelMode 분기는 이 정의를 따라 작동한다
 *   (deprecated 있으면 migrate 흐름, 없으면 audit-only 흐름).
 */
import type { AuditItem, AuditResult } from './types'

/**
 * v3.0.0에서 제거되었거나 v2.x에서 deprecated된 Prettier 옵션.
 * key: 옵션명, value: 대체 옵션/방법
 */
const DEPRECATED_OPTIONS: Record<string, string> = {
  // v2.4.0에서 deprecated, v3.0에서 제거
  jsxBracketSameLine: 'bracketSameLine',
  // v3.0에서 제거 (CLI/JS API). plugins 옵션을 직접 명시한다
  pluginSearchDirs: 'plugins',
}

/**
 * v3.0에서 기본값이 변경된 옵션. 명시되어 있지 않으면 동작이 달라질 수 있다.
 * key: 옵션명, value: { v2 기본값, v3 기본값 }
 */
const CHANGED_DEFAULTS: Record<string, { v2: string; v3: string }> = {
  trailingComma: { v2: '"es5"', v3: '"all"' },
}

/**
 * 코드에서 주석을 제거한다.
 * 문자열 리터럴 내부의 //, /* 는 보존한다.
 */
const stripComments = (code: string): string => {
  let result = ''
  let i = 0
  let inString: '"' | "'" | '`' | null = null
  while (i < code.length) {
    const ch = code[i]
    const next = code[i + 1]
    const prev = code[i - 1]

    if (inString) {
      result += ch
      if (ch === inString && prev !== '\\') inString = null
      i++
      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch
      result += ch
      i++
      continue
    }

    if (ch === '/' && next === '/') {
      while (i < code.length && code[i] !== '\n') i++
      continue
    }

    if (ch === '/' && next === '*') {
      i += 2
      while (i < code.length - 1 && !(code[i] === '*' && code[i + 1] === '/')) i++
      i += 2
      continue
    }

    result += ch
    i++
  }
  return result
}

/**
 * 코드에서 단일 옵션 키의 사용 여부를 검사한다.
 * "key": 또는 'key': 또는 식별자 key: 형태 모두 매칭한다.
 */
const hasOptionKey = (code: string, key: string): boolean => {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`(?:["']${escaped}["']|\\b${escaped})\\s*:`)
  return pattern.test(code)
}

/** Prettier 설정 분석 */
export const auditPrettierConfig = (code: string): AuditResult => {
  const items: AuditItem[] = []
  const cleanCode = stripComments(code)

  // 1. Deprecated 옵션 감지
  let hasDeprecated = false
  for (const [optionName, replacement] of Object.entries(DEPRECATED_OPTIONS)) {
    if (hasOptionKey(cleanCode, optionName)) {
      hasDeprecated = true
      items.push({
        severity: 'warning',
        message: `Option "${optionName}" is deprecated in Prettier 3.x`,
        messageKo: `옵션 "${optionName}"은 Prettier 3.x에서 deprecated 되었습니다`,
        suggestion: `Replace with "${replacement}"`,
        suggestionKo: `"${replacement}" 옵션으로 교체하세요`,
      })
    }
  }

  // 2. 기본값 변경 옵션 — 명시되지 않은 경우에만 안내
  for (const [optionName, defaults] of Object.entries(CHANGED_DEFAULTS)) {
    if (!hasOptionKey(cleanCode, optionName)) {
      items.push({
        severity: 'info',
        message: `Default of "${optionName}" changed in Prettier 3.x`,
        messageKo: `Prettier 3.x에서 "${optionName}"의 기본값이 변경되었습니다`,
        suggestion: `Was ${defaults.v2}, now ${defaults.v3}. Set explicitly to keep previous behavior`,
        suggestionKo: `이전 ${defaults.v2}, 현재 ${defaults.v3}. 이전 동작을 유지하려면 명시하세요`,
      })
    }
  }

  // 3. 빈 설정 안내
  const trimmed = cleanCode.trim()
  const isEmptyJson = trimmed === '{}' || trimmed === ''
  if (isEmptyJson) {
    items.push({
      severity: 'info',
      message: 'Prettier config is empty',
      messageKo: 'Prettier 설정이 비어 있습니다',
      suggestion: 'Add common options like printWidth, semi, singleQuote, trailingComma',
      suggestionKo: 'printWidth, semi, singleQuote, trailingComma 같은 공통 옵션을 추가하세요',
    })
  }

  const summary = {
    errors: items.filter((i) => i.severity === 'error').length,
    warnings: items.filter((i) => i.severity === 'warning').length,
    infos: items.filter((i) => i.severity === 'info').length,
  }

  return { items, summary, isLegacyConfig: hasDeprecated }
}
