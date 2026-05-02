/**
 * Skills P0 카탈로그 인덱스.
 *
 * ADR-0018 §1.2의 8종을 단일 카탈로그로 묶는다.
 * 각 스킬의 본문은 src/lib/data/aiConfig/skills/{name}.ts에 분리되어 있다.
 */

import type { SkillCatalogItem, SkillId } from '@/types/aiConfig'

import { ADR_CREATE_SKILL } from './skills/adrCreate'
import { COMMIT_SKILL } from './skills/commit'
import { DEBUG_SKILL } from './skills/debug'
import { PR_CREATE_SKILL } from './skills/prCreate'
import { PR_REVIEW_SKILL } from './skills/prReview'
import { README_UPDATE_SKILL } from './skills/readmeUpdate'
import { REFACTOR_SKILL } from './skills/refactor'
import { TEST_WRITER_SKILL } from './skills/testWriter'

/** ADR-0018 §1.2에서 정의한 P0 8종 */
export const SKILLS_CATALOG: readonly SkillCatalogItem[] = [
  COMMIT_SKILL,
  PR_CREATE_SKILL,
  PR_REVIEW_SKILL,
  TEST_WRITER_SKILL,
  DEBUG_SKILL,
  REFACTOR_SKILL,
  ADR_CREATE_SKILL,
  README_UPDATE_SKILL,
]

/** ID로 빠른 조회 */
export const SKILLS_BY_ID: Readonly<Record<SkillId, SkillCatalogItem>> = {
  commit: COMMIT_SKILL,
  'pr-create': PR_CREATE_SKILL,
  'pr-review': PR_REVIEW_SKILL,
  'test-writer': TEST_WRITER_SKILL,
  debug: DEBUG_SKILL,
  refactor: REFACTOR_SKILL,
  'adr-create': ADR_CREATE_SKILL,
  'readme-update': README_UPDATE_SKILL,
}
