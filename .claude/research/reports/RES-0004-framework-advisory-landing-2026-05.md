# RES-0004 — 프레임워크 보안 권고(Advisory) 이벤트성 랜딩 페이지 시리즈 도입 가능성 검증

- 조사 일자: 2026-05-09
- 조사자: `/research` 스킬
- 목적: ConfigDeck에 CVE/메이저 마이그레이션 시점에 맞춘 **이벤트성 advisory 랜딩 페이지 시리즈**를 도입할 때, 기존 보안 도구들과의 포지셔닝, SEO 콘텐츠 구성, 구현 방식, sunset 정책, 법적 고려사항을 정리하여 SPEC 작성의 입력으로 사용한다.

---

## 요약

- **상시 진단 도구(Snyk, Dependabot, npm audit)와 정면 경쟁은 불가능하며, 그럴 필요도 없다.** 이들은 CI/IDE 통합 SaaS 시장이고, ConfigDeck은 "프로젝트 시작 시 설정"이라는 다른 시장에 있다.
- **빈자리는 "특정 CVE/메이저 릴리즈 단위의 한국어 한 페이지 가이드 + 단발 진단기"** 영역이다. Snyk 블로그·GHSA·Datadog Security Labs는 모두 영어 중심이고, 텍스트 위주이며, "내 프로젝트가 영향받는지 즉시 보여주는" 인터랙션이 약하다.
- **콘텐츠 구성 표준은 명확하다**: CVE/GHSA 메타(severity, affected, patched), 작동 원리, 영향 판단 체크리스트, 패치 경로, references. Snyk 블로그가 모범 사례이며 GHSA가 메타 필드의 표준 셋을 제공한다.
- **구현은 Astro Content Collections + Zod 스키마 + 클라이언트 사이드 semver 비교**로 충분하다. 진단 룰셋을 advisory 콘텐츠 frontmatter로 관리하면 콘텐츠와 진단 로직이 한 파일에서 일치한다.
- **sunset 정책은 noindex가 아니라 "outdated 배너 + canonical 유지 + dateModified 갱신"이 정답.** Google Search Central은 명시적으로 "단일 사이트 내에서 canonical 결정 목적으로 noindex를 쓰지 말 것"을 권고한다.
- **법적 위험은 낮지만 면책 조항은 필수.** NVD는 퍼블릭 도메인, GHSA는 CC-BY-4.0, MITRE CVE는 royalty-free + attribution. 진단 결과에는 "정보 제공 목적, 보증 없음(AS IS)" 명시가 표준이다.

ConfigDeck 코어 IA를 침범하지 않는 별도 섹션(`/advisory/{slug}` 등)으로 분리하고, 기존 SEO 랜딩 시리즈(`/ai-config/{tool}`)와 동일한 부모-자식 패턴을 재사용하는 방향이 가장 합리적이다.

---

## 조사 내용

### 1. 경쟁/유사 도구 비교

#### 1-1. 도구별 포지션 정리

| 도구 | 포지션 | advisory 페이지 SEO 운영 | 무료/유료 | ConfigDeck과의 관계 |
|---|---|---|---|---|
| **GitHub Advisory Database (GHSA)** | 오픈소스 데이터베이스. CVE + GitHub 자체 advisory 통합 | ✅ `/advisories/GHSA-...` 단위 SEO 페이지 (표준 메타 필드) | 무료, **CC-BY-4.0** | **데이터 원천**. 우리가 인용·재가공해야 함 |
| **NVD (NIST)** | 미국 정부 공식 CVE 데이터베이스 | ✅ `/vuln/detail/CVE-...` SEO 페이지 | 무료, **퍼블릭 도메인** | **데이터 원천**. attribution 권장(의무 아님) |
| **Snyk (security.snyk.io + 블로그)** | 상업 SaaS. 패키지 단위 + 블로그형 advisory | ✅ 패키지 페이지 + CVE별 블로그 포스트 (CTA 강함) | 무료 DB 열람 + 유료 SaaS | **콘텐츠 모범사례 벤치마크**. 우리는 CTA 끝점이 다름(생성기) |
| **Socket.dev** | 행위 기반 supply chain 분석 | 일부 패키지 페이지 | 무료 + 유료 | 동작 원리가 달라 직접 비교 어려움 |
| **OSV.dev (Google)** | OSV 포맷 표준 + 데이터 집계기 | ✅ vulnerability ID 단위 페이지(텍스트 위주) | 무료, 오픈소스 | **데이터 원천 후보**(OSV 포맷 표준 사용 시) |
| **GitHub Dependabot** | 저장소 PR 자동화 | 페이지 운영 X | 무료(GitHub 통합) | 시장 다름(상시 자동화 vs 단발 가이드) |
| **npm audit** | CLI 기반 즉시 진단 | 페이지 운영 X | 무료(npm 기본) | 시장 다름(CLI vs 웹 가이드) |
| **codemod.com / Hypermod** | AST 기반 마이그레이션 자동 변환 | 일부 마이그레이션 가이드 페이지 | 무료 + 유료 | **인접 시장**. 우리는 진단·안내, 이들은 코드 변환 |

> 출처: [Snyk Vulnerability DB](https://security.snyk.io/), [GHSA-f82v-jwr5-mffw](https://github.com/advisories/GHSA-f82v-jwr5-mffw), [NVD CVE-2025-29927](https://nvd.nist.gov/vuln/detail/CVE-2025-29927), [Socket - Google's OSV adds 500 advisories](https://socket.dev/blog/google-osv-fix-adds-500-new-advisories), [Codemod react/19/replace-default-props](https://app.codemod.com/registry/react/19/replace-default-props)

#### 1-2. 빈자리(ConfigDeck 포지션 가능성)

상시 진단 도구들은 모두 영어 중심이고, **단일 CVE/메이저 릴리즈 단위로 "내 프로젝트가 영향받는지 30초 안에 알려주는 한국어 페이지"**를 제공하지 않는다.

- GHSA: 메타 정보는 풍부하지만 텍스트 위주, 인터랙션 0
- Snyk 블로그: 풍부한 설명 + 자사 제품 CTA, 단 영어
- Datadog Security Labs ([CVE-2025-29927 분석](https://securitylabs.datadoghq.com/articles/nextjs-middleware-auth-bypass/)): 깊은 기술 분석 + 영어
- 한국어 자료: 개인 블로그, 부정확/단편적, 권위 부족

**ConfigDeck의 포지셔닝 가설:**

> "프레임워크 보안 권고를 한국어로 가장 빠르게, 진단까지 같이 보여주는 한 페이지 가이드"
> — 본 서비스(`/ai-config`, 생성기)로 트래픽을 흡수하는 콘텐츠 마케팅 자산

이는 npm audit/Snyk의 *대체*가 아니라 *보완재*다. 사용자는 이 페이지에서 영향 여부 확인 후 결국 npm audit/Dependabot으로 흘러간다 — 그게 자연스럽다.

---

### 2. CVE/마이그레이션 advisory 페이지 콘텐츠 구성

#### 2-1. Snyk 블로그형 advisory 표준 섹션 (CVE-2025-29927 사례)

[Snyk - CVE-2025-29927 Authorization Bypass in Next.js Middleware](https://snyk.io/blog/cve-2025-29927-authorization-bypass-in-next-js-middleware/) 분석:

1. **헤더 메타**: 제목, CVSS 9.1 배지, 발행일(March 23, 2025), 저자 프로필, 카테고리("Vulnerability Insights"), 읽는 시간
2. **취약점 개요** — 한 문단 요약
3. **영향 범위** — 호스팅 플랫폼별 영향 표(Vercel/Netlify/Cloudflare 등 검증)
4. **기술 배경** — Next.js Middleware가 무엇인지 개념 설명
5. **취약점 메커니즘** — `x-middleware-subrequest` 헤더 동작과 우회 원리
6. **영향 판단 체크리스트** — "내 프로젝트가 영향받는가?"를 체크할 수 있는 조건들
7. **패치 및 해결방안** — 버전별 패치 라인(13.5.9 / 14.2.25 / 15.2.3 / 12.3.5)
8. **CTA** — Snyk 도구 가입/리포트 다운로드/뉴스레터
9. **신뢰성 신호** — 발견자 credit, 코드 예시, 스크린샷

#### 2-2. GHSA 페이지의 표준 메타 필드 셋

[GHSA-f82v-jwr5-mffw](https://github.com/advisories/GHSA-f82v-jwr5-mffw) 분석:

| 필드 | 값 예시 | ConfigDeck advisory 스키마 후보 |
|---|---|---|
| CVE ID | CVE-2025-29927 | `cveId: string` |
| GHSA ID | GHSA-f82v-jwr5-mffw | `ghsaId: string` |
| Severity / CVSS | Critical (9.1) | `severity: "low" \| "medium" \| "high" \| "critical"`, `cvssScore: number` |
| Published / Updated | Mar 21, 2025 / Mar 2, 2026 | `publishedAt: Date`, `updatedAt: Date` |
| Ecosystem / Package | npm / next | `ecosystem: "npm"`, `package: string` |
| Affected Versions | `>= 13.0.0, < 13.5.9` 등 다중 범위 | `affected: { range: string }[]` (semver range 문자열) |
| Patched Versions | 13.5.9 / 14.2.25 / 15.2.3 / 12.3.5 | `patched: string[]` |
| Description / Impact / Patches / Workaround / References | 5개 본문 섹션 | 본문 MDX 콘텐츠 영역 |
| Weaknesses (CWE) | CWE-285, CWE-863 | `cwe: string[]` (선택) |
| EPSS | 92.057% | `epss: number` (선택) |
| Credits | GitHub 사용자 + 발견자 | `credits: { name, url, role }[]` |

> GHSA를 그대로 따라가면 **표준 OSV 포맷**과 호환되어, 향후 자동 동기화도 가능하다. ([github/advisory-database](https://github.com/github/advisory-database) — 모든 advisory가 OSV 포맷으로 저장됨)

#### 2-3. 마이그레이션(메이저 릴리즈) 페이지의 추가 섹션

CVE와 달리 메이저 릴리즈 마이그레이션은 코드 변경이 핵심이다. [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide), [Codemod react/19/replace-default-props](https://app.codemod.com/registry/react/19/replace-default-props) 분석에서 다음 섹션이 표준이다:

- **Breaking changes 목록** — 한 줄 요약 + 영향도
- **Before/After 코드 비교** — `defaultProps` → ES6 default parameters
- **자동 마이그레이션 명령** — `npx codemod react/19/replace-default-props` 같은 1-line CLI
- **수동 변경 체크리스트** — codemod로 처리 안 되는 항목
- **Type 마이그레이션 별도 섹션** — `npx types-react-codemod@latest preset-19`

ConfigDeck은 codemod를 직접 실행하진 않지만 **"이 명령어를 복사해서 실행하세요" + 입력된 버전에 따른 영향 항목 표시**까지가 적정 범위다.

#### 2-4. SEO 키워드 패턴

검증된 long-tail 키워드 형태:
- `Next.js CVE-2025-29927 fix`
- `Authorization Bypass Next.js Middleware`
- `React 19 defaultProps migration`
- `react-codemod migration recipe`
- 한국어 변형: `Next.js 미들웨어 인증 우회`, `React 19 마이그레이션 가이드`

이들은 **CVE 발행 직후 1~3주 피크 → 6개월 long tail**의 패턴을 보이며, 영구 도구 페이지가 아닌 **시점성 가이드**가 트래픽을 흡수한다. (정량 데이터는 Google Trends 공개 분석 한계로 정성 판단)

---

### 3. Astro SSG 진단기 구현 방식

#### 3-1. 콘텐츠 + 진단 룰셋 통합 구조

[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) + [Zod 스키마](https://docs.astro.build/en/reference/modules/astro-zod/)로 advisory를 관리한다.

```ts
// src/content/config.ts (구상안 — SPEC에서 확정)
import { defineCollection, z } from "astro:content";

const advisoryCollection = defineCollection({
  type: "content",
  schema: z.object({
    cveId: z.string().optional(),
    ghsaId: z.string().optional(),
    title: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    cvssScore: z.number().min(0).max(10).optional(),
    ecosystem: z.literal("npm"),
    package: z.string(),
    affected: z.array(z.object({ range: z.string() })),  // semver range
    patched: z.array(z.string()),
    publishedAt: z.date(),
    updatedAt: z.date(),
    sunsetAt: z.date().optional(),     // 시한부 콘텐츠 명시
    references: z.array(z.object({ label: z.string(), url: z.string().url() })),
    credits: z.array(z.object({ name: z.string(), url: z.string().url().optional() })).optional(),
  }),
});
```

> Zod는 ConfigDeck이 이미 `astro:content`에서 사용 중이며, [BetterLink Blog 가이드](https://eastondev.com/blog/en/posts/dev/20251124-astro-content-collections-guide/)에 따르면 빌드 타임 검증 + IntelliSense 지원이 표준 패턴이다.

#### 3-2. 클라이언트 사이드 semver 비교

[npm semver](https://www.npmjs.com/package/semver) (현재 v7.7.x, 약 6억+ 다운로드)는 모듈러 임포트로 일부 함수만 사용 가능하다.

```ts
import satisfies from "semver/functions/satisfies";  // 단일 함수만 import → tree-shake
satisfies("14.2.20", ">= 13.0.0 < 14.2.25");  // true
```

[Bundlephobia semver](https://bundlephobia.com/package/semver) 기준 풀 import는 무거우나 **개별 함수 import 시 수 KB 수준**이며, satisfies 한 함수만 쓰는 진단기 컨텍스트에서는 실용적이다.

대안: [semver-ts](https://www.npmjs.com/package/semver-ts) — TypeScript 작성 + ESM 트리쉐이크 + CDN 직접 로드 가능.

#### 3-3. 입력 방식

| 방식 | 장점 | 단점 |
|---|---|---|
| **버전 문자열 입력** ("14.2.20") | 가장 가볍고 즉시 진단 | 한 패키지만 |
| **package.json 붙여넣기** | 의존성 트리 일부 검사 | 클라이언트에서 JSON.parse만 하면 됨 |
| **package.json 파일 업로드** | UX 친화적 | 파일 읽기 + 보안 표시 필요 |

ConfigDeck의 기존 생성기 UI 패턴(텍스트 영역 + 미리보기)과 일관되게 **"버전 문자열 입력"을 기본 + "package.json 붙여넣기"를 옵션**으로 두는 게 자연스럽다. 파일 업로드는 단순한 것이 무거워질 위험이 있어 우선순위 낮음.

> Astro 측 제약: 클라이언트 코드에서 `window` 접근은 [client:* 디렉티브](https://docs.astro.build/en/guides/framework-components/) 안에서만 가능. Svelte 아일랜드로 진단 폼을 감싸는 형태가 표준.

#### 3-4. 진단 로직의 위치

advisory MDX 콘텐츠의 frontmatter `affected[].range`를 그대로 진단 룰로 사용한다. 별도 룰 파일을 두면 콘텐츠와 진단 결과가 어긋날 위험이 있어 **single source of truth**가 깨진다.

```ts
// 진단 컴포넌트 측
import satisfies from "semver/functions/satisfies";
const isAffected = advisory.affected.some(a => satisfies(userVersion, a.range));
```

---

### 4. sunset / archive 정책 (이벤트성 콘텐츠 SEO)

#### 4-1. noindex는 답이 아니다

[Google Search Central - Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)는 명확하다:

> "Don't use noindex to prevent selection of a canonical page within a single site. rel=canonical link annotations are the preferred solution."

advisory 페이지가 outdated되었더라도:
- **노이즈 없는 별도 도메인이라면** noindex 가능
- **단일 사이트 내** 시한부 콘텐츠에는 **canonical + 명시적 outdated 배너 + dateModified 갱신**이 권장

#### 4-2. dateModified 활용

[Article Schema](https://developers.google.com/search/docs/appearance/structured-data/article)와 [Google blog: Help Search know the best date](https://developers.google.com/search/blog/2019/03/help-google-search-know-best-date-for):

- `datePublished`(최초)와 `dateModified`(최종 갱신)를 ISO 8601로 마크업
- 의미 있는 갱신 시에만 `dateModified` 갱신 (오타 수정으로 갱신하면 SEO 신뢰 하락)
- 화면에 보이는 날짜와 schema 날짜가 일치해야 함

#### 4-3. ConfigDeck용 sunset 정책 안

| 상태 | 페이지 처리 | SEO 신호 |
|---|---|---|
| **active** | 풀 콘텐츠 + 진단기 활성 | 정상 인덱싱, sitemap 포함 |
| **stale** (CVE 후 6개월~1년) | 상단에 "이 가이드는 {날짜} 기준입니다" 배너 + 진단기 유지 | dateModified 유지, sitemap 포함 |
| **superseded** (후속 CVE/메이저로 대체) | 상단에 후속 advisory로 canonical/링크 + 진단기 비활성 | rel=canonical → 후속 페이지, sitemap 포함 |
| **archived** (해당 버전 자체가 EOL) | 콘텐츠는 유지, 진단기 영역에 "이 버전은 EOL입니다" | sitemap 유지, robots는 그대로 |

> noindex는 마지막 카드. 콘텐츠가 오해를 유발할 위험이 명확할 때만 쓰며, 그 경우에도 canonical과 함께 쓰지 않는다 (혼합 신호 금지).

---

### 5. 법적/책임/attribution 고려사항

#### 5-1. 데이터 라이선스 정리

| 출처 | 라이선스 | 재배포 조건 |
|---|---|---|
| **NVD (NIST)** | 퍼블릭 도메인 (Title 17 USC) | 자유, attribution 권장 |
| **MITRE CVE** | royalty-free 영구 라이선스 | "MITRE 저작권 표기 + 라이선스 사본"을 모든 복사본에 첨부 필요 |
| **GitHub Advisory Database** | **CC-BY-4.0** | 재배포·수정·상업 이용 가능, **attribution 필수** |
| **OSV.dev** | 오픈소스 (개별 advisory마다 원천 라이선스 따름) | 출처 표기 |

> 출처: [GitHub blog - Advisory Database by the numbers](https://github.blog/security/github-advisory-database-by-the-numbers-known-security-vulnerabilities-and-what-you-can-do-about-them/), [github/advisory-database 저장소](https://github.com/github/advisory-database) (CC-BY-4.0 명시), [NVD - Vulnerabilities](https://nvd.nist.gov/vuln)

ConfigDeck advisory 페이지 푸터에 표기할 표준:

```
Data sources:
- GitHub Advisory Database (CC-BY-4.0) — github.com/advisories
- National Vulnerability Database (Public Domain) — nvd.nist.gov
- MITRE CVE Program (royalty-free) — cve.mitre.org
```

#### 5-2. 면책 조항(Disclaimer)

보안 진단 결과는 정보 제공 목적이며, 실제 영향 여부는 운영 환경·구성·체인에 따라 다르다. 표준 disclaimer 패턴:

> "이 페이지의 진단 결과는 정보 제공 목적이며 무보증(AS IS)으로 제공됩니다. 실제 보안 위험 평가는 npm audit, Snyk, Dependabot 등의 공식 도구와 관리자 검토를 병행하세요."

[Free Privacy Policy - Website Disclaimers](https://www.freeprivacypolicy.com/blog/website-disclaimers/) 등의 가이드는 "AS IS / AS AVAILABLE" 명시를 표준으로 제시한다. 보안 컨텍스트에서는 추가로 "공식 advisory 우선" 안내를 곁들이는 것이 ConfigDeck의 신뢰도 측면에서 유리하다.

#### 5-3. 신뢰성 신호

- 페이지 상단 또는 푸터에 **출처 링크 명시**(GHSA/NVD ID로 직접 링크)
- **발견자 credits** GHSA에서 그대로 인용
- 업데이트 시점(`updatedAt`) 가시화
- 진단 결과 옆에 **"공식 advisory에서 다시 확인"** 외부 링크

---

## 비교: ConfigDeck vs 경쟁 advisory 페이지

| 관점 | GHSA | Snyk 블로그 | Datadog Security Labs | **ConfigDeck advisory(가설)** |
|---|---|---|---|---|
| 언어 | 영어 | 영어 | 영어 | **영어 + 한국어 동시 출시** (en/ko, 일본어는 후속) |
| 메타 표준 | OSV/CVSS 풀 | 부분 | 부분 | OSV 호환 |
| 인터랙티브 진단 | 없음 | 없음(자사 SaaS 유도) | 없음 | **있음(버전 입력 즉시)** |
| 코드 예시/PoC | 일부 | 풍부 | 매우 풍부 | 적정(요약 + 외부 PoC 링크) |
| CTA 끝점 | GitHub Security | Snyk SaaS 가입 | 회사 블로그 구독 | **`/ai-config`/생성기로 본 서비스 유입** |
| 운영 비용 | GitHub | 상시 보안팀 | 상시 리서치팀 | **CVE 1건당 2~3일 (en/ko 동시)** |
| 페이지 단위 | GHSA ID | CVE ID | 분석 토픽 | **CVE/메이저 단위 slug** |

---

## ConfigDeck 적용 시 권장 방향

### 1. 위치와 IA

- **별도 섹션**: `/advisory/{slug}` (예: `/advisory/nextjs-cve-2025-29927`, `/advisory/react-19-migration`)
- **부모 허브**: `/advisory` 카탈로그 페이지 (시간 역순 + 심각도 필터)
- 코어 IA(`/ai-config`, 생성기)와 분리하여 정체성 보호 — ADR-0019의 부모-자식 위계 정신 유지
- 자식 페이지 푸터에서 본 서비스(`/ai-config`, 생성기)로 CTA

### 2. 콘텐츠 스키마 (요지)

`src/content/advisory/`에 MDX 파일 + Zod 스키마. frontmatter는 GHSA/OSV 표준 필드를 그대로 매핑(2-2 표 참조). `affected[].range`는 진단 룰셋과 single source of truth.

### 3. 진단기 컴포넌트

- Svelte 아일랜드 1개 (`<AdvisoryDiagnosis />`)
- 입력: 버전 문자열 (기본) + package.json 붙여넣기 (옵션)
- 의존성: `semver/functions/satisfies` 단일 함수 import
- 출력: 영향 여부 + 권장 패치 버전 + 외부 공식 링크

### 4. SEO 구성

- `Article` schema + datePublished/dateModified
- `BreadcrumbList` (Home → Advisory → {slug})
- 다국어: **영어/한국어 동시 출시** (ConfigDeck i18n 정책 준수, 기본 로케일 `en`, 지원 로케일 `en`/`ko`). 일본어는 ConfigDeck 전체 i18n이 확장될 때 함께 추가
- 로케일별 URL: `/en/advisory/{slug}`, `/ko/advisory/{slug}` (ConfigDeck `prefixDefaultLocale: true` 정책에 따름)
- `hreflang` 태그로 로케일 간 상호 참조 (en ↔ ko)
- sitemap: 모든 advisory의 모든 로케일 포함, 상태가 `superseded`여도 유지

### 5. Sunset 정책

- frontmatter `sunsetAt`, `status` 필드로 표현 (`active` / `stale` / `superseded` / `archived`)
- 빌드 시 상태별 배너 자동 삽입 (Astro 컴포넌트)
- `noindex` 사용 금지(canonical로 처리)

### 6. 법적 처리

- 모든 advisory 페이지 푸터에 데이터 출처 + 라이선스 명시
- 진단기 영역에 disclaimer 항상 표기
- credits는 GHSA에서 인용 + 원본 링크

### 7. 운영

- 시작: **CVE-2025-29927(Next.js)** 1건으로 PoC → 패턴 검증
- 1차 확장: React 19 마이그레이션, CVE-2024-46982 등 2~3건
- 운영 비용 가설: 신규 advisory 1건당 **2~3일** (조사 + 영어 작성 + 한국어 번역·재가공 + 진단 룰셋 설정)
- 다국어 작성 흐름: GHSA/Snyk 영어 원본 → 영어 advisory 작성 → 한국어 번역·재가공 (영어 본문이 1차 진실의 근거가 되도록)

### 8. SPEC 작성 시 결정해야 할 항목

- [ ] `/advisory` URL 구조 확정 (`/advisory/{slug}` vs `/security/{slug}` vs `/guides/{slug}`)
- [ ] 진단기 입력 범위 (버전 문자열만 vs package.json 옵션)
- [ ] 페이지 1개의 콘텐츠 길이/깊이 표준 (Snyk 블로그 수준 vs 더 가볍게)
- [ ] sunset/archive 운영 트리거 정의 (수동 vs 빌드 자동)
- [ ] PoC 대상 CVE 1건 선택 (CVE-2025-29927 추천)
- [ ] 영어/한국어 동시 출시 정책 — Zod 스키마에서 로케일별 본문 필드 처리 방식 (별도 MDX 파일 vs 단일 파일 다중 필드)

> 다국어 정책은 **영어/한국어 동시 출시**로 확정 (ConfigDeck i18n 정책 정합성 + 영어권 검색 트래픽 흡수). 일본어 등 추가 로케일은 ConfigDeck 전체 i18n 확장 시점에 함께 진행.

---

## 참고 자료

### 보안 데이터 원천
- [GitHub Advisory Database](https://github.com/advisories) — CVE + GitHub-originated advisory, OSV 포맷
- [github/advisory-database 저장소](https://github.com/github/advisory-database) — CC-BY-4.0 라이선스 명시, 데이터 다운로드 가능
- [NVD - Vulnerabilities](https://nvd.nist.gov/vuln) — NIST 공식 CVE DB, 퍼블릭 도메인
- [GitHub blog - Advisory Database by the numbers](https://github.blog/security/github-advisory-database-by-the-numbers-known-security-vulnerabilities-and-what-you-can-do-about-them/)
- [OSV.dev](https://osv.dev/) — 오픈소스 vulnerability 집계기

### CVE-2025-29927 사례
- [GHSA-f82v-jwr5-mffw](https://github.com/advisories/GHSA-f82v-jwr5-mffw) — 표준 GHSA 페이지
- [Snyk - CVE-2025-29927 Authorization Bypass in Next.js Middleware](https://snyk.io/blog/cve-2025-29927-authorization-bypass-in-next-js-middleware/) — 블로그형 advisory 모범사례
- [Datadog Security Labs - Next.js Middleware Auth Bypass](https://securitylabs.datadoghq.com/articles/nextjs-middleware-auth-bypass/) — 깊은 기술 분석 사례
- [NVD - CVE-2025-29927](https://nvd.nist.gov/vuln/detail/CVE-2025-29927)
- [Vercel/next.js Security Advisory GHSA-f82v-jwr5-mffw](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw)
- [azu/nextjs-cve-2025-29927-poc](https://github.com/azu/nextjs-cve-2025-29927-poc) — PoC 저장소

### React 19 마이그레이션 사례
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Codemod react/19/replace-default-props](https://app.codemod.com/registry/react/19/replace-default-props)
- [Codemod react/19/migration-recipe](https://app.codemod.com/registry/react/19/migration-recipe)
- [LogRocket - Migrating to React 19 using react-codemod](https://blog.logrocket.com/migrating-react-19-using-react-codemod/)

### 구현 (Astro / semver)
- [Astro - Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro - Zod API Reference](https://docs.astro.build/en/reference/modules/astro-zod/)
- [Astro - Front-end frameworks (client:* directives)](https://docs.astro.build/en/guides/framework-components/)
- [npm - semver 패키지](https://www.npmjs.com/package/semver) — 모듈러 import 가이드
- [semver-ts](https://www.npmjs.com/package/semver-ts) — TypeScript + ESM 트리쉐이크
- [Bundlephobia - semver](https://bundlephobia.com/package/semver)

### SEO / Sunset
- [Google Search Central - Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google Search Central - Article Schema](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google Search blog - Help Search know the best date](https://developers.google.com/search/blog/2019/03/help-google-search-know-best-date-for)
- [Google Search Central - Add a Byline Date](https://developers.google.com/search/docs/appearance/publication-dates)

### 법적 / Disclaimer
- [Free Privacy Policy - Website Disclaimers](https://www.freeprivacypolicy.com/blog/website-disclaimers/)
- [Usercentrics - Disclaimer Examples](https://usercentrics.com/guides/website-disclaimers/disclaimer-examples/)
