/**
 * Cursor MDC 3파일 생성기.
 *
 * CP-2 결정에 따라 다음 3파일로 자동 분리한다:
 * - core.mdc       : alwaysApply: true. Commands / Code Style / Git Workflow.
 * - stack.mdc      : globs 기반 자동 적용. Project Structure / Testing.
 * - boundaries.mdc : description만. Boundaries 섹션 + Additional Notes.
 *
 * MDC 형식: YAML frontmatter + Markdown 본문 (RES-0003 §1.1).
 */

import type {
  AiConfigInput,
  BestPracticeCategory,
  BestPracticeItem,
  BoundaryTier,
  CursorMdcFile,
  CursorMdcFrontmatter,
  CursorMdcOutput,
} from '@/types/aiConfig'

import { resolveBestPractices, resolveBoundaries } from './shared/filterCatalog'
import { STACK_GLOBS } from './shared/stackGlobs'

/** core.mdc에 포함될 카테고리 */
const CORE_CATEGORIES: readonly BestPracticeCategory[] = ['commands', 'code-style', 'git-workflow']

/** stack.mdc에 포함될 카테고리 */
const STACK_CATEGORIES: readonly BestPracticeCategory[] = ['project-structure', 'testing']

/** 카테고리 → Markdown 헤더 (영어) */
const SECTION_HEADERS: Readonly<Record<BestPracticeCategory, string>> = {
  commands: 'Commands',
  testing: 'Testing',
  'project-structure': 'Project Structure',
  'code-style': 'Code Style',
  'git-workflow': 'Git Workflow',
  boundaries: 'Boundaries',
}

/** Boundaries 3-tier 헤더 */
const BOUNDARY_TIER_HEADERS: Readonly<Record<BoundaryTier, string>> = {
  'always-do': '✅ Always do',
  'ask-first': '⚠️ Ask first',
  'never-do': '🚫 Never do',
}

/** YAML frontmatter 직렬화 */
const serializeFrontmatter = (frontmatter: CursorMdcFrontmatter): string => {
  const lines: string[] = ['---']
  if (frontmatter.description !== undefined) {
    lines.push(`description: "${frontmatter.description.replace(/"/g, '\\"')}"`)
  }
  if (frontmatter.globs !== undefined) {
    lines.push(`globs: ${frontmatter.globs}`)
  }
  if (frontmatter.alwaysApply !== undefined) {
    lines.push(`alwaysApply: ${frontmatter.alwaysApply}`)
  }
  lines.push('---', '')
  return lines.join('\n')
}

/** 카테고리 묶음을 Markdown 섹션으로 변환 */
const renderCategorySections = (
  items: readonly BestPracticeItem[],
  categories: readonly BestPracticeCategory[],
): string => {
  const sections: string[] = []
  for (const category of categories) {
    const bucket = items.filter((item) => item.category === category)
    if (bucket.length === 0) continue

    sections.push(`## ${SECTION_HEADERS[category]}`)
    sections.push('')
    for (const item of bucket) {
      sections.push(`- ${item.outputText}`)
    }
    sections.push('')
  }
  return sections.join('\n')
}

/** core.mdc — 항상 적용되는 핵심 룰 */
const buildCoreFile = (input: AiConfigInput): CursorMdcFile => {
  const items = resolveBestPractices(input.bestPractices.selectedIds)
  const body = renderCategorySections(items, CORE_CATEGORIES).trimEnd()

  return {
    fileName: 'core.mdc',
    outputPath: '.cursor/rules/core.mdc',
    frontmatter: {
      description: 'Core project conventions (always applied)',
      alwaysApply: true,
    },
    body: body.length > 0 ? `${body}\n` : '',
  }
}

/** stack.mdc — 스택별 파일 패턴 매칭 시 자동 적용 */
const buildStackFile = (input: AiConfigInput): CursorMdcFile => {
  const items = resolveBestPractices(input.bestPractices.selectedIds)
  const body = renderCategorySections(items, STACK_CATEGORIES).trimEnd()

  return {
    fileName: 'stack.mdc',
    outputPath: '.cursor/rules/stack.mdc',
    frontmatter: {
      description: 'Stack-specific rules (auto-applied to matching files)',
      globs: STACK_GLOBS[input.stack.stack],
    },
    body: body.length > 0 ? `${body}\n` : '',
  }
}

/** boundaries.mdc — Agent 판단 기반 적용 */
const buildBoundariesFile = (input: AiConfigInput): CursorMdcFile => {
  const items = resolveBestPractices(input.bestPractices.selectedIds)
  const boundaryCategoryItems = items.filter((item) => item.category === 'boundaries')

  const boundaryIds = [
    ...input.boundaries.alwaysDoIds,
    ...input.boundaries.askFirstIds,
    ...input.boundaries.neverDoIds,
  ]
  const boundaries = resolveBoundaries(boundaryIds)

  const lines: string[] = []

  if (boundaryCategoryItems.length > 0) {
    lines.push('## Boundaries', '')
    for (const item of boundaryCategoryItems) {
      lines.push(`- ${item.outputText}`)
    }
    lines.push('')
  }

  // 3-tier
  for (const tier of ['always-do', 'ask-first', 'never-do'] as const) {
    const bucket = boundaries.filter((item) => item.tier === tier)
    if (bucket.length === 0) continue

    if (lines.length === 0) {
      lines.push('## Boundaries', '')
    }
    lines.push(`### ${BOUNDARY_TIER_HEADERS[tier]}`)
    lines.push('')
    for (const item of bucket) {
      lines.push(`- ${item.outputText}`)
    }
    lines.push('')
  }

  // Additional Notes
  const notes = input.bestPractices.additionalNotes.trim()
  if (notes.length > 0) {
    lines.push('## Additional Notes', '', notes, '')
  }

  const body = lines.join('\n').trimEnd()

  return {
    fileName: 'boundaries.mdc',
    outputPath: '.cursor/rules/boundaries.mdc',
    frontmatter: {
      description: 'Boundaries and judgment-call rules (agent decides when relevant)',
    },
    body: body.length > 0 ? `${body}\n` : '',
  }
}

/**
 * 사용자 입력으로부터 Cursor MDC 3파일을 생성한다.
 * 호출 측은 frontmatter + body를 합쳐 파일로 저장한다.
 */
export const generateCursorMdc = (input: AiConfigInput): CursorMdcOutput => ({
  core: buildCoreFile(input),
  stack: buildStackFile(input),
  boundaries: buildBoundariesFile(input),
})

/** MDC 파일 1개를 단일 문자열로 직렬화 (frontmatter + body) */
export const serializeCursorMdcFile = (file: CursorMdcFile): string =>
  `${serializeFrontmatter(file.frontmatter)}${file.body}`
