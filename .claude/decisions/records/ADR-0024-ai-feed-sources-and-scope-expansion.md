# ADR-0024: AI 매체 RSS 추가 및 콘텐츠 범위 확장 (v1.7.0)

- 상태: 승인됨
- 날짜: 2026-05-29
- 의사결정자: jsg3121
- 근거 리서치: [RES-0007: AI 매체 RSS 피드 추가 검토](../../research/reports/RES-0007-ai-feed-sources-evaluation.md)

## 맥락 (Context)

[ADR-0023](./ADR-0023-article-deprioritize-frontmatter-source.md) (v1.6.3)에서 디우선순위 메커니즘 silent failure를 복구한 직후 첫 자동화 사이클에서 4주간 0건이던 `astro` 매체가 선택됐다. 그러나 활성 매체는 여전히 4~5개에 그쳐 ADR-0015가 의도한 다양성 효과는 부분적으로만 회복됐다.

같은 시점에 ConfigDeck은 v1.4~1.6에서 `/ai-config` 카탈로그를 도입했고([ADR-0017](./ADR-0017-ai-config-file-format-priority.md), [ADR-0018](./ADR-0018-agent-skills-catalog.md), [ADR-0019](./ADR-0019-ai-config-ia-redesign.md)), AI 도구 설정 파일(AGENTS.md, Claude.md, Cursor .mdc, Copilot Instructions, Skills 등) 8종을 생성할 수 있게 됐다. 그러나 카탈로그 도메인에 대응하는 RSS 매체가 부재해, 아티클 콘텐츠와 서비스 카탈로그가 정렬되지 않는 문제가 있다.

[RES-0007](../../research/reports/RES-0007-ai-feed-sources-evaluation.md)에서 10개 AI 매체 후보를 조사한 결과, 공식 RSS를 제공하는 4곳(OpenAI News, Hugging Face, Google DeepMind, blog.google AI)을 식별했고, 발행 빈도·라이선스·서비스 정렬도·구현 비용을 분석했다.

본 ADR은 RES-0007 결과를 근거로 v1.7.0 채택 매체와 알고리즘 파라미터, 그리고 [ADR-0010](./ADR-0010-article-content-strategy.md)의 콘텐츠 범위 확장을 결정한다.

## 결정 (Decision)

### 결정 1: AI 매체 RSS 4곳 추가 (v1.7.0)

다음 4개 매체를 `scripts/fetch-rss.ts`의 `FEED_CONFIGS`와 `Tool` union에 추가한다.

| 매체 | RSS URL | Tool slug | 포맷 | 정렬도 |
|---|---|---|---|---|
| OpenAI News | `https://openai.com/blog/rss.xml` | `openainews` | RSS 2.0 | ★ (직접) |
| Hugging Face Blog | `https://huggingface.co/blog/feed.xml` | `huggingface` | RSS 2.0+Atom ns | ★★ (최고) |
| Google DeepMind Blog | `https://deepmind.google/blog/rss.xml` | `googledeepmind` | RSS 2.0 | ◐ (간접) |
| Google AI Blog | `https://blog.google/technology/ai/rss/` | `googleaiblog` | RSS 2.0 | ◐ (간접, 노이즈 있음) |

**채택 근거 (RES-0007 §1.1, §2):**
- 4곳 모두 **공식 RSS 제공**. ADR-0010이 채택한 "공식 채널 우선" 원칙 정합
- OpenAI/HF는 ConfigDeck `/ai-config` 카탈로그가 다루는 "AI 도구 설정·운영" 토픽 직접 다룸 (★)
- DeepMind/blog.google AI는 정렬도가 ◐이지만 다양성·SEO 가치 확보 목적

### 결정 2: Anthropic은 v1.7.0 채택 보류

Anthropic은 공식 RSS·Atom 채널을 제공하지 않는다 (2026-05-29 확인). RES-0007 §7.1에서 `https://www.anthropic.com/news`의 HTML에 `<link rel="alternate">` 없음, `/news/feed.xml` 404를 확인했다.

대안 비교 (RES-0007 §7.2):
- HTML 스크래핑: 저작권 위험(MidlevelU v. Newstex 판례 영역) + 페이지 구조 변경 시 silent failure
- Twitter/X API: 비용 $100/월 이상 + 약관 부담
- GitHub releases: SDK release만 fetch 가능, 일반 announcements 누락

**보류 결정 + 후속 조치:** Anthropic이 공식 RSS를 제공하기 시작하면 v1.x.x에서 즉시 추가한다 (별도 ADR 없이 PR로 처리 가능, 단 한 줄 변경 이력만 본 ADR에 갱신).

### 결정 3: `DEPRIORITIZE_DAYS`를 3 → 5일로 연장

매체가 4곳 늘어나 활성 매체 풀이 ~5개 → ~9개로 두 배가 된다. RES-0007 §4.2의 회전 주기 계산:

- 현재 (활성 5개, K=2, D=3): 평균 회전 2.25일 — D가 회전 주기와 거의 같아 디우선 효과 약함
- v1.7.0 (활성 9개, K=3, D=5): 평균 회전 2.37일, D 5일이 회전을 1.5배 덮어 효과적

**5일 선택 근거 (RES-0007 §4.3):**
- 4일 이하: 회전 주기와 비슷해 디우선 효과 약함
- 6~7일 이상: 디우선 대상이 활성 매체 절반 이상이 되어 [ADR-0015](./ADR-0015-article-source-diversity.md) §62~63이 식별한 "효과 무력화" 임계 진입

### 결정 4: 일일 발행 수량 K를 2 → 3으로 증대

[scripts/update-articles.ts:220](../../../scripts/update-articles.ts#L220)의 `selectBalanced(newItems, 2, ...)`를 `selectBalanced(newItems, 3, ...)`로 변경한다.

**비용 분석 (RES-0007 §5.1):**
- Claude Opus 4.6 (현재 사용 모델) 기준 K=2 → K=3 시 월간 API 비용 ~$12 → ~$18.5 (+$6/월)
- prompt caching 도입 시 ~15% 추가 절감 가능 (v1.7.0 범위 밖, SPEC-0007 후속)

**기술 안전성 (RES-0007 §5.2, §5.3):**
- GitHub Actions 직렬 호출 시간 2~3분 → 3~4분, timeout 6시간 대비 안전
- 일 신규 페이지 ko 3 + en 3 = 6 파일, Google crawl budget 가이드 임계(10K+ 페이지) 밖
- sitemap 정적 생성, hreflang 비대칭(ADR-0022) 영향 없음

**품질 영향 (RES-0007 §5.4):**
- API 호출이 아이템별 독립이라 K가 검증 통과율에 영향 없음
- SPEC-0007 §6.2 M5 게이트 18사이클 review queue 0건 안정 상태에서 K 증대 안전

### 결정 5: [ADR-0010](./ADR-0010-article-content-strategy.md) 콘텐츠 범위 확장 명문화

ADR-0010 §9의 원안 범위는 "ESLint, Prettier, TypeScript, Next.js, React, Astro, Node.js의 업데이트 뉴스"였으나, ADR-0013을 거쳐 v1.6.x 기준 15개 매체로 사실상 확장됐다 (SEJ, blog.google 등 콘텐츠 매체 포함).

본 ADR에서 v1.7.0 이후 범위를 다음으로 **공식 확장**한다:

> **확장 범위**: ConfigDeck 아티클 콘텐츠는 "프론트엔드·웹 개발·AI 도구의 설정·운영·연구"를 포괄한다. RSS 매체 선정 기준은 (1) 공식 RSS/Atom 제공, (2) ConfigDeck 카탈로그·생성기 도메인과의 토픽 정렬도, (3) 발행 빈도·라이선스 안정성이다.

ADR-0010 상단에 본 ADR 참조 안내를 추가한다 (별도 ADR-0025를 만들지 않음 — 범위 확장은 ADR-0010의 결정 1~3 본문을 뒤집지 않고 적용 도메인만 넓힌다).

## 근거 (Rationale)

### 왜 공식 RSS 제공 매체만 채택했는가

ADR-0010 결정 1과 §71이 명시한 원칙은 "공식 RSS는 묵시적 배포 허락 범위 안, 비공식 스크래핑은 그 범위 밖(MidlevelU v. Newstex)". 정렬도 ★★인 Anthropic을 채택하지 않은 이유는 자동화 정책의 일관성을 깨지 않기 위함이다. RSS 미제공 매체 6곳을 모두 보류함으로써 v1.7.0 이후 같은 기준이 신규 매체에도 일관 적용된다.

### 왜 K = 3인가 (2도, 5도 아님)

| 옵션 | 회전 주기 | D | 월 비용 | 평가 |
|---|---|---|---|---|
| K=2 유지 | 3.55일 | 4일 | $12 | AI 매체 추가 효과가 회전 주기에 묻힘 |
| **K=3** | **2.37일** | **5일** | **$18.5** | **균형** |
| K=4 | 1.78일 | 6~7일 | $24.6 | D가 ADR-0015 임계 근접 |
| K=5 | 1.42일 | 7일 이상 | $30.8 | D 임계 초과, 효과 무력화 |

K=3은 (a) AI 매체 추가의 다양성 효과를 실측 가능한 수준으로 노출하고, (b) D를 ADR-0015 안전 영역 안에 유지하며, (c) API 비용 증가가 ConfigDeck 수익 모델(애드센스)의 부가가치 가설 안에서 회수 가능한 수준이다.

### 왜 ADR-0010 본문을 직접 수정하지 않는가

ADR-0010의 결정 1~3(혼합형 / GitHub Actions / Snippet 방식)은 v1.7.0에서도 그대로 유효하다. 변경되는 것은 "어떤 매체를 다루는가"의 적용 도메인뿐. ADR 본문을 수정하면 v1.4 이전의 판단 기록이 손실되므로, [ADR-0023](./ADR-0023-article-deprioritize-frontmatter-source.md)이 ADR-0015 결정 3만 부분 갱신했던 방식과 동일하게 ADR-0010 상단에 참조 안내만 추가한다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|---|---|
| Anthropic HTML 스크래핑으로 채택 | 저작권 영역 진입(MidlevelU v. Newstex), 페이지 구조 변경 시 silent failure, ADR-0010 일관성 깨짐 |
| AI 매체 6곳 모두 추가 (Mistral, Meta AI, Cohere, LangChain, Vercel AI 포함) | 6곳 모두 공식 RSS 미제공. 채택 시 스크래핑 인프라 별도 필요 |
| K = 2 유지 | AI 매체 4개 추가해도 회전 주기에 효과가 묻혀 다양성 회복이 늦음 |
| K = 5 | D 임계 초과, ADR-0015 §62~63이 정의한 "디우선 효과 무력화" 영역 |
| `DEPRIORITIZE_DAYS = 4` | 회전 주기와 비슷해 디우선 효과 약함 |
| `DEPRIORITIZE_DAYS = 7+` | 활성 매체 절반 이상이 디우선 대상 → 효과 무력화 |
| blog.google AI 제외 (정렬도 ◐) | 다양성·SEO 가치는 ◐ 매체에도 존재. 1~2주 분포 관찰 후 제외 여부 재검토. v1.7.0에선 채택 |
| ADR-0010을 직접 수정 | 원안 판단 기록 보존이 ConfigDeck ADR 관행 (ADR-0023 사례). 상단 참조 안내가 일관된 방식 |
| 별도 ADR-0025로 콘텐츠 범위만 분리 | 결정 1~4와 같은 트리거(AI 매체 추가)에서 발생한 단일 의사결정이므로 분리 시 가독성 저하 |

## 결과 (Consequences)

### 긍정적

- ConfigDeck `/ai-config` 카탈로그 도메인과 아티클 콘텐츠가 정렬되어 카탈로그 자식 랜딩의 "관련 아티클" 슬롯이 채워짐
- 활성 매체 풀이 5→9개로 두 배 증가, ADR-0015 다양성 메커니즘이 실효적으로 작동
- 일일 수량 K=3으로 콘텐츠 회전이 빨라져 SEO 신선도·체류 시간 개선 기대
- ADR-0010의 콘텐츠 범위가 공식 문서화되어 향후 매체 추가 의사결정 기준이 명확

### 부정적 / 트레이드오프

- Anthropic 정렬도 ★★ 매체를 v1.7.0에서 놓침. 공식 RSS 제공 시점까지 대기
- Anthropic API 비용 월 +$6 (~$18.5/월). 애드센스 수익으로 회수 가설
- blog.google AI는 정렬도 ◐로 사용자에게 노이즈가 될 가능성. 1~2주 분포 관찰 후 제외 검토 여지
- OpenAI `/blog/rss.xml` URL은 현재 동작하지만 OpenAI가 `/news/`로 리브랜딩한 흔적이 있어 향후 변경 가능. fetch-rss.ts의 fetch 실패 시 빈 배열 반환 패턴이 안전망

### 후속 조치

- [ ] **v1.7.0 구현 페이즈** (`feature/1.7.0-ai-feed-implementation`):
  - `scripts/fetch-rss.ts`: `Tool` union 확장, `FEED_CONFIGS` 4개 추가
  - `scripts/update-articles.ts`: `DEPRIORITIZE_DAYS = 5`, `selectBalanced(..., 3, ...)`
  - `src/content.config.ts`: `tool` enum에 4개 slug 추가
  - 매체 라벨 (ko/en) 다국어 추가
- [ ] **OpenAI Terms of Use 직접 확인** (RES-0007에서 fetch 403). 구현 직전에 한 번 더 확인하고, 명시적 redistribution 금지 조항이 있다면 OpenAI 채택 재검토
- [ ] **1~2주 분포 모니터링** (v1.7.0 머지 후):
  - blog.google AI의 정렬도 ◐ 매체가 사용자 가치를 주는지 평가
  - K=3에서 hreflang 비대칭·review queue 통과율 추세 확인
- [ ] **Anthropic 공식 RSS 모니터링**: 분기별 1회 `anthropic.com/news`의 `<link rel="alternate">` 재확인. 제공 시작 시 즉시 PR
- [ ] **prompt caching 도입 검토** (SPEC-0007 후속): 시스템 프롬프트 캐시 hit으로 ~15% 비용 절감 가능

## 참고 자료 (References)

### 본 ADR의 직접 근거

- [RES-0007: AI 매체 RSS 피드 추가 검토 (v1.7.0)](../../research/reports/RES-0007-ai-feed-sources-evaluation.md) — 매체 메타데이터·정렬성·라이선스·수량 시뮬레이션·Anthropic 대응 분석

### 기존 ADR (영향받음)

- [ADR-0010: 아티클 콘텐츠 수집 및 갱신 전략](./ADR-0010-article-content-strategy.md) — 본 ADR 결정 5에서 범위 확장 명문화
- [ADR-0015: 아티클 소스 다양성 확보 전략](./ADR-0015-article-source-diversity.md) — 본 ADR 결정 3이 `DEPRIORITIZE_DAYS` 파라미터 갱신
- [ADR-0023: 디우선순위 frontmatter 기반](./ADR-0023-article-deprioritize-frontmatter-source.md) — v1.6.3 복구. 본 ADR은 그 위에서 매체 풀 확장 + D 재조정

### 기존 ADR (맥락)

- [ADR-0011: 아티클 AI 요약 자동화 전략 (Gemini)](./ADR-0011-article-ai-summarization.md) — ADR-0021로 부분 대체
- [ADR-0013: 아티클 AI 도구 평가](./ADR-0013-article-ai-tool-evaluation.md) — RSS 도구 선택 기준 (본 ADR이 갱신)
- [ADR-0017: AI 도구 설정 파일 형식 우선순위](./ADR-0017-ai-config-file-format-priority.md) — `/ai-config` 카탈로그 정렬 대상
- [ADR-0018: Agent Skills 카탈로그 채택](./ADR-0018-agent-skills-catalog.md) — 카탈로그 도메인
- [ADR-0019: AI Config IA 재설계](./ADR-0019-ai-config-ia-redesign.md) — 카탈로그 + 통합 생성기 구조
- [ADR-0021: Editorial Commentary 모델](./ADR-0021-article-editorial-commentary-model.md) — Snippet 방식·검증·slug 정책

### 외부 자료

- [Anthropic API Pricing](https://platform.claude.com/docs/en/about-claude/pricing) — Opus 4.6 입력 $5/출력 $25 per MTok (2026-05-29 확인)
- [Google Search Central — Managing crawl budget](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget) — 일 1~10 페이지는 crawl budget 가이드 임계 밖
- [Anthropic robots.txt](https://www.anthropic.com/robots.txt) — 크롤링 제한 없음 (단, RSS 미제공 매체 스크래핑은 정책상 회피)
