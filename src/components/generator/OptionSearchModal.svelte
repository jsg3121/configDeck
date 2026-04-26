<script lang="ts">
  /**
   * 옵션 검색 모달 컴포넌트.
   * Ctrl+K / Cmd+K 단축키로 토글되며, 옵션 이름이나 설명으로 검색할 수 있다.
   */
  import type { OptionControl } from '@/types/generator'

  interface SearchResult {
    control: OptionControl
    sectionTitle: string
  }

  interface Props {
    locale: string
    searchQuery: string
    searchResults: SearchResult[]
    onclose: () => void
    onquerychange: (query: string) => void
    onselect: (key: string) => void
  }

  let { locale, searchQuery, searchResults, onclose, onquerychange, onselect }: Props = $props()

  let searchInputRef = $state<HTMLInputElement | null>(null)

  $effect(() => {
    if (searchInputRef) {
      searchInputRef.focus()
    }
  })

  const handleClose = () => {
    onquerychange('')
    onclose()
  }
</script>

<div class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
  <!-- 백드롭 -->
  <button
    type="button"
    class="fixed inset-0 bg-black/30 backdrop-blur-sm"
    onclick={handleClose}
    aria-label={locale === 'ko' ? '검색 닫기' : 'Close search'}
  ></button>

  <!-- 검색 패널 -->
  <div class="relative z-10 w-full max-w-md rounded-xl border border-border bg-surface shadow-2xl">
    <div class="flex items-center gap-3 border-b border-border px-4 py-3">
      <svg
        class="h-4 w-4 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        bind:this={searchInputRef}
        value={searchQuery}
        oninput={(e) => onquerychange(e.currentTarget.value)}
        placeholder={locale === 'ko'
          ? '옵션 이름이나 설명으로 검색...'
          : 'Search options by name or description...'}
        class="flex-1 border-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
      />
      <button
        type="button"
        class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
        onclick={handleClose}
        aria-label={locale === 'ko' ? '검색 닫기' : 'Close search'}
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {#if searchResults.length > 0}
      <ul class="max-h-60 overflow-y-auto py-2">
        {#each searchResults as result (result.control.key)}
          <li>
            <button
              type="button"
              class="flex w-full flex-col gap-0.5 px-4 py-2 text-left hover:bg-primary/5"
              onclick={() => onselect(result.control.key)}
            >
              <span class="text-sm text-gray-800">
                {locale === 'ko' ? result.control.label : result.control.labelEn}
              </span>
              <span class="text-xs text-gray-400">
                {result.sectionTitle} · {result.control.key}
              </span>
            </button>
          </li>
        {/each}
      </ul>
    {:else if searchQuery.trim().length >= 2}
      <p class="px-4 py-6 text-center text-sm text-gray-400">
        {locale === 'ko' ? '결과 없음' : 'No results'}
      </p>
    {/if}
  </div>
</div>
