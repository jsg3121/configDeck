/**
 * `?focus` 파라미터 컨텍스트 전달 E2E 테스트 (ADR-0019).
 *
 * 5개 자식 랜딩(`/ai-config/{slug}`) → CTA 클릭 → `/ai-config/generator?focus={slug}` 진입 시
 * 각 슬러그별 비대칭 초기 상태가 올바르게 적용되는지 검증한다.
 *
 * 검증 매트릭스 (한국어/영어 × 5종 슬러그):
 *
 * | slug         | 초기 도구 선택                         | 미리보기 활성 파일              |
 * | ------------ | -------------------------------------- | ------------------------------- |
 * | agents-md    | cursor + copilot + claude-code + codex | AGENTS.md                       |
 * | cursor       | cursor 단일                            | .cursor/rules/core.mdc          |
 * | copilot      | copilot 단일                           | .github/copilot-instructions.md |
 * | claude-code  | claude-code 단일                       | CLAUDE.md                       |
 * | agent-skills | (기본값 cursor 유지)                   | (검증 제외 — 아래 주석 참조)    |
 *
 * `agent-skills`는 Step 2(Skills) 아코디언이 펼쳐진 상태로 진입하는 것까지가 SPEC §3.3의 보장 범위다.
 * SkillCard 카드 노출만 별도 케이스로 검증한다.
 */
import { expect, test, type Page } from '@playwright/test'

type FocusSlug = 'agents-md' | 'cursor' | 'copilot' | 'claude-code' | 'agent-skills'
type Locale = 'ko' | 'en'

const TOOL_DISPLAY_NAMES: Record<'cursor' | 'copilot' | 'claude-code' | 'codex', string> = {
  cursor: 'Cursor',
  copilot: 'GitHub Copilot',
  'claude-code': 'Claude Code',
  codex: 'OpenAI Codex',
}

const CTA_BUTTON_TEXT: Record<Locale, string> = {
  ko: 'AI 설정 생성기 시작하기',
  en: 'Open AI Config Generator',
}

/**
 * Step 1 도구 선택 fieldset의 legend 텍스트.
 * "Claude Code"는 도구 칩과 "Claude Code만 단독으로 사용합니다" 토글에 동시 등장하므로,
 * fieldset 영역으로 스코프를 좁혀 strict mode 충돌을 피한다.
 */
const STEP1_LEGEND: Record<Locale, string> = {
  ko: '사용 중인 AI 코딩 도구를 모두 선택하세요',
  en: 'Select all the AI coding tools you use',
}

/**
 * 슬러그별 초기 미리보기 활성 파일.
 *
 * `agent-skills`는 SPEC §3.3 매핑 표상 "도구 선택은 기본값 유지 + Step 2 Skills 펼침"만 보장한다.
 * 미리보기 활성 파일은 사용자가 Skills 카드를 체크해야 SKILL.md가 생성·활성화되므로,
 * 진입 직후 자동 활성화되지 않는 것이 정상 동작이다. 따라서 활성 파일 검증에서 제외한다.
 */
const FOCUS_INITIAL_FILE: Partial<Record<FocusSlug, string>> = {
  'agents-md': 'AGENTS.md',
  cursor: '.cursor/rules/core.mdc',
  copilot: '.github/copilot-instructions.md',
  'claude-code': 'CLAUDE.md',
}

const FOCUS_EXPECTED_TOOLS: Record<FocusSlug, ReadonlyArray<keyof typeof TOOL_DISPLAY_NAMES>> = {
  'agents-md': ['cursor', 'copilot', 'claude-code', 'codex'],
  cursor: ['cursor'],
  copilot: ['copilot'],
  'claude-code': ['claude-code'],
  'agent-skills': ['cursor'],
}

const enterGeneratorViaLandingCta = async (
  page: Page,
  locale: Locale,
  slug: FocusSlug,
): Promise<void> => {
  await page.goto(`/${locale}/ai-config/${slug}`)
  await page.waitForLoadState('networkidle')

  const cta = page.locator('a').filter({ hasText: CTA_BUTTON_TEXT[locale] }).first()
  await expect(cta).toBeVisible()
  await cta.click()

  await expect(page).toHaveURL(new RegExp(`/${locale}/ai-config/generator\\?focus=${slug}`))
  await page.waitForLoadState('networkidle')

  // Svelte 아일랜드(client:load) hydration이 완료되어 ?focus 매핑이 적용될 때까지 대기.
  // SSR HTML은 항상 cursor 단일 + AGENTS.md(files[0])로 렌더링되므로,
  // hydration이 끝나기 전 검증을 시작하면 매핑값과 SSR 기본값을 혼동한다.
  // 도구 선택 영역(role=checkbox)이 인터랙티브하게 노출될 때까지 기다린다.
  // e2e-execution.md §4-1 참조.
  await expect(page.getByRole('checkbox', { name: 'Cursor' })).toBeVisible()
}

const expectToolSelectionState = async (
  page: Page,
  locale: Locale,
  expectedSelected: ReadonlyArray<keyof typeof TOOL_DISPLAY_NAMES>,
): Promise<void> => {
  // Step 1 fieldset(legend로 식별)으로 스코프를 좁힌다.
  // "Claude Code"는 도구 칩과 "Claude Code만 단독으로 사용합니다" 단독 사용 토글 양쪽에 등장하므로,
  // 페이지 전체에서 role=checkbox로 매칭하면 strict mode violation이 발생한다.
  const toolFieldset = page.getByRole('group', { name: STEP1_LEGEND[locale] })
  const allTools = Object.keys(TOOL_DISPLAY_NAMES) as Array<keyof typeof TOOL_DISPLAY_NAMES>
  for (const id of allTools) {
    const button = toolFieldset.getByRole('checkbox', { name: TOOL_DISPLAY_NAMES[id], exact: true })
    await expect(button).toBeVisible()
    const shouldBeSelected = expectedSelected.includes(id)
    await expect(button).toHaveAttribute('aria-checked', shouldBeSelected ? 'true' : 'false')
  }
}

const expectActivePreviewFile = async (page: Page, expectedPath: string): Promise<void> => {
  // 미리보기 패널 헤더의 활성 파일 경로 표시.
  // AiConfigOutputPanel의 <h3 class="font-mono ..."> 안에 활성 파일 경로가 텍스트로 노출된다.
  // 페이지에는 SkillCard의 font-mono span도 다수 있으나, h3.font-mono는 미리보기 헤더 단 1곳이다.
  // hydration + focusSignal effect 적용까지 시간이 걸릴 수 있으므로 toHaveText 자동 재시도(기본 5초)에 의존.
  const activeFileHeading = page.locator('h3.font-mono').first()
  await expect(activeFileHeading).toHaveText(expectedPath)
}

test.describe('?focus 파라미터 컨텍스트 전달 (ADR-0019)', () => {
  for (const locale of ['ko', 'en'] as const) {
    test.describe(`locale=${locale}`, () => {
      const slugs: FocusSlug[] = ['agents-md', 'cursor', 'copilot', 'claude-code', 'agent-skills']

      for (const slug of slugs) {
        test(`focus=${slug} — 도구 선택과 미리보기 활성 파일이 매핑대로 초기화된다`, async ({
          page,
        }) => {
          await enterGeneratorViaLandingCta(page, locale, slug)
          await expectToolSelectionState(page, locale, FOCUS_EXPECTED_TOOLS[slug])

          // agent-skills는 미리보기 자동 활성화가 SPEC상 보장되지 않는다(매핑 표 주석 참조).
          // 매핑이 정의된 슬러그에 한해서만 미리보기 헤더 텍스트를 검증한다.
          const expectedPath = FOCUS_INITIAL_FILE[slug]
          if (expectedPath) {
            await expectActivePreviewFile(page, expectedPath)
          }
        })
      }

      test('focus=agent-skills — Step 2 Skills 아코디언이 펼쳐진 상태로 진입한다', async ({
        page,
      }) => {
        await enterGeneratorViaLandingCta(page, locale, 'agent-skills')

        // Skills 카탈로그가 펼쳐졌을 때만 노출되는 SkillCard의 ID 라벨(font-mono span)로 검증.
        // SkillCard는 <span class="font-mono">{id}</span>로 P0 8종(commit, pr-create 등)을 표시한다.
        // 닫힌 아코디언에서는 카드가 렌더되지 않으므로 가시성만 확인하면 충분하다.
        const commitSkillLabel = page
          .locator('span.font-mono')
          .filter({ hasText: 'commit' })
          .first()
        await expect(commitSkillLabel).toBeVisible()
      })
    })
  }

  test('잘못된 focus 값은 무시되고 기본 상태(cursor 단일 + AGENTS.md 등 기본 파일)로 폴백한다', async ({
    page,
  }) => {
    await page.goto('/ko/ai-config/generator?focus=invalid-slug')
    await page.waitForLoadState('networkidle')

    // 도구 선택은 기본값(cursor 단일)
    await expectToolSelectionState(page, 'ko', ['cursor'])
  })
})
