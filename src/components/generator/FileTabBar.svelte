<script lang="ts">
  /** 파일 탭 바를 렌더링한다. 활성화된 파일만 탭으로 표시한다. */
  interface Props {
    fileNames: string[]
    activeTab: string
    ontabchange: (fileName: string) => void
  }

  let { fileNames, activeTab, ontabchange }: Props = $props()
</script>

<div class="overflow-x-auto border-b border-gray-700">
  <div class="flex">
    {#each fileNames as fileName (fileName)}
      <button
        type="button"
        class="shrink-0 border-b-2 px-4 py-2.5 font-mono text-xs font-medium transition-colors {fileName ===
        activeTab
          ? 'border-primary bg-gray-800 text-white'
          : 'border-transparent text-gray-500 hover:bg-gray-800/50 hover:text-gray-300'}"
        onclick={() => ontabchange(fileName)}
      >
        {fileName}
      </button>
    {/each}
  </div>
</div>
