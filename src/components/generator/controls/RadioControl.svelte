<script lang="ts">
  /**
   * 라디오 그룹 — 그룹 내 단일 선택 컨트롤.
   * 옵션 변경 시 onchange로 선택된 값을 전달한다.
   */
  import type { RadioControl as RadioControlType } from '@/types/generator'

  interface Props {
    control: RadioControlType
    value: string
    locale: string
    onchange: (key: string, value: string) => void
  }

  let { control, value, locale, onchange }: Props = $props()

  /** locale에 따라 라벨을 반환한다 */
  const getLabel = (): string => {
    return locale === 'ko' ? control.label : control.labelEn
  }

  /** locale에 따라 설명을 반환한다 */
  const getDescription = (): string => {
    return locale === 'ko' ? control.description : control.descriptionEn
  }

  const handleChange = (selectedValue: string) => {
    onchange(control.key, selectedValue)
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
  <div class="mt-2 flex flex-col gap-2">
    {#each control.options as option (option.value)}
      <label class="flex cursor-pointer items-center gap-3">
        <input
          type="radio"
          name={control.key}
          value={option.value}
          checked={value === option.value}
          onchange={() => handleChange(option.value)}
          class="h-4 w-4 text-primary accent-primary"
        />
        <span class="text-sm text-gray-700">{option.label}</span>
      </label>
    {/each}
  </div>
</div>
