<script lang="ts">
  /**
   * 스택별 생성기의 인터랙티브 영역 전체를 담당한다.
   * 좌측: 파일별 아코디언 (체크박스 + core 옵션 인라인)
   * 우측: 파일 탭 + 코드 미리보기
   */
  import { onMount } from 'svelte'

  import { getOptionDefinition } from '@/lib/data/options'
  import type { StackFile } from '@/lib/data/stacks'
  import { generateConfigBySlug } from '@/lib/generators'
  import { decodeStackGeneratorUrl, encodeStackGeneratorUrl } from '@/lib/utils/shareUrl'
  import type { OptionControl, OptionSection } from '@/types/generator'

  import CodePreview from './CodePreview.svelte'
  import FileAccordionItem from './FileAccordionItem.svelte'
  import FileTabBar from './FileTabBar.svelte'
  import {
    buildFileDefaults,
    downloadFilesAsZip,
    getFileGeneratorOptions,
    initializeFileStates,
  } from './modules/stackGeneratorLogic'

  interface Props {
    locale: string
    files: StackFile[]
  }

  let { locale, files }: Props = $props()

  // ---------------------------------------------------------------------------
  // 상태 관리
  // ---------------------------------------------------------------------------

  let enabledFileMap = $state<Record<string, boolean>>(
    Object.fromEntries(files.map((f) => [f.fileName, true])),
  )
  let openAccordion = $state(files[0]?.fileName ?? '')
  let activeFileTab = $state(files[0]?.fileName ?? '')
  let fileOptionValues = $state<Record<string, Record<string, unknown>>>({})
  let fileTouchedKeys = $state<Record<string, Set<string>>>({})

  const initFileStates = () => {
    const { values, touched } = initializeFileStates(files)
    fileOptionValues = values
    fileTouchedKeys = touched
  }

  initFileStates()

  // ---------------------------------------------------------------------------
  // 파생 상태
  // ---------------------------------------------------------------------------

  let activeFileNames = $derived(
    files.filter((f) => enabledFileMap[f.fileName]).map((f) => f.fileName),
  )

  const getCoreSections = (slug: string): OptionSection[] => {
    const definition = getOptionDefinition(slug)
    if (!definition) return []
    return definition.sections
      .map((s) => ({ ...s, controls: s.controls.filter((c) => c.tier === 'core') }))
      .filter((s) => s.controls.length > 0)
  }

  let generatedFiles = $derived.by(() => {
    const result: Record<string, string> = {}
    for (const file of files) {
      if (!enabledFileMap[file.fileName]) continue
      const opts = getFileGeneratorOptions(file.slug, fileOptionValues, fileTouchedKeys)
      const output = generateConfigBySlug(file.slug, opts)
      result[file.fileName] = output.code
    }
    return result
  })

  let currentPreviewCode = $derived(generatedFiles[activeFileTab] ?? '')

  // ---------------------------------------------------------------------------
  // 핸들러
  // ---------------------------------------------------------------------------

  const handleFileToggle = (fileName: string, event: Event) => {
    const target = event.target as HTMLInputElement
    enabledFileMap = { ...enabledFileMap, [fileName]: target.checked }
    if (!target.checked) {
      if (activeFileTab === fileName) {
        const firstActive = files.find((f) => f.fileName !== fileName && enabledFileMap[f.fileName])
        if (firstActive) activeFileTab = firstActive.fileName
      }
      if (openAccordion === fileName) {
        openAccordion = ''
      }
    }
  }

  const handleAccordionToggle = (fileName: string) => {
    if (openAccordion === fileName) {
      openAccordion = ''
    } else {
      openAccordion = fileName
      activeFileTab = fileName
    }
  }

  const handleTabChange = (fileName: string) => {
    activeFileTab = fileName
    openAccordion = fileName
  }

  const handleOptionChange = (slug: string, key: string, value: unknown) => {
    fileOptionValues = {
      ...fileOptionValues,
      [slug]: { ...fileOptionValues[slug], [key]: value },
    }
    fileTouchedKeys = {
      ...fileTouchedKeys,
      [slug]: new Set([...(fileTouchedKeys[slug] ?? []), key]),
    }
  }

  const getControlValue = (slug: string, control: OptionControl): unknown => {
    const values = fileOptionValues[slug]
    if (values && control.key in values) return values[control.key]
    return control.default
  }

  const handleDownloadZip = () => downloadFilesAsZip(generatedFiles)

  let shareUrlResult = $derived.by(() => {
    if (typeof window === 'undefined') return { url: '', warning: undefined }
    const baseUrl = window.location.origin + window.location.pathname
    const fileDefaults = buildFileDefaults(files)
    const stackFiles = files.map((file) => ({
      slug: file.slug,
      enabled: enabledFileMap[file.fileName] ?? true,
      options: getFileGeneratorOptions(file.slug, fileOptionValues, fileTouchedKeys),
    }))
    return encodeStackGeneratorUrl(baseUrl, { stackSlug: '', files: stackFiles }, fileDefaults)
  })

  onMount(() => {
    const params = new URLSearchParams(window.location.search)
    const decoded = decodeStackGeneratorUrl(params)

    if (decoded.disabled.length > 0) {
      const newEnabledMap = { ...enabledFileMap }
      for (const slug of decoded.disabled) {
        const file = files.find((f) => f.slug === slug)
        if (file) newEnabledMap[file.fileName] = false
      }
      enabledFileMap = newEnabledMap
    }

    if (Object.keys(decoded.fileOptions).length > 0) {
      const newValues = { ...fileOptionValues }
      const newTouched = { ...fileTouchedKeys }
      for (const [slug, opts] of Object.entries(decoded.fileOptions)) {
        newValues[slug] = { ...newValues[slug], ...opts }
        newTouched[slug] = new Set([...(newTouched[slug] ?? []), ...Object.keys(opts)])
      }
      fileOptionValues = newValues
      fileTouchedKeys = newTouched
    }
  })

  let includedFilesLabel = $derived(locale === 'ko' ? '포함 파일' : 'Included Files')
</script>

<div class="mx-auto flex h-full w-full flex-col overflow-hidden lg:flex-row">
  <!-- 좌측 패널: 아코디언 -->
  <div class="w-full lg:w-105 lg:shrink-0 lg:overflow-y-auto lg:overflow-x-hidden lg:h-full">
    <div class="px-4 py-6">
      <h2 class="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {includedFilesLabel}
      </h2>

      <div class="mt-4 flex flex-col">
        {#each files as file (file.fileName)}
          <FileAccordionItem
            fileName={file.fileName}
            preset={file.preset}
            isOpen={openAccordion === file.fileName}
            isEnabled={enabledFileMap[file.fileName]}
            coreSections={getCoreSections(file.slug)}
            {locale}
            getControlValue={(control) => getControlValue(file.slug, control)}
            ontoggle={() => handleAccordionToggle(file.fileName)}
            onenabledchange={(e) => handleFileToggle(file.fileName, e)}
            onoptionchange={(key, value) => handleOptionChange(file.slug, key, value)}
          />
        {/each}
      </div>
    </div>
  </div>

  <!-- 우측 패널: 파일 탭 + 미리보기 -->
  <div
    class="w-full border-t border-border lg:w-[calc(100%-444px)] lg:h-full lg:border-t-0 lg:border-l lg:overflow-hidden"
  >
    <div class="flex h-full flex-col bg-code-bg">
      <FileTabBar
        fileNames={activeFileNames}
        activeTab={activeFileTab}
        ontabchange={handleTabChange}
      />
      <CodePreview
        fileName={activeFileTab}
        code={currentPreviewCode}
        {locale}
        showZipDownload={true}
        ondownloadzip={handleDownloadZip}
        shareUrl={shareUrlResult.url}
        shareWarning={shareUrlResult.warning}
      />
    </div>
  </div>
</div>
