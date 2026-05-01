<script lang="ts">
  import { getTranslation, type Locale } from '@/i18n'

  import { copyToClipboard } from '@/components/generator/modules/codePreviewLogic'

  import type { FileTreeNode, FlatFile } from './modules/aiConfigGeneratorLogic'

  interface Props {
    locale: Locale
    nodes: readonly FileTreeNode[]
    files: readonly FlatFile[]
    activePath: string | null
    onSelectFile: (path: string) => void
  }

  const { locale, nodes, files, activePath, onSelectFile }: Props = $props()

  let copiedPath = $state<string | null>(null)

  async function handleCopy(path: string, content: string, e: Event) {
    e.stopPropagation()
    const ok = await copyToClipboard(content)
    if (!ok) return
    copiedPath = path
    setTimeout(() => {
      if (copiedPath === path) copiedPath = null
    }, 2000)
  }

  function findContent(path: string): string {
    return files.find((f) => f.path === path)?.content ?? ''
  }

  const t = (key: string) => getTranslation(locale, `aiConfig.output.${key}`)
</script>

{#snippet treeNode(node: FileTreeNode, depth: number)}
  {#if node.type === 'folder'}
    <li>
      <details open class="group">
        <summary
          style="padding-left: {depth * 12}px"
          class="flex cursor-pointer items-center gap-1 rounded py-1 text-xs text-gray-700 hover:bg-gray-50"
        >
          <span aria-hidden="true" class="text-gray-400">📁</span>
          <span class="font-mono">{node.name}/</span>
        </summary>
        <ul class="flex flex-col">
          {#each node.children as child (child.type === 'folder' ? `dir:${child.name}` : child.path)}
            {@render treeNode(child, depth + 1)}
          {/each}
        </ul>
      </details>
    </li>
  {:else}
    {@const isActive = node.path === activePath}
    {@const isCopied = copiedPath === node.path}
    <li>
      <div
        style="padding-left: {depth * 12}px"
        class="flex items-center gap-2 rounded py-1 text-xs hover:bg-gray-50 {isActive
          ? 'bg-primary/5 text-primary'
          : 'text-gray-800'}"
      >
        <button
          type="button"
          onclick={() => onSelectFile(node.path)}
          class="flex flex-1 items-center gap-1 truncate text-left"
        >
          <span aria-hidden="true" class="text-gray-400">📄</span>
          <span class="truncate font-mono">{node.name}</span>
        </button>
        <button
          type="button"
          aria-label={node.path}
          onclick={(e) => handleCopy(node.path, findContent(node.path), e)}
          class="rounded border border-border bg-white px-1.5 py-0.5 text-[11px] text-gray-600 hover:border-primary/50"
        >
          {isCopied ? t('copiedLabel') : t('copyButton')}
        </button>
      </div>
    </li>
  {/if}
{/snippet}

<ul class="flex flex-col">
  {#each nodes as node (node.type === 'folder' ? `dir:${node.name}` : node.path)}
    {@render treeNode(node, 0)}
  {/each}
</ul>
