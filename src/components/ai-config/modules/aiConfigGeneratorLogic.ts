/**
 * AI 설정 + Skills 생성기의 클라이언트 사이드 로직.
 *
 * - 사용자 입력 → 출력 모델 → 평면 파일 맵으로 변환
 * - 트리 구조 빌드 (UI 표시용)
 * - JSZip 패키징 + 다운로드
 *
 * 생성기 자체는 src/lib/generators/aiConfig/에 있고, 본 모듈은 UI ↔ 생성기 사이의 어댑터다.
 */

// ---------------------------------------------------------------------------
// 5. Boundaries 카탈로그 ID → AiConfigBoundariesInput 변환 헬퍼
// ---------------------------------------------------------------------------

import { BOUNDARIES_CATALOG } from '@/lib/data/aiConfig'
import { generateAiConfig } from '@/lib/generators/aiConfig/generateAll'
import { serializeCursorMdcFile } from '@/lib/generators/aiConfig/generateCursorMdc'
import { serializeSkillFile } from '@/lib/generators/aiConfig/generateSkills'
import type { AiConfigBoundariesInput, AiConfigInput, AiConfigOutput } from '@/types/aiConfig'

// ---------------------------------------------------------------------------
// 1. 평면 파일 맵 — ZIP 패키징과 미리보기 탭에 공통 사용
// ---------------------------------------------------------------------------

/** 단일 파일 항목. path는 ZIP 내부 경로 그대로 (예: '.cursor/rules/core.mdc') */
export interface FlatFile {
  /** 출력 경로 = ZIP 내부 경로 */
  path: string
  /** 사용자에게 표시할 짧은 라벨 (탭/트리에 사용) */
  label: string
  /** 직렬화된 파일 본문 */
  content: string
}

/** 출력 모델을 평면 파일 배열로 변환한다 */
export const flattenOutput = (output: AiConfigOutput): readonly FlatFile[] => {
  const files: FlatFile[] = []

  files.push({
    path: output.agentsMd.outputPath,
    label: 'AGENTS.md',
    content: output.agentsMd.body,
  })

  if (output.claudeMd) {
    files.push({
      path: output.claudeMd.outputPath,
      label: 'CLAUDE.md',
      content: output.claudeMd.body,
    })
  }

  if (output.cursorMdc) {
    for (const file of [
      output.cursorMdc.core,
      output.cursorMdc.stack,
      output.cursorMdc.boundaries,
    ]) {
      files.push({
        path: file.outputPath,
        label: file.fileName,
        content: serializeCursorMdcFile(file),
      })
    }
  }

  if (output.copilotInstructions) {
    files.push({
      path: output.copilotInstructions.outputPath,
      label: 'copilot-instructions.md',
      content: output.copilotInstructions.body,
    })
  }

  for (const skill of output.skills) {
    files.push({
      path: skill.outputPath,
      label: `${skill.id}/SKILL.md`,
      content: serializeSkillFile(skill),
    })
  }

  return files
}

// ---------------------------------------------------------------------------
// 2. 파일 트리 — UI 표시용 (폴더 계층 구조)
// ---------------------------------------------------------------------------

/** 트리 노드 — 폴더 또는 파일 */
export type FileTreeNode =
  | { type: 'folder'; name: string; children: FileTreeNode[] }
  | { type: 'file'; name: string; path: string; label: string }

/** 평면 파일 배열을 트리 구조로 변환한다 */
export const buildFileTree = (files: readonly FlatFile[]): readonly FileTreeNode[] => {
  const root: FileTreeNode[] = []

  for (const file of files) {
    const segments = file.path.split('/')
    const fileName = segments[segments.length - 1]
    const folders = segments.slice(0, -1)

    let cursor: FileTreeNode[] = root
    for (const folderName of folders) {
      let folder = cursor.find(
        (node): node is Extract<FileTreeNode, { type: 'folder' }> =>
          node.type === 'folder' && node.name === folderName,
      )
      if (!folder) {
        folder = { type: 'folder', name: folderName, children: [] }
        cursor.push(folder)
      }
      cursor = folder.children
    }

    cursor.push({ type: 'file', name: fileName, path: file.path, label: file.label })
  }

  return root
}

// ---------------------------------------------------------------------------
// 3. Boundaries 직접 입력 처리 — additionalNotes에 prefix로 합성
// ---------------------------------------------------------------------------

/** 사용자가 직접 입력한 Boundaries 항목 */
export interface CustomBoundaryItem {
  tier: 'always-do' | 'ask-first' | 'never-do'
  text: string
}

const TIER_PREFIX: Readonly<Record<CustomBoundaryItem['tier'], string>> = {
  'always-do': '[Custom Always Do]',
  'ask-first': '[Custom Ask First]',
  'never-do': '[Custom Never Do]',
}

/**
 * 카탈로그 Additional Notes와 사용자 직접 입력 Boundaries를 합성한다.
 * M3 generator를 변경하지 않기 위한 어댑터 — additionalNotes 한 필드에 모두 담는다.
 */
export const buildAdditionalNotesWithCustomBoundaries = (
  notes: string,
  customBoundaries: readonly CustomBoundaryItem[],
): string => {
  const parts: string[] = []

  if (notes.trim().length > 0) {
    parts.push(notes.trim())
  }

  if (customBoundaries.length > 0) {
    const lines = customBoundaries.map((item) => `${TIER_PREFIX[item.tier]} ${item.text.trim()}`)
    parts.push(lines.join('\n'))
  }

  return parts.join('\n\n')
}

// ---------------------------------------------------------------------------
// 4. ZIP 패키징 + 다운로드
// ---------------------------------------------------------------------------

/** 사용자 입력으로부터 ZIP 파일을 생성하여 브라우저에서 다운로드한다 */
export const downloadAiConfigAsZip = async (input: AiConfigInput): Promise<void> => {
  const output = generateAiConfig(input)
  const files = flattenOutput(output)

  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  for (const file of files) {
    zip.file(file.path, file.content)
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `configdeck-ai-config.zip`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

/** 단일 Set에서 tier별로 분리된 입력 객체로 변환 */
export const splitBoundariesByTier = (
  selectedIds: ReadonlySet<string>,
): AiConfigBoundariesInput => {
  const alwaysDoIds: string[] = []
  const askFirstIds: string[] = []
  const neverDoIds: string[] = []

  for (const item of BOUNDARIES_CATALOG) {
    if (!selectedIds.has(item.id)) continue
    switch (item.tier) {
      case 'always-do':
        alwaysDoIds.push(item.id)
        break
      case 'ask-first':
        askFirstIds.push(item.id)
        break
      case 'never-do':
        neverDoIds.push(item.id)
        break
    }
  }

  return { alwaysDoIds, askFirstIds, neverDoIds }
}
