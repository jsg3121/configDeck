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
    // 히어로 섹션의 "설정 파일 만들기" 버튼
    const ctaButton = page.getByRole('link', { name: '설정 파일 만들기' })
    await expect(ctaButton).toBeVisible()

    await ctaButton.click()
    await expect(page).toHaveURL(/\/ko\/generator/)
  })

  test('네비게이션 메뉴가 표시된다', async ({ page }) => {
    const nav = page.locator('header')
    await expect(nav).toBeVisible()
  })

  test('언어 전환 링크가 동작한다', async ({ page }) => {
    // EN 링크 (exact match로 .env 링크와 구분)
    const enLink = page.locator('header').getByRole('link', { name: 'EN', exact: true })
    await expect(enLink).toBeVisible()

    await enLink.click()
    await expect(page).toHaveURL(/\/en/)
  })

  test('인기 프리셋 섹션이 표시된다', async ({ page }) => {
    const presetHeading = page.getByRole('heading', { name: '인기 프리셋' })
    await expect(presetHeading).toBeVisible()
  })

  test('지원 파일 섹션이 표시된다', async ({ page }) => {
    const supportedHeading = page.getByRole('heading', { name: '지원하는 설정 파일' })
    await expect(supportedHeading).toBeVisible()
  })
})

test.describe('홈페이지 (영문)', () => {
  test('영문 페이지가 정상적으로 로드된다', async ({ page }) => {
    await page.goto('/en')
    await expect(page).toHaveTitle(/ConfigDeck/)
  })

  test('영문 CTA 버튼이 동작한다', async ({ page }) => {
    await page.goto('/en')
    // 히어로 섹션의 "Start Building" 버튼
    const ctaButton = page.getByRole('link', { name: 'Start Building' })
    await expect(ctaButton).toBeVisible()
  })
})
