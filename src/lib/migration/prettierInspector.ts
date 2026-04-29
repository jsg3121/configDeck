/**
 * Prettier 인스펙터.
 * detect → parse → audit → migrate 절차를 ConfigInspector 인터페이스로 묶는다.
 *
 * SPEC-0004 §3.2.1 / §6.1 단계 8 참조.
 */
import { auditPrettierConfig } from './prettierAuditor'
import { migratePrettierConfig } from './prettierMigrator'
import { detectPrettierFormat, parsePrettierConfig, type PrettierConfig } from './prettierParser'
import type { ConfigInspector } from './types'

export const prettierInspector: ConfigInspector<PrettierConfig, PrettierConfig> = {
  detect: detectPrettierFormat,
  parse: parsePrettierConfig,
  audit: auditPrettierConfig,
  migrate: migratePrettierConfig,
}
