<script lang="ts">
  import { SKILLS_CATALOG } from '@/lib/data/aiConfig'
  import type { SkillId } from '@/types/aiConfig'

  import SkillCard from './SkillCard.svelte'

  interface Props {
    selectedSkillIds: ReadonlySet<SkillId>
    onToggleSkill: (id: SkillId) => void
    onSelectAllSkills: () => void
    onDeselectAllSkills: () => void
  }

  const { selectedSkillIds, onToggleSkill, onSelectAllSkills, onDeselectAllSkills }: Props = $props()
</script>

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
