<script lang="ts">
  /**
   * 스택별 생성기의 인터랙티브 영역 전체를 담당한다.
   * 파일 체크리스트 on/off, 파일 탭 미리보기, ZIP 다운로드를 관리한다.
   * 각 파일의 코드는 신규 프리셋 값을 기반으로 generateConfigBySlug로 생성한다.
   */
  import { getFileIcon } from '@/lib/data/icons'
  import type { StackFile } from '@/lib/data/stacks'
  import { generateConfigBySlug } from '@/lib/generators'
  import { getPresetDefaultsBySlug } from '@/lib/schemas'

  import CodePreview from './CodePreview.svelte'
  import FileTabBar from './FileTabBar.svelte'

  interface Props {
    locale: string
    files: StackFile[]
  }

  let { locale, files }: Props = $props()

  /** 파일별 활성화 상태 */
  let enabledFileMap = $state<Record<string, boolean>>(
    Object.fromEntries(files.map((f) => [f.fileName, true])),
  )
  /** 현재 미리보기 파일 탭 */
  let activeFileTab = $state(files[0]?.fileName ?? '')

  /** 활성화된 파일 이름 목록 */
  let activeFileNames = $derived(
    files.filter((f) => enabledFileMap[f.fileName]).map((f) => f.fileName),
  )

  /** 활성 파일들의 생성 코드 맵 — 프리셋 값으로 코드를 생성한다 */
  let generatedFiles = $derived.by(() => {
    const result: Record<string, string> = {}
    for (const file of files) {
      if (!enabledFileMap[file.fileName]) continue
      const presetValues = getPresetDefaultsBySlug(file.slug, file.preset) as Record<
        string,
        unknown
      >
      const output = generateConfigBySlug(file.slug, presetValues)
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
    if (!target.checked && activeFileTab === fileName) {
      const firstActive = files.find((f) => f.fileName !== fileName && enabledFileMap[f.fileName])
      if (firstActive) activeFileTab = firstActive.fileName
    }
  }

  /** 미리보기 탭 변경 핸들러 */
  const handleTabChange = (fileName: string) => {
    activeFileTab = fileName
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
  let presetLabel = $derived(locale === 'ko' ? '프리셋' : 'Preset')
</script>

<div class="mx-auto flex max-w-7xl flex-col lg:flex-row">
  <!-- 좌측 패널: 설정 -->
  <div class="w-full lg:h-[calc(100vh-65px)] lg:w-1/2 lg:overflow-y-auto">
    <div class="mx-auto max-w-full px-6 py-8">
      <!-- 포함 파일 체크리스트 -->
      <div class="border-b border-border pb-6">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {includedFilesLabel}
        </h2>
        <div class="mt-4 flex flex-col gap-3">
          {#each files as file (file.fileName)}
            {@const icon = getFileIcon(file.fileName)}
            <label class="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={enabledFileMap[file.fileName]}
                onchange={(e) => handleFileToggle(file.fileName, e)}
                class="h-4 w-4 rounded border-gray-300 text-primary accent-primary"
              />
              <div class="flex items-center gap-2">
                {#if icon}
                  <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill={icon.color}>
                    <path d={icon.path} />
                  </svg>
                {/if}
                <span class="font-mono text-sm text-gray-700">{file.fileName}</span>
              </div>
              <span class="ml-auto text-xs text-gray-400">
                {presetLabel}: {file.preset}
              </span>
            </label>
          {/each}
        </div>
      </div>
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
        ontabchange={handleTabChange}
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
