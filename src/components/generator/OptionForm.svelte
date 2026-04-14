<script lang="ts">
  /**
   * 옵션 섹션 목록을 받아 각 컨트롤 타입에 맞는 서브컴포넌트를 렌더링하는 디스패처.
   * tier 기반 core/advanced 분리, "전체 옵션 보기" 토글, 옵션 검색(Ctrl+K)을 지원한다.
   */
  import type { NewOptionSection, OptionControl } from '@/types/generator'

  import CheckboxControl from './controls/CheckboxControl.svelte'
  import KeyValueControl from './controls/KeyValueControl.svelte'
  import NumberControl from './controls/NumberControl.svelte'
  import RadioControl from './controls/RadioControl.svelte'
  import SelectControl from './controls/SelectControl.svelte'
  import TagsControl from './controls/TagsControl.svelte'
  import TextControl from './controls/TextControl.svelte'

  interface Props {
    sections: NewOptionSection[]
    values: Record<string, unknown>
    locale: string
    onchange: (key: string, value: unknown) => void
  }

  let { sections, values, locale, onchange }: Props = $props()

  /** "전체 옵션 보기" 토글 상태 */
  let showAdvanced = $state(false)

  /** 검색 모달 표시 여부 */
  let showSearch = $state(false)

  /** 검색 쿼리 */
  let searchQuery = $state('')

  /** 검색으로 하이라이트할 컨트롤 key */
  let highlightedKey = $state<string | null>(null)

  /** 섹션 내 advanced 옵션 수를 계산한다 */
  const getAdvancedCount = (section: NewOptionSection): number => {
    return section.controls.filter((c) => c.tier === 'advanced').length
  }

  /** 전체 섹션에서 advanced 옵션 총 수를 계산한다 */
  let totalAdvancedCount = $derived(
    sections.reduce((sum, section) => sum + getAdvancedCount(section), 0),
  )

  /** 검색 결과 — 모든 섹션의 컨트롤 중 검색어와 매칭되는 것 */
  let searchResults = $derived(
    searchQuery.trim().length < 2
      ? []
      : sections.flatMap((section) =>
          section.controls
            .filter((control) => {
              const query = searchQuery.toLowerCase()
              return (
                control.key.toLowerCase().includes(query) ||
                control.label.toLowerCase().includes(query) ||
                control.labelEn.toLowerCase().includes(query) ||
                control.description.toLowerCase().includes(query) ||
                control.descriptionEn.toLowerCase().includes(query)
              )
            })
            .map((control) => ({
              control,
              sectionTitle: locale === 'ko' ? section.title : section.titleEn,
            })),
        ),
  )

  /** locale에 따라 섹션 타이틀을 반환한다 */
  const getSectionTitle = (section: NewOptionSection): string => {
    return locale === 'ko' ? section.title : section.titleEn
  }

  /** locale에 따라 섹션 설명을 반환한다 */
  const getSectionDescription = (section: NewOptionSection): string | undefined => {
    return locale === 'ko' ? section.description : section.descriptionEn
  }

  /** 컨트롤의 현재 값을 values에서 조회한다. 없으면 default를 사용한다 */
  const getControlValue = (control: OptionControl): unknown => {
    if (control.key in values) return values[control.key]
    return control.default
  }

  /** 검색 결과에서 옵션 선택 시 해당 위치로 스크롤하고 하이라이트한다 */
  const handleSearchSelect = (key: string) => {
    showSearch = false
    searchQuery = ''

    // advanced 옵션이면 먼저 펼친다
    const isAdvanced =
      sections.flatMap((s) => s.controls).find((c) => c.key === key)?.tier === 'advanced'
    if (isAdvanced && !showAdvanced) {
      showAdvanced = true
    }

    // DOM에 렌더링된 후 스크롤
    requestAnimationFrame(() => {
      const element = document.getElementById(`control-${key}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        highlightedKey = key
        setTimeout(() => {
          highlightedKey = null
        }, 2000)
      }
    })
  }

  /** 검색 입력 필드 ref */
  let searchInputRef = $state<HTMLInputElement | null>(null)

  /** 검색 모달이 열리면 입력 필드에 포커스한다 */
  $effect(() => {
    if (showSearch && searchInputRef) {
      searchInputRef.focus()
    }
  })

  /** Ctrl+K / Cmd+K 단축키로 검색 모달을 토글한다 */
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

<!-- 검색 모달 -->
{#if showSearch}
  <div class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
    <!-- 백드롭 -->
    <button
      type="button"
      class="fixed inset-0 bg-black/30"
      onclick={() => {
        showSearch = false
        searchQuery = ''
      }}
      aria-label="Close search"
    ></button>

    <!-- 검색 패널 -->
    <div
      class="relative z-10 w-full max-w-md rounded-xl border border-border bg-surface shadow-2xl"
    >
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
          bind:value={searchQuery}
          placeholder={locale === 'ko'
            ? '옵션 이름이나 설명으로 검색...'
            : 'Search options by name or description...'}
          class="flex-1 border-0 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
        />
        <kbd class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400">ESC</kbd>
      </div>

      {#if searchResults.length > 0}
        <ul class="max-h-60 overflow-y-auto py-2">
          {#each searchResults as result (result.control.key)}
            <li>
              <button
                type="button"
                class="flex w-full flex-col gap-0.5 px-4 py-2 text-left hover:bg-primary/5"
                onclick={() => handleSearchSelect(result.control.key)}
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

  <!-- advanced-only 섹션은 토글이 닫힌 상태에서 전체 숨김 -->
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

      <!-- Core 옵션 (항상 표시) -->
      <div class="flex flex-col gap-4">
        {#each coreControls as control (control.key)}
          <div
            id="control-{control.key}"
            class="transition-colors duration-500 {highlightedKey === control.key
              ? 'rounded-md bg-primary/5 p-2 ring-1 ring-primary/20'
              : ''}"
          >
            {#if control.type === 'radio'}
              <RadioControl
                {control}
                value={getControlValue(control) as string}
                {locale}
                {onchange}
              />
            {:else if control.type === 'checkbox'}
              <CheckboxControl
                {control}
                value={getControlValue(control) as boolean}
                {locale}
                {onchange}
              />
            {:else if control.type === 'select'}
              <SelectControl
                {control}
                value={getControlValue(control) as string}
                {locale}
                {onchange}
              />
            {:else if control.type === 'number'}
              <NumberControl
                {control}
                value={getControlValue(control) as number | null}
                {locale}
                {onchange}
              />
            {:else if control.type === 'text'}
              <TextControl
                {control}
                value={getControlValue(control) as string}
                {locale}
                {onchange}
              />
            {:else if control.type === 'tags'}
              <TagsControl
                {control}
                value={getControlValue(control) as string[]}
                {locale}
                {onchange}
              />
            {:else if control.type === 'key-value'}
              <KeyValueControl
                {control}
                value={getControlValue(control) as Record<string, string>}
                {locale}
                {onchange}
              />
            {/if}
          </div>
        {/each}
      </div>

      <!-- Advanced 옵션 (토글로 펼침) -->
      {#if advancedControls.length > 0}
        {#if showAdvanced}
          <div class="mt-4 flex flex-col gap-4 border-t border-dashed border-border pt-4">
            {#each advancedControls as control (control.key)}
              <div
                id="control-{control.key}"
                class="transition-colors duration-500 {highlightedKey === control.key
                  ? 'rounded-md bg-primary/5 p-2 ring-1 ring-primary/20'
                  : ''}"
              >
                {#if control.type === 'radio'}
                  <RadioControl
                    {control}
                    value={getControlValue(control) as string}
                    {locale}
                    {onchange}
                  />
                {:else if control.type === 'checkbox'}
                  <CheckboxControl
                    {control}
                    value={getControlValue(control) as boolean}
                    {locale}
                    {onchange}
                  />
                {:else if control.type === 'select'}
                  <SelectControl
                    {control}
                    value={getControlValue(control) as string}
                    {locale}
                    {onchange}
                  />
                {:else if control.type === 'number'}
                  <NumberControl
                    {control}
                    value={getControlValue(control) as number | null}
                    {locale}
                    {onchange}
                  />
                {:else if control.type === 'text'}
                  <TextControl
                    {control}
                    value={getControlValue(control) as string}
                    {locale}
                    {onchange}
                  />
                {:else if control.type === 'tags'}
                  <TagsControl
                    {control}
                    value={getControlValue(control) as string[]}
                    {locale}
                    {onchange}
                  />
                {:else if control.type === 'key-value'}
                  <KeyValueControl
                    {control}
                    value={getControlValue(control) as Record<string, string>}
                    {locale}
                    {onchange}
                  />
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
  {/if}
{/each}

<!-- "전체 옵션 보기" 토글 버튼 (advanced 옵션이 있을 때만 표시) -->
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
