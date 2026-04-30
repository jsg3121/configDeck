/**
 * test-writer Skill — 단위 테스트 작성.
 * SPEC-0005 P0 8종 중 4번.
 *
 * Phase A는 스택 무관 범용. Phase B에서 스택별 본문 분기 추가 (ADR-0018).
 * 함수 시그니처는 향후 input.stack을 활용한 분기를 위해 함수형으로 통일.
 */

import type { SkillCatalogItem } from '@/types/aiConfig'

export const TEST_WRITER_SKILL: SkillCatalogItem = {
  id: 'test-writer',
  displayName: '단위 테스트 작성',
  summary: '대상 함수/모듈에 대한 단위 테스트를 AAA 패턴으로 작성한다.',
  description:
    'Write unit tests for the target function or module. Use when the user asks to add tests, increase coverage, or verify behavior with tests.',
  bodyTemplate: () => `# Test Writer Skill

Write unit tests for the target code using the AAA (Arrange-Act-Assert) pattern.

## Steps

1. **Identify the unit under test** — A function, class, or module.
2. **List the behaviors to verify**:
   - Happy path (typical valid input).
   - Edge cases (empty, null, boundary values, max size).
   - Error paths (invalid input, exceptions).
3. **Find the test framework already in use** — Check \`package.json\`, existing \`*.test.ts\` files. Match the project's conventions.
4. **Write the tests** following the AAA structure.
5. **Run the tests** and confirm they pass (and that they actually test what you intended — try mutation: change the implementation slightly, ensure a test fails).

## AAA Pattern

\`\`\`ts
test('describes the behavior being verified', () => {
  // Arrange — set up inputs and dependencies
  const input = ...

  // Act — invoke the unit under test
  const result = subject(input)

  // Assert — verify the outcome
  expect(result).toBe(expected)
})
\`\`\`

## Rules

- **One behavior per test** — Each \`test\`/\`it\` block verifies one thing.
- **Test names describe behavior**, not implementation. Good: \`returns empty array when input is null\`. Bad: \`tests the null check\`.
- **Avoid mocking unless necessary** — Mocks couple tests to implementation. Prefer real dependencies for pure functions.
- **No conditionals or loops in tests** — If you need them, you have multiple test cases.
- **Edge cases first** — Empty arrays, null, undefined, zero, negative, very large inputs.
- **Don't test implementation details** — Test observable behavior.

## Coverage Goals

- Every public function should have at least one test.
- Every branch in conditional logic should be exercised.
- Every error path should have a test that triggers it.
`,
}
