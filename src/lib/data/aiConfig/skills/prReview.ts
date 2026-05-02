/**
 * pr-review Skill — PR 코드 리뷰 체크리스트.
 * SPEC-0005 P0 8종 중 3번.
 */

import type { SkillCatalogItem } from '@/types/aiConfig'

export const PR_REVIEW_SKILL: SkillCatalogItem = {
  id: 'pr-review',
  displayName: 'PR 리뷰 체크리스트',
  summary: 'PR 변경사항을 보안/품질/테스트/스타일 관점에서 체계적으로 리뷰한다.',
  description:
    'Review a pull request systematically across security, quality, testing, and style dimensions. Use when the user asks to review a PR or check changes before merging.',
  bodyTemplate: () => `# PR Review Skill

Review the pull request systematically. Report findings as a categorized checklist.

## Steps

1. **Fetch the PR** — \`gh pr view <number>\`, \`gh pr diff <number>\`.
2. **Read each changed file** — Don't review just the diff; understand surrounding context.
3. **Check each category below**.
4. **Report findings** — Group by severity: 🚫 Blocker / ⚠️ Should fix / 💡 Suggestion.

## Review Categories

### Security
- [ ] No secrets, API keys, or tokens committed.
- [ ] User input validated at boundaries (HTTP, env vars, file I/O).
- [ ] No SQL injection, XSS, or command injection risks.
- [ ] Authentication/authorization checks present where needed.

### Correctness
- [ ] Edge cases covered (empty inputs, large inputs, boundary values).
- [ ] Error handling appropriate (no silent failures, no over-broad catches).
- [ ] No race conditions in async code.
- [ ] No off-by-one errors in loops or array access.

### Testing
- [ ] New code has tests.
- [ ] Tests actually verify behavior (not just coverage).
- [ ] Edge cases tested.
- [ ] No tests skipped or marked \`.only\`.

### Code Quality
- [ ] Follows existing project conventions.
- [ ] No \`any\` types, no broad \`as\` assertions.
- [ ] No magic numbers without named constants.
- [ ] Functions reasonably sized (under 50 lines).
- [ ] Names are descriptive and intention-revealing.

### Style & Lint
- [ ] Lint passes.
- [ ] Type check passes.
- [ ] No commented-out code.
- [ ] No unrelated changes (formatting churn, unrelated refactors).

### Documentation
- [ ] Public API changes documented.
- [ ] Breaking changes noted in PR body.
- [ ] README/docs updated if behavior changed.

## Rules

- Be specific. Cite file paths and line numbers (\`src/foo.ts:42\`).
- Distinguish blockers (must fix before merge) from suggestions (nice to have).
- Focus on the change, not the entire codebase.
- Don't approve and request changes simultaneously — pick one.
`,
}
