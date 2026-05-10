# ADR-0020: Advisory 콘텐츠 스키마와 진단 룰셋 single source of truth

- 상태: 제안됨
- 날짜: 2026-05-09
- 의사결정자: jsg3121

## 맥락 (Context)

SPEC-0006에서 ConfigDeck에 프레임워크 보안 권고(Advisory) 이벤트성 랜딩 페이지 시리즈를 도입하기로 했다. advisory 페이지는 두 가지 책임을 동시에 가진다.

1. **콘텐츠**: CVE/메이저 마이그레이션의 한국어/영어 가이드를 SEO 트래픽으로 노출
2. **진단**: 사용자가 입력한 버전이 영향받는지 클라이언트 사이드에서 즉시 판정

이 두 책임을 어떻게 데이터 구조로 표현할지에 따라 다음이 결정된다.

- 콘텐츠 작성자가 어떤 형식으로 advisory를 추가하는가
- 진단 결과가 콘텐츠 본문과 어긋날 위험이 있는가
- 향후 GHSA/OSV의 자동 동기화가 가능한가

선택지는 크게 세 갈래였다.

- **A**: 진단 룰셋과 콘텐츠를 분리 관리 (룰 JSON + MDX 본문)
- **B**: 콘텐츠 frontmatter에 진단 룰셋을 함께 두는 single source of truth
- **C**: 외부 GHSA API/OSV API를 빌드 타임에 fetch하여 자동 생성

이 결정은 SPEC-0006 §3.4(콘텐츠 스키마)와 §3.6(진단기)의 기술적 근거를 ADR로 분리·기록하기 위함이다. 후속 ADR로 semver 라이브러리 선택과 sunset 자동화 구현 방식을 다룬다.

## 결정 (Decision)

**Astro Content Collections + Zod 스키마**를 사용하며, **진단 룰셋(`affected[].range`, `patched[]`)은 콘텐츠 frontmatter에 함께 두어 single source of truth로 관리한다** (선택지 B).

### 콘텐츠 컬렉션 스키마 골격

```ts
// src/content/config.ts (예시)
import { defineCollection, z } from "astro:content";

const advisoryCollection = defineCollection({
  type: "content",
  schema: z.object({
    // 식별자
    cveId: z.string().optional(),
    ghsaId: z.string().optional(),
    title: z.string(),

    // 분류
    severity: z.enum(["low", "medium", "high", "critical"]),
    cvssScore: z.number().min(0).max(10).optional(),
    ecosystem: z.literal("npm"),
    package: z.string(),

    // 진단 룰셋 (콘텐츠와 single source of truth)
    affected: z.array(z.object({ range: z.string() })),
    patched: z.array(z.string()),

    // 시점·상태
    publishedAt: z.date(),
    updatedAt: z.date(),
    sunsetAt: z.date().optional(),
    status: z.enum(["active", "stale", "superseded", "archived"]).default("active"),
    supersededBy: z.string().optional(),

    // 신뢰성
    references: z.array(z.object({ label: z.string(), url: z.string().url() })),
    credits: z.array(z.object({ name: z.string(), url: z.string().url().optional() })).optional(),
    cwe: z.array(z.string()).optional(),
  }),
});
```

> 위 스키마는 SPEC 진행 단계의 골격이며, 구현 시 정확한 필드명·옵셔널 여부는 코드 PR에서 미세 조정한다. 핵심 결정은 **`affected[].range`/`patched[]`가 동일 frontmatter에서 진단·콘텐츠를 동시에 책임진다**는 점이다.

### 다국어 파일 구조

기존 `articles` 컬렉션과 동일한 패턴을 따른다.

```
src/content/advisory/
├── en/
│   └── nextjs-cve-2025-29927.md
└── ko/
    └── nextjs-cve-2025-29927.md
```

frontmatter의 진단 룰셋 필드(`affected`, `patched`, `severity`, `cvssScore`, `publishedAt`, `updatedAt`, `sunsetAt`, `status`, `supersededBy`)는 **로케일 간 동일해야 한다**. 본문(MDX)과 `title`만 로케일별로 다르다. 빌드 타임에 동일 slug의 두 로케일 frontmatter 일치를 검증한다.

### 외부 GHSA/OSV 동기화

도입하지 않는다. 출시 시점에는 수동 작성으로 시작하고, advisory 누적량이 의미 있게 늘어난 시점(가설: 10건 이상)에 별도 ADR로 자동화 도입을 재논의한다.

## 근거 (Rationale)

### B를 채택한 이유

**진단 결과와 콘텐츠 본문이 어긋날 수 없다.** A안에서는 룰 JSON의 `affected` 범위와 MDX 본문 "영향 버전" 텍스트가 시간이 지나면서 어긋날 위험이 명확하다. CVE 패치 라인은 사후에 늘어날 수 있고(예: 12.x 백포트가 뒤늦게 추가), 그때마다 두 곳을 동기화하는 운영 비용이 든다. B는 진단 룰셋이 곧 콘텐츠 데이터이므로 이 위험이 구조적으로 제거된다.

**Astro/Zod의 단일 저장소 검증과 결합된다.** [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)는 Zod 스키마로 frontmatter를 빌드 타임에 검증하고, IntelliSense/타입 안전성을 자동 생성한다. 진단 룰셋이 frontmatter에 있으면 진단 컴포넌트는 `getEntry()` 결과를 그대로 받아 `semver.satisfies(userVersion, entry.data.affected[0].range)` 형태로 호출할 수 있다. 별도 룰 로더가 필요 없다.

**OSV 포맷 호환을 보존한다.** GHSA가 사용하는 [OSV 포맷](https://github.com/github/advisory-database)의 `affected[].ranges`, `severity`, `references`, `credits` 필드를 그대로 매핑할 수 있다. 향후 자동 동기화가 도입되어도 스키마 마이그레이션 비용이 작다.

### C(외부 API 자동 동기화)를 도입하지 않는 이유

- **CC-BY-4.0 attribution 의무**가 페이지마다 정확히 표기되어야 하는데, 자동 fetch 결과를 그대로 노출하면 attribution 누락 리스크가 있다. 수동 작성이 더 안전하다.
- ConfigDeck advisory의 차별화는 **한국어 번역·재가공과 인터랙티브 진단**이지 GHSA 데이터 자체가 아니다. 자동 동기화로 페이지를 양산하면 차별화가 약해진다.
- 빌드 타임 외부 API 호출은 [Cloudflare Pages](https://developers.cloudflare.com/pages/) 빌드 환경에서 GHSA API rate limit/네트워크 오류에 빌드가 깨질 위험이 있다. 정적 SSG의 안정성을 해친다.
- 누적량이 적은 초기에는 자동화 ROI가 낮다.

### 다국어 frontmatter 일치 검증을 두는 이유

진단 룰셋(`affected`, `patched` 등)이 로케일별로 어긋나면 사용자 입장에서 같은 페이지의 한국어/영어 버전이 다른 진단을 내리는 모순이 발생한다. 빌드 타임에 동일 slug의 두 로케일 frontmatter를 비교해 진단 관련 필드가 다르면 빌드를 실패시킨다.

이는 [ConfigDeck CLAUDE.md "지침 저장 우선순위 — 중복 금지"](../../../CLAUDE.md) 정신과 일치한다. 동일 사실의 두 출처는 빠르게 어긋난다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| **A. 진단 룰셋과 콘텐츠 분리** (룰 JSON + MDX 본문) | 룰셋과 본문이 시간이 지나면서 어긋날 위험. 동기화 운영 비용. single source of truth 원칙 위반 |
| **C. GHSA/OSV API 빌드 타임 자동 동기화** | CC-BY-4.0 attribution 누락 리스크, 차별화 약화, 빌드 안정성 저하, 초기 ROI 낮음. 누적량 증가 후 별도 ADR로 재논의 |
| **D. 진단 로직 자체를 서버 사이드(Cloudflare Functions)로** | 정적 SSG 정체성 위반(CLAUDE.md 기술 스택 정책). 클라이언트 satisfies 호출만으로 충분한 컴퓨팅 |
| **E. semver 외 다른 비교 라이브러리(semver-ts, semver-lite 등)** | semver 라이브러리 선택은 별도 ADR로 분리. 이 ADR은 스키마 결정에 한정 |

## 결과 (Consequences)

### 긍정

- advisory 추가 시 작성자는 frontmatter 1곳만 채우면 콘텐츠와 진단이 동시에 갱신된다
- 진단 결과와 본문 텍스트가 구조적으로 일치한다
- Zod 스키마가 빌드 타임에 frontmatter 형식 오류를 잡는다
- 향후 OSV 자동 동기화 도입 시 스키마 마이그레이션 비용이 작다

### 부정 / 후속 조치 필요

- frontmatter가 비대해진다(필드 10여 개). 작성자 가이드 문서가 별도 필요 → SPEC-0006 §9 운영 절차에 작성 가이드 포함
- 다국어 frontmatter 일치 검증 로직을 빌드 단계에 추가해야 함 → 구현 단계 작업 항목
- semver 라이브러리 선택은 후속 ADR(ADR-0021 후보)로 분리. `semver/functions/satisfies` vs `semver-ts` 번들 크기 비교 필요
- sunset 자동화 구현 방식(`status`/`sunsetAt`을 어떤 단계에서 비교할지)도 후속 ADR로 분리 가능

### 영향받는 영역

- `src/content/config.ts`: advisory 컬렉션 정의 추가
- `src/content/advisory/{en,ko}/`: 콘텐츠 디렉토리 신설
- 빌드 검증 스크립트: 다국어 frontmatter 일치 검사 추가
- 진단 컴포넌트(Svelte 아일랜드): `getEntry().data.affected`를 직접 소비

## 참고 자료 (References)

- [SPEC-0006 — 프레임워크 Advisory 이벤트성 랜딩 페이지 시리즈](../../ia/specs/features/SPEC-0006-framework-advisory-landing.md) — 이 ADR이 근거로 삼는 기획서
- [RES-0004 — 프레임워크 보안 권고 랜딩 도입 검증](../../research/reports/RES-0004-framework-advisory-landing-2026-05.md) — 콘텐츠 스키마 후보 분석(§2-2, §3-1)
- [Astro — Content Collections](https://docs.astro.build/en/guides/content-collections/) — Zod 기반 frontmatter 검증
- [Astro — Zod API Reference](https://docs.astro.build/en/reference/modules/astro-zod/)
- [github/advisory-database](https://github.com/github/advisory-database) — OSV 포맷 표준 + CC-BY-4.0
- [OSV Schema](https://ossf.github.io/osv-schema/) — 표준 vulnerability 포맷 명세
- [GHSA-f82v-jwr5-mffw](https://github.com/advisories/GHSA-f82v-jwr5-mffw) — 표준 메타 필드 셋 사례
- [npm — semver 패키지](https://www.npmjs.com/package/semver) — 진단 컴포넌트가 사용할 비교 함수 출처
- [ADR-0019 — AI Config IA 재설계](./ADR-0019-ai-config-ia-redesign.md) — 부모-자식 위계 패턴 선례
