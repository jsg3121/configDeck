<script lang="ts">
  interface Props {
    current: 1 | 2 | 3 | 4
    total: number
    labels: readonly string[]
  }

  const { current, total, labels }: Props = $props()
</script>

<nav
  aria-label="단계 진행"
  class="flex items-center gap-2 rounded-lg border border-border bg-white p-3 text-xs"
>
  {#each labels as label, idx (label)}
    {@const stepNum = idx + 1}
    {@const isCurrent = stepNum === current}
    {@const isCompleted = stepNum < current}
    <div class="flex items-center gap-1.5">
      <span
        aria-current={isCurrent ? 'step' : undefined}
        class="flex size-6 items-center justify-center rounded-full border text-[11px] font-semibold {isCompleted
          ? 'border-primary bg-primary text-white'
          : isCurrent
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border bg-white text-gray-400'}"
      >
        {stepNum}
      </span>
      <span class={isCurrent ? 'font-medium text-gray-900' : 'text-gray-500'}>
        {label}
      </span>
    </div>
    {#if stepNum < total}
      <span class="h-px flex-1 bg-border" aria-hidden="true"></span>
    {/if}
  {/each}
</nav>
