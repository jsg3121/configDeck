<script lang="ts">
  /**
   * 스택별 생성기의 인터랙티브 영역 전체를 담당한다.
   * 파일 체크리스트 on/off, 파일별 옵션 아코디언, 파일 탭 미리보기를 관리한다.
   */
  import { generateConfigBySlug } from '@/lib/generators'
  import { getPresetDefaultsBySlug } from '@/lib/schemas'

  import CodePreview from './CodePreview.svelte'
  import FileTabBar from './FileTabBar.svelte'

  interface FileOption {
    label: string
    value: string
    checked: boolean
  }

  interface IncludedFile {
    fileName: string
    slug: string
    options: FileOption[]
  }

  interface Props {
    locale: string
    includedFiles: IncludedFile[]
  }

  let { locale, includedFiles }: Props = $props()

  /** 파일별 활성화 상태 */
  let enabledFileMap = $state<Record<string, boolean>>({})
  /** 파일별 옵션 상태 (mutable deep copy) */
  let fileOptions = $state<IncludedFile[]>([])
  /** 현재 미리보기 파일 탭 */
  let activeFileTab = $state('')

  // 초기값 설정 — props를 클로저 내에서 참조하여 반응성 경고 방지
  $effect(() => {
    if (fileOptions.length === 0) {
      enabledFileMap = Object.fromEntries(includedFiles.map((f) => [f.fileName, true]))
      fileOptions = JSON.parse(JSON.stringify(includedFiles))
      activeFileTab = includedFiles[0].fileName
    }
  })

  /** 활성화된 파일 이름 목록 */
  let activeFileNames = $derived(
    includedFiles.filter((f) => enabledFileMap[f.fileName]).map((f) => f.fileName),
  )

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

  /** 활성 파일들의 생성 코드 맵 — 프리셋 기본값에 UI 옵션을 병합하여 생성한다 */
  let generatedFiles = $derived.by(() => {
    const result: Record<string, string> = {}
    for (const file of fileOptions) {
      if (!enabledFileMap[file.fileName]) continue
      const defaults = JSON.parse(
        JSON.stringify(
          getPresetDefaultsBySlug(file.slug, 'Recommended') as Record<string, unknown>,
        ),
      )
      for (const opt of file.options) {
        const camelKey = toCamelCase(opt.value)
        setNestedValue(defaults, camelKey, opt.checked)
      }
      const output = generateConfigBySlug(file.slug, defaults)
      result[file.fileName] = output.code
    }
    return result
  })

  /** 현재 탭의 미리보기 코드 */
  let currentPreviewCode = $derived(generatedFiles[activeFileTab] ?? '')

  /** 파일 체크리스트 토글 핸들러 */
  const handleFileToggle = (fileName: string, event: Event) => {
    const target = event.target as HTMLInputElement
    enabledFileMap = { ...enabledFileMap, [fileName]: target.checked }
    // 비활성화된 파일이 현재 탭이면 첫 번째 활성 파일로 전환
    if (!target.checked && activeFileTab === fileName) {
      const firstActive = includedFiles.find(
        (f) => f.fileName !== fileName && enabledFileMap[f.fileName],
      )
      if (firstActive) activeFileTab = firstActive.fileName
    }
  }

  /** 아코디언 옵션 변경 핸들러 */
  const handleOptionChange = (fileIndex: number, optionValue: string, event: Event) => {
    const target = event.target as HTMLInputElement
    fileOptions[fileIndex] = {
      ...fileOptions[fileIndex],
      options: fileOptions[fileIndex].options.map((o) =>
        o.value === optionValue ? { ...o, checked: target.checked } : o,
      ),
    }
  }

  /** ZIP 다운로드 핸들러 */
  const handleDownloadZip = async () => {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    for (const [fileName, code] of Object.entries(generatedFiles)) {
      zip.file(fileName, code)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'config-files.zip'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  let includedFilesLabel = $derived(locale === 'ko' ? '포함 파일' : 'Included Files')
</script>

<div class="mx-auto flex max-w-7xl flex-col lg:flex-row">
  <!-- 좌측 패널: 설정 -->
  <div class="w-full lg:h-[calc(100vh-65px)] lg:w-1/2 lg:overflow-y-auto">
    <div class="mx-auto max-w-xl px-6 py-8">
      <!-- 포함 파일 체크리스트 -->
      <fieldset class="border-b border-border pb-6">
        <legend class="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {includedFilesLabel}
        </legend>
        <div class="mt-3 flex flex-col gap-2.5">
          {#each includedFiles as file (file.fileName)}
            <label class="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={enabledFileMap[file.fileName]}
                onchange={(e) => handleFileToggle(file.fileName, e)}
                class="h-4 w-4 rounded border-gray-300 text-primary accent-primary"
              />
              <span class="font-mono text-sm text-gray-700">{file.fileName}</span>
            </label>
          {/each}
        </div>
      </fieldset>

      <!-- 파일별 옵션 아코디언 -->
      {#each fileOptions as file, fileIndex (file.fileName)}
        {#if enabledFileMap[file.fileName]}
          <details open={fileIndex < 2} class="group border-b border-border py-5">
            <summary class="flex cursor-pointer select-none items-center justify-between">
              <span class="text-sm font-semibold text-gray-900">{file.fileName}</span>
              <svg
                class="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="mt-4 flex flex-col gap-3 pl-1">
              {#each file.options as option (option.value)}
                <label class="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onchange={(e) => handleOptionChange(fileIndex, option.value, e)}
                    class="h-4 w-4 rounded border-gray-300 text-primary accent-primary"
                  />
                  <span class="text-sm text-gray-700">{option.label}</span>
                </label>
              {/each}
            </div>
          </details>
        {/if}
      {/each}
    </div>
  </div>

  <!-- 우측 패널: 파일 탭 + 미리보기 -->
  <div
    class="w-full border-t border-border lg:sticky lg:top-0 lg:h-screen lg:w-1/2 lg:border-t-0 lg:border-l"
  >
    <div class="flex h-full flex-col bg-code-bg">
      <FileTabBar
        fileNames={activeFileNames}
        activeTab={activeFileTab}
        ontabchange={(name) => (activeFileTab = name)}
      />
      <CodePreview
        fileName={activeFileTab}
        code={currentPreviewCode}
        {locale}
        showZipDownload={true}
        ondownloadzip={handleDownloadZip}
      />
    </div>
  </div>
</div>
