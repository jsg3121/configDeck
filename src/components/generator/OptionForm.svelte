<script lang="ts">
  /**
   * 옵션 섹션 목록을 받아 각 컨트롤 타입에 맞는 서브컴포넌트를 렌더링하는 디스패처.
   * tier 기반 core/advanced 분리, "전체 옵션 보기" 토글, 옵션 검색(Ctrl+K)을 지원한다.
   */
  import type { OptionControl, OptionSection } from '@/types/generator'

  import {
    getAdvancedCount,
    getControlValue as getControlValueFromModule,
    isAdvancedOption,
    scrollToOptionAndHighlight,
    searchOptions,
  } from './modules/optionFormLogic'
  import OptionControlRenderer from './OptionControlRenderer.svelte'
  import OptionSearchModal from './OptionSearchModal.svelte'

  interface Props {
    sections: OptionSection[]
    values: Record<string, unknown>
    locale: string
    onchange: (key: string, value: unknown) => void
  }

  let { sections, values, locale, onchange }: Props = $props()

  let showAdvanced = $state(false)
  let showSearch = $state(false)
  let searchQuery = $state('')
  let highlightedKey = $state<string | null>(null)

  let totalAdvancedCount = $derived(
    sections.reduce((sum, section) => sum + getAdvancedCount(section), 0),
  )

  let searchResults = $derived(searchOptions(sections, searchQuery, locale))

  const getSectionTitle = (section: OptionSection): string => {
    return locale === 'ko' ? section.title : section.titleEn
  }

  const getSectionDescription = (section: OptionSection): string | undefined => {
    return locale === 'ko' ? section.description : section.descriptionEn
  }

  const getControlValue = (control: OptionControl): unknown => {
    return getControlValueFromModule(values, control)
  }

  const handleSearchSelect = (key: string) => {
    showSearch = false
    searchQuery = ''

    if (isAdvancedOption(sections, key) && !showAdvanced) {
      showAdvanced = true
    }

    scrollToOptionAndHighlight(key, (k) => {
      highlightedKey = k
    })
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      showSearch = !showSearch
      if (!showSearch) searchQuery = ''
    }
    if (event.key === 'Escape' && showSearch) {
      showSearch = false
      searchQuery = ''
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if showSearch}
  <OptionSearchModal
    {locale}
    {searchQuery}
    {searchResults}
    onclose={() => (showSearch = false)}
    onquerychange={(q) => (searchQuery = q)}
    onselect={handleSearchSelect}
  />
{/if}

<!-- 검색 버튼 (상단) -->
<div class="flex items-center justify-end pb-4">
  <button
    type="button"
    class="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-gray-500 hover:border-primary hover:text-primary"
    onclick={() => (showSearch = true)}
  >
    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <span>{locale === 'ko' ? '옵션 검색' : 'Search options'}</span>
    <kbd class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400">⌘K</kbd>
  </button>
</div>

<!-- 섹션 렌더링 -->
{#each sections as section (section.titleEn)}
  {@const coreControls = section.controls.filter((c) => c.tier === 'core')}
  {@const advancedControls = section.controls.filter((c) => c.tier === 'advanced')}
  {@const hasCore = coreControls.length > 0}
  {@const hasAdvanced = advancedControls.length > 0}
  {@const isAdvancedOnlySection = !hasCore && hasAdvanced}

  {#if !isAdvancedOnlySection || showAdvanced}
    <div class="border-b border-border py-6">
      <div class="mb-4 flex items-center gap-2">
        <div class="h-px flex-1 bg-border"></div>
        <h3 class="shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {getSectionTitle(section)}
        </h3>
        <div class="h-px flex-1 bg-border"></div>
      </div>
      {#if getSectionDescription(section)}
        <p class="-mt-2 mb-4 text-center text-xs text-gray-400">
          {getSectionDescription(section)}
        </p>
      {/if}

      <!-- Core 옵션 -->
      <div class="flex flex-col gap-4">
        {#each coreControls as control (control.key)}
          <OptionControlRenderer
            {control}
            value={getControlValue(control)}
            {locale}
            highlighted={highlightedKey === control.key}
            {onchange}
          />
        {/each}
      </div>

      <!-- Advanced 옵션 -->
      {#if advancedControls.length > 0 && showAdvanced}
        <div class="mt-4 flex flex-col gap-4 border-t border-dashed border-border pt-4">
          {#each advancedControls as control (control.key)}
            <OptionControlRenderer
              {control}
              value={getControlValue(control)}
              {locale}
              highlighted={highlightedKey === control.key}
              {onchange}
            />
          {/each}
        </div>
      {/if}
    </div>
  {/if}
{/each}

<!-- "전체 옵션 보기" 토글 버튼 -->
{#if totalAdvancedCount > 0}
  <div class="flex items-center justify-between py-4">
    <button
      type="button"
      class="flex items-center gap-2 text-sm text-primary hover:text-primary-hover"
      onclick={() => (showAdvanced = !showAdvanced)}
    >
      <svg
        class="h-4 w-4 transition-transform {showAdvanced ? 'rotate-90' : ''}"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      {#if showAdvanced}
        {locale === 'ko' ? '전체 옵션 숨기기' : 'Hide all options'}
      {:else}
        {locale === 'ko'
          ? `전체 옵션 보기 (${totalAdvancedCount}개)`
          : `Show all options (${totalAdvancedCount})`}
      {/if}
    </button>

    <button
      type="button"
      class="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      onclick={() => (showSearch = true)}
      title="Ctrl+K"
    >
      <svg
        class="h-3.5 w-3.5"
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
      <kbd class="rounded bg-gray-100 px-1 py-0.5 text-[10px]">⌘K</kbd>
    </button>
  </div>
{/if}
