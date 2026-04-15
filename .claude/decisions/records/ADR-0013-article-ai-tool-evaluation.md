# ADR-0013: 아티클 AI 요약 도구 평가 및 전환 검토

- 상태: 제안됨
- 날짜: 2026-04-15
- 의사결정자: jsg3121, Claude

## 맥락 (Context)

ADR-0011에서 Gemini API를 사용한 아티클 AI 요약 자동화를 결정했다. 현재 GitHub Actions + Gemini API 조합으로 매일 자동 실행되고 있으나, 다음 이슈가 발생했다:

1. **GitHub Actions schedule 지연/누락**: 매시 정각(0분) 스케줄은 부하가 높아 지연되거나 드롭될 수 있음 (GitHub 공식 문서 확인)
2. **PR 생성 로직 충돌**: 직접 branch push와 `peter-evans/create-pull-request` 액션이 서로 다른 브랜치를 사용하여 충돌
3. **콘텐츠 품질**: Gemini 생성 결과물의 줄바꿈, 코드블록 등 포맷팅이 일관되지 않음

이에 Claude Cloud 스케줄(Max 플랜 포함)로 전환을 검토하게 되었다.

## 결정 (Decision)

**GitHub Actions + Gemini API 구조를 유지하되, Claude Cloud 스케줄을 병행 테스트한다.**

테스트 기간(약 1주) 동안 두 방식의 결과물 품질을 비교한 후 최종 결정한다.

### 즉시 적용 (GitHub Actions 개선)

1. 크론 시간을 정각에서 이동: `0 0 * * *` → `37 23 * * *` (KST 08:37)
2. PR 생성 로직 단일화: `peter-evans/create-pull-request`로 통합
3. RSS 피드 균등 분배: Round-robin 방식으로 각 도구에서 균등하게 선택
4. 2026년 이후 게시글만 필터링

### 병행 테스트 (Claude Cloud 스케줄)

- 동일 시간대에 Claude Cloud 스케줄 설정
- 결과물 품질(포맷팅, 요약 정확도) 비교
- 운영 편의성(모니터링, 디버깅) 비교

## 근거 (Rationale)

### Claude Cloud 스케줄 검토 이유

| 항목 | GitHub Actions + Gemini | Claude Cloud 스케줄 |
|------|------------------------|---------------------|
| 비용 | 무료 (Gemini 무료 티어) | Max 플랜에 포함 |
| 요약 품질 | 양호 | 포맷팅 더 일관됨 (테스트 결과) |
| 유지보수 | 스크립트 관리 필요 | 자연어 프롬프트 |
| 실행 환경 | GitHub 서버 | Anthropic 클라우드 |
| 모니터링 | Actions 탭 | claude.ai/code/scheduled |

### Max 플랜과 API의 관계

- **Max 플랜**: Claude Code CLI, claude.ai 사용량 포함
- **Claude API**: 별도 종량제 과금 (Max 플랜과 독립)
- **Claude Cloud 스케줄**: Max 플랜에 포함 (추가 비용 없음)

GitHub Actions에서 `@anthropic-ai/sdk`로 API 호출 시 별도 비용이 발생하므로, Claude를 사용하려면 Cloud 스케줄 방식이 비용 효율적이다.

## 대안 (Alternatives Considered)

| 대안 | 불채택 사유 |
|------|------------|
| GitHub Actions + Claude API | API 호출은 Max 플랜과 별도 과금 (월 ~$2.5 추가) |
| Desktop 스케줄 | 로컬 머신이 켜져 있어야 함 |
| /loop (세션 스케줄) | 세션 종료 시 작업 사라짐, 재시작 시 지속 불가 |
| Gemini 유지 (변경 없음) | GitHub Actions 스케줄 이슈 해결 필요, 포맷팅 품질 개선 여지 |

## 결과 (Consequences)

### 즉시

- [x] GitHub Actions 워크플로 개선 (크론 시간, PR 로직)
- [x] RSS 피드 3개 추가 (web.dev, Tailwind CSS, Vite)
- [x] 균등 분배 로직 구현
- [ ] Claude Cloud 환경 설정 (https://claude.ai/code 에서 수동 설정 필요)

### 테스트 후 결정 예정

- 품질 비교 결과에 따라 ADR-0011 대체 또는 현행 유지 결정
- 전환 시 GitHub Actions 워크플로 비활성화 또는 삭제

## 참고 자료 (References)

- [GitHub Actions schedule 이벤트](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule) — 정각 혼잡, 지연/드롭 가능성 명시
- [Claude Code 웹 스케줄 작업](https://code.claude.com/docs/ko/web-scheduled-tasks) — Cloud 스케줄 동작 방식
- [Anthropic 과금 정책](https://support.claude.com/en/collections/5370014-billing) — Max 플랜과 API 별도 과금 확인
