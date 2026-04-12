<script lang="ts">
  /**
   * 키-값 쌍 리스트 — 행 추가/삭제 컨트롤.
   * TSConfig paths 등에 사용한다.
   */
  import type { KeyValueControl as KeyValueControlType } from '@/types/generator'

  interface Props {
    control: KeyValueControlType
    value: Record<string, string>
    locale: string
    onchange: (key: string, value: Record<string, string>) => void
  }

  let { control, value, locale, onchange }: Props = $props()

  /** Record를 [key, value] 배열로 변환한다 */
  let entries = $derived(Object.entries(value))

  const getLabel = (): string => {
    return locale === 'ko' ? control.label : control.labelEn
  }

  const getDescription = (): string => {
    return locale === 'ko' ? control.description : control.descriptionEn
  }

  /** 키를 변경한다 */
  const handleKeyChange = (oldKey: string, event: Event) => {
    const target = event.target as HTMLInputElement
    const newKey = target.value
    const newValue = { ...value }
    const val = newValue[oldKey]
    delete newValue[oldKey]
    newValue[newKey] = val
    onchange(control.key, newValue)
  }

  /** 값을 변경한다 */
  const handleValueChange = (entryKey: string, event: Event) => {
    const target = event.target as HTMLInputElement
    onchange(control.key, { ...value, [entryKey]: target.value })
  }

  /** 행을 추가한다 */
  const addRow = () => {
    const newKey = ''
    onchange(control.key, { ...value, [newKey]: '' })
  }

  /** 행을 삭제한다 */
  const removeRow = (entryKey: string) => {
    const newValue = { ...value }
    delete newValue[entryKey]
    onchange(control.key, newValue)
  }
</script>

<div class="flex flex-col gap-1.5">
  <div class="flex items-center gap-1.5">
    <span class="text-sm font-medium text-gray-800">{getLabel()}</span>
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

  <div class="mt-1 flex flex-col gap-2">
    {#each entries as [entryKey, entryValue], index (index)}
      <div class="flex items-center gap-2">
        <input
          type="text"
          value={entryKey}
          placeholder={control.keyPlaceholder ?? 'key'}
          onchange={(e) => handleKeyChange(entryKey, e)}
          class="flex-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span class="text-xs text-gray-400">&rarr;</span>
        <input
          type="text"
          value={entryValue}
          placeholder={control.valuePlaceholder ?? 'value'}
          oninput={(e) => handleValueChange(entryKey, e)}
          class="flex-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onclick={() => removeRow(entryKey)}
          class="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
          aria-label={locale === 'ko' ? '행 삭제' : 'Remove row'}
        >
          <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M3.17 3.17a.75.75 0 011.06 0L6 4.94l1.77-1.77a.75.75 0 111.06 1.06L7.06 6l1.77 1.77a.75.75 0 11-1.06 1.06L6 7.06 4.23 8.83a.75.75 0 01-1.06-1.06L4.94 6 3.17 4.23a.75.75 0 010-1.06z"
            />
          </svg>
        </button>
      </div>
    {/each}

    <button
      type="button"
      onclick={addRow}
      class="flex w-fit items-center gap-1 rounded-md px-3 py-1.5 text-xs text-primary hover:bg-primary/5"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
        <path
          d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"
        />
      </svg>
      {locale === 'ko' ? '행 추가' : 'Add row'}
    </button>
  </div>
</div>
