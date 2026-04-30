<script lang="ts">
  import type { BoundaryItem, BoundaryTier } from '@/types/aiConfig'
  import type { CustomBoundaryItem } from './modules/aiConfigGeneratorLogic'

  interface Props {
    tier: BoundaryTier
    title: string
    items: readonly BoundaryItem[]
    selectedIds: ReadonlySet<string>
    customItems: readonly CustomBoundaryItem[]
    onToggle: (id: string) => void
    onAddCustom: (text: string) => void
    onRemoveCustom: (index: number) => void
  }

  const {
    tier,
    title,
    items,
    selectedIds,
    customItems,
    onToggle,
    onAddCustom,
    onRemoveCustom,
  }: Props = $props()

  // tier별 색상/이모지
  const TIER_STYLES: Record<BoundaryTier, { bg: string; ring: string; text: string; emoji: string }> = {
    'always-do': { bg: 'bg-green-50', ring: 'ring-green-200', text: 'text-green-900', emoji: '✅' },
    'ask-first': { bg: 'bg-amber-50', ring: 'ring-amber-200', text: 'text-amber-900', emoji: '⚠️' },
    'never-do': { bg: 'bg-red-50', ring: 'ring-red-200', text: 'text-red-900', emoji: '🚫' },
  }
  const style = TIER_STYLES[tier]

  let inputOpen = $state(false)
  let inputText = $state('')

  function commitCustom() {
    const trimmed = inputText.trim()
    if (trimmed.length === 0) return
    onAddCustom(trimmed)
    inputText = ''
    inputOpen = false
  }

  function cancelCustom() {
    inputText = ''
    inputOpen = false
  }
</script>

<section class="rounded-lg border border-border {style.bg} ring-1 {style.ring} p-4">
  <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold {style.text}">
    <span aria-hidden="true">{style.emoji}</span>
    {title}
  </h3>

  <ul class="flex flex-col gap-2">
    {#each items as item (item.id)}
      <li>
        <label class="flex cursor-pointer items-start gap-2 text-sm text-gray-800">
          <input
            type="checkbox"
            class="mt-0.5"
            checked={selectedIds.has(item.id)}
            onchange={() => onToggle(item.id)}
          />
          <span>{item.label}</span>
        </label>
      </li>
    {/each}
    {#each customItems as custom, idx (idx)}
      <li class="flex items-start gap-2 text-sm text-gray-800">
        <span class="mt-0.5 inline-block size-4 rounded border border-gray-400 bg-white" aria-hidden="true">
          ✓
        </span>
        <span class="flex-1">{custom.text}</span>
        <button
          type="button"
          aria-label="직접 입력 항목 삭제"
          onclick={() => onRemoveCustom(idx)}
          class="text-gray-400 hover:text-red-600"
        >
          ×
        </button>
      </li>
    {/each}
  </ul>

  <div class="mt-3">
    {#if inputOpen}
      <div class="flex gap-2">
        <input
          type="text"
          bind:value={inputText}
          placeholder="영문 입력 권장 (AI 정확도 향상)"
          class="flex-1 rounded border border-border bg-white px-2 py-1 text-sm"
          onkeydown={(e) => {
            if (e.key === 'Enter') commitCustom()
            if (e.key === 'Escape') cancelCustom()
          }}
        />
        <button
          type="button"
          onclick={commitCustom}
          class="rounded bg-primary px-3 py-1 text-sm text-white hover:bg-primary/90"
        >
          추가
        </button>
        <button
          type="button"
          onclick={cancelCustom}
          class="rounded border border-border bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    {:else}
      <button
        type="button"
        onclick={() => (inputOpen = true)}
        class="text-xs font-medium text-primary hover:underline"
      >
        + 항목 직접 추가
      </button>
    {/if}
  </div>
</section>
