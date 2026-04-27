<script lang="ts">
  /**
   * 스택 생성기의 파일별 아코디언 아이템 컴포넌트.
   * 체크박스, 파일명, 프리셋, core 옵션 폼을 렌더링한다.
   */
  import { getFileIcon } from '@/lib/data/icons'
  import type { OptionControl, OptionSection } from '@/types/generator'

  import OptionControlRenderer from './OptionControlRenderer.svelte'

  interface Props {
    fileName: string
    preset: string
    isOpen: boolean
    isEnabled: boolean
    coreSections: OptionSection[]
    locale: string
    getControlValue: (control: OptionControl) => unknown
    ontoggle: () => void
    onenabledchange: (event: Event) => void
    onoptionchange: (key: string, value: unknown) => void
  }

  let {
    fileName,
    preset,
    isOpen,
    isEnabled,
    coreSections,
    locale,
    getControlValue,
    ontoggle,
    onenabledchange,
    onoptionchange,
  }: Props = $props()

  const icon = getFileIcon(fileName)
</script>

<div class="border-b border-border">
  <!-- 아코디언 헤더 -->
  <div class="sticky top-0 z-10 flex items-center gap-2 bg-white py-3 px-2">
    <input
      type="checkbox"
      checked={isEnabled}
      onchange={onenabledchange}
      class="h-4 w-4 shrink-0 accent-primary"
    />
    <button
      type="button"
      class="flex flex-1 cursor-pointer items-center gap-2 text-left"
      onclick={ontoggle}
      disabled={!isEnabled}
    >
      {#if icon}
        <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill={icon.color}>
          <path d={icon.path} />
        </svg>
      {/if}
      <span class="font-mono text-sm font-semibold text-gray-800 {!isEnabled ? 'opacity-40' : ''}">
        {fileName}
      </span>
      <span class="ml-auto text-xs text-gray-400">{preset}</span>
      <svg
        class="h-4 w-4 shrink-0 text-gray-400 transition-transform {isOpen
          ? 'rotate-180'
          : ''} {!isEnabled ? 'opacity-40' : ''}"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>

  <!-- 아코디언 바디: core 옵션 -->
  {#if isOpen && isEnabled}
    <div class="px-4 pb-4">
      {#if coreSections.length === 0}
        <p class="text-xs text-gray-400">
          {locale === 'ko' ? '프리셋 기반으로 생성됩니다.' : 'Generated from preset.'}
        </p>
      {:else}
        {#each coreSections as section (section.titleEn)}
          <div class="mb-4">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {locale === 'ko' ? section.title : section.titleEn}
            </p>
            <div class="flex flex-col gap-3">
              {#each section.controls as control (control.key)}
                <OptionControlRenderer
                  {control}
                  value={getControlValue(control)}
                  {locale}
                  highlighted={false}
                  onchange={onoptionchange}
                />
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
