<script lang="ts">
  import { getTranslation, type Locale } from '@/i18n'

  import { AI_TOOLS } from '@/lib/data/aiConfig'
  import type { AiToolId } from '@/types/aiConfig'

  import ClaudeCodeOnlyBanner from './ClaudeCodeOnlyBanner.svelte'

  interface Props {
    locale: Locale
    enabledTools: ReadonlySet<AiToolId>
    claudeCodeOnly: boolean
    onToggleTool: (id: AiToolId) => void
    onToggleClaudeCodeOnly: (next: boolean) => void
  }

  const {
    locale,
    enabledTools,
    claudeCodeOnly,
    onToggleTool,
    onToggleClaudeCodeOnly,
  }: Props = $props()

  const claudeCodeSelected = $derived(enabledTools.has('claude-code'))
  const hasOtherTools = $derived(Array.from(enabledTools).some((id) => id !== 'claude-code'))

  const t = (key: string) => getTranslation(locale, `aiConfig.step1.${key}`)
</script>

<div class="flex flex-col gap-4">
  <fieldset class="flex flex-col gap-2">
    <legend class="text-sm font-medium text-gray-800">{t('legend')}</legend>
    <div class="flex flex-wrap gap-2">
      {#each AI_TOOLS as tool (tool.id)}
        {@const selected = enabledTools.has(tool.id)}
        <button
          type="button"
          role="checkbox"
          aria-checked={selected}
          onclick={() => onToggleTool(tool.id)}
          class="rounded-full border px-3 py-1 text-xs font-medium transition-colors {selected
            ? 'border-primary bg-primary text-white'
            : 'border-border bg-white text-gray-700 hover:border-primary/50'}"
        >
          {tool.displayName}
        </button>
      {/each}
    </div>
    {#if enabledTools.size === 0}
      <p class="text-xs text-red-600">{t('minSelectError')}</p>
    {/if}
  </fieldset>

  {#if claudeCodeSelected}
    <div class="flex flex-col gap-2">
      <label class="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          checked={claudeCodeOnly}
          onchange={(e) => onToggleClaudeCodeOnly(e.currentTarget.checked)}
        />
        {t('claudeCodeOnlyToggle')}
      </label>
      <ClaudeCodeOnlyBanner {locale} {claudeCodeSelected} {claudeCodeOnly} {hasOtherTools} />
    </div>
  {/if}
</div>
