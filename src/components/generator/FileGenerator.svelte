<script lang="ts">
  /**
   * 파일별 생성기의 인터랙티브 영역 전체를 담당한다.
   * 프리셋 기본값을 기준으로 생성기 옵션을 관리하고,
   * 섹션 UI 변경 시 스키마 옵션을 동기화하여 실시간 코드를 생성한다.
   */
  import { onMount } from 'svelte'

  import { getOptionDefinition } from '@/lib/data/options'
  import { generateConfigBySlug } from '@/lib/generators'
  import type { MigrationResult } from '@/lib/migration'
  import { getPresetDefaultsBySlug } from '@/lib/schemas'
  import { decodeFileGeneratorUrl, encodeFileGeneratorUrl } from '@/lib/utils/shareUrl'
  import type { NewOptionSection } from '@/types/generator'

  import CodePreview from './CodePreview.svelte'
  import MigrationPanel from './MigrationPanel.svelte'
  import OptionForm from './OptionForm.svelte'
  import PresetSelector from './PresetSelector.svelte'

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
    presets: string[]
    supportsMigration: boolean
    relatedFiles?: RelatedFile[]
  }

  const { fileSlug, locale, presets, supportsMigration, relatedFiles = [] }: Props = $props()

  // ---------------------------------------------------------------------------
  // 상태 관리
  // ---------------------------------------------------------------------------

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

  /** OptionForm에 전달할 값 맵 — 초기 진입 시 빈 상태 */
  let optionValues = $state<Record<string, unknown>>(buildEmptyValues())

  /** OptionForm에 전달할 섹션 목록 */
  let formSections = $derived<NewOptionSection[]>(getOptionDefinition(fileSlug)?.sections ?? [])

  /** 모바일 뷰 전환 탭 (옵션 / 미리보기) */
  let mobileView = $state<'options' | 'preview'>('options')

  /** 마이그레이션 결과 */
  let migrationResult = $state<MigrationResult | null>(null)

  /** 생성 탭의 기본 출력 (파일명/언어 참조용) */
  const baseOutput = generateConfigBySlug(fileSlug, {})

  /** 미리보기에 표시할 코드 — 마이그레이션 탭이면 변환 결과, 아니면 생성 결과 */
  let generatedOutput = $derived(
    activeTab === 'migrate' && migrationResult
      ? {
          fileName: baseOutput.fileName || 'eslint.config.mjs',
          code: migrationResult.outputCode,
          language: baseOutput.language || 'javascript',
        }
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
    optionValues = { ...buildEmptyValues(), ...defaults }
    touchedKeys = new Set(Object.keys(defaults))
    syncGeneratorOptions()
  }

  /** touchedKeys 기반으로 generatorOptions를 갱신한다. 터치된 키의 값만 포함된다 */
  const syncGeneratorOptions = () => {
    const opts: Record<string, unknown> = {}
    for (const key of touchedKeys) {
      if (key in optionValues) {
        opts[key] = optionValues[key]
      }
    }
    generatorOptions = opts
  }

  /** OptionForm의 옵션 변경 핸들러 */
  const handleOptionChange = (key: string, value: unknown) => {
    optionValues = { ...optionValues, [key]: value }
    touchedKeys = new Set([...touchedKeys, key])
    syncGeneratorOptions()
  }

  /** 모든 옵션을 초기 상태로 되돌린다 */
  const handleClear = () => {
    selectedPreset = null
    touchedKeys = new Set()
    generatorOptions = {}
    optionValues = buildEmptyValues()
    updateUrlWithoutReload()
  }

  /** 현재 옵션 상태를 URL에 반영한다 (히스토리 교체) */
  const updateUrlWithoutReload = () => {
    const baseUrl = window.location.pathname
    const defaults = buildEmptyValues()
    const result = encodeFileGeneratorUrl(
      baseUrl,
      { slug: fileSlug, preset: selectedPreset ?? undefined, options: generatorOptions },
      defaults,
    )
    window.history.replaceState(null, '', result.url)
  }

  /** 공유 URL 생성 */
  let shareUrlResult = $derived.by(() => {
    if (typeof window === 'undefined') return { url: '', warning: undefined }
    const baseUrl = window.location.origin + window.location.pathname
    const defaults = buildEmptyValues()
    return encodeFileGeneratorUrl(
      baseUrl,
      { slug: fileSlug, preset: selectedPreset ?? undefined, options: generatorOptions },
      defaults,
    )
  })

  /** URL 파라미터에서 옵션 복원 */
  onMount(() => {
    const params = new URLSearchParams(window.location.search)
    const decoded = decodeFileGeneratorUrl(params)

    if (decoded.preset && presets.includes(decoded.preset)) {
      handlePresetChange(decoded.preset)
    }

    if (Object.keys(decoded.options).length > 0) {
      optionValues = { ...optionValues, ...decoded.options }
      touchedKeys = new Set([...touchedKeys, ...Object.keys(decoded.options)])
      syncGeneratorOptions()
    }
  })

  let generateLabel = $derived(locale === 'ko' ? '생성' : 'Generate')
  let migrateLabel = $derived(locale === 'ko' ? '마이그레이션' : 'Migrate')
  let presetLabel = $derived(locale === 'ko' ? '프리셋' : 'Preset')
  let relatedFilesLabel = $derived(locale === 'ko' ? '함께 쓰면 좋아요' : 'Goes well with')
  let clearLabel = $derived(locale === 'ko' ? '초기화' : 'Clear')
  let optionsLabel = $derived(locale === 'ko' ? '옵션' : 'Options')
  let previewLabel = $derived(locale === 'ko' ? '미리보기' : 'Preview')

  /** 현재 로케일에 맞는 관련 파일 설명을 반환 */
  const getRelatedDescription = (file: RelatedFile): string =>
    locale === 'ko' ? file.descriptionKo : file.descriptionEn
</script>

<div class="mx-auto flex h-full w-full flex-col lg:flex-row">
  <!-- 모바일 전용: 옵션/미리보기 탭 -->
  <div class="flex border-b border-border lg:hidden">
    <button
      type="button"
      class="flex-1 py-3 text-center text-sm font-medium transition-colors {mobileView === 'options'
        ? 'border-b-2 border-primary text-primary'
        : 'text-gray-500 hover:text-gray-700'}"
      onclick={() => (mobileView = 'options')}
    >
      {optionsLabel}
    </button>
    <button
      type="button"
      class="flex-1 py-3 text-center text-sm font-medium transition-colors {mobileView === 'preview'
        ? 'border-b-2 border-primary text-primary'
        : 'text-gray-500 hover:text-gray-700'}"
      onclick={() => (mobileView = 'preview')}
    >
      {previewLabel}
    </button>
  </div>

  <!-- 좌측 패널: 옵션 -->
  <div
    class="w-full lg:w-1/2 lg:overflow-y-auto {mobileView === 'preview' ? 'hidden lg:block' : ''}"
  >
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
          onchange={handleOptionChange}
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
  <div
    class="w-full border-t border-border lg:w-[calc(100%-444px)] lg:h-full lg:border-t-0 lg:border-l lg:overflow-hidden {mobileView ===
    'options'
      ? 'hidden lg:block'
      : ''}"
  >
    <div class="flex h-full flex-col bg-code-bg">
      <CodePreview
        fileName={generatedOutput.fileName}
        code={generatedOutput.code}
        {locale}
        shareUrl={shareUrlResult.url}
        shareWarning={shareUrlResult.warning}
      />
    </div>
  </div>
</div>
