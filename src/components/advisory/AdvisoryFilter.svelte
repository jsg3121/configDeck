<!--
  Advisory 카탈로그 필터 + 정렬 (Svelte 5 Runes 아일랜드).

  SPEC-0006-design §2.5: 정적으로 렌더된 advisory 카드의 가시성/순서를 클라이언트에서 토글한다.
  필터 상태는 URL 쿼리 파라미터로 동기화하며 history.replaceState로 새 히스토리 항목을 만들지 않는다 (§11-5).
-->
<script lang="ts">
  type Severity = 'all' | 'critical' | 'high' | 'medium' | 'low'
  type Status = 'all' | 'active' | 'stale' | 'superseded' | 'archived'
  type Sort = 'latest' | 'severity'

  interface Labels {
    severityLabel: string
    packageLabel: string
    statusLabel: string
    sortLabel: string
    sortLatest: string
    sortSeverity: string
    reset: string
    all: string
    severityCritical: string
    severityHigh: string
    severityMedium: string
    severityLow: string
    statusActive: string
    statusStale: string
    statusSuperseded: string
    statusArchived: string
  }

  interface Props {
    /** 카탈로그에 등장하는 패키지명 목록 (중복 제거된 정렬 결과) */
    packages: string[]
    labels: Labels
  }

  const { packages, labels }: Props = $props()

  let severityFilter = $state<Severity>('all')
  let packageFilter = $state<string>('all')
  let statusFilter = $state<Status>('all')
  let sortOrder = $state<Sort>('latest')

  const SEVERITY_RANK: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  }

  const readUrlState = () => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const severity = params.get('severity')
    const pkg = params.get('package')
    const statusParam = params.get('status')
    const sortParam = params.get('sort')
    if (
      severity === 'critical' ||
      severity === 'high' ||
      severity === 'medium' ||
      severity === 'low'
    ) {
      severityFilter = severity
    }
    if (pkg && (pkg === 'all' || packages.includes(pkg))) {
      packageFilter = pkg
    }
    if (
      statusParam === 'active' ||
      statusParam === 'stale' ||
      statusParam === 'superseded' ||
      statusParam === 'archived'
    ) {
      statusFilter = statusParam
    }
    if (sortParam === 'severity' || sortParam === 'latest') {
      sortOrder = sortParam
    }
  }

  const writeUrlState = () => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams()
    if (severityFilter !== 'all') params.set('severity', severityFilter)
    if (packageFilter !== 'all') params.set('package', packageFilter)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (sortOrder !== 'latest') params.set('sort', sortOrder)
    const query = params.toString()
    const newUrl = window.location.pathname + (query ? `?${query}` : '')
    window.history.replaceState(null, '', newUrl)
  }

  const applyFilter = () => {
    if (typeof document === 'undefined') return
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.advisory-card'))
    const visible: HTMLElement[] = []
    for (const card of cards) {
      const cardSeverity = card.dataset.severity ?? ''
      const cardPackage = card.dataset.package ?? ''
      const cardStatus = card.dataset.status ?? ''
      const matches =
        (severityFilter === 'all' || cardSeverity === severityFilter) &&
        (packageFilter === 'all' || cardPackage === packageFilter) &&
        (statusFilter === 'all' || cardStatus === statusFilter)
      if (matches) {
        visible.push(card)
        card.classList.remove('hidden')
      } else {
        card.classList.add('hidden')
      }
    }

    visible.sort((a, b) => {
      if (sortOrder === 'severity') {
        return (
          (SEVERITY_RANK[b.dataset.severity ?? ''] ?? 0) -
          (SEVERITY_RANK[a.dataset.severity ?? ''] ?? 0)
        )
      }
      const ap = a.dataset.published ?? ''
      const bp = b.dataset.published ?? ''
      return bp.localeCompare(ap)
    })

    const list = document.getElementById('advisory-list')
    const emptyState = document.getElementById('advisory-empty-state')
    if (list) {
      for (const card of visible) {
        list.appendChild(card)
      }
      list.classList.toggle('hidden', visible.length === 0)
    }
    if (emptyState) {
      emptyState.classList.toggle('hidden', visible.length > 0)
    }
  }

  const reset = () => {
    severityFilter = 'all'
    packageFilter = 'all'
    statusFilter = 'all'
    sortOrder = 'latest'
    writeUrlState()
    applyFilter()
  }

  // mount 시 URL 상태를 로드한 뒤 적용. svelte 5에서는 $effect로 처리한다.
  $effect(() => {
    readUrlState()
    applyFilter()
    // 외부에서 reset 버튼을 클릭할 수 있도록 카탈로그 페이지의 빈 상태 버튼과 연동
    const handler = () => reset()
    const externalReset = document.getElementById('advisory-empty-reset')
    externalReset?.addEventListener('click', handler)
    return () => {
      externalReset?.removeEventListener('click', handler)
    }
  })

  const onSeverityClick = (value: Severity) => {
    severityFilter = value
    writeUrlState()
    applyFilter()
  }
  const onPackageClick = (value: string) => {
    packageFilter = value
    writeUrlState()
    applyFilter()
  }
  const onStatusClick = (value: Status) => {
    statusFilter = value
    writeUrlState()
    applyFilter()
  }
  const onSortChange = (event: Event) => {
    const select = event.currentTarget as HTMLSelectElement
    sortOrder = select.value === 'severity' ? 'severity' : 'latest'
    writeUrlState()
    applyFilter()
  }

  const chipClass = (active: boolean) =>
    [
      'rounded-full border px-3 py-1 text-sm transition-colors',
      active
        ? 'bg-primary text-white border-primary'
        : 'border-border bg-surface text-gray-700 hover:border-primary hover:text-primary',
    ].join(' ')
</script>

<section
  aria-label={labels.severityLabel}
  class="mb-6 rounded-2xl border border-border bg-surface p-6"
>
  <div class="space-y-4">
    <!-- 심각도 -->
    <div>
      <p class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {labels.severityLabel}
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class={chipClass(severityFilter === 'all')}
          aria-pressed={severityFilter === 'all'}
          onclick={() => onSeverityClick('all')}>{labels.all}</button
        >
        <button
          type="button"
          class={chipClass(severityFilter === 'critical')}
          aria-pressed={severityFilter === 'critical'}
          onclick={() => onSeverityClick('critical')}>{labels.severityCritical}</button
        >
        <button
          type="button"
          class={chipClass(severityFilter === 'high')}
          aria-pressed={severityFilter === 'high'}
          onclick={() => onSeverityClick('high')}>{labels.severityHigh}</button
        >
        <button
          type="button"
          class={chipClass(severityFilter === 'medium')}
          aria-pressed={severityFilter === 'medium'}
          onclick={() => onSeverityClick('medium')}>{labels.severityMedium}</button
        >
        <button
          type="button"
          class={chipClass(severityFilter === 'low')}
          aria-pressed={severityFilter === 'low'}
          onclick={() => onSeverityClick('low')}>{labels.severityLow}</button
        >
      </div>
    </div>

    <!-- 패키지 -->
    {#if packages.length > 0}
      <div>
        <p class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {labels.packageLabel}
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class={chipClass(packageFilter === 'all')}
            aria-pressed={packageFilter === 'all'}
            onclick={() => onPackageClick('all')}>{labels.all}</button
          >
          {#each packages as pkg (pkg)}
            <button
              type="button"
              class={chipClass(packageFilter === pkg)}
              aria-pressed={packageFilter === pkg}
              onclick={() => onPackageClick(pkg)}>{pkg}</button
            >
          {/each}
        </div>
      </div>
    {/if}

    <!-- 상태 -->
    <div>
      <p class="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {labels.statusLabel}
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class={chipClass(statusFilter === 'all')}
          aria-pressed={statusFilter === 'all'}
          onclick={() => onStatusClick('all')}>{labels.all}</button
        >
        <button
          type="button"
          class={chipClass(statusFilter === 'active')}
          aria-pressed={statusFilter === 'active'}
          onclick={() => onStatusClick('active')}>{labels.statusActive}</button
        >
        <button
          type="button"
          class={chipClass(statusFilter === 'stale')}
          aria-pressed={statusFilter === 'stale'}
          onclick={() => onStatusClick('stale')}>{labels.statusStale}</button
        >
        <button
          type="button"
          class={chipClass(statusFilter === 'superseded')}
          aria-pressed={statusFilter === 'superseded'}
          onclick={() => onStatusClick('superseded')}>{labels.statusSuperseded}</button
        >
        <button
          type="button"
          class={chipClass(statusFilter === 'archived')}
          aria-pressed={statusFilter === 'archived'}
          onclick={() => onStatusClick('archived')}>{labels.statusArchived}</button
        >
      </div>
    </div>

    <!-- 정렬 + 초기화 -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <label class="text-sm text-gray-700">
        {labels.sortLabel}:
        <select
          class="ml-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
          value={sortOrder}
          onchange={onSortChange}
        >
          <option value="latest">{labels.sortLatest}</option>
          <option value="severity">{labels.sortSeverity}</option>
        </select>
      </label>
      <button
        type="button"
        class="text-sm text-gray-500 underline hover:text-gray-900"
        onclick={reset}>{labels.reset}</button
      >
    </div>
  </div>
</section>
