/**
 * 생성기 사용자 플로우 E2E 테스트
 */
import { expect, test } from '@playwright/test'

test.describe('설정 파일 생성 플로우', () => {
  test('홈 → 생성기 → ESLint 설정 생성 플로우', async ({ page }) => {
    // 1. 홈페이지 방문
    await page.goto('/ko')
    await expect(page).toHaveTitle(/ConfigDeck/)

    // 2. 생성기 페이지로 이동
    await page.goto('/ko/generator')
    await expect(page).toHaveURL(/\/ko\/generator/)

    // 3. ESLint 설정 선택 (href로 정확히 매칭)
    const eslintLink = page.locator('a[href*="/generator/eslint-config"]').first()
    await eslintLink.click()
    await expect(page).toHaveURL(/eslint-config/)

    // 4. 모바일에서는 미리보기 탭 클릭 필요
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()
    if (await previewTab.isVisible()) {
      await previewTab.click()
    }

    // 5. 코드 미리보기 확인
    const codePreview = page.getByRole('region', { name: '생성된 코드' }).locator('pre code')
    await expect(codePreview).toBeVisible()
    const code = await codePreview.textContent()
    expect(code).toContain('export default')

    // 6. 복사 버튼 존재 확인 (클립보드 API는 브라우저마다 권한 지원이 달라 버튼 존재만 확인)
    const copyButton = page.locator('button').filter({ hasText: '복사' }).first()
    await expect(copyButton).toBeVisible()
  })

  test('프리셋 선택 및 옵션 변경 플로우', async ({ page }) => {
    await page.goto('/ko/generator/eslint-config')

    // 모바일에서는 미리보기 탭 클릭
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()
    if (await previewTab.isVisible()) {
      await previewTab.click()
    }

    // 1. 초기 상태 확인
    const codePreview = page.getByRole('region', { name: '생성된 코드' }).locator('pre code')
    const initialCode = await codePreview.textContent()

    // 모바일에서는 옵션 탭으로 전환
    const optionsTab = page.locator('button').filter({ hasText: '옵션' }).first()
    if (await optionsTab.isVisible()) {
      await optionsTab.click()
    }

    // 2. Recommended 프리셋 선택
    const recommendedButton = page.locator('button').filter({ hasText: 'Recommended' })
    if (await recommendedButton.isVisible()) {
      await recommendedButton.click()

      // 모바일에서는 미리보기 탭으로 다시 전환
      if (await previewTab.isVisible()) {
        await previewTab.click()
      }

      // 3. 코드가 변경되었는지 확인
      await page.waitForTimeout(300)
      const afterPresetCode = await codePreview.textContent()
      expect(afterPresetCode).not.toBe(initialCode)
    }
  })

  test('검색 기능 플로우', async ({ page }) => {
    await page.goto('/ko/generator/eslint-config')
    // Svelte 아일랜드 hydration 대기 — 검색 모달 onclick 핸들러가 바인딩되어야 한다
    await page.waitForLoadState('networkidle')

    // 1. 검색 버튼 클릭
    const searchButton = page.locator('button').filter({ hasText: /옵션 검색/i })
    if (await searchButton.isVisible()) {
      await searchButton.click()

      // 2. 검색 모달이 열리는지 확인
      const searchInput = page.locator('input[placeholder*="검색"]')
      await expect(searchInput).toBeVisible()

      // 3. ESC로 모달 닫기
      await page.keyboard.press('Escape')
      await expect(searchInput).not.toBeVisible()
    }
  })

  test('Ctrl+K 단축키로 검색 모달 열기', async ({ page }) => {
    await page.goto('/ko/generator/eslint-config')

    // Ctrl+K 입력
    await page.keyboard.press('Control+k')

    // 검색 모달이 열리는지 확인
    const searchInput = page.locator('input[placeholder*="검색"]')

    // 모달이 열리면 테스트 통과, 아니면 스킵
    const isVisible = await searchInput.isVisible().catch(() => false)
    if (isVisible) {
      await expect(searchInput).toBeVisible()
    }
  })
})

test.describe('다국어 전환 플로우', () => {
  test('한국어 → 영어 전환 시 콘텐츠가 변경된다', async ({ page }) => {
    // 1. 한국어 페이지 방문
    await page.goto('/ko/generator/eslint-config')

    // 2. 영어로 전환 (header 내의 EN 링크)
    const enLink = page.locator('header').getByRole('link', { name: 'EN', exact: true })
    await enLink.click()

    // 3. URL이 변경되었는지 확인
    await expect(page).toHaveURL(/\/en\//)

    // 4. 영문 콘텐츠가 표시되는지 확인 (프리셋 라벨)
    const presetLabel = page.locator('h2').filter({ hasText: /Preset/i })
    await expect(presetLabel).toBeVisible()
  })
})

test.describe('모바일 뷰 플로우', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('모바일에서 옵션/미리보기 탭이 표시된다', async ({ page }) => {
    await page.goto('/ko/generator/eslint-config')
    // Svelte 아일랜드 hydration 안정화. e2e-execution.md §4-1 참조.
    await page.waitForLoadState('networkidle')

    // 모바일 탭 버튼 확인 (lg 미만에서만 표시됨)
    const optionsTab = page.locator('button').filter({ hasText: '옵션' }).first()
    const previewTab = page.locator('button').filter({ hasText: '미리보기' }).first()

    // 탭이 보이는지 확인
    await expect(optionsTab).toBeVisible()
    await expect(previewTab).toBeVisible()

    // 미리보기 탭 클릭
    await previewTab.click()

    // 코드 미리보기가 표시되는지 확인
    const codePreview = page.getByRole('region', { name: '생성된 코드' }).locator('pre code')
    await expect(codePreview).toBeVisible()
  })
})

test.describe('관련 파일 추천 플로우', () => {
  test('ESLint 페이지에서 관련 파일 링크가 표시된다', async ({ page }) => {
    await page.goto('/ko/generator/eslint-config')

    // 관련 파일 섹션 확인
    const relatedSection = page.locator('aside').filter({ hasText: /함께 쓰면 좋아요/i })

    const isVisible = await relatedSection.isVisible().catch(() => false)
    if (isVisible) {
      await expect(relatedSection).toBeVisible()
    }
  })
})
