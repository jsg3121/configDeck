# SPEC-0006 Advisory 랜딩 페이지 시리즈 — UI 시안

> 이 폴더는 SPEC-0006 "프레임워크 보안 권고(Advisory) 이벤트성 랜딩 페이지 시리즈"의 HTML 시안(모킹)을 보관한다.
> Astro/Svelte 실제 코드 적용 전 사용자 검토용이며, **이 단계에서는 `src/` 하위 코드를 수정하지 않는다**.

## 시안 의도

- SPEC-0006 §0~§11 와이어프레임을 정적 HTML로 즉시 시각화
- ConfigDeck 기존 색상 토큰(`--color-primary`, `--color-border`, `--color-surface-alt` 등)을 인라인 `@theme`으로 재현해 실제 적용 시의 분위기를 미리 확인
- 진단기 4상태(IDLE / AFFECTED / SAFE / ERROR) + 비활성(DISABLED) 상태를 모두 표현
- sunset 정책(active / stale / superseded) 시각 분기 검증
- vanilla JS만 사용해 인터랙션을 시연(필터, 진단기, 탭). Svelte는 코드 적용 단계에서 분리 작성

## 파일 목록

| 파일 | 화면 | 시연 내용 |
|------|------|---------|
| `A-catalog.html` | A. 부모 카탈로그 (데스크톱) | `/ko/advisory` — 시리즈 헤더, 필터(심각도/패키지/상태) + 정렬, advisory 카드 4건(Critical/High/Medium/Stale), 빈 상태 데모, 클라이언트 JS 필터링 + URL 동기화 |
| `A-catalog-mobile.html` | A. 부모 카탈로그 (모바일) | 768px 미만. 가로 스크롤 칩 필터 3행, 단일 컬럼 카드 |
| `B-detail-active.html` | B. 자식 상세 (active, ko) | CVE-2025-29927. 7섹션 모두 + 진단기 idle. 배너 없음. JSON-LD(Article + BreadcrumbList) + OG 태그 시연 |
| `B-detail-active-mobile.html` | B. 자식 상세 (active, 모바일) | 동일 콘텐츠의 모바일 와이어프레임. 영향 범위 표 가로 스크롤 |
| `B-detail-stale.html` | B. 자식 상세 (stale) | 상단 STALE 배너 + 본문 동일 + 진단기 활성 |
| `B-detail-superseded.html` | B. 자식 상세 (superseded) | SUPERSEDED 배너 + 후속 advisory 링크. 진단기 비활성(disabled). `<link rel="canonical">`이 후속 URL |
| `B-detail-active-en.html` | B. 자식 상세 (active, en) | 영어 로케일 시연. i18n 패턴 + hreflang 검증용 |
| `C-diagnosis-states.html` | C. 진단기 4상태 갤러리 | IDLE/AFFECTED/SAFE/ERROR 4 카드 + 인터랙티브 진단기 1개 + package.json 탭 시연 |

## 검토자가 시안을 여는 방법

**옵션 1: 파일 직접 열기 (가장 간단)**
1. Finder/탐색기에서 `.claude/ui-mockups/SPEC-0006/` 폴더 열기
2. `A-catalog.html` 더블클릭 → 기본 브라우저에서 `file://` 프로토콜로 열림
3. 페이지 내 링크는 모두 같은 폴더의 다른 시안 파일로 이동(상대경로)

**옵션 2: 로컬 정적 서버 (외부 폰트/Tailwind CDN 안정성 차이가 있는 경우)**
```bash
cd .claude/ui-mockups/SPEC-0006
python3 -m http.server 4173
# 브라우저에서 http://localhost:4173/A-catalog.html 접속
```

> Tailwind v4 Play CDN(`<script src="https://cdn.tailwindcss.com">`)을 사용한다. 이는 시안 전용이며 실제 코드 적용 시에는 제거된다.

## 검토 체크리스트 (사용자 점검 항목)

1. **severity 배지 색상·라벨·aria-label**: 색상만으로 의미 전달하지 않는지(WCAG 1.4.1). 영어 라벨 + 한국어 aria-label 동시 노출 확인
2. **sunset 배너 위치**: breadcrumb 아래 / `<h1>` 위. active 시 빈 div 없는지(superseded/stale 파일과 비교)
3. **면책조항 상시 표기**: 진단기 idle/affected/safe/error/disabled 모든 상태에서 노출 확인
4. **카탈로그 필터**: 심각도/패키지/상태 토글 → URL `?severity=critical` 동기화 확인. "필터 초기화" 동작
5. **영향 범위 표 모바일 가로 스크롤**: `B-detail-active-mobile.html`에서 표가 가로로 스크롤되는지
6. **superseded canonical**: `B-detail-superseded.html` `<head>` 안에 `<link rel="canonical">`이 후속 advisory URL로 설정되어 있는지
7. **진단기 인터랙션**: `C-diagnosis-states.html` 입력 시연 — `14.2.20` (AFFECTED), `15.2.5` (SAFE), `14.abc` (ERROR), 빈값(IDLE 유지)
8. **JSON-LD/OG 태그**: `B-detail-active.html` `<head>` 안 Article + BreadcrumbList JSON-LD, og:title/og:description/og:type=article

## 디자인 결정 / 시각 톤

| 항목 | 시안 결정 |
|------|----------|
| 컨테이너 폭 | 카탈로그 `max-w-7xl`, 자식 본문 `max-w-4xl` (기존 ConfigDeck 패턴 유지) |
| 폰트 | Inter (시안에서는 시스템 폴백) |
| 색상 | `--color-primary: #3b82f6`, `--color-border: #e2e8f0` 등 `src/styles/global.css` 토큰 재현 |
| Critical 배지 | `bg-red-100 text-red-800` |
| High 배지 | `bg-orange-100 text-orange-800` |
| Medium 배지 | `bg-yellow-100 text-yellow-800` |
| Low 배지 | `bg-blue-100 text-blue-800` |
| Stale 배너 | 좌측 4px amber 보더 + `bg-amber-50` |
| Superseded 배너 | 좌측 4px blue 보더 + `bg-blue-50` |
| Archived 배너 | 좌측 4px neutral 보더 + `bg-gray-100` |
| 진단기 affected | `bg-red-50 border-red-200` |
| 진단기 safe | `bg-green-50 border-green-200` |
| 진단기 error | `bg-gray-50 border-gray-200` |

## 다음 단계 (Astro/Svelte 코드 적용 시 주의사항)

1. **Svelte 아일랜드 분리**: 시안의 vanilla JS 부분은 코드 적용 시 다음 단위로 분리한다.
   - `AdvisoryDiagnosis.svelte` — 진단기 (입력 + 4상태 결과 + 면책조항)
   - `AdvisoryFilter.svelte` — 카탈로그 필터 + 정렬 + URL 파라미터 동기화
   - 정적 부분(severity 배지, sunset 배너, references 목록 등)은 모두 `.astro` 유지
2. **시안 클래스 → 디자인 토큰**: 시안에서 `bg-red-100`처럼 직접 색상 클래스를 썼다. 코드 적용 시에는 `severity` 키 → 클래스 매핑을 단일 함수(`getSeverityClasses(severity)`)로 추출해 카드와 배지 모두에서 재사용한다(SPEC-0006-design §9.2 `SeverityBadge.astro`).
3. **JSON-LD/OG**: 시안의 `<head>` 메타는 시연용이며, 실제 적용 시 `Layout.astro`의 `jsonLd`/`ogImage` props로 전달한다. 기존 `cursor.astro`의 패턴 동일 적용.
4. **canonical 처리**: superseded 시안에 시연한 `<link rel="canonical">` 후속 URL 설정은 `Layout.astro`가 `canonicalUrl` prop을 지원하는지 먼저 확인 후, 없으면 `Layout.astro` 수정이 선행된다(SPEC-0006-design §11-7).
5. **i18n 카피**: 시안의 한국어 문자열은 시연용 직접 작성이다. 코드 적용 시 `src/i18n/locales/ko.json`에 `advisory.*` 네임스페이스로 추출한다.
6. **콘텐츠 데이터**: 시안의 `advisory` JS 객체는 시연용. 코드 적용 시 Astro Content Collections(`src/content/advisory/{ko,en}/{slug}.mdx`) frontmatter에서 `getEntry()`로 읽는다(ADR-0020).
7. **진단기 hydration**: `client:load`로 즉시 hydration. `affected[].range` 배열을 props로 받아 `semver/functions/satisfies` 호출.
8. **빌드 타임 다국어 frontmatter 일치 검증**: ADR-0020 §결과/후속 조치에 따라 동일 slug의 ko/en 진단 룰셋 필드 일치 검사 로직이 추가되어야 한다. 시안 단계에서는 시연만.

## 변경 이력

| 날짜 | 변경 | 사유 |
|------|------|------|
| 2026-05-09 | 초안 8개 HTML 시안 작성 | SPEC-0006-design 기반, 사용자 검토용 |
| 2026-05-10 | 사용자 검토 승인 → 실제 Astro/Svelte 코드 적용 | 진단기 상단 부각·탭 세그먼티드 컨트롤·코드 블록 가독성 등 시안 합의분 그대로 반영 |

## 적용 코드 경로

| 시안 파일 | 적용 경로 |
|----------|----------|
| `A-catalog.html`, `A-catalog-mobile.html` | `src/pages/[locale]/advisory/index.astro` (+ `AdvisoryFilter.svelte`, `AdvisoryCard.astro`) |
| `B-detail-active.html`, `B-detail-active-mobile.html`, `B-detail-active-en.html` | `src/pages/[locale]/advisory/[slug].astro` |
| `B-detail-stale.html` | 동일 [slug].astro + `SunsetBanner.astro`(stale 분기) |
| `B-detail-superseded.html` | 동일 [slug].astro + `SunsetBanner.astro`(superseded) + `Layout.astro` `canonicalUrl` prop |
| `C-diagnosis-states.html` | `src/components/advisory/AdvisoryDiagnosis.svelte` |
| 콘텐츠 데이터 (시안의 `advisory` JS 객체) | `src/content/advisory/{ko,en}/nextjs-cve-2025-29927.md` (frontmatter affected/patched/...) |
| 빌드 타임 다국어 일관성 검증 | `src/lib/data/advisory/validateLocaleConsistency.ts` |
