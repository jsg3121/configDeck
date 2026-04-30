<script lang="ts">
  import { BOUNDARIES_CATALOG } from '@/lib/data/aiConfig'
  import type { BoundaryItem, BoundaryTier } from '@/types/aiConfig'

  import BoundaryTierSection from './BoundaryTierSection.svelte'
  import type { CustomBoundaryItem } from './modules/aiConfigGeneratorLogic'

  interface Props {
    selectedIds: ReadonlySet<string>
    customItems: readonly CustomBoundaryItem[]
    onToggleId: (id: string) => void
    onAddCustom: (item: CustomBoundaryItem) => void
    onRemoveCustom: (index: number) => void
  }

  const { selectedIds, customItems, onToggleId, onAddCustom, onRemoveCustom }: Props = $props()

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
</script>

<div class="flex flex-col gap-3">
  <p class="text-xs text-gray-500">
    AI가 따라야 할 경계를 3단계로 구분해 정의합니다. 건너뛰어도 문제 없으며, 직접 입력 항목을 추가할
    수 있습니다.
  </p>

  <BoundaryTierSection
    tier="always-do"
    title="Always do — 항상 수행"
    items={itemsForTier('always-do')}
    {selectedIds}
    customItems={customItemsForTier('always-do')}
    onToggle={onToggleId}
    onAddCustom={(text) => handleAdd('always-do', text)}
    onRemoveCustom={(idx) => handleRemove('always-do', idx)}
  />

  <BoundaryTierSection
    tier="ask-first"
    title="Ask first — 먼저 확인할 것"
    items={itemsForTier('ask-first')}
    {selectedIds}
    customItems={customItemsForTier('ask-first')}
    onToggle={onToggleId}
    onAddCustom={(text) => handleAdd('ask-first', text)}
    onRemoveCustom={(idx) => handleRemove('ask-first', idx)}
  />

  <BoundaryTierSection
    tier="never-do"
    title="Never do — 절대 금지"
    items={itemsForTier('never-do')}
    {selectedIds}
    customItems={customItemsForTier('never-do')}
    onToggle={onToggleId}
    onAddCustom={(text) => handleAdd('never-do', text)}
    onRemoveCustom={(idx) => handleRemove('never-do', idx)}
  />
</div>
