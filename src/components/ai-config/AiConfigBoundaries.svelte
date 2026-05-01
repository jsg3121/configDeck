<script lang="ts">
  import { getTranslation, type Locale } from '@/i18n'

  import { BOUNDARIES_CATALOG } from '@/lib/data/aiConfig'
  import type { BoundaryItem, BoundaryTier } from '@/types/aiConfig'

  import BoundaryTierSection from './BoundaryTierSection.svelte'
  import type { CustomBoundaryItem } from './modules/aiConfigGeneratorLogic'

  interface Props {
    locale: Locale
    selectedIds: ReadonlySet<string>
    customItems: readonly CustomBoundaryItem[]
    onToggleId: (id: string) => void
    onAddCustom: (item: CustomBoundaryItem) => void
    onRemoveCustom: (index: number) => void
  }

  const { locale, selectedIds, customItems, onToggleId, onAddCustom, onRemoveCustom }: Props =
    $props()

  function itemsForTier(tier: BoundaryTier): readonly BoundaryItem[] {
    return BOUNDARIES_CATALOG.filter((item) => item.tier === tier)
  }

  function customItemsForTier(tier: BoundaryTier): readonly CustomBoundaryItem[] {
    return customItems.filter((item) => item.tier === tier)
  }

  function customIndexInTier(tier: BoundaryTier, indexInTier: number): number {
    let counter = 0
    for (let i = 0; i < customItems.length; i++) {
      if (customItems[i].tier === tier) {
        if (counter === indexInTier) return i
        counter++
      }
    }
    return -1
  }

  function handleAdd(tier: BoundaryTier, text: string) {
    onAddCustom({ tier, text })
  }

  function handleRemove(tier: BoundaryTier, indexInTier: number) {
    const globalIndex = customIndexInTier(tier, indexInTier)
    if (globalIndex >= 0) onRemoveCustom(globalIndex)
  }

  const t = (key: string) => getTranslation(locale, `aiConfig.step4.${key}`)
</script>

<div class="flex flex-col gap-3">
  <p class="text-xs text-gray-500">{t('intro')}</p>

  <BoundaryTierSection
    {locale}
    tier="always-do"
    title={t('alwaysDoTitle')}
    items={itemsForTier('always-do')}
    {selectedIds}
    customItems={customItemsForTier('always-do')}
    onToggle={onToggleId}
    onAddCustom={(text) => handleAdd('always-do', text)}
    onRemoveCustom={(idx) => handleRemove('always-do', idx)}
  />

  <BoundaryTierSection
    {locale}
    tier="ask-first"
    title={t('askFirstTitle')}
    items={itemsForTier('ask-first')}
    {selectedIds}
    customItems={customItemsForTier('ask-first')}
    onToggle={onToggleId}
    onAddCustom={(text) => handleAdd('ask-first', text)}
    onRemoveCustom={(idx) => handleRemove('ask-first', idx)}
  />

  <BoundaryTierSection
    {locale}
    tier="never-do"
    title={t('neverDoTitle')}
    items={itemsForTier('never-do')}
    {selectedIds}
    customItems={customItemsForTier('never-do')}
    onToggle={onToggleId}
    onAddCustom={(text) => handleAdd('never-do', text)}
    onRemoveCustom={(idx) => handleRemove('never-do', idx)}
  />
</div>
