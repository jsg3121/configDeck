/**
 * pr-create Skill — Pull Request 본문 작성 + 생성.
 * SPEC-0005 P0 8종 중 2번.
 */

import type { SkillCatalogItem } from '@/types/aiConfig'

export const PR_CREATE_SKILL: SkillCatalogItem = {
  id: 'pr-create',
  displayName: 'PR 생성 + 본문 작성',
  summary: '현재 브랜치를 푸시하고 변경사항을 요약한 PR 본문을 작성해 PR을 생성한다.',
  description:
    'Create a pull request with a structured body summarizing the changes. Use when the user asks to open a PR, submit changes, or push for review.',
  bodyTemplate: () => `# PR Create Skill

Create a pull request for the current branch with a clear, structured body.

## Steps

1. **Confirm branch state** — Run \`git status\`, \`git log <base>..HEAD\`, \`git diff <base>...HEAD\` to understand all commits since divergence from the base branch.
2. **Push the branch** if it doesn't exist on the remote yet.
3. **Draft the PR title** — Short (under 70 characters), imperative mood, no trailing period.
4. **Draft the PR body** using the template below.
5. **Create the PR** via \`gh pr create\` with \`--title\` and \`--body\`.
6. **Return the PR URL** to the user.

## PR Body Template

\`\`\`markdown
## Summary
<1-3 bullet points describing what changed and why>

## Changes
- <bullet list of significant changes>

## Test Plan
- [ ] <how to verify each change manually>
- [ ] <related automated tests>

## Notes
<optional: deployment notes, follow-ups, breaking changes>
\`\`\`

## Rules

- Analyze **all commits** in the branch, not just the latest one.
- The summary must explain *why* the change is needed, not restate the diff.
- Test Plan should be a checklist a reviewer can actually run.
- Never push to \`main\` directly. PRs only.
- Never force push to a shared branch without explicit approval.

## CLI Reference

\`\`\`bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
## Summary
- <bullet>

## Test plan
- [ ] <step>
EOF
)"
\`\`\`
`,
}
