# skills/

프로젝트 전용 커스텀 스킬을 정의하는 폴더이다.

## 이 폴더의 역할

- 반복 작업이나 특화 워크플로우를 SKILL.md 기반으로 정의한다
- 슬래시 명령어(`/skill-name`)로 수동 호출하거나, description 기반 자동 트리거로 활성화된다
- 각 스킬은 독립 폴더에 SKILL.md와 지원 파일을 포함한다

## 폴더 구조

- `index.md` — 이 파일. 폴더 역할 설명 및 스킬 목록
- `{skill-name}/SKILL.md` — 스킬 정의 파일

## 스킬 목록

### 개발 워크플로우

- [research](research/SKILL.md) — 외부 정보 조사 및 의사결정 지원. 공식 문서 우선 탐색 후 보고서 형태로 정리 (자동 트리거)
- [create-pr](create-pr/SKILL.md) — PR 생성. 대상 브랜치 확인, 템플릿 기반 본문 작성, 라벨 자동 매핑 (수동 호출)
- [component-builder](component-builder/SKILL.md) — Astro/Svelte 컴포넌트 생성. 컨벤션과 디자인 패턴에 맞는 컴포넌트 스캐폴딩 (수동 호출)

### 품질 검증

- [lint-check](lint-check/SKILL.md) — Prettier/ESLint 전체 검사. 포맷팅 위반과 린트 에러를 검출하여 보고 (수동 호출)
- [code-review](code-review/SKILL.md) — PR 전 코드 리뷰. 서브에이전트로 사전 맥락 없이 이슈/개선점/타입 안전성 검증 (수동 호출)
- [a11y-check](a11y-check/SKILL.md) — 접근성(WCAG) 검사. 시맨틱 HTML, aria, 색상 대비, 키보드 내비게이션 검증 (수동 호출)
- [seo-audit](seo-audit/SKILL.md) — SEO 감사. 메타태그, 헤딩 구조, JSON-LD, hreflang 검사 (수동 호출)

### 테스트

- [test-writer](test-writer/SKILL.md) — Vitest 단위 테스트 작성. 설정 생성 로직, 유틸 함수의 테스트 코드 생성 (수동 호출)
- [e2e-test](e2e-test/SKILL.md) — Playwright E2E 테스트. 설정 생성기 플로우, SEO 랜딩 렌더링 검증 (수동 호출)
