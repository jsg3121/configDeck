---
name: create-pr
description: |
  PR 생성 스킬. 품질 검증(lint/코드 리뷰) 후 PR 템플릿 기반으로 PR을 생성한다. main 머지 시 테스트 통과 필수.
  TRIGGER when: "PR 만들어줘", "PR 생성", "풀 리퀘스트 만들어줘", 작업 완료 후 PR 생성 필요
  DO NOT TRIGGER when: 커밋만 필요(/commit 사용), 코드 리뷰만 필요(code-review 사용), 브랜치 생성/전환만 필요
disable-model-invocation: true
---

# PR 생성 스킬

프로젝트의 워크플로우 컨벤션에 따라 품질 검증 후 PR을 생성한다.

## PR 생성 프로세스

### 1. 현재 상태 확인

```bash
git branch --show-current
git status
git log --oneline -10
```

### 2. 대상 브랜치 확인

사용자에게 어느 브랜치로 머지할 것인지 확인한다.

- 하위 작업 브랜치 → `feature/{version}`: 세부 기능 단위 PR
- `feature/{version}` → `main`: 릴리즈 PR

대상 브랜치에 따라 **검증 수준이 달라진다:**

| 대상 | 검증 수준 |
|------|----------|
| `feature/{version}` | 린트 + 코드 리뷰 |
| `main` | 린트 + 코드 리뷰 + 단위 테스트 + E2E 테스트 |

### 3. 변경 사항 분석

```bash
git diff {대상 브랜치}...HEAD --stat
git log {대상 브랜치}...HEAD --oneline
```

---

## 품질 개선 및 검증 단계

PR 생성 **전에** 아래 개선/검증을 순차적으로 수행한다. 각 단계에서 이슈가 발견되면 사용자에게 보고하고 계속 여부를 확인한다.

### 4. 자동 포맷팅 (개선안 실행)

변경된 파일에 대해 Prettier 자동 포맷팅을 먼저 실행한다. PostToolUse Hook이 없으므로 PR 생성 시점에 일괄 정리한다:

```bash
# 변경된 파일 목록 추출
git diff {대상 브랜치}...HEAD --name-only --diff-filter=ACMR | grep -E '\.(ts|svelte|astro|css|json|js|mjs|cjs|html)$'

# Prettier 자동 수정
pnpm prettier --write {변경된 파일들}
```

포맷팅으로 변경된 파일이 있으면 자동으로 스테이징하고 포맷팅 커밋을 생성한다.

### 5. ESLint 검사

변경된 파일을 대상으로 린트를 검사한다:

```bash
# ESLint 검사
pnpm eslint {변경된 ts/svelte/astro 파일들}
```

**이슈 발견 시:**
- 에러 목록을 보고한다
- 자동 수정 가능한 항목과 수동 수정 필요 항목을 구분한다
- 사용자에게 수정 후 재실행할지, 이슈를 무시하고 진행할지 확인한다
- **에러(error)가 있으면 PR 생성을 중단**한다. 경고(warn)는 사용자 판단에 맡긴다

### 6. 코드 리뷰

서브에이전트를 생성하여 **사전 맥락 없이** 변경된 코드만으로 리뷰한다:

- 잠재적 이슈 검출 (런타임 에러, 로직 오류, 보안 취약점)
- 코드 개선 제안 (복잡도, 중복, 가독성)
- 타입 안전성 검증 (any 사용, as 단언, 타입 가드 누락)

**이슈 발견 시:**
- 심각도별(심각/권장/참고)로 분류하여 보고한다
- 심각 이슈가 있으면 수정을 권고하고 계속 여부를 확인한다

### 7. 테스트 (main 머지 시에만)

대상 브랜치가 `main`인 경우에만 실행한다:

```bash
# 단위 테스트
pnpm vitest run

# E2E 테스트 (빌드 후)
pnpm build && pnpm playwright test
```

**테스트 실패 시:**
- 실패한 테스트 목록을 보고한다
- **테스트가 실패하면 PR 생성을 중단**한다. main에는 모든 테스트를 통과한 코드만 머지한다

---

## PR 생성 단계

모든 검증을 통과하면 PR을 생성한다.

### 8. PR 본문 작성

`.claude/conventions/templates/pr-template.md` 템플릿을 기반으로 작성한다.

**작업 유형 체크 규칙:**
- 변경 사항에 해당하는 작업 유형은 `[x]`로 체크한다
- **해당하지 않는 작업 유형도 삭제하지 않고** `[ ]` 상태로 유지한다

```markdown
## 📋 작업 유형

- [x] ✨ 새 기능 (New Feature)
- [ ] 🐛 버그 수정 (Bug Fix)
- [ ] 🚨 핫픽스 (Hotfix)
- [x] 🔧 리팩토링 (Refactoring)
- [ ] 🚀 성능 개선 (Performance)
- [ ] 🔍 SEO 개선 (SEO)
- [ ] 🎨 디자인 변경 (Design)
- [ ] 📝 문서 (Documentation)
- [ ] 🔨 Breaking Changes
```

### 9. PR 라벨 매핑

체크된 작업 유형에 맞는 라벨을 부여한다:

- ✨ 새 기능 → `feature`
- 🐛 버그 수정 → `bug`
- 🚨 핫픽스 → `hotfix`
- 🔧 리팩토링 → `refactoring`
- 🚀 성능 개선 → `performance`
- 🔍 SEO 개선 → `seo`
- 🎨 디자인 변경 → `design`
- 📝 문서 → `documentation`
- 🔨 Breaking Changes → `breaking-change`

### 10. PR 제목

Conventional Commits 형식을 따른다:

```
feat: 설정 생성기 ESLint 옵션 UI 구현
fix: ZIP 다운로드 시 빈 파일이 포함되는 문제 수정
```

### 11. PR 생성 실행

사용자에게 제목, 본문, 라벨, 대상 브랜치를 보여주고 확인을 받은 후 실행한다:

```bash
gh pr create \
  --base {대상 브랜치} \
  --title "{PR 제목}" \
  --body "$(cat <<'EOF'
{PR 본문}
EOF
)" \
  --label "{라벨1}" --label "{라벨2}"
```

### 12. 완료 후

생성된 PR URL을 사용자에게 전달한다.

## 전체 흐름 요약

```
feature → feature/{version}:
  상태 확인 → 자동 포맷팅 → ESLint 검사 → 코드 리뷰 → [이슈 보고] → PR 생성

feature/{version} → main:
  상태 확인 → 자동 포맷팅 → ESLint 검사 → 코드 리뷰 → 단위 테스트 → E2E 테스트 → [이슈 보고] → PR 생성
```

## 참고

- PR 템플릿: `.claude/conventions/templates/pr-template.md`
- 워크플로우 컨벤션: `.claude/conventions/guides/workflow.md`
