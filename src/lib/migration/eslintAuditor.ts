/**
 * ESLint 설정 파일을 분석하여 문제점과 개선점을 진단한다.
 * flat config와 legacy config 모두 지원한다.
 *
 * 주석 제거/문자열 종료 판별은 codeUtils의 문자열-안전 구현을 사용한다.
 * (1.4.0 parser-hardening — Gemini Code Assist 후속)
 */
import { isEscaped, stripCommentsFromCode } from './codeUtils'
import type { AuditItem, AuditResult, AuditSeverity } from './types'

export type { AuditItem, AuditResult, AuditSeverity }

/** deprecated된 ESLint 규칙 목록 (ESLint 9 기준) */
const DEPRECATED_RULES = new Set([
  'indent',
  'semi',
  'quotes',
  'comma-dangle',
  'no-extra-semi',
  'no-mixed-spaces-and-tabs',
  'space-before-blocks',
  'space-before-function-paren',
  'space-in-parens',
  'space-infix-ops',
  'space-unary-ops',
  'keyword-spacing',
  'arrow-spacing',
  'block-spacing',
  'brace-style',
  'comma-spacing',
  'computed-property-spacing',
  'func-call-spacing',
  'generator-star-spacing',
  'key-spacing',
  'object-curly-spacing',
  'rest-spread-spacing',
  'semi-spacing',
  'switch-colon-spacing',
  'template-curly-spacing',
  'template-tag-spacing',
  'yield-star-spacing',
  'array-bracket-spacing',
  'array-element-newline',
  'array-bracket-newline',
  'object-curly-newline',
  'object-property-newline',
  'function-paren-newline',
  'implicit-arrow-linebreak',
  'linebreak-style',
  'max-len',
  'newline-per-chained-call',
  'no-confusing-arrow',
  'no-floating-decimal',
  'no-multi-spaces',
  'no-multiple-empty-lines',
  'no-tabs',
  'no-trailing-spaces',
  'no-whitespace-before-property',
  'nonblock-statement-body-position',
  'one-var-declaration-per-line',
  'operator-linebreak',
  'padded-blocks',
  'padding-line-between-statements',
  'quote-props',
  'semi-style',
  'wrap-iife',
  'wrap-regex',
])

/** 권장되는 규칙 (활성화 권장) */
const RECOMMENDED_RULES: Record<string, { value: string; reason: string; reasonKo: string }> = {
  'no-console': {
    value: 'warn',
    reason: 'Prevents accidental console.log in production',
    reasonKo: '프로덕션에서 실수로 남은 console.log 방지',
  },
  'no-debugger': {
    value: 'error',
    reason: 'Prevents debugger statements in production',
    reasonKo: '프로덕션에서 debugger 문 방지',
  },
  eqeqeq: {
    value: 'error',
    reason: 'Enforces strict equality for type safety',
    reasonKo: '타입 안전성을 위한 엄격한 동등 비교 강제',
  },
  'no-var': {
    value: 'error',
    reason: 'Enforces let/const over var for better scoping',
    reasonKo: '더 나은 스코핑을 위해 var 대신 let/const 사용 강제',
  },
  'prefer-const': {
    value: 'error',
    reason: 'Enforces const for variables that are never reassigned',
    reasonKo: '재할당되지 않는 변수에 const 사용 강제',
  },
}

/** legacy config 패턴 감지 */
const isLegacyConfig = (code: string): boolean => {
  const legacyPatterns = [
    /["']?extends["']?\s*:/,
    /["']?env["']?\s*:/,
    /module\.exports\s*=/,
    /\.eslintrc/,
  ]
  const flatPatterns = [/export\s+default\s+\[/, /import\s+.*\s+from\s+['"]@eslint/]

  const hasLegacy = legacyPatterns.some((p) => p.test(code))
  const hasFlat = flatPatterns.some((p) => p.test(code))

  return hasLegacy && !hasFlat
}

/**
 * 코드에서 rules 블록의 시작 `{`부터 매칭되는 닫는 `}` 위치를 찾는다.
 * 중첩 객체(예: `["error", { selector: "..." }]`)를 고려하여 괄호 균형을 카운트한다.
 */
const findRulesBlockBounds = (code: string): { start: number; end: number } | null => {
  const rulesMatch = code.match(/["']?rules["']?\s*:\s*\{/)
  if (!rulesMatch || rulesMatch.index === undefined) return null

  const openBraceIdx = code.indexOf('{', rulesMatch.index)
  if (openBraceIdx === -1) return null

  let depth = 1
  let i = openBraceIdx + 1
  let inString: '"' | "'" | null = null
  while (i < code.length && depth > 0) {
    const ch = code[i]
    if (inString) {
      if (ch === inString && !isEscaped(code, i)) inString = null
    } else if (ch === '"' || ch === "'") {
      inString = ch
    } else if (ch === '{') {
      depth++
    } else if (ch === '}') {
      depth--
    }
    i++
  }
  if (depth !== 0) return null

  return { start: openBraceIdx, end: i - 1 }
}

/**
 * rules 블록 내부에서 최상위 규칙 키를 추출한다.
 * 값 파싱은 audit 목적상 불필요하므로 키만 수집한다.
 */
const extractRules = (code: string): Record<string, unknown> => {
  const bounds = findRulesBlockBounds(code)
  if (!bounds) return {}

  const inner = code.slice(bounds.start + 1, bounds.end)
  const rules: Record<string, unknown> = {}

  // depth 0 위치에서 "key": 또는 'key': 또는 key: 패턴을 찾는다
  let depth = 0
  let inString: '"' | "'" | null = null
  let i = 0
  while (i < inner.length) {
    const ch = inner[i]
    if (inString) {
      if (ch === inString && !isEscaped(inner, i)) inString = null
      i++
      continue
    }
    if (ch === '"' || ch === "'") {
      // depth 0에서 따옴표로 감싼 키 후보
      if (depth === 0) {
        const quote = ch
        const end = inner.indexOf(quote, i + 1)
        if (end !== -1) {
          const key = inner.slice(i + 1, end)
          // 다음 non-whitespace가 ':' 인지 확인
          let j = end + 1
          while (j < inner.length && /\s/.test(inner[j])) j++
          if (inner[j] === ':') {
            rules[key] = true
            i = j + 1
            continue
          }
        }
      }
      inString = ch
      i++
      continue
    }
    if (ch === '{' || ch === '[' || ch === '(') depth++
    else if (ch === '}' || ch === ']' || ch === ')') depth--
    else if (depth === 0 && /[A-Za-z@_$]/.test(ch)) {
      // depth 0에서 따옴표 없는 식별자 키 (예: eqeqeq:)
      const start = i
      while (i < inner.length && /[A-Za-z0-9@/_$-]/.test(inner[i])) i++
      const key = inner.slice(start, i)
      let j = i
      while (j < inner.length && /\s/.test(inner[j])) j++
      if (inner[j] === ':') {
        rules[key] = true
        i = j + 1
        continue
      }
    }
    i++
  }

  return rules
}

/**
 * 설정에서 extends 추출.
 * 단순 정규식은 배열 내부 문자열에 `]`가 포함된 경우 조기 종료될 수 있어,
 * 문자열 리터럴을 인식하며 균형 카운트로 배열을 추출한다.
 */
const extractExtends = (code: string): string[] => {
  const arrayMatch = code.match(/["']?extends["']?\s*:\s*\[/)
  if (arrayMatch && arrayMatch.index !== undefined) {
    const openIdx = code.indexOf('[', arrayMatch.index)
    if (openIdx !== -1) {
      let depth = 1
      let i = openIdx + 1
      let inString: '"' | "'" | null = null
      while (i < code.length && depth > 0) {
        const ch = code[i]
        if (inString) {
          if (ch === inString && !isEscaped(code, i)) inString = null
        } else if (ch === '"' || ch === "'") {
          inString = ch
        } else if (ch === '[') {
          depth++
        } else if (ch === ']') {
          depth--
        }
        i++
      }
      if (depth === 0) {
        const inner = code.slice(openIdx + 1, i - 1)
        // 문자열 리터럴만 추출 (따옴표로 감싼 항목)
        const items: string[] = []
        const stringPattern = /["']((?:\\.|[^"'\\])*)["']/g
        let m: RegExpExecArray | null
        while ((m = stringPattern.exec(inner)) !== null) {
          if (m[1]) items.push(m[1])
        }
        return items
      }
    }
  }

  const singleExtends = code.match(/["']?extends["']?\s*:\s*["']([^"']+)["']/)
  if (singleExtends) {
    return [singleExtends[1]]
  }

  return []
}

/** ESLint 설정 분석 */
export const auditEslintConfig = (code: string): AuditResult => {
  const items: AuditItem[] = []
  // 주석 처리된 규칙을 활성 규칙으로 오인하지 않도록 사전 제거
  const cleanCode = stripCommentsFromCode(code)
  const isLegacy = isLegacyConfig(cleanCode)

  if (isLegacy) {
    items.push({
      severity: 'warning',
      message: 'Legacy ESLint config format detected',
      messageKo: '레거시 ESLint 설정 형식이 감지되었습니다',
      suggestion: 'Consider migrating to flat config (eslint.config.mjs) for ESLint 9+',
      suggestionKo: 'ESLint 9+를 위해 flat config (eslint.config.mjs)로 마이그레이션을 권장합니다',
    })
  }

  const rules = extractRules(cleanCode)
  const extends_ = extractExtends(cleanCode)

  for (const ruleName of Object.keys(rules)) {
    if (DEPRECATED_RULES.has(ruleName)) {
      items.push({
        severity: 'warning',
        message: `Rule "${ruleName}" is deprecated in ESLint 9`,
        messageKo: `규칙 "${ruleName}"은 ESLint 9에서 deprecated 되었습니다`,
        suggestion: 'Use Prettier or @stylistic/eslint-plugin for formatting rules',
        suggestionKo: '포맷팅 규칙은 Prettier 또는 @stylistic/eslint-plugin 사용을 권장합니다',
      })
    }
  }

  for (const [ruleName, config] of Object.entries(RECOMMENDED_RULES)) {
    if (!(ruleName in rules)) {
      items.push({
        severity: 'info',
        message: `Consider adding "${ruleName}" rule`,
        messageKo: `"${ruleName}" 규칙 추가를 고려해보세요`,
        suggestion: `${config.reason}. Suggested value: "${config.value}"`,
        suggestionKo: `${config.reasonKo}. 권장 값: "${config.value}"`,
      })
    }
  }

  const hasRecommended = extends_.some(
    (e) => e === 'eslint:recommended' || e.includes('recommended'),
  )
  if (!hasRecommended && extends_.length > 0) {
    items.push({
      severity: 'info',
      message: 'Consider extending "eslint:recommended" as a base',
      messageKo: '"eslint:recommended"를 기본으로 확장하는 것을 고려해보세요',
      suggestion: 'It provides a good set of default rules',
      suggestionKo: '좋은 기본 규칙 세트를 제공합니다',
    })
  }

  if (extends_.includes('prettier') || extends_.includes('eslint-config-prettier')) {
    const hasFormattingRules = Object.keys(rules).some((r) => DEPRECATED_RULES.has(r))
    if (hasFormattingRules) {
      items.push({
        severity: 'warning',
        message: 'Formatting rules conflict with Prettier config',
        messageKo: '포맷팅 규칙이 Prettier 설정과 충돌합니다',
        suggestion: 'Remove formatting rules when using eslint-config-prettier',
        suggestionKo: 'eslint-config-prettier 사용 시 포맷팅 규칙을 제거하세요',
      })
    }
  }

  if (code.includes('env') && isLegacy) {
    if (code.includes('browser') && code.includes('node')) {
      items.push({
        severity: 'info',
        message: 'Both browser and node environments are enabled',
        messageKo: 'browser와 node 환경이 모두 활성화되어 있습니다',
        suggestion: 'Consider if both are needed, or split configs for different files',
        suggestionKo: '둘 다 필요한지 확인하거나, 파일별로 설정을 분리하는 것을 고려해보세요',
      })
    }
  }

  const summary = {
    errors: items.filter((i) => i.severity === 'error').length,
    warnings: items.filter((i) => i.severity === 'warning').length,
    infos: items.filter((i) => i.severity === 'info').length,
  }

  return { items, summary, isLegacyConfig: isLegacy }
}
