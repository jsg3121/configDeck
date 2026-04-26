<script lang="ts">
  /**
   * 스택별 생성기의 인터랙티브 영역 전체를 담당한다.
   * 좌측: 파일별 아코디언 (체크박스 + core 옵션 인라인)
   * 우측: 파일 탭 + 코드 미리보기
   * ADR-0009: B안(아코디언 인라인 옵션) 기반
   */
  import { onMount } from 'svelte'

  import { getFileIcon } from '@/lib/data/icons'
  import { getOptionDefinition } from '@/lib/data/options'
  import type { StackFile } from '@/lib/data/stacks'
  import { generateConfigBySlug } from '@/lib/generators'
  import { decodeStackGeneratorUrl, encodeStackGeneratorUrl } from '@/lib/utils/shareUrl'
  import type { NewOptionSection, OptionControl } from '@/types/generator'

  import CodePreview from './CodePreview.svelte'
  import CheckboxControl from './controls/CheckboxControl.svelte'
  import KeyValueControl from './controls/KeyValueControl.svelte'
  import NumberControl from './controls/NumberControl.svelte'
  import RadioControl from './controls/RadioControl.svelte'
  import SelectControl from './controls/SelectControl.svelte'
  import TagsControl from './controls/TagsControl.svelte'
  import TextControl from './controls/TextControl.svelte'
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

  /** 파일별 활성화 상태 */
  let enabledFileMap = $state<Record<string, boolean>>(
    Object.fromEntries(files.map((f) => [f.fileName, true])),
  )

  /** 현재 열린 아코디언 (한 번에 하나만) */
  let openAccordion = $state(files[0]?.fileName ?? '')

  /** 현재 미리보기 파일 탭 */
  let activeFileTab = $state(files[0]?.fileName ?? '')

  /** 파일별 옵션 값 맵 */
  let fileOptionValues = $state<Record<string, Record<string, unknown>>>({})

  /** 파일별 touched 키 맵 */
  let fileTouchedKeys = $state<Record<string, Set<string>>>({})

  // ---------------------------------------------------------------------------
  // 초기화 — 각 파일의 프리셋 값으로 optionValues 설정
  // ---------------------------------------------------------------------------

  const initFileStates = () => {
    const { values, touched } = initializeFileStates(files)
    fileOptionValues = values
    fileTouchedKeys = touched
  }

  // 최초 초기화
  initFileStates()

  // ---------------------------------------------------------------------------
  // 파생 상태
  // ---------------------------------------------------------------------------

  /** 활성화된 파일 이름 목록 */
  let activeFileNames = $derived(
    files.filter((f) => enabledFileMap[f.fileName]).map((f) => f.fileName),
  )

  /** 파일별 core 옵션 섹션 (섹션 구분 유지) */
  const getCoreSections = (slug: string): NewOptionSection[] => {
    const definition = getOptionDefinition(slug)
    if (!definition) return []
    return definition.sections
      .map((s) => ({
        ...s,
        controls: s.controls.filter((c) => c.tier === 'core'),
      }))
      .filter((s) => s.controls.length > 0)
  }

  /** 활성 파일들의 생성 코드 맵 */
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

  /** 현재 탭의 미리보기 코드 */
  let currentPreviewCode = $derived(generatedFiles[activeFileTab] ?? '')

  // ---------------------------------------------------------------------------
  // 핸들러
  // ---------------------------------------------------------------------------

  /** 파일 체크박스 토글 */
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

  /** 아코디언 토글 — 열면 미리보기 탭도 동기화 */
  const handleAccordionToggle = (fileName: string) => {
    if (openAccordion === fileName) {
      openAccordion = ''
    } else {
      openAccordion = fileName
      activeFileTab = fileName
    }
  }

  /** 미리보기 탭 변경 — 아코디언도 동기화 */
  const handleTabChange = (fileName: string) => {
    activeFileTab = fileName
    openAccordion = fileName
  }

  /** 파일별 옵션 변경 핸들러 */
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

  /** 컨트롤의 현재 값을 조회한다 */
  const getControlValue = (slug: string, control: OptionControl): unknown => {
    const values = fileOptionValues[slug]
    if (values && control.key in values) return values[control.key]
    return control.default
  }

  /** ZIP 다운로드 */
  const handleDownloadZip = () => downloadFilesAsZip(generatedFiles)

  /** 공유 URL 생성 */
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

  /** URL 파라미터에서 옵션 복원 */
  onMount(() => {
    const params = new URLSearchParams(window.location.search)
    const decoded = decodeStackGeneratorUrl(params)

    if (decoded.disabled.length > 0) {
      const newEnabledMap = { ...enabledFileMap }
      for (const slug of decoded.disabled) {
        const file = files.find((f) => f.slug === slug)
        if (file) {
          newEnabledMap[file.fileName] = false
        }
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
          {@const icon = getFileIcon(file.fileName)}
          {@const isOpen = openAccordion === file.fileName}
          {@const isEnabled = enabledFileMap[file.fileName]}
          {@const coreSections = getCoreSections(file.slug)}

          <div class="border-b border-border">
            <!-- 아코디언 헤더 — 스크롤 시 상단 고정 -->
            <div class="sticky top-0 z-10 flex items-center gap-2 bg-white py-3 px-2">
              <input
                type="checkbox"
                checked={isEnabled}
                onchange={(e) => handleFileToggle(file.fileName, e)}
                class="h-4 w-4 shrink-0 accent-primary"
              />
              <button
                type="button"
                class="flex flex-1 cursor-pointer items-center gap-2 text-left"
                onclick={() => handleAccordionToggle(file.fileName)}
                disabled={!isEnabled}
              >
                {#if icon}
                  <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill={icon.color}>
                    <path d={icon.path} />
                  </svg>
                {/if}
                <span
                  class="font-mono text-sm font-semibold text-gray-800 {!isEnabled
                    ? 'opacity-40'
                    : ''}"
                >
                  {file.fileName}
                </span>
                <span class="ml-auto text-xs text-gray-400">{file.preset}</span>
                <svg
                  class="h-4 w-4 shrink-0 text-gray-400 transition-transform {isOpen
                    ? 'rotate-180'
                    : ''} {!isEnabled ? 'opacity-40' : ''}"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- 아코디언 바디: core 옵션 -->
            {#if isOpen && isEnabled}
              <div class="px-4 pb-4">
                {#if coreSections.length === 0}
                  <p class="text-xs text-gray-400">
                    {locale === 'ko' ? '프리셋 기반으로 생성됩니다.' : 'Generated from preset.'}
                  </p>
                {:else}
                  {#each coreSections as section (section.titleEn)}
                    <div class="mb-4">
                      <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {locale === 'ko' ? section.title : section.titleEn}
                      </p>
                      <div class="flex flex-col gap-3">
                        {#each section.controls as control (control.key)}
                          {#if control.type === 'radio'}
                            <RadioControl
                              {control}
                              value={getControlValue(file.slug, control) as string}
                              {locale}
                              onchange={(key, value) => handleOptionChange(file.slug, key, value)}
                            />
                          {:else if control.type === 'checkbox'}
                            <CheckboxControl
                              {control}
                              value={getControlValue(file.slug, control) as boolean}
                              {locale}
                              onchange={(key, value) => handleOptionChange(file.slug, key, value)}
                            />
                          {:else if control.type === 'select'}
                            <SelectControl
                              {control}
                              value={getControlValue(file.slug, control) as string}
                              {locale}
                              onchange={(key, value) => handleOptionChange(file.slug, key, value)}
                            />
                          {:else if control.type === 'number'}
                            <NumberControl
                              {control}
                              value={getControlValue(file.slug, control) as number | null}
                              {locale}
                              onchange={(key, value) => handleOptionChange(file.slug, key, value)}
                            />
                          {:else if control.type === 'text'}
                            <TextControl
                              {control}
                              value={getControlValue(file.slug, control) as string}
                              {locale}
                              onchange={(key, value) => handleOptionChange(file.slug, key, value)}
                            />
                          {:else if control.type === 'tags'}
                            <TagsControl
                              {control}
                              value={getControlValue(file.slug, control) as string[]}
                              {locale}
                              onchange={(key, value) => handleOptionChange(file.slug, key, value)}
                            />
                          {:else if control.type === 'key-value'}
                            <KeyValueControl
                              {control}
                              value={getControlValue(file.slug, control) as Record<string, string>}
                              {locale}
                              onchange={(key, value) => handleOptionChange(file.slug, key, value)}
                            />
                          {/if}
                        {/each}
                      </div>
                    </div>
                  {/each}
                {/if}
              </div>
            {/if}
          </div>
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
