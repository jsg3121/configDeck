/**
 * commit Skill — Conventional Commits 형식의 커밋 메시지 자동 작성.
 * SPEC-0005 P0 8종 중 1번. ADR-0018 §1.2.
 */

import type { SkillCatalogItem } from '@/types/aiConfig'

export const COMMIT_SKILL: SkillCatalogItem = {
  id: 'commit',
  displayName: '커밋 메시지 자동 작성',
  summary: 'Conventional Commits 형식에 맞춰 커밋 메시지를 작성하고 git commit을 실행한다.',
  description:
    'Stage and commit the current changes with a Conventional Commits message. Use when the user asks to commit, save, or record changes.',
  bodyTemplate: () => `# Commit Skill

Stage the current changes and create a commit using the Conventional Commits specification.

## Steps

1. **Inspect the working tree** — Run \`git status\` and \`git diff\` to understand what changed.
2. **Group related changes** — If the diff covers multiple unrelated concerns, propose splitting into separate commits.
3. **Draft a commit message** following the format:
   \`\`\`
   <type>(<scope>): <short description>

   <body explaining "why", not "what">
   \`\`\`
4. **Stage the relevant files** — Use \`git add <specific-files>\`. Avoid \`git add -A\` to prevent committing unrelated artifacts.
5. **Create the commit** with the drafted message.
6. **Verify** — Run \`git status\` and \`git log -1\` to confirm.

## Conventional Commit Types

| Type | Use for |
|------|---------|
| \`feat\` | A new feature for the user |
| \`fix\` | A bug fix |
| \`refactor\` | Code change that neither fixes a bug nor adds a feature |
| \`docs\` | Documentation only changes |
| \`test\` | Adding or correcting tests |
| \`chore\` | Build, tooling, or dependency changes |
| \`perf\` | Performance improvement |
| \`style\` | Code formatting, no logic change |

## Rules

- Subject line: imperative mood, lowercase, no trailing period, under 72 characters.
- Body: explain *why* the change is needed. The diff already shows *what* changed.
- Never commit secrets, API keys, or large binaries.
- Never use \`--no-verify\` to skip pre-commit hooks unless explicitly authorized.
- If a hook fails, fix the underlying issue and create a new commit.

## Examples

\`\`\`
feat(auth): add session timeout warning modal

Users complained that they were silently logged out mid-task.
The modal warns 60 seconds before expiry with an extend option.
\`\`\`

\`\`\`
fix(parser): handle empty array in deserialize path

The deserializer threw on empty arrays because of an off-by-one
in the length check. Added a guard and a unit test.
\`\`\`
`,
}
