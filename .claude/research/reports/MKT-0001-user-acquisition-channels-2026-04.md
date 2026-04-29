# MKT-0001: ConfigDeck 사용자 유입 채널 전략 (2026-04)

- 작성일: 2026-04-29
- 작성자: research 스킬
- 참조 보고서: STR-0002, MI-0002, BA-0002, ADR-0014
- 제약: 글로벌 우선(한국 보조), 장기 SEO 베이스 우선, **무료 채널만**, 1인 운영(주 5~10시간)

---

## 1. TL;DR — 즉시 실행 가능한 액션 5개

ConfigDeck의 트래픽 자산은 **유료 광고가 아니라 (a) 검색 유입 자산화 + (b) 이미 가진 기능의 마케팅 활용**으로 만들어야 한다. 다음 5가지를 우선 실행할 것을 권장한다.

1. **각 생성기/마이그레이션 페이지를 "설명형 랜딩"으로 보강** — 단순 폼 페이지가 아니라 ESLint v9 변경점·옵션 의미·예시 결과까지 한 페이지에 담아 evergreen 콘텐츠화 (3장 §3.3, 5장)
2. **Google Search Console + Bing Webmaster Tools 즉시 등록** — 색인 상태와 실제 검색어를 무료로 추적하는 유일한 방법 ([Search Console](https://search.google.com/search-console/about))
3. **Shareable URL에 동적 OG 이미지 자동 생성 추가** — Cloudflare Pages는 `@vercel/og` 플러그인을 공식 지원하며 무료. 트위터/Slack/디스코드에서 URL이 미리보기로 노출되는 순간 바이럴 트리거가 된다 ([Cloudflare vercel/og 플러그인](https://developers.cloudflare.com/pages/functions/plugins/vercel-og/))
4. **GitHub README 배지 + "Audit my config" 인박운드 위젯** — shields.io는 월 16억 이미지 서빙. 사용자가 자기 README/블로그에 ConfigDeck 배지를 붙이면 영구 광고가 된다 ([shields.io](https://shields.io/))
5. **Show HN은 P0.5 끝나고 한 번만, 정공법으로** — Import & Audit + Shareable URL이 둘 다 출시된 시점에서 Show HN 1회가 최대 모멘텀. 그 전엔 글 단위(dev.to/Hashnode)로 콘텐츠 자산 누적 (4장 §4.1)

핵심 통찰: 1인 운영에 **단발성 런칭 이벤트는 비싸다**. 콘텐츠와 기능 자체에 SEO/공유 자산을 영구 박아두는 쪽이 ROI가 훨씬 높다.

---

## 2. 기존 분석 인용 (전제)

본 보고서는 다음 결론을 **이미 검증된 전제로** 받는다. 재논의하지 않는다.

| 출처 | 결론 | 본 보고서 활용 |
| --- | --- | --- |
| MI-0002 | 스택 기반 복수 파일 조합 생성기 직접 경쟁자 부재 | 차별화 메시지로 모든 콘텐츠에 박는다 |
| BA-0002 | Shareable URL · Import & Audit이 핵심 차별화 레버 | 두 기능을 마케팅 자산화하는 데 집중 |
| STR-0002 | A+B 복합(SEO 선점 + AI 도구 설정 선점) 채택, 한/일 다국어 차별화 | 글로벌 SEO 우선 + 일본어는 P1~P2 잔존 |
| ADR-0014 | "설정 파일 생성기 → 설정 관리 허브"로 정체성 전환 | 모든 마케팅 메시지의 일관 프레임 |
| STR-0002 KPI | 90일 목표: 유기검색 3,000/월, 색인 100p, 키워드 10위 이내 | 본 보고서의 채널 우선순위 산정 기준 |

> 본 보고서는 위 전략 위에서 **"어느 채널에 어떻게 올릴까"**의 실행 단을 다룬다. 시장/포지셔닝 재논의가 필요하면 STR-0002 갱신을 별도 트리거.

---

## 3. 글로벌 SEO 키워드 전략 (장기 베이스)

### 3.1 검색량 도구 — 무료 옵션 우선순위

유료 SEO 도구(Ahrefs, Semrush) 없이 1인 운영자가 활용할 수 있는 무료 자산.

| 도구 | 무료 범위 | ConfigDeck 활용 포인트 |
| --- | --- | --- |
| **Google Search Console** | 무제한 | 실제 검색어/노출/클릭 데이터. 색인 상태·Core Web Vitals 모니터링 ([공식](https://search.google.com/search-console/about)) |
| **Bing Webmaster Tools** | 무제한 | Bing/덕덕고 색인 + 자체 키워드 도구 제공 (Google보다 노골적인 키워드 데이터 제공) |
| **Google Trends** | 무제한 | 키워드 상대 트렌드. "eslint flat config"의 전환 곡선 모니터링 ([trends.google.com](https://trends.google.com/)) |
| **Google Keyword Planner** | 무료(애즈 계정 필요, 광고 집행 불요) | 키워드 검색량 범위 확인 ([Keyword Planner](https://ads.google.com/home/tools/keyword-planner/)) |
| **People Also Ask / 자동완성** | 무제한 | 롱테일 키워드 발굴. 검색창에 "eslint flat config "를 치고 자동완성을 수집 |

> **무료로 충분한가?** 1인 운영, 정성적 의사결정 단계에서는 충분하다. 트래픽이 월 10K를 넘는 시점에서 Ahrefs Lite 같은 유료 도구를 검토하면 된다 (현 단계 불필요).

### 3.2 후보 키워드 매트릭스

ConfigDeck의 콘텐츠/페이지가 노릴 영문 키워드 그룹. 검색량 절대치 대신 **경쟁도 추정 + 검색의도 적합성**을 우선한다.

| 키워드 그룹 | 예시 | 경쟁도 | 검색의도 적합도 | ConfigDeck 매핑 |
| --- | --- | --- | --- | --- |
| **마이그레이션 (★최우선)** | "eslint flat config migration", "migrate eslintrc to eslint.config.js", "eslintrc to flat config converter" | 중 | 매우 높음 | `/migration/eslint` 페이지 |
| **감사/진단** | "tsconfig audit", "eslint config audit", "is my eslint config correct" | 낮음 | 높음 | `/migration/{tool}` Audit 모드 (SPEC-0004 Phase B/C) |
| **생성기** | "tsconfig generator", "prettier config generator", "eslint config generator" | 높음(기존 도구 다수) | 높음 | `/generator/{file}` (직접 경쟁) |
| **스택 조합** | "react typescript eslint setup", "next.js prettier eslint config", "vite + tailwind starter config" | 중 | 매우 높음 | 스택 프리셋 페이지 (S1 활용) |
| **AI 도구 설정** | ".cursorrules examples", "claude code settings", "copilot-instructions.md generator" | 낮음(블루오션) | 높음 | P1 신설 (STR-0002 옵션 B) |
| **롱테일 Q&A** | "what's the difference between eslintrc and eslint.config.js", "do I need prettier with eslint" | 낮음 | 중 | 아티클/블로그 형 |

### 3.3 Astro + Cloudflare Pages SEO 극대화 전술 (무료, 빌드 타임 처리)

Astro는 SSG로 정적 HTML을 빌드하므로 SEO에 본질적으로 유리하지만, **기본값이 부족한 영역**이 있다. 다음을 점검·보강한다.

| 항목 | 권장 사항 | 근거 |
| --- | --- | --- |
| 사이트맵 | `@astrojs/sitemap` 통합. **lastmod 명시**(기본 미포함) | [Astro Sitemap docs](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — 기본 sitemap은 lastmod 누락 |
| 구조화 데이터 | JSON-LD를 head에 인젝션. `Article`/`HowTo`/`SoftwareApplication`/`FAQPage` 활용. ESLint 마이그레이션 페이지는 `HowTo`로 마크업 | [Google Search Central — Structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) |
| 다국어 | `hreflang` 태그(이미 P0 완료). `x-default` 설정 검증 필요 | [Google hreflang guide](https://developers.google.com/search/docs/specialty/international/localized-versions) |
| 정적 OG 이미지 | 페이지별 다른 OG 이미지(현 미구현). 동적 생성은 §6.1 참조 | [@vercel/og on Cloudflare Pages](https://developers.cloudflare.com/pages/functions/plugins/vercel-og/) |
| Core Web Vitals | Astro의 zero-JS 기본값으로 LCP/INP는 자연 우수. **Svelte 아일랜드 hydration 비용**만 모니터 | [web.dev/vitals](https://web.dev/articles/vitals) |
| 내부 링크 | 아티클 ↔ 생성기 ↔ 마이그레이션 페이지 상호 링크 (현 약함 추정) | [Google: link best practices](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) |
| 캐노니컬 | 다국어 페이지마다 self-canonical, dev.to 등 크로스포스팅 시 본문에 canonical → 원본 사이트 | [Search Engine Land — Canonicalization 2026](https://searchengineland.com/canonicalization-seo-448161) |

> **Why 빌드타임 SEO 우선:** 정적 사이트는 한 번 잘 만들어두면 운영 비용이 0이다. JS로 후처리하는 SEO 전술은 1인 운영자가 디버깅하기 어렵고 Cloudflare Pages 무료 한도(빌드 시간 등)를 잘못 쓰면 깨진다.

### 3.4 프로그래매틱 SEO — ConfigDeck의 기회

[프로그래매틱 SEO](https://searchengineland.com/guide/programmatic-seo)는 **템플릿 기반으로 롱테일 키워드 페이지를 대량 생성**하는 전술이다. ConfigDeck은 이미 정적 사이트 + 풍부한 옵션 데이터셋을 가진다. 다음 패턴을 권장한다.

| 패턴 | URL 예시 | 페이지 수 | 노리는 키워드 |
| --- | --- | --- | --- |
| 스택 조합 페이지 | `/setup/react-typescript-eslint-prettier` | 수십~수백 | "react typescript eslint setup" 류 |
| 옵션별 설명 페이지 | `/eslint/rule/no-unused-vars` | 수백 (ESLint 규칙 수만큼) | "eslint no-unused-vars 사용법" 류 |
| 비교 페이지 | `/compare/eslint-vs-biome` | 십수개 | "eslint vs biome" 류 |
| 마이그레이션 가이드 | `/migrate/from/eslintrc/to/flat-config` | 도구별 | 매우 명확한 검색의도 |

> **Why:** 기존 페이지(현 ~30개 추정)는 SEO 자산이 0에서 시작한다. 프로그래매틱 SEO로 100~500p로 빠르게 늘리면 검색엔진의 색인 신호가 확보된다. 단, **각 페이지에 자체 가치(예시·설명·내부링크)가 있어야** 도리어 thin-content 페널티를 피한다.

---

## 4. 글로벌 커뮤니티 채널 매트릭스

### 4.1 채널별 정책/적합도/실행 가이드

| 채널 | 자기홍보 정책 | ConfigDeck 적합도 | 실행 가이드 | 발행 빈도 한도 |
| --- | --- | --- | --- | --- |
| **Hacker News (Show HN)** | "주된 용도가 홍보면 안 되지만 자기 작업 일부 게시는 OK". 회원가입 무필요 데모, 백스토리 댓글, 마케팅 언어 금지 ([Show HN Guidelines](https://news.ycombinator.com/showhn.html), [HN Guidelines](https://news.ycombinator.com/newsguidelines.html)) | ★★★★★ — 단, **단 1회 제대로** | Import & Audit + Shareable URL 둘 다 출시 후. 평일 오전(US 동부) 발행. "Show HN: ConfigDeck — generate, migrate, and audit dev configs (Astro + Svelte 5)" | 6개월~1년에 1회. 주요 마일스톤마다 |
| **Reddit /r/webdev** | 1주에 자기 콘텐츠는 10% 미만 권장(reddiquette). 모더레이터 정책 별도 ([reddiquette](https://support.reddithelp.com/hc/en-us/articles/205926439)) | ★★★★ | 코멘트 카르마부터 쌓기. "I built X" 톤 금지, "어떤 문제를 풀었나" 톤 권장. 영어권 시간대 발행 | 분기 1회 이하 |
| **Reddit /r/javascript** | 모더레이션 보수적. Show & Tell 스레드 활용 권장 | ★★★★ | 모더레이터 정책 사전 확인 필수 | 분기 1회 이하 |
| **Reddit /r/typescript** | 비교적 관대 | ★★★ | TSConfig 관련 콘텐츠에 한정 | 분기 1회 |
| **Reddit /r/programming** | 자기홍보 매우 보수적, 잦은 제거 | ★★ | 일반 프로젝트 소개 적합도 낮음. 기술 디프 글이라면 시도 | 6개월 1회 |
| **Lobsters** | 자기홍보 게시는 본인 게시 글의 25% 미만 권장. 컴퓨팅 한정 ([Lobsters About](https://lobste.rs/about)) | ★★★ | 초대 기반 가입 필요. 가입 후 댓글로 신뢰 쌓고 게시 | 분기 1회 |
| **dev.to** | 매우 관대. 캐노니컬 URL 지원. ([dev.to canonical 가이드](https://dev.to/leewynne/how-to-cross-post-and-import-your-existing-blog-into-dev-and-retain-seo-original-source-and-ranking-mm8)) | ★★★★★ | 본인 블로그/사이트 글의 캐노니컬 크로스포스팅. 태그 4개(`#javascript #webdev #ai #productivity` 등) | 주 1회까지 가능 |
| **Hashnode** | 관대, 캐노니컬 URL 지원, 자체 도메인 무료 | ★★★★ | dev.to와 비슷. 양쪽 동시 운영 시 캐노니컬은 한 곳으로 | 주 1회까지 |
| **daily.dev (Squad)** | Squad 정책 별도. 본인 squad 운영 가능 | ★★★ | RSS 등록형 + Squad 직접 발행. Squad 단독 운영보다 본인 블로그/dev.to RSS 등록이 ROI 큼 | 자동(RSS) |
| **Indie Hackers** | 비교적 관대, 단 가치 우선 ([커뮤니티 안내](https://www.indiehackers.com/)) | ★★★ | 1인 개발자 + AI 협업 스토리 톤이 잘 먹음. ConfigDeck 자체보다 "어떻게 만들었나" 글이 적합 | 분기 1회 |
| **GitHub Trending** | 알고리즘 비공개. 1일 내 별 증가 속도가 핵심 ([GitHub Discussion 163970](https://github.com/orgs/community/discussions/163970)) | ★★★ — 결과지표적 | Trending은 *결과*. HN/Reddit/dev.to 트래픽이 일시적으로 별을 끌어올리면 자동 진입 | - |

### 4.2 발행 우선순위 (글로벌)

다음 순서로 콘텐츠 자산을 쌓을 것을 권장.

```
1순위: dev.to + Hashnode (캐노니컬 본인 사이트, 매주 1편)
        └─ 태그: #javascript #webdev #ai #productivity #opensource
        └─ 자체 RSS는 daily.dev에 자동 등록되어 부수 도달

2순위: Reddit (월 1회, 가치 글에 집중)
        └─ /r/javascript, /r/webdev 우선
        └─ "I built" 톤 금지, "X 문제 풀이" 톤

3순위: Show HN (P0.5 완성 시점에 1회)
        └─ Import & Audit + Shareable URL 모두 출시 후

4순위: Lobsters / Indie Hackers (분기 1회)
        └─ 콘텐츠 결이 맞을 때만
```

> **Why:** 단발성 런칭(Show HN)은 트래픽 스파이크는 주지만 SEO 자산은 누적되지 않는다. dev.to/Hashnode 글은 캐노니컬을 본인 사이트로 걸면 본인 사이트 SEO에 기여한다.

### 4.3 GitHub Trending 진입 — 결과 지표적 접근

GitHub Trending은 알고리즘이 비공개이지만, [GitHub 커뮤니티 토론](https://github.com/orgs/community/discussions/163970)과 외부 분석을 종합하면 다음 패턴이 관찰된다.

- **하루 별 증가 속도(velocity)**가 절대 별 수보다 중요
- 작은 레포일수록 적은 별로도 trending 진입 가능 (백 단위에서도 가능)
- **외부 트래픽 유입(HN/Reddit) → GitHub로 이어지는 흐름**이 가장 신뢰성 있게 trending 진입을 만든다

ConfigDeck은 **GitHub 별 자체가 목표가 아니라 trending이 만드는 2차 트래픽**(GitHub trending 페이지에서 클릭)을 노린다. 따라서 trending 자체보다 README의 흡인력과 사이트 링크 가시성에 투자.

---

## 5. 콘텐츠 마케팅 — Evergreen 시드 (장기 SEO 자산)

### 5.1 콘텐츠 배치 원칙

ConfigDeck은 이미 `articles/` 페이지(아티클 자동 업데이트)를 운영 중이다(CLAUDE.md 변경 이력). 그러나 **외부 RSS 큐레이션 콘텐츠**는 ConfigDeck 자체 SEO에 거의 기여하지 않는다(원작자가 검색 권위를 가져감). 다음 방식으로 내부 콘텐츠를 별도 운영해야 한다.

| 콘텐츠 유형 | 위치 | SEO 효과 | 운영 부담 |
| --- | --- | --- | --- |
| 외부 아티클 RSS (현재) | `/articles/` | 약함 (큐레이션 인용 가치) | 낮음 (자동) |
| **자체 가이드/해설 (제안)** | `/guides/` 또는 `/blog/` | **강함** | 중간 (월 2~4편) |
| **생성기 페이지의 inline 설명** | `/generator/{file}` 페이지 내부 | **강함** | 1회 작성 |
| 마이그레이션 페이지 가이드 | `/migration/{tool}` 페이지 내부 | **강함** | 1회 작성 |

> **Why "inline 설명":** 생성기 페이지가 단순 폼이면 검색엔진은 thin content로 판단할 수 있다. 옵션 의미·예시·"이런 경우엔 이 옵션" 같은 문장이 페이지에 풍부하면 동일 URL이 검색 키워드를 다수 노린다(예: `/generator/eslint`이 "eslint config generator" + "eslint flat config example" + "what does no-unused-vars do" 동시 노출).

### 5.2 Evergreen 콘텐츠 시드 10선

검색 의도가 **시간이 지나도 변하지 않거나 천천히 노후화**되는 주제. 각 콘텐츠는 ConfigDeck 사이트 내부에 두고 **dev.to/Hashnode에 캐노니컬 크로스포스팅**한다.

| # | 제목 (영문, 검색 친화) | 노리는 검색의도 | ConfigDeck CTA |
| --- | --- | --- | --- |
| 1 | "ESLint Flat Config Migration: Complete Guide for 2026" | 마이그레이션 방법 검색 | `/migration/eslint` 도구로 즉시 자동화 |
| 2 | "TSConfig Strict Mode Explained: What Each Option Actually Does" | TSConfig 옵션 의미 검색 | `/generator/tsconfig` |
| 3 | "Prettier vs ESLint: When to Use Each (and Both)" | 도구 비교 검색 | 스택 프리셋 |
| 4 | "How to Set Up React + TypeScript + Vite + ESLint in 2026" | 스택 설정 가이드 | 해당 스택 프리셋 페이지 |
| 5 | "Husky + lint-staged + commitlint: The Modern Git Hook Stack" | 도구 조합 가이드 | SPEC-0006 (P0.5) |
| 6 | "Biome vs ESLint + Prettier: Which Should You Choose in 2026?" | zero-config 트렌드 검색 | 비교 글 + ConfigDeck 위치 설명 |
| 7 | "I Audited 100 Open Source ESLint Configs — Here's What I Found" | 데이터 기반 인사이트 | Audit 모드 자체 시연 |
| 8 | "Deprecated ESLint Rules: A Complete Reference" | 깊이 있는 레퍼런스 | Audit 모드 |
| 9 | "How `.cursorrules` and `claude.md` Are Reshaping Codebases" | AI 도구 설정 트렌드 (블루오션) | P1 AI 설정 생성기 (STR-0002 옵션 B) |
| 10 | "From `.eslintrc` to `eslint.config.js`: An Interactive Walkthrough" | 시각적 학습 검색 | Migration 페이지 시연 |

### 5.3 사례 학습 — 1인 개발자 도구의 콘텐츠 전술

> 주: Bundlephobia/transform.tools/json2ts/RegExr 등의 직접적인 그로스 케이스 스터디는 공개 자료가 적다([검색 결과 부재 확인](https://www.semrush.com/website/regexr.com/overview/) 등). 대신 *이들이 사용하는 콘텐츠 패턴*을 관찰해 추론한 것을 기록한다.

관찰된 공통 패턴:

1. **각 페이지가 키워드 매핑** — Bundlephobia는 `/package/{name}` URL이 "{lib} bundle size" 검색에 그대로 매핑된다. ConfigDeck도 `/eslint/rule/{name}`, `/setup/{stack}` 같은 URL 패턴 도입 시 동일 효과 (§3.4 프로그래매틱 SEO).
2. **결과 페이지를 공유 가능 URL로** — 사용자가 본인 케이스를 공유하면 그 URL이 SEO/리퍼럴 양쪽에 작용. ConfigDeck은 SPEC-0003 Shareable URL이 이미 구현되어 있어 활용 가능 ([ADR-0014 §1 Shareable URL 격상 근거](../../decisions/records/ADR-0014-growth-strategy-roadmap.md)).
3. **개발자 워크플로 안에서 호출되는 도구화** — RegExr/JSON Editor Online은 검색 결과에서 직접 도구 페이지로 진입한다. ConfigDeck도 "내가 검색한 결과가 곧 내 도구"가 되어야 한다(§5.2의 콘텐츠 시드는 모두 이 원칙).

---

## 6. 비기술 그로스 레버 — 이미 가진 기능을 마케팅 자산화

### 6.1 Shareable URL → 자연 바이럴 (현 기능 활용)

SPEC-0003에서 Shareable URL이 1.2.0에 구현 완료되었다. 그러나 **공유 시 미리보기가 없으면 클릭률이 낮다**. 다음 보강이 핵심.

| 보강 항목 | 무료/유료 | 구현 부담 | 효과 |
| --- | --- | --- | --- |
| **동적 OG 이미지 생성** | 무료 (Cloudflare Pages 공식 지원) | 중간 (1~2일) | 매우 큼 — Twitter/X/Slack/Discord 미리보기 활성화 |
| Twitter Card 메타 | 무료 | 낮음 | OG 이미지와 함께 작동 |
| 단축 URL | 불필요 | - | 정적 사이트는 짧은 path 자체로 충분 |

**구현 방법** ([Cloudflare Pages: vercel/og 플러그인 공식 문서](https://developers.cloudflare.com/pages/functions/plugins/vercel-og/)):

```
1. @cloudflare/pages-plugin-vercel-og 설치
2. functions/og.tsx 에 React 컴포넌트로 OG 이미지 정의
3. 메타 태그에서 OG 이미지 URL을 동적 생성
   예: og:image = /og?stack=react-ts&files=eslint,prettier
4. Cloudflare 엣지에서 자동 캐시 (재생성 없음)
```

ConfigDeck의 OG 이미지에 들어가야 할 정보 (제안):

- 선택된 스택/파일 종류 (예: "React + TypeScript + ESLint + Prettier")
- 옵션 개수 또는 핵심 옵션 강조
- ConfigDeck 로고 + 도메인

> **Why:** Shareable URL은 만들어두기만 하면 바이럴 자산이 되지 않는다. 미리보기에서 "이게 뭔지" 즉시 보여줘야 클릭이 일어난다. 이 작업은 ROI가 매우 크고 1~2일이면 끝난다.

### 6.2 GitHub README — 영구 트래픽 채널

shields.io는 월 16억 이미지를 서빙한다 ([shields.io 공식](https://shields.io/)). 즉, **사용자가 자기 README에 ConfigDeck 배지를 붙이면 영구 광고**가 된다. 다음을 단계별로 도입.

| 단계 | 항목 | 구현 부담 | 효과 |
| --- | --- | --- | --- |
| 1 | **"Powered by ConfigDeck" 배지** — 마이그레이션 결과 다운로드 시 README에 붙일 마크다운 스니펫 자동 제공 | 낮음 | 누적적, 영구 |
| 2 | **본인 README 모범 사례** — ConfigDeck 본인 GitHub README를 도구 데모 + 배지 + 사이트 링크로 재구성 | 낮음 | GitHub trending/검색 진입 시 첫 인상 |
| 3 | **Astro + Svelte 5 starter 레포** — `npx degit jsg3121/configdeck-starter` 형태. README에 ConfigDeck 사이트 링크 박힘 | 중간 | starter 레포 자체가 별을 모음 |

**배지 스니펫 예시** (사용자 README에 자동 제공):

```markdown
[![Generated with ConfigDeck](https://img.shields.io/badge/configs-generated_with_ConfigDeck-blue)](https://configdeck.dev)
[![ESLint Flat Config](https://img.shields.io/badge/ESLint-flat_config-4B32C3?logo=eslint)](https://configdeck.dev/migration/eslint)
```

> **Why:** 사용자가 "이 설정 어디서 나왔지?" 질문을 받았을 때 README 한 줄로 답이 되면 그 자체가 마케팅이다. shields.io 인프라는 우리가 호스팅 부담 없이 이용 가능.

### 6.3 임베드/위젯 — 후순위지만 잠재력 큼

블로그/문서 사이트에 "이 ESLint 규칙 설명" 같은 인라인 위젯을 임베드하게 하는 패턴. **단, 클라이언트 완결형 정적 사이트의 정체성과 충돌할 수 있어 P2로 둔다**(MVP 외).

---

## 7. 한국 시장 보조 전략

글로벌 우선이지만 한국 채널은 **번역 이중화 부담이 적은 무료 채널**에 한정해 운영한다.

| 채널 | 적합도 | 메모 |
| --- | --- | --- |
| **GeekNews (news.hada.io)** | ★★★★ | **이미 게시 완료**(사용자 확인). 후속은 주요 기능 출시 시점에만 (Import & Audit 풀 출시, AI 도구 설정 추가 등). 동일 프로젝트 반복 게시는 자제 |
| **velog/티스토리/브런치** | ★★★ | dev.to/Hashnode와 같은 톤의 한글판. 캐노니컬은 ConfigDeck 사이트로 |
| **OKKY/카카오 오픈채팅/디스코드** | ★★ | 직접 홍보 부적합. 질문 답변 중 자연스럽게 도구 추천 |
| **DEV/GDG/JSConf 발표** | ★★★★ | 1회 발표가 GeekNews/유튜브 기록으로 1~2년 누적 효과 |
| **한국어 블로그 게스트포스팅** | ★★ | 한국 개발자 블로그는 SEO 권위가 분산되어 있어 효율 낮음 |

> **Why 한국 보조:** 한국어 검색은 영어 대비 시장 작고(STR-0002 §맥락) 1인 운영 부담이 두 배가 된다. 영문 콘텐츠를 1차로, 한글은 핵심 시드(§5.2)만 번역해 velog/Hashnode KR에 캐노니컬로 올린다.

---

## 8. 측정 도구 비교

무료/저비용 분석 도구 비교. 현 단계에서 권장은 **Cloudflare Web Analytics + Google Search Console** 조합.

| 도구 | 비용 | 데이터 보존 | 이벤트 추적 | 개인정보 친화 | ConfigDeck 적합도 |
| --- | --- | --- | --- | --- | --- |
| **Cloudflare Web Analytics** | 무료 | 30일 | 제한적 (자체 사이트는 고급) | ★★★★★ (쿠키 없음) | ★★★★ — Cloudflare Pages와 통합 즉시 ([공식](https://www.cloudflare.com/web-analytics/)) |
| **Google Search Console** | 무료 | 16개월 | - | - | ★★★★★ — **반드시 등록**. 검색어/노출/CTR 데이터의 유일한 출처 |
| **Plausible (Cloud)** | 유료($9/월~) | 수년 | 풍부 | ★★★★★ | ★★ — 무료 아니므로 현 단계 보류 |
| **Plausible (Self-host)** | 무료(서버 비용) | 무제한 | 풍부 | ★★★★★ | ★★ — 운영 부담 ([Plausible 비교 페이지](https://plausible.io/vs-cloudflare-web-analytics)) |
| **Umami (Self-host)** | 무료(서버 비용) | 무제한 | 풍부 | ★★★★★ | ★★ — 정적 사이트에 self-host 분 노력 큼 ([Umami 자체 호스팅 비교](https://aaronjbecker.com/posts/umami-vs-plausible-vs-matomo-self-hosted-analytics/)) |
| **Umami (Cloud 무료)** | 무료(월 10K 이벤트) | 6개월 | 풍부 | ★★★★★ | ★★★ — 트래픽 적은 초기 단계엔 충분 |
| **Google Analytics 4** | 무료 | 제한 | 풍부 | ★ | ★ — 정체성과 불일치 |

### 추적해야 할 KPI (STR-0002 KPI 위에 보강)

STR-0002의 9개 KPI는 그대로 사용. 본 보고서는 **마케팅 채널 성과 측정**용으로 다음을 추가 제안.

| 지표 | 측정처 | 의미 |
| --- | --- | --- |
| 페이지별 검색 노출/클릭 (Top 20) | Search Console | 어떤 페이지가 검색 자산이 되고 있는가 |
| 핵심 키워드 평균 순위 추이 | Search Console | 6개월 곡선이 우상향이면 SEO 자산 누적 중 |
| 외부 리퍼럴 출처 Top 10 | Cloudflare Analytics | dev.to/HN/Reddit/GitHub 중 어디가 효과적인가 |
| Shareable URL OG 이미지 노출 후 CTR | (URL별 path counter, 직접 구현) | 미리보기 효과 검증 |
| GitHub README 배지 클릭 (있다면) | shields.io 통계 (제한적) 또는 사이트 리퍼럴 | §6.2 효과 |

---

## 9. 실행 우선순위 — 3개월 로드맵 (주 단위)

1인 운영 주 5~10시간을 가정. **각 주의 단일 산출물**을 명시한다.

### Month 1 — 인프라와 측정 (트래픽 자산 만들기 전 토대)

| 주 | 액션 | 산출물 | 시간 |
| --- | --- | --- | --- |
| W1 | Search Console + Bing Webmaster + Cloudflare Analytics 등록·검증 | 측정 인프라 | 3h |
| W2 | 동적 OG 이미지(@vercel/og) 구현 (§6.1) | Shareable URL 미리보기 | 8h |
| W3 | 생성기/마이그레이션 페이지에 inline 설명 추가 (§5.1) — 우선 ESLint, Prettier, TSConfig | thin-content 해소 | 8h |
| W4 | "Generated with ConfigDeck" 배지 스니펫 자동 생성 (§6.2) | README 자산 | 4h |

### Month 2 — 콘텐츠 시드와 첫 외부 발행

| 주 | 액션 | 산출물 | 시간 |
| --- | --- | --- | --- |
| W5 | Evergreen 글 #1 작성 ("ESLint Flat Config Migration Guide", §5.2) — 사이트 + dev.to 캐노니컬 | 글 1편 | 8h |
| W6 | Evergreen 글 #2 작성 ("TSConfig Strict Mode Explained") | 글 1편 | 8h |
| W7 | Evergreen 글 #3 작성 ("React + TS + Vite + ESLint Setup 2026") | 글 1편 | 8h |
| W8 | Reddit /r/javascript에 글 #1 또는 #3 발행. 댓글 응답 | 첫 외부 발행 | 4h |

### Month 3 — Show HN 준비 + 프로그래매틱 SEO 실험

| 주 | 액션 | 산출물 | 시간 |
| --- | --- | --- | --- |
| W9 | 프로그래매틱 SEO MVP — `/eslint/rule/{name}` 30개 페이지 자동 생성 (§3.4) | 색인 페이지 +30 | 8h |
| W10 | Evergreen 글 #4 작성 ("Husky + lint-staged + commitlint") | 글 1편 | 8h |
| W11 | Show HN 사전 점검 — 데모 무가입 확인, README 정비, 백스토리 댓글 초안 | Show HN 준비 | 4h |
| W12 | **Show HN 발행** (P0.5 Import & Audit 출시 가정 시) + Reddit 동시 발행 | 단발 모멘텀 | 6h |

### 90일 후 점검 지표 (STR-0002 KPI와 정렬)

- 색인 페이지 수: 100p+ (현 ~30 → +프로그래매틱 30 + 글 4편 + 기존 보강)
- 유기검색 클릭: 500/월 (Show HN 후 첫 측정 기준선)
- 외부 리퍼럴 Top 3: HN, dev.to, GitHub 정착 확인
- Shareable URL 생성 수 50/월

> **Why 이 순서:** 측정 → 자산 → 발행. 측정 없이 발행하면 어떤 채널이 효과 있는지 모르고, 자산(콘텐츠/OG 이미지) 없이 발행하면 트래픽이 와도 SEO에 누적되지 않는다.

---

## 10. 참고 자료

### 커뮤니티 정책
- [Hacker News — Show HN Guidelines](https://news.ycombinator.com/showhn.html)
- [Hacker News — Newsguidelines](https://news.ycombinator.com/newsguidelines.html)
- [Lobsters — About](https://lobste.rs/about)
- [dev.to — Cross-posting & canonical URL guide](https://dev.to/leewynne/how-to-cross-post-and-import-your-existing-blog-into-dev-and-retain-seo-original-source-and-ranking-mm8)
- [Reddit reddiquette](https://support.reddithelp.com/hc/en-us/articles/205926439)

### SEO 공식 자료
- [Google Search Central — Structured Data Intro](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google Search Central — Localized versions (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google Search Central — Crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google Search Console](https://search.google.com/search-console/about)
- [Google Trends](https://trends.google.com/)
- [Search Engine Land — Canonicalization SEO 2026](https://searchengineland.com/canonicalization-seo-448161)
- [Search Engine Land — Programmatic SEO Guide](https://searchengineland.com/guide/programmatic-seo)
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals)

### Astro/Cloudflare 기술 문서
- [Astro — Sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Astro — Cloudflare deploy](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Cloudflare Pages — vercel/og plugin](https://developers.cloudflare.com/pages/functions/plugins/vercel-og/)
- [Cloudflare Workers — Generate Dynamic OG Images](https://developers.cloudflare.com/workers/tutorials/generate-dynamic-og-images-using-workers/)

### 측정 도구
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/)
- [Plausible vs Cloudflare Web Analytics](https://plausible.io/vs-cloudflare-web-analytics)
- [Umami vs Plausible vs Matomo (self-hosted comparison)](https://aaronjbecker.com/posts/umami-vs-plausible-vs-matomo-self-hosted-analytics/)
- [Bing Webmaster Tools](https://www.bing.com/webmasters/about)

### ESLint/도구 생태계 (콘텐츠 시드 1차 소스)
- [ESLint v9.0.0 announcement](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/)
- [ESLint Configuration Migration Guide](https://eslint.org/docs/latest/use/configure/migration-guide)
- [ESLint Configuration Migrator](https://eslint.org/blog/2024/05/eslint-configuration-migrator/)
- [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig/)

### GitHub 및 배지
- [GitHub Trending Algorithm — community discussion 163970](https://github.com/orgs/community/discussions/163970)
- [shields.io](https://shields.io/)

### 내부 참조
- [STR-0002: ConfigDeck 전략 보고서](./STR-0002-configdeck-strategy-2026-04.md)
- [MI-0002: 경쟁사 분석](./MI-0002-competitor-analysis-2026-04.md)
- [BA-0002: 경쟁력 분석](./BA-0002-configdeck-competitiveness-2026-04.md)
- [ADR-0014: 성장 전략 로드맵](../../decisions/records/ADR-0014-growth-strategy-roadmap.md)
- [SPEC-0003: Shareable URL](../../ia/specs/features/SPEC-0003-shareable-url.md)
- [SPEC-0004: Import & Audit](../../ia/specs/features/SPEC-0004-import-and-audit.md)

---

## 변경 이력

| 날짜 | 변경 내용 | 변경자 |
| --- | --- | --- |
| 2026-04-29 | 초안. 글로벌 우선·장기 SEO·무료 제약 하의 마케팅 채널 전략. STR-0002/ADR-0014 위에 채널/콘텐츠/그로스 레버 보강 | research 스킬 |
