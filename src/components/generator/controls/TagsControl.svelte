<script lang="ts">
  /**
   * 태그 입력 — 문자열 배열을 칩 UI로 관리하는 컨트롤.
   * TSConfig lib, include, types 등에 사용한다.
   * Enter로 추가, Backspace로 마지막 태그 삭제, suggestions 자동완성 지원.
   */
  import type { TagsControl as TagsControlType } from '@/types/generator'

  interface Props {
    control: TagsControlType
    value: string[]
    locale: string
    onchange: (key: string, value: string[]) => void
  }

  let { control, value, locale, onchange }: Props = $props()

  let inputValue = $state('')
  let showSuggestions = $state(false)

  /** suggestions 중 아직 선택되지 않은 항목을 필터링한다 */
  let filteredSuggestions = $derived(
    (control.suggestions ?? []).filter(
      (suggestion) =>
        !value.includes(suggestion) && suggestion.toLowerCase().includes(inputValue.toLowerCase()),
    ),
  )

  const getLabel = (): string => {
    return locale === 'ko' ? control.label : control.labelEn
  }

  const getDescription = (): string => {
    return locale === 'ko' ? control.description : control.descriptionEn
  }

  /** 태그를 추가한다 */
  const addTag = (tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed || value.includes(trimmed)) return
    if (control.maxItems && value.length >= control.maxItems) return

    onchange(control.key, [...value, trimmed])
    inputValue = ''
    showSuggestions = false
  }

  /** 태그를 제거한다 */
  const removeTag = (tag: string) => {
    onchange(
      control.key,
      value.filter((v) => v !== tag),
    )
  }

  /** 키보드 이벤트 핸들러 */
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTag(inputValue)
    } else if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  /** 자동완성 제안을 선택한다 */
  const handleSelectSuggestion = (suggestion: string) => {
    addTag(suggestion)
  }
</script>

<div class="flex flex-col gap-1.5">
  <div class="flex items-center gap-1.5">
    <label for={control.key} class="text-sm font-medium text-gray-800">
      {getLabel()}
    </label>
    {#if control.docsUrl}
      <a
        href={control.docsUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-400 hover:text-primary"
        title={locale === 'ko' ? '공식 문서 보기' : 'View docs'}
      >
        <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M8 0a8 8 0 100 16A8 8 0 008 0zm.93 12.34h-1.9v-1.9h1.9v1.9zm.48-3.56c-.33.33-.52.56-.52 1.06h-1.9c0-1.02.55-1.56 1.05-2.05.33-.33.52-.56.52-1.06 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5H4.16A3.17 3.17 0 017.33 2.5a3.17 3.17 0 013.17 3.17c0 1.02-.55 1.56-1.05 2.05l-.04.06z"
          />
        </svg>
      </a>
    {/if}
  </div>
  <p class="text-xs text-gray-400">{getDescription()}</p>

  <div class="relative mt-1">
    <!-- 태그 칩 목록 + 입력 필드 -->
    <div
      class="flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
    >
      {#each value as tag (tag)}
        <span
          class="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary"
        >
          {tag}
          <button
            type="button"
            onclick={() => removeTag(tag)}
            class="text-primary/60 hover:text-primary"
            aria-label="{tag} 제거"
          >
            <svg class="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
              <path
                d="M3.17 3.17a.75.75 0 011.06 0L6 4.94l1.77-1.77a.75.75 0 111.06 1.06L7.06 6l1.77 1.77a.75.75 0 11-1.06 1.06L6 7.06 4.23 8.83a.75.75 0 01-1.06-1.06L4.94 6 3.17 4.23a.75.75 0 010-1.06z"
              />
            </svg>
          </button>
        </span>
      {/each}
      <input
        id={control.key}
        type="text"
        bind:value={inputValue}
        onkeydown={handleKeydown}
        onfocus={() => (showSuggestions = true)}
        onblur={() => setTimeout(() => (showSuggestions = false), 200)}
        placeholder={value.length === 0
          ? locale === 'ko'
            ? '값을 입력하고 Enter'
            : 'Type and press Enter'
          : ''}
        class="min-w-[120px] flex-1 border-0 bg-transparent p-0 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none"
      />
    </div>

    <!-- 자동완성 드롭다운 -->
    {#if showSuggestions && filteredSuggestions.length > 0}
      <ul
        class="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-border bg-surface shadow-lg"
      >
        {#each filteredSuggestions as suggestion (suggestion)}
          <li>
            <button
              type="button"
              class="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-primary/5"
              onmousedown={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  {#if control.maxItems}
    <p class="text-xs text-gray-400">
      {value.length} / {control.maxItems}
    </p>
  {/if}
</div>
