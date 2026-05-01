<script lang="ts">
  import { getTranslation, type Locale } from '@/i18n'

  interface Props {
    locale: Locale
    /** Claude Code가 enabledTools에 포함되었는지 */
    claudeCodeSelected: boolean
    /** "Claude Code 단독 사용" 토글 상태 */
    claudeCodeOnly: boolean
    /** 다른 도구(Cursor/Copilot/Codex)가 하나라도 선택되었는지 */
    hasOtherTools: boolean
  }

  const { locale, claudeCodeSelected, claudeCodeOnly, hasOtherTools }: Props = $props()

  const visible = $derived(claudeCodeSelected)
  const docUrl = 'https://code.claude.com/docs/en/memory#agentsmd'

  const t = (key: string) => getTranslation(locale, `aiConfig.claudeCodeOnly.${key}`)

  // 모드별 키 결정 — 일관된 텍스트+코드+텍스트 패턴으로 렌더링한다 (XSS 안전)
  const mode = $derived<'only' | 'mixed' | 'standalone'>(
    claudeCodeOnly ? 'only' : hasOtherTools ? 'mixed' : 'standalone'
  )

  const modeKey = $derived(
    mode === 'only' ? 'modeOnly' : mode === 'mixed' ? 'modeMixed' : 'modeStandalone'
  )

  // 표준 코드 토큰 — i18n 사전과 분리해 관리
  const codeToken = '@AGENTS.md'
</script>

{#if visible}
  <aside
    role="note"
    aria-live="polite"
    class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900"
  >
    <p class="font-semibold">{t(`${modeKey}.title`)}</p>
    <p class="mt-1 leading-relaxed">
      {t(`${modeKey}.descriptionBefore`)}{#if mode !== 'standalone'}<code
          class="rounded bg-blue-100 px-1">{codeToken}</code
        >{/if}{t(`${modeKey}.descriptionAfter`)}
    </p>
    <p class="mt-2">
      <a
        href={docUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-blue-700 underline hover:text-blue-900"
      >
        {t('docLink')}
      </a>
    </p>
  </aside>
{/if}
