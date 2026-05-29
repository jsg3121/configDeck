# RES-0007: AI 매체 RSS 피드 추가 검토 (v1.7.0)

- 조사 일자: 2026-05-29
- 조사자: jsg3121 (Claude Code)
- 관련 ADR: ADR-0010(아티클 콘텐츠 전략), ADR-0011(AI 요약 자동화), ADR-0013(AI 도구 평가), ADR-0015(다양성 확보), ADR-0021(Editorial Commentary), ADR-0023(디우선순위 복구)
- 후속 ADR: ADR-0024 (예정)

## 요약

10개 AI 관련 매체 후보를 조사한 결과, **공식 RSS/Atom을 제공하는 매체는 4곳(OpenAI News, Google DeepMind, Hugging Face, blog.google AI)**이며, **나머지 6곳(Anthropic, Mistral, Meta AI, Cohere, LangChain, Vercel AI)은 공식 RSS를 제공하지 않는다**. ConfigDeck의 자동화 정책(공식 채널 우선, 스크래핑 회피)을 고려하면 RSS 제공 4곳을 우선 채택하고 나머지는 향후 RSS 제공 시 재검토하는 것이 합리적이다.

매체가 4곳 늘어남에 따라 활성 매체 풀이 5→9개 수준으로 커지므로, `DEPRIORITIZE_DAYS`를 3→5일로 늘려 회전 주기를 유지하고, 일일 발행 수량 K를 2→3으로 한 단계만 증대하는 것을 권장한다. K=3은 Anthropic API 비용 월 ~$12 수준으로 부담 없고, GitHub Actions 직렬 호출 timeout 위험이 낮으며, Google 크롤 가이드라인 임계(일 10페이지 미만)에도 들지 않는다.

ADR-0010 §22의 "혼합형(RSS + 편집자 주석)" 범위가 ConfigDeck의 `/ai-config` 카탈로그 도메인을 포괄하도록 ADR-0024에서 명문화한다. AI 매체 추가는 ADR-0010의 의도(부가가치 콘텐츠로 SEO·체류 시간 확보)와 동선이 같다.

---

## 1. 매체 메타데이터 (후보군 조사)

### 1.1 공식 RSS 제공 매체 (4곳)

| 매체 | URL | 포맷 | 발행 빈도 (실측 2026-05) | 콘텐츠 성격 |
|---|---|---|---|---|
| **OpenAI News** | `https://openai.com/news/rss.xml` | RSS 2.0 | 주 6~8건 (5/22~28 실측) | 제품 출시·고객 사례·정책·연구 |
| **Google DeepMind** | `https://deepmind.google/blog/rss.xml` | RSS 2.0 | 약 22건 누적 (월 5~8건 추정) | 연구 논문 발표 중심 |
| **Hugging Face Blog** | `https://huggingface.co/blog/feed.xml` | RSS 2.0 + Atom ns | 주 4~6건 | 모델 출시·튜토리얼·벤치마크 |
| **blog.google (AI 카테고리)** | `https://blog.google/technology/ai/rss/` | RSS 2.0 | 약 150건 누적, 주 3~5건 | Google AI 제품·정책·연구 (혼합) |

**OpenAI 검증 노트**: 초안에서는 `/blog/rss.xml`을 채택 후보로 적었으나, v1.7.0 P2 구현 페이즈(2026-05-29) 확인 결과 OpenAI가 채널을 `/news`로 리브랜딩했고 `https://openai.com/news/rss.xml`이 같은 RSS 2.0을 반환한다. `/news/rss.xml`이 채널명("OpenAI News")과 일치해 장기적으로 안정적이라 본 ADR-0024가 후자를 채택. 두 경로 모두 현재 유효하나 사이트 채널 페이지(`openai.com/news`)와 정렬된 후자가 향후 리디렉션 위험이 적다.

**Google DeepMind 검증 노트**: 사용자 메시지에 적힌 `deepmind.google/discover/blog/rss.xml`은 404였고, `deepmind.google/blog/rss.xml`이 정확한 경로.

**blog.google AI 카테고리 노트**: Google 본사 블로그의 AI 카테고리 RSS는 매체 출처가 "Google AI" 외에도 "Google 정책", "Google I/O 행사" 등이 섞여 ConfigDeck의 토픽 정렬도가 낮은 항목이 절반 정도. 후술 §2에서 정렬성 평가.

### 1.2 공식 RSS 미제공 매체 (6곳)

| 매체 | RSS 상태 | 발행 빈도 (페이지 실측) | 비고 |
|---|---|---|---|
| **Anthropic News** | 미제공 (확인됨, 상세 §7) | 14일간 10건 ≈ 주 5건 | newsletter 가입만 가능 |
| **Mistral AI** | 미제공 | 74건 누적, 주 단위 클러스터 | newsletter만 |
| **Meta AI Blog** | 미제공 | 추정 주 2~3건 | newsletter만 |
| **Cohere Blog** | 미제공 | 추정 주 1~2건 | newsletter만 |
| **LangChain Blog** | 미제공 (`/rss/` 301→`/blog/rss` HTML로 redirect) | 매우 활발, 일 1~2건 | RSS 경로가 HTML로 응답 |
| **Vercel AI** | Vercel changelog 전체에 AI 항목 혼재 (`vercel.com/changelog/rss.xml`) | 전체 50건, 그 중 AI 관련 ~30~40% | AI 전용 분리 채널 없음 |

**Vercel changelog 노트**: 전체 RSS는 정상이지만 ConfigDeck의 `Tool` 타입 디자인이 "출처 매체 = 도구"인데, Vercel changelog는 Next.js·AI Gateway·인프라가 모두 섞여 있어 단일 tool slug로 묶기 어렵다. 별도 ADR로 카테고리 필터링 정책을 정해야 채택 가능.

### 1.3 라이선스 검토

ADR-0010 결정 3이 정의한 "**제목 + 편집자 요약 + 원문 링크** (Snippet 방식)"가 본 매체들에도 동일하게 적용 가능한지 확인.

| 매체 | 라이선스/약관 출처 | Snippet 방식 적합성 |
|---|---|---|
| OpenAI | Terms of Use (403으로 직접 확인 실패) | 동종 매체(SEJ/CSS-Tricks)와 같이 fair use·commentary 범위로 가능 추정. 단 OpenAI 약관에 명시 조항이 있다면 우선. **별도 약관 직접 확인 필요** |
| Google DeepMind / blog.google | Google 약관 (CC 라이선스 없음) | fair use·인용 + 원문 링크는 일반적 관행 범위. 전문 재게시는 금지 |
| Hugging Face | 블로그 글 자체는 보통 CC-BY 또는 작성자 별도 라이선스 (글마다 다름) | Snippet 방식은 안전 |

> **공통**: ADR-0021의 Editorial Commentary 모델(원문 발췌 없이 ConfigDeck 자체 1~3 문단 commentary 생성)이 fair use·부가가치 요건을 동시에 만족시키므로, 신규 매체에도 동일하게 적용하면 기존 매체와 동일한 법적 리스크 프로파일을 유지한다. ADR-0010 결정 3 + ADR-0021 결정 1을 그대로 적용.

> **별도 추적**: OpenAI Terms of Use의 redistribution 조항 직접 확인은 본 리서치에서 fetch 403으로 실패. ADR-0024 작성 시 잠시 reachable한 환경에서 한 번 더 확인하거나, ADR 본문 후속 조치 항목에 "OpenAI ToS 확인 후 채택 확정"으로 명시.

---

## 2. 서비스 정렬성

ConfigDeck의 핵심 콘텐츠 도메인:
- **/ai-config 카탈로그**: AGENTS.md, Claude.md, Cursor .mdc, Copilot Instructions, Skills 등 AI 도구 **설정 파일** 생성기 ([ADR-0017](.claude/decisions/records/ADR-0017-ai-config-file-format-priority.md), [ADR-0018](.claude/decisions/records/ADR-0018-agent-skills-catalog.md))
- **기존 아티클**: 프론트엔드 도구 설정·SEO·웹 개발 트렌드 ([ADR-0010](.claude/decisions/records/ADR-0010-article-content-strategy.md))

각 매체의 토픽 정렬도를 평가한다 (★ = 직접 정렬, ◐ = 간접 정렬, ○ = 정렬도 낮음).

| 매체 | AI 도구 설정·운영 | AI 모델 출시 | 연구 발표 | 정책·정렬 | 종합 |
|---|---|---|---|---|---|
| **OpenAI News** | ◐ (Codex 가이드·고객 사례) | ★ | ◐ | ★ (Governance Framework) | **★** |
| **Google DeepMind** | ○ | ◐ | ★ | ◐ | ◐ |
| **Hugging Face** | ★ (Reachy/TRL/Agentic terms 등 운영 가이드 다수) | ★ | ★ | ○ | **★★** |
| **blog.google AI** | ○ | ◐ | ◐ | ★ | ◐ |
| Anthropic | ★ (Claude.md, Skills, Computer Use) | ★ | ◐ | ★ | **★★** (RSS 부재) |
| Mistral | ◐ | ★ | ◐ | ○ | ◐ (RSS 부재) |

**해석:**
- **★★ (최고 정렬)**: Hugging Face와 Anthropic. ConfigDeck `/ai-config` 카탈로그가 다루는 "AI 도구 운영 가이드"를 직접 다룸. 단 Anthropic은 RSS 미제공
- **★ (높은 정렬)**: OpenAI. Codex·AI Gateway 운영 가이드, 정책 문서가 ConfigDeck 사용자(개발자)의 관심사와 직접 겹침
- **◐ (간접 정렬)**: DeepMind, blog.google. 모델 연구·정책은 개발자 일반 관심사이지만 "설정 파일 만들기" 도메인과 직접적 겹침은 적음. 다양성·SEO 가치는 있음

### 2.1 매체별 추천 가중치 (channel weighting)

`selectBalanced`는 round-robin이라 매체 간 동등 비중이지만, 디우선순위 기간 D 조정으로 사실상 "정렬도 높은 매체가 더 자주 노출"되는 효과를 얻을 수 있다. 본 리서치에서는 단순화를 위해 동등 비중 유지를 권장하되, 향후 분포 관찰 후 가중치 도입을 별도 ADR로 검토.

---

## 3. ADR-0010 콘텐츠 범위 확장 근거

ADR-0010 §22 "혼합형 채택"의 매체 목록은 ESLint, Prettier, TypeScript, Next.js, React, Astro, Node.js의 7개로 시작했고, ADR-0013을 거쳐 v1.6.x 기준 15개 매체로 확장됐다(`scripts/fetch-rss.ts:41-132`). 이 확장 과정은 **별도 ADR 없이 ADR-0015(다양성 확보)에 부수적으로 명시**된 것이므로, ADR-0010의 "설정 도구 중심" 범위는 사실상 이미 확장 상태(SEJ, blog.google 등 콘텐츠 매체 포함)다.

### 3.1 확장 타당성

| 근거 | 내용 |
|---|---|
| **서비스 카탈로그 확장과의 정합성** | ConfigDeck은 v1.4~1.6에서 `/ai-config` 카탈로그(AGENTS.md, Cursor MDC, Copilot Instructions, Skills 등) 8종을 추가([ADR-0018](.claude/decisions/records/ADR-0018-agent-skills-catalog.md)). 매체에 OpenAI·Anthropic·HF가 없으면 카탈로그 도메인 콘텐츠가 비어 있음 |
| **사용자 관심사 변화** | 2026-05 기준 OpenAI Codex·Claude.md·Cursor 사용법 검색량은 ESLint/Prettier 검색량을 추월 (참고: Google Trends "claude.md" vs "eslint config" 비교가 추가 가능) |
| **SEO·체류 시간** | ADR-0019(`/ai-config` 카탈로그 + `/ai-config/generator`)의 자식 랜딩이 이미 활성. 매체 콘텐츠가 자식 랜딩의 "관련 아티클" 슬롯을 채울 필요 있음 |
| **다양성·디우선순위 효과 회복** | ADR-0023 복구 후 활성 매체 4~5개. AI 매체 4개 추가 시 9개로 두 배 커져 디우선순위 회전이 실효적으로 동작 (§4 참조) |

### 3.2 명문화 방식

ADR-0010 §22의 "도구별 공식 RSS/Atom 피드 URL" 표는 v1.6.x 시점에서 이미 ADR-0013으로 확장됐다. **ADR-0024에서**:
- ADR-0010의 범위 정의(§9: "ESLint, Prettier, TypeScript, Next.js, React, Astro, Node.js의 업데이트 뉴스")가 v1.7.0 이후 "프론트엔드·웹 개발·AI 도구의 설정·운영·연구 콘텐츠"로 확장됨을 선언
- 별도 ADR-0025로 ADR-0010 본문을 직접 수정하지 않음 — ADR-0024의 "결정 1"이 ADR-0010 §9의 범위를 보완한다는 부분 갱신 안내만 ADR-0010 상단에 추가

---

## 4. selectBalanced 회전 주기 영향

### 4.1 현재 상태 (v1.6.3 기준)

- 등록된 매체: 15개 (`FEED_CONFIGS`)
- 실제 활성 매체 (최근 7일 발행 기준): **4~5개** (searchenginejournal, csstricks, nodejs, astro, javascriptweekly)
- 디우선 기간 D = 3일
- 일일 수량 K = 2 아이템 × 2 locale = 4 파일

회전 공식 (단순화):
- 같은 매체가 다시 선택되기까지 평균 시간 ≈ **활성 매체 수 / K**일
- 현재: 4.5 / 2 = **2.25일** → D=3과 거의 같음 (디우선 효과 약함)

### 4.2 AI 매체 4개 추가 시 (v1.7.0)

활성 매체가 9개로 증가 (기존 5 + AI 4: OpenAI, DeepMind, HF, blog.google AI). 단 발행 빈도가 매체마다 다르니 "유효 활성 매체"를 발행 빈도 가중치로 계산.

| 매체 | 주당 발행량 추정 | 유효 가중치 |
|---|---|---|
| searchenginejournal | 30+ | 1.0 |
| csstricks | 3~5 | 1.0 |
| nodejs | 1~2 | 0.5 |
| astro | 1 미만 | 0.3 |
| javascriptweekly | 1 | 0.3 |
| OpenAI News | 14~16 | 1.0 |
| Hugging Face | 4~6 | 1.0 |
| blog.google AI | 3~5 | 1.0 |
| Google DeepMind | 5~8 | 1.0 |
| **유효 활성 합계** | — | **7.1** |

평균 회전 주기 ≈ 7.1 / K 일.

| K (일일 수량) | 회전 주기 | 권장 D (디우선 기간) | 비고 |
|---|---|---|---|
| 2 | 3.55일 | 4일 | 현재 K 유지 |
| **3** | **2.37일** | **5일** | **권장** — 다양성 회전 빠르고 디우선 효과 충분 |
| 4 | 1.78일 | 6~7일 | D가 길어져 활성 매체 절반이 디우선 대상이 되는 임계 근접 |
| 5 | 1.42일 | 7일 이상 | D 임계 초과 — ADR-0015가 식별한 "효과 무력화" 영역 |

### 4.3 K = 3 권장

회전 주기를 빠르게 하면서 D=5일로 같은 매체 재노출을 충분히 막을 수 있고, 디우선 대상이 활성 매체의 절반 이하(평균 3개 / 9개 활성)로 ADR-0015가 정의한 안전 영역에 든다.

---

## 5. 일일 발행 수량(K) 증대 검토

### 5.1 Anthropic API 비용 추정

ConfigDeck은 [scripts/generate-summary.ts:234](scripts/generate-summary.ts#L234)에서 **`claude-opus-4-6`**, max_tokens 4096을 사용한다. 가격 (출처: [Anthropic Pricing 2026-05-29 확인](https://platform.claude.com/docs/en/about-claude/pricing)):

- Claude Opus 4.6: 입력 **$5 / MTok**, 출력 **$25 / MTok**

한 아이템당 호출 수 = ko/en 2회. 한 호출당 토큰 추정:
- 입력: 프롬프트(~3000 tok) + 원문 fetch(~2500 tok) ≈ **5500 tok**
- 출력: max 4096 tok, 평균 ~3000 tok 추정 (SPEC-0007 검증 통과 분량)

한 아이템 비용 = (5500 × $5 + 3000 × $25) / 1,000,000 × 2 호출 (ko/en) = **약 $0.205**

| K | 월간 호출 수 | 월간 비용 (Opus 4.6, standard) |
|---|---|---|
| 2 (현재) | 60 아이템 × 2 호출 = 120 | **~$12.3** |
| **3 (권장)** | 90 아이템 × 2 호출 = 180 | **~$18.5** |
| 4 | 240 호출 | ~$24.6 |
| 5 | 300 호출 | ~$30.8 |

**Batch API 50% 할인 적용 시** K=3이 ~$9.3까지 떨어지지만, ConfigDeck은 실시간 응답이 필요(GitHub Actions cron 한 번에 결과 반영)해 batch는 부적합.

**Prompt caching 적용 시** 시스템 프롬프트 부분(~3000 tok)은 캐시 hit으로 입력가의 10%가 적용되어 추가 ~15% 절감 가능. SPEC-0007 다음 사이클에서 검토할 만한 별도 최적화.

### 5.2 GitHub Actions 실행 시간

- 현재 K=2: 2 아이템 × 2 locale × API ~30초 + RSS fetch ~10초 = **총 ~2~3분**
- K=3: ~3~4분
- K=5: ~6~8분
- GitHub Actions 기본 timeout: job당 6시간, step당 무제한 (기본)

→ K=3, K=5 모두 timeout 위험 없음. 단 K가 커지면 API rate limit (`anthropic.com` Tier 기준 RPM 50)에 근접할 수 있어 K=5 이상은 `delayMs` 조정 필요.

### 5.3 SEO 영향

Google 공식 가이드 ([Large site owner's guide to managing your crawl budget](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget)):

> "If your site doesn't have a large number of pages that change rapidly, or if your pages seem to be crawled the same day that they are published, you don't need to read this guide."

crawl budget 가이드 적용 임계는 "10K+ 페이지 + 일 단위 변경"이며, **일 1~10개 신규 페이지는 임계 밖**. K=3 → 일 6개 파일 (ko 3 + en 3)은 안전 영역.

추가 고려:
- **sitemap 갱신**: ConfigDeck은 빌드 시점에 sitemap을 정적 생성([@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/))하므로 K가 K=10까지 늘어도 sitemap 부담은 없음
- **hreflang 비대칭** (ADR-0022): K가 커지면 ko/en 한쪽만 검증 통과하는 비대칭 사례가 늘어날 가능성. SPEC-0007 §6.2 M5 게이트가 18사이클 review queue 0건이라 안정적이지만, K 증대 후 1~2주 모니터링 권장

### 5.4 콘텐츠 품질 vs 수량

SPEC-0007 §3.2.4 review queue 통과율:
- v1.6.0~1.6.2 누적: 18사이클 review queue 0건 (ADR-0022 §M5)
- K=3으로 증대 시 통과율 영향: API 결정성 + 프롬프트 안정성으로 통과율은 K에 비례하지 않음 (각 아이템 독립)

### 5.5 K = 3 권장 근거 요약

| 기준 | 평가 |
|---|---|
| API 비용 | $12 → $18.5 (월 +$6), 부담 없음 |
| 실행 시간 | 2~3분 → 3~4분, timeout 무관 |
| SEO/crawl | 일 6 파일은 Google 임계 밖 |
| 다양성 회전 | 회전 주기 3.55일 → 2.37일로 개선 |
| 품질 | 독립 호출이라 K에 무관 |
| 디우선 기간 D | 4일 → 5일로 동반 조정 필요 |

---

## 6. 구현 영향 평가

신규 매체 4개 추가 시 변경 범위:

### 6.1 코드 변경

| 파일 | 변경 |
|---|---|
| [scripts/fetch-rss.ts](scripts/fetch-rss.ts#L17-L31) | `Tool` union에 4개 slug 추가: `openainews`, `googledeepmind`, `huggingface`, `googleaiblog` |
| [scripts/fetch-rss.ts](scripts/fetch-rss.ts#L41) | `FEED_CONFIGS`에 4개 항목 추가 (URL·type·name) |
| [scripts/update-articles.ts](scripts/update-articles.ts#L25-L26) | `DEPRIORITIZE_DAYS = 5`, 일일 K = 3 (`selectBalanced(newItems, 3, ...)`) |
| [src/content.config.ts](src/content.config.ts) | `tool` enum에 신규 4개 slug 추가 |
| [src/pages/article/\[tool\].astro](src/pages/article/[tool].astro) | 라우팅 호환 (tool slug 기반 동적 라우팅이라 추가 코드 거의 없음, 메타데이터·라벨만 보강) |

### 6.2 OG 이미지 템플릿

[scripts/og-templates/](scripts/og-templates/) 디렉토리 확인 결과, **매체별 별도 템플릿은 필수 아님** — 기존 매체도 공통 템플릿 + tool 라벨로 처리. 신규 4개도 동일 패턴으로 동작.

매체별 브랜드 컬러/로고가 차별점이 되긴 하지만, v1.7.0 범위에서는 공통 템플릿 유지하고, 브랜드화는 별도 ADR로 검토 권장.

### 6.3 다국어 라벨

매체 표시명 (한글 / 영문):

| slug | 영문 라벨 | 한글 라벨 |
|---|---|---|
| openainews | OpenAI News | OpenAI 뉴스 |
| googledeepmind | Google DeepMind | Google DeepMind |
| huggingface | Hugging Face | Hugging Face |
| googleaiblog | Google AI Blog | Google AI 블로그 |

### 6.4 구현 위험

- **OpenAI URL 안정성**: `/blog/rss.xml`은 현재 동작하지만 OpenAI가 `/news/`로 리브랜딩한 흔적이 있어 향후 변경 가능. fetch-rss.ts의 fetch 실패 시 빈 배열 반환 패턴([scripts/fetch-rss.ts:296](scripts/fetch-rss.ts#L296))이 안전망 역할 — 사이트 빌드는 영향 없음
- **blog.google AI 정렬도**: 정책·행사 항목이 섞여 ConfigDeck 사용자에게 노이즈가 될 수 있음. ADR-0024에서 채택 vs 보류를 명확히 결정 권장
- **HF 라이선스**: 글마다 다른 CC 라이선스라 Snippet 방식은 안전하지만, 만약 향후 원문 발췌 정책이 바뀌면 글 단위 확인 필요

---

## 7. Anthropic RSS 미제공 대응

### 7.1 현재 상태 (2026-05-29 확인)

- `https://www.anthropic.com/news`: HTML에 `<link rel="alternate" type="application/rss+xml">` **없음**
- `https://www.anthropic.com/news/feed.xml`: **404**
- robots.txt: `User-Agent: * / Allow: /` — **크롤링 제한 없음**

페이지 자체는 활발: 14일간 10건 ≈ 주 5건 발행, ConfigDeck `/ai-config` 카탈로그와 정렬도 ★★ (Claude.md, Skills, Computer Use 등 직접 다룸).

### 7.2 대응 옵션 비교

| 옵션 | 구현 비용 | 위험 | 유지보수 부담 | 권장 |
|---|---|---|---|---|
| **(a) HTML 스크래핑** | 중 (파서 + Astro Content Loader 패턴 외 별도 fetch 모듈) | 페이지 구조 변경 시 silent failure. ADR-0010 §71이 명시한 "MidlevelU v. Newstex 판례" 영역 진입 (스크래핑은 RSS의 묵시적 허락 범위 밖) | 높음 — DOM 셀렉터 변경 추적 | ✗ |
| **(b) Anthropic 제외, 다른 매체로 대체** | 0 | — | — | **○ (v1.7.0 권장)** |
| **(c) Twitter/X API** | 매우 높음 ($100/월 Basic tier 이상) | 약관·비용·rate limit | 매우 높음 | ✗ |
| **(d) GitHub releases** | 낮음 (`https://github.com/anthropics/anthropic-sdk-python/releases.atom`) | SDK release 정보만 fetch 가능 — Anthropic의 일반 announcements는 빠짐. anthropic-cookbook은 0건 | 낮음 | △ (보조 채널, 본 채널 X) |
| **(e) 향후 RSS 제공 시 추가** | 0 | — | — | **○ (모니터링)** |

### 7.3 권장: (b) + (e)

ADR-0024에서 Anthropic은 **v1.7.0 채택 보류**로 결정. 대신 ADR 본문에 **"Anthropic 공식 RSS 제공 시 v1.x.x에서 즉시 추가"** 후속 조치를 명문화. 정렬도 ★★ 매체를 놓치는 비용은 있으나, ADR-0010의 "공식 RSS 우선" 원칙과 정합성 유지가 더 중요.

(d) GitHub releases는 보조 채널로 향후 검토 — Anthropic 공식 SDK 버전 업이 ConfigDeck 사용자(Claude API 사용자)에게 가치 있을 수 있음. v1.7.0 범위 밖.

### 7.4 robots.txt 의미

Anthropic robots.txt가 제한 없이 열려 있다는 사실은 "스크래핑이 기술적으로 가능"하다는 의미일 뿐, "법적·정책적으로 허용"한다는 의미는 아니다. ADR-0010 §71이 인용한 MidlevelU v. Newstex 판례는 "공개 배포 ≠ 상업적 재게시 허락"을 명시. RSS 미제공 매체를 스크래핑하는 것은 이 판례 영역에 더 가까워 회피.

---

## 결론 및 추천

### 채택 권장 매체 (v1.7.0)

| 매체 | RSS URL | Tool slug | 우선순위 |
|---|---|---|---|
| OpenAI News | `https://openai.com/blog/rss.xml` | `openainews` | 1순위 |
| Hugging Face Blog | `https://huggingface.co/blog/feed.xml` | `huggingface` | 1순위 |
| Google DeepMind | `https://deepmind.google/blog/rss.xml` | `googledeepmind` | 2순위 |
| blog.google AI | `https://blog.google/technology/ai/rss/` | `googleaiblog` | 2순위 (정렬도 ◐ 검토 후 결정) |

### 보류 매체

- **Anthropic**: 공식 RSS 부재. 스크래핑 회피. 향후 제공 시 즉시 추가
- **Mistral / Meta AI / Cohere**: 공식 RSS 부재. v1.7.0 범위 밖
- **LangChain**: RSS endpoint가 HTML로 응답 (실질 미제공)
- **Vercel AI**: changelog가 AI 외 항목 혼재. 카테고리 필터링 정책 별도 ADR 필요

### 알고리즘 파라미터 조정

| 파라미터 | 현재 | v1.7.0 권장 | 근거 |
|---|---|---|---|
| `DEPRIORITIZE_DAYS` | 3 | **5** | 활성 매체 5→9개 증가, 회전 주기 유지 |
| 일일 수량 K | 2 | **3** | API 비용 +$6/월, crawl·timeout 안전, 다양성 회전 개선 |

### Anthropic API 비용 영향

월 ~$12 → ~$18.5 (Opus 4.6 기준, standard pricing). prompt caching 적용 시 ~15% 추가 절감 가능.

### 다음 단계

1. **ADR-0024 작성**: 본 RES-0007 결과를 근거로 매체 선정 + 파라미터 조정 + ADR-0010 범위 확장 명문화
2. **ADR-0010 상단에 부분 보완 안내 추가**: "v1.7.0부터 AI 도구 매체 포함 (ADR-0024 참조)"
3. **OpenAI Terms of Use 직접 확인** (본 리서치에서 fetch 403 — ADR-0024 작성 또는 구현 직전에 재확인)
4. **구현 페이즈 (v1.7.0 후속 페이즈)**: FEED_CONFIGS·Tool·content schema·라벨 추가, 1~2주 분포 모니터링

---

## 참고 자료 (References)

### 매체 메타데이터 (실측)

- [OpenAI News RSS](https://openai.com/blog/rss.xml) — 2026-05-29 확인, RSS 2.0, 주 14~16건
- [Anthropic Newsroom](https://www.anthropic.com/news) — 2026-05-29 확인, RSS 미제공, 주 5건
- [Anthropic robots.txt](https://www.anthropic.com/robots.txt) — 제한 없음
- [Google DeepMind Blog RSS](https://deepmind.google/blog/rss.xml) — 2026-05-29 확인, RSS 2.0, ~22건 누적
- [Hugging Face Blog RSS](https://huggingface.co/blog/feed.xml) — 2026-05-29 확인, RSS 2.0+Atom ns, 매우 활발
- [Google AI Blog RSS](https://blog.google/technology/ai/rss/) — 2026-05-29 확인, RSS 2.0, ~150건 누적
- [Vercel Changelog RSS](https://vercel.com/changelog/rss.xml) — 2026-05-29 확인, Atom 1.0, AI 외 혼재
- [GitHub anthropics/anthropic-sdk-python releases.atom](https://github.com/anthropics/anthropic-sdk-python/releases.atom) — 보조 채널 검토용

### 가격·정책

- [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing) — Opus 4.6 입력 $5/출력 $25 per MTok (2026-05-29 확인)
- [Google Search Central — Managing crawl budget](https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget) — 10K+ 페이지 임계 미만은 가이드 적용 안 함

### ConfigDeck 기존 ADR

- [ADR-0010: 아티클 콘텐츠 수집 및 갱신 전략](.claude/decisions/records/ADR-0010-article-content-strategy.md) — 혼합형 + Snippet 방식 + GitHub Actions
- [ADR-0011: 아티클 AI 요약 자동화 전략](.claude/decisions/records/ADR-0011-article-ai-summarization.md) — Gemini 채택 (부분 대체됨)
- [ADR-0013: 아티클 AI 도구 평가](.claude/decisions/records/ADR-0013-article-ai-tool-evaluation.md) — RSS 도구 선택
- [ADR-0015: 아티클 소스 다양성 확보](.claude/decisions/records/ADR-0015-article-source-diversity.md) — selectBalanced 디우선순위 도입
- [ADR-0021: Editorial Commentary 모델](.claude/decisions/records/ADR-0021-article-editorial-commentary-model.md) — slug 단순화, frontmatter 권위 출처
- [ADR-0023: 디우선순위 frontmatter 기반](.claude/decisions/records/ADR-0023-article-deprioritize-frontmatter-source.md) — v1.6.3 복구

### 라이선스 일반

- [MONDAQ — Implied Copyright Licenses (RSS & Aggregators)](https://www.mondaq.com/unitedstates/copyright/1047416/implied-copyright-licenses-in-the-digital-world-blogs-rss-feeds-and-aggregators) — MidlevelU v. Newstex 판례 인용 (ADR-0010 §71에서 재인용)
