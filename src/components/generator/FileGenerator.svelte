<script lang="ts">
  /**
   * 파일별 생성기의 인터랙티브 영역 전체를 담당한다.
   * 프리셋 기본값을 기준으로 생성기 옵션을 관리하고,
   * 섹션 UI 변경 시 스키마 옵션을 동기화하여 실시간 코드를 생성한다.
   */
  import { getOptionDefinition, isMigrated } from '@/lib/data/options'
  import { generateConfigBySlug } from '@/lib/generators'
  import type { MigrationResult } from '@/lib/migration'
  import { getPresetDefaultsBySlug } from '@/lib/schemas'
  import type { NewOptionSection, OptionControl } from '@/types/generator'

  import CodePreview from './CodePreview.svelte'
  import MigrationPanel from './MigrationPanel.svelte'
  import OptionForm from './OptionForm.svelte'
  import PresetSelector from './PresetSelector.svelte'

  // ---------------------------------------------------------------------------
  // Legacy 타입 — 마이그레이션 완료(M11) 시 제거 예정
  // ---------------------------------------------------------------------------
  interface LegacyOptionField {
    label: string
    value: string
    checked: boolean
  }

  interface LegacyOptionSection {
    titleEn: string
    titleKo: string
    descriptionEn: string
    descriptionKo: string
    type: 'radio' | 'checkbox'
    name?: string
    options: LegacyOptionField[]
  }

  interface RelatedFile {
    slug: string
    fileName: string
    descriptionEn: string
    descriptionKo: string
    href: string
  }

  interface Props {
    fileSlug: string
    locale: string
    sections: LegacyOptionSection[]
    presets: string[]
    supportsMigration: boolean
    relatedFiles?: RelatedFile[]
  }

  const {
    fileSlug,
    locale,
    sections,
    presets,
    supportsMigration,
    relatedFiles = [],
  }: Props = $props()

  // ---------------------------------------------------------------------------
  // Legacy → 신규 구조 어댑터 (M11에서 제거)
  // ---------------------------------------------------------------------------

  /** legacy OptionSection을 신규 NewOptionSection으로 변환한다 */
  const adaptLegacySections = (legacySections: LegacyOptionSection[]): NewOptionSection[] => {
    return legacySections.map((section) => ({
      title: section.titleKo,
      titleEn: section.titleEn,
      description: section.descriptionKo,
      descriptionEn: section.descriptionEn,
      controls: section.options.map((option): OptionControl => {
        if (section.type === 'radio') {
          return {
            type: 'radio',
            key: section.name ?? option.value,
            label: section.titleKo,
            labelEn: section.titleEn,
            description: section.descriptionKo,
            descriptionEn: section.descriptionEn,
            tier: 'core',
            options: section.options.map((o) => ({ label: o.label, value: o.value })),
            default: section.options.find((o) => o.checked)?.value ?? section.options[0].value,
          }
        }
        return {
          type: 'checkbox',
          key: option.value,
          label: option.label,
          labelEn: option.label,
          description: '',
          descriptionEn: '',
          tier: 'core',
          default: option.checked,
        }
      }),
    }))
  }

  /**
   * legacy 어댑터의 radio 섹션은 각 option을 별도 control로 변환하므로
   * radio 그룹이 중복 렌더링된다. 이를 제거하기 위해 radio 컨트롤을 그룹당 1개만 남긴다.
   */
  const deduplicateRadioControls = (adaptedSections: NewOptionSection[]): NewOptionSection[] => {
    return adaptedSections.map((section) => {
      const seen: string[] = []
      const dedupedControls = section.controls.filter((control) => {
        if (control.type === 'radio') {
          if (seen.includes(control.key)) return false
          seen.push(control.key)
        }
        return true
      })
      return { ...section, controls: dedupedControls }
    })
  }

  // ---------------------------------------------------------------------------
  // 유틸 함수 (어댑터에서도 사용하므로 먼저 선언)
  // ---------------------------------------------------------------------------

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

  /** legacy 옵션 값을 신규 values 맵으로 변환한다 */
  const buildValuesFromLegacy = (
    legacySections: LegacyOptionSection[],
    opts: Record<string, unknown>,
  ): Record<string, unknown> => {
    const values: Record<string, unknown> = {}
    for (const section of legacySections) {
      if (section.type === 'radio' && section.name) {
        values[section.name] = opts[section.name] ?? section.options.find((o) => o.checked)?.value
      } else {
        for (const option of section.options) {
          const camelKey = toCamelCase(option.value)
          const found = findNestedValue(opts, camelKey)
          values[option.value] = typeof found === 'boolean' ? found : option.checked
        }
      }
    }
    return values
  }

  // ---------------------------------------------------------------------------
  // 상태 관리
  // ---------------------------------------------------------------------------

  /** 이 파일이 신규 옵션 구조로 마이그레이션되었는지 */
  const usesNewStructure = isMigrated(fileSlug)

  /** 초기 프리셋을 결정한다 (두 번째 프리셋 또는 첫 번째) */
  const initialPreset = presets[1] ?? presets[0]

  /** 신규 옵션 구조에서 모든 control의 빈 값(초기 상태)으로 구성된 맵을 반환한다 */
  const buildEmptyValues = (): Record<string, unknown> => {
    const definition = getOptionDefinition(fileSlug)
    if (!definition) return {}
    const empty: Record<string, unknown> = {}
    for (const section of definition.sections) {
      for (const control of section.controls) {
        switch (control.type) {
          case 'checkbox':
            empty[control.key] = false
            break
          case 'number':
            empty[control.key] = null
            break
          case 'radio':
          case 'select':
          case 'text':
            empty[control.key] = ''
            break
          case 'tags':
            empty[control.key] = []
            break
          case 'key-value':
            empty[control.key] = {}
            break
        }
      }
    }
    return empty
  }

  /** 현재 선택된 프리셋 — null이면 선택 없음(초기/클리어 상태) */
  let selectedPreset = $state<string | null>(null)
  /** 현재 활성 탭 */
  let activeTab = $state<'generate' | 'migrate'>('generate')

  /** 사용자가 직접 변경한 옵션 키 Set. 이 키의 옵션만 generatorOptions에 포함되어 미리보기에 출력된다 */
  let touchedKeys = $state(new Set<string>())

  /** 생성기에 전달할 스키마 옵션 — touchedKeys에 포함된 옵션만 들어간다 */
  let generatorOptions = $state<Record<string, unknown>>({})

  /** 신규 OptionForm에 전달할 값 맵 — 초기 진입 시 빈 상태 */
  let optionValues = $state<Record<string, unknown>>(usesNewStructure ? buildEmptyValues() : {})

  /** 신규 OptionForm에 전달할 섹션 목록 */
  let formSections = $derived<NewOptionSection[]>(
    usesNewStructure
      ? (getOptionDefinition(fileSlug)?.sections ?? [])
      : deduplicateRadioControls(adaptLegacySections(sections)),
  )

  /** 마이그레이션 결과 */
  let migrationResult = $state<MigrationResult | null>(null)

  /** 미리보기에 표시할 코드 — 마이그레이션 탭이면 변환 결과, 아니면 생성 결과 */
  let generatedOutput = $derived(
    activeTab === 'migrate' && migrationResult
      ? { fileName: 'eslint.config.mjs', code: migrationResult.outputCode, language: 'javascript' }
      : generateConfigBySlug(fileSlug, generatorOptions),
  )

  /** 마이그레이션 결과 수신 핸들러 */
  const handleMigrationResult = (result: MigrationResult | null) => {
    migrationResult = result
  }

  /** 프리셋 변경 시 프리셋이 명시한 옵션만 적용한다. 나머지는 빈 상태 유지 */
  const handlePresetChange = (presetName: string) => {
    selectedPreset = presetName
    const defaults = getPresetDefaultsBySlug(fileSlug, presetName) as Record<string, unknown>

    if (usesNewStructure) {
      // 빈 상태 + 프리셋 값 덮어쓰기 (프리셋이 명시한 키만 채움)
      optionValues = { ...buildEmptyValues(), ...defaults }
      touchedKeys = new Set(Object.keys(defaults))
    } else {
      optionValues = buildValuesFromLegacy(sections, defaults)
      touchedKeys = new Set(Object.keys(optionValues))
    }
    syncGeneratorOptions()
  }

  /** touchedKeys 기반으로 generatorOptions를 갱신한다. 터치된 키의 값만 포함된다 */
  const syncGeneratorOptions = () => {
    if (usesNewStructure) {
      const opts: Record<string, unknown> = {}
      for (const key of touchedKeys) {
        if (key in optionValues) {
          opts[key] = optionValues[key]
        }
      }
      generatorOptions = opts
    } else {
      const defaults = getPresetDefaultsBySlug(fileSlug, initialPreset) as Record<string, unknown>
      const updated = JSON.parse(JSON.stringify(defaults))
      for (const key of touchedKeys) {
        const camelKey = toCamelCase(key)
        if (key in updated) {
          updated[key] = optionValues[key]
        } else {
          setNestedValue(updated, camelKey, optionValues[key])
        }
      }
      // legacy는 전체 옵션이 필요하므로 touched가 하나라도 있으면 전체 전달
      generatorOptions = touchedKeys.size > 0 ? updated : {}
    }
  }

  /** 신규 OptionForm의 옵션 변경 핸들러 */
  const handleNewOptionChange = (key: string, value: unknown) => {
    optionValues = { ...optionValues, [key]: value }
    touchedKeys = new Set([...touchedKeys, key])
    syncGeneratorOptions()
  }

  /** 모든 옵션을 초기 상태로 되돌린다 */
  const handleClear = () => {
    selectedPreset = null
    touchedKeys = new Set()
    generatorOptions = {}
    optionValues = usesNewStructure ? buildEmptyValues() : {}
  }

  let generateLabel = $derived(locale === 'ko' ? '생성' : 'Generate')
  let migrateLabel = $derived(locale === 'ko' ? '마이그레이션' : 'Migrate')
  let presetLabel = $derived(locale === 'ko' ? '프리셋' : 'Preset')
  let relatedFilesLabel = $derived(locale === 'ko' ? '함께 쓰면 좋아요' : 'Goes well with')
  let clearLabel = $derived(locale === 'ko' ? '초기화' : 'Clear')

  /** 현재 로케일에 맞는 관련 파일 설명을 반환 */
  const getRelatedDescription = (file: RelatedFile): string =>
    locale === 'ko' ? file.descriptionKo : file.descriptionEn
</script>

<div class="mx-auto flex h-full max-w-7xl flex-col lg:flex-row">
  <!-- 좌측 패널: 옵션 -->
  <div class="w-full lg:w-1/2 lg:overflow-y-auto">
    <div class="mx-auto max-w-full px-6 py-8">
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
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {presetLabel}
            </h2>
            <button
              type="button"
              class="text-xs text-gray-400 hover:text-gray-600"
              onclick={handleClear}
            >
              {clearLabel}
            </button>
          </div>
          <div class="mt-3">
            <PresetSelector {presets} {selectedPreset} onpresetchange={handlePresetChange} />
          </div>
        </div>

        <OptionForm
          sections={formSections}
          values={optionValues}
          {locale}
          onchange={handleNewOptionChange}
        />

        {#if relatedFiles.length > 0}
          <aside class="mt-10 border-t border-border pt-8">
            <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-600">
              {relatedFilesLabel}
            </h3>
            <ul class="mt-4 flex flex-col gap-3">
              {#each relatedFiles as related (related.slug)}
                <li>
                  <a
                    href={related.href}
                    class="group flex items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-[transform,box-shadow,border-color] duration-200 hover:border-primary hover:shadow-md motion-safe:hover:-translate-y-0.5"
                  >
                    <div
                      class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 transition-colors group-hover:bg-primary/10"
                    >
                      <svg
                        class="h-4 w-4 text-gray-500 transition-colors group-hover:text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p
                        class="font-mono text-sm font-semibold text-gray-900 group-hover:text-primary"
                      >
                        {related.fileName}
                      </p>
                      <p class="mt-1 text-xs leading-relaxed text-gray-500">
                        {getRelatedDescription(related)}
                      </p>
                    </div>
                  </a>
                </li>
              {/each}
            </ul>
          </aside>
        {/if}
      {:else}
        <MigrationPanel {locale} onmigrationresult={handleMigrationResult} />
      {/if}
    </div>
  </div>

  <!-- 우측 패널: 미리보기 -->
  <div class="w-full border-t border-border lg:h-full lg:w-1/2 lg:border-t-0 lg:border-l">
    <CodePreview fileName={generatedOutput.fileName} code={generatedOutput.code} {locale} />
  </div>
</div>
