<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity'

  import type { AiConfigInput, AiToolId, SkillId } from '@/types/aiConfig'

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

  interface Props {
    locale: 'ko' | 'en'
  }

  const { locale }: Props = $props()

  // ---- 상태 ----
  // Step 1: 도구 (초기값 cursor만 미리 체크)
  const enabledTools = new SvelteSet<AiToolId>(['cursor'])
  let claudeCodeOnly = $state<boolean>(false)
  // Step 2: Skills
  const selectedSkillIds = new SvelteSet<SkillId>()
  // Step 3: Best Practices
  const bestPracticeIds = new SvelteSet<string>()
  let additionalNotes = $state<string>('')
  // Step 4: Boundaries
  const boundaryIds = new SvelteSet<string>()
  let customBoundaryItems = $state<CustomBoundaryItem[]>([])

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
        customBoundaryItems
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
  }

  function handleToggleClaudeCodeOnly(next: boolean) {
    claudeCodeOnly = next
    if (next) {
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
</script>

<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
  <!-- 좌측 입력 패널 -->
  <section class="flex w-full flex-col gap-6 lg:w-md lg:max-w-md">
    <div class="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
      <h2 class="text-sm font-semibold text-gray-900">Step 1 · 사용 도구 선택</h2>
      <AiConfigTools
        {enabledTools}
        {claudeCodeOnly}
        onToggleTool={handleToggleTool}
        onToggleClaudeCodeOnly={handleToggleClaudeCodeOnly}
      />
    </div>

    <div class="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
      <h2 class="text-sm font-semibold text-gray-900">Step 2 · Agent Skills</h2>
      <AiConfigSkills
        {selectedSkillIds}
        onToggleSkill={handleToggleSkill}
        onSelectAllSkills={handleSelectAllSkills}
        onDeselectAllSkills={handleDeselectAllSkills}
      />
    </div>

    <div class="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
      <h2 class="text-sm font-semibold text-gray-900">Step 3 · Best Practices</h2>
      <AiConfigBestPractices
        selectedIds={bestPracticeIds}
        {additionalNotes}
        onToggleId={handleToggleBestPractice}
        onChangeNotes={handleChangeNotes}
      />
    </div>

    <div class="flex flex-col gap-2 rounded-lg border border-border bg-white p-4">
      <h2 class="text-sm font-semibold text-gray-900">Step 4 · Boundaries</h2>
      <AiConfigBoundaries
        selectedIds={boundaryIds}
        customItems={customBoundaryItems}
        onToggleId={handleToggleBoundary}
        onAddCustom={handleAddCustomBoundary}
        onRemoveCustom={handleRemoveCustomBoundary}
      />
    </div>
  </section>

  <!-- 우측 출력 패널 -->
  <section class="min-h-96 min-w-0 flex-1 lg:sticky lg:top-4">
    <AiConfigOutputPanel {input} {ready} />
  </section>
</div>
