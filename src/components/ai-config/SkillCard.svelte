<script lang="ts">
  import type { SkillId } from '@/types/aiConfig'

  interface Props {
    id: SkillId
    displayName: string
    summary: string
    selected: boolean
    onToggle: (id: SkillId) => void
  }

  const { id, displayName, summary, selected, onToggle }: Props = $props()
</script>

<button
  type="button"
  onclick={() => onToggle(id)}
  aria-pressed={selected}
  class="group flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors {selected
    ? 'border-primary bg-primary/5 ring-1 ring-primary'
    : 'border-border bg-white hover:border-primary/50'}"
>
  <div class="flex w-full items-center justify-between gap-2">
    <span class="font-mono text-sm font-medium text-gray-900">{id}</span>
    {#if selected}
      <span aria-hidden="true" class="text-primary">✓</span>
    {/if}
  </div>
  <span class="text-xs font-medium text-gray-700">{displayName}</span>
  <span class="text-xs leading-relaxed text-gray-500">{summary}</span>
</button>
