// 공통 타입 (SPEC-0004 §3.2.1)
export type {
  AuditItem,
  AuditResult,
  AuditSeverity,
  ConfigFormat,
  ConfigInspector,
  MigrationResult,
  MigrationWarning,
} from './types'

// ESLint 인스펙터 (객체 래퍼)
export { eslintInspector } from './eslintInspector'

// ESLint 개별 함수 (호환 유지 — 점진 전환 대상)
export { migrateEslintConfig } from './eslintMigrator'
export { detectConfigFormat, parseEslintLegacyConfig, type LegacyEslintConfig } from './parser'
export { auditEslintConfig } from './eslintAuditor'

// Prettier 인스펙터 (객체 래퍼)
export { prettierInspector } from './prettierInspector'
export type { PrettierConfig } from './prettierParser'
