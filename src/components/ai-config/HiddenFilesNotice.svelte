<script lang="ts">
  /**
   * .cursor/, .claude/, .github/ 같은 점(.)으로 시작하는 폴더가
   * macOS Finder 기본 설정에서 숨겨져 있다는 안내.
   * ZIP 다운로드 버튼 hover 툴팁과 ⓘ 정보 아이콘 popover에서 공통 사용한다.
   */
</script>

<div class="text-left text-xs text-gray-700">
  <p class="mb-1 font-semibold text-gray-900">📂 숨김 파일에 주의하세요</p>
  <p class="leading-relaxed text-gray-600">
    <code class="rounded bg-gray-100 px-1">.cursor/</code>,
    <code class="rounded bg-gray-100 px-1">.claude/</code>,
    <code class="rounded bg-gray-100 px-1">.github/</code> 같은 점(.)으로 시작하는 폴더는 macOS Finder
    기본 설정에서 숨겨져 있습니다.
  </p>
  <ul class="mt-2 flex flex-col gap-0.5 text-gray-600">
    <li>
      <span class="font-medium text-gray-800">macOS Finder</span>:
      <kbd class="rounded border border-gray-300 bg-gray-50 px-1 font-mono">⌘ + ⇧ + .</kbd>
    </li>
    <li>
      <span class="font-medium text-gray-800">VS Code / Cursor</span>: 사이드바에서 정상 표시
    </li>
    <li>
      <span class="font-medium text-gray-800">터미널</span>:
      <code class="rounded bg-gray-100 px-1">ls -la</code>
    </li>
  </ul>
</div>
