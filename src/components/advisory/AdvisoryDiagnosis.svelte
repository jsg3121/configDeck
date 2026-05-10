<!--
  Advisory 버전 진단기 (Svelte 5 Runes 아일랜드).

  SPEC-0006 §3.6 / SPEC-0006-design §4 / ADR-0020 (frontmatter affected[]가 single source of truth).

  - 5상태 머신: IDLE / AFFECTED / SAFE / ERROR / DISABLED (SPEC-0006-design §5)
  - 입력: 버전 문자열 기본 + package.json 붙여넣기 옵션 (탭 토글)
  - 진단 로직은 semver/functions/satisfies 단일 함수만 사용 (RES-0004 §3-2)
  - aria-live 영역으로 결과 알림, 면책조항은 모든 상태에서 항상 표시
-->
<script lang="ts">
  import satisfies from 'semver/functions/satisfies'
  import valid from 'semver/functions/valid'

  interface AffectedRange {
    range: string
  }

  interface DiagnosisLabels {
    sectionLabel: string
    headline: string
    description: string
    tabVersion: string
    tabPackageJson: string
    inputLabel: string
    placeholderVersion: string
    placeholderPackageJson: string
    packageJsonAriaLabel: string
    diagnoseButton: string
    resetButton: string
    hintVersion: string
    hintPackageJson: string
    affectedTitle: string
    safeTitle: string
    errorTitle: string
    affectedBody: string
    safeBody: string
    safeAdvice: string
    affectedRangeLabel: string
    patchRecommendLabel: string
    patchRecommendSuffix: string
    errorInvalidVersion: string
    errorInvalidJson: string
    errorPackageMissing: string
    disclaimer: string
    officialAdvisoryLink: string
    disabledSupersededTitle: string
    disabledSupersededBody: string
    disabledSupersededCta: string
    disabledArchivedTitle: string
    disabledArchivedBody: string
    disabledSrLabel: string
    copyLabel: string
    copiedLabel: string
  }

  interface Props {
    affected: AffectedRange[]
    patched: string[]
    packageName: string
    ghsaUrl?: string
    status: 'active' | 'stale' | 'superseded' | 'archived'
    supersededHref?: string
    labels: DiagnosisLabels
  }

  const { affected, patched, packageName, ghsaUrl, status, supersededHref, labels }: Props =
    $props()

  type ResultState =
    | { kind: 'idle' }
    | {
        kind: 'affected'
        version: string
        range: string
        recommendedPatch: string
      }
    | { kind: 'safe'; version: string }
    | { kind: 'error'; message: string }

  type InputMode = 'version' | 'packageJson'

  // 페이지 로드 시점에 status로 DISABLED 여부 결정 (SPEC-0006-design §5.2)
  const isDisabled = status === 'superseded' || status === 'archived'

  let inputMode = $state<InputMode>('version')
  let versionInput = $state('')
  let packageJsonInput = $state('')
  let result = $state<ResultState>({ kind: 'idle' })
  let copied = $state(false)

  /**
   * 의미 있는 패치 버전 추천:
   * 사용자가 입력한 메이저 버전과 동일한 패치 버전을 우선 추천하고,
   * 동일 메이저가 없으면 patched 배열의 최댓값(가장 최근)을 반환한다.
   */
  const pickRecommendedPatch = (userVersion: string): string => {
    const major = userVersion.split('.')[0]
    const sameMajor = patched.filter((p) => p.startsWith(`${major}.`))
    if (sameMajor.length > 0) return sameMajor[sameMajor.length - 1]
    return patched[patched.length - 1] ?? ''
  }

  const formatTemplate = (template: string, values: Record<string, string>): string => {
    return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
  }

  /**
   * 진단 핵심 로직. semver.satisfies는 prerelease를 기본 무시하므로,
   * advisory의 affected 범위에서 안정 버전 매칭을 정확히 수행한다.
   */
  const diagnose = (rawVersion: string): ResultState => {
    const trimmed = rawVersion.trim()
    if (!trimmed) {
      return { kind: 'error', message: labels.errorInvalidVersion }
    }
    if (!valid(trimmed)) {
      return { kind: 'error', message: labels.errorInvalidVersion }
    }
    for (const item of affected) {
      try {
        if (satisfies(trimmed, item.range)) {
          return {
            kind: 'affected',
            version: trimmed,
            range: item.range,
            recommendedPatch: pickRecommendedPatch(trimmed),
          }
        }
      } catch {
        // 잘못된 range 표현이 들어온 경우 — frontmatter 검증으로 사전 차단되어야 하지만
        // 안전망으로 ERROR 처리한다.
        return { kind: 'error', message: labels.errorInvalidVersion }
      }
    }
    return { kind: 'safe', version: trimmed }
  }

  const handleDiagnoseVersion = () => {
    result = diagnose(versionInput)
  }

  const handleDiagnosePackageJson = () => {
    let parsed: unknown
    try {
      parsed = JSON.parse(packageJsonInput)
    } catch {
      result = { kind: 'error', message: labels.errorInvalidJson }
      return
    }
    if (typeof parsed !== 'object' || parsed === null) {
      result = { kind: 'error', message: labels.errorInvalidJson }
      return
    }
    const obj = parsed as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const raw = obj.dependencies?.[packageName] ?? obj.devDependencies?.[packageName] ?? null
    if (!raw) {
      result = {
        kind: 'error',
        message: formatTemplate(labels.errorPackageMissing, { package: packageName }),
      }
      return
    }
    // "^14.2.20" 같은 prefix 제거
    const cleaned = String(raw).replace(/^[^\d]*/, '')
    result = diagnose(cleaned)
  }

  const handleVersionKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleDiagnoseVersion()
    }
  }

  const handleVersionInput = () => {
    // 입력값 변경 → IDLE 복귀
    if (result.kind !== 'idle') {
      result = { kind: 'idle' }
    }
  }

  const switchMode = (mode: InputMode) => {
    inputMode = mode
    result = { kind: 'idle' }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      copied = true
      setTimeout(() => {
        copied = false
      }, 1500)
    } catch {
      // clipboard 권한이 없을 수 있음 — 무시
    }
  }
</script>

<section
  aria-labelledby="advisory-diagnosis-heading"
  class="relative mb-6 overflow-hidden rounded-2xl border-2 border-blue-300 bg-linear-to-br from-blue-50 to-indigo-50 p-6 shadow-sm sm:p-8"
>
  <div class="mb-2 flex items-center gap-2">
    <span
      aria-hidden="true"
      class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white"
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    </span>
    <span class="text-xs font-semibold tracking-wider text-blue-700 uppercase">
      {labels.sectionLabel}
    </span>
  </div>
  <h2 id="advisory-diagnosis-heading" class="mb-2 text-2xl font-bold text-gray-900">
    {labels.headline}
  </h2>
  <p class="mb-5 text-sm text-gray-700">
    {formatTemplate(labels.description, { package: packageName })}
  </p>

  {#if isDisabled}
    <!-- DISABLED: archived/superseded 상태 -->
    <div class="pointer-events-none mb-4 opacity-50" aria-hidden="true">
      <div class="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder={labels.placeholderVersion}
          disabled
          class="flex-1 cursor-not-allowed rounded-md border border-border bg-gray-50 px-3 py-2 font-mono text-sm text-gray-400"
        />
        <button
          type="button"
          disabled
          class="cursor-not-allowed rounded-md bg-gray-300 px-5 py-2 text-sm font-semibold text-gray-500"
        >
          {labels.diagnoseButton}
        </button>
      </div>
    </div>

    {#if status === 'superseded'}
      <div class="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-blue-900">
        <p class="mb-2 font-semibold">{labels.disabledSupersededTitle}</p>
        <p class="mb-3">{labels.disabledSupersededBody}</p>
        {#if supersededHref}
          <a
            href={supersededHref}
            class="inline-flex items-center gap-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {labels.disabledSupersededCta}
          </a>
        {/if}
      </div>
    {:else}
      <div class="rounded-xl border border-gray-300 bg-gray-100 p-5 text-sm text-gray-800">
        <p class="mb-2 font-semibold">{labels.disabledArchivedTitle}</p>
        <p>{labels.disabledArchivedBody}</p>
      </div>
    {/if}

    <p class="sr-only">{labels.disabledSrLabel}</p>
  {:else}
    <!-- 입력 방식 세그먼티드 컨트롤 -->
    <div
      class="mb-4 inline-flex rounded-lg border border-blue-200 bg-blue-100 p-1"
      role="tablist"
      aria-label={labels.tabVersion}
    >
      <button
        type="button"
        role="tab"
        aria-selected={inputMode === 'version'}
        class={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
          inputMode === 'version'
            ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-200'
            : 'text-blue-900/70 hover:text-blue-900'
        }`}
        onclick={() => switchMode('version')}
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        {labels.tabVersion}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={inputMode === 'packageJson'}
        class={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
          inputMode === 'packageJson'
            ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-200'
            : 'text-blue-900/70 hover:text-blue-900'
        }`}
        onclick={() => switchMode('packageJson')}
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
        {labels.tabPackageJson}
      </button>
    </div>

    {#if inputMode === 'version'}
      <div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            inputmode="text"
            placeholder={labels.placeholderVersion}
            aria-label={formatTemplate(labels.inputLabel, { package: packageName })}
            class="flex-1 rounded-md border-2 border-blue-200 bg-white px-4 py-3 font-mono text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none"
            bind:value={versionInput}
            oninput={handleVersionInput}
            onkeydown={handleVersionKeydown}
          />
          <button
            type="button"
            onclick={handleDiagnoseVersion}
            class="rounded-md bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow transition-colors hover:bg-blue-700"
          >
            {labels.diagnoseButton}
          </button>
        </div>
        <p class="mt-2 text-xs text-gray-600">
          ⓘ {formatTemplate(labels.hintVersion, { package: packageName })}
        </p>
      </div>
    {:else}
      <div>
        <textarea
          rows="8"
          placeholder={labels.placeholderPackageJson}
          aria-label={labels.packageJsonAriaLabel}
          class="w-full rounded-md border-2 border-blue-200 bg-white px-4 py-3 font-mono text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none"
          bind:value={packageJsonInput}
        ></textarea>
        <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs text-gray-600">
            ⓘ {formatTemplate(labels.hintPackageJson, { package: packageName })}
          </p>
          <button
            type="button"
            onclick={handleDiagnosePackageJson}
            class="rounded-md bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow transition-colors hover:bg-blue-700"
          >
            {labels.diagnoseButton}
          </button>
        </div>
      </div>
    {/if}

    <!-- 진단 결과 영역 (aria-live polite) -->
    <div class="mt-5" aria-live="polite">
      {#if result.kind === 'affected'}
        <div class="rounded-xl border border-red-200 bg-red-50 p-5">
          <div class="mb-3 flex items-center gap-2">
            <span
              aria-hidden="true"
              class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white"
              >!</span
            >
            <p class="font-bold text-red-900">{labels.affectedTitle}</p>
          </div>
          <p class="mb-2 text-sm text-red-900">
            <code class="font-mono">{packageName}@{result.version}</code>
            {formatTemplate(labels.affectedBody, {
              package: packageName,
              version: result.version,
            }).replace(`${packageName}@${result.version}`, '')}
          </p>
          <p class="mb-2 text-sm text-red-800">
            {labels.affectedRangeLabel}: <code class="font-mono">{result.range}</code>
          </p>
          <p class="mb-3 text-sm text-red-800">
            {labels.patchRecommendLabel}:
            <code class="font-mono font-semibold">{packageName}@{result.recommendedPatch}</code>
            {labels.patchRecommendSuffix}
          </p>
          <div class="flex items-center justify-between gap-3 rounded-md bg-slate-900 p-3">
            <code class="font-mono text-xs text-slate-100"
              >npm install {packageName}@{result.recommendedPatch}</code
            >
            <button
              type="button"
              onclick={() =>
                handleCopy(
                  `npm install ${packageName}@${result.kind === 'affected' ? result.recommendedPatch : ''}`,
                )}
              aria-label={`${labels.copyLabel} npm install ${packageName}@${result.recommendedPatch}`}
              class="shrink-0 rounded bg-gray-700 px-3 py-1 text-xs text-gray-100 transition-colors hover:bg-gray-600"
            >
              {copied ? labels.copiedLabel : labels.copyLabel}
            </button>
          </div>
        </div>
      {:else if result.kind === 'safe'}
        <div class="rounded-xl border border-green-200 bg-green-50 p-5">
          <div class="mb-3 flex items-center gap-2">
            <span
              aria-hidden="true"
              class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white"
              >✓</span
            >
            <p class="font-bold text-green-900">{labels.safeTitle}</p>
          </div>
          <p class="mb-1 text-sm text-green-900">
            <code class="font-mono">{packageName}@{result.version}</code>
            {formatTemplate(labels.safeBody, {
              package: packageName,
              version: result.version,
            }).replace(`${packageName}@${result.version}`, '')}
          </p>
          <p class="text-sm text-green-800">{labels.safeAdvice}</p>
        </div>
      {:else if result.kind === 'error'}
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div class="mb-2 flex items-center gap-2">
            <span
              aria-hidden="true"
              class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white"
              >i</span
            >
            <p class="font-bold text-gray-900">{labels.errorTitle}</p>
          </div>
          <p class="text-sm text-gray-700">{result.message}</p>
        </div>
      {/if}
    </div>
  {/if}

  <!-- 면책조항: 모든 상태에서 항상 표시 (SPEC-0006-design §11-4) -->
  <div class="mt-6 border-t border-blue-200 pt-5 text-xs leading-relaxed text-gray-600">
    {labels.disclaimer}
    {#if ghsaUrl}
      <a
        href={ghsaUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-blue-700 hover:text-blue-800"
      >
        {labels.officialAdvisoryLink}
      </a>
    {/if}
  </div>
</section>
