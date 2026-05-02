<script lang="ts">
  import { getTranslation, type Locale } from '@/i18n'

  import { SKILLS_CATALOG } from '@/lib/data/aiConfig'
  import type { AiToolId, SkillId } from '@/types/aiConfig'

  import SkillCard from './SkillCard.svelte'

  interface Props {
    locale: Locale
    selectedSkillIds: ReadonlySet<SkillId>
    /**
     * Step 1에서 선택된 도구 목록.
     * Copilot/Codex가 포함된 경우 SKILL.md 호환성 안내 박스를 표시한다.
     */
    enabledTools: ReadonlySet<AiToolId>
    onToggleSkill: (id: SkillId) => void
    onSelectAllSkills: () => void
    onDeselectAllSkills: () => void
  }

  const {
    locale,
    selectedSkillIds,
    enabledTools,
    onToggleSkill,
    onSelectAllSkills,
    onDeselectAllSkills,
  }: Props = $props()

  const t = (key: string) => getTranslation(locale, `aiConfig.step2.${key}`)

  // Copilot/Codex는 .claude/skills/*/SKILL.md를 직접 읽지 않으므로 호환성 안내 표시.
  const showCompatibilityNotice = $derived(
    enabledTools.has('copilot') || enabledTools.has('codex'),
  )
</script>

<fieldset class="flex flex-col gap-2">
  {#if showCompatibilityNotice}
    <aside
      class="mb-2 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs"
      role="note"
    >
      <span class="mt-0.5 shrink-0 text-amber-600" aria-hidden="true">ⓘ</span>
      <div>
        <p class="font-semibold text-amber-900">{t('compatibilityNoticeTitle')}</p>
        <p class="mt-1 leading-relaxed text-amber-800">{t('compatibilityNoticeBody')}</p>
      </div>
    </aside>
  {/if}
  <div class="flex items-center justify-between">
    <legend class="text-sm font-medium text-gray-800">{t('legend')}</legend>
    <div class="flex gap-1 text-xs">
      <button
        type="button"
        onclick={onSelectAllSkills}
        class="rounded border border-border bg-white px-2 py-0.5 text-gray-700 hover:border-primary/50"
      >
        {t('selectAll')}
      </button>
      <button
        type="button"
        onclick={onDeselectAllSkills}
        class="rounded border border-border bg-white px-2 py-0.5 text-gray-700 hover:border-primary/50"
      >
        {t('deselectAll')}
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
