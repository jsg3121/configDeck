# 개발 워크플로우 컨벤션

## 브랜치 전략

모든 작업 시작 전 현재 브랜치를 확인하고, 아래 규칙을 준수한다.

> **Why:** 브랜치를 버전 단위로 관리하면, 특정 버전에 포함된 변경사항을 명확히 추적할 수 있고, 릴리즈 단위의 롤백이 용이하다.

### 버전 관리

Semantic Versioning을 따른다: `MAJOR.MINOR.PATCH`

- 프로젝트 초기 단계이므로 `0.x.x`부터 시작한다
- `0.x.x`: 프로덕션 출시 전 개발 단계
- `1.0.0`: 첫 프로덕션 배포 시점

| 버전 | 변경 기준 | 예시 |
|------|----------|------|
| MAJOR (x.0.0) | 전체 구조 변경, 대규모 리디자인 | 아키텍처 전면 재설계 |
| MINOR (0.x.0) | 새 기능 추가, 페이지 신규 구현 | 생성기 페이지 추가, 프리셋 기능 |
| PATCH (0.0.x) | 버그 수정, 스타일 미세 조정, 오타 수정 | 다운로드 버그 수정 |

**참고:** [Semantic Versioning 2.0.0](https://semver.org/)

### 브랜치 네이밍

| 브랜치 | 규칙 | 예시 |
|--------|------|------|
| 메인 | `main` | 안정된 릴리즈 코드만 유지 |
| 버전 작업 | `feature/{version}` | `feature/0.1.0` |
| 하위 작업 | `feature/{version}` 에서 분기, 자유 네이밍 | `feature/0.1.0-generator-ui` |

### 워크플로우

```
main ─────────────────────────────────── ● (v0.1.0 태그)
  │                                        ↑
  └─ feature/0.1.0 ──────────────────── PR & 머지
       │         ↑         ↑
       ├─ 하위A ─┘         │
       └─ 하위B ───────────┘
```

1. 현재 브랜치를 확인한다
2. `main` 브랜치라면 신규 버전 브랜치 생성을 확인 요청한다
3. 새 버전 작업 시작: `main`에서 `feature/{version}` 브랜치를 생성한다
4. 세부 작업은 `feature/{version}`에서 하위 브랜치를 분기하여 진행한다
5. 하위 작업 완료 시 `feature/{version}`으로 PR & 머지한다
6. 버전의 모든 작업 완료 시 `feature/{version}` → `main`로 릴리즈 PR & 머지한다
7. 머지 후 `main`에 버전 태그를 생성한다 (예: `v0.1.0`)

### 적용 범위

이 브랜치 전략은 `main`에 커밋된 초기 셋업 이후의 작업부터 적용한다. 초기 셋업(프로젝트 생성, 의존성 설치, 설정 파일)은 `main`에 직접 커밋된 상태이다.

## 커밋 메시지

Conventional Commits를 따른다.

### 형식

```
{type}: {간결한 설명}

{본문 (선택)}
```

### 타입

| 타입 | 용도 |
|------|------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 (기능 변경 없음) |
| `style` | 코드 포맷팅, 세미콜론 등 (로직 변경 없음) |
| `docs` | 문서 변경 |
| `chore` | 빌드, 설정, 의존성 등 |
| `perf` | 성능 개선 |
| `test` | 테스트 추가/수정 |

```
# BAD
git commit -m "수정"
git commit -m "기능 추가"

# GOOD
git commit -m "feat: 설정 생성기 ESLint 옵션 UI 구현"
git commit -m "fix: ZIP 다운로드 시 빈 파일이 포함되는 문제 수정"
```

> **Why:** 일관된 커밋 메시지는 git log에서 변경 이력을 빠르게 파악할 수 있게 하고, 추후 자동 changelog 생성에도 활용할 수 있다.

**참고:** [Conventional Commits 1.0.0](https://www.conventionalcommits.org/)

## Pull Request

### PR 템플릿

프로젝트 루트의 `.github/PULL_REQUEST_TEMPLATE.md`에 템플릿을 정의한다. 템플릿 내용은 [pr-template.md](../templates/pr-template.md)를 참고한다.

### PR 규칙

- **제목**: 커밋 메시지와 동일한 Conventional Commits 형식 (예: `feat: 설정 생성기 ESLint 옵션 UI 구현`)
- **본문**: 템플릿을 따르며, 작업 유형 체크와 작업 사항을 반드시 작성한다
- **하위 → 버전 브랜치 PR**: 세부 기능 단위로 생성한다
- **버전 → main 릴리즈 PR**: 해당 버전에 포함된 전체 변경사항을 요약한다

### PR 라벨

PR 생성 시 작업 유형에 맞는 라벨을 반드시 함께 부여한다.

- ✨ 새 기능 → `feature`
- 🐛 버그 수정 → `bug`
- 🚨 핫픽스 → `hotfix`
- 🔧 리팩토링 → `refactoring`
- 🚀 성능 개선 → `performance`
- 🔍 SEO 개선 → `seo`
- 🎨 디자인 변경 → `design`
- 📝 문서 → `documentation`
- 🔨 Breaking Changes → `breaking-change`

```bash
# GOOD: PR 생성 시 라벨 함께 부여
gh pr create --title "feat: ESLint 옵션 UI 구현" --label "feature"
gh pr create --title "fix: ZIP 다운로드 버그 수정" --label "bug"

# 여러 라벨이 필요한 경우
gh pr create --title "feat: SEO 메타태그 자동 생성" --label "feature" --label "seo"
```

### 코드 리뷰

PR에는 Gemini 기반 자동 코드 리뷰가 적용된다.

- Gemini 코드 리뷰 봇이 PR 생성 시 자동으로 리뷰를 수행한다
- 리뷰 결과에서 지적된 사항은 반영 여부를 판단하여 처리한다
- 단순 스타일 제안은 프로젝트 컨벤션(`conventions/`)이 우선한다 — Gemini 제안과 컨벤션이 충돌하면 컨벤션을 따른다
- 보안, 성능, 로직 오류 관련 지적은 반드시 검토하고 반영한다

> **Why:** 1인 개발에서 셀프 리뷰의 맹점을 보완하기 위해 AI 코드 리뷰를 활용한다. 다만 프로젝트 컨벤션과 충돌하는 제안은 컨벤션이 우선한다.

## 참고 자료

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/)
- [GitHub Flow](https://docs.github.com/en/get-started/using-git/github-flow)
