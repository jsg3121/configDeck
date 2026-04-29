<script lang="ts">
  /**
   * TSConfig 페이지 전용 안내 배너.
   * 결정 7에 따라 두 가지 variant를 지원한다:
   * - `variant='top'` — 파란 info 계열, 페이지 상단에 표시. 권장값이 정답이 아니라는 중립 안내.
   * - `variant='result'` — 황색 warning 계열, 진단 결과 옆에 표시. 프로젝트 맥락 판단 요청.
   *
   * 카피는 i18n에서 가져오며 영문/한국어 모두 작성되어 있다.
   *
   * SPEC-0004 §3.2.2 / 결정 7.
   */
  import { getTranslation } from '@/i18n'
  import type { Locale } from '@/i18n'

  type Variant = 'top' | 'result'

  interface Props {
    locale: Locale
    variant: Variant
  }

  let { locale, variant }: Props = $props()

  let title = $derived(
    variant === 'top'
      ? getTranslation(locale, 'migration.tsconfigDisclaimer.topTitle')
      : getTranslation(locale, 'migration.tsconfigDisclaimer.resultTitle'),
  )
  let body = $derived(
    variant === 'top'
      ? getTranslation(locale, 'migration.tsconfigDisclaimer.topBody')
      : getTranslation(locale, 'migration.tsconfigDisclaimer.resultBody'),
  )

  /**
   * 색상 토큰을 variant별로 분리한다.
   * Tailwind v4 환경에서 동적 클래스명은 추출되지 않으므로
   * 정적 문자열로 두 세트를 모두 명시한다.
   */
  const STYLES = {
    top: {
      container: 'border-blue-200 bg-blue-50 text-blue-800',
      icon: 'text-blue-500',
      title: 'text-blue-900',
    },
    result: {
      container: 'border-amber-200 bg-amber-50 text-amber-800',
      icon: 'text-amber-500',
      title: 'text-amber-900',
    },
  } as const

  const style = $derived(STYLES[variant])
</script>

<aside class="rounded-md border {style.container} p-4" role="note">
  <div class="flex items-start gap-3">
    <svg
      class="mt-0.5 h-5 w-5 shrink-0 {style.icon}"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      {#if variant === 'top'}
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      {:else}
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      {/if}
    </svg>
    <div class="flex-1">
      <h3 class="text-sm font-semibold {style.title}">{title}</h3>
      <p class="mt-1 text-sm leading-relaxed">{body}</p>
    </div>
  </div>
</aside>
