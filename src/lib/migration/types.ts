/**
 * Import & Audit 모듈의 공통 타입 정의.
 * ESLint, Prettier, TSConfig 등 도구별 인스펙터가 공통으로 따르는 인터페이스이다.
 *
 * SPEC-0004 §3.2.1 참조.
 */

/** 감지 가능한 설정 형식 */
export type ConfigFormat = 'json' | 'commonjs' | 'esm' | 'unknown'

/** 감사 결과의 심각도 */
export type AuditSeverity = 'error' | 'warning' | 'info'

/** 감사 결과의 개별 항목 */
export interface AuditItem {
  severity: AuditSeverity
  message: string
  messageKo: string
  suggestion?: string
  suggestionKo?: string
  ruleName?: string
  line?: number
}

/** 감사 결과 */
export interface AuditResult {
  isLegacyConfig: boolean
  items: AuditItem[]
  summary: {
    errors: number
    warnings: number
    infos: number
  }
}

/** 마이그레이션 경고 (자동 변환이 불완전한 항목) */
export interface MigrationWarning {
  message: string
  messageKo: string
}

/**
 * 마이그레이션 결과.
 * - output: 변환된 코드 문자열 (필수)
 * - config: 변환된 객체 (옵셔널 — 도구가 객체 환원이 가능한 경우에만 채움)
 */
export interface MigrationResult<TModern = unknown> {
  output: string
  config?: TModern
  warnings: MigrationWarning[]
}

/**
 * 도구별 인스펙터가 따르는 공통 인터페이스.
 * 처리 절차(detect → parse → audit → migrate)를 공통화하고,
 * 내부 데이터 형태는 제네릭 TLegacy/TModern으로 도구별로 자유롭게 둔다.
 */
export interface ConfigInspector<TLegacy, TModern = unknown> {
  detect(input: string): ConfigFormat
  parse(input: string, format: ConfigFormat): TLegacy
  audit(input: string): AuditResult
  migrate(legacy: TLegacy): MigrationResult<TModern>
}
