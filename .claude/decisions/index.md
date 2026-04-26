# decisions/

프로젝트의 주요 의사결정을 ADR(Architecture Decision Record) 형식으로 기록하는 폴더이다.

## 이 폴더의 역할

- 기술 스택, 아키텍처, 도구 선택 등 프로젝트의 주요 의사결정과 그 근거를 기록한다
- 에이전트는 개발 작업 전 이 폴더의 ADR을 참조하여 프로젝트의 결정 맥락을 파악한다
- 새로운 의사결정이 필요할 때 `template.md`를 기반으로 ADR을 작성한다

## 폴더 구조

- `index.md` — 이 파일. 폴더 역할 설명 및 ADR 목록
- `template.md` — 새 ADR 작성 시 사용하는 템플릿
- `records/` — 실제 ADR 문서 보관

## 규칙

- 파일명: `ADR-{번호}-{간략한-논의주제}.md` (예: `ADR-0001-adr-adoption.md`)
- 번호: 4자리 zero-padding (0001, 0002, ...)
- 상태: 제안됨 → 승인됨 / 폐기됨 / 대체됨
- ADR에는 참고 자료(공식 문서, 신뢰할 수 있는 블로그 등) 링크를 포함한다

## ADR 목록

| 번호                                                      | 제목                                              | 상태   | 날짜       |
|-----------------------------------------------------------|---------------------------------------------------|--------|------------|
| [0001](records/ADR-0001-adr-adoption.md)                  | ADR 도입                                          | 승인됨 | 2026-04-06 |
| [0002](records/ADR-0002-framework.md)                     | 프레임워크 선택 (Astro + Svelte)                  | 승인됨 | 2026-04-06 |
| [0003](records/ADR-0003-package-manager.md)               | 패키지 매니저 선택 (pnpm)                         | 승인됨 | 2026-04-06 |
| [0004](records/ADR-0004-deployment.md)                    | 배포 환경 선택 (Cloudflare Pages)                 | 승인됨 | 2026-04-06 |
| [0005](records/ADR-0005-share-link.md)                    | 공유 링크 (URL 기반 옵션 인코딩)                  | 승인됨 | 2026-04-06 |
| [0006](records/ADR-0006-generator-centric-ia.md)          | 생성기 중심 IA 재설계                             | 승인됨 | 2026-04-06 |
| [0007](records/ADR-0007-page-structure-redesign.md)       | 페이지 구조 재설계 (파일/스택별 생성기 통합)      | 승인됨 | 2026-04-06 |
| [0008](records/ADR-0008-option-schema-redesign.md)        | 옵션 스키마 재설계 (입력 타입/옵션 정의 분리)     | 승인됨 | 2026-04-09 |
| [0009](records/ADR-0009-stack-generator-ux-pattern.md)    | 스택 생성기 UX 패턴 선정 (아코디언 인라인 옵션)   | 승인됨 | 2026-04-13 |
| [0010](records/ADR-0010-article-content-strategy.md)      | 아티클 콘텐츠 수집 및 갱신 전략                   | 승인됨 | 2026-04-13 |
| [0011](records/ADR-0011-article-ai-summarization.md)      | 아티클 AI 요약 자동화 전략 (Gemini API)           | 승인됨 | 2026-04-13 |
| [0012](records/ADR-0012-create-pr-validation-optional.md) | create-pr 스킬 검증 단계 선택적 실행              | 승인됨 | 2026-04-14 |
| [0013](records/ADR-0013-article-ai-tool-evaluation.md)    | 아티클 AI 요약 도구 평가 및 전환 검토             | 제안됨 | 2026-04-15 |
| [0014](records/ADR-0014-growth-strategy-roadmap.md)       | 서비스 성장 전략 및 통합 로드맵                   | 승인됨 | 2026-04-24 |
| [0015](records/ADR-0015-article-source-diversity.md)      | 아티클 소스 다양성 확보 전략 (디우선순위)         | 승인됨 | 2026-04-26 |
