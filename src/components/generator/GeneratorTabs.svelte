<script lang="ts">
  /**
   * 생성/마이그레이션 탭 전환 컴포넌트.
   * 마이그레이션을 지원하는 파일에서만 표시된다.
   */

  interface Props {
    activeTab: 'generate' | 'migrate'
    locale: string
    ontabchange: (tab: 'generate' | 'migrate') => void
  }

  let { activeTab, locale, ontabchange }: Props = $props()

  let generateLabel = $derived(locale === 'ko' ? '생성' : 'Generate')
  let migrateLabel = $derived(locale === 'ko' ? '마이그레이션' : 'Migrate')
</script>

<div class="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
  <button
    type="button"
    class="flex-1 rounded-md px-4 py-2 text-sm font-medium {activeTab === 'generate'
      ? 'bg-white text-gray-900 shadow-sm'
      : 'text-gray-500 hover:text-gray-700'}"
    onclick={() => ontabchange('generate')}
  >
    {generateLabel}
  </button>
  <button
    type="button"
    class="flex-1 rounded-md px-4 py-2 text-sm font-medium {activeTab === 'migrate'
      ? 'bg-white text-gray-900 shadow-sm'
      : 'text-gray-500 hover:text-gray-700'}"
    onclick={() => ontabchange('migrate')}
  >
    {migrateLabel}
  </button>
</div>
