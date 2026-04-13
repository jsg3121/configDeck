# ADR-0010: 아티클 콘텐츠 수집 및 갱신 전략

- 상태: 승인됨
- 날짜: 2026-04-13
- 의사결정자: jsg3121

## 맥락 (Context)

ConfigDeck은 `/article` 경로에 개발 도구(ESLint, Prettier, TypeScript, Next.js, React, Astro, Node.js)의 업데이트 뉴스를 제공하는 페이지를 추가할 예정이다. 이 페이지는 애드센스 광고 수익 창출을 목적으로 하며, 다음 세 가지 의사결정이 필요하다.

1. **콘텐츠 소스 방식**: 수동 큐레이션, RSS 자동 수집, 혼합형 중 선택
2. **자동 갱신 방식**: Astro SSG 환경에서 콘텐츠를 주기적으로 최신 상태로 유지하는 방법
3. **저작권/정책 대응**: RSS 원본 콘텐츠를 표시하는 방식과 애드센스 "부가가치" 요건 충족 방안

추가 배경:
- ConfigDeck은 Cloudflare Pages에 정적 파일로 배포된다 (ADR-0004)
- 서비스의 주된 수익화 전략이 애드센스임을 고려해야 한다
- 저작권 및 애드센스 정책 관련 리서치가 별도로 진행 중이며, 해당 리서치 결과가 확인되면 본 ADR의 상태를 `승인됨`으로 변경한다

## 결정 (Decision)

### 결정 1: 콘텐츠 소스 — 혼합형 채택 (RSS 자동 수집 + 편집자 주석)

RSS 피드가 공식 제공되는 도구는 RSS 자동 수집을 기반으로 하되, 각 항목에 편집자 코멘트(한 줄 요약 + 왜 중요한지 설명)를 추가하는 혼합형을 채택한다.

**도구별 공식 RSS/Atom 피드 URL:**

| 도구 | 피드 방식 | URL |
|------|----------|-----|
| ESLint | 공식 블로그 Atom | `https://eslint.org/feed.xml` |
| Prettier | GitHub Releases Atom | `https://github.com/prettier/prettier/releases.atom` |
| TypeScript | GitHub Releases Atom | `https://github.com/microsoft/TypeScript/releases.atom` |
| Next.js | GitHub Releases Atom | `https://github.com/vercel/next.js/releases.atom` |
| React | GitHub Releases Atom | `https://github.com/facebook/react/releases.atom` |
| Astro | 공식 블로그 RSS | `https://astro.build/rss.xml` |
| Node.js | GitHub Releases Atom | `https://github.com/nodejs/node/releases.atom` |

GitHub은 모든 공개 저장소에 대해 `/{owner}/{repo}/releases.atom` 형식의 Atom 피드를 공식 제공한다. ([GitHub REST API - Feeds](https://docs.github.com/en/rest/activity/feeds))

### 결정 2: 자동 갱신 방식 — GitHub Actions cron + Cloudflare Pages 빌드 훅

GitHub Actions의 `on.schedule` 트리거로 매일 UTC 00:00에 워크플로우를 실행하고, 신규 항목이 있을 경우 Cloudflare Pages 빌드 훅에 POST 요청을 보내 재빌드를 트리거한다.

**워크플로우 개요:**

```
GitHub Actions cron (daily)
  → RSS 피드 fetch + 기존 캐시와 diff
  → 신규 항목 있을 때만 빌드 훅 호출
  → Cloudflare Pages 재빌드 (Astro 빌드타임 fetch)
  → 정적 파일 배포
```

Astro의 Content Loader API(`astro build` 시점에 실행)가 RSS 피드를 fetch하여 로컬 데이터 스토어에 저장하고, 이를 `getCollection()`으로 조회해 페이지를 정적으로 생성한다. ([Astro Docs - Content Collections](https://docs.astro.build/en/guides/content-collections/))

### 결정 3: 저작권/정책 대응 — 제목 + 편집자 요약 + 원문 링크 (Snippet 방식)

각 아티클 항목을 다음 구조로 표시한다.

- **제목** (원문): RSS에서 가져온 원본 제목
- **편집자 요약** (자체 작성): ConfigDeck 편집자가 작성하는 1~3문장 요약 — "왜 개발자에게 중요한지"를 설명
- **원문 링크**: 원문으로의 명확한 외부 링크 (`rel="noopener noreferrer"`)
- **원문 description 발췌**는 포함하지 않는다

이 방식은 RSS 피드의 원문 전체를 재게시하지 않으며, 편집자 요약이 포함되어 애드센스의 "부가가치" 요건을 충족하는 독자적 콘텐츠를 제공한다.

## 근거 (Rationale)

### 혼합형 채택 (RSS + 편집자 주석)

- **순수 RSS 자동 수집만**: 편집자 개입 없이 원문 description을 재게시하면 저작권 침해 위험이 있다. MidlevelU v. Newstex 판례에서 법원은 "RSS를 공개 배포한다고 해서 상업적 재게시까지 허락한 것은 아니다"라고 판시했다 ([MONDAQ - Implied Copyright Licenses](https://www.mondaq.com/unitedstates/copyright/1047416/implied-copyright-licenses-in-the-digital-world-blogs-rss-feeds-and-aggregators))
- **순수 수동 큐레이션만**: 매일 갱신이 필요한 콘텐츠를 수동으로만 관리하면 운영 비용이 과대하다
- **혼합형**: 자동 수집으로 운영 부담을 낮추고, 편집자 요약으로 부가가치와 저작권 대응을 동시에 충족한다

### GitHub Actions cron 채택

- `on.schedule` 트리거는 POSIX cron 문법으로 최소 5분 간격의 주기적 실행을 지원한다. 아티클 갱신은 일 1회로 충분하므로 가장 단순한 구성이다 ([GitHub Docs - Events that trigger workflows](https://docs.github.com/actions/learn-github-actions/events-that-trigger-workflows))
- GitHub Actions는 ConfigDeck이 이미 사용 중인 인프라이므로 별도 외부 서비스(Pipedream 등) 도입 없이 구성 가능하다
- Cloudflare Pages 빌드 훅은 HTTP POST 한 번으로 빌드를 트리거할 수 있으며, 별도 인증이 불필요하다 ([Cloudflare Pages - Deploy Hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/))
- 신규 항목이 없을 때 빌드를 건너뛰도록 조건 분기를 추가하면 Cloudflare Pages 무료 플랜의 빌드 횟수를 절약할 수 있다

### Snippet 방식 채택 (저작권 대응)

- 제목 + 원문 링크만으로는 애드센스 "얇은 콘텐츠(thin content)" 판정을 받을 수 있다. 애드센스 정책은 독자적 가치(E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness)가 있는 콘텐츠를 요구한다 ([AdSense Program Policies](https://support.google.com/adsense/answer/48182))
- 편집자 요약은 저작권법상 새로운 창작물로, 출처 표기와 원문 링크가 수반되면 인용(fair use) 범주에 해당할 가능성이 높다 ([RSS Feeds and Copyright Law - worldlaw.eu](https://worldlaw.eu/rss-feeds-and-copyright-law/))
- 원문 description 전문 재게시는 저작권 위험과 함께 원문과 동일한 중복 콘텐츠로 Google 검색 페널티 위험도 있다

### Astro Content Loader 채택 (빌드타임 fetch)

- Astro의 Content Collections Loader API는 빌드 시점에 원격 소스(RSS, API)를 fetch하여 `getCollection()`으로 정적 페이지를 생성하는 공식 패턴이다 ([Astro Docs - Content Collections](https://docs.astro.build/en/guides/content-collections/))
- Astro v5.10+에서는 `experimental.liveContentCollections`으로 런타임 fetch도 가능하나, Cloudflare Pages 정적 배포 방식(ADR-0004)과 맞지 않으므로 빌드타임 방식을 유지한다

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| 순수 수동 큐레이션 | 매일 갱신 필요한 콘텐츠를 수동 관리하면 운영 부담이 과대함 |
| 원문 description 전문 재게시 | 저작권 침해 위험 (MidlevelU v. Newstex 판례). 중복 콘텐츠로 Google SEO 페널티 위험도 있음 |
| 전문 번역/재작성 | 번역 품질 보장을 위한 검수 비용이 크고, 자동화가 어려움 |
| Cloudflare Pages cron trigger | Cloudflare Pages는 자체 cron을 지원하지 않음. Workers Cron은 별도 Workers 서비스 구성 필요 |
| 외부 서비스(Pipedream, Zapier) | 무료 플랜 제한 있음. 이미 GitHub Actions 인프라를 사용하므로 불필요한 의존성 추가 |
| Astro SSR (런타임 fetch) | ADR-0004에서 Cloudflare Pages 정적 배포로 결정함. SSR 전환은 별도 ADR 필요 |
| GitHub Releases API (REST) | 공개 저장소는 `/releases.atom` Atom 피드가 이미 제공됨. REST API 호출은 인증 토큰과 rate limit 관리가 추가로 필요함 |

## 결과 (Consequences)

### 긍정적

- 자동 수집으로 운영 부담 최소화 (편집자 요약 작성만 필요)
- 편집자 요약으로 애드센스 부가가치 요건 충족 및 저작권 위험 경감
- GitHub Actions + Cloudflare Pages 빌드 훅으로 외부 서비스 의존성 없음
- Astro Content Loader 공식 패턴으로 구현 난이도 낮음

### 부정적

- ~~편집자 요약 작성은 완전 자동화가 아님~~ → ADR-0011에서 Gemini API 기반 AI 요약 자동화로 해결
- 빌드 기반이므로 실시간 갱신이 불가. 최대 ~24시간 지연 발생
- 각 도구의 RSS 피드 구조 변경 시 파서 업데이트 필요

### 후속 조치

- ✅ 저작권/애드센스 리서치 완료 — Snippet 방식 + AI 요약으로 정책 준수 확인
- ✅ ADR-0011에서 AI 요약 자동화 전략 결정 (Gemini API 채택)
- [ ] 아티클 페이지 기능 기획서(SPEC-0002) 작성
- [ ] `@astrojs/rss` 패키지 또는 직접 Atom/RSS 파싱 방식 결정 (구현 착수 전 확인)

## 참고 자료 (References)

- [GitHub REST API - Feeds](https://docs.github.com/en/rest/activity/feeds) — GitHub Atom 피드 공식 문서
- [Astro Docs - Content Collections](https://docs.astro.build/en/guides/content-collections/) — Astro Content Loader API 공식 문서
- [GitHub Docs - Events that trigger workflows](https://docs.github.com/actions/learn-github-actions/events-that-trigger-workflows) — GitHub Actions cron 공식 문서
- [Cloudflare Pages - Deploy Hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/) — Cloudflare Pages 빌드 훅 공식 문서
- [AdSense Program Policies](https://support.google.com/adsense/answer/48182) — 애드센스 프로그램 정책 (부가가치 요건 포함)
- [MONDAQ - Implied Copyright Licenses in the Digital World](https://www.mondaq.com/unitedstates/copyright/1047416/implied-copyright-licenses-in-the-digital-world-blogs-rss-feeds-and-aggregators) — RSS 집계와 저작권 관련 법적 분석 (MidlevelU v. Newstex 판례 포함)
- [RSS Feeds and Copyright Law - worldlaw.eu](https://worldlaw.eu/rss-feeds-and-copyright-law/) — RSS 저작권 법적 검토
- [ADR-0004: 배포 환경 선택](ADR-0004-deployment.md) — Cloudflare Pages 정적 배포 결정
