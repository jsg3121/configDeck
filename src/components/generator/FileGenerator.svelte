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
  import { buildEmptyValues } from '@/lib/modules/optionBuilder'
  import { decodeFileGeneratorUrl } from '@/lib/utils/shareUrl'
  import type { OptionSection } from '@/types/generator'

  import CodePreview from './CodePreview.svelte'
  import GeneratorTabs from './GeneratorTabs.svelte'
  import MigrationPanel from './MigrationPanel.svelte'
  import {
    applyPreset,
    buildShareUrl,
    syncUrlWithOptions,
    updateOption,
  } from './modules/fileGeneratorLogic'
  import OptionForm from './OptionForm.svelte'
  import PresetSelector from './PresetSelector.svelte'
  import RelatedFilesSection from './RelatedFilesSection.svelte'

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

  let selectedPreset = $state<string | null>(null)
  let activeTab = $state<'generate' | 'migrate'>('generate')
  let touchedKeys = $state(new Set<string>())
  let generatorOptions = $state<Record<string, unknown>>({})
  let optionValues = $state<Record<string, unknown>>(buildEmptyValues(fileSlug))
  let formSections = $derived<OptionSection[]>(getOptionDefinition(fileSlug)?.sections ?? [])
  let mobileView = $state<'options' | 'preview'>('options')
  let migrationResult = $state<MigrationResult | null>(null)

  const baseOutput = generateConfigBySlug(fileSlug, {})

  let generatedOutput = $derived(
    activeTab === 'migrate' && migrationResult
      ? {
          fileName: baseOutput.fileName || 'eslint.config.mjs',
          code: migrationResult.outputCode,
          language: baseOutput.language || 'javascript',
        }
      : generateConfigBySlug(fileSlug, generatorOptions),
  )

  const handleMigrationResult = (result: MigrationResult | null) => {
    migrationResult = result
  }

  const handlePresetChange = (presetName: string) => {
    selectedPreset = presetName
    const result = applyPreset(fileSlug, presetName)
    optionValues = result.optionValues
    touchedKeys = result.touchedKeys
    generatorOptions = result.generatorOptions
  }

  const handleOptionChange = (key: string, value: unknown) => {
    const result = updateOption(optionValues, touchedKeys, key, value)
    optionValues = result.optionValues
    touchedKeys = result.touchedKeys
    generatorOptions = result.generatorOptions
  }

  const handleClear = () => {
    selectedPreset = null
    touchedKeys = new Set()
    generatorOptions = {}
    optionValues = buildEmptyValues(fileSlug)
    syncUrlWithOptions(fileSlug, null, {}, buildEmptyValues(fileSlug))
  }

  let shareUrlResult = $derived.by(() => {
    const defaults = buildEmptyValues(fileSlug)
    return buildShareUrl(fileSlug, selectedPreset, generatorOptions, defaults)
  })

  onMount(() => {
    const params = new URLSearchParams(window.location.search)
    const decoded = decodeFileGeneratorUrl(params)

    if (decoded.preset && presets.includes(decoded.preset)) {
      handlePresetChange(decoded.preset)
    }

    if (Object.keys(decoded.options).length > 0) {
      for (const [key, value] of Object.entries(decoded.options)) {
        const result = updateOption(optionValues, touchedKeys, key, value)
        optionValues = result.optionValues
        touchedKeys = result.touchedKeys
        generatorOptions = result.generatorOptions
      }
    }
  })

  let presetLabel = $derived(locale === 'ko' ? '프리셋' : 'Preset')
  let clearLabel = $derived(locale === 'ko' ? '초기화' : 'Clear')
  let optionsLabel = $derived(locale === 'ko' ? '옵션' : 'Options')
  let previewLabel = $derived(locale === 'ko' ? '미리보기' : 'Preview')
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
        <GeneratorTabs {activeTab} {locale} ontabchange={(tab) => (activeTab = tab)} />
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
          <RelatedFilesSection files={relatedFiles} {locale} />
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
