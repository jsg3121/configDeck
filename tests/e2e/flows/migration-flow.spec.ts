/**
 * 마이그레이션 페이지 E2E 테스트
 *
 * SPEC-0004 §6.1 7단계 산출물.
 * Phase C 10단계에서 마이그레이션 동선이 generator 탭에서 전용 페이지로 이전됨.
 *
 * ESLint 페이지 시나리오:
 *   S1) Legacy 입력 → 자동 변환 + 미리보기에 flat config 출력
 *   S2) Flat config 입력 → Audit-only 모드 진입 (배지 + 안내문 + 변환 경고 미노출)
 *   S3) 잘못된 입력 → 에러 안내문 표시
 *   S4) Audit 모드에서 권장 규칙 [적용] → 미리보기 갱신 + 진단 항목 자동 갱신
 *
 * 마이그레이션 허브 + 진입점 시나리오:
 *   H1) 허브 페이지 진입 시 도구 카드 3개 노출
 *   H2) 각 카드 클릭 → 해당 도구 페이지로 이동
 *   H3) 헤더 마이그레이션 링크 클릭 → 허브로 이동
 *
 * Prettier 페이지 시나리오:
 *   P1) deprecated 옵션 입력 → audit 결과 + 미리보기 노출
 *   P2) 복사/다운로드 버튼 활성화 확인
 *
 * TSConfig 페이지 시나리오:
 *   T1) 페이지 진입 시 상단 info 배너 노출
 *   T2) 입력 후 결과 영역에 warning 배너 노출
 *
 * 도구 유형 불일치(W9) 시나리오:
 *   M1) ESLint 페이지에 Prettier 설정 입력 → 붉은 경고 배너 + 이동 링크
 *   M2) TSConfig 페이지에 ESLint 설정 입력 → 붉은 경고 배너 + 이동 링크
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

const PRETTIER_DEPRECATED_INPUT = `{
  "jsxBracketSameLine": true,
  "semi": false
}`

const TSCONFIG_INPUT = `{
  "compilerOptions": {
    "target": "ES2022"
  }
}`

const ESLINT_INPUT_FOR_MISMATCH = `{
  "rules": {
    "no-console": "warn"
  },
  "env": {
    "browser": true
  }
}`

/**
 * 마이그레이션 허브 페이지로 진입한다.
 */
const enterMigrationHub = async (page: Page) => {
  await page.goto('/ko/migration')
  await page.waitForLoadState('networkidle')
}

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
 * Prettier 마이그레이션 페이지로 진입하여 입력 textarea를 노출한다.
 */
const enterPrettierPage = async (page: Page) => {
  await page.goto('/ko/migration/prettier')
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

// ──────────────────────────────────────────────
// W1 — 마이그레이션 허브 + 헤더 진입점
// ──────────────────────────────────────────────

test.describe('마이그레이션 허브 + 진입점', () => {
  test('H1: 허브 페이지 진입 시 ESLint/Prettier/TSConfig 카드 3개가 노출된다', async ({ page }) => {
    await enterMigrationHub(page)

    // 각 도구 카드의 heading이 모두 표시되어야 한다
    await expect(page.getByRole('heading', { name: 'ESLint' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Prettier' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'TSConfig' })).toBeVisible()
  })

  test('H2: ESLint 카드 클릭 시 /ko/migration/eslint 로 이동한다', async ({ page }) => {
    await enterMigrationHub(page)

    const eslintCard = page.locator('a[href*="/migration/eslint"]').first()
    await eslintCard.click()
    await expect(page).toHaveURL(/\/ko\/migration\/eslint/)
  })

  test('H2: Prettier 카드 클릭 시 /ko/migration/prettier 로 이동한다', async ({ page }) => {
    await enterMigrationHub(page)

    const prettierCard = page.locator('a[href*="/migration/prettier"]').first()
    await prettierCard.click()
    await expect(page).toHaveURL(/\/ko\/migration\/prettier/)
  })

  test('H2: TSConfig 카드 클릭 시 /ko/migration/tsconfig 로 이동한다', async ({ page }) => {
    await enterMigrationHub(page)

    const tsconfigCard = page.locator('a[href*="/migration/tsconfig"]').first()
    await tsconfigCard.click()
    await expect(page).toHaveURL(/\/ko\/migration\/tsconfig/)
  })

  test('H3: 헤더 마이그레이션 링크 클릭 시 허브 페이지로 이동한다', async ({ page }) => {
    await page.goto('/ko/generator')
    await page.waitForLoadState('networkidle')

    // 헤더 내 "마이그레이션 & 진단" 링크 — md:flex 이상(데스크톱)에서만 표시된다.
    // 모바일 뷰포트에서는 햄버거 메뉴로 접혀 있으므로 링크가 없으면 스킵한다.
    const migrationLink = page
      .locator('header.bg-surface')
      .getByRole('link', { name: '마이그레이션 & 진단' })
    const isVisible = await migrationLink.isVisible().catch(() => false)
    if (!isVisible) {
      test.skip()
      return
    }
    await migrationLink.click()

    await expect(page).toHaveURL(/\/ko\/migration/)
  })
})

// ──────────────────────────────────────────────
// W2 — Prettier 페이지 변환 시나리오
// ──────────────────────────────────────────────

test.describe('Prettier 페이지 플로우', () => {
  test('P1: deprecated 옵션 입력 시 audit 결과와 미리보기가 노출된다', async ({ page }) => {
    await enterPrettierPage(page)

    await page.locator('textarea').fill(PRETTIER_DEPRECATED_INPUT)

    // audit 결과 또는 미리보기 코드가 나타날 때까지 대기
    await page.waitForFunction(
      () => {
        const code = document.querySelector('pre code')
        return code && code.textContent && code.textContent.trim().length > 0
      },
      { timeout: 3000 },
    )

    // 미리보기 코드 영역에 입력 내용이 반영되어야 한다
    const codePreview = page.locator('pre code').first()
    await expect(codePreview).toBeVisible()
  })

  test('P2: 변환 결과가 있으면 복사/다운로드 버튼이 활성화된다', async ({ page }) => {
    await enterPrettierPage(page)

    await page.locator('textarea').fill(PRETTIER_DEPRECATED_INPUT)

    await page.waitForFunction(
      () => {
        const code = document.querySelector('pre code')
        return code && code.textContent && code.textContent.trim().length > 0
      },
      { timeout: 3000 },
    )

    // 버튼이 존재하고 disabled가 아니어야 한다
    const copyButton = page.locator('button').filter({ hasText: '복사' }).first()
    const downloadButton = page.locator('button').filter({ hasText: '다운로드' }).first()
    await expect(copyButton).toBeVisible()
    await expect(downloadButton).toBeVisible()
    await expect(copyButton).not.toBeDisabled()
    await expect(downloadButton).not.toBeDisabled()
  })
})

// ──────────────────────────────────────────────
// W3 — TSConfig 페이지 + 안내 배너 시나리오
// ──────────────────────────────────────────────

test.describe('TSConfig 페이지 플로우', () => {
  test('T1: 페이지 진입 시 상단 파란 info 배너가 노출된다', async ({ page }) => {
    await page.goto('/ko/migration/tsconfig')
    await page.waitForLoadState('networkidle')

    // TSConfigDisclaimer variant="top" — role="note", border-blue-200
    const infoBanner = page.locator('aside[role="note"]').first()
    await expect(infoBanner).toBeVisible()

    // 파란 계열 클래스가 포함되어야 한다
    await expect(infoBanner).toHaveClass(/border-blue-200/)

    // i18n 텍스트 확인
    await expect(page.getByText('권장값은 정답이 아닙니다')).toBeVisible()
  })

  test('T2: tsconfig.json 입력 후 결과 영역에 황색 warning 배너가 노출된다', async ({ page }) => {
    await page.goto('/ko/migration/tsconfig')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('textarea')).toBeVisible()

    await page.locator('textarea').fill(TSCONFIG_INPUT)

    // 결과가 나타날 때까지 대기 (pre code 또는 amber 배너)
    await page.waitForFunction(
      () => {
        const code = document.querySelector('pre code')
        return code && code.textContent && code.textContent.trim().length > 0
      },
      { timeout: 3000 },
    )

    // TSConfigDisclaimer variant="result" — border-amber-200
    // role="note" 중 amber 계열 클래스를 가진 배너를 찾는다
    const allNotes = page.locator('aside[role="note"]')
    const count = await allNotes.count()
    let foundAmber = false
    for (let i = 0; i < count; i++) {
      const cls = await allNotes.nth(i).getAttribute('class')
      if (cls && cls.includes('border-amber-200')) {
        foundAmber = true
        await expect(allNotes.nth(i)).toBeVisible()
        break
      }
    }
    // amber 배너가 존재해야 한다
    expect(foundAmber).toBe(true)
  })
})

// ──────────────────────────────────────────────
// W4 — 도구 유형 불일치(W9) 시나리오
// ──────────────────────────────────────────────

test.describe('도구 유형 불일치(W9) 검증', () => {
  test('M1: ESLint 페이지에 Prettier 설정 입력 시 붉은 경고 배너가 노출된다', async ({ page }) => {
    await enterEslintMigrationPage(page)

    await page.locator('textarea').fill(PRETTIER_DEPRECATED_INPUT)

    // ToolMismatchBanner — aside[role="alert"], border-red-200
    const mismatchBanner = page.locator('aside[role="alert"]')
    await expect(mismatchBanner).toBeVisible({ timeout: 3000 })
    await expect(mismatchBanner).toHaveClass(/border-red-200/)

    // i18n: migration.mismatchWarning.title
    await expect(page.getByText('다른 도구의 설정으로 보입니다')).toBeVisible()
  })

  test('M1: ESLint 페이지 불일치 배너에서 Prettier 이동 링크 클릭 시 /ko/migration/prettier 로 이동한다', async ({
    page,
  }) => {
    await enterEslintMigrationPage(page)

    await page.locator('textarea').fill(PRETTIER_DEPRECATED_INPUT)

    const mismatchBanner = page.locator('aside[role="alert"]')
    await expect(mismatchBanner).toBeVisible({ timeout: 3000 })

    // "Prettier 페이지로 이동" 링크
    const goLink = mismatchBanner.getByRole('link')
    await expect(goLink).toBeVisible()
    await goLink.click()

    await expect(page).toHaveURL(/\/ko\/migration\/prettier/)
  })

  test('M1: ESLint 페이지 불일치 시 미리보기가 비어 있다 (변환 차단)', async ({ page }) => {
    await enterEslintMigrationPage(page)

    await page.locator('textarea').fill(PRETTIER_DEPRECATED_INPUT)

    const mismatchBanner = page.locator('aside[role="alert"]')
    await expect(mismatchBanner).toBeVisible({ timeout: 3000 })

    // 미리보기 코드 영역이 비어 있어야 한다
    const codePreview = page.locator('pre code').first()
    const hasCode = await codePreview.isVisible().catch(() => false)
    if (hasCode) {
      const text = await codePreview.textContent()
      expect(text?.trim() ?? '').toBe('')
    }
    // pre code가 없는 경우도 차단으로 간주 (통과)
  })

  test('M2: TSConfig 페이지에 ESLint 설정 입력 시 붉은 경고 배너가 노출된다', async ({ page }) => {
    await page.goto('/ko/migration/tsconfig')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('textarea')).toBeVisible()

    await page.locator('textarea').fill(ESLINT_INPUT_FOR_MISMATCH)

    const mismatchBanner = page.locator('aside[role="alert"]')
    await expect(mismatchBanner).toBeVisible({ timeout: 3000 })
    await expect(mismatchBanner).toHaveClass(/border-red-200/)

    await expect(page.getByText('다른 도구의 설정으로 보입니다')).toBeVisible()
  })

  test('M2: TSConfig 페이지 불일치 배너에서 ESLint 이동 링크 클릭 시 /ko/migration/eslint 로 이동한다', async ({
    page,
  }) => {
    await page.goto('/ko/migration/tsconfig')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('textarea')).toBeVisible()

    await page.locator('textarea').fill(ESLINT_INPUT_FOR_MISMATCH)

    const mismatchBanner = page.locator('aside[role="alert"]')
    await expect(mismatchBanner).toBeVisible({ timeout: 3000 })

    const goLink = mismatchBanner.getByRole('link')
    await expect(goLink).toBeVisible()
    await goLink.click()

    await expect(page).toHaveURL(/\/ko\/migration\/eslint/)
  })
})
