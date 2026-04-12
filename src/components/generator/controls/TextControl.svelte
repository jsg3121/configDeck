<script lang="ts">
  /**
   * 텍스트 입력 — 한 줄 문자열 컨트롤.
   * TSConfig outDir, baseUrl 등에 사용한다.
   */
  import type { TextControl as TextControlType } from '@/types/generator'

  interface Props {
    control: TextControlType
    value: string
    locale: string
    onchange: (key: string, value: string) => void
  }

  let { control, value, locale, onchange }: Props = $props()

  let isValid = $state(true)

  const getLabel = (): string => {
    return locale === 'ko' ? control.label : control.labelEn
  }

  const getDescription = (): string => {
    return locale === 'ko' ? control.description : control.descriptionEn
  }

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const newValue = target.value

    if (control.pattern) {
      isValid = new RegExp(control.pattern).test(newValue)
    }

    onchange(control.key, newValue)
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
  <input
    id={control.key}
    type="text"
    {value}
    placeholder={control.placeholder ?? ''}
    oninput={handleInput}
    aria-describedby="{control.key}-desc"
    aria-invalid={!isValid}
    class="mt-1 w-full rounded-md border px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 {isValid
      ? 'border-border bg-surface focus:border-primary focus:ring-primary'
      : 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500'}"
  />
  {#if !isValid}
    <p class="text-xs text-red-500">
      {locale === 'ko' ? '유효하지 않은 형식입니다' : 'Invalid format'}
    </p>
  {/if}
</div>
