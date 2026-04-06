# conventions/

프로젝트의 코딩 규칙과 스타일링 가이드라인을 정의하는 폴더이다.

## 이 폴더의 역할

- 에이전트가 코드를 작성할 때 프로젝트의 일관성을 유지하도록 명시적 규칙을 제공한다
- 모든 규칙에는 "왜 그런지(Why)"를 함께 설명하여, 엣지 케이스에서도 올바른 판단이 가능하도록 한다
- 규칙의 출처(공식 문서, 스타일 가이드 등)를 명시한다

## 폴더 구조

- `index.md` — 이 파일. 폴더 역할 설명 및 가이드 목록
- `guides/` — 실제 컨벤션 가이드 문서 보관
- `templates/` — PR 템플릿 등 재사용 가능한 템플릿 보관

## 가이드 목록

- [coding.md](guides/coding.md) — TypeScript, Astro, Svelte 코딩 규칙, 네이밍, 디렉토리 구조
- [styling.md](guides/styling.md) — Tailwind CSS 사용 규칙, 반응형 전략, 디자인 토큰
- [linting.md](guides/linting.md) — Prettier, ESLint 설정, import 정렬 규칙
- [workflow.md](guides/workflow.md) — 브랜치 전략, 버전 관리, 커밋 메시지, PR 규칙
- [rendering.md](guides/rendering.md) — SSG/SSR 렌더링 전략, 페이지별 렌더링 모드, SEO 영향
