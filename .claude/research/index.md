# research/

외부 조사 결과와 의사결정 근거 자료를 보관하는 폴더이다.

## 이 폴더의 역할

- 기술 비교, UI/UX 레퍼런스, 라이브러리 선택 등 리서치 보고서를 보관한다
- ADR이나 기획서에서 근거 자료로 참조한다 (예: `참고: .claude/research/reports/RES-0001-...md`)
- `/research` 스킬 실행 결과 중 보존이 필요한 보고서를 저장한다

## 폴더 구조

- `index.md` — 이 파일. 폴더 역할 설명 및 보고서 목록
- `reports/` — 실제 리서치 보고서 보관

## 규칙

### 파일명 접두사

| 접두사 | 용도                                          | 생성 에이전트       |
| ------ | --------------------------------------------- | ------------------- |
| `RES`  | 기술 리서치, UI/UX 레퍼런스 등 일반 조사      | `/research` 스킬    |
| `MI`   | 시장 조사 (시장 규모, 경쟁사, 트렌드)         | market-intelligence |
| `BA`   | 경쟁력 분석 (SWOT, 포지셔닝)                  | business-analyst    |
| `STR`  | 전략 보고서 (전략 옵션, 로드맵)               | strategy-planner    |
| `MKT`  | 마케팅/그로스 채널 전략 (유입, SEO, 커뮤니티) | `/research` 스킬    |

### 네이밍 규칙

- 파일명: `{접두사}-{번호}-{간략한-주제}.md` (예: `RES-0001-ui-ux-reference.md`, `MI-0001-config-generator-market.md`)
- 번호: 접두사별 독립 카운트, 4자리 zero-padding (0001, 0002, ...)
- 보고서에는 조사 일자, 참고 자료 URL을 반드시 포함한다
- 시간이 지나 내용이 무효화된 보고서는 상단에 `⚠️ 주의: 이 보고서는 {날짜} 기준이며, 최신 상태와 다를 수 있음`을 명시한다

## 보고서 목록

| 번호                                                                        | 제목                                          | 날짜       |
| --------------------------------------------------------------------------- | --------------------------------------------- | ---------- |
| [RES-0001](reports/RES-0001-ui-ux-reference.md)                             | ConfigDeck UI/UX 레퍼런스 분석                | 2026-04-06 |
| [RES-0002](reports/RES-0002-stack-generator-ux-patterns.md)                 | 스택 단위 설정 파일 생성기 UX 패턴 조사       | 2026-04-13 |
| [MI-0001](reports/MI-0001-configdeck-market-analysis.md)                    | ConfigDeck 시장 분석 (초기)                   | 2026-04    |
| [MI-0002](reports/MI-0002-competitor-analysis-2026-04.md)                   | ConfigDeck 경쟁사 분석                        | 2026-04    |
| [BA-0001](reports/BA-0001-configdeck-competitiveness.md)                    | ConfigDeck 경쟁력 분석 (초기)                 | 2026-04    |
| [BA-0002](reports/BA-0002-configdeck-competitiveness-2026-04.md)            | ConfigDeck 경쟁력 분석 (2026-04 재실행)       | 2026-04    |
| [STR-0001](reports/STR-0001-configdeck-strategy.md)                         | ConfigDeck 전략 보고서 (초기)                 | 2026-04    |
| [STR-0002](reports/STR-0002-configdeck-strategy-2026-04.md)                 | ConfigDeck 시장 진입 및 성장 전략             | 2026-04-24 |
| [MKT-0001](reports/MKT-0001-user-acquisition-channels-2026-04.md)           | ConfigDeck 사용자 유입 채널 전략              | 2026-04-29 |
| [RES-0003](reports/RES-0003-ai-tool-config-files-2026-04.md)                | AI 코딩 도구 설정 파일 생성기 시장 리서치     | 2026-04-30 |
| [RES-0004](reports/RES-0004-framework-advisory-landing-2026-05.md)          | 프레임워크 보안 권고 이벤트성 랜딩 도입 검증  | 2026-05-09 |
| [RES-0005](reports/RES-0005-article-seo-diagnosis-2026-05.md)               | Article 하위 페이지 SEO 진단                  | 2026-05-11 |
| [RES-0006](reports/RES-0006-ai-prompt-improvement-2026-05.md)               | AI 아티클 생성 프롬프트 개선 가이드           | 2026-05-11 |
