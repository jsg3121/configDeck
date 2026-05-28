# ADR-0015: 아티클 소스 다양성 확보 전략

- 상태: 승인됨 (결정 3 부분 갱신: [ADR-0023](./ADR-0023-article-deprioritize-frontmatter-source.md))
- 날짜: 2026-04-26
- 의사결정자: jsg3121

> **갱신 안내 (2026-05-28):** ADR-0021 결정 6에서 slug 포맷이 단순화되면서 본 ADR의 결정 3(파일명 날짜 prefix로 cutoff 판정)이 silent failure를 일으켰다. [ADR-0023](./ADR-0023-article-deprioritize-frontmatter-source.md)이 판정 근거를 frontmatter `pubDate`로 이전하고, 디우선 기간을 2일 → 3일로 조정했다. 결정 1, 2는 계속 유효하며 결정 3만 ADR-0023에 의해 대체된다.

## 맥락 (Context)

ADR-0011, ADR-0013에서 RSS/Atom 피드 기반 아티클 자동 수집 파이프라인을 확정했다. 현재 15개 소스(ESLint, Prettier, TypeScript, Next.js, React, Astro, Node.js, web.dev, Tailwind CSS, Vite, Smashing Magazine, CSS-Tricks, Search Engine Journal, Google Search Central, JavaScript Weekly)에서 매일 신규 항목을 수집하고, [`selectBalanced`](../../scripts/fetch-rss.ts) 함수의 round-robin 알고리즘으로 도구별 균등 선택 후 하루 2개를 노출한다.

운영 중 다음 문제가 관찰되었다.

**문제: 특정 소스의 편향 노출**

| 일자 | 저장된 소스 |
|------|-------------|
| 2026-04-22 | csstricks, searchenginejournal |
| 2026-04-23 | csstricks, searchenginejournal |
| 2026-04-24 | searchenginejournal × 2 |

Search Engine Journal이 매일 다수(20개/5일) 발행하는 반면 다른 소스는 1~2개에 그쳐, round-robin 큐의 첫 번째 자리에 SEJ가 자주 배치되었다. 결과적으로 **여러 날 연속 같은 소스가 노출**되어 사용자 입장에서는 게시글이 갱신되지 않는 것처럼 보이는 현상이 발생했다.

**기술적 원인**

[scripts/fetch-rss.ts:339-365](../../scripts/fetch-rss.ts#L339-L365)의 `selectBalanced`는 `byTool` Map의 삽입 순서대로 `toolQueues`를 만든다. 입력 `items`가 `pubDate` 내림차순으로 정렬되어 있으므로 그날 가장 최신으로 발행한 도구가 큐 0번에 배치되고, round-robin이 0번부터 순회하므로 결과적으로 다발 발행 소스(SEJ)가 거의 항상 1순위가 된다.

## 결정 (Decision)

### 결정 1: 최근 사용된 도구를 디우선순위화 (de-prioritize)

`selectBalanced`에 `deprioritize?: Set<Tool>` 옵션을 추가한다. 이 집합에 속한 도구의 큐는 round-robin 순서에서 **뒤로 이동**시켜, 다른 도구가 우선 선택되도록 한다.

**디우선순위 기간: 최근 2일**

오늘 날짜 기준 직전 2일(`today - 2일` ≤ 파일 날짜)에 저장된 아티클의 도구를 디우선 대상으로 본다. 너무 짧으면(1일) 효과가 약하고, 너무 길면(5일+) 다양성 회전이 느려 디우선 대상이 희소 도구까지 포함되는 부작용이 있다.

### 결정 2: 단일 도구만 발행한 경우 디우선순위 무시

신규 항목을 발행한 도구가 1개뿐이라면 디우선 적용 없이 그 도구를 그대로 선택한다 (필요 시 같은 도구 × 2도 허용).

**근거:** "다양성 확보"보다 "당일 신선한 콘텐츠 노출"이 우선이다. 단일 도구만 발행한 날 디우선을 강제하면 빈 결과가 될 수 있다.

### 결정 3: 파일명 날짜 문자열 비교로 타임존 영향 제거 ⚠️ [ADR-0023](./ADR-0023-article-deprioritize-frontmatter-source.md)에 의해 대체됨

> 본 결정은 [ADR-0021](./ADR-0021-article-editorial-commentary-model.md) 결정 6의 slug 단순화 이후 파일명에 날짜 prefix가 사라지면서 silent failure를 일으켰다. [ADR-0023](./ADR-0023-article-deprioritize-frontmatter-source.md)이 판정 근거를 frontmatter `pubDate`로 이전했다. 본 결정 본문은 변경 맥락 보존용으로 남긴다.

저장된 아티클 파일명은 `{YYYY-MM-DD}-{tool}-{slug}.md` 패턴이다. 디우선 대상 추출 시 `Date` 객체 비교 대신 cutoff와 파일명의 날짜를 **문자열로 직접 비교**한다.

**근거:** `new Date('2026-04-23')`은 UTC 자정으로 파싱되지만 `date.setHours(0,0,0,0)`은 로컬 자정을 설정한다. KST(UTC+9) 환경에서는 cutoff가 UTC 15:00이 되어 파일 날짜가 잘못 제외되는 버그가 발생한다. ISO 8601 날짜 문자열은 사전순(lexicographic)과 시간순이 일치하므로 문자열 비교가 안전하고 단순하다 ([ISO 8601 — Wikipedia](https://en.wikipedia.org/wiki/ISO_8601#General_principles)).

## 근거 (Rationale)

### 왜 디우선순위 방식인가

대안으로 "최근 사용 빈도 기반 가중치"나 "라운드별 셔플"이 있었으나, 다음 이유로 디우선순위 방식을 선택했다.

1. **기존 round-robin 골격 유지**: 큐 정렬 순서만 조정하면 되므로 변경 범위가 작고 검증이 쉽다.
2. **신선도 우선**: 디우선 대상도 큐에는 남아 있어, 다른 도구가 고갈되면 자연스럽게 선택된다. "안 쓴 도구를 억지로 채우는" 부작용이 없다.
3. **사용자 의도와 직결**: "전날과 같은 소스가 또 보이는 문제"를 직접 해결한다.

### 왜 2일인가

- **1일**: 어제만 디우선화 → 그제와 오늘이 같은 소스일 수 있어 여전히 연속 노출 발생
- **2일**: 어제+그제 디우선화 → 사용자가 체감하는 "최근" 범위와 일치
- **3일+**: 디우선 집합이 커져 사실상 모든 활성 소스가 디우선 대상이 되어 효과 무력화

### 왜 단일 도구는 예외인가

비활성 시즌(주말, 공휴일 등)에는 SEJ 같은 일일 발행 매체만 신규 항목을 내놓는다. 이때 디우선을 강제하면 자동화가 빈 결과를 반환하고, 사용자에게는 갱신되지 않은 사이트로 보인다. "오래된 같은 소스 반복"보다 "새로운 같은 소스 반복"이 더 가치 있다고 판단했다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|-------------|
| 최근 N일 사용 빈도 기반 가중치 | 로직 복잡도 증가. 신선도보다 균형을 우선해 "가장 안 쓴 도구"가 항상 1순위가 되는 부작용 |
| 같은 날짜 그룹 내 셔플 + 전날 도구 후순위 | 같은 도구의 여러 항목이 같은 날짜인 경우 셔플로는 효과 미미, 결국 디우선 로직이 본질 |
| 소스 카테고리 묶음 (CSS, Framework 등) | 사용자 검토 결과 카테고리 내 소스 성격이 이질적(공식 블로그 vs 커뮤니티 미디어). UI 복잡도 증가 대비 가치 낮음. 추후 별도 검토 |
| 단일 도구일 때도 디우선 강제 | 비활성 시즌에 빈 결과 반환. 사용자 체감 품질 저하 |

## 결과 (Consequences)

### 긍정적 결과

- 동일 소스가 여러 날 연속 노출되는 현상 완화. 다양한 도구의 글이 회전하며 노출됨
- 자동화 파이프라인의 코드 변경은 두 함수에 국한되어 회귀 위험이 낮음
- 단일 도구만 발행한 날에도 갱신이 끊기지 않음

### 부정적 결과 / 트레이드오프

- 디우선 대상에 포함된 도구는 "최신 발행"이라도 후순위로 밀려, 큐 길이에 따라 선택되지 않을 수 있음
- 모든 도구가 디우선 대상이 되는 경우(최근 2일에 모든 활성 소스가 사용된 경우)는 round-robin이 정상 동작하므로 효과는 없지만 회귀는 없음

### 후속 조치

- 자동화가 며칠 운영된 후 [src/content/articles/](../../src/content/articles/) 디렉토리의 도구별 분포를 모니터링한다
- 분포가 여전히 편향되면 디우선 기간 조정(2일 → 3일)이나 가중치 방식 도입을 재검토한다

## 참고 자료 (References)

- [scripts/fetch-rss.ts](../../scripts/fetch-rss.ts) — `selectBalanced` 구현
- [scripts/update-articles.ts](../../scripts/update-articles.ts) — `getRecentlyUsedTools` 구현 및 호출
- [ADR-0010: 아티클 콘텐츠 전략](./ADR-0010-article-content-strategy.md) — 아티클 노출 방식 원칙
- [ADR-0011: 아티클 AI 요약 자동화 전략](./ADR-0011-article-ai-summarization.md) — 자동화 파이프라인 설계
- [ADR-0013: 아티클 AI 도구 평가](./ADR-0013-article-ai-tool-evaluation.md) — RSS 도구 선택
- [ISO 8601 — General principles](https://en.wikipedia.org/wiki/ISO_8601#General_principles) — 날짜 문자열 사전순 정렬 보장
