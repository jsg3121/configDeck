/**
 * readme-update Skill — README 자동 갱신.
 * SPEC-0005 P0 8종 중 8번.
 */

import type { SkillCatalogItem } from '@/types/aiConfig'

export const README_UPDATE_SKILL: SkillCatalogItem = {
  id: 'readme-update',
  displayName: 'README 갱신',
  summary: '코드 변경에 맞춰 README의 설치/사용/개발 섹션을 정확하게 갱신한다.',
  description:
    'Update the README to reflect current behavior: install steps, usage, configuration, scripts, and project structure. Use when public API, scripts, or setup changes.',
  bodyTemplate: () => `# README Update Skill

Update the README so it accurately reflects the current state of the project.

## When to Update

Update README when any of the following change:
- Installation steps (\`npm install\`, \`pnpm install\`, system requirements).
- Public API (exported functions, CLI flags, configuration options).
- Available scripts (\`package.json\` \`scripts\`).
- Environment variables required.
- Project structure (top-level directories).
- Quickstart or basic usage examples no longer work.

## Steps

1. **Read the current README** — Understand its structure and tone.
2. **Audit each section** against the current code:
   - Run the install steps as documented. Do they work?
   - Run the example code. Does it work?
   - Compare scripts in README vs \`package.json\`.
   - Compare directory listing vs actual repo structure.
3. **Update only what's stale** — Don't rewrite the whole README.
4. **Keep examples runnable** — Every code block should be copy-paste runnable as-is.
5. **Verify after updating** — Re-run the install/usage steps from the updated README.

## Standard Sections

A typical README has, in order:

1. **Title + one-line description** — What is this and why does it exist?
2. **Badges** (optional) — Build status, version, license.
3. **Installation** — Exact commands.
4. **Quickstart** — Minimal working example.
5. **Usage** — Common patterns.
6. **Configuration** — Options, env vars.
7. **Scripts** — Available commands.
8. **Project Structure** (for larger projects) — Directory layout.
9. **Contributing** — How to contribute, link to CONTRIBUTING.md.
10. **License**.

## Rules

- **Don't add aspirational features** — Document what *works now*, not what's planned.
- **Don't duplicate \`package.json\`** — Reference it for the source of truth.
- **Examples must be runnable** — No pseudo-code, no \`...\` placeholders without context.
- **Keep tone consistent** — Match the existing README's voice.
- **Update version-specific info** — Replace "Node 16+" with current minimum.
- **No marketing fluff** — Developers want to use the tool, not be sold.
`,
}
