<script lang="ts">
  import type { AiConfigStackSlug } from '@/types/aiConfig'

  interface Props {
    value: AiConfigStackSlug
    onChange: (slug: AiConfigStackSlug) => void
  }

  const { value, onChange }: Props = $props()

  // Phase A 지원 4종 (M1 카탈로그와 일치)
  const STACKS: readonly { slug: AiConfigStackSlug; name: string; description: string; icon: string }[] = [
    {
      slug: 'react-vite-ts',
      name: 'React + Vite + TS',
      description: 'Vite로 번들링하는 TypeScript React 프로젝트',
      icon: '⚛',
    },
    {
      slug: 'nextjs',
      name: 'Next.js + TypeScript',
      description: 'App Router 기반 Next.js 프로젝트',
      icon: '▲',
    },
    {
      slug: 'astro',
      name: 'Astro',
      description: '아일랜드 아키텍처 정적 사이트',
      icon: '🚀',
    },
    {
      slug: 'nodejs',
      name: 'Node.js',
      description: 'TypeScript 기반 Node.js 서버/CLI',
      icon: '🟢',
    },
  ]
</script>

<fieldset class="flex flex-col gap-3">
  <legend class="sr-only">스택 선택</legend>
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {#each STACKS as stack (stack.slug)}
      {@const selected = stack.slug === value}
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onclick={() => onChange(stack.slug)}
        class="flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors {selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border bg-white hover:border-primary/50'}"
      >
        <div class="flex w-full items-center justify-between">
          <span class="flex items-center gap-2 font-semibold text-gray-900">
            <span aria-hidden="true">{stack.icon}</span>
            {stack.name}
          </span>
          {#if selected}
            <span aria-hidden="true" class="text-primary">✓</span>
          {/if}
        </div>
        <span class="text-xs text-gray-600">{stack.description}</span>
      </button>
    {/each}
  </div>
</fieldset>
