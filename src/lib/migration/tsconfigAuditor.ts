/**
 * tsconfig.json을 분석하여 deprecated 옵션과 권장 사항을 진단한다.
 *
 * 데이터셋 출처:
 *   - https://www.typescriptlang.org/tsconfig (공식 옵션 레퍼런스)
 *   - https://github.com/tsconfig/bases (커뮤니티 권장 베이스)
 *
 * SPEC-0004 §3.2.1 ConfigInspector 인터페이스의 audit 구현체.
 *
 * **중요한 톤 원칙 (사용자 합의 — 2026-04-29)**:
 *   TSConfig 옵션은 ESLint/Prettier와 달리 "정답"이 아니라 권장형이 많다.
 *   monorepo, 라이브러리/앱 구분, Node.js/브라우저 환경, 빌드 타깃에 따라
 *   적절한 값이 달라진다. 따라서 본 auditor의 모든 메시지는 단정적이지 않고
 *   "권장합니다 / 검토하세요"라는 톤을 사용한다.
 *   ESLint auditor의 `is deprecated` 같은 단정 표현과 의도적으로 톤이 다르다.
 *
 * isLegacyConfig 정의:
 *   tsconfig는 마이그레이션 단위(legacy/modern)가 명확하지 않다. deprecated
 *   옵션이 하나라도 사용 중인 경우를 isLegacyConfig=true로 정의한다.
 *   MigrationPanel은 이를 따라 deprecated 있으면 migrate 흐름,
 *   없으면 audit-only 흐름으로 분기한다.
 */
import { hasExtendsField } from './tsconfigParser'
import type { AuditItem, AuditResult } from './types'

/**
 * TypeScript 5.x 또는 그 이전에 deprecated 되었거나 backwards-compatibility
 * 카테고리에 들어간 compilerOptions.
 *
 * key: 옵션명, value: 대체 방법 (영문/한글)
 */
const DEPRECATED_OPTIONS: Record<string, { en: string; ko: string }> = {
  out: {
    en: 'Use "outDir" together with "rootDir" instead',
    ko: '"outDir"과 "rootDir"을 함께 사용하세요',
  },
  charset: {
    en: 'Modern build tools default to UTF-8',
    ko: '현대 빌드 도구는 UTF-8을 기본 사용합니다',
  },
  noImplicitUseStrict: {
    en: 'Use "alwaysStrict" instead',
    ko: '"alwaysStrict"를 사용하세요',
  },
  noStrictGenericChecks: {
    en: 'Use "strict: true" instead',
    ko: '"strict: true"를 사용하세요',
  },
  suppressExcessPropertyErrors: {
    en: 'Use "strict: true" and adjust types instead',
    ko: '"strict: true"를 사용하고 타입을 조정하세요',
  },
  suppressImplicitAnyIndexErrors: {
    en: 'Use "noImplicitAny" + "noUncheckedIndexedAccess" instead',
    ko: '"noImplicitAny"와 "noUncheckedIndexedAccess"를 함께 사용하세요',
  },
  importsNotUsedAsValues: {
    en: 'Removed in TypeScript 5.0+. Use "verbatimModuleSyntax" instead',
    ko: 'TypeScript 5.0+에서 제거되었습니다. "verbatimModuleSyntax"를 사용하세요',
  },
  preserveValueImports: {
    en: 'Removed in TypeScript 5.0+. Use "verbatimModuleSyntax" instead',
    ko: 'TypeScript 5.0+에서 제거되었습니다. "verbatimModuleSyntax"를 사용하세요',
  },
  keyofStringsOnly: {
    en: 'Removed in modern TypeScript',
    ko: '최신 TypeScript에서 제거되었습니다',
  },
}

/**
 * 권장 옵션 셋. 일반적인 모던 TypeScript 프로젝트의 권장값이다.
 *
 * 주의: monorepo, 라이브러리, 빌드 타깃, ts 버전 등에 따라 값이 달라질 수 있다.
 * 본 데이터는 "현대 앱 프로젝트(번들러 사용)" 시나리오에 최적화되어 있다.
 *
 * key: 옵션명, value: { 권장값, 사유(영문/한글) }
 */
const RECOMMENDED_OPTIONS: Record<string, { value: unknown; reasonEn: string; reasonKo: string }> =
  {
    // 컴파일 타깃
    target: {
      value: 'ES2022',
      reasonEn: 'Modern bundlers/runtimes support ES2022; older targets ship more polyfills',
      reasonKo: '현대 번들러·런타임은 ES2022를 지원하며, 낮은 타깃은 폴리필이 늘어납니다',
    },
    module: {
      value: 'ESNext',
      reasonEn: 'Bundler resolves module interop; ESNext keeps tree-shaking efficient',
      reasonKo: '번들러가 모듈 호환을 처리하므로 ESNext가 트리 셰이킹에 유리합니다',
    },
    moduleResolution: {
      value: 'bundler',
      reasonEn: 'Use "bundler" with bundlers, "nodenext" with native Node.js ESM',
      reasonKo: '번들러 환경은 "bundler", Node.js 네이티브 ESM 환경은 "nodenext"가 적절합니다',
    },

    // strict 계열
    strict: {
      value: true,
      reasonEn: 'Enables all strict type-checking options at once',
      reasonKo: '모든 strict 옵션을 한 번에 활성화합니다',
    },

    // 빌드 위생
    esModuleInterop: {
      value: true,
      reasonEn: 'Improves CommonJS/ESM interop; almost always desired in modern projects',
      reasonKo: 'CommonJS/ESM 호환을 개선합니다. 모던 프로젝트에서 거의 항상 권장됩니다',
    },
    forceConsistentCasingInFileNames: {
      value: true,
      reasonEn: 'Avoids case-sensitivity bugs across OSes',
      reasonKo: '운영체제 간 대소문자 차이로 인한 버그를 방지합니다',
    },
    isolatedModules: {
      value: true,
      reasonEn: 'Required for tools that transpile files in isolation (esbuild, swc, etc.)',
      reasonKo: '파일 단위로 변환하는 도구(esbuild, swc 등)와의 호환을 위해 권장합니다',
    },
    resolveJsonModule: {
      value: true,
      reasonEn: 'Allows importing .json files',
      reasonKo: '.json 파일 import를 허용합니다',
    },
    skipLibCheck: {
      value: true,
      reasonEn: 'Significantly speeds up compilation; tradeoff is less coverage of @types files',
      reasonKo:
        '컴파일 속도를 크게 높입니다. @types의 검사 범위가 줄어드는 트레이드오프가 있습니다',
    },

    // 코드 품질 (린트성)
    noUnusedLocals: {
      value: true,
      reasonEn: 'Catches unused local variables; complements ESLint',
      reasonKo: '사용되지 않는 지역 변수를 잡습니다. ESLint를 보완합니다',
    },
    noUnusedParameters: {
      value: true,
      reasonEn: 'Catches unused function parameters',
      reasonKo: '사용되지 않는 함수 매개변수를 잡습니다',
    },
    noFallthroughCasesInSwitch: {
      value: true,
      reasonEn: 'Prevents accidental switch fallthrough',
      reasonKo: 'switch 의도치 않은 fallthrough를 방지합니다',
    },
    noImplicitReturns: {
      value: true,
      reasonEn: 'Ensures all code paths return a value',
      reasonKo: '모든 분기에서 반환값을 명시하도록 강제합니다',
    },
    noUncheckedIndexedAccess: {
      value: true,
      reasonEn: 'Adds undefined to indexed access types; safer at runtime',
      reasonKo: '인덱스 접근 결과에 undefined를 추가해 런타임 안전성을 높입니다',
    },
  }

/** 코드 차원에서 옵션 키 사용 여부를 빠르게 검사 (compilerOptions 안에 있는지 모호하지만 audit 목적상 충분) */
const hasOptionKey = (code: string, key: string): boolean => {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`["']${escaped}["']\\s*:`).test(code)
}

/**
 * tsconfig.json 분석.
 *
 * 모든 메시지는 "권장합니다 / 검토하세요" 톤을 사용한다 — 사용자 합의에 따름.
 * extends가 발견되면 첫 info로 안내해 사용자가 진단 결과의 한계를 인지하도록 한다.
 */
export const auditTsconfig = (code: string): AuditResult => {
  const items: AuditItem[] = []

  // 0. extends 안내 — 가장 먼저 노출되도록 추가
  if (hasExtendsField(code)) {
    items.push({
      severity: 'info',
      message: 'Options inherited via "extends" are not included in this audit',
      messageKo: '"extends"로 상속받은 옵션은 이 진단에 포함되지 않습니다',
      suggestion:
        'Some recommendations below may already be satisfied by the extended config — review accordingly',
      suggestionKo: '아래 권장 사항 중 일부는 상속된 설정에서 이미 충족되었을 수 있습니다',
    })
  }

  // 1. Deprecated 옵션 감지
  let hasDeprecated = false
  for (const [name, msg] of Object.entries(DEPRECATED_OPTIONS)) {
    if (hasOptionKey(code, name)) {
      hasDeprecated = true
      items.push({
        severity: 'warning',
        message: `Option "${name}" is deprecated or kept only for backwards compatibility`,
        messageKo: `옵션 "${name}"은 deprecated 되었거나 하위 호환용으로만 유지됩니다`,
        suggestion: msg.en,
        suggestionKo: msg.ko,
      })
    }
  }

  // 2. 권장 옵션 누락 안내
  for (const [name, info] of Object.entries(RECOMMENDED_OPTIONS)) {
    if (!hasOptionKey(code, name)) {
      items.push({
        severity: 'info',
        message: `Consider setting "${name}" (recommended for modern projects)`,
        messageKo: `"${name}" 옵션 설정을 검토해보세요 (모던 프로젝트 권장)`,
        suggestion: `${info.reasonEn}. Recommended value: ${JSON.stringify(info.value)}`,
        suggestionKo: `${info.reasonKo}. 권장 값: ${JSON.stringify(info.value)}`,
      })
    }
  }

  // 3. 빈 설정 안내
  const isEmptyJson = code.trim() === '{}' || code.trim() === ''
  if (isEmptyJson) {
    items.push({
      severity: 'info',
      message: 'tsconfig is empty',
      messageKo: 'tsconfig가 비어 있습니다',
      suggestion: 'Add at least target/module/strict to start; see tsconfig.json reference',
      suggestionKo: '최소한 target/module/strict 정도는 추가하는 것을 검토하세요',
    })
  }

  const summary = {
    errors: items.filter((i) => i.severity === 'error').length,
    warnings: items.filter((i) => i.severity === 'warning').length,
    infos: items.filter((i) => i.severity === 'info').length,
  }

  return { items, summary, isLegacyConfig: hasDeprecated }
}
