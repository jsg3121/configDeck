<script lang="ts">
  /**
   * 파일별 생성기의 인터랙티브 영역 전체를 담당한다.
   * 프리셋 기본값을 기준으로 생성기 옵션을 관리하고,
   * 섹션 UI 변경 시 스키마 옵션을 동기화하여 실시간 코드를 생성한다.
   */
  import { generateConfigBySlug } from '@/lib/generators'
  import { getPresetDefaultsBySlug } from '@/lib/schemas'

  import CodePreview from './CodePreview.svelte'
  import OptionForm from './OptionForm.svelte'
  import PresetSelector from './PresetSelector.svelte'

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
    fileSlug: string
    locale: string
    sections: OptionSection[]
    presets: string[]
    supportsMigration: boolean
  }

  let { fileSlug, locale, sections: initialSections, presets, supportsMigration }: Props = $props()

  /** 현재 선택된 프리셋 — Svelte 5 반응성을 위해 let 필수 */
  let selectedPreset = $state(presets[1] ?? presets[0])
  /** 현재 활성 탭 */
  let activeTab = $state<'generate' | 'migrate'>('generate')
  /** 생성기에 전달할 스키마 옵션 (프리셋 기본값으로 초기화) */
  let generatorOptions = $state<Record<string, unknown>>(
    getPresetDefaultsBySlug(fileSlug, selectedPreset) as Record<string, unknown>,
  )
  /** UI 표시용 섹션 상태 */
  let currentSections = $state<OptionSection[]>(structuredClone(initialSections))

  /** 옵션으로부터 자동 생성된 코드 */
  let generatedOutput = $derived(generateConfigBySlug(fileSlug, generatorOptions))

  /** kebab-case → camelCase 변환 */
  const toCamelCase = (str: string): string =>
    str.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())

  /** 중첩 객체에서 키를 찾아 값을 설정한다 */
  const setNestedValue = (obj: Record<string, unknown>, key: string, value: unknown): boolean => {
    if (key in obj) {
      obj[key] = value
      return true
    }
    for (const v of Object.values(obj)) {
      if (typeof v === 'object' && v !== null) {
        if (setNestedValue(v as Record<string, unknown>, key, value)) return true
      }
    }
    return false
  }

  /** 중첩 객체에서 키의 값을 찾는다 */
  const findNestedValue = (obj: Record<string, unknown>, key: string): unknown => {
    if (key in obj) return obj[key]
    for (const v of Object.values(obj)) {
      if (typeof v === 'object' && v !== null) {
        const found = findNestedValue(v as Record<string, unknown>, key)
        if (found !== undefined) return found
      }
    }
    return undefined
  }

  /** 프리셋 변경 시 옵션과 섹션 UI를 모두 초기화한다 */
  const handlePresetChange = (presetName: string) => {
    selectedPreset = presetName
    const defaults = getPresetDefaultsBySlug(fileSlug, presetName) as Record<string, unknown>
    generatorOptions = structuredClone(defaults)

    currentSections = initialSections.map((section) => ({
      ...section,
      options: section.options.map((option) => {
        if (section.type === 'radio' && section.name) {
          return { ...option, checked: defaults[section.name] === option.value }
        }
        const camelKey = toCamelCase(option.value)
        const found = findNestedValue(defaults, camelKey)
        return { ...option, checked: typeof found === 'boolean' ? found : option.checked }
      }),
    }))
  }

  /** 옵션 UI 변경 시 섹션 상태와 생성기 옵션을 동기화한다 */
  const handleOptionChange = (sectionIndex: number, optionValue: string, checked: boolean) => {
    const section = currentSections[sectionIndex]

    if (section.type === 'radio') {
      currentSections[sectionIndex] = {
        ...section,
        options: section.options.map((o) => ({ ...o, checked: o.value === optionValue })),
      }
      if (section.name) {
        const updated = structuredClone(generatorOptions)
        if (section.name in updated) {
          updated[section.name] = optionValue
        }
        generatorOptions = updated
      }
    } else {
      currentSections[sectionIndex] = {
        ...section,
        options: section.options.map((o) => (o.value === optionValue ? { ...o, checked } : o)),
      }
      const camelKey = toCamelCase(optionValue)
      const updated = structuredClone(generatorOptions)
      setNestedValue(updated, camelKey, checked)
      generatorOptions = updated
    }
  }

  // 초기 섹션을 프리셋 기본값에 맞게 동기화
  handlePresetChange(selectedPreset)

  const generateLabel = locale === 'ko' ? '생성' : 'Generate'
  const migrateLabel = locale === 'ko' ? '마이그레이션' : 'Migrate'
  const presetLabel = locale === 'ko' ? '프리셋' : 'Preset'
</script>

<div class="flex flex-col lg:flex-row">
  <!-- 좌측 패널: 옵션 -->
  <div class="w-full lg:h-[calc(100vh-65px)] lg:w-1/2 lg:overflow-y-auto">
    <div class="mx-auto max-w-xl px-6 py-8">
      {#if supportsMigration}
        <div class="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            class="flex-1 rounded-md px-4 py-2 text-sm font-medium {activeTab === 'generate'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'}"
            onclick={() => (activeTab = 'generate')}
          >
            {generateLabel}
          </button>
          <button
            type="button"
            class="flex-1 rounded-md px-4 py-2 text-sm font-medium {activeTab === 'migrate'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'}"
            onclick={() => (activeTab = 'migrate')}
          >
            {migrateLabel}
          </button>
        </div>
      {/if}

      {#if activeTab === 'generate'}
        <div class="border-b border-border pb-6">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {presetLabel}
          </h2>
          <div class="mt-3">
            <PresetSelector {presets} {selectedPreset} onpresetchange={handlePresetChange} />
          </div>
        </div>

        <OptionForm sections={currentSections} {locale} onoptionchange={handleOptionChange} />
      {:else}
        <div
          class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center"
        >
          <p class="text-sm text-gray-500">
            {locale === 'ko'
              ? '레거시 설정 파일을 붙여넣거나 업로드하세요.'
              : 'Paste or upload your legacy config file.'}
          </p>
        </div>
      {/if}
    </div>
  </div>

  <!-- 우측 패널: 미리보기 -->
  <CodePreview fileName={generatedOutput.fileName} code={generatedOutput.code} {locale} />
</div>
