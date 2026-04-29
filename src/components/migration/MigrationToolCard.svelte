<script lang="ts">
  /**
   * 마이그레이션 허브의 도구 카드.
   * `/migration/index` 페이지에서 ESLint / Prettier / TSConfig 진입점을 표시한다.
   *
   * SPEC-0004 §3.2.2 — 도구 선택 (Phase C 10단계, 결정 6).
   *
   * 정적 카드라 본 컴포넌트는 인터랙션 없이 props만 받는다.
   * `<a>` 래핑으로 카드 전체가 클릭 가능하다.
   */

  interface Props {
    href: string
    name: string
    tagline: string
    description: string
    ctaLabel: string
    iconColor?: 'eslint' | 'prettier' | 'tsconfig'
  }

  let { href, name, tagline, description, ctaLabel, iconColor = 'eslint' }: Props = $props()

  /**
   * 도구별 강조 색상.
   * 도구 정체성을 살리되 톤을 통일하기 위해 *bg/text 조합을 한정한다.
   */
  const ICON_STYLES = {
    eslint: 'bg-purple-50 text-purple-700',
    prettier: 'bg-orange-50 text-orange-700',
    tsconfig: 'bg-blue-50 text-blue-700',
  } as const
</script>

<a
  {href}
  class="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition hover:border-primary hover:shadow-sm"
>
  <div class="flex items-center gap-3">
    <span
      class="inline-flex h-10 w-10 items-center justify-center rounded-lg font-mono text-sm font-bold {ICON_STYLES[
        iconColor
      ]}"
      aria-hidden="true"
    >
      {name.charAt(0)}
    </span>
    <div>
      <h3 class="text-base font-semibold text-gray-900">{name}</h3>
      <p class="text-xs text-gray-500">{tagline}</p>
    </div>
  </div>

  <p class="mt-4 flex-1 text-sm text-gray-600">{description}</p>

  <span
    class="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-1.5"
  >
    {ctaLabel}
    <svg
      class="h-4 w-4 transition-transform group-hover:translate-x-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </span>
</a>
