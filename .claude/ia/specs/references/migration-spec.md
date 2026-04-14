# 마이그레이션 기능 상세

> 본 문서는 `configDeckIA.md`의 마이그레이션 기능 상세 내용을 분리한 참조 문서이다.

## 핵심 가치

- 기존 프로젝트의 레거시 설정을 최신 방식으로 전환하는 진입 장벽을 제거
- "새 프로젝트 생성" 외에 "기존 프로젝트 업그레이드"라는 두 번째 사용 동기를 확보
- 도구의 메이저 업데이트 시점마다 재방문 유인 제공

## 동작 흐름

```
사용자가 기존 파일 업로드 (드래그앤드롭 또는 코드 붙여넣기)
→ 파일 형식/버전 자동 감지
→ 변환 결과 미리보기 (diff 뷰: 변경 전 vs 변경 후)
→ 변환 사유 설명 (왜 이 옵션이 바뀌었는지)
→ 수동 조정 가능 (변환 결과에서 옵션 수정)
→ 복사 / 다운로드
```

## 지원 마이그레이션 시나리오

| 도구 | 구 형식 | 신 형식 | 변환 내용 |
|------|--------|--------|----------|
| ESLint | `.eslintrc.json` / `.eslintrc.js` / `.eslintrc.yml` | `eslint.config.mjs` (flat config) | extends → 플러그인 직접 import, env → globals, rules 매핑, 플러그인 호환성 확인 |
| Prettier | `.prettierrc` (JSON) | `prettier.config.mjs` (ESM) | JSON → ESM 모듈 변환, deprecated 옵션 제거/대체 |
| TypeScript | 구 버전 tsconfig | 최신 권장 tsconfig | `moduleResolution: node` → `bundler`, `target` 최신화, 불필요한 옵션 정리 |
| Vite | CJS 형식 config | ESM 형식 config | require → import 변환, deprecated 플러그인 API 업데이트 |

## UI 구성

파일별 생성기 페이지(`/generator/{file-name}`)에 "마이그레이션" 탭을 추가한다.

```
┌─────────────────────────┬─────────────────────────┐
│  좌측 패널              │  우측 패널 (diff 뷰)     │
│                         │                         │
│  [생성] [마이그레이션]   │  변경 전 (좌) │ 변경 후 (우) │
│                         │  ─────────────────────  │
│  파일 업로드 영역        │  - extends: ["..."]     │
│  ┌───────────────────┐  │  + import eslint from   │
│  │  파일을 여기에      │  │  - env: { browser }    │
│  │  드래그하세요       │  │  + globals: { ...}     │
│  │  또는 코드 붙여넣기  │  │                         │
│  └───────────────────┘  │  변환 사유 설명           │
│                         │  ├ "extends → import"   │
│  감지된 형식: .eslintrc  │  ├ "env → globals"      │
│  감지된 버전: ESLint 8   │  └ "규칙 호환성 확인"    │
│                         │                         │
│  [옵션 추가 조정]        │  ┌─────────────────┐    │
│                         │  │ 복사 │ 다운로드   │    │
│                         │  └─────────────────┘    │
└─────────────────────────┴─────────────────────────┘
```

**반응형**: 모바일에서는 상하 배치. diff 뷰는 탭 전환(변경 전/후)으로 제공

**SEO 요소**: `/generator/eslint-config` 페이지에서 "ESLint flat config migration" 키워드 자연 포함. 마이그레이션 가이드 콘텐츠가 페이지 SEO 가치를 강화
