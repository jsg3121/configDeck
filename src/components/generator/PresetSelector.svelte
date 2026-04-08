<script lang="ts">
  /** 프리셋 버튼 그룹을 렌더링한다 */
  interface Props {
    presets: string[]
    selectedPreset: string
    onpresetchange: (presetName: string) => void
  }

  let { presets, selectedPreset, onpresetchange }: Props = $props()
</script>

<div class="flex gap-2">
  {#each presets as presetName}
    <button
      type="button"
      class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors {presetName ===
      selectedPreset
        ? 'border-primary bg-primary text-white'
        : 'border-border text-gray-600 hover:border-primary hover:text-primary'}"
      onclick={() => onpresetchange(presetName)}
    >
      {presetName}
    </button>
  {/each}
</div>
