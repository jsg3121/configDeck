/**
 * AI Config 카탈로그 페이지의 도구 카드 메타데이터.
 *
 * 5개 도구가 카탈로그 카드로 노출되며, 각 카드는 도구별 SEO 랜딩으로 연결된다.
 * 카드 노출 순서는 ADR-0019 기준: AGENTS.md(공통 표준) → Cursor → Copilot → CLAUDE.md → Agent Skills.
 */

export type CatalogToolKey = 'agentsMd' | 'cursor' | 'copilot' | 'claudeCode' | 'agentSkills'

export interface CatalogToolMeta {
  /** i18n 키 — `aiConfig.catalog.tools.{key}` */
  key: CatalogToolKey
  /** URL slug (`/ai-config/{slug}`) */
  slug: 'agents-md' | 'cursor' | 'copilot' | 'claude-code' | 'agent-skills'
  /** Tailwind 색상 클래스 prefix — global.css에 정의된 도구별 색상 토큰과 매칭 */
  colorClass: 'tool-agents' | 'tool-cursor' | 'tool-copilot' | 'tool-claude' | 'tool-skills'
}

/** 카탈로그 카드 노출 순서 */
export const CATALOG_TOOLS: readonly CatalogToolMeta[] = [
  { key: 'agentsMd', slug: 'agents-md', colorClass: 'tool-agents' },
  { key: 'cursor', slug: 'cursor', colorClass: 'tool-cursor' },
  { key: 'copilot', slug: 'copilot', colorClass: 'tool-copilot' },
  { key: 'claudeCode', slug: 'claude-code', colorClass: 'tool-claude' },
  { key: 'agentSkills', slug: 'agent-skills', colorClass: 'tool-skills' },
]
