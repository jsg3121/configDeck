---
id: SPEC-0006
title: 프레임워크 보안 권고(Advisory) 이벤트성 랜딩 페이지 시리즈
status: 검토 중
owner: jsg3121
created: 2026-05-09
updated: 2026-05-09
related_adrs:
  - ADR-0019  # AI Config IA 재설계 — 부모-자식 위계 정신 적용 근거
related_specs:
  - SPEC-0002  # 개발 도구 아티클 페이지 — 콘텐츠 컬렉션 패턴 선례
---

# SPEC-0006: 프레임워크 보안 권고(Advisory) 이벤트성 랜딩 페이지 시리즈

## 1. 배경 (Background)

### 1.1 현재 상태

ConfigDeck 1.5.x 기준으로 주요 콘텐츠 채널은 다음 두 가지이다:

- **설정 파일 생성기** (`/generator/{file}`, `/generator/{stack}`): 도구별 설정 파일 조합·다운로드
- **아티클 페이지** (`/article/{tool}`): RSS 기반 개발 도구 업데이트 요약

보안 취약점(CVE)이나 프레임워크 메이저 릴리즈가 발생할 때 개발자가 "내 프로젝트가 영향받는가"를 즉시 확인할 수 있는 페이지가 없다. 사용자는 GHSA, NVD, Snyk 블로그 등 영어 자료를 개별적으로 탐색하거나, 권위 부족한 개인 블로그에 의존하는 상황이다.

### 1.2 문제점

1. **한국어 가이드 공백**: GHSA, Snyk 블로그, Datadog Security Labs는 영어 중심이며 인터랙티브 진단 기능이 없다. 한국어 개발자는 개인 블로그의 단편적·비권위적 자료에 의존한다. (RES-0004 §1-2 참조)
2. **"내 버전이 영향받는가" 즉시 확인 불가**: 현재 모든 주요 advisory 사이트는 텍스트 가이드만 제공하며, 사용자가 자신의 패키지 버전을 직접 semver 범위와 대조해야 한다.
3. **본 서비스 트래픽 흡수 기회 미활용**: CVE 발행 직후 1~3주 내 트래픽 피크가 발생하지만, ConfigDeck은 이 시점성 수요를 포착할 콘텐츠가 없다. advisory 페이지가 본 서비스(`/ai-config`, 생성기)로의 유입 채널이 될 수 있다.

### 1.3 사용자 요구

- CVE 발행 직후 "Next.js CVE-2025-29927 fix" 등의 검색어로 유입되는 개발자가 한국어로 영향 여부를 빠르게 확인하고 싶어 한다.
- 검색 후 단일 페이지에서 취약점 개요 → 버전 진단 → 패치 안내 → 후속 도구 접근까지 완료하고 싶다.
- STR-0002 성장 전략에서 정의한 "SEO 랜딩을 통한 본 서비스 유입" 패턴을 advisory 영역으로 확장한다.

> **Why:** RES-0004 §1-2에서 확인된 것처럼, "특정 CVE/메이저 릴리즈 단위의 한국어 한 페이지 가이드 + 단발 진단기"는 현재 어떤 도구도 제공하지 않는 빈자리다. ConfigDeck은 기존 i18n 인프라와 Svelte 아일랜드 패턴을 보유하고 있어 구현 비용이 낮다.

---

## 2. 목표 (Goals)

### 2.1 달성하려는 것 (In Scope)

**Phase A — 시스템 구축 + PoC 1건 (이 SPEC의 범위)**:

- `/advisory` 부모 카탈로그 페이지 신설 (advisory 목록, 심각도 필터)
- `/advisory/{slug}` 자식 advisory 페이지 패턴 구축
- Astro Content Collections + Zod 기반 advisory 스키마 정의
- Svelte 아일랜드 진단기 컴포넌트 (`AdvisoryDiagnosis`) 구현
- PoC 대상: **CVE-2025-29927** (Next.js 미들웨어 인증 우회, CVSS 9.1) 1건 — 영어/한국어 동시 출시
- sunset 정책 적용 (상태 배너, outdated 처리)
- 법적 고지 처리 (출처 표기, 면책 조항)
- 자식 페이지 CTA로 본 서비스(`/ai-config`, 생성기) 연결

**Phase B — 1차 확장 (별도 일정)**:

- React 19 마이그레이션 advisory (메이저 릴리즈 유형 첫 케이스)
- CVE-2024-46982 등 2~3건 추가
- 마이그레이션 advisory 전용 섹션 (Before/After 코드 비교, codemod 명령어 안내) 패턴 확립

### 2.2 다루지 않는 것 (Out of Scope)

- **상시 패키지 취약점 스캐너**: Snyk, Dependabot, npm audit 대체 도구. ConfigDeck은 보완재다
- **PoC 코드 직접 실행**: 취약점 재현용 코드를 포함하거나 실행하는 기능 없음
- **자동 CVE 수집 파이프라인**: advisory는 편집자가 수동으로 작성. 자동화는 Phase B 이후 검토
- **일본어 advisory**: ConfigDeck 전체 i18n 확장 시점에 함께 추가
- **파일 업로드 방식 진단기**: 보안 표시 복잡성 대비 효용이 낮음. Phase B에서 재검토

> **Why Out of Scope:** 상시 스캐너는 CI/IDE 통합 SaaS 시장이며 ConfigDeck의 포지션과 다르다. 자동화 파이프라인은 PoC 패턴 검증 후 운영 부담을 평가한 뒤 도입한다. 일본어는 전체 i18n 확장 로드맵에 귀속시켜 일관성을 유지한다.

---

## 3. 제안 (Proposal)

### 3.1 개요

`/advisory` 섹션을 ConfigDeck IA의 독립 콘텐츠 채널로 신설한다. ADR-0019에서 확립한 부모-자식 위계 패턴을 그대로 적용한다: `/advisory`는 카탈로그 허브(개요·목록), `/advisory/{slug}`는 advisory별 상세 페이지다.

콘텐츠는 Astro Content Collections로 관리하며, frontmatter에 GHSA/OSV 표준 필드를 매핑한다. `affected[].range` 필드가 진단 룰셋의 단일 진실의 원천(single source of truth)이 되어, 별도 룰 파일 없이 콘텐츠와 진단 결과가 항상 일치한다.

자식 advisory 페이지 하단에는 ConfigDeck 생성기와 `/ai-config`로 진입하는 CTA를 배치해, "취약점 대응 → 환경 재정비"로 이어지는 사용자 플로우를 연결한다.

### 3.2 URL 구조 결정

**채택: `/advisory/{slug}`** (1순위)

| 후보 | 장점 | 단점 | 결정 |
|---|---|---|---|
| `/advisory/{slug}` | 도구 중립적, 보안 CVE·마이그레이션 가이드 모두 수용, 검색 의도 명확 | 없음 | **채택** |
| `/security/{slug}` | 보안 CVE에 특화된 어감 | 마이그레이션 같은 비-보안 이슈 수용 어색, 혼동 여지 | 불채택 |
| `/guides/{slug}` | 범용성 높음 | advisory 고유성 희석, 기존 아티클 채널과 구분 불명확 | 불채택 |

다국어 URL은 ConfigDeck i18n 정책(`prefixDefaultLocale: true`)에 따라 `/en/advisory/{slug}`, `/ko/advisory/{slug}` 형태로 생성된다.

### 3.3 IA 구조

```
/{locale}/advisory                          # 부모: 카탈로그 허브
└── /{locale}/advisory/{slug}              # 자식: advisory별 상세
    예: /en/advisory/nextjs-cve-2025-29927
        /ko/advisory/nextjs-cve-2025-29927
```

**ADR-0019 위계 정신 적용**:
- 부모(`/advisory`): 카탈로그·개요 역할 — advisory 목록, 심각도 필터, 최신 advisory 하이라이트
- 자식(`/advisory/{slug}`): 상세 역할 — 취약점 정보, 진단기, 패치 안내, 출처, CTA

ConfigDeck 기존 IA에서 `/advisory`는 `/article`과 동위의 독립 콘텐츠 섹션으로 위치한다:

```
/{locale}
├─ /generator         # 설정 파일 생성기
├─ /ai-config         # AI 도구 설정 카탈로그
├─ /article           # 개발 도구 아티클
└─ /advisory          # 프레임워크 보안 권고 (신규)  ← 이 SPEC
```

### 3.4 콘텐츠 스키마

Astro Content Collections의 `src/content/advisory/` 컬렉션을 신설한다. Zod 스키마는 GHSA/OSV 표준 필드를 매핑하되, 진단 룰셋(`affected[].range`)을 frontmatter에 포함하여 단일 진실의 원천을 확보한다.

**frontmatter 스키마 (필드 정의)**:

| 필드 | 타입 | 필수 | 설명 | GHSA 대응 필드 |
|---|---|---|---|---|
| `cveId` | `string` | 선택 | CVE 식별자 (예: CVE-2025-29927) | CVE ID |
| `ghsaId` | `string` | 선택 | GitHub Security Advisory ID | GHSA ID |
| `title` | `string` | 필수 | advisory 제목 (영어 기준) | Summary |
| `type` | `"cve" \| "migration"` | 필수 | advisory 유형. cve: 보안 취약점, migration: 메이저 릴리즈 마이그레이션 | — |
| `severity` | `"low" \| "medium" \| "high" \| "critical"` | 필수 | CVSS 심각도 분류 | Severity |
| `cvssScore` | `number` | 선택 | CVSS 점수 (0.0 ~ 10.0). migration 유형은 생략 | CVSS Score |
| `ecosystem` | `"npm"` | 필수 | 패키지 생태계. 현재 npm 한정 | Ecosystem |
| `package` | `string` | 필수 | 영향받는 패키지명 (예: `next`) | Package |
| `affected` | `{ range: string }[]` | 필수 | semver 영향 범위 목록. 진단기의 단일 진실의 원천 | Affected Versions |
| `patched` | `string[]` | 필수 | 패치된 버전 목록 | Patched Versions |
| `publishedAt` | `date` | 필수 | advisory 최초 게시일 | Published |
| `updatedAt` | `date` | 필수 | advisory 최종 갱신일. SEO dateModified와 동기화 | Updated |
| `status` | `"active" \| "stale" \| "superseded" \| "archived"` | 필수 | 수명 주기 상태 (§3.7 참조) | — |
| `sunsetAt` | `date` | 선택 | 자동 stale 전환 기준일 (optional, 빌드 자동 처리용) | — |
| `cwe` | `string[]` | 선택 | CWE 식별자 목록 (예: `["CWE-285", "CWE-863"]`) | Weaknesses |
| `epss` | `number` | 선택 | EPSS 악용 가능성 점수 (0.0 ~ 1.0) | EPSS |
| `credits` | `{ name: string, url?: string }[]` | 선택 | 발견자·기여자. GHSA credits에서 인용 | Credits |
| `references` | `{ label: string, url: string }[]` | 필수 | 참고 자료 목록 (GHSA, NVD, 공식 패치 PR 등) | References |

### 3.5 다국어 파일 구조

ConfigDeck 기존 아티클 컬렉션은 `src/content/articles/{locale}/{slug}.md` 구조다(로케일 폴더 분리 패턴). advisory 컬렉션도 동일한 패턴을 따른다.

**채택: 로케일별 폴더 분리** (`src/content/advisory/{locale}/{slug}.md`)

```
src/content/advisory/
├── en/
│   └── nextjs-cve-2025-29927.mdx    # 영어 advisory 본문
└── ko/
    └── nextjs-cve-2025-29927.mdx    # 한국어 번역·재가공 본문
```

| 방식 | 장점 | 단점 | 결정 |
|---|---|---|---|
| 로케일별 폴더 (`en/{slug}.md`, `ko/{slug}.md`) | 기존 articles 컬렉션과 완전 일관성. 파일당 하나의 책임. Astro glob loader 패턴 재사용 | 언어 간 누락 파일 수동 체크 필요 | **채택** |
| 별도 파일 (`{slug}.en.md`, `{slug}.ko.md`) | 한 폴더에서 언어 쌍을 시각적으로 확인 가능 | 기존 패턴과 불일치. Astro 파일 라우팅과 어색 | 불채택 |
| 단일 파일 다중 필드 | 파일 수 최소화 | 본문 필드가 frontmatter에 혼재. MDX 렌더링 불가. 유지보수 어려움 | 불채택 |

frontmatter는 두 언어 파일이 공통으로 보유하되, `title`은 각 언어로 현지화한다. `affected`, `patched`, `status` 등 기술 필드는 영어 원본을 기준값으로 유지하고, 한국어 파일에서도 동일한 값을 사용한다.

> **Why:** 기존 articles 컬렉션 코드(`article.id.startsWith(`${locale}/`)`)가 로케일 폴더 구조를 전제로 구현되어 있다. advisory 컬렉션도 동일한 패턴을 따르면 `getStaticPaths` 로직을 그대로 재사용할 수 있고, 팀 전체가 파악하는 파일 규약이 일관성을 유지한다.

### 3.6 진단기 컴포넌트

Svelte 아일랜드 `AdvisoryDiagnosis` 컴포넌트를 advisory 페이지에 삽입한다.

**입력 방식**:
- **기본**: 버전 문자열 입력 (예: `14.2.20`) — 즉시 진단, 가장 낮은 마찰
- **옵션**: package.json 붙여넣기 — 클라이언트에서 JSON.parse로 해당 패키지 버전 추출 후 동일 진단

파일 업로드 방식은 이 SPEC 범위에서 제외한다. Phase B에서 재검토.

**진단 로직**:

frontmatter `affected[].range`를 진단 룰로 직접 사용한다. `semver/functions/satisfies` 단일 함수만 import한다.

진단 결과 출력:
- 영향받음: 심각도 배지 + 권장 패치 버전 + 즉시 조치 안내
- 영향 없음: 안전 확인 메시지 + 현재 버전 표시
- 확인 불가 (잘못된 버전 형식): 입력 오류 안내

면책 조항은 진단 결과 영역에 상시 표기한다:
> "이 진단 결과는 정보 제공 목적이며 무보증(AS IS)으로 제공됩니다. 실제 보안 위험 평가는 npm audit, Snyk, Dependabot 등의 공식 도구와 관리자 검토를 병행하세요."

### 3.7 콘텐츠 길이·깊이 표준

Snyk 블로그 수준의 구성을 기준으로 하되, 작성 비용과 한국어 가독성을 고려해 섹션을 다음으로 정의한다.

**CVE 유형 advisory 표준 섹션**:

1. **헤더 메타**: CVE ID, GHSA ID, 심각도 배지, CVSS 점수, 발행일, 최종 갱신일
2. **요약 (1~2문단)**: 취약점의 핵심과 영향을 비기술적 언어로 요약. 검색 유입자가 30초 내 판단 가능한 수준
3. **영향 범위**: 영향받는 버전 표 (semver 범위 + 패치 버전 명시)
4. **진단기**: 버전 입력 → 즉시 결과 (Svelte 아일랜드)
5. **취약점 메커니즘 (기술 배경)**: 작동 원리를 중간 수준 개발자가 이해할 수 있는 깊이로 설명. PoC 코드 직접 포함은 하지 않으며, 공식 PoC 저장소·분석 자료 링크 제공
6. **패치 및 해결 방안**: 버전별 패치 명령어, 임시 완화 방안 (있는 경우)
7. **참고 자료**: GHSA, NVD, 발견자 리포트, 공식 패치 PR 링크
8. **출처 및 면책 조항** (푸터): 데이터 라이선스 표기, 면책 문구

**마이그레이션 유형 advisory 추가 섹션** (CVE 유형 대체):

- "취약점 메커니즘" 대신: Breaking changes 목록 + Before/After 코드 비교
- "패치 및 해결 방안" 대신: codemod 명령어 + 수동 체크리스트

### 3.8 Sunset 정책

**상태 정의 및 처리**:

| 상태 | 조건 | 페이지 처리 | SEO |
|---|---|---|---|
| `active` | 신규 발행. 패치 정보가 현행 기준 유효 | 전체 콘텐츠 + 진단기 활성 | 정상 인덱싱, sitemap 포함 |
| `stale` | CVE 발행 후 약 6개월~1년 경과, 또는 편집자 판단 | 상단 배너: "이 가이드는 {updatedAt} 기준입니다. 최신 정보는 공식 advisory를 확인하세요." + 진단기 유지 | dateModified 유지, sitemap 포함 |
| `superseded` | 후속 CVE/메이저로 대체됨 | 상단 배너: 후속 advisory로 링크 안내 + 진단기 비활성 | `rel=canonical` → 후속 페이지, sitemap 포함 |
| `archived` | 영향 버전이 EOL | 콘텐츠 유지, 진단기 영역에 "이 버전은 EOL입니다" 표시 | sitemap 유지 |

**`noindex` 사용 금지**: Google Search Central에서 "단일 사이트 내에서 canonical 결정 목적으로 noindex를 쓰지 말 것"을 명시적으로 권고한다. ([Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) 참조)

**sunset 트리거 방식 결정**:

**채택: 수동 + 빌드 자동의 병행**

- **수동 전환 (기본)**: 편집자가 frontmatter `status` 필드를 직접 변경. 맥락 판단이 필요한 `superseded`, `archived` 상태 전환에 적합
- **빌드 자동 전환 (보조)**: `sunsetAt` 날짜가 지정된 경우, 빌드 시 현재 날짜와 비교해 `active → stale` 자동 전환. 편집자 개입 없이도 오래된 advisory에 stale 배너가 노출됨

| 방식 | 장점 | 단점 | 결정 |
|---|---|---|---|
| 수동 전환만 | 편집자 의도 반영, 구현 단순 | 오래된 advisory 방치 위험 | Phase A 기본 |
| 빌드 자동만 | 운영 부담 최소화 | 맥락 없는 자동 전환 위험 | 불채택 |
| 병행 | 자동으로 stale 처리 + 중요 상태는 수동 | 로직 추가 필요 | **채택** |

### 3.9 법적 고지

모든 advisory 페이지 푸터에 다음을 표기한다:

**데이터 출처 및 라이선스**:
```
Data sources:
- GitHub Advisory Database (CC-BY-4.0) — github.com/advisories
- National Vulnerability Database (Public Domain) — nvd.nist.gov
- MITRE CVE Program (royalty-free) — cve.mitre.org
```

Credits는 GHSA에서 인용하며 원본 링크를 포함한다.

면책 조항은 진단기 영역에 상시 표기(§3.6 참조).

### 3.10 사용자 플로우

```
(1) 검색 유입
    "Next.js CVE-2025-29927 fix", "Next.js 미들웨어 인증 우회" 등
        ↓
(2) /ko/advisory/nextjs-cve-2025-29927 페이지 도달
    헤더 메타(CVE ID, 심각도, 발행일) + 요약 → 30초 내 영향 여부 1차 판단
        ↓
(3) 진단기에 자신의 Next.js 버전 입력
    "14.2.20" 입력 → 즉시 결과: 영향받음 / 안전
        ↓
(4) 영향받는 경우: 패치 버전 안내 + npm install 명령어
    영향 없는 경우: 안전 확인 + 최신 버전 유지 권장
        ↓
(5) 페이지 하단 CTA
    "ConfigDeck으로 Next.js 설정 파일 업데이트하기" → /generator/next-config
    "AI 코딩 도구 설정도 점검하세요" → /ai-config
```

### 3.11 SEO 구성

- **JSON-LD**: `Article` 스키마 (datePublished, dateModified, author). advisory는 뉴스성 콘텐츠가 아니므로 `NewsArticle` 아님
- **BreadcrumbList**: Home → Advisory → {advisory 제목}
- **hreflang**: `/en/advisory/{slug}` ↔ `/ko/advisory/{slug}` 상호 참조
- **sitemap**: 모든 advisory의 모든 로케일 포함. `superseded` 상태도 제외하지 않음
- **dateModified**: frontmatter `updatedAt`과 동기화. 의미 있는 갱신 시에만 변경 (오타 수정으로 갱신 금지)

---

## 4. 근거 (Rationale)

- **`/advisory` URL 채택**: 도구 중립적이며 CVE·마이그레이션 두 유형을 자연스럽게 수용한다. `/security`는 마이그레이션 가이드에 어울리지 않는다. (RES-0004 §1 비교 분석)
- **부모-자식 위계**: ADR-0019에서 `/ai-config` 섹션으로 검증한 패턴. 카탈로그(부모)가 개요·진입점, 상세(자식)가 실제 콘텐츠를 담는 구조는 Nielsen Norman Group의 정보 아키텍처 원칙과 일치한다
- **로케일별 폴더 분리**: 기존 articles 컬렉션(`src/content/articles/{locale}/{slug}.md`)과 동일한 패턴. 코드 재사용 및 팀 규약 일관성 확보
- **단일 진실의 원천(frontmatter 진단 룰셋)**: 콘텐츠와 진단 로직을 분리하면 업데이트 시 불일치 위험이 발생한다. `affected[].range`를 frontmatter에서 직접 읽어 진단하면 이를 구조적으로 방지한다 (RES-0004 §3-4 참조)
- **noindex 금지**: Google Search Central 공식 가이드에서 "단일 사이트 내 canonical 결정 목적으로 noindex 사용 금지"를 명시한다. outdated advisory도 canonical을 유지하면 SEO 신뢰를 보존한다. ([참조](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls))
- **수동 + 자동 병행 sunset**: `stale` 자동 전환은 운영 부담을 낮추고, `superseded`/`archived`는 편집자 맥락 판단을 보존한다
- **semver 단일 함수 import**: `semver/functions/satisfies`만 import하면 Bundlephobia 기준 수 KB 수준으로 번들 최소화 가능. 진단기 컨텍스트에서 필요한 것은 이 함수 하나뿐이다 (RES-0004 §3-2 참조)
- **CVE-2025-29927 PoC 선택**: CVSS 9.1 (Critical), 2025년 3월 Next.js 생태계 최대 이슈. GHSA, NVD, Snyk 블로그가 모두 이미 문서화되어 있어 정보 수집 비용이 낮다. 한국어 자료가 부실해 SEO 공백이 크다

---

## 5. 대안 (Alternatives)

| 대안 | 설명 | 장점 | 단점 | 채택 여부 |
|---|---|---|---|---|
| `/security/{slug}` URL | 보안 특화 URL | 보안 CVE에 명확한 어감 | 마이그레이션 advisory 수용 어색, 혼동 가능 | 불채택 |
| `/guides/{slug}` URL | 범용 가이드 URL | 유연함 | 고유성 희석, 아티클과 구분 불명확 | 불채택 |
| 별도 파일 다국어 (`{slug}.en.md`) | 언어 쌍 가시성 | 한 폴더에서 관리 | 기존 articles 패턴 불일치, Astro glob 어색 | 불채택 |
| 단일 파일 다중 필드 | 파일 수 최소화 | 간결 | MDX 렌더링 불가, 본문 관리 어려움 | 불채택 |
| 빌드 자동 sunset만 | 운영 부담 최소화 | 자동화 | 맥락 없는 상태 전환 위험 | 불채택 |
| 진단기 없이 텍스트만 | 구현 단순 | 빠른 출시 | 경쟁 대비 차별점 소실. 핵심 가치 훼손 | 불채택 |

---

## 6. 실행 계획 (Execution Plan)

### 6.1 단계

| 단계 | 작업 | 산출물 | 선행 조건 |
|---|---|---|---|
| 1 | UX 설계: 부모 카탈로그 + 자식 advisory 페이지 와이어프레임 | 와이어프레임 문서 (`SPEC-0006-design.md`) | 이 SPEC 승인 |
| 2 | advisory 콘텐츠 스키마 정의 (`src/content.config.ts` 확장) | Zod 스키마 코드 | 1 |
| 3 | CVE-2025-29927 영어 advisory 작성 (`en/nextjs-cve-2025-29927.mdx`) | 영어 MDX 파일 | 2 |
| 4 | CVE-2025-29927 한국어 advisory 번역·재가공 (`ko/nextjs-cve-2025-29927.mdx`) | 한국어 MDX 파일 | 3 |
| 5 | Astro 라우팅: `/advisory` 부모 + `/advisory/{slug}` 자식 페이지 구현 | Astro 페이지 파일 | 2 |
| 6 | `AdvisoryDiagnosis` Svelte 아일랜드 구현 (버전 입력 + semver 비교 + 결과 출력) | Svelte 컴포넌트 | 2 |
| 7 | sunset 상태 배너 컴포넌트 구현 (Astro, 상태별 분기) | Astro 컴포넌트 | 5 |
| 8 | SEO 마크업: Article JSON-LD, BreadcrumbList, hreflang | 페이지별 메타 | 5 |
| 9 | i18n 카피 추가 (advisory 섹션용 한/영 UI 문자열) | `en.json`, `ko.json` | 5 |
| 10 | sitemap 설정 확인 (advisory 로케일별 포함 검증) | sitemap 설정 | 5 |
| 11 | QA: 진단기 정확성 검증, SEO 마크업, hreflang, sunset 배너 | QA 체크리스트 | 6, 7, 8 |
| 12 | 배포 및 Google Search Console 색인 요청 | 배포 완료 | 11 |

### 6.2 마일스톤

- **M1**: 콘텐츠 스키마 + 영어 advisory 1건 작성 완료 (단계 1~3)
- **M2**: 한국어 번역 + 라우팅 + 진단기 구현 완료 (단계 4~8)
- **M3**: QA 통과 + 배포 + Google 색인 요청 (단계 9~12)

### 6.3 확인 지점 (Checkpoints)

> 에이전트는 아래 지점에서 반드시 멈추고 사용자 승인을 받은 후 다음 단계를 진행한다.

- [ ] **CP-1**: SPEC-0006 승인 — 기획 내용 전체 확인 후 구현 착수 허가
- [ ] **CP-2**: UX 와이어프레임 (`SPEC-0006-design.md`) 검토 — 부모 카탈로그, 자식 advisory 페이지 레이아웃 확인
- [ ] **CP-3**: 영어 advisory 초안 검토 — CVE-2025-29927 콘텐츠의 정확성·깊이·법적 고지 확인
- [ ] **CP-4**: 진단기 동작 검증 — 버전 문자열 입력 시 영향 여부 정확성 확인 (경계 버전 포함)
- [ ] **CP-5**: 최종 QA 통과 확인 — SEO 마크업, hreflang, 면책 조항, sunset 배너 검증

---

## 7. 리스크 & 대응 (Risks & Mitigations)

| 리스크 | 영향 | 대응 방안 |
|---|---|---|
| CVE 정보 오류로 인한 사용자 오진단 | 높음 — 사용자가 안전한 버전을 취약하다고 오인하거나 반대 상황 발생 | frontmatter 진단 룰셋을 GHSA `affected` 필드와 1:1 대조해 검증. 면책 조항 상시 노출. CP-4에서 경계 버전 테스트 의무화 |
| Advisory 작성 후 패치 정보 변경 | 중간 — GHSA/NVD가 나중에 영향 범위를 수정하는 경우 발생 | `updatedAt` 필드를 갱신하고 수정 이력을 advisory 하단에 명시. 주요 업데이트 시 sitemap에서 dateModified 갱신 |
| 운영 부담 — 신규 advisory 작성 지연 | 중간 — CVE 발행 직후 트래픽 피크를 놓치면 SEO 효과 감소 | 작성 흐름 표준화 (§8 운영 절차). 영어 원본 먼저 발행 후 한국어 번역. 목표: CVE 발행 후 3~5일 내 발행 |
| 법적 책임 — 잘못된 진단으로 인한 클레임 | 낮음 — 면책 조항이 있으나 명시적 소송 위험은 낮음 | 면책 조항 진단기 영역 상시 표기. 출처 라이선스 푸터 표기. "공식 advisory에서 재확인" 링크 포함 |
| semver 번들 크기 | 낮음 — 단일 함수만 import 시 수 KB 수준 | `semver/functions/satisfies` 단일 import 규칙 준수. 추가 semver 함수 필요 시 사전 검토 |
| stale advisory SEO 신뢰 하락 | 낮음 — 오래된 콘텐츠가 낮은 신뢰 신호로 작용 가능 | `sunsetAt` 자동 stale 전환 + outdated 배너로 최신성 명확화. dateModified를 의미 있는 갱신 시에만 업데이트 |

---

## 8. 성공 지표 (Success Metrics)

- **SEO 색인**: PoC advisory 페이지(영어/한국어)가 Google Search Console에서 24~72시간 내 색인됨
- **검색 순위**: CVE-2025-29927 관련 한국어 검색어("Next.js 미들웨어 인증 우회" 등) 상위 10위 이내 진입 (6개월 기준)
- **진단기 사용**: 월 advisory 방문자 대비 진단기 사용률 30% 이상 (GA 또는 Plausible 측정)
- **본 서비스 유입 CTA 클릭**: advisory 페이지에서 생성기 또는 `/ai-config`로의 클릭률 5% 이상
- **운영 효율**: advisory 1건 작성·발행 공수가 3일 이내로 유지됨
- **법적 이슈**: 데이터 라이선스·면책 조항 관련 이슈 0건

---

## 9. 운영 절차 (신규 Advisory 추가)

Phase A 이후 신규 advisory 추가 시 표준 흐름:

1. **대상 선정**: GHSA/Snyk에서 npm 생태계 프레임워크 CVE (CVSS 7.0 이상) 또는 메이저 릴리즈 마이그레이션 이슈 모니터링
2. **영어 advisory 작성**: `src/content/advisory/en/{slug}.mdx` — GHSA/NVD 원본 기반, §3.7 표준 섹션 준수
3. **frontmatter 진단 룰셋 검증**: `affected[].range`를 GHSA 원본과 1:1 대조
4. **한국어 번역·재가공**: `src/content/advisory/ko/{slug}.mdx` — 영어 원본 기반 번역, 한국어 개발자 맥락 추가
5. **로컬 빌드 검증**: 진단기 경계 버전 테스트 (영향 범위 최솟값, 패치 버전 직전, 패치 버전 이후)
6. **배포 + Google Search Console 색인 요청**

---

## 10. 후속 작업 (Next Steps)

1. **UX 설계 위임** (우선): ux-designer 에이전트에게 `SPEC-0006-design.md` 작성 위임
   - 부모 카탈로그 와이어프레임 (advisory 목록, 심각도 필터 UX)
   - 자식 advisory 페이지 와이어프레임 (헤더 메타 → 요약 → 진단기 → 패치 안내 → CTA 배치)
   - 진단기 인터랙션 상태 (입력 전, 영향받음, 안전, 오류)
   - sunset 배너 디자인 (stale, superseded, archived 상태별)

2. **ADR로 기록할 기술 의사결정** (UX 설계 병행 또는 이후):
   - **advisory 콘텐츠 스키마 확정**: Zod 스키마 정의와 OSV 포맷 호환 수준 결정
   - **semver 라이브러리 선택**: `semver/functions/satisfies` vs `semver-ts` — 번들 크기·TypeScript 지원 비교 후 확정
   - **sunset 자동화 구현 방식**: 빌드 타임 날짜 비교 로직 위치 (Astro 페이지 vs Content Collection loader)

3. **구현 착수** (UX 설계 + ADR 작성 후): ui-publisher 에이전트에게 SPEC-0006 + SPEC-0006-design.md 전달

---

## 11. 참고 자료 (References)

- [RES-0004 프레임워크 보안 권고 랜딩 페이지 리서치](../../research/reports/RES-0004-framework-advisory-landing-2026-05.md) — 이 SPEC의 핵심 입력 문서
- [ADR-0019 AI Config IA 재설계](../../../decisions/records/ADR-0019-ai-config-ia-redesign.md) — 부모-자식 위계 패턴 선례
- [GHSA-f82v-jwr5-mffw](https://github.com/advisories/GHSA-f82v-jwr5-mffw) — CVE-2025-29927 GHSA 원본
- [NVD — CVE-2025-29927](https://nvd.nist.gov/vuln/detail/CVE-2025-29927) — NVD 원본
- [Snyk — CVE-2025-29927 Authorization Bypass in Next.js Middleware](https://snyk.io/blog/cve-2025-29927-authorization-bypass-in-next-js-middleware/) — 콘텐츠 구성 벤치마크
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) — 컬렉션 구현 레퍼런스
- [npm semver — 모듈러 import](https://www.npmjs.com/package/semver) — 단일 함수 import 패턴
- [Google Search Central — Consolidate duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) — noindex 금지 근거
- [Google Search Central — Article Schema](https://developers.google.com/search/docs/appearance/structured-data/article) — JSON-LD 마크업 기준
- [github/advisory-database](https://github.com/github/advisory-database) — CC-BY-4.0 라이선스 확인
- [ConfigDeck IA](../configDeckIA.md) — 서비스 전체 정보 구조

---

## 12. 변경 이력 (Changelog)

| 날짜 | 변경 내용 | 변경자 |
|---|---|---|
| 2026-05-09 | 초안 작성. RES-0004 기반, 사용자 합의 사항 전체 반영 | jsg3121 |
