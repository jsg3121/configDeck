<script lang="ts">
  import { getTranslation, type Locale } from '@/i18n'
  import { SvelteSet } from 'svelte/reactivity'

  import { BEST_PRACTICES_CATALOG } from '@/lib/data/aiConfig'
  import type { BestPracticeCategory, BestPracticeItem } from '@/types/aiConfig'

  interface Props {
    locale: Locale
    selectedIds: ReadonlySet<string>
    additionalNotes: string
    onToggleId: (id: string) => void
    onChangeNotes: (text: string) => void
  }

  const { locale, selectedIds, additionalNotes, onToggleId, onChangeNotes }: Props = $props()

  const t = (key: string) => getTranslation(locale, `aiConfig.step3.${key}`)
  const tCategory = (id: BestPracticeCategory) =>
    getTranslation(locale, `aiConfig.step3.categories.${id}`)

  // boundaries 카테고리는 별도 단계(Boundaries)에서 처리하므로 제외한다.
  const ACCORDION_CATEGORIES: readonly BestPracticeCategory[] = [
    'commands',
    'testing',
    'project-structure',
    'code-style',
    'git-workflow',
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

  function selectedCount(items: readonly BestPracticeItem[]): number {
    return items.reduce((acc, item) => acc + (selectedIds.has(item.id) ? 1 : 0), 0)
  }
</script>

<div class="flex flex-col gap-3">
  <p class="text-xs text-gray-500">{t('intro')}</p>

  <ul class="flex flex-col rounded-lg border border-border bg-white">
    {#each ACCORDION_CATEGORIES as category, idx (category)}
      {@const items = itemsByCategory[category] ?? []}
      {@const isOpen = openSections.has(category)}
      {@const count = selectedCount(items)}
      <li class={idx === 0 ? '' : 'border-t border-border'}>
        <button
          type="button"
          aria-expanded={isOpen}
          onclick={() => toggleSection(category)}
          class="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
        >
          <span class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-900">{tCategory(category)}</span>
            <span class="text-xs text-gray-400">({items.length}{t('itemCountSuffix')})</span>
          </span>
          <span class="flex items-center gap-2 text-xs">
            {#if count > 0}
              <span class="rounded-full bg-primary/10 px-2 py-0.5 text-primary"
                >{t('selectedCountPrefix')} {count}</span
              >
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
                  <span class="font-medium"
                    >{getTranslation(locale, `aiConfig.bestPractices.${item.id}`)}</span
                  >
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
      {t('additionalNotesLabel')}
    </label>
    <textarea
      id="ai-config-additional-notes"
      value={additionalNotes}
      oninput={(e) => onChangeNotes(e.currentTarget.value)}
      placeholder={t('additionalNotesPlaceholder')}
      rows="3"
      class="max-h-32 resize-y rounded border border-border bg-white px-2 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    ></textarea>
  </div>
</div>
