<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity'

  import type { AiConfigInput, AiConfigStackSlug, AiToolId, SkillId } from '@/types/aiConfig'

  import AiConfigBestPractices from './AiConfigBestPractices.svelte'
  import AiConfigBoundaries from './AiConfigBoundaries.svelte'
  import AiConfigOutputPanel from './AiConfigOutputPanel.svelte'
  import AiConfigStackSelector from './AiConfigStackSelector.svelte'
  import AiConfigToolsAndSkills from './AiConfigToolsAndSkills.svelte'
  import {
    buildAdditionalNotesWithCustomBoundaries,
    splitBoundariesByTier,
    type CustomBoundaryItem,
  } from './modules/aiConfigGeneratorLogic'

  interface Props {
    locale: 'ko' | 'en'
  }

  const { locale }: Props = $props()

  // ---- 상태 ----
  let stack = $state<AiConfigStackSlug>('react-vite-ts')
  const bestPracticeIds = new SvelteSet<string>()
  let additionalNotes = $state<string>('')
  const boundaryIds = new SvelteSet<string>()
  let customBoundaryItems = $state<CustomBoundaryItem[]>([])
  // CP-3: 초기 도구는 cursor만 미리 체크
  const enabledTools = new SvelteSet<AiToolId>(['cursor'])
  let claudeCodeOnly = $state<boolean>(false)
  const selectedSkillIds = new SvelteSet<SkillId>()

  // ---- 통합 입력 모델 (output panel에 전달) ----
  const input = $derived<AiConfigInput>({
    stack: { stack },
    bestPractices: {
      selectedIds: Array.from(bestPracticeIds),
      additionalNotes: buildAdditionalNotesWithCustomBoundaries(
        additionalNotes,
        customBoundaryItems,
      ),
    },
    boundaries: splitBoundariesByTier(boundaryIds),
    tools: {
      enabledTools: Array.from(enabledTools),
      claudeCodeOnly,
    },
    selectedSkillIds: Array.from(selectedSkillIds),
    locale,
  })

  // 출력 가능 조건: 스택 + 도구 1개 이상
  const ready = $derived(enabledTools.size > 0)

  // ---- 핸들러: SvelteSet은 mutable — add/delete로 직접 갱신한다 ----
  function toggleInSet<T>(set: SvelteSet<T>, value: T): void {
    if (set.has(value)) set.delete(value)
    else set.add(value)
  }

  function handleStackChange(slug: AiConfigStackSlug) {
    stack = slug
  }

  function handleToggleBestPractice(id: string) {
    toggleInSet(bestPracticeIds, id)
  }

  function handleChangeNotes(text: string) {
    additionalNotes = text
  }

  function handleToggleBoundary(id: string) {
    toggleInSet(boundaryIds, id)
  }

  function handleAddCustomBoundary(item: CustomBoundaryItem) {
    customBoundaryItems = [...customBoundaryItems, item]
  }

  function handleRemoveCustomBoundary(index: number) {
    customBoundaryItems = customBoundaryItems.filter((_, i) => i !== index)
  }

  function handleToggleTool(id: AiToolId) {
    toggleInSet(enabledTools, id)
    // claudeCodeOnly 토글이 켜진 상태에서 Claude Code가 빠지면 토글도 해제
    if (claudeCodeOnly && !enabledTools.has('claude-code')) {
      claudeCodeOnly = false
    }
  }

  function handleToggleClaudeCodeOnly(next: boolean) {
    claudeCodeOnly = next
    if (next) {
      // Claude Code 단독 사용 시 다른 도구 자동 해제
      enabledTools.clear()
      enabledTools.add('claude-code')
    }
  }

  function handleToggleSkill(id: SkillId) {
    toggleInSet(selectedSkillIds, id)
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
  }

  function handleDeselectAllSkills() {
    selectedSkillIds.clear()
  }
</script>

<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
  <!-- 좌측 입력 패널 -->
  <section class="flex w-full flex-col gap-6 lg:w-md lg:max-w-md">
    <div class="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
      <h2 class="text-sm font-semibold text-gray-900">Step 1 · 스택 선택</h2>
      <AiConfigStackSelector value={stack} onChange={handleStackChange} />
    </div>

    <div class="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
      <h2 class="text-sm font-semibold text-gray-900">Step 2 · Best Practices</h2>
      <AiConfigBestPractices
        {stack}
        selectedIds={bestPracticeIds}
        {additionalNotes}
        onToggleId={handleToggleBestPractice}
        onChangeNotes={handleChangeNotes}
      />
    </div>

    <div class="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
      <h2 class="text-sm font-semibold text-gray-900">Step 3 · Boundaries</h2>
      <AiConfigBoundaries
        {stack}
        selectedIds={boundaryIds}
        customItems={customBoundaryItems}
        onToggleId={handleToggleBoundary}
        onAddCustom={handleAddCustomBoundary}
        onRemoveCustom={handleRemoveCustomBoundary}
      />
    </div>

    <div class="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
      <h2 class="text-sm font-semibold text-gray-900">Step 4 · 도구 + Skills</h2>
      <AiConfigToolsAndSkills
        {enabledTools}
        {claudeCodeOnly}
        {selectedSkillIds}
        onToggleTool={handleToggleTool}
        onToggleClaudeCodeOnly={handleToggleClaudeCodeOnly}
        onToggleSkill={handleToggleSkill}
        onSelectAllSkills={handleSelectAllSkills}
        onDeselectAllSkills={handleDeselectAllSkills}
      />
    </div>
  </section>

  <!-- 우측 출력 패널 -->
  <section class="min-h-96 min-w-0 flex-1 lg:sticky lg:top-4">
    <AiConfigOutputPanel {input} {ready} />
  </section>
</div>
