<script lang="ts">
  import { BEST_PRACTICES_CATALOG } from '@/lib/data/aiConfig'
  import type {
    AiConfigStackSlug,
    AppliesTo,
    BestPracticeCategory,
    BestPracticeItem,
  } from '@/types/aiConfig'

  interface Props {
    stack: AiConfigStackSlug
    selectedIds: ReadonlySet<string>
    additionalNotes: string
    onToggleId: (id: string) => void
    onChangeNotes: (text: string) => void
  }

  const { stack, selectedIds, additionalNotes, onToggleId, onChangeNotes }: Props = $props()

  // boundaries 카테고리는 Step 3에서 별도 처리 (SPEC-0005-design.md §3.3)
  const TAB_CATEGORIES: readonly { id: BestPracticeCategory; label: string }[] = [
    { id: 'commands', label: 'Commands' },
    { id: 'testing', label: 'Testing' },
    { id: 'project-structure', label: 'Project Structure' },
    { id: 'code-style', label: 'Code Style' },
    { id: 'git-workflow', label: 'Git Workflow' },
  ]

  // 스택 → 적용 마커 변환 (TypeScript는 모든 스택에서 사용 중이므로 항상 포함)
  const stackMarkers = $derived<readonly AppliesTo[]>([stack, 'typescript', 'tailwind'])

  function matchesStack(item: BestPracticeItem): boolean {
    if (item.appliesTo.includes('all')) return true
    return stackMarkers.some((marker) => item.appliesTo.includes(marker))
  }

  let activeTab = $state<BestPracticeCategory>('commands')

  const itemsByCategory = $derived<Record<BestPracticeCategory, readonly BestPracticeItem[]>>(
    (() => {
      const map: Record<string, BestPracticeItem[]> = {}
      for (const item of BEST_PRACTICES_CATALOG) {
        if (item.category === 'boundaries') continue
        if (!matchesStack(item)) continue
        const bucket = map[item.category] ?? []
        bucket.push(item)
        map[item.category] = bucket
      }
      return map as Record<BestPracticeCategory, readonly BestPracticeItem[]>
    })()
  )

  const activeItems = $derived(itemsByCategory[activeTab] ?? [])
</script>

<div class="flex flex-col gap-3">
  <!-- 카테고리 탭 -->
  <div role="tablist" aria-label="베스트 프랙티스 카테고리" class="flex flex-wrap gap-1 border-b border-border">
    {#each TAB_CATEGORIES as tab (tab.id)}
      {@const isActive = tab.id === activeTab}
      {@const count = (itemsByCategory[tab.id] ?? []).length}
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        onclick={() => (activeTab = tab.id)}
        class="rounded-t-md border-b-2 px-3 py-1.5 text-xs font-medium transition-colors {isActive
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-800'}"
      >
        {tab.label}
        {#if count > 0}
          <span class="ml-1 text-[10px] text-gray-400">({count})</span>
        {/if}
      </button>
    {/each}
  </div>

  <!-- 활성 탭 항목 -->
  {#if activeItems.length === 0}
    <p class="rounded border border-dashed border-border bg-gray-50 p-4 text-sm text-gray-500">
      이 카테고리에 해당하는 항목이 없습니다.
    </p>
  {:else}
    <ul class="flex flex-col gap-2">
      {#each activeItems as item (item.id)}
        <li>
          <label class="flex cursor-pointer items-start gap-2 rounded p-2 text-sm text-gray-800 hover:bg-gray-50">
            <input
              type="checkbox"
              class="mt-0.5"
              checked={selectedIds.has(item.id)}
              onchange={() => onToggleId(item.id)}
            />
            <span>{item.label}</span>
          </label>
        </li>
      {/each}
    </ul>
  {/if}

  <!-- Additional Notes (CP-1 자유 텍스트) -->
  <div class="flex flex-col gap-1">
    <label for="ai-config-additional-notes" class="text-xs font-medium text-gray-700">
      추가 지시사항 (Additional Notes)
    </label>
    <textarea
      id="ai-config-additional-notes"
      value={additionalNotes}
      oninput={(e) => onChangeNotes(e.currentTarget.value)}
      placeholder="팀 컨벤션이나 추가 지시사항을 자유롭게 작성하세요. 영문 입력 권장 (AI 정확도 향상)."
      rows="3"
      class="max-h-32 resize-y rounded border border-border bg-white px-2 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    ></textarea>
  </div>
</div>
