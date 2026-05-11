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
| 버전 루트 | `feature/{version}` | `feature/1.5.1` |
| 페이즈 | `feature/{version}-{기능명}` (버전 루트에서 분기) | `feature/1.5.1-advisory-landing`, `feature/1.5.1-og-image` |

- 기능명은 kebab-case로 작성하며, 해당 페이즈의 산출물을 식별할 수 있는 짧은 명칭을 사용한다 (예: `advisory-landing`, `faq-howto-jsonld`)
- `phase`, `step`, 번호 같은 메타 키워드는 브랜치명에 넣지 않는다 — 작업 순서는 PR 머지 순서로 추적한다
- **작업이 페이즈 1개로 끝나는 경우에도 버전 루트에 직접 커밋하지 않고 페이즈 브랜치를 반드시 생성한다** — 모든 변경은 PR을 거쳐 버전 루트에 들어와야 리뷰·롤백 단위가 일관되게 유지된다

### 페이즈 정의

페이즈란 **버전 내에서 독립적으로 검증·머지 가능한 작업 단위**이다. 다음 기준 중 하나에 부합하면 별도 페이즈로 분리한다.

- SPEC 또는 ADR에서 명시적으로 단계가 구분되어 있는 경우
- 산출물 도메인이 다른 경우 (예: 콘텐츠 스키마 / UI 구현 / SEO 메타 / 테스트)
- 머지 후 단독으로 배포·롤백 가능한 경우

작업 시작 전 사용자와 페이즈 분할안에 합의하고, 합의된 페이즈 목록은 TodoWrite로 추적한다.

### 페이즈 내 커밋 단위

한 페이즈 안에서는 **논리적 단위로 커밋을 분할**한다. 한 커밋은 한 가지 의도만 담는다.

- 스키마 정의 / 컴포넌트 구현 / 스타일 / 테스트 / 문서를 가능하면 별도 커밋으로 분리한다
- 리팩토링과 기능 추가는 같은 커밋에 섞지 않는다
- 페이즈 PR을 열었을 때 커밋 목록만으로 변경 의도를 따라갈 수 있어야 한다

> **Why:** 페이즈 PR은 보통 여러 커밋이 누적된다. 커밋 단위가 논리적이면 리뷰·되돌리기 단위가 명확해지고, `git log --oneline`만으로 페이즈의 진행 흐름을 파악할 수 있다.

### 워크플로우

```
main ───────────────────────────────────────── ● (v1.5.1 태그)
  │                                              ↑
  └─ feature/1.5.1 ─────────────────────── 릴리즈 PR & 머지
       │         ↑              ↑
       ├─ feature/1.5.1-advisory-landing ─┘    (페이즈 PR)
       └─ feature/1.5.1-og-image ─────────┘    (페이즈 PR)
```

1. 현재 브랜치를 확인한다
2. `main`이면 신규 버전 브랜치 생성 여부를 사용자에게 확인 요청한다
3. 새 버전 작업 시작 시 `main`에서 `feature/{version}` 버전 루트 브랜치를 생성한다
4. 작업 계획을 페이즈로 분할하여 사용자와 합의한다 (1개 페이즈로 충분해도 동일 절차)
5. 페이즈 시작 시 `feature/{version}`에서 `feature/{version}-{기능명}` 페이즈 브랜치를 분기한다
6. 페이즈 내에서는 논리적 커밋 단위로 작업한다
7. **페이즈 종료 시 `feature/{version}-{기능명}` → `feature/{version}`으로 PR & 머지한다**
8. 모든 페이즈 완료 시 `feature/{version}` → `main`으로 릴리즈 PR & 머지한다

> **태그 관련 안내**: 이 프로젝트는 별도의 git 태그를 생성하지 않는다. 버전 추적은 브랜치명(`feature/{version}`)과 릴리즈 PR 머지 커밋으로 충분히 가능하다. 다른 프로젝트에서 흔히 보이는 "머지 후 `v1.x.x` 태그 생성" 절차는 ConfigDeck에는 적용되지 않는다.

### 적용 범위

이 브랜치 전략은 `main`에 커밋된 초기 셋업 이후의 작업부터 적용한다. 초기 셋업(프로젝트 생성, 의존성 설치, 설정 파일)은 `main`에 직접 커밋된 상태이다.

### 🚨 작업 시작 전 필수 가드 (Branch Guard)

**모든 코드 수정·파일 편집·`Edit`/`Write` 도구 사용 직전에** 다음을 반드시 확인한다. 한 번이라도 건너뛰면 main 오염, stash 누락, 페이즈 PR 단위 붕괴로 이어진다.

1. **현재 브랜치 확인 (`git branch --show-current`)**
   - `main`이거나 `feature/{version}` 버전 루트 브랜치 위에 있다면 **즉시 작업을 중단**하고 사용자에게 페이즈 브랜치 생성 여부를 확인한다
   - 페이즈 브랜치(`feature/{version}-{기능명}`) 위에 있을 때만 코드 수정 가능
2. **버전 결정 합의**
   - 새 작업 시작 시 버전 번호(PATCH/MINOR/MAJOR)를 사용자와 먼저 합의한 후 브랜치를 만든다
   - 핫픽스는 PATCH(`0.0.x` 증가)로, 신규 기능은 MINOR(`0.x.0` 증가)로 분기한다
3. **페이즈 분할 합의**
   - 1개 페이즈로 끝나는 작업도 페이즈 브랜치를 반드시 생성한다 (직접 버전 루트 커밋 금지)
   - 페이즈 분할안은 사용자와 합의 후 TodoWrite로 기록한다
4. **이미 main에서 잘못 편집했을 경우 복구 절차**
   - `git stash push -m "..." -- <변경된 파일들>`로 변경분을 stash에 보존
   - `git status`로 main이 깨끗한지 확인
   - 버전 루트 + 페이즈 브랜치를 생성하고 페이즈 브랜치로 이동
   - `git stash pop`으로 변경분 복원 후 작업 재개

> **Why:** Claude는 사용자의 "이렇게 수정해줘" 요청에 반사적으로 `Edit` 도구를 호출하는 경향이 있다. 이 가드는 그 반사 동작을 명시적인 체크 단계로 끊어내기 위해 존재한다. 가드를 건너뛰면 main에 미커밋 변경분이 누적되어 페이즈 단위 롤백·리뷰가 불가능해진다.

#### 자가 점검 문장 (Edit 호출 직전 마음속으로 확인)

> "지금 내가 편집하려는 파일은 `feature/{version}-{기능명}` 페이즈 브랜치 위에 있다."

이 문장이 참이 아니면 편집 도구를 호출하지 않는다.

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
- **페이즈 → 버전 루트 PR** (`feature/{version}-{기능명}` → `feature/{version}`): 페이즈 단위로 생성하며, 본문에 해당 페이즈에 포함된 커밋 목록과 각 커밋의 의도를 요약한다
- **버전 루트 → main 릴리즈 PR** (`feature/{version}` → `main`): 해당 버전에 머지된 전체 페이즈를 나열하고, 사용자 관점의 변경사항을 요약한다

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
