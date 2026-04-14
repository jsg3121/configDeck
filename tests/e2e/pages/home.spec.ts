/**
 * 홈페이지 E2E 테스트
 */
import { expect, test } from '@playwright/test'

test.describe('홈페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ko')
  })

  test('페이지가 정상적으로 로드된다', async ({ page }) => {
    await expect(page).toHaveTitle(/ConfigDeck/)
  })

  test('히어로 섹션의 CTA 버튼이 생성기 페이지로 이동한다', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: /설정 파일 만들기|시작하기/i })
    await expect(ctaButton).toBeVisible()

    await ctaButton.click()
    await expect(page).toHaveURL(/\/ko\/generator/)
  })

  test('네비게이션 메뉴가 표시된다', async ({ page }) => {
    const nav = page.locator('header nav')
    await expect(nav).toBeVisible()
  })

  test('언어 전환 링크가 동작한다', async ({ page }) => {
    const enLink = page.getByRole('link', { name: 'EN' })
    await expect(enLink).toBeVisible()

    await enLink.click()
    await expect(page).toHaveURL(/\/en/)
  })

  test('인기 프리셋 섹션이 표시된다', async ({ page }) => {
    const presetSection = page.locator('text=인기 프리셋').or(page.locator('text=Popular Presets'))
    await expect(presetSection.first()).toBeVisible()
  })

  test('지원 파일 섹션이 표시된다', async ({ page }) => {
    const supportedSection = page
      .locator('text=지원 파일')
      .or(page.locator('text=Supported Files'))
    await expect(supportedSection.first()).toBeVisible()
  })
})

test.describe('홈페이지 (영문)', () => {
  test('영문 페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto('/en')
    await expect(page).toHaveTitle(/ConfigDeck/)
  })

  test('영문 CTA 버튼이 동작한다', async ({ page }) => {
    await page.goto('/en')
    const ctaButton = page.getByRole('link', { name: /Create Config|Get Started/i })
    await expect(ctaButton).toBeVisible()
  })
})
