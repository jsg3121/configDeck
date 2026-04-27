<script lang="ts">
  /**
   * 마이그레이션 결과 피드백 컴포넌트.
   * 에러 메시지, 경고 목록, 분석 결과를 표시한다.
   * info 항목은 [적용] 버튼으로 규칙 추가 가능.
   */
  import type { AuditResult, MigrationWarning } from '@/lib/migration'

  interface Props {
    locale: string
    errorMessage: string | null
    warnings: MigrationWarning[]
    auditResult?: AuditResult | null
    ondismiss?: (message: string) => void
    onapplyrule?: (ruleName: string, ruleValue: string) => void
  }

  let { locale, errorMessage, warnings, auditResult, ondismiss, onapplyrule }: Props = $props()

  let warningLabel = $derived(locale === 'ko' ? '수동 확인 필요' : 'Manual review needed')
  let suggestionsLabel = $derived(locale === 'ko' ? '개선 제안' : 'Suggestions')
  let applyLabel = $derived(locale === 'ko' ? '적용' : 'Apply')
  let dismissLabel = $derived(locale === 'ko' ? '닫기' : 'Dismiss')

  const getWarningMessage = (warning: MigrationWarning): string =>
    locale === 'ko' ? warning.messageKo : warning.message

  /** 규칙 이름 추출 (예: "no-console" 규칙 추가를 고려해보세요 → no-console) */
  const extractRuleName = (message: string): string | null => {
    const match = message.match(/["']([^"']+)["']/)
    return match ? match[1] : null
  }

  /** 권장 규칙 값 맵 */
  const RECOMMENDED_VALUES: Record<string, string> = {
    'no-console': 'warn',
    'no-debugger': 'error',
    eqeqeq: 'error',
    'no-var': 'error',
    'prefer-const': 'error',
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          text: 'text-red-700',
          button: 'text-red-600 hover:bg-red-100',
        }
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: 'text-amber-500',
          text: 'text-amber-700',
          button: 'text-amber-600 hover:bg-amber-100',
        }
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-500',
          text: 'text-blue-700',
          button: 'text-blue-600 hover:bg-blue-100',
        }
    }
  }
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
      {#each warnings as warning (warning.message)}
        <li class="text-xs text-amber-700">{getWarningMessage(warning)}</li>
      {/each}
    </ul>
  </div>
{/if}

{#if auditResult && auditResult.items.length > 0}
  <div class="flex flex-col gap-2">
    <h4 class="text-xs font-semibold text-gray-600">{suggestionsLabel}</h4>
    {#each auditResult.items as item (item.message)}
      {@const styles = getSeverityStyles(item.severity)}
      {@const ruleName = extractRuleName(item.message)}
      {@const ruleValue = ruleName ? RECOMMENDED_VALUES[ruleName] : null}
      <div class="rounded-md border {styles.border} {styles.bg} p-3">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-start gap-2 flex-1">
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
          <div class="flex items-center gap-1 shrink-0">
            {#if item.severity === 'info' && ruleName && ruleValue && onapplyrule}
              <button
                type="button"
                class="rounded px-2 py-1 text-xs font-medium {styles.button}"
                onclick={() => onapplyrule(ruleName, ruleValue)}
              >
                {applyLabel}
              </button>
            {/if}
            {#if ondismiss}
              <button
                type="button"
                class="rounded px-2 py-1 text-xs {styles.button}"
                onclick={() => ondismiss(item.message)}
              >
                {dismissLabel}
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
