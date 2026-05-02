<script lang="ts">
  import { getTranslation, type Locale } from '@/i18n'
  import { SvelteSet } from 'svelte/reactivity'

  import { BEST_PRACTICES_CATALOG } from '@/lib/data/aiConfig'
  import type { AiConfigInput, AiToolId, BestPracticeCategory, SkillId } from '@/types/aiConfig'

  import AiConfigBestPractices from './AiConfigBestPractices.svelte'
  import AiConfigBoundaries from './AiConfigBoundaries.svelte'
  import AiConfigOutputPanel from './AiConfigOutputPanel.svelte'
  import AiConfigSkills from './AiConfigSkills.svelte'
  import AiConfigTools from './AiConfigTools.svelte'
  import {
    buildAdditionalNotesWithCustomBoundaries,
    splitBoundariesByTier,
    type CustomBoundaryItem,
  } from './modules/aiConfigGeneratorLogic'
  import StepAccordion from './StepAccordion.svelte'

  interface Props {
    locale: Locale
  }

  const { locale }: Props = $props()

  const t = (key: string) => getTranslation(locale, `aiConfig.${key}`)

  // ---- ?focus 파라미터 슬러그 (ADR-0019) ----
  // 자식 랜딩 → /ai-config/generator?focus={slug} 진입 시 컨텍스트 초기화에 사용.
  // 유효 값: agents-md / cursor / copilot / claude-code / agent-skills.
  // 유효하지 않으면 기본 상태(Cursor 단일 선택)로 폴백한다.
  type FocusSlug = 'agents-md' | 'cursor' | 'copilot' | 'claude-code' | 'agent-skills'
  const VALID_FOCUS: ReadonlySet<FocusSlug> = new Set([
    'agents-md',
    'cursor',
    'copilot',
    'claude-code',
    'agent-skills',
  ])

  function readFocusFromUrl(): FocusSlug | null {
    if (typeof window === 'undefined') return null
    const raw = new URLSearchParams(window.location.search).get('focus')
    if (raw && (VALID_FOCUS as ReadonlySet<string>).has(raw)) {
      return raw as FocusSlug
    }
    return null
  }

  // ?focus 슬러그별 초기 도구 선택 매핑 (ADR-0019).
  // - agents-md: 4개 도구 모두 선택 (AGENTS.md는 공통 표준)
  // - cursor / copilot: 단일 도구 선택
  // - claude-code: Claude Code 단일 선택 (다른 도구도 사용 시 AGENTS.md 임포트 옵션은 사용자 선택)
  // - agent-skills: 도구 선택은 기본값 유지(cursor)
  function initialToolsForFocus(focus: FocusSlug | null): AiToolId[] {
    switch (focus) {
      case 'agents-md':
        return ['cursor', 'copilot', 'claude-code', 'codex']
      case 'cursor':
        return ['cursor']
      case 'copilot':
        return ['copilot']
      case 'claude-code':
        return ['claude-code']
      case 'agent-skills':
      case null:
      default:
        return ['cursor']
    }
  }

  // ?focus 슬러그별 미리보기 탭 초기 활성화 파일 (ADR-0019).
  function initialFocusPathForSlug(focus: FocusSlug | null): string | null {
    switch (focus) {
      case 'agents-md':
        return 'AGENTS.md'
      case 'cursor':
        return '.cursor/rules/core.mdc'
      case 'copilot':
        return '.github/copilot-instructions.md'
      case 'claude-code':
        return 'CLAUDE.md'
      case 'agent-skills':
        return '.claude/skills/commit/SKILL.md'
      default:
        return null
    }
  }

  const initialFocus = readFocusFromUrl()

  // ---- 상태 ----
  // Step 1: 도구 (초기값은 ?focus 파라미터 매핑을 따름. 없으면 cursor 단일)
  const enabledTools = new SvelteSet<AiToolId>(initialToolsForFocus(initialFocus))
  let claudeCodeOnly = $state<boolean>(false)
  // Step 2: Skills
  const selectedSkillIds = new SvelteSet<SkillId>()
  // Step 3: Best Practices
  const bestPracticeIds = new SvelteSet<string>()
  let additionalNotes = $state<string>('')
  // Step 4: Boundaries
  const boundaryIds = new SvelteSet<string>()
  let customBoundaryItems = $state<CustomBoundaryItem[]>([])

  // ---- Step 2/3/4 외부 아코디언 펼침 상태 (Step 1은 항상 펼침, 기본 모두 닫힘) ----
  // ?focus=agent-skills로 진입 시 Step 2(Skills)를 펼친 상태로 시작 (ADR-0019).
  let openStep2 = $state<boolean>(initialFocus === 'agent-skills')
  let openStep3 = $state<boolean>(false)
  let openStep4 = $state<boolean>(false)

  // ---- 옵션 토글 시 우측 미리보기를 영향 파일로 자동 이동시키기 위한 시그널 ----
  // 객체 래핑으로 같은 경로 연속 토글에도 effect가 트리거되도록 한다.
  // ?focus 파라미터로 진입 시 해당 도구의 대표 파일을 미리 활성화한다 (ADR-0019).
  const initialFocusPath = initialFocusPathForSlug(initialFocus)
  let focusSignal = $state<{ path: string } | null>(
    initialFocusPath ? { path: initialFocusPath } : null,
  )
  function focusFile(path: string) {
    focusSignal = { path }
  }

  // ---- 도구별 영향 파일 매핑 ----
  const TOOL_TARGET_PATH: Readonly<Record<AiToolId, string>> = {
    cursor: '.cursor/rules/core.mdc',
    copilot: '.github/copilot-instructions.md',
    'claude-code': 'CLAUDE.md',
    codex: 'AGENTS.md',
  }

  // ---- BP 카테고리별 영향 파일 매핑 ----
  // - core.mdc(commands/code-style/git-workflow), stack.mdc(testing/project-structure)는 Cursor 사용 시
  // - boundaries 카테고리는 별도 처리됨 (Step 4 영역)
  // - Cursor가 켜져 있지 않으면 AGENTS.md를 폴백으로 사용
  function bestPracticeTargetPath(itemId: string): string {
    const item = BEST_PRACTICES_CATALOG.find((bp) => bp.id === itemId)
    if (!item) return 'AGENTS.md'

    const cursorEnabled = enabledTools.has('cursor')
    if (cursorEnabled) {
      const cat: BestPracticeCategory = item.category
      if (cat === 'commands' || cat === 'code-style' || cat === 'git-workflow') {
        return '.cursor/rules/core.mdc'
      }
      if (cat === 'project-structure' || cat === 'testing') {
        return '.cursor/rules/stack.mdc'
      }
    }
    return 'AGENTS.md'
  }

  // ---- Boundaries 영향 파일 ----
  function boundaryTargetPath(): string {
    return enabledTools.has('cursor') ? '.cursor/rules/boundaries.mdc' : 'AGENTS.md'
  }

  // ---- 통합 입력 모델 ----
  const input = $derived<AiConfigInput>({
    tools: {
      enabledTools: Array.from(enabledTools),
      claudeCodeOnly,
    },
    selectedSkillIds: Array.from(selectedSkillIds),
    bestPractices: {
      selectedIds: Array.from(bestPracticeIds),
      additionalNotes: buildAdditionalNotesWithCustomBoundaries(
        additionalNotes,
        customBoundaryItems,
      ),
    },
    boundaries: splitBoundariesByTier(boundaryIds),
    locale,
  })

  // 출력 가능 조건: 도구 1개 이상
  const ready = $derived(enabledTools.size > 0)

  // ---- 핸들러 ----
  function toggleInSet<T>(set: SvelteSet<T>, value: T): void {
    if (set.has(value)) set.delete(value)
    else set.add(value)
  }

  function handleToggleTool(id: AiToolId) {
    toggleInSet(enabledTools, id)
    if (claudeCodeOnly && !enabledTools.has('claude-code')) {
      claudeCodeOnly = false
    }
    // 토글 후 해당 도구가 켜져 있으면 그 도구의 대표 파일로 이동.
    // 꺼졌다면 AGENTS.md(항상 생성)로 이동.
    if (enabledTools.has(id)) {
      focusFile(TOOL_TARGET_PATH[id])
    } else {
      focusFile('AGENTS.md')
    }
  }

  function handleToggleClaudeCodeOnly(next: boolean) {
    claudeCodeOnly = next
    if (next) {
      enabledTools.clear()
      enabledTools.add('claude-code')
    }
    focusFile('CLAUDE.md')
  }

  function handleToggleSkill(id: SkillId) {
    toggleInSet(selectedSkillIds, id)
    focusFile(`.claude/skills/${id}/SKILL.md`)
  }

  function handleSelectAllSkills() {
    const allIds: readonly SkillId[] = [
      'commit',
      'pr-create',
      'pr-review',
      'test-writer',
      'debug',
      'refactor',
      'adr-create',
      'readme-update',
    ]
    selectedSkillIds.clear()
    for (const id of allIds) selectedSkillIds.add(id)
    // 전체 선택 시 첫 스킬로 이동
    focusFile('.claude/skills/commit/SKILL.md')
  }

  function handleDeselectAllSkills() {
    selectedSkillIds.clear()
    // 모든 스킬 해제 시 AGENTS.md로 폴백
    focusFile('AGENTS.md')
  }

  function handleToggleBestPractice(id: string) {
    toggleInSet(bestPracticeIds, id)
    focusFile(bestPracticeTargetPath(id))
  }

  function handleChangeNotes(text: string) {
    additionalNotes = text
    // Additional Notes는 AGENTS.md/CLAUDE.md/Cursor boundaries.mdc/Copilot 모두에 들어가지만
    // 가장 핵심인 AGENTS.md로 이동
    focusFile('AGENTS.md')
  }

  function handleToggleBoundary(id: string) {
    toggleInSet(boundaryIds, id)
    void id
    focusFile(boundaryTargetPath())
  }

  function handleAddCustomBoundary(item: CustomBoundaryItem) {
    customBoundaryItems = [...customBoundaryItems, item]
    focusFile(boundaryTargetPath())
  }

  function handleRemoveCustomBoundary(index: number) {
    customBoundaryItems = customBoundaryItems.filter((_, i) => i !== index)
    focusFile(boundaryTargetPath())
  }

  // ---- 헤더 우측 요약 텍스트 ----
  const summaryPrefix = $derived(t('summary.selectedPrefix'))
  const skillsSummary = $derived(
    selectedSkillIds.size > 0 ? `${summaryPrefix} ${selectedSkillIds.size}` : '',
  )
  const bestPracticesSummary = $derived(
    bestPracticeIds.size > 0 ? `${summaryPrefix} ${bestPracticeIds.size}` : '',
  )
  const boundariesSummary = $derived(
    (() => {
      const total = boundaryIds.size + customBoundaryItems.length
      return total > 0 ? `${summaryPrefix} ${total}` : ''
    })(),
  )
</script>

<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
  <!-- 좌측 입력 패널 -->
  <section class="flex w-full flex-col gap-1 lg:w-md lg:max-w-md">
    <div class="flex flex-col gap-3 rounded-lg border border-border bg-white p-4">
      <h2 class="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <span
          class="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
        >
          1
        </span>
        {t('step1.title')}
      </h2>
      <AiConfigTools
        {locale}
        {enabledTools}
        {claudeCodeOnly}
        onToggleTool={handleToggleTool}
        onToggleClaudeCodeOnly={handleToggleClaudeCodeOnly}
      />
    </div>

    <StepAccordion
      step={2}
      title={t('step2.title')}
      open={openStep2}
      summary={skillsSummary}
      onToggle={() => (openStep2 = !openStep2)}
    >
      <AiConfigSkills
        {locale}
        {selectedSkillIds}
        onToggleSkill={handleToggleSkill}
        onSelectAllSkills={handleSelectAllSkills}
        onDeselectAllSkills={handleDeselectAllSkills}
      />
    </StepAccordion>

    <StepAccordion
      step={3}
      title={t('step3.title')}
      open={openStep3}
      summary={bestPracticesSummary}
      onToggle={() => (openStep3 = !openStep3)}
    >
      <AiConfigBestPractices
        {locale}
        selectedIds={bestPracticeIds}
        {additionalNotes}
        onToggleId={handleToggleBestPractice}
        onChangeNotes={handleChangeNotes}
      />
    </StepAccordion>

    <StepAccordion
      step={4}
      title={t('step4.title')}
      open={openStep4}
      summary={boundariesSummary}
      onToggle={() => (openStep4 = !openStep4)}
    >
      <AiConfigBoundaries
        {locale}
        selectedIds={boundaryIds}
        customItems={customBoundaryItems}
        onToggleId={handleToggleBoundary}
        onAddCustom={handleAddCustomBoundary}
        onRemoveCustom={handleRemoveCustomBoundary}
      />
    </StepAccordion>
  </section>

  <!-- 우측 출력 패널 -->
  <section class="min-h-96 min-w-0 flex-1 lg:sticky lg:top-4">
    <AiConfigOutputPanel {locale} {input} {ready} {focusSignal} />
  </section>
</div>
