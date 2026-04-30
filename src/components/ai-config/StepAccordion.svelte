<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    /** Step 번호 (1, 2, 3, 4) */
    step: number
    /** Step 제목 */
    title: string
    /** 펼침 상태 */
    open: boolean
    /** 헤더 우측에 노출할 진행 상태 텍스트 (예: "선택 3", "Cursor, Claude Code") */
    summary?: string
    /** 토글 콜백 */
    onToggle: () => void
    children: Snippet
  }

  const { step, title, open, summary, onToggle, children }: Props = $props()
</script>

<div class="overflow-hidden rounded-lg border border-border bg-white">
  <button
    type="button"
    aria-expanded={open}
    onclick={onToggle}
    class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
  >
    <span class="flex items-center gap-2">
      <span
        class="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
      >
        {step}
      </span>
      <span class="text-sm font-semibold text-gray-900">{title}</span>
    </span>
    <span class="flex items-center gap-2">
      {#if summary}
        <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {summary}
        </span>
      {/if}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-5 text-gray-500 transition-transform duration-150 {open ? 'rotate-180' : ''}"
      >
        <path d="M5 8l5 5 5-5" />
      </svg>
    </span>
  </button>
  {#if open}
    <div class="border-t border-border p-4">
      {@render children()}
    </div>
  {/if}
</div>
