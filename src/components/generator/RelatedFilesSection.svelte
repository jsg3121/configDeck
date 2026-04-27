<script lang="ts">
  /**
   * 관련 설정 파일 추천 섹션.
   * 현재 설정 파일과 함께 사용하면 좋은 파일들을 카드로 표시한다.
   */

  interface RelatedFile {
    slug: string
    fileName: string
    descriptionEn: string
    descriptionKo: string
    href: string
  }

  interface Props {
    files: RelatedFile[]
    locale: string
  }

  let { files, locale }: Props = $props()

  const getDescription = (file: RelatedFile): string =>
    locale === 'ko' ? file.descriptionKo : file.descriptionEn

  let title = $derived(locale === 'ko' ? '함께 쓰면 좋아요' : 'Goes well with')
</script>

<aside class="mt-10 border-t border-border pt-8">
  <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-600">
    {title}
  </h3>
  <ul class="mt-4 flex flex-col gap-3">
    {#each files as related (related.slug)}
      <li>
        <a
          href={related.href}
          class="group flex items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-[transform,box-shadow,border-color] duration-200 hover:border-primary hover:shadow-md motion-safe:hover:-translate-y-0.5"
        >
          <div
            class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gray-100 transition-colors group-hover:bg-primary/10"
          >
            <svg
              class="h-4 w-4 text-gray-500 transition-colors group-hover:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-mono text-sm font-semibold text-gray-900 group-hover:text-primary">
              {related.fileName}
            </p>
            <p class="mt-1 text-xs leading-relaxed text-gray-500">
              {getDescription(related)}
            </p>
          </div>
        </a>
      </li>
    {/each}
  </ul>
</aside>
