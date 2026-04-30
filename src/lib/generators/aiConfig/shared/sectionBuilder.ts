/**
 * AGENTS.md / CLAUDE.md 본문 섹션 빌더.
 * 6대 섹션(Commands/Testing/Project structure/Code style/Git workflow/Boundaries)을
 * 사용자 입력으로 채워 Markdown 문자열을 만든다.
 *
 * 6대 섹션 구조 출처: GitHub Blog 2,500+ AGENTS.md 분석 (RES-0003 §2.2).
 */

import type {
  AiConfigInput,
  BestPracticeCategory,
  BestPracticeItem,
  BoundaryItem,
  BoundaryTier,
} from '@/types/aiConfig'

import { resolveBestPractices, resolveBoundaries } from './filterCatalog'

/** 6대 섹션 노출 순서. GitHub Blog 권장 순서를 따른다 */
const SECTION_ORDER: readonly BestPracticeCategory[] = [
  'commands',
  'testing',
  'project-structure',
  'code-style',
  'git-workflow',
  'boundaries',
] as const

/** 카테고리 → Markdown 섹션 헤더 (영어 — AI 출력 본문은 영어) */
const SECTION_HEADERS: Readonly<Record<BestPracticeCategory, string>> = {
  commands: 'Commands',
  testing: 'Testing',
  'project-structure': 'Project Structure',
  'code-style': 'Code Style',
  'git-workflow': 'Git Workflow',
  boundaries: 'Boundaries',
}

/** Boundaries 3-tier 헤더 (이모지 + 영어 라벨, GitHub Blog 6대 섹션 권장 형식) */
const BOUNDARY_TIER_HEADERS: Readonly<Record<BoundaryTier, string>> = {
  'always-do': '✅ Always do',
  'ask-first': '⚠️ Ask first',
  'never-do': '🚫 Never do',
}

/** 카테고리별로 베스트 프랙티스를 그룹핑한다 */
const groupByCategory = (
  items: readonly BestPracticeItem[],
): Map<BestPracticeCategory, readonly BestPracticeItem[]> => {
  const map = new Map<BestPracticeCategory, BestPracticeItem[]>()
  for (const item of items) {
    const bucket = map.get(item.category) ?? []
    bucket.push(item)
    map.set(item.category, bucket)
  }
  return map
}

/** Tier별로 Boundaries 항목을 그룹핑한다 */
const groupByTier = (
  items: readonly BoundaryItem[],
): Map<BoundaryTier, readonly BoundaryItem[]> => {
  const map = new Map<BoundaryTier, BoundaryItem[]>()
  for (const item of items) {
    const bucket = map.get(item.tier) ?? []
    bucket.push(item)
    map.set(item.tier, bucket)
  }
  return map
}

/**
 * 베스트 프랙티스 항목들을 6대 섹션 Markdown으로 변환한다.
 * 비어있는 카테고리는 출력에서 제외한다.
 */
const buildBestPracticeSections = (items: readonly BestPracticeItem[]): readonly string[] => {
  const grouped = groupByCategory(items)
  const sections: string[] = []

  for (const category of SECTION_ORDER) {
    if (category === 'boundaries') continue // Boundaries는 별도 섹션 빌더에서 처리

    const bucket = grouped.get(category)
    if (!bucket || bucket.length === 0) continue

    sections.push(`## ${SECTION_HEADERS[category]}`)
    sections.push('')
    for (const item of bucket) {
      sections.push(`- ${item.outputText}`)
    }
    sections.push('')
  }

  return sections
}

/**
 * Boundaries 섹션 Markdown을 만든다.
 * 카탈로그 베스트 프랙티스 중 boundaries 카테고리 항목과 명시적 Boundaries 입력을 병합한다.
 */
const buildBoundariesSection = (
  bestPracticeBoundaries: readonly BestPracticeItem[],
  boundaries: readonly BoundaryItem[],
): readonly string[] => {
  if (bestPracticeBoundaries.length === 0 && boundaries.length === 0) return []

  const lines: string[] = ['## Boundaries', '']

  // 베스트 프랙티스 카테고리 'boundaries' 항목은 일반 목록으로 노출
  if (bestPracticeBoundaries.length > 0) {
    for (const item of bestPracticeBoundaries) {
      lines.push(`- ${item.outputText}`)
    }
    lines.push('')
  }

  // 3-tier 그룹은 별도 서브섹션으로 노출
  const tierMap = groupByTier(boundaries)
  for (const tier of ['always-do', 'ask-first', 'never-do'] as const) {
    const bucket = tierMap.get(tier)
    if (!bucket || bucket.length === 0) continue

    lines.push(`### ${BOUNDARY_TIER_HEADERS[tier]}`)
    lines.push('')
    for (const item of bucket) {
      lines.push(`- ${item.outputText}`)
    }
    lines.push('')
  }

  return lines
}

/** Additional Notes 섹션 (CP-1 자유 텍스트 입력) */
const buildAdditionalNotes = (notes: string): readonly string[] => {
  const trimmed = notes.trim()
  if (trimmed.length === 0) return []
  return ['## Additional Notes', '', trimmed, '']
}

/**
 * 사용자 입력으로부터 AGENTS.md/CLAUDE.md 공용 본문을 생성한다.
 * 결과는 끝에 개행 없이 반환한다 (호출 측에서 파일별 포맷팅).
 */
export const buildSharedBody = (input: AiConfigInput): string => {
  const bestPractices = resolveBestPractices(input.bestPractices.selectedIds)
  const boundaryIds = [
    ...input.boundaries.alwaysDoIds,
    ...input.boundaries.askFirstIds,
    ...input.boundaries.neverDoIds,
  ]
  const boundaries = resolveBoundaries(boundaryIds)

  // 베스트 프랙티스의 'boundaries' 카테고리는 Boundaries 섹션에 합친다
  const boundaryCategoryItems = bestPractices.filter((item) => item.category === 'boundaries')
  const nonBoundaryItems = bestPractices.filter((item) => item.category !== 'boundaries')

  const lines: string[] = []
  lines.push(...buildBestPracticeSections(nonBoundaryItems))
  lines.push(...buildBoundariesSection(boundaryCategoryItems, boundaries))
  lines.push(...buildAdditionalNotes(input.bestPractices.additionalNotes))

  return lines.join('\n').trimEnd()
}
