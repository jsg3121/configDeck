<script lang="ts">
  /**
   * ESLint 설정 분석 결과를 표시하는 컴포넌트.
   * 에러, 경고, 정보 항목을 severity별로 구분하여 표시한다.
   */
  import type { AuditResult } from '@/lib/migration'

  interface Props {
    locale: string
    result: AuditResult | null
  }

  let { locale, result }: Props = $props()

  let summaryLabel = $derived(locale === 'ko' ? '분석 결과' : 'Analysis Result')
  let errorLabel = $derived(locale === 'ko' ? '오류' : 'Errors')
  let warningLabel = $derived(locale === 'ko' ? '경고' : 'Warnings')
  let infoLabel = $derived(locale === 'ko' ? '정보' : 'Info')
  let noIssuesLabel = $derived(locale === 'ko' ? '발견된 이슈가 없습니다!' : 'No issues found!')

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          text: 'text-red-700',
        }
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: 'text-amber-500',
          text: 'text-amber-700',
        }
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-500',
          text: 'text-blue-700',
        }
    }
  }
</script>

{#if result}
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-4 rounded-md bg-gray-100 px-4 py-2">
      <span class="text-xs font-semibold text-gray-600">{summaryLabel}</span>
      <div class="flex items-center gap-3 text-xs">
        {#if result.summary.errors > 0}
          <span class="flex items-center gap-1 text-red-600">
            <span class="font-mono font-bold">{result.summary.errors}</span>
            {errorLabel}
          </span>
        {/if}
        {#if result.summary.warnings > 0}
          <span class="flex items-center gap-1 text-amber-600">
            <span class="font-mono font-bold">{result.summary.warnings}</span>
            {warningLabel}
          </span>
        {/if}
        {#if result.summary.infos > 0}
          <span class="flex items-center gap-1 text-blue-600">
            <span class="font-mono font-bold">{result.summary.infos}</span>
            {infoLabel}
          </span>
        {/if}
      </div>
    </div>

    {#if result.items.length === 0}
      <div class="rounded-md border border-green-200 bg-green-50 p-3">
        <div class="flex items-center gap-2">
          <svg
            class="h-4 w-4 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <p class="text-xs font-medium text-green-700">{noIssuesLabel}</p>
        </div>
      </div>
    {:else}
      <div class="flex flex-col gap-2">
        {#each result.items as item (item.message)}
          {@const styles = getSeverityStyles(item.severity)}
          <div class="rounded-md border {styles.border} {styles.bg} p-3">
            <div class="flex items-start gap-2">
              {#if item.severity === 'error'}
                <svg
                  class="mt-0.5 h-4 w-4 shrink-0 {styles.icon}"
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
              {:else if item.severity === 'warning'}
                <svg
                  class="mt-0.5 h-4 w-4 shrink-0 {styles.icon}"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              {:else}
                <svg
                  class="mt-0.5 h-4 w-4 shrink-0 {styles.icon}"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              {/if}
              <div class="flex-1">
                <p class="text-xs font-medium {styles.text}">
                  {locale === 'ko' ? item.messageKo : item.message}
                </p>
                {#if item.suggestion}
                  <p class="mt-1 text-xs {styles.text} opacity-80">
                    {locale === 'ko' ? item.suggestionKo : item.suggestion}
                  </p>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
