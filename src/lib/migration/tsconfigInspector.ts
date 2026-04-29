/**
 * TSConfig 인스펙터.
 * detect → parse → audit → migrate 절차를 ConfigInspector 인터페이스로 묶는다.
 *
 * SPEC-0004 §3.2.1 / §6.1 단계 9 참조.
 */
import { auditTsconfig } from './tsconfigAuditor'
import { migrateTsconfig } from './tsconfigMigrator'
import { detectTsconfigFormat, parseTsconfig, type TsconfigJson } from './tsconfigParser'
import type { ConfigInspector } from './types'

export const tsconfigInspector: ConfigInspector<TsconfigJson, TsconfigJson> = {
  detect: detectTsconfigFormat,
  parse: parseTsconfig,
  audit: auditTsconfig,
  migrate: migrateTsconfig,
}
