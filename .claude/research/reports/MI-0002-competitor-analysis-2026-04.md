# MI-0002: ConfigDeck 경쟁사 분석 (2026-04)

- 조사일: 2026-04-24
- 에이전트: market-intelligence

---

## 핵심 발견

**직접 경쟁자는 사실상 부재하다.** 단일 파일(예: `.gitignore`, `eslint.config.js`)만 생성하는 단품 도구들은 존재하지만, 여러 설정 파일을 스택 기반으로 조합·다운로드할 수 있는 통합 웹 서비스는 확인되지 않았다. ConfigDeck이 목표하는 포지션은 현재 시장에서 공백(gap)에 해당한다.

---

## 직접 경쟁 서비스

| 서비스 | 핵심 기능 | 강점 | 약점 | 비고 |
|--------|-----------|------|------|------|
| **gitignore.io** (toptal.com/developers/gitignore) | `.gitignore` 단일 파일 생성, 571개 템플릿 | 완성도 높음, 인지도 높음 | `.gitignore`만 생성 | GitHub 레포: ~8k stars |
| **GenTools.io ESLint Config Generator** | `eslint.config.js` 단일 파일 생성 (v9+ flat config) | React/Vue/TS/Node 지원, 무료, 클라이언트사이드 | ESLint 단독, 스택 조합 없음 | 2024년 이후 등장한 신규 도구 |
| **code2care.org ESLint Generator** | ESLint 설정 파일 생성 | 단순 UI | 기능 빈약, 스택 무관 단순 생성 | |
| **DotConfig** (PH: 115 upvotes) | Webpack config wizard | UI 기반 선택 | 2019년 출시, Webpack 한정, 사실상 활동 중단 | 기술 부채 심각 |

## 간접 경쟁 / 우회 수단

| 도구 | 유형 | 설명 |
|------|------|------|
| **create-vite** | CLI scaffolding | 주당 다운로드 ~1억 회 이상. 설정 파일 포함 전체 프로젝트를 생성하므로 "설정 파일만 필요한" 경우에 과도함 |
| **create-next-app** | CLI scaffolding | Next.js 전용. 프로젝트 전체 생성, 파일 단품 선택 불가 |
| **StackBlitz Starters** | 웹 IDE + 템플릿 | 전체 환경을 브라우저에서 제공. 설정 파일 "추출"이 목적이 아님 |
| **Yeoman** | CLI 범용 scaffolding | 2019년 이후 사실상 쇠퇴. generator 유지보수 단절 多 |
| **GitHub 검색 / Gist** | 수동 복붙 | 현재 개발자 대다수가 사용하는 실질적 우회 방법 |

## 시장 규모 관련 지표 (간접 추정)

- ESLint 주간 npm 다운로드: 2025년 초 4,270만 건 → 연말 7,070만 건 (65% 성장)
- Vite 주간 다운로드: 약 1억 건
- 신규 프론트엔드 프로젝트 대부분이 ESLint + Prettier + tsconfig 조합 필요 → 수요 기반은 확인됨

---

## 불확실성 및 가정

- SimilarWeb 등 트래픽 데이터는 유료 접근이 필요해 경쟁 서비스의 실제 MAU는 확인 불가
- "개발자들이 CLI scaffolding 대신 웹 생성기를 선택하는 비율"에 대한 직접 데이터 없음
- GenTools.io 등 신규 경쟁자의 트래픽 규모 미확인

---

## BA 인풋 포인트

1. **공백 포지션 유효성**: 스택 조합 개념이 없는 파편화된 단일 파일 생성기들. ConfigDeck의 "복수 파일을 한 번에 조합" 포지션은 현재 시장에서 직접 경쟁자 없음.

2. **CLI scaffolding이 주요 우회 수단**: create-vite, create-next-app이 가장 강력한 간접 경쟁자. 차별화 포인트는 "기존 프로젝트에 파일 추가/갱신" 및 "레거시 설정 마이그레이션" 시나리오.

3. **ESLint 생태계 전환 기회**: ESLint v9 flat config 전환으로 기존 `.eslintrc` 설정이 무효화됨. 마이그레이션 니즈가 단기 수요 급등 트리거.

4. **다국어 전략의 실질 가치**: 영어권 경쟁자들이 한국어/일본어 등을 지원하지 않음. 비영어권 개발자 시장에서 SEO 유입 우위 가능성.

---

## 참고 자료

- [gitignore.io - Create Useful .gitignore Files For Your Project](https://www.toptal.com/developers/gitignore)
- [ESLint Config Generator - Flat Config Builder | GenTools.io](https://gentools.io/eslint-config-generator)
- [DotConfig: Super simple webpack configuration wizard | Product Hunt](https://producthunt.com/posts/dotconfig)
- [ESLint's 2025 year in review](https://eslint.org/blog/2026/01/eslint-2025-year-review/)
- [create-vite - npm](https://www.npmjs.com/package/create-vite)
