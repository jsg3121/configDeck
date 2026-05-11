# ADR-0021: Article 콘텐츠 모델 — Editorial Commentary 전환

- 상태: 승인됨
- 날짜: 2026-05-11
- 의사결정자: jsg3121
- 관련 SPEC: [SPEC-0007](../../ia/specs/features/SPEC-0007-article-content-model-redesign.md)
- 대체/정정 대상 ADR: [ADR-0011](ADR-0011-article-ai-summarization.md) (요약 모델 + 분량 결정 부분)

## 맥락 (Context)

### 출발점

[ADR-0011](ADR-0011-article-ai-summarization.md)에서 RSS 피드 기반 아티클을 AI로 자동 요약하기로 결정했다. 당시 결정 사항:
- **모델**: Gemini 2.5 Flash (한국어 품질 + 무료 티어)
- **분량**: 2~3문장 짧은 요약
- **입력**: RSS 피드 + 원문 링크 fetch → 본문 추출

### 실제 구현과의 불일치

이후 실제 구현([scripts/generate-summary.ts](../../../scripts/generate-summary.ts))은 ADR-0011과 다음과 같이 달라졌으나, ADR이 갱신되지 않았다.

| 항목 | ADR-0011 결정 | 실제 구현 (2026-05-11 기준) |
|---|---|---|
| AI 모델 | Gemini 2.5 Flash | Claude API (`claude-sonnet-4-20250514`) |
| 입력 | RSS + 원문 fetch | RSS description만 (원문 fetch 미구현) |
| 출력 분량 | 2~3문장 | 최소 800자, 4섹션 이상, 코드 예시 포함 |
| 콘텐츠 성격 | 짧은 해설 요약 | long-form 재가공 |

### 발견된 문제

2026-05-11 [RES-0005](../../research/reports/RES-0005-article-seo-diagnosis-2026-05.md)와 [RES-0006](../../research/reports/RES-0006-ai-prompt-improvement-2026-05.md)에서:

1. **사실 환각 (fabrication)**: 입력(RSS 1~2문장) 대비 출력(800자+ 코드 포함)의 정보 격차를 LLM이 환각으로 채운다. TypeScript 6.0 아티클에서 존재하지 않는 컴파일러 옵션·CLI 플래그·수치 다수 확인.
2. **Google Helpful Content / scaled content abuse 정책 패턴 일치**: 124개 누적된 아티클이 사이트 전체 도메인 권위를 깎는 상태.
3. **v1.5.2 핫픽스 적용 중**: 출혈 차단을 위해 `/article` 전체 `noindex` + sitemap 제외 상태이며, 콘텐츠 모델을 재설계한 뒤 풀어야 한다.

자동화는 유지하되 콘텐츠 품질을 회복할 수 있는 새 모델을 결정해야 한다.

## 결정 (Decision)

### 결정 1: Editorial Commentary 모델 채택

ConfigDeck 아티클의 **포지셔닝을 "primary reporting"에서 "editorial commentary"로 전환**한다. 즉:

- ConfigDeck은 원문을 "보도"하지 않고 **"코멘터리"한다**.
- 원본의 사실을 그대로 옮기는 것이 부가가치가 아니다. **"이 발표가 당신의 설정 파일에 무엇을 의미하는가"** 라는 ConfigDeck 고유 관점이 부가가치다.
- 풀 스토리는 원문(외부 사이트)으로 보낸다. 이게 의도된 행동이다.

### 결정 2: 출력 형식 변경

| 항목 | 변경 전 | 변경 후 |
|---|---|---|
| 분량 | 최소 800자 | 영문 350~550 단어, 한글 250~400 어절 |
| 섹션 | 4개 이상 가변 | 3개 고정: `What's actually new` / `What it means for your config` / `Recommended next step` |
| 코드 예시 | 필수 포함 | 검증 가능할 때만 포함, 의심 시 생략 |
| 출처 표시 | 상단 "View Original" 링크 | 상단 "Commentary on a {Source} announcement" 라벨 + 하단 "Read the full announcement on {Source} →" 강조 CTA |
| 분량 부족 시 | 환각으로 채움 | "원문 참조" 안내로 정직하게 짧게 작성 |

### 결정 3: AI 모델 — Claude API 유지 (Gemini 미전환)

ADR-0011의 Gemini 결정을 **정정**한다. 현재 운영 중인 Claude API (`claude-sonnet-4-20250514`)를 v1.6.0에서도 그대로 사용한다.

근거:
- 이미 운영 중인 통합이 안정적임 (API 키, 에러 처리, 재시도 로직 모두 검증됨)
- 모델 전환은 별도 리스크와 비용을 발생시킨다 (한국어 품질 회귀 검증 필요, 재구현 비용)
- ADR-0011의 Gemini 선택 핵심 근거였던 "무료 티어"는 매일 2건 발행 규모에서 Claude의 유료 비용도 미미함 (예상 월 $1~3)

### 결정 4: 원문 fetch 모듈 신설

RSS description 외에 **원문 URL의 본문을 HTTP fetch + Readability로 추출**해 LLM 입력에 함께 제공한다.

- 라이브러리: [@mozilla/readability](https://github.com/mozilla/readability) + [jsdom](https://github.com/jsdom/jsdom)
- 실패 케이스(JS 렌더링/페이월/403) 처리: description-only fallback
- 토큰 비용 통제: 본문 최대 8,000자 절단

### 결정 5: 자동 검증 + 재시도 + Manual Review Queue

생성된 마크다운에 대해 결정론적 검증을 수행한다.

- 검증 항목: 단어 수, 금지어, 필수 섹션, 필수 CTA, frontmatter 필드
- 실패 시: 최대 2회 재시도
- 최종 실패 시: `src/content/articles/.review-queue/`로 격리, 발행 차단

이 게이트가 환각 사례의 마지막 안전망이다.

### 결정 6: URL 구조 단순화

slug 생성 로직을 다음으로 변경:

- 변경 전: `2026-04-21-typescript-announcing-typescript-70-beta` (108자)
- 변경 후: `typescript-7-beta` (17자)

- 날짜 prefix 제거 (frontmatter `pubDate`가 권위 있는 출처)
- 경로의 `[tool]`과 중복되는 도구명 제거
- 최대 6단어로 제한 + 끝 하이픈 자동 제거

기존 124개를 전부 삭제하므로 301 redirect 불필요.

### 결정 7: 기존 124개 아티클 전부 삭제

Search Console 노출이 0에 가까운 상태이며, 환각 콘텐츠를 마이그레이션하는 비용이 새로 발행하는 비용보다 비합리적이다. `git rm`으로 전부 삭제하고 `.gitkeep`만 남긴다.

### 결정 8: BlogPosting JSON-LD + `isBasedOn`/`citation` 보강

[Schema.org](https://schema.org/)의 다음 속성을 추가해 derivative work의 정당성을 Google에 명시한다.

```typescript
'@type': 'BlogPosting',
isBasedOn: sourceUrl,
citation: {
  '@type': 'CreativeWork',
  name: title,
  url: sourceUrl,
  publisher: { '@type': 'Organization', name: sourceName },
}
```

`@type`을 기존 `Article`에서 `BlogPosting`으로 변경한다 (더 구체적인 타입, Google이 권장하는 블로그 글 표준).

### 결정 9: v1.6.0 작업 기간 RSS cron 일시 중지

[.github/workflows/update-articles.yml](../../../.github/workflows/update-articles.yml)의 `schedule:` 트리거를 주석 처리한다. `workflow_dispatch:`는 유지(수동 테스트용). v1.6.0 페이즈 5 머지 + 사용자 검증 후 재활성화.

## 근거 (Rationale)

### Editorial Commentary 모델의 SEO/품질 정당성

Google의 [Helpful Content System](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)은 "사용자에게 새 가치를 제공하지 않는 paraphrased/AI-generated content"에 페널티를 부과한다. 반대로 **derivative work 자체는 허용**되며, 출처를 정직하게 표시하고 고유 관점을 더하면 정당하다.

ConfigDeck의 고유 관점은 자명하다: **"이 도구의 변경이 당신의 설정 파일에 무엇을 의미하는가"**. Generator를 핵심 자산으로 보유한 사이트이기 때문에, "Recommended next step"에서 Generator로 자연스럽게 연결되는 구조가 가능하다. 이건 다른 사이트가 모방하기 어렵다.

### 출력 분량 축소가 환각을 줄이는 메커니즘

기존 프롬프트의 "최소 800자, 4섹션 이상, 코드 포함" 요구는 입력 정보가 부족할 때 LLM에 **환각 외의 선택지를 남기지 않는다**. 새 프롬프트는:

- 분량 상한 명시 (550 단어) → "채워야 한다"는 압력 제거
- "분량 부족 시 짧게 정직하게" 명시 → 환각 대신 솔직한 안내 허용
- 금지어 목록 (groundbreaking, revolutionary 등) → AI 클리셰 차단

### `isBasedOn`/`citation` Schema의 효과

Google의 [structured data documentation](https://developers.google.com/search/docs/appearance/structured-data)에 따르면 `isBasedOn`은 derivative work의 원본을 명시하는 표준 속성이다. 이는 SpamBrain이 콘텐츠를 평가할 때 "출처를 정직하게 표시한 derivative"와 "출처를 숨긴 paraphrase"를 구분하는 신호로 작동한다.

### Claude API 유지

ADR-0011의 Gemini 결정 당시 핵심 근거는 "한국어 품질"과 "무료 티어"였다. 그러나 실제 운영에서 Claude로 전환되었고 한국어 품질은 충분하다고 검증되었다. 매일 2건 발행 × 한국어/영어 = 4 API 호출 규모에서 Claude의 유료 비용($1~3/월)은 무시할 수 있다. 검증된 통합을 유지하는 것이 합리적이다.

### 원문 fetch 추가

LLM이 환각하지 않으려면 검증 가능한 사실이 입력에 충분히 있어야 한다. RSS description(1~2문장)으로는 부족하다. Mozilla Readability는 Firefox Reader Mode의 핵심 라이브러리로 다양한 사이트 HTML에서 본문 추출 신뢰성이 검증되어 있다.

### 자동 검증 게이트의 결정론

환각은 비결정론적으로 발생하지만, **환각이 사용하는 문구 시그니처(클리셰, 과장 표현)는 결정론적으로 탐지 가능**하다. 단어 수·금지어·필수 섹션 검증은 100% 결정론적이며, "발행 전 차단"이라는 마지막 안전망 역할을 한다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|---|---|
| 원문 fetch 없이 프롬프트만 수정 | 환각 차단의 근본 입력 부족 문제 미해결 |
| Gemini로 모델 전환 | 안정적으로 운영 중인 Claude 통합 재구현 비용 > 비용 절감 효과 |
| 800자 분량 유지하면서 원문 fetch만 추가 | 분량 강제가 여전한 환각 유인 |
| 사람 수동 큐레이션 | 자동화 유지가 사용자 결정 사항 |
| article 섹션 폐기 | 자동화 자산 포기 — 사용자가 자동화 유지 결정 |
| 기존 124개를 새 형식으로 재생성 | 트래픽 0에 가까운 글을 마이그레이션할 비용이 새로 발행할 비용 초과 |

## 결과 (Consequences)

### 긍정적

- 환각 사례가 결정론적 게이트(자동 검증)에서 차단됨 → 사용자 신뢰 보호
- `isBasedOn`/`citation` 명시 → Google이 derivative work로 정당하게 인식
- 출력 분량 축소 → Claude API 토큰 비용 ~50% 감소
- Generator 자산과 자연스러운 연결 → 핵심 페이지로의 내부 링크 강화
- "ConfigDeck = 설정 파일 관점의 코멘터리 사이트" 라는 명확한 포지셔닝

### 부정적

- 글당 정보량 감소 → 일부 사용자가 "짧다"고 느낄 수 있음 (하단 원문 CTA로 완화)
- 원문 fetch 실패 사이트는 description-only fallback → 해당 글의 부가가치 섹션이 짧아짐
- 검증 재시도 후에도 실패하는 글이 발생할 수 있음 → manual review queue 운영 부담 (현실은 매우 낮은 빈도 예상)
- 기존 124개 삭제 → 외부에서 직접 링크된 글이 있다면 404 (대부분 트래픽 0이라 영향 최소)

### 후속 조치

- [ ] v1.6.0 페이즈 1: 본 ADR + SPEC 머지, cron 일시 중지
- [ ] 페이즈 2: 원문 fetch 모듈 + sample 5건 검증
- [ ] 페이즈 3: 새 프롬프트 + helpers + 검증 시스템 + schema 확장 + slug 재작성
- [ ] 페이즈 4: BlogPosting JSON-LD + UX 변경
- [ ] 페이즈 5: 기존 124개 삭제 + sample 발행 검증
- [ ] v1.6.0 릴리즈 후: 신규 발행량 10~20건 누적 검증 후 `noindex` 해제 결정 (별도 시점)

## 참고 자료 (References)

- [RES-0005: ConfigDeck Article SEO 진단 보고서](../../research/reports/RES-0005-article-seo-diagnosis-2026-05.md) — 사실 환각 사례, 정책 위험 증거
- [RES-0006: ConfigDeck AI 프롬프트 개선 보고서](../../research/reports/RES-0006-ai-prompt-improvement-2026-05.md) — Editorial Commentary 모델 + 검증 시스템 설계 원안
- [SPEC-0007: Article 콘텐츠 모델 재설계](../../ia/specs/features/SPEC-0007-article-content-model-redesign.md) — 본 ADR의 실행 기획서
- [ADR-0011: 아티클 AI 요약 자동화 전략](ADR-0011-article-ai-summarization.md) — 선행 결정 (Gemini→Claude 전환, RSS only→원문 fetch 추가는 본 ADR에서 정정)
- [Google Helpful Content System](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — 정책 근거
- [Google Search Central — Spam policies (scaled content abuse)](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) — 양산 콘텐츠 정책
- [Schema.org BlogPosting](https://schema.org/BlogPosting) — JSON-LD 표준 (블로그 글)
- [Schema.org isBasedOn](https://schema.org/isBasedOn) — derivative work 원본 지정
- [Schema.org citation](https://schema.org/citation) — 인용 출처 표시
- [Mozilla Readability](https://github.com/mozilla/readability) — 원문 본문 추출 라이브러리
