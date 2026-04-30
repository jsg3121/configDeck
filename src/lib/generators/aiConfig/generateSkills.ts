/**
 * Agent Skills SKILL.md 생성기.
 *
 * 사용자가 selectedSkillIds로 선택한 스킬마다 SKILL.md 파일을 생성한다.
 * 출력 경로: `.claude/skills/{skill-id}/SKILL.md` (ADR-0018 §1.3).
 *
 * Phase A frontmatter는 agentskills.io 표준 최소 요건(`name`, `description`)만 사용 (CP-4).
 */

import { SKILLS_BY_ID } from '@/lib/data/aiConfig'
import type {
  AiConfigInput,
  SkillCatalogItem,
  SkillId,
  SkillMdFile,
  SkillMdFrontmatter,
} from '@/types/aiConfig'

/** YAML frontmatter 직렬화 */
const serializeFrontmatter = (frontmatter: SkillMdFrontmatter): string => {
  const lines: string[] = ['---']
  lines.push(`name: ${frontmatter.name}`)
  // description은 표준상 한 줄 권장. 따옴표로 감싸서 안전하게 직렬화한다.
  lines.push(`description: "${frontmatter.description.replace(/"/g, '\\"')}"`)
  lines.push('---', '')
  return lines.join('\n')
}

/** 단일 스킬에 대한 SKILL.md 파일 모델 생성 */
const buildSkillFile = (catalog: SkillCatalogItem, input: AiConfigInput): SkillMdFile => {
  const frontmatter: SkillMdFrontmatter = {
    name: catalog.id,
    description: catalog.description,
  }

  return {
    id: catalog.id,
    fileName: 'SKILL.md',
    outputPath: `.claude/skills/${catalog.id}/SKILL.md`,
    frontmatter,
    body: catalog.bodyTemplate(input),
  }
}

/**
 * 선택된 스킬 ID 목록으로부터 SKILL.md 파일 모델 배열을 생성한다.
 * 카탈로그에 없는 ID는 무시한다.
 * 출력은 selectedSkillIds 입력 순서를 보존한다.
 */
export const generateSkills = (input: AiConfigInput): readonly SkillMdFile[] => {
  const files: SkillMdFile[] = []
  const seen = new Set<SkillId>()

  for (const id of input.selectedSkillIds) {
    if (seen.has(id)) continue
    seen.add(id)

    const catalog = SKILLS_BY_ID[id]
    if (!catalog) continue

    files.push(buildSkillFile(catalog, input))
  }

  return files
}

/** SKILL.md 파일 1개를 단일 문자열로 직렬화 (frontmatter + body) */
export const serializeSkillFile = (file: SkillMdFile): string =>
  `${serializeFrontmatter(file.frontmatter)}${file.body}`
