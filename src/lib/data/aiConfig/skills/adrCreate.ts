/**
 * adr-create Skill — Architecture Decision Record 작성.
 * SPEC-0005 P0 8종 중 7번.
 */

import type { SkillCatalogItem } from '@/types/aiConfig'

export const ADR_CREATE_SKILL: SkillCatalogItem = {
  id: 'adr-create',
  displayName: 'ADR 작성',
  summary: '기술적 의사결정을 ADR(Architecture Decision Record) 형식으로 문서화한다.',
  description:
    'Document a technical decision as an Architecture Decision Record (ADR). Use when a non-trivial choice is made (framework, library, pattern, deprecation) that future contributors need context for.',
  bodyTemplate: () => `# ADR Create Skill

Document a technical decision so future contributors understand the context, the choice, and the tradeoffs.

## When to Write an ADR

Write an ADR when:
- A non-trivial technical choice is made (framework, library, pattern, infra).
- A choice has multiple defensible alternatives.
- The "why" would be hard to reconstruct in 6 months.
- A previous ADR is being superseded or revised.

Don't write one for:
- Routine bug fixes.
- Trivial choices with no real alternatives.
- Style preferences without architectural impact.

## Steps

1. **Find the next ADR number** — Check the existing \`docs/decisions/\` (or equivalent) directory.
2. **Use the project's ADR template** if one exists. Otherwise use the structure below.
3. **Be specific about alternatives considered** — Listing them shows the decision was deliberate.
4. **Include References** — Link official docs, RFCs, benchmarks. Decisions without sources are weak.
5. **Set status correctly** — \`Proposed\` → \`Accepted\` → (later) \`Superseded by ADR-NNNN\`.

## ADR Template

\`\`\`markdown
# ADR-NNNN: <Decision Title>

- Status: Proposed | Accepted | Deprecated | Superseded by ADR-XXXX
- Date: YYYY-MM-DD

## Context
<What forces drove this decision? What constraints apply?>

## Decision
<What is the decision, stated plainly?>

## Rationale
<Why this choice? What evidence supports it?>

## Alternatives Considered

| Alternative | Why not |
|-------------|---------|
| <option> | <reason> |

## Consequences

- <Positive consequence>
- <Negative consequence or risk>
- <Follow-up actions required>

## References

- [<Title>](<URL>) — <brief note>
\`\`\`

## Rules

- ADRs are immutable once accepted. To change a decision, write a new ADR that supersedes it.
- Cite official sources or measured data, not hearsay or LinkedIn opinions.
- One decision per ADR. If you find yourself writing two decisions, split them.
- Keep it short — 1 to 2 pages. ADRs are read, not skimmed.
`,
}
