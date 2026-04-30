<script lang="ts">
  import { generateAiConfig } from '@/lib/generators/aiConfig/generateAll'
  import type { AiConfigInput } from '@/types/aiConfig'

  import AiConfigFileTree from './AiConfigFileTree.svelte'
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
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900">생성될 파일 ({files.length}개)</h3>
        <div class="group relative">
          <button
            type="button"
            onclick={handleDownload}
            disabled={downloading}
            class="rounded bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {downloading ? '다운로드 중...' : '전체 ZIP 다운로드'}
          </button>
          <!-- hover 시 버튼 위에 툴팁: macOS 숨김 파일 안내 -->
          <div
            role="tooltip"
            class="pointer-events-none absolute right-0 bottom-full z-10 mb-2 w-72 rounded-lg border border-gray-200 bg-white p-3 text-left text-xs text-gray-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
          >
            <p class="mb-1 font-semibold text-gray-900">📂 숨김 파일에 주의하세요</p>
            <p class="leading-relaxed text-gray-600">
              <code class="rounded bg-gray-100 px-1">.cursor/</code>,
              <code class="rounded bg-gray-100 px-1">.claude/</code>,
              <code class="rounded bg-gray-100 px-1">.github/</code> 같은 점(.)으로 시작하는
              폴더는 macOS Finder 기본 설정에서 숨겨져 있습니다.
            </p>
            <ul class="mt-2 flex flex-col gap-0.5 text-gray-600">
              <li>
                <span class="font-medium text-gray-800">macOS Finder</span>:
                <kbd class="rounded border border-gray-300 bg-gray-50 px-1 font-mono">⌘ + ⇧ + .</kbd>
              </li>
              <li>
                <span class="font-medium text-gray-800">VS Code / Cursor</span>: 사이드바에서 정상 표시
              </li>
              <li>
                <span class="font-medium text-gray-800">터미널</span>:
                <code class="rounded bg-gray-100 px-1">ls -la</code>
              </li>
            </ul>
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
