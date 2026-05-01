<script lang="ts">
  import { getTranslation, type Locale } from '@/i18n'

  import { generateAiConfig } from '@/lib/generators/aiConfig/generateAll'
  import type { AiConfigInput } from '@/types/aiConfig'

  import AiConfigFileTree from './AiConfigFileTree.svelte'
  import HiddenFilesNotice from './HiddenFilesNotice.svelte'
  import {
    buildFileTree,
    downloadAiConfigAsZip,
    flattenOutput,
    type FlatFile,
  } from './modules/aiConfigGeneratorLogic'

  interface Props {
    locale: Locale
    input: AiConfigInput
    /** 입력이 출력을 만들 수 있는 상태인지 (도구 1개 이상 선택) */
    ready: boolean
    /**
     * 부모가 옵션 토글에 따라 영향받는 파일을 지정해 자동 활성화한다.
     * 객체 래퍼를 사용해 같은 path로 연속 토글해도 effect가 매번 트리거되도록 한다.
     * 매칭되는 파일이 없으면 현재 활성 파일을 유지한다.
     */
    focusSignal?: { path: string } | null
  }

  const { locale, input, ready, focusSignal = null }: Props = $props()

  const output = $derived(generateAiConfig(input))
  const files = $derived<readonly FlatFile[]>(flattenOutput(output))
  const tree = $derived(buildFileTree(files))

  let activePath = $state<string | null>(null)

  $effect(() => {
    if (!focusSignal) return
    if (files.some((f) => f.path === focusSignal.path)) {
      activePath = focusSignal.path
    }
  })

  const activeFile = $derived(files.find((f) => f.path === activePath) ?? files[0] ?? null)

  function handleSelectFile(path: string) {
    activePath = path
  }

  let downloading = $state(false)
  async function handleDownload() {
    if (!ready || downloading) return
    downloading = true
    try {
      await downloadAiConfigAsZip(input)
    } finally {
      setTimeout(() => {
        downloading = false
      }, 200)
    }
  }

  // ⓘ 정보 아이콘 popover 상태 (모바일 tap 대응)
  let infoOpen = $state(false)
  let infoContainer = $state<HTMLElement | null>(null)

  function toggleInfo() {
    infoOpen = !infoOpen
  }

  $effect(() => {
    if (!infoOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (!infoContainer) return
      if (!infoContainer.contains(event.target as Node)) {
        infoOpen = false
      }
    }
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') infoOpen = false
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeydown)
    }
  })

  const t = (key: string) => getTranslation(locale, `aiConfig.output.${key}`)
</script>

{#if !ready}
  <div
    class="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-gray-50 p-8 text-center"
  >
    <span class="text-2xl" aria-hidden="true">🛠</span>
    <p class="text-sm font-medium text-gray-700">{t('emptyTitle')}</p>
    <p class="text-xs text-gray-500">{t('emptyHint')}</p>
  </div>
{:else}
  <div class="flex h-full flex-col gap-4">
    <!-- 파일 트리 + ZIP 다운로드 -->
    <section class="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-white p-3">
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-sm font-semibold text-gray-900">
          {t('filesCountPrefix')} ({files.length}{t('filesCountSuffix')})
        </h3>
        <div class="flex items-center gap-1">
          <!-- ⓘ 정보 아이콘 (모바일 tap 대응) -->
          <div bind:this={infoContainer} class="relative">
            <button
              type="button"
              aria-label={t('infoButtonLabel')}
              aria-expanded={infoOpen}
              onclick={toggleInfo}
              class="flex size-7 items-center justify-center rounded-full border border-border bg-white text-gray-600 hover:border-primary/50 hover:text-primary"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-4"
              >
                <circle cx="10" cy="10" r="8" />
                <path d="M10 13.5V9.5" />
                <circle cx="10" cy="6.8" r="0.6" fill="currentColor" />
              </svg>
            </button>
            {#if infoOpen}
              <div
                role="dialog"
                class="fixed inset-x-3 bottom-3 z-20 rounded-lg border border-gray-200 bg-white p-3 shadow-lg sm:absolute sm:inset-x-auto sm:bottom-full sm:right-0 sm:mb-2 sm:w-72"
              >
                <HiddenFilesNotice {locale} />
              </div>
            {/if}
          </div>

          <!-- ZIP 다운로드 버튼 (데스크톱 hover 툴팁 포함) -->
          <div class="group relative">
            <button
              type="button"
              onclick={handleDownload}
              disabled={downloading}
              class="rounded bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {downloading ? t('downloading') : t('downloadZip')}
            </button>
            <div
              role="tooltip"
              class="pointer-events-none absolute right-0 bottom-full z-10 mb-2 hidden w-72 rounded-lg border border-gray-200 bg-white p-3 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 md:block"
            >
              <HiddenFilesNotice {locale} />
            </div>
          </div>
        </div>
      </div>
      <AiConfigFileTree
        {locale}
        nodes={tree}
        {files}
        activePath={activeFile?.path ?? null}
        onSelectFile={handleSelectFile}
      />
    </section>

    <!-- 파일 미리보기 -->
    <section
      class="flex min-h-0 min-w-0 flex-1 flex-col gap-2 rounded-lg border border-border bg-white p-3"
    >
      <div class="flex items-center justify-between border-b border-border pb-2">
        <h3 class="font-mono text-xs font-medium text-gray-700">
          {activeFile?.path ?? ''}
        </h3>
      </div>
      {#if activeFile}
        <pre
          class="overflow-auto rounded bg-gray-50 p-3 text-[11px] leading-relaxed whitespace-pre-wrap wrap-break-word text-gray-800"><code
            >{activeFile.content}</code
          ></pre>
      {/if}
    </section>
  </div>
{/if}
