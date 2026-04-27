/**
 * ESLint 인스펙터.
 * detect → parse → audit → migrate 절차를 ConfigInspector 인터페이스로 묶는다.
 *
 * SPEC-0004 §3.2.1 / §6.1 단계 5 참조.
 */
import { auditEslintConfig } from './eslintAuditor'
import { migrateEslintConfig } from './eslintMigrator'
import { detectConfigFormat, parseEslintLegacyConfig, type LegacyEslintConfig } from './parser'
import type { ConfigInspector } from './types'

export const eslintInspector: ConfigInspector<LegacyEslintConfig, never> = {
  detect: detectConfigFormat,
  parse: parseEslintLegacyConfig,
  audit: auditEslintConfig,
  migrate: migrateEslintConfig,
}
