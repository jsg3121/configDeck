# UI 퍼블리싱 워크플로우

UI 구현 작업은 **시안 작성 → 사용자 검토 → 코드 적용** 2단계로 분리한다. 시안 단계 없이 바로 코드를 작성하지 않는다.

> **Why:** UI는 시각적 결과를 직접 확인하지 않으면 의도와 결과가 어긋나기 쉽다. 시안 단계에서 사용자가 미리 확인하고 합의하면, 코드 적용 후 발견되는 디자인 수정 비용을 줄이고 한 번에 정확한 구현으로 도달할 수 있다.

## 1단계: 시안 작성

### 시안 파일 형식

순수 HTML 단일 파일로 작성한다. CSS는 Tailwind CDN을 사용한다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{시안 제목}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-surface-alt font-sans text-gray-900">
  <!-- 시안 본문 -->
</body>
</html>
```

> **Why:** 단일 HTML + Tailwind CDN으로 작성하면 사용자가 IDE의 Live Preview나 브라우저로 파일 하나만 열어 즉시 확인할 수 있다. 실제 코드와 동일한 Tailwind 클래스를 사용하므로 시안에서 합의된 클래스가 그대로 코드로 옮겨지고, 디자인 토큰과 색상도 실제와 거의 동일하게 미리 확인할 수 있다.

### 시안 저장 위치

모든 시안은 `.claude/ui-mockups/{작업명}/` 폴더에 저장한다.

```
.claude/ui-mockups/
├── index.md                           # 폴더 역할 + 시안 목록
├── ai-config-catalog/                 # 작업 단위 폴더
│   ├── README.md                      # 시안 의도, 디자인 결정, 변경 이력, 적용 코드 경로
│   ├── catalog.html                   # 시안 1
│   └── catalog-mobile.html            # 다른 상태/뷰포트가 필요한 경우
└── ai-config-generator/
    ├── README.md
    ├── step-1-tool-select.html        # 단계별 상태 시안
    ├── step-2-skills.html
    └── step-3-preview.html
```

### 작업 단위 폴더의 README.md 필수 항목

- **시안 의도**: 어떤 페이지/컴포넌트 시안인지, SPEC/ADR 연결 명시
- **디자인 결정**: 주요 레이아웃/색상/타이포그래피 결정과 근거
- **시안 파일 목록**: 각 파일이 어떤 상태/뷰포트를 표현하는지
- **변경 이력**: 사용자 피드백에 따른 시안 갱신 기록
- **적용 코드 경로** (적용 후 추가): 시안이 실제 어느 파일로 구현되었는지

> **Why:** 시안 폴더가 디자인 의사결정 기록 역할을 한다. 향후 같은 영역을 재작업할 때 "왜 이렇게 디자인했는지" 추적할 수 있고, 시안과 실제 코드의 연결 관계가 명확해진다.

### 인터랙션 표현 방식

순수 HTML이므로 Svelte 인터랙션을 시뮬레이션할 수 없다. 다음 방식을 조합한다.

#### A. 상태별 별도 시안 파일

생성기처럼 단계가 많은 UI는 단계마다 별도 HTML 파일로 작성한다.

```
ai-config-generator/
├── step-1-tool-select.html      # 도구 선택 화면
├── step-2-skills.html           # Skills 선택 화면
├── step-3-best-practices.html   # 베스트 프랙티스 선택
└── step-4-preview-download.html # 미리보기 + 다운로드
```

#### C. 어노테이션

인터랙션 부분은 시안 내부에 주석으로 동작을 명시한다.

```html
<button
  class="rounded-lg bg-primary px-4 py-2 text-white"
  data-mockup-note="클릭 시 다음 단계로 이동, Step 2가 펼쳐짐"
>
  다음
</button>

<!--
  인터랙션 메모:
  - 도구 카드 클릭 시: aria-pressed 토글 + 테두리 색상 변경
  - 최소 1개 선택 검증: 모두 해제 시 "다음" 버튼 비활성화
-->
```

> **Why:** 인터랙션을 JS 토이 코드로 시연하면 실제 동작과 다를 수 있어 오해를 유발한다. 상태별 정적 시안 + 어노테이션 조합이 시안의 의도를 정확히 전달하면서도 실제 구현과 충돌하지 않는다.

### 디자인 토큰 일치

시안의 색상/간격/타이포그래피는 프로젝트의 실제 디자인 토큰과 일치시킨다. 아래 클래스를 우선 사용한다.

| 카테고리 | 사용 클래스 |
| --- | --- |
| 배경 | `bg-surface`, `bg-surface-alt` |
| 텍스트 | `text-gray-900`(주), `text-gray-500`(보조), `text-gray-400`(약) |
| 강조 | `text-primary`, `bg-primary`, `hover:bg-primary-hover` |
| 테두리 | `border-border` |
| 폰트 | `font-sans` (기본) |
| 컨테이너 | `mx-auto max-w-7xl px-6` (페이지 셸과 동일) |

> **Why:** 실제 프로젝트는 Tailwind v4의 `@theme` 설정으로 커스텀 색상 토큰(`primary`, `surface`, `border` 등)을 정의한다. 시안에서 같은 토큰을 사용하면 코드 적용 시 클래스가 그대로 옮겨지고, 디자인 차이가 발생하지 않는다.

## 2단계: 사용자 검토

시안 작성 완료 후 다음을 사용자에게 보고한다.

1. **시안 파일 경로 안내**: 마크다운 링크 형식으로 명시 (예: `[catalog.html](.claude/ui-mockups/ai-config-catalog/catalog.html)`)
2. **시안 의도 요약**: 어떤 디자인 결정을 했는지 한 단락
3. **확인 요청 항목**: 사용자가 특별히 검토해야 할 부분 (예: "도구 카드 그리드 레이아웃이 4-1 분할로 되어 있는데 의도와 맞는지 확인 부탁드립니다")
4. **다음 단계 안내**: "승인 시 실제 코드로 적용하겠습니다"

사용자가 직접 IDE/브라우저로 시안 파일을 열어 확인한 후 피드백을 준다.

### 피드백 반영

- **수정 요청**: 시안 파일을 갱신하고 README 변경 이력에 기록한 후 다시 검토 요청
- **승인**: 3단계로 진행

## 3단계: 코드 적용

승인된 시안을 실제 Astro/Svelte 컴포넌트로 변환한다.

### 변환 시 원칙

- 시안의 Tailwind 클래스는 가능한 한 그대로 옮긴다 (디자인 결정의 일관성)
- 인터랙티브 요소만 Svelte 컴포넌트로 분리, 정적 요소는 Astro로 유지
- 시안 어노테이션의 인터랙션 메모를 실제 구현으로 옮긴다

### 시안 파일 처리

코드 적용 후 시안 파일은 **삭제하지 않는다**. 대신 작업 폴더의 README.md에 적용된 코드 경로를 기록한다.

```markdown
## 적용 코드 경로

- 시안 적용 일자: 2026-05-02
- 적용 파일:
  - [src/pages/[locale]/ai-config/index.astro](../../../../src/pages/[locale]/ai-config/index.astro)
  - [src/components/ai-config/CatalogToolCard.astro](../../../../src/components/ai-config/CatalogToolCard.astro)
- 시안 대비 차이: (있는 경우) 구현 단계에서 발생한 미세 조정 사항
```

> **Why:** 시안 파일을 보관하면 향후 동일 영역을 재작업할 때 디자인 의도와 결정 근거를 다시 확인할 수 있다. 적용 코드 경로를 기록하면 시안 ↔ 실제 코드의 추적이 가능해진다.

## 예외: 시안 단계 생략

다음 경우는 시안 단계 없이 바로 코드 작성을 허용한다.

- **단순 텍스트/카피 변경**: 색상/레이아웃 변경 없이 i18n 텍스트만 수정
- **명확한 버그 수정**: 깨진 레이아웃을 정상 상태로 복원
- **완전히 동일한 패턴 반복**: 기존 시안이 있는 컴포넌트와 동일한 구조 재사용 (예: 카드 1개 추가)

> **Why:** 시안 단계는 디자인 결정이 필요한 작업에 가치가 있다. 결정할 것이 없는 작업까지 시안을 만들면 작업 시간만 늘어나고 사용자 피드백도 반복적이 된다.

## 참고

- [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) — 시안용 CDN 사용 근거
- [Tailwind CSS Utility-First](https://tailwindcss.com/docs/utility-first) — 시안과 실제 코드 모두 동일 원칙 적용
