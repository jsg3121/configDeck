<script lang="ts">
  /**
   * 숫자 입력 — 직접 입력 + min/max 검증 컨트롤.
   * Prettier printWidth, tabWidth 등에 사용한다.
   */
  import type { NumberControl as NumberControlType } from '@/types/generator'

  interface Props {
    control: NumberControlType
    value: number
    locale: string
    onchange: (key: string, value: number) => void
  }

  let { control, value, locale, onchange }: Props = $props()

  const getLabel = (): string => {
    return locale === 'ko' ? control.label : control.labelEn
  }

  const getDescription = (): string => {
    return locale === 'ko' ? control.description : control.descriptionEn
  }

  /** 값을 min/max 범위 안으로 제한한다 */
  const clamp = (val: number): number => {
    let clamped = val
    if (control.min !== undefined && clamped < control.min) clamped = control.min
    if (control.max !== undefined && clamped > control.max) clamped = control.max
    return clamped
  }

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const parsed = Number(target.value)
    if (!Number.isNaN(parsed)) {
      onchange(control.key, clamp(parsed))
    }
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
  <div class="mt-1 flex items-center gap-2">
    <input
      id={control.key}
      type="number"
      {value}
      min={control.min}
      max={control.max}
      step={control.step ?? 1}
      oninput={handleInput}
      aria-describedby="{control.key}-desc"
      class="w-24 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-gray-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    />
    {#if control.unit}
      <span class="text-xs text-gray-400">{control.unit}</span>
    {/if}
  </div>
</div>
