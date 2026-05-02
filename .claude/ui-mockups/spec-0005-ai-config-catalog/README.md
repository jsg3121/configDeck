# spec-0005-ai-config-catalog

## 시안 의도

ADR-0019 IA 재설계의 핵심 페이지인 `/ai-config` 카탈로그 허브의 시안이다.

기존 `/ai-config`는 통합 생성기를 직접 노출했고, 5개 도구별 랜딩(`/ai-config/{slug}`)이 그 자식 위치에 있어 "부모-자식 위계 역전" 문제가 있었다. ADR-0019 결정에 따라 이 페이지는 다음 두 가지를 제공하는 **허브**로 전환된다.

1. **5개 도구 카탈로그** — 각 도구의 파일 형식과 차이점을 둘러보고 개별 랜딩(`/ai-config/{slug}`)으로 진입
2. **통합 생성기 진입 CTA** — `/ai-config/generator`로 이동하여 4개 도구를 동시에 생성

생성기 자체(`/ai-config/generator`)는 기존 UI 이전 + URL 파라미터 처리 추가로 큰 디자인 변경이 없으므로 본 시안의 범위에서 제외한다.

연결 문서

- ADR-0019: ai-config IA 재설계 (부모-자식 위계 역전 해소)
- SPEC-0005: AI 도구 설정 + Skills 통합 생성기

## 디자인 결정

### 1. 통합 생성기 카드의 시각적 위계 — "추천 워크플로우"로 분명히

카탈로그 페이지의 핵심 전환 목표는 **통합 생성기 진입**이다(개별 랜딩은 둘러보기 경로). 이를 시각적으로 명확히 하기 위해

- 카드를 일반 카탈로그 그리드보다 **위쪽**에 배치
- gradient 배경(`from-primary/5 via-surface to-accent/5`) + 배경 blur로 다른 5개 카드와 시각적 차별화
- "추천 워크플로우" 배지 + 동시 출력 파일 5종을 가시화하여 가치 제안을 직관적으로 노출
- CTA 버튼은 `px-6 py-3.5 text-base`로 일반 카드 화살표보다 크게

근거: 기존 [LandingHero.astro](../../../src/components/ai-config/landing/LandingHero.astro)의 `bg-primary` CTA 패턴과 일치시키되, 카탈로그 허브에서는 "선택지 비교 후 통합 생성"이 권장 경로임을 시각 위계로 전달.

### 2. 카드 그리드 레이아웃 — 데스크톱 3-2 분할

카드는 5개. 데스크톱(lg)에서 3열로 두면 `[3] / [2]` (3-2 분할)이 되고, 4열로 두면 `[4] / [1]` (4-1 분할)이 된다. 본 시안은 **3-2 분할**을 채택했다.

이유

- 4-1은 5번째 카드가 외로이 떨어져 시각적 균형이 깨진다
- 3-2는 첫 행에 AGENTS.md(공통 표준), Cursor, Copilot이 배치되고 둘째 행에 CLAUDE.md, Agent Skills가 배치되어 카드 사이즈도 더 크게 확보된다
- AGENTS.md는 4개 도구를 포괄하는 "공통 표준"이므로 첫 줄 첫 번째에 두어 위계를 부여

태블릿(md)은 2열, 모바일은 1열 단순 스택.

> 이 결정은 검토 시점에 사용자가 4-1 분할을 선호할 경우 변경 가능하다. README "검토 항목"이 아닌 **직접 검토 요청 항목**으로 응답에 표시한다.

### 3. 카드 시각 패턴 — 도구별 브랜드 색상 + SVG 아이콘 (v2 갱신)

5개 도구 카드는 동일한 구조(아이콘 박스 + 도구명 + 파일 경로 + 한 줄 설명 + 화살표)를 사용한다.

#### 3.1 색상 매핑 (옵션 B — 공식 영감 + 식별성 우선)

| 도구 | hex | Tailwind 표현 | 의미 |
| --- | --- | --- | --- |
| AGENTS.md | `#475569` | `slate-600` | 표준/공통 — 중립 슬레이트로 "어떤 도구에도 치우치지 않는 공통 규약" 표현 |
| Cursor | `#0f172a` | `slate-900` | Cursor 공식 사이트의 모노크롬 톤(딥 블랙)에 맞춰 식별성 확보 |
| Copilot | `#0969da` | GitHub 시그니처 블루 (커스텀 hex) | GitHub Primer Design System의 `accent.fg` 토큰. Copilot이 GitHub 자산임을 즉시 인지 |
| Claude Code | `#d97757` | Anthropic 시그니처 앰버 (커스텀 hex) | Anthropic 공식 브랜드 색상의 따뜻한 톤. claude.ai 헤더와 동일 계열 |
| Agent Skills | `#7c3aed` | `violet-600` | agentskills.io 사이트 톤. 5색 중 가장 채도 높은 보라색으로 "8종 묶음 제공" 차별화 |

근거 정리:

- 사용자 피드백(2026-05-02, jsg3121): "도구별 브랜드 색상 + SVG 로고로 식별성 강화"
- 식별성 우선 — 정확한 공식 hex가 식별을 해치는 경우(예: GitHub의 거의 검정에 가까운 헤더 색)는 약간 밝은 톤으로 조정
- `bg-surface` + `border-border` 기본 톤은 유지하여 페이지 전체 디자인 토큰을 깨뜨리지 않음(도구 색상은 추가 색상이지 기존 토큰 대체 아님)

#### 3.2 적용 방식 (옵션 3 — 아이콘 색상 + 호버 시 테두리)

- **정적 상태**: 카드 본체는 흰색(`bg-surface`) 유지. 좌상단 아이콘 박스만 도구 색상의 10~15% 톤 배경 + 도구 색상의 SVG
- **호버 상태**: 카드 테두리(`border`)가 도구 색상으로 전환 + `-translate-y-0.5` + `shadow-md`
- **화살표(→)**: 도구 색상으로 통일하여 진입성을 강조하고, 호버 시 0.5 단위 우측 이동
- **차별화 배지**: AGENTS.md "공통 표준"은 슬레이트 배경, Agent Skills "8종 제공"은 바이올렛 배경으로 색상 매핑과 일관

근거: 카드 본체 전체를 도구 색상으로 칠하면 5개 카드가 5색 패치가 되어 페이지 전체가 산만해진다. 기존 SaaS 카탈로그 베스트 프랙티스(GitHub Marketplace, Vercel Templates 등)를 참고하여 **본체는 흰색 유지, 시그니처 색상은 아이콘 + 호버 인터랙션에만 사용**하는 방식을 채택.

#### 3.3 SVG 아이콘 선택 근거

| 도구 | SVG 출처 | 선택 근거 |
| --- | --- | --- |
| **AGENTS.md** | 직접 디자인 (Lucide 패턴 기반) | 공식 로고 없음 → "문서(rect) + 체크마크" 조합으로 "합의된 공통 표준" 의미 전달. 단일 path 4개로 단순/명료 |
| **Cursor** | [Simple Icons - cursor](https://simpleicons.org/icons/cursor) (CC0) | Cursor 공식 로고를 그대로 인라인. 위/아래 화살표 다이아몬드 형태 |
| **Copilot** | [Simple Icons - githubcopilot](https://simpleicons.org/icons/githubcopilot) (CC0) | Copilot 공식 마스코트(헤드) path를 그대로 인라인 |
| **Claude Code** | [Simple Icons - claude](https://simpleicons.org/icons/claude) (CC0) | Anthropic Claude 공식 스파클 로고 path를 그대로 인라인 |
| **Agent Skills** | 직접 디자인 (Lucide의 `sparkles` 패턴 차용) | 공식 로고 없음 → "스파클(별) + 보조 별 2개" 조합으로 "다양한 도구 묶음(8종)" 의미 전달. agentskills.io 사이트의 보라색 + 별 톤 참고 |

공통 규칙:

- 모든 SVG는 `viewBox="0 0 24 24"` 통일 → 5개 아이콘 시각 무게감 균일 확보
- `currentColor` 활용으로 호버/색상 토큰과 자동 동기화 (SVG 자체 fill hex 의존 제거)
- 외부 이미지 참조 금지 → 시안 자기완결성 유지(파일 하나만 열어도 미리보기 가능)
- Simple Icons은 CC0 라이선스이므로 자유 사용 가능 ([Simple Icons License](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md))

근거: 기존 [LandingRelatedTools.astro](../../../src/components/ai-config/landing/LandingRelatedTools.astro)의 `border-border bg-white` + `hover:border-primary/50` 패턴을 계승하되, 카탈로그 페이지에서는 단순 텍스트 링크가 아닌 **카드형 비교 UI**가 필요하므로 아이콘 + 메타데이터 + 도구별 시그니처 색상을 추가했다.

#### 3.4 SVG 출처 (v3 갱신)

v2 검토에서 사용자가 "5개 SVG 중 3개가 공식 로고와 다르다"는 피드백을 제시하여 v3에서 다음과 같이 교체했다. 도구별 SVG의 최종 출처와 적용 시점은 다음과 같다.

| 도구 | 최종 SVG 출처 (v3) | 적용 시점 | viewBox |
| --- | --- | --- | --- |
| **AGENTS.md** | [agents.md 공식 favicon 재구성](_reference-agents-md-favicon.png) — 두 사선 + 가로 바로 "A" 형태 직접 path 작성 (v5: V자 해석에서 분해 형태로 완전 재해석. favicon 정확한 시각 매핑 — 좌 사선이 가장 위, 우 사선이 중간 시작, 가로 바는 좌측 위치 / **v6: 정삼각형 분해 형태로 재해석. 좌우 대칭 + 상단 간격 4로 분리감 확보**) | v3 (2026-05-02) → v4 (2026-05-02) → v5 (2026-05-02) → v6 (2026-05-02) | `0 0 24 24` |
| **Cursor** | 사용자 제공 SVG (단색화된 Cursor 공식 마크) | v3 (2026-05-02) | `0 0 680 720` |
| **Copilot** | 사용자 제공 SVG (GitHub Copilot 공식 헤드폰 캐릭터, 헤드 외곽 + 두 눈 path 3개) | v3 (2026-05-02) | `0 0 96 96` |
| **Claude Code** | [Simple Icons - claude](https://simpleicons.org/icons/claude) (CC0) — v2 그대로 유지 | v2 (2026-05-02) | `0 0 24 24` |
| **Agent Skills** | 직접 디자인 (Lucide `sparkles` 패턴 차용) — v2 그대로 유지 | v2 (2026-05-02) | `0 0 24 24` |

v3 SVG 적용 시 주요 처리:

- **viewBox는 path 좌표계를 보존하기 위해 원본 그대로 유지**한다. Cursor(680x720), Copilot(96x96)은 24x24로 변환하지 않는다 — path 좌표를 강제로 스케일링하면 정밀도 손실이 발생하고, transform/scale 적용 시 `stroke-width` 의도가 깨질 수 있다. CSS의 `width`/`height`(`h-5 w-5`)는 이미 `<svg>` 박스 크기를 픽셀 단위로 결정하고, viewBox는 그 박스 안에서의 path 좌표 매핑만 책임지므로 **출력 시각 크기는 5개 모두 20×20px로 동일하게 정렬**된다.
- 사용자 제공 SVG의 `fill="black"`/`fill="#26251e"` → **`fill="currentColor"`로 변환**. 이는 호버 인터랙션과 도구 색상 토큰(`tool-cursor-text`, `tool-copilot-text`)이 SVG에 자동 반영되도록 하기 위함이다. 색상을 SVG 자체 hex로 박아두면 다크 모드 추가 시 SVG도 별도 분기 처리가 필요해진다.
- AGENTS.md는 favicon 이미지를 시각적으로 분석한 뒤 **24×24 좌표계에 맞게 재좌표화**한다. **v6 좌표(2026-05-02, 옵션 Y 채택)**: 좌 사선 `(10,5)→(5,16)`, 우 사선 `(14,5)→(19,16)`, 하단 가로 바 `(8,19)→(16,19)`. v5의 비대칭 분해 좌표(좌 사선 `(12,4)→(7,14)` + 우 사선 `(13,10)→(18,19)` + 좌측 정렬 가로 바 `(6,18)→(13,18)`)는 두 사선이 평행한 다리처럼 보여 정삼각형 윤곽이 약하다는 사용자 피드백으로 폐기됐다. v4의 V자 좌표(좌 사선 `(11,4)→(5,18)` + 우 사선 `(13,4)→(19,18)` + 중앙 가로 바 `(8.5,19.5)→(15.5,19.5)`) 역시 favicon 실제 형태와 달라 v5에서 폐기된 바 있다. v6의 핵심 시각 특징은 다음과 같다 — (1) 가상의 정삼각형 세 꼭짓점 `(12,4)` / `(4,18)` / `(20,18)`을 기준으로 각 변(좌·우 사선 + 하단 가로 바)을 안쪽으로 1~2단위씩 들여 분해 배치한다. (2) 좌 사선 `(10,5)→(5,16)`과 우 사선 `(14,5)→(19,16)`이 viewBox 중심선(x=12)을 기준으로 **완벽 좌우 대칭**이다. (3) 두 사선의 상단 끝은 x=10과 x=14로 **간격 4단위**가 확보되어 stroke-width 2.5보다 1.5 큰 거리를 유지하므로 cap이 겹치지 않고 명확히 분리된다. (4) 하단 가로 바 `(8,19)→(16,19)`는 viewBox 중심 12를 기준으로 좌우 4단위씩 **중앙 정렬**된다. (5) 좌 사선 끝(5,16)과 가로 바 좌측(8,19)의 거리, 우 사선 끝(19,16)과 가로 바 우측(16,19)의 거리는 각각 √(9+9)≈4.24단위로 **세 stroke 모두 분리**된다. 이 분해/대칭 구조에서 세 stroke가 모이면 정삼각형 윤곽으로 인지된다. `stroke-width="2.5"`는 favicon의 두꺼운 stroke 무게감을 재현하면서 다른 stroke 아이콘과 균형을 맞춘다.

### 4. 색상 토큰 — 실제 프로젝트와 100% 일치

`src/styles/global.css`의 `@theme` 토큰을 시안에서 동일하게 정의했다.

- `--color-primary: #3b82f6` / `--color-primary-hover: #2563eb`
- `--color-accent: #8b5cf6`
- `--color-surface: #ffffff` / `--color-surface-alt: #f8fafc`
- `--color-border: #e2e8f0`
- `--font-sans: 'Inter', system-ui, sans-serif`

CDN Tailwind는 `@theme`을 직접 인식하지 못하므로 `tailwind.config = { ... }` 스크립트 + 인라인 `<style>`로 보강했다 (시안용 한정, 실제 코드에서는 `@theme` 그대로 사용).

### 5. Breadcrumb 추가

ADR-0019의 IA 위계를 사용자가 명확히 인지하도록 `홈 / AI Config Files` Breadcrumb을 페이지 헤딩 위에 배치했다. 기존 통합 생성기 페이지에는 없던 요소로, **카탈로그 허브임을 시각적으로 표현**하는 역할을 한다.

## 시안 파일 목록

| 파일 | 표현 상태 |
| --- | --- |
| [catalog.html](catalog.html) | 데스크톱 (lg, 1024px+) — 3-2 분할 카드 그리드 |
| [catalog-mobile.html](catalog-mobile.html) | 모바일 (390px) — 1열 카드 스택, 헤더 햄버거 메뉴 |

태블릿(md, 768~1023px)은 데스크톱 시안의 `md:grid-cols-2` 클래스로 자동 적용되므로 별도 파일을 생성하지 않았다. 브라우저 DevTools 반응형 모드로 확인 가능.

## 검토 항목 (사용자 결정 대기)

### 1. `?focus=agents-md` 진입 시 동작

ADR-0019의 매핑(`agents-md` 랜딩 → 4개 도구 모두 선택)에 따르면, `agents-md` 랜딩에서 "통합 생성기 시작" CTA를 누른 사용자는 생성기에서 **4개 도구가 모두 선택된 상태**로 도달한다.

그러나 SPEC-0005 CP-3(Conditional Path 3)에 따르면 "Claude Code + 다른 도구 선택" 조합 시 안내 박스(예: "CLAUDE.md는 @AGENTS.md를 임포트하므로 중복 출력될 수 있습니다")가 표시된다.

4개 도구 전체 선택 상태로 진입하면 이 안내가 즉시 노출되는데, 이것이 의도된 UX인지 확인이 필요하다.

검토 옵션:

- A) **현재 매핑 유지**: 4개 모두 선택 + CP-3 안내 즉시 표시 (사용자가 도구를 끄지 않는 한 항상 노출)
- B) **매핑 수정**: AGENTS.md 랜딩의 진입은 "AGENTS.md만 선택" 또는 "AGENTS.md + Cursor + Copilot" (Claude Code 제외) 같은 조합으로 변경
- C) **안내 박스 조건 완화**: `?focus=agents-md`로 진입한 경우에는 CP-3 안내를 dismissable로 처리

> 시안 내 처리: 카탈로그 페이지 자체는 `?focus` 파라미터를 발급하지 않는다(통합 생성기 카드는 `/ai-config/generator`로 직진). `?focus`는 **개별 랜딩 페이지의 CTA**에서만 발급되므로 본 시안에는 직접적 시각 표현이 없다. 이 검토 항목은 생성기 페이지 시안에서 다시 다뤄야 할 사항이며, 현재는 README에서 추적만 한다.

### 2. `?focus=agent-skills` "Step 2 Agent Skills 영역 펼침"의 위치

SPEC-0005-design §3.1에 따르면 생성기는 다음 단계 구조를 가진다.

- Step 1 — 도구 선택
- Step 2 — Best Practices 카테고리 선택
- Step 3 — Boundaries 카테고리 선택
- Step 4 — Agent Skills 선택

ADR-0019의 표현 "Step 2 Agent Skills 영역 펼침"은 다음 둘 중 어느 것을 의미하는지 명확화가 필요하다.

- A) **Step 4의 Skills 선택 영역으로 스크롤** — 생성기 진입 후 자동으로 Step 4까지 스크롤되어 Skills 영역이 시각 중심에 들어옴
- B) **진입점 자체를 Step 4로 이동** — Step 1~3을 건너뛰고 곧장 Step 4를 활성 단계로 표시 (도구는 4개 모두 선택 상태가 기본값)

현재 ADR-0019의 표현만으로는 모호하다. 사용자 흐름의 자연스러움 측면에서는 A가 우세하지만, B가 의도라면 명확히 해야 한다.

> 시안 내 처리: 카탈로그 페이지의 카드 클릭은 모두 `/ai-config/{slug}` 랜딩으로 향하며, `?focus`는 랜딩의 CTA에서 발급된다. 카탈로그 시안은 이 항목과 직접 관련이 없으나, 후속 생성기 페이지 작업의 입력값이 되므로 README에 명시했다.

### 3. 유효하지 않은 `?focus` 값 폴백 로직

`?focus=invalid` 또는 `?focus=foo` 같은 비유효 값으로 진입 시 처리 방식 명세가 필요하다.

검토 옵션:

- A) **기본 상태로 폴백**: 어떤 도구도 미리 선택되지 않은 깨끗한 초기 상태로 진입
- B) **redirect**: `/ai-config/generator?focus=invalid` → `/ai-config/generator` (또는 `/ai-config`)로 301/302 리다이렉트
- C) **무시 + 콘솔 경고**: 비유효 파라미터는 조용히 무시하고 기본 상태로 진입(redirect 없음, URL은 그대로 유지)

A와 C의 차이는 URL이 `?focus=invalid`로 남는지 여부다. SEO 관점에서는 B(redirect)가 가장 명확하지만 SPA-like 생성기에서는 C가 가장 단순하다.

> 시안 내 처리: 카탈로그 페이지는 `?focus`를 발급하지 않으므로 본 시안에는 직접적 표현 없음. 생성기 페이지 시안 작업 시 결정해야 할 사항.

## 변경 이력

| 날짜 | 변경 | 비고 |
| --- | --- | --- |
| 2026-05-01 | 초기 시안 | 데스크톱(3-2 분할) + 모바일(1열) 시안 작성, README 검토 항목 3개 정리 |
| 2026-05-02 | v2: 도구별 브랜드 색상 + SVG 아이콘 적용 | 사용자 피드백(jsg3121) — 색상 옵션 B / 적용 방식 3 / SVG 아이콘. AGENTS.md=slate-600, Cursor=slate-900, Copilot=#0969da, Claude=#d97757, Skills=violet-600. 5개 카드 아이콘 박스를 SVG로 교체(Simple Icons CC0 + 직접 디자인) + 호버 시 테두리가 도구별 색상으로 전환. 통합 생성기 카드/레이아웃/배지 위치는 v1 그대로 유지 |
| 2026-05-02 | v3: 공식 SVG 3개 교체 (Cursor, Copilot, AGENTS.md) | 사용자 피드백(jsg3121) — Cursor·Copilot 사용자 제공 SVG / AGENTS.md는 agents.md 공식 favicon 재구성. Claude Code·Agent Skills는 v2 유지. catalog.html, catalog-mobile.html에 동일 패턴 적용. README §3.4 "SVG 출처" 표 신설 |
| 2026-05-02 | v4: AGENTS.md 아이콘 좌표 재계산 | 사용자 피드백(jsg3121) — v3의 좌측 정렬 비대칭 가로 바가 favicon 실제 형태와 다름. 중앙 정렬 + 가파른 V 형태 + 두 사선 하단보다 안쪽 위치로 재구성. 다른 4개 아이콘은 v3 그대로 유지 |
| 2026-05-02 | v5: AGENTS.md 아이콘 완전 재해석 (V자 → 분해 형태) | 사용자 피드백(jsg3121) — v4의 V자 해석이 favicon과 다름. 실제는 좌 사선(상단)이 우 사선(중간 시작)보다 위에 있고 가로 바는 좌측 위치. 세 stroke가 분리된 분해 형태로 재구성 |
| 2026-05-02 | v6: AGENTS.md 정삼각형 분해 형태 (옵션 Y) | 사용자 피드백(jsg3121) — v5의 평행 다리 형태에서 정삼각형 윤곽으로 재정렬. 좌우 완전 대칭 + 상단 간격 4단위로 분리감 확보. 가로 바 중앙 정렬 |

## 적용 코드 경로

미적용 (시안 검토 대기 중).

승인 후 본 섹션에 다음 형식으로 갱신한다.

```text
- 시안 적용 일자: YYYY-MM-DD
- 적용 파일:
  - src/pages/[locale]/ai-config/index.astro (카탈로그로 전환)
  - src/components/ai-config/catalog/CatalogToolCard.astro (신설 가능)
  - src/components/ai-config/catalog/UnifiedGeneratorCard.astro (신설 가능)
- 시안 대비 차이: (있는 경우) 구현 단계에서 발생한 미세 조정 사항
```
