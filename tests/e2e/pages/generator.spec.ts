/**
 * 생성기 페이지 E2E 테스트
 */
import { expect, test } from '@playwright/test'

test.describe('생성기 인덱스 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/generator')
  })

  test('생성기 페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/생성기|Generator/)
  })

  test('스택 프리셋 목록이 표시된다', async ({ page }) => {
    const stackSection = page.locator('text=스택 프리셋').or(page.locator('text=Stack Presets'))
    await expect(stackSection.first()).toBeVisible()
  })

  test('개별 파일 목록이 표시된다', async ({ page }) => {
    const fileSection = page.locator('text=개별 파일').or(page.locator('text=Individual Files'))
    await expect(fileSection.first()).toBeVisible()
  })

  test('ESLint 설정 링크가 존재한다', async ({ page }) => {
    const eslintLink = page.getByRole('link', { name: /eslint/i }).first()
    await expect(eslintLink).toBeVisible()
  })

  test('Prettier 설정 링크가 존재한다', async ({ page }) => {
    const prettierLink = page.getByRole('link', { name: /prettier/i }).first()
    await expect(prettierLink).toBeVisible()
  })
})

test.describe('ESLint 생성기 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/generator/eslint-config')
  })

  test('ESLint 생성기 페이지가 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/ESLint/)
  })

  test('프리셋 선택 버튼이 표시된다', async ({ page }) => {
    const presetButton = page.locator('button').filter({ hasText: /Minimal|Recommended|Strict/i })
    await expect(presetButton.first()).toBeVisible()
  })

  test('코드 미리보기 영역이 표시된다', async ({ page }) => {
    const preview = page.locator('text=eslint.config.mjs')
    await expect(preview).toBeVisible()
  })

  test('복사 버튼이 동작한다', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: /복사|Copy/i })
    await expect(copyButton).toBeVisible()

    await copyButton.click()
    await expect(page.getByText(/복사됨|Copied/i)).toBeVisible()
  })

  test('다운로드 버튼이 존재한다', async ({ page }) => {
    const downloadButton = page.getByRole('button', { name: /다운로드|Download/i })
    await expect(downloadButton).toBeVisible()
  })

  test('프리셋 선택 시 코드가 변경된다', async ({ page }) => {
    // 초기 코드 확인
    const codePreview = page.locator('pre code')
    const initialCode = await codePreview.textContent()

    // Recommended 프리셋 선택
    const recommendedButton = page.locator('button').filter({ hasText: 'Recommended' })
    if (await recommendedButton.isVisible()) {
      await recommendedButton.click()

      // 코드가 변경되었는지 확인
      await page.waitForTimeout(500)
      const newCode = await codePreview.textContent()
      expect(newCode).not.toBe(initialCode)
    }
  })

  test('초기화 버튼이 동작한다', async ({ page }) => {
    // 프리셋 선택
    const presetButton = page.locator('button').filter({ hasText: /Recommended|Strict/i }).first()
    if (await presetButton.isVisible()) {
      await presetButton.click()
    }

    // 초기화 버튼 클릭
    const clearButton = page.getByRole('button', { name: /초기화|Clear/i })
    if (await clearButton.isVisible()) {
      await clearButton.click()
    }
  })
})

test.describe('Prettier 생성기 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko/generator/prettier-config')
  })

  test('Prettier 생성기 페이지가 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/Prettier/)
  })

  test('prettier.config.mjs 파일명이 표시된다', async ({ page }) => {
    const fileName = page.locator('text=prettier.config.mjs')
    await expect(fileName).toBeVisible()
  })

  test('프리셋 선택이 가능하다', async ({ page }) => {
    const presetButton = page.locator('button').filter({ hasText: /Standard|Minimal/i }).first()
    await expect(presetButton).toBeVisible()
  })
})

test.describe('tsconfig 생성기 페이지', () => {
  test('TypeScript 생성기 페이지가 로드된다', async ({ page }) => {
    await page.goto('/ko/generator/tsconfig')
    await expect(page).toHaveTitle(/TypeScript|tsconfig/)
  })

  test('tsconfig.json 파일명이 표시된다', async ({ page }) => {
    await page.goto('/ko/generator/tsconfig')
    const fileName = page.locator('text=tsconfig.json')
    await expect(fileName).toBeVisible()
  })
})
