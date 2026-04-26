<script lang="ts">
  /**
   * 마이그레이션 결과 피드백 컴포넌트.
   * 에러 메시지와 경고 목록을 표시한다.
   */

  interface Props {
    locale: string
    errorMessage: string | null
    warnings: string[]
  }

  let { locale, errorMessage, warnings }: Props = $props()

  let warningLabel = $derived(locale === 'ko' ? '수동 확인 필요' : 'Manual review needed')
</script>

{#if errorMessage}
  <div class="rounded-md border border-red-200 bg-red-50 p-3">
    <div class="flex items-start gap-2">
      <svg
        class="mt-0.5 h-4 w-4 shrink-0 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-xs text-red-700">{errorMessage}</p>
    </div>
  </div>
{/if}

{#if warnings.length > 0}
  <div class="rounded-md border border-amber-200 bg-amber-50 p-3">
    <h4 class="text-xs font-semibold text-amber-800">{warningLabel}</h4>
    <ul class="mt-1.5 flex flex-col gap-1">
      {#each warnings as warning (warning)}
        <li class="text-xs text-amber-700">{warning}</li>
      {/each}
    </ul>
  </div>
{/if}
