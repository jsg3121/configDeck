<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity'

  import { BEST_PRACTICES_CATALOG } from '@/lib/data/aiConfig'
  import type { BestPracticeCategory, BestPracticeItem } from '@/types/aiConfig'

  interface Props {
    selectedIds: ReadonlySet<string>
    additionalNotes: string
    onToggleId: (id: string) => void
    onChangeNotes: (text: string) => void
  }

  const { selectedIds, additionalNotes, onToggleId, onChangeNotes }: Props = $props()

  // boundaries 카테고리는 별도 단계(Boundaries)에서 처리하므로 제외한다.
  const ACCORDION_SECTIONS: readonly { id: BestPracticeCategory; label: string }[] = [
    { id: 'commands', label: 'Commands' },
    { id: 'testing', label: 'Testing' },
    { id: 'project-structure', label: 'Project Structure' },
    { id: 'code-style', label: 'Code Style' },
    { id: 'git-workflow', label: 'Git Workflow' },
  ]

  // 카테고리별로 카탈로그를 그룹핑 (스택 필터링 없이 모든 항목 노출)
  const itemsByCategory = $derived<Record<BestPracticeCategory, readonly BestPracticeItem[]>>(
    (() => {
      const map: Record<string, BestPracticeItem[]> = {}
      for (const item of BEST_PRACTICES_CATALOG) {
        if (item.category === 'boundaries') continue
        const bucket = map[item.category] ?? []
        bucket.push(item)
        map[item.category] = bucket
      }
      return map as Record<BestPracticeCategory, readonly BestPracticeItem[]>
    })(),
  )

  // 아코디언 펼침 상태 — 첫 카테고리(commands)만 기본 펼침
  const openSections = new SvelteSet<BestPracticeCategory>(['commands'])

  function toggleSection(id: BestPracticeCategory) {
    if (openSections.has(id)) openSections.delete(id)
    else openSections.add(id)
  }

  // 카테고리 내 선택된 항목 수
  function selectedCount(items: readonly BestPracticeItem[]): number {
    return items.reduce((acc, item) => acc + (selectedIds.has(item.id) ? 1 : 0), 0)
  }
</script>

<div class="flex flex-col gap-3">
  <p class="text-xs text-gray-500">
    카테고리를 펼쳐 적용할 항목을 선택하세요. 스택과 무관한 모든 항목이 노출됩니다.
  </p>

  <ul class="flex flex-col rounded-lg border border-border bg-white">
    {#each ACCORDION_SECTIONS as section, idx (section.id)}
      {@const items = itemsByCategory[section.id] ?? []}
      {@const isOpen = openSections.has(section.id)}
      {@const count = selectedCount(items)}
      <li class={idx === 0 ? '' : 'border-t border-border'}>
        <button
          type="button"
          aria-expanded={isOpen}
          onclick={() => toggleSection(section.id)}
          class="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
        >
          <span class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-900">{section.label}</span>
            <span class="text-xs text-gray-400">({items.length}개)</span>
          </span>
          <span class="flex items-center gap-2 text-xs">
            {#if count > 0}
              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-primary">선택 {count}</span>
            {/if}
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-5 text-gray-500 transition-transform duration-150 {isOpen
                ? 'rotate-180'
                : ''}"
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </span>
        </button>
        {#if isOpen}
          <ul class="flex flex-col gap-2 border-t border-border bg-gray-50 px-4 py-3">
            {#each items as item (item.id)}
              <li>
                <label
                  class="flex cursor-pointer items-start gap-2 rounded p-2 text-sm text-gray-800 hover:bg-white"
                >
                  <input
                    type="checkbox"
                    class="mt-0.5"
                    checked={selectedIds.has(item.id)}
                    onchange={() => onToggleId(item.id)}
                  />
                  <span class="flex flex-col gap-0.5">
                    <span class="font-medium">{item.label}</span>
                    <span class="font-mono text-[11px] leading-relaxed text-gray-500">
                      {item.outputText}
                    </span>
                  </span>
                </label>
              </li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>

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
