/**
 * 카탈로그 항목을 사용자 입력에 맞춰 필터링/조회하는 헬퍼.
 * AGENTS.md / CLAUDE.md / Cursor MDC / Copilot 생성기에서 공통 사용한다.
 */

import { BEST_PRACTICES_CATALOG, BOUNDARIES_CATALOG } from '@/lib/data/aiConfig'
import type { AppliesTo, BestPracticeItem, BoundaryItem } from '@/types/aiConfig'

/**
 * 사용자가 선택한 ID 목록에 해당하는 베스트 프랙티스 항목을 반환한다.
 * 카탈로그에 없는 ID는 무시한다.
 */
export const resolveBestPractices = (
  selectedIds: readonly string[],
): readonly BestPracticeItem[] => {
  const idSet = new Set(selectedIds)
  return BEST_PRACTICES_CATALOG.filter((item) => idSet.has(item.id))
}

/**
 * 사용자가 선택한 ID 목록에 해당하는 Boundaries 항목을 반환한다.
 */
export const resolveBoundaries = (selectedIds: readonly string[]): readonly BoundaryItem[] => {
  const idSet = new Set(selectedIds)
  return BOUNDARIES_CATALOG.filter((item) => idSet.has(item.id))
}

/**
 * appliesTo 배열이 주어진 컨텍스트(스택/마커)와 매칭되는지 판단한다.
 * 'all'은 항상 매칭. 그 외는 contextMarkers 중 하나가 appliesTo에 포함되면 매칭.
 */
export const matchesContext = (
  appliesTo: readonly AppliesTo[],
  contextMarkers: readonly AppliesTo[],
): boolean => {
  if (appliesTo.includes('all')) return true
  return contextMarkers.some((marker) => appliesTo.includes(marker))
}
