/**
 * refactor Skill — 안전한 리팩토링 절차.
 * SPEC-0005 P0 8종 중 6번.
 */

import type { SkillCatalogItem } from '@/types/aiConfig'

export const REFACTOR_SKILL: SkillCatalogItem = {
  id: 'refactor',
  displayName: '안전한 리팩토링',
  summary: '동작 변경 없이 코드 구조를 개선한다. 테스트로 안전망을 먼저 확보한다.',
  description:
    'Refactor code structure without changing behavior. Use when the user asks to clean up, simplify, extract, or reorganize code.',
  bodyTemplate: () => `# Refactor Skill

Improve code structure without changing observable behavior. Tests are your safety net.

## Steps

1. **Confirm the goal** — What problem does this refactor solve? (Readability, duplication, coupling, performance.) If you can't name it, don't refactor.
2. **Verify test coverage** — Before changing anything, ensure tests cover the behavior you're preserving. If coverage is missing, add tests first.
3. **Make small, reversible changes** — One refactor at a time. Run tests after each step.
4. **Don't mix refactors with feature work** — Refactor commits are separate from feature commits.
5. **Verify behavior unchanged** — Tests pass, type check passes, manual check if needed.

## Common Safe Refactors

- **Extract function** — Pull a block of code into a named function.
- **Extract variable** — Name an intermediate value.
- **Inline** — Replace a single-use abstraction with its body.
- **Rename** — Use the IDE/LSP rename. Don't search-and-replace.
- **Move** — Move a function to a more appropriate file.
- **Replace conditional with polymorphism** — Or vice versa, when the existing shape is fighting the use case.

## Anti-Patterns to Avoid

- **Refactoring without tests** — You'll drift behavior silently.
- **Big-bang refactor** — Many changes at once make bisecting impossible if something breaks.
- **Refactoring + behavior change in one commit** — Reviewers can't tell what's intentional.
- **Speculative abstraction** — Don't add layers for hypothetical future needs (Rule of Three: extract on the third occurrence, not the first).
- **Over-engineering** — A flat function may be clearer than a deeply abstracted one.

## Rules

- Tests must pass before *and* after every refactor step.
- One concept per commit. Don't bundle "extracted three functions and renamed two files".
- Don't introduce new dependencies during a refactor.
- Don't change public APIs as a side effect — that's a feature/breaking change, not a refactor.
- If you can't make the refactor in under ~30 minutes, you're probably doing too much.
`,
}
