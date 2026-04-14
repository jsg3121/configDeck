<script lang="ts">
  /**
   * 드롭다운 — 옵션이 많은 단일 선택 컨트롤.
   * radio 대비 화면 공간을 절약할 때 사용한다.
   */
  import type { SelectControl as SelectControlType } from '@/types/generator'

  interface Props {
    control: SelectControlType
    value: string
    locale: string
    onchange: (key: string, value: string) => void
  }

  let { control, value, locale, onchange }: Props = $props()

  const getLabel = (): string => {
    return locale === 'ko' ? control.label : control.labelEn
  }

  const getDescription = (): string => {
    return locale === 'ko' ? control.description : control.descriptionEn
  }

  const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    onchange(control.key, target.value)
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
  <select
    id={control.key}
    {value}
    onchange={handleChange}
    aria-describedby="{control.key}-desc"
    class="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
  >
    {#each control.options as option (option.value)}
      <option value={option.value} selected={value === option.value}>
        {option.label}
      </option>
    {/each}
  </select>
</div>
