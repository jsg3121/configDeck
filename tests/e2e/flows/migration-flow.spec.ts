/**
 * ESLint 마이그레이션/진단(Audit) 사용자 플로우 E2E 테스트
 *
 * SPEC-0004 §6.1 7단계 산출물.
 * Phase C 10단계에서 마이그레이션 동선이 generator 탭에서 전용 페이지(`/migration/eslint`)로 이전됨.
 *
 * 검증 시나리오:
 *   S1) Legacy 입력 → 자동 변환 + 미리보기에 flat config 출력
 *   S2) Flat config 입력 → Audit-only 모드 진입 (배지 + 안내문 + 변환 경고 미노출)
 *   S3) 잘못된 입력 → 에러 안내문 표시
 *   S4) Audit 모드에서 권장 규칙 [적용] → 미리보기 갱신 + 진단 항목 자동 갱신
 */
import { expect, test, type Page } from '@playwright/test'

const LEGACY_INPUT = `{
  "extends": ["eslint:recommended"],
  "rules": {
    "no-console": "warn"
  }
}`

const FLAT_INPUT = `import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    rules: {},
  },
]`

// JSON 형식으로 감지되지만 파싱이 실패하는 입력 (legacy 감지 + JSON.parse throw)
// → migrate 흐름에서 catch 분기 진입 → 에러 안내문 노출
const BROKEN_INPUT = `{
  "extends": ["eslint:recommended"
  "rules": { "no-console": "warn" }
}`

/**
 * ESLint 마이그레이션 페이지로 진입하여 입력 textarea를 노출한다.
 * Phase C에서 generator 탭이 제거되고 전용 페이지로 이전됐다.
 */
const enterEslintMigrationPage = async (page: Page) => {
  await page.goto('/ko/migration/eslint')
  // Svelte 아일랜드 hydration이 끝날 때까지 대기
  await page.waitForLoadState('networkidle')
  await expect(page.locator('textarea')).toBeVisible()
}

/**
 * 미리보기에 코드가 표시될 때까지 debounce(300ms) + Svelte effect 사이클을 기다린다.
 * MigrationPanel은 입력 변경 시 300ms debounce 후 audit/migrate를 실행하므로
 * 명시적 대기가 필요하다.
 */
const waitForPreview = async (page: Page) => {
  await page.waitForTimeout(400)
}

test.describe('마이그레이션 플로우 (전용 페이지)', () => {
  test('S1: Legacy .eslintrc 입력 시 flat config로 자동 변환되어 미리보기에 출력된다', async ({
    page,
  }) => {
    await enterEslintMigrationPage(page)

    // Legacy JSON 입력
    await page.locator('textarea').fill(LEGACY_INPUT)
    await waitForPreview(page)

    // 미리보기 영역에 flat config 시그니처가 포함되어야 한다
    const codePreview = page.locator('pre code').first()
    await expect(codePreview).toContainText('export default [')
    await expect(codePreview).toContainText('@eslint/js')

    // Audit-only 배지는 노출되지 않아야 한다 (Legacy 흐름)
    const auditBadge = page.locator('span').filter({ hasText: /^진단 모드$/ })
    await expect(auditBadge).toHaveCount(0)
  })

  test('S2: Flat config 입력 시 Audit-only 모드 배지와 안내문이 노출된다', async ({ page }) => {
    await enterEslintMigrationPage(page)

    // 이미 마이그레이션된 flat config 입력
    await page.locator('textarea').fill(FLAT_INPUT)
    await waitForPreview(page)

    // Audit-only 배지가 보여야 한다
    const auditBadge = page.locator('span').filter({ hasText: /^진단 모드$/ })
    await expect(auditBadge).toBeVisible()

    // Flat config 안내문이 노출되어야 한다
    await expect(page.getByText('Flat config가 감지되었습니다')).toBeVisible()

    // 미리보기에 입력 코드가 그대로 나타나야 한다 (변환 결과가 아님)
    const codePreview = page.locator('pre code').first()
    await expect(codePreview).toContainText("import js from '@eslint/js'")

    // 변환 경고 영역(MigrationFeedback의 "수동 확인 필요" 헤더)은 보이지 않아야 한다
    await expect(page.getByText('수동 확인 필요')).toHaveCount(0)
  })

  test('S3: 잘못된 입력은 에러 안내문이 노출된다', async ({ page }) => {
    await enterEslintMigrationPage(page)

    // 깨진 JSON 입력 (legacy로 감지되지만 파싱 실패)
    await page.locator('textarea').fill(BROKEN_INPUT)
    await waitForPreview(page)

    // 변환 실패 안내문 노출
    await expect(page.getByText('변환에 실패했습니다')).toBeVisible()
  })

  test('S4: Audit 모드에서 권장 규칙 [적용] 시 미리보기와 진단이 갱신된다', async ({ page }) => {
    await enterEslintMigrationPage(page)

    // Flat config 입력 → Audit-only 모드 진입
    await page.locator('textarea').fill(FLAT_INPUT)
    await waitForPreview(page)
    await expect(page.locator('span').filter({ hasText: /^진단 모드$/ })).toBeVisible()

    // "no-console" 권장 규칙 항목의 [적용] 버튼 클릭
    const noConsoleCard = page
      .locator('div')
      .filter({ hasText: /"no-console" 규칙 추가를 고려해보세요/ })
      .first()
    await expect(noConsoleCard).toBeVisible()

    const applyButton = noConsoleCard.locator('button').filter({ hasText: '적용' }).first()
    await applyButton.click()
    await waitForPreview(page)

    // 미리보기에 새 규칙이 반영되어야 한다
    await expect(page.locator('pre code').first()).toContainText('"no-console": "warn"')

    // "no-console" info 항목이 사라져야 한다 (audit 재계산 결과)
    await expect(
      page.locator('p').filter({ hasText: /"no-console" 규칙 추가를 고려해보세요/ }),
    ).toHaveCount(0)
  })
})
