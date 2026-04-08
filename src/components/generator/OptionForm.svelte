<script lang="ts">
  /**
   * 옵션 섹션 목록을 받아 radio/checkbox 폼을 렌더링한다.
   * 옵션 변경 시 부모에게 콜백으로 알린다.
   */

  interface OptionField {
    label: string
    value: string
    checked: boolean
  }

  interface OptionSection {
    titleEn: string
    titleKo: string
    descriptionEn: string
    descriptionKo: string
    type: 'radio' | 'checkbox'
    name?: string
    options: OptionField[]
  }

  interface Props {
    sections: OptionSection[]
    locale: string
    onoptionchange: (sectionIndex: number, optionValue: string, checked: boolean) => void
  }

  let { sections, locale, onoptionchange }: Props = $props()

  /** locale에 따라 섹션 타이틀을 반환한다 */
  const getSectionTitle = (section: OptionSection): string => {
    return locale === 'ko' ? section.titleKo : section.titleEn
  }

  /** locale에 따라 섹션 설명을 반환한다 */
  const getSectionDescription = (section: OptionSection): string => {
    return locale === 'ko' ? section.descriptionKo : section.descriptionEn
  }

  /** radio 변경 핸들러 — 같은 그룹의 다른 값은 해제한다 */
  const handleRadioChange = (sectionIndex: number, selectedValue: string) => {
    onoptionchange(sectionIndex, selectedValue, true)
  }

  /** checkbox 변경 핸들러 */
  const handleCheckboxChange = (sectionIndex: number, optionValue: string, event: Event) => {
    const target = event.target as HTMLInputElement
    onoptionchange(sectionIndex, optionValue, target.checked)
  }
</script>

{#each sections as section, sectionIndex (section.titleEn)}
  <fieldset class="border-b border-border py-6">
    <legend class="text-sm font-semibold text-gray-900">
      {getSectionTitle(section)}
    </legend>
    <p class="mt-1 text-xs text-gray-400">{getSectionDescription(section)}</p>
    <div class="mt-4 flex flex-col gap-3">
      {#each section.options as option (option.value)}
        <label class="flex cursor-pointer items-center gap-3">
          {#if section.type === 'radio'}
            <input
              type="radio"
              name={section.name ?? `section-${sectionIndex}`}
              value={option.value}
              checked={option.checked}
              onchange={() => handleRadioChange(sectionIndex, option.value)}
              class="h-4 w-4 text-primary accent-primary"
            />
          {:else}
            <input
              type="checkbox"
              value={option.value}
              checked={option.checked}
              onchange={(e) => handleCheckboxChange(sectionIndex, option.value, e)}
              class="h-4 w-4 text-primary accent-primary"
            />
          {/if}
          <span class="text-sm text-gray-700">{option.label}</span>
        </label>
      {/each}
    </div>
  </fieldset>
{/each}
