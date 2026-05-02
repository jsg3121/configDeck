/**
 * debug Skill — 에러/버그 분석 및 재현 단계 작성.
 * SPEC-0005 P0 8종 중 5번.
 */

import type { SkillCatalogItem } from '@/types/aiConfig'

export const DEBUG_SKILL: SkillCatalogItem = {
  id: 'debug',
  displayName: '버그 디버깅 + 재현 단계',
  summary: '에러 메시지나 비정상 동작의 원인을 분석하고 재현 단계와 수정 방안을 제시한다.',
  description:
    'Diagnose a bug, error, or unexpected behavior. Use when the user reports something not working, an error message, or asks why behavior is wrong.',
  bodyTemplate: () => `# Debug Skill

Diagnose the bug systematically. Don't jump to fixes — understand the root cause first.

## Steps

1. **Read the error carefully** — Stack trace, error message, surrounding logs. Don't skim.
2. **Reproduce the bug** — Write down the exact steps. If you can't reproduce it, your fix is a guess.
3. **Form a hypothesis** — Based on the error and the code path, what is likely happening?
4. **Verify the hypothesis** — Add logs, use a debugger, write a failing test, or read the relevant code.
5. **Identify the root cause** — Not just where the error throws, but *why* the bad state was reached.
6. **Propose a fix** — Explain what changes and why. Note any side effects.
7. **Add a regression test** — Ensure the bug can't return silently.

## Output Format

Report your diagnosis in this structure:

\`\`\`markdown
### Symptom
<what the user observes>

### Reproduction Steps
1. <exact step>
2. <exact step>

### Root Cause
<the actual reason, with file:line references>

### Proposed Fix
<what to change, why it works, any tradeoffs>

### Regression Test
<the test that would have caught this>
\`\`\`

## Rules

- **Don't jump to a fix.** First explain the symptom, then the cause, then the fix.
- **Cite file paths and line numbers** for the root cause and the fix location.
- **Distinguish symptom from cause** — A null reference error often points to a deeper bug elsewhere.
- **Don't over-fix** — Fix the bug, not unrelated code you happen to notice.
- **Add a regression test** unless the user explicitly says not to.
- **Never suppress the error** with broad try/catch or \`@ts-ignore\` to make it go away.
`,
}
