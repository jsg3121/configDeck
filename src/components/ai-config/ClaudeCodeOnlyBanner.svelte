<script lang="ts">
  interface Props {
    /** Claude Code가 enabledTools에 포함되었는지 */
    claudeCodeSelected: boolean
    /** "Claude Code 단독 사용" 토글 상태 */
    claudeCodeOnly: boolean
    /** 다른 도구(Cursor/Copilot/Codex)가 하나라도 선택되었는지 */
    hasOtherTools: boolean
  }

  const { claudeCodeSelected, claudeCodeOnly, hasOtherTools }: Props = $props()

  // 표시 조건 — Claude Code 미선택 시 숨김
  const visible = $derived(claudeCodeSelected)

  const docUrl = 'https://code.claude.com/docs/en/memory#agentsmd'
</script>

{#if visible}
  <aside
    role="note"
    aria-live="polite"
    class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900"
  >
    {#if claudeCodeOnly}
      <p class="font-semibold">ⓘ Claude Code 단독 사용 모드</p>
      <p class="mt-1 leading-relaxed">
        Claude Code만 사용하므로 CLAUDE.md를 단일 진실원으로 작성합니다. AGENTS.md 임포트(<code
          class="rounded bg-blue-100 px-1">@AGENTS.md</code
        >)는 생략됩니다.
      </p>
    {:else if hasOtherTools}
      <p class="font-semibold">ⓘ Claude Code와 다른 도구를 함께 사용 중</p>
      <p class="mt-1 leading-relaxed">
        Claude Code는 AGENTS.md를 직접 읽지 않으므로, CLAUDE.md에
        <code class="rounded bg-blue-100 px-1">@AGENTS.md</code> 임포트를 자동으로 삽입합니다. AGENTS.md
        하나로 4개 도구 모두에서 동일한 설정을 공유할 수 있습니다.
      </p>
    {:else}
      <p class="font-semibold">ⓘ Claude Code 사용</p>
      <p class="mt-1 leading-relaxed">
        Claude Code 외 다른 도구도 함께 사용한다면 "Claude Code 단독 사용" 토글을 해제한 채로 다른
        도구도 함께 선택해주세요.
      </p>
    {/if}
    <p class="mt-2">
      <a
        href={docUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="font-medium text-blue-700 underline hover:text-blue-900"
      >
        → Claude Code 공식 문서: Memory 가이드 보기 ↗
      </a>
    </p>
  </aside>
{/if}
