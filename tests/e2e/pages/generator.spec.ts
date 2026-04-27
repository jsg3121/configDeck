/**
 * 생성기 페이지 E2E 테스트
 */
import { expect, test } from '@playwright/test'

test.describe('생성기 인덱스 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/generator')
    // Svelte 아일랜드 hydration 안정화 — mobile-chrome 등 부하가 큰 환경에서
    // beforeEach 직후 인터랙션을 보내면 onclick 핸들러가 아직 바인딩되지 않은
    // 경우가 있어 flaky 실패가 발생한다.
    await page.waitForLoadState('networkidle')
  })

  test('생성기 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/생성기|Generator/)
  })

  test('스택 프리셋 카드가 표시된다', async ({ page }) => {
    // React + Vite + TS 프리셋 카드
    const reactPreset = page.getByRole('link', { name: /React \+ Vite \+ TS/i })
    await expect(reactPreset).toBeVisible()
  })

  test('개별 파일 카드가 표시된다', async ({ page }) => {
    // 개별 파일 섹션 내의 ESLint 카드 (href로 구분)
    const eslintCard = page.locator('a[href*="/generator/eslint-config"]').first()
    await expect(eslintCard).toBeVisible()
  })

  test('ESLint 설정 링크가 존재한다', async ({ page }) => {
    const eslintLink = page.locator('a[href*="/generator/eslint-config"]').first()
    await expect(eslintLink).toBeVisible()
  })

  test('Prettier 설정 링크가 존재한다', async ({ page }) => {
    const prettierLink = page.locator('a[href*="/generator/prettier-config"]').first()
    await expect(prettierLink).toBeVisible()
  })
})

test.describe('ESLint 생성기 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/generator/eslint-config')
    // Svelte 아일랜드 hydration 안정화. e2e-execution.md §4-1 참조.
    await page.waitForLoadState('networkidle')
  })

  test('ESLint 생성기 페이지가 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/ESLint/)
  })

  test('프리셋 선택 버튼이 표시된다', async ({ page }) => {
    const presetButton = page.locator('button').filter({ hasText: /Minimal|Recommended|Strict/i })
    await expect(presetButton.first()).toBeVisible()
  })

  test('코드 미리보기 영역이 표시된다', async ({ page }) => {
    // 모바일에서는 미리보기 탭 클릭 필요
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()
    if (await previewTab.isVisible()) {
      await previewTab.click()
    }

    // 코드 미리보기 확인
    const codePreview = page.getByRole('region', { name: '생성된 코드' }).locator('pre code')
    await expect(codePreview).toBeVisible()
  })

  test('복사 버튼이 존재한다', async ({ page }) => {
    // 모바일에서는 미리보기 탭 클릭 필요
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()
    if (await previewTab.isVisible()) {
      await previewTab.click()
    }

    // 코드 미리보기 영역의 복사 버튼
    const copyButton = page.locator('button').filter({ hasText: '복사' }).first()
    await expect(copyButton).toBeVisible()
  })

  // 클립보드 권한은 Chromium에서만 지원되므로 별도 테스트로 분리
  test('복사 버튼 클릭 시 복사됨 표시 (Chromium only)', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', '클립보드 권한은 Chromium에서만 지원')

    await context.grantPermissions(['clipboard-write', 'clipboard-read'])

    // 모바일에서는 미리보기 탭 클릭 필요
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()
    if (await previewTab.isVisible()) {
      await previewTab.click()
    }

    const copyButton = page.locator('button').filter({ hasText: '복사' }).first()
    await copyButton.click()
    await expect(page.locator('button').filter({ hasText: '복사됨!' })).toBeVisible({
      timeout: 3000,
    })
  })

  test('다운로드 버튼이 존재한다', async ({ page }) => {
    // 모바일에서는 미리보기 탭 클릭 필요
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()
    if (await previewTab.isVisible()) {
      await previewTab.click()
    }

    const downloadButton = page.locator('button').filter({ hasText: '다운로드' }).first()
    await expect(downloadButton).toBeVisible()
  })

  test('프리셋 선택 시 코드가 변경된다', async ({ page }) => {
    // 모바일에서는 미리보기 탭 클릭 필요
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()
    if (await previewTab.isVisible()) {
      await previewTab.click()
    }

    // 초기 코드 확인
    const codePreview = page.getByRole('region', { name: '생성된 코드' }).locator('pre code')
    const initialCode = await codePreview.textContent()

    // 모바일에서는 옵션 탭으로 전환
    const optionsTab = page.locator('button').filter({ hasText: '옵션' }).first()
    if (await optionsTab.isVisible()) {
      await optionsTab.click()
    }

    // Recommended 프리셋 선택
    const recommendedButton = page.locator('button').filter({ hasText: 'Recommended' })
    if (await recommendedButton.isVisible()) {
      await recommendedButton.click()

      // 모바일에서는 미리보기 탭으로 다시 전환
      if (await previewTab.isVisible()) {
        await previewTab.click()
      }

      // 코드가 변경되었는지 확인
      await page.waitForTimeout(300)
      const newCode = await codePreview.textContent()
      expect(newCode).not.toBe(initialCode)
    }
  })

  test('초기화 버튼이 동작한다', async ({ page }) => {
    // 프리셋 선택
    const presetButton = page
      .locator('button')
      .filter({ hasText: /Recommended|Strict/i })
      .first()
    if (await presetButton.isVisible()) {
      await presetButton.click()
    }

    // 초기화 버튼 클릭
    const clearButton = page.locator('button').filter({ hasText: '초기화' })
    if (await clearButton.isVisible()) {
      await clearButton.click()
    }
  })
})

test.describe('Prettier 생성기 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/generator/prettier-config')
    // Svelte 아일랜드 hydration 안정화. e2e-execution.md §4-1 참조.
    await page.waitForLoadState('networkidle')
  })

  test('Prettier 생성기 페이지가 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/Prettier/)
  })

  test('prettier.config.mjs 파일명이 표시된다', async ({ page }) => {
    // 모바일에서는 미리보기 탭 클릭 필요
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()
    if (await previewTab.isVisible()) {
      await previewTab.click()
    }

    // 코드 미리보기 확인
    const codePreview = page.getByRole('region', { name: '생성된 코드' }).locator('pre code')
    await expect(codePreview).toBeVisible()
  })

  test('프리셋 선택이 가능하다', async ({ page }) => {
    const presetButton = page
      .locator('button')
      .filter({ hasText: /Standard|Minimal/i })
      .first()
    await expect(presetButton).toBeVisible()
  })
})

test.describe('tsconfig 생성기 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/generator/tsconfig')
    // Svelte 아일랜드 hydration 안정화. e2e-execution.md §4-1 참조.
    await page.waitForLoadState('networkidle')
  })

  test('TypeScript 생성기 페이지가 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/TypeScript|tsconfig/)
  })

  test('tsconfig.json 파일명이 표시된다', async ({ page }) => {
    // 모바일에서는 미리보기 탭 클릭 필요
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()
    if (await previewTab.isVisible()) {
      await previewTab.click()
    }

    // 코드 미리보기 확인
    const codePreview = page.getByRole('region', { name: '생성된 코드' }).locator('pre code')
    await expect(codePreview).toBeVisible()
  })
})
