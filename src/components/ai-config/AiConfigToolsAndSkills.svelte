<script lang="ts">
  import { AI_TOOLS, SKILLS_CATALOG } from '@/lib/data/aiConfig'
  import type { AiToolId, SkillId } from '@/types/aiConfig'

  import ClaudeCodeOnlyBanner from './ClaudeCodeOnlyBanner.svelte'
  import SkillCard from './SkillCard.svelte'

  interface Props {
    enabledTools: ReadonlySet<AiToolId>
    claudeCodeOnly: boolean
    selectedSkillIds: ReadonlySet<SkillId>
    onToggleTool: (id: AiToolId) => void
    onToggleClaudeCodeOnly: (next: boolean) => void
    onToggleSkill: (id: SkillId) => void
    onSelectAllSkills: () => void
    onDeselectAllSkills: () => void
  }

  const {
    enabledTools,
    claudeCodeOnly,
    selectedSkillIds,
    onToggleTool,
    onToggleClaudeCodeOnly,
    onToggleSkill,
    onSelectAllSkills,
    onDeselectAllSkills,
  }: Props = $props()

  const claudeCodeSelected = $derived(enabledTools.has('claude-code'))
  const hasOtherTools = $derived(
    Array.from(enabledTools).some((id) => id !== 'claude-code')
  )
  const showOnlyToggle = $derived(claudeCodeSelected)
</script>

<div class="flex flex-col gap-4">
  <!-- 4-1 도구 선택 -->
  <fieldset class="flex flex-col gap-2">
    <legend class="text-sm font-medium text-gray-800">사용 중인 AI 코딩 도구를 모두 선택하세요</legend>
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
      <p class="text-xs text-red-600">최소 1개 이상의 도구를 선택해주세요.</p>
    {/if}
  </fieldset>

  <!-- 4-2 Claude Code 단독 사용 토글 (CP-3) -->
  {#if showOnlyToggle}
    <div class="flex flex-col gap-2">
      <label class="flex cursor-pointer items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          checked={claudeCodeOnly}
          onchange={(e) => onToggleClaudeCodeOnly(e.currentTarget.checked)}
        />
        Claude Code만 단독으로 사용합니다
      </label>
      <ClaudeCodeOnlyBanner {claudeCodeSelected} {claudeCodeOnly} {hasOtherTools} />
    </div>
  {/if}

  <!-- 4-3 Skills 선택 -->
  <fieldset class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <legend class="text-sm font-medium text-gray-800">포함할 Agent Skills를 선택하세요</legend>
      <div class="flex gap-1 text-xs">
        <button
          type="button"
          onclick={onSelectAllSkills}
          class="rounded border border-border bg-white px-2 py-0.5 text-gray-700 hover:border-primary/50"
        >
          전체 선택
        </button>
        <button
          type="button"
          onclick={onDeselectAllSkills}
          class="rounded border border-border bg-white px-2 py-0.5 text-gray-700 hover:border-primary/50"
        >
          전체 해제
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {#each SKILLS_CATALOG as skill (skill.id)}
        <SkillCard
          id={skill.id}
          displayName={skill.displayName}
          summary={skill.summary}
          selected={selectedSkillIds.has(skill.id)}
          onToggle={onToggleSkill}
        />
      {/each}
    </div>
  </fieldset>
</div>
