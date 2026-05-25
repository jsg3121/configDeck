# ADR-0022: Article 색인 재오픈 — v1.5.2 핫픽스 해제

- 상태: 승인됨
- 날짜: 2026-05-25
- 의사결정자: jsg3121

## 맥락 (Context)

v1.5.2(2026-05-11, PR #61)에서 자동 생성 article 콘텐츠의 환각 이슈로 도메인 권위가 깎이는 것을 차단하기 위해 `/article` 전 페이지에 `noindex, nofollow`를 적용하고 sitemap에서 `/article` 경로를 제외하는 핫픽스를 적용했다. 이는 출혈 차단용 임시 조치였으며, SPEC-0007 §6.2 M5와 ADR-0021 후속 조치에서 다음 게이트를 만족하면 해제하기로 합의했다.

- Editorial Commentary 모델로 신규 발행 10~20건 누적
- 누적 기간 동안 환각 사례 < 5% (manual review queue 비율)
- 기술적 산출물(URL 단순화, BlogPosting JSON-LD, `isBasedOn`/`citation`, mainEntityOfPage ↔ canonical 일치, 기존 124개 환각 글 삭제) 완비

2026-05-25 기준 main의 누적 발행량은 en 26건 / ko 25건이며, 핫픽스 이후 18사이클의 자동 발행이 review queue 잔존 없이 통과했다. 모든 기술 게이트가 v1.6.0/v1.6.1에서 처리 완료된 상태다.

## 결정 (Decision)

다음 4개 변경으로 `/article` 색인을 재오픈한다 (브랜치: `feature/1.6.2-article-reindex`).

1. **3개 article 페이지에서 `noindex` prop 제거**
   - `src/pages/[locale]/article/index.astro`
   - `src/pages/[locale]/article/[tool]/index.astro`
   - `src/pages/[locale]/article/[tool]/[slug].astro`
2. **`astro.config.mjs` sitemap filter 해제 + `/article` 항목 priority/changefreq 정책 추가**
   - article 상세: priority 0.6 / changefreq monthly
   - article 카테고리·목록: priority 0.5 / changefreq weekly
3. **Layout.astro에 `hreflangAlternates` prop 추가, 상세 페이지에서 실존 locale만 전달**
   - article 발행 파이프라인이 한쪽 locale 검증 실패로 비대칭 발행할 수 있으므로, 글별 locale 존재 맵을 만들어 실존 locale만 hreflang으로 출력한다.
   - 미지정 시 기존 `getAllLocaleAlternates(pagePath)` fallback 유지 (다른 페이지 영향 없음).

## 근거 (Rationale)

### 누적량 게이트(M5) 통과 확인

SPEC-0007 §6.2가 정의한 "신규 발행량 10~20건 누적" 기준 대비 main 누적량은 en 26 / ko 25로 충분히 초과 달성했다. 5월 11일~5월 25일 사이 자동 발행 PR이 18회(#76~#85 등) 무사 누적되었고, 환각·임계치 위반에 의한 review queue 적재가 발생하지 않았다. 이는 `validateArticle` 게이트가 결정론적으로 작동하고 있다는 실측 근거다.

### 비대칭 발행 시 hreflang 처리의 필요성

RES-0005 §6에서 지적된 cross-language 오류(존재하지 않는 ko URL을 가리키는 hreflang)는 noindex 상태에서는 잠재 리스크였지만 색인 재오픈 시 즉시 실제 문제가 된다. 현재도 `computing-and-displaying-discounted-prices-in` 글이 en에만 발행된 비대칭 상태이며, 검증 실패에 의한 단방향 발행은 앞으로도 발생할 수 있다.

Google 공식 가이드(["Tell Google about localized versions of your page"](https://developers.google.com/search/docs/specialized/international/localized-versions))는 "각 hreflang 대상 URL은 실제 콘텐츠를 반환해야 하며, 그렇지 않으면 hreflang 클러스터 전체가 무효화될 수 있다"고 명시한다. 따라서 글별 locale 존재 여부를 실측해 hreflang을 동적으로 구성하는 것이 SEO·HTTP 무결성 양면에서 정석이다.

### Layout API 변경의 영향 범위 최소화

기존 호출부는 `hreflangAlternates` 미지정 시 기존 fallback(`getAllLocaleAlternates(pagePath)`)을 그대로 사용한다. 따라서 article 상세 페이지만 명시적으로 전달하고, 다른 모든 페이지는 동작이 동일하다.

### sitemap priority 정책

article 상세는 generator(0.9) / advisory 상세(0.7) 대비 한 단계 낮은 0.6으로 설정했다. Editorial Commentary 모델은 원본 출처로 트래픽을 흘려보내는 derivative work이기 때문에 ConfigDeck의 핵심 자산(Generator·Migration)보다는 낮은 우선순위가 적절하다. changefreq monthly는 발행 후 콘텐츠가 거의 갱신되지 않는 실측 패턴을 반영했다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| 비대칭 글 1건을 삭제해 hreflang 분기 없이 풀기 | 향후 검증 실패에 의한 단방향 발행이 또 발생할 수 있어 근본 해결이 안 됨 |
| article 상세에서 hreflang 자체를 생략 | en/ko 양쪽 있는 25건도 hreflang 혜택을 잃어 SEO 손해가 큼 |
| 누적량이 더 쌓일 때까지(50건+) 대기 | M5 게이트는 10~20건이 기준이며 이미 초과 달성. 추가 대기는 SPEC 약속과 무관한 보수적 판단 |
| article 섹션 폐기 | ADR-0021에서 이미 불채택. Editorial Commentary 모델이 정상 작동 중 |

## 결과 (Consequences)

### 긍정적

- 도메인 권위 회복 신호와 함께 article 트래픽이 점진적으로 복구된다 (Search Console 색인 ≈ 2~4주 예상).
- Generator 페이지의 사이트 단위 평가 부담이 줄어 핵심 자산 노출이 개선될 가능성이 있다.
- 비대칭 발행이 발생해도 hreflang이 자동으로 정상 클러스터를 유지한다.

### 부정적

- 색인 재오픈 직후 Search Console에서 신규 article URL이 "발견됨 – 색인 생성되지 않음" 단계를 일시적으로 거친다(정상 흐름).
- 환각이 다시 발생할 경우 색인된 상태에서 빠지기까지 시간이 걸린다 → `validateArticle` 게이트가 실측 지표로 유지되어야 한다.

### 후속 조치

- [x] SPEC-0007 §6.3 마지막 체크박스(`v1.6.0 릴리즈 후: 신규 발행이 충분히 누적될 때까지 noindex 유지`) 체크 처리
- [ ] PR 머지 후 Cloudflare Pages 배포 확인 + 프로덕션 robots 메타 미출력 실측
- [ ] Search Console에서 sitemap 재제출 + 색인 진행 추적 (1~2주)
- [ ] 4주 후: article 페이지 색인 비율과 Generator 페이지 노출 변화 모니터링

## 참고 자료 (References)

- [SPEC-0007: Article Content Model Redesign](../../ia/specs/features/SPEC-0007-article-content-model-redesign.md) — M5 게이트 정의
- [ADR-0021: Article Editorial Commentary 모델](ADR-0021-article-editorial-commentary-model.md) — 선행 결정 + 후속 조치 정의
- [RES-0005: Article SEO 진단 보고서](../../research/reports/RES-0005-article-seo-diagnosis-2026-05.md) — hreflang 비대칭 리스크 식별
- [Google: Tell Google about localized versions](https://developers.google.com/search/docs/specialized/international/localized-versions) — hreflang 클러스터가 정상 콘텐츠를 반환해야 한다는 공식 가이드
- [v1.5.2 핫픽스 PR #61](https://github.com/jsg3121/configDeck/pull/61) — 본 ADR이 해제하는 임시 조치
