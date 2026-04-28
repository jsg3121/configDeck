/**
 * tsconfig.json을 권장값 기반으로 마이그레이션한다.
 *
 * Q3 사용자 결정 (2026-04-29):
 *   migrate를 "audit info를 모두 적용해 권장 설정 생성"으로 정의한다.
 *   사용자에게 "내 tsconfig를 권장값으로 업그레이드한 결과"를 보여주는 것이
 *   가장 가치 있다는 판단.
 *
 * 동작:
 *   1. Deprecated 옵션을 자동 변환 가능한 경우 변환 (out → outDir 등)
 *   2. 자동 변환 불가능한 deprecated 옵션은 제거하고 warnings에 안내
 *   3. 권장 옵션 누락은 compilerOptions에 추가
 *   4. 출력 헤더 주석으로 "권장값 기반 결과" 안내 (메모리 합의 — 2026-04-29)
 *
 * SPEC-0004 §3.2.1 ConfigInspector 인터페이스의 migrate 구현체.
 */
import type { TsconfigJson } from './tsconfigParser'
import type { MigrationResult, MigrationWarning } from './types'

/** Deprecated 옵션의 자동 키 리네임 매핑 (값 보존) */
const RENAME_MAP: Record<string, string> = {
  out: 'outDir',
  noImplicitUseStrict: 'alwaysStrict',
}

/**
 * Deprecated 옵션 중 자동 변환할 수 없거나 의미 손실 위험이 있어 제거 후
 * 사용자에게 안내하는 항목.
 *
 * value: 변환 안내(영문/한글)
 */
const DROP_WITH_WARNING: Record<string, { en: string; ko: string }> = {
  charset: {
    en: 'charset is removed. Modern build tools default to UTF-8',
    ko: 'charset은 제거되었습니다. 현대 빌드 도구는 UTF-8을 기본 사용합니다',
  },
  noStrictGenericChecks: {
    en: 'noStrictGenericChecks is removed. Enable "strict: true" instead',
    ko: 'noStrictGenericChecks는 제거되었습니다. 대신 "strict: true"를 활성화하세요',
  },
  suppressExcessPropertyErrors: {
    en: 'suppressExcessPropertyErrors is removed. Enable "strict: true" and adjust types',
    ko: 'suppressExcessPropertyErrors는 제거되었습니다. "strict: true"를 사용하고 타입을 조정하세요',
  },
  suppressImplicitAnyIndexErrors: {
    en: 'suppressImplicitAnyIndexErrors is removed. Use "noImplicitAny" + "noUncheckedIndexedAccess"',
    ko: 'suppressImplicitAnyIndexErrors는 제거되었습니다. "noImplicitAny"와 "noUncheckedIndexedAccess"를 사용하세요',
  },
  importsNotUsedAsValues: {
    en: 'importsNotUsedAsValues is removed in TS 5.0+. Use "verbatimModuleSyntax" — manual review needed',
    ko: 'importsNotUsedAsValues는 TS 5.0+에서 제거되었습니다. "verbatimModuleSyntax"로 교체 필요 — 수동 검토 권장',
  },
  preserveValueImports: {
    en: 'preserveValueImports is removed in TS 5.0+. Use "verbatimModuleSyntax" — manual review needed',
    ko: 'preserveValueImports는 TS 5.0+에서 제거되었습니다. "verbatimModuleSyntax"로 교체 필요 — 수동 검토 권장',
  },
  keyofStringsOnly: {
    en: 'keyofStringsOnly is removed',
    ko: 'keyofStringsOnly는 제거되었습니다',
  },
}

/**
 * 권장 옵션 셋 — auditor의 RECOMMENDED_OPTIONS와 동일한 데이터셋을 따른다.
 * (의도적으로 중복 정의: auditor는 진단, migrator는 적용으로 책임이 다르고
 *  데이터 변경 시 양쪽이 명확히 트래킹되도록 함)
 *
 * key: 옵션명, value: 권장값
 */
const RECOMMENDED_DEFAULTS: Record<string, unknown> = {
  // 컴파일 타깃
  target: 'ES2022',
  module: 'ESNext',
  moduleResolution: 'bundler',

  // strict 계열
  strict: true,

  // 빌드 위생
  esModuleInterop: true,
  forceConsistentCasingInFileNames: true,
  isolatedModules: true,
  resolveJsonModule: true,
  skipLibCheck: true,

  // 코드 품질
  noUnusedLocals: true,
  noUnusedParameters: true,
  noFallthroughCasesInSwitch: true,
  noImplicitReturns: true,
  noUncheckedIndexedAccess: true,
}

/** 출력 헤더 안내 주석 (사용자가 권장값 기반 결과임을 인지하도록) */
const OUTPUT_HEADER = [
  '// 본 결과는 모던 TypeScript 프로젝트 권장값을 적용한 것입니다.',
  '// 프로젝트 컨텍스트(monorepo, 라이브러리/앱, Node.js 버전 등)에 따라 일부 값은 조정이 필요할 수 있습니다.',
  '// 그대로 적용하기 전에 검토하세요.',
].join('\n')

/** tsconfig 권장값 기반 마이그레이션 */
export const migrateTsconfig = (legacy: TsconfigJson): MigrationResult<TsconfigJson> => {
  const warnings: MigrationWarning[] = []
  const next: TsconfigJson = {}

  // 1. extends/include/exclude/files/references는 그대로 보존
  if (legacy.extends !== undefined) next.extends = legacy.extends
  if (legacy.include !== undefined) next.include = legacy.include
  if (legacy.exclude !== undefined) next.exclude = legacy.exclude
  if (legacy.files !== undefined) next.files = legacy.files
  if (legacy.references !== undefined) next.references = legacy.references

  // 2. compilerOptions 처리
  const inputCo = (legacy.compilerOptions ?? {}) as Record<string, unknown>
  const outCo: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(inputCo)) {
    // 2-1. 제거 + 경고
    if (key in DROP_WITH_WARNING) {
      const msg = DROP_WITH_WARNING[key]
      warnings.push({ message: msg.en, messageKo: msg.ko })
      continue
    }

    // 2-2. 단순 리네임
    const renamed = RENAME_MAP[key]
    if (renamed) {
      outCo[renamed] = value
      continue
    }

    // 2-3. 그 외는 보존
    outCo[key] = value
  }

  // 3. 권장 옵션 누락 시 추가
  for (const [key, defaultValue] of Object.entries(RECOMMENDED_DEFAULTS)) {
    if (!(key in outCo)) {
      outCo[key] = defaultValue
    }
  }

  // compilerOptions가 있던 경우만 또는 권장값 추가가 있는 경우 next에 부착
  if (Object.keys(outCo).length > 0) {
    next.compilerOptions = outCo
  }

  // 4. 권장값 적용에 대한 일반 경고 한 줄 (사용자 합의 — 메모리 명시)
  warnings.unshift({
    message:
      'Result is based on general modern-project recommendations. Review for monorepo, library, or non-bundler contexts before applying.',
    messageKo:
      '본 결과는 일반 모던 프로젝트 권장값 기준입니다. monorepo·라이브러리·번들러 미사용 환경 등에서는 적용 전 검토하세요.',
  })

  // 5. 출력 직렬화 (헤더 주석 + JSON 본문 2칸 들여쓰기)
  const body = JSON.stringify(next, null, 2)
  const output = `${OUTPUT_HEADER}\n${body}\n`

  return {
    output,
    config: next,
    warnings,
  }
}
