<script lang="ts">
  /**
   * 체크박스 — 단일 boolean 토글 컨트롤.
   * 옵션 변경 시 onchange로 boolean 값을 전달한다.
   */
  import type { CheckboxControl as CheckboxControlType } from '@/types/generator'

  interface Props {
    control: CheckboxControlType
    value: boolean
    locale: string
    onchange: (key: string, value: boolean) => void
  }

  let { control, value, locale, onchange }: Props = $props()

  const getLabel = (): string => {
    return locale === 'ko' ? control.label : control.labelEn
  }

  const getDescription = (): string => {
    return locale === 'ko' ? control.description : control.descriptionEn
  }

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    onchange(control.key, target.checked)
  }
</script>

<label class="flex cursor-pointer items-start gap-3">
  <input
    type="checkbox"
    checked={value}
    onchange={handleChange}
    class="mt-0.5 h-4 w-4 text-primary accent-primary"
    aria-describedby="{control.key}-desc"
  />
  <div class="flex flex-col gap-0.5">
    <div class="flex items-center gap-1.5">
      <span class="text-sm text-gray-700">{getLabel()}</span>
      {#if control.docsUrl}
        <a
          href={control.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-400 hover:text-primary"
          title={locale === 'ko' ? '공식 문서 보기' : 'View docs'}
          onclick={(e: MouseEvent) => e.stopPropagation()}
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M8 0a8 8 0 100 16A8 8 0 008 0zm.93 12.34h-1.9v-1.9h1.9v1.9zm.48-3.56c-.33.33-.52.56-.52 1.06h-1.9c0-1.02.55-1.56 1.05-2.05.33-.33.52-.56.52-1.06 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5H4.16A3.17 3.17 0 017.33 2.5a3.17 3.17 0 013.17 3.17c0 1.02-.55 1.56-1.05 2.05l-.04.06z"
            />
          </svg>
        </a>
      {/if}
    </div>
    <p id="{control.key}-desc" class="text-xs text-gray-400">{getDescription()}</p>
  </div>
</label>
