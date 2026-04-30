<script lang="ts">
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

  const { input, ready, focusSignal = null }: Props = $props()

  const output = $derived(generateAiConfig(input))
  const files = $derived<readonly FlatFile[]>(flattenOutput(output))
  const tree = $derived(buildFileTree(files))

  let activePath = $state<string | null>(null)

  // 부모가 focusSignal을 갱신할 때마다 activePath로 동기화 (객체 참조 변경으로 effect 재실행)
  $effect(() => {
    if (!focusSignal) return
    if (files.some((f) => f.path === focusSignal.path)) {
      activePath = focusSignal.path
    }
  })

  // 활성 파일 자동 폴백 — activePath가 더 이상 존재하지 않으면 첫 파일
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
      // 짧은 시각 피드백 유지
      setTimeout(() => {
        downloading = false
      }, 200)
    }
  }

  // ⓘ 정보 아이콘 popover 상태 (모바일 tap 대응) — 데스크톱 hover 툴팁과 별도 동작
  let infoOpen = $state(false)
  let infoContainer = $state<HTMLElement | null>(null)

  function toggleInfo() {
    infoOpen = !infoOpen
  }

  // 외부 클릭/ESC로 popover 닫기
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
</script>

{#if !ready}
  <div
    class="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-gray-50 p-8 text-center"
  >
    <span class="text-2xl" aria-hidden="true">🛠</span>
    <p class="text-sm font-medium text-gray-700">
      스택과 도구를 선택하면 생성될 파일이 여기에 표시됩니다
    </p>
    <p class="text-xs text-gray-500">← 좌측에서 Step 1과 Step 4를 완료해주세요</p>
  </div>
{:else}
  <div class="flex h-full flex-col gap-4">
    <!-- 파일 트리 + ZIP 다운로드 -->
    <section class="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-white p-3">
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-sm font-semibold text-gray-900">생성될 파일 ({files.length}개)</h3>
        <div class="flex items-center gap-1">
          <!-- ⓘ 정보 아이콘 (모바일 tap 대응) -->
          <div bind:this={infoContainer} class="relative">
            <button
              type="button"
              aria-label="숨김 파일 안내 보기"
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
              <!--
                모바일(<sm): 화면 좌우에서 12px 여백 둔 폭(=뷰포트-1.5rem). 우측 끝에 정렬해
                ⓘ 버튼과 시각적 연결을 유지하되 좌측이 화면을 벗어나지 않도록 한다.
                데스크톱(>=sm): 버튼 우측 위쪽에 18rem 폭으로 정렬.
              -->
              <div
                role="dialog"
                class="absolute right-0 top-full z-20 mt-2 w-[calc(100vw-1.5rem)] max-w-xs rounded-lg border border-gray-200 bg-white p-3 shadow-lg sm:bottom-full sm:top-auto sm:mt-0 sm:mb-2 sm:w-72 sm:max-w-none"
              >
                <HiddenFilesNotice />
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
              {downloading ? '다운로드 중...' : '전체 ZIP 다운로드'}
            </button>
            <!-- hover 시 버튼 위에 툴팁 -->
            <div
              role="tooltip"
              class="pointer-events-none absolute right-0 bottom-full z-10 mb-2 hidden w-72 rounded-lg border border-gray-200 bg-white p-3 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 md:block"
            >
              <HiddenFilesNotice />
            </div>
          </div>
        </div>
      </div>
      <AiConfigFileTree
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
