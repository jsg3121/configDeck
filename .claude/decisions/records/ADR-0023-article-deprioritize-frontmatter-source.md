# ADR-0023: 아티클 디우선순위 판정 근거를 frontmatter `pubDate`로 이전

- 상태: 승인됨
- 날짜: 2026-05-28
- 의사결정자: jsg3121

## 맥락 (Context)

[ADR-0015](./ADR-0015-article-source-diversity.md)에서 RSS 다발 발행 소스(특히 Search Engine Journal)가 round-robin 큐의 첫 자리를 점유해 같은 매체가 연속 노출되는 문제를 해결하기 위해 **디우선순위(deprioritize)** 메커니즘을 도입했다. 핵심 구현인 [`getRecentlyUsedTools`](../../scripts/update-articles.ts)는 "최근 N일 안에 저장된 아티클의 도구 집합"을 만들어 [`selectBalanced`](../../scripts/fetch-rss.ts)의 round-robin 순서를 재배열했다.

ADR-0015 결정 3은 파일명이 `{YYYY-MM-DD}-{tool}-{slug}.md` 패턴이라는 전제 아래, 파일명에서 날짜를 추출해 cutoff와 **문자열 비교**하기로 했다 (KST/UTC 타임존 혼선 방지).

그러나 그 후 [ADR-0021](./ADR-0021-article-editorial-commentary-model.md) 결정 6에서 slug 포맷을 단순화하면서 **파일명의 날짜 prefix가 제거**되었다. 변경 의도는 "URL 구조 단순화 + `pubDate` frontmatter가 권위 출처"였으나, `getRecentlyUsedTools`는 옛 정규식(`^(\d{4}-\d{2}-\d{2})-/`)을 그대로 유지하고 있어 모든 파일이 1차 컷오프에서 탈락했다. 결과적으로 `recentlyUsedTools`는 **항상 빈 Set**이 되어 디우선순위가 **사일런트로 무력화**된 채 4주간 운영되었다.

실제 영향: 2026-05-13 ~ 2026-05-28 기간 저장된 32개 아티클(en)의 도구 분포는 searchenginejournal 20(63%), csstricks 9(28%), nodejs 2(6%), javascriptweekly 1(3%), 나머지 11개 피드 0건으로 강하게 편향되었다.

## 결정 (Decision)

### 결정 1: 디우선 대상 판정 기준을 frontmatter `pubDate`로 이전

파일명 의존을 폐기하고 frontmatter `pubDate`로 판정한다. ADR-0021 결정 6이 명시한 "`pubDate`가 권위 출처" 원칙과 정합되며, 향후 slug 포맷이 또 변경되어도 디우선순위 로직이 깨지지 않는다.

### 결정 2: mtime 1차 컷오프 + 부분 read의 2단계 필터

모든 .md를 풀 read하지 않기 위해 다음 2단계로 처리한다.

1. **1차 (저렴):** `fs.statSync().mtimeMs`로 cutoff 이전 파일을 스킵한다.
2. **2차 (정확):** 통과한 파일만 `fs.readSync`로 처음 512바이트(frontmatter 영역)만 읽어 `tool`과 `pubDate`를 추출하고, `pubDate >= cutoff`인 경우 도구를 수집한다.

**mtime 안전 마진: 1일**

mtime은 git checkout/리베이스/clone 시 갱신될 수 있어 "이르게 컷오프"되는 위험이 있다. cutoff에서 1일을 더 거슬러 올라가 mtime을 비교한다 (`mtimeFloor = cutoff - 1d`). 누락이 발생해도 결과는 "디우선 대상 누락 → 효과 약화"일 뿐 사이트 빌드는 안전하다.

### 결정 3: 디우선 기간을 2일 → 3일로 연장

[ADR-0015](./ADR-0015-article-source-diversity.md)는 디우선 기간으로 2일을 선택했다. 그러나 4주간 알고리즘이 죽어 있던 동안 관찰된 실제 분포에서 SEJ가 하루 4~5건씩 누적 발행함이 확인되었다. 2일 디우선으로는 회전 주기가 짧아 SEJ가 매 사이클 다시 1순위로 복귀할 가능성이 높다.

- **3일:** 회전 주기를 늘려 다른 매체에게 노출 기회를 제공. 활성 매체 4개(SEJ, csstricks, nodejs, javascriptweekly) 대비 디우선 비중 75% 수준으로, "사실상 모든 도구가 디우선"이 되는 임계(ADR-0015가 4일 이상 위험으로 본 영역)에는 아직 도달하지 않는다.
- **4일 이상:** ADR-0015 §62~63이 지적한 부작용(디우선 집합이 활성 소스 전체를 덮어 효과 무력화) 위험이 커진다.

## 근거 (Rationale)

### 왜 frontmatter 기반인가

- **권위 출처 정합:** ADR-0021 결정 6이 frontmatter `pubDate`를 권위 출처로 명시했다. 파일명에서 메타데이터를 재추출하는 패턴은 단일 출처(single source of truth) 원칙을 깨고 이번처럼 silent failure를 만든다.
- **포맷 변경에 강함:** slug 단순화·다국어화·해시 fallback 등 파일명에 변동을 줄 변경이 추가로 발생해도 디우선 로직은 영향받지 않는다.
- **2026-05 시점 실측:** en 32 + ko 31 = 63 파일 규모에서 모두 풀 read해도 ~220KB. 2단계 필터(mtime + 부분 read)를 적용하면 일반적으로 stat 63 + 부분 read 5~10건으로 떨어져 무시 가능한 비용.

### 왜 mtime을 1차로만 쓰고 2차 판정은 pubDate인가

mtime은 빠르지만 git operation으로 흔들린다 (`git clone`, `git checkout -- file`은 mtime을 현재 시각으로 설정한다). 반면 pubDate는 작성 시점에 frontmatter로 고정되어 안정적이다. 1차 컷오프는 "넓게 후보를 추리는" 용도로만 쓰고, 최종 판정은 pubDate로 한다. 안전 마진(1일)을 두면 mtime 갱신 케이스에서도 후보가 누락되지 않는다.

### 왜 캐시 파일을 도입하지 않았는가

`scripts/.article-tools-cache.json` 같은 별도 캐시는 다음 비용을 만든다.

- 캐시 무효화 책임 (파일 삭제·이름 변경·롤백 추적)
- CI 환경에서 캐시 키 관리
- 캐시 파일이 단일 출처가 되어 ADR-0021의 "frontmatter 권위" 원칙과 충돌 가능

현재 파일 규모(63)와 향후 1~2년 예상 성장(연 ~500)을 고려할 때 2단계 필터로 충분하다. 캐시는 1000+ 파일 시점에 재검토한다.

### 왜 ADR-0015 결정 3을 부분 무효화하는가

ADR-0015 결정 3의 본질은 "타임존 영향을 제거한 안전한 cutoff 비교"이며, 그 수단으로 ISO 8601 문자열 비교를 선택했다. 본 ADR은 같은 본질을 달리 구현한다.

- `pubDate`는 ISO 8601 UTC 문자열(`2026-05-26T13:49:28.000Z`)로 저장된다. `new Date()`로 파싱하면 UTC 절대시각으로 풀리므로 KST/UTC 타임존 혼선이 발생하지 않는다.
- cutoff도 동일하게 `Date.now() - days × 86400000`(UTC ms)로 만들어 절대시각끼리 비교한다.

즉 ADR-0015가 회피하려 했던 "로컬 자정 vs UTC 자정" 문제는 본 변경에서도 발생하지 않는다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|-------------|
| 모든 .md를 풀 read해 frontmatter 파싱 | 현재 63 파일 규모에선 동작하지만, 향후 성장 시 비용 누적. 부분 read로 같은 결과를 훨씬 적은 I/O로 얻을 수 있음 |
| 파일 mtime만으로 판정 (frontmatter 무시) | git operation으로 mtime이 흔들리면 오판. ADR-0021 권위 출처 원칙과도 충돌 |
| slug에 날짜 prefix 복원 | ADR-0021 결정 6을 뒤집어야 함. 이미 배포된 URL/hreflang 영향이 큼. 핵심 문제(권위 출처 분산)는 해결되지 않음 |
| 캐시 파일(`.article-tools-cache.json`) 도입 | 캐시 무효화 책임·CI 관리 부담·권위 출처 분산. 현재 규모에 과한 최적화 |
| Astro Content Collection API(`getCollection`) 재사용 | 노드 스크립트에서 Astro 런타임 부팅 비용이 수백 ms. 자동화 스크립트가 무거워지고 결합도 상승 |
| 별도 메타 파일(`last-used-tools.json`)에 사용 도구 append | 외부 상태가 컨텐츠 디렉토리와 어긋날 위험. 자동화 신뢰성 저하 |
| 디우선 기간 2일 유지 | 4주간 실측 분포에서 SEJ 발행 빈도가 회전 주기를 압도하는 것이 확인됨. 회전 주기 연장 필요 |
| 디우선 기간 4일+ | ADR-0015가 식별한 "디우선 집합이 활성 소스 전체를 덮어 효과 무력화" 위험 |

## 결과 (Consequences)

### 긍정적 결과

- 디우선순위 메커니즘이 실제로 동작해 ADR-0015가 의도한 다양성 확보 효과를 회복
- frontmatter가 단일 권위 출처가 되어 slug 포맷 변경에 대한 회귀 위험 제거
- 2단계 필터로 I/O가 현재 풀 read 대비 ~40배 감소 (220KB → ~5KB)
- ADR-0015 §94 후속 조치(디우선 기간 2 → 3 조정)를 본 ADR에서 처리

### 부정적 결과 / 트레이드오프

- 디우선 기간 3일로 인해 발행 빈도가 높은 매체는 노출 회전이 더 느려짐 (의도된 결과)
- frontmatter `pubDate` 또는 `tool` 필드가 누락된 파일은 디우선 판정에서 제외됨 → 현 schema 검증이 이를 강제하므로 실질 위험 없음
- mtime 1일 마진으로 인해 cutoff 직전 ±1일 범위 파일이 추가로 부분 read됨 → 비용 무시 가능

### 후속 조치

- 자동화가 1~2주 운영된 후 [src/content/articles/](../../src/content/articles/) 분포를 재측정
- 다양성이 여전히 부족하면 **AI 매체(OpenAI, Anthropic, Google DeepMind) 추가**를 별도 ADR로 검토 (서비스 `/ai-config` 카탈로그와 정렬성 높음)
- 향후 파일 수가 1000+에 도달하면 캐시 파일 도입 재검토

## 참고 자료 (References)

- [scripts/update-articles.ts](../../scripts/update-articles.ts) — `getRecentlyUsedTools`, `readArticleHead` 구현
- [scripts/fetch-rss.ts](../../scripts/fetch-rss.ts) — `selectBalanced` 구현 (ADR-0015에서 도입한 deprioritize 옵션의 소비처)
- [ADR-0015: 아티클 소스 다양성 확보 전략](./ADR-0015-article-source-diversity.md) — 디우선순위 메커니즘 원안. 결정 3(파일명 기반 판정)은 본 ADR로 대체
- [ADR-0021: 아티클 Editorial Commentary 모델](./ADR-0021-article-editorial-commentary-model.md) — 결정 6(slug 단순화 + `pubDate` 권위 출처). 본 ADR이 그 원칙을 디우선 로직에 적용
- [ADR-0010: 아티클 콘텐츠 전략](./ADR-0010-article-content-strategy.md) — 아티클 노출 방식 원칙
- [ADR-0011: 아티클 AI 요약 자동화 전략](./ADR-0011-article-ai-summarization.md) — 자동화 파이프라인 설계
- [ADR-0013: 아티클 AI 도구 평가](./ADR-0013-article-ai-tool-evaluation.md) — RSS 도구 선택 기준 (AI 매체 추가 시 갱신 대상)
- [Node.js `fs.readSync`](https://nodejs.org/api/fs.html#fsreadsyncfd-buffer-offsetorptions-length-position) — 부분 read API
- [Node.js `fs.Stats.mtimeMs`](https://nodejs.org/api/fs.html#statsmtimems) — mtime 밀리초 정수 표현
