# MI-0001: ConfigDeck 시장 분석

- 조사일: 2026-04-07
- 에이전트: market-intelligence

---

## 핵심 발견

1. **시장은 작지만 명확하게 존재한다.** 전 세계 개발자는 2025년 기준 약 2,080만 명(전문 개발자, JetBrains 기준) ~ 4,720만 명(광의 정의, SlashData 기준)이며, 이 중 프론트엔드·풀스택 개발자가 주요 타겟이다. 웹 기반 config 생성기를 사용할 SAM은 약 300~500만 명으로 추정된다.

2. **직접 경쟁자는 파편화되어 있고, 스택 단위 번들 생성 서비스는 공백이다.** gitignore.io는 단일 파일(.gitignore)에 특화되어 있고, 나머지 generator들은 파일별로 분산되어 있어 "여러 파일을 스택 기반으로 한 번에 생성"하는 서비스는 사실상 부재하다.

3. **AI가 위협이자 기회다.** GitHub Copilot, Cursor 등 AI 도구가 boilerplate 생성을 일부 흡수하고 있지만, 일관성·최신성·설명 제공 면에서 한계가 있어 "검증된 설정 파일 생성기"의 역할은 여전히 유효하다.

4. **생태계 변화(ESLint v9 flat config, Vite 급성장)가 기회다.** ESLint v9 flat config 전환이 2024년 4월 공식화되면서 수많은 개발자가 새 설정 방식에 혼란을 겪고 있다. 최신 방식을 반영한 설정 생성기에 대한 수요가 실재한다.

5. **다국어 SEO가 차별화 진입 전략이 될 수 있다.** 기존 서비스들은 영어 단일 언어 중심이며, 비영어권(한국, 일본 등) 개발자 커뮤니티를 위한 다국어 config 생성기는 미개척 영역이다.

---

## 시장 규모

### 전제 데이터

| 지표 | 수치 | 출처 |
|------|------|------|
| 전 세계 개발자 수 (광의) | 약 4,720만 명 (2025년 초) | SlashData, 2025 |
| 전 세계 전문 개발자 수 | 약 2,080만 명 (2024년) | JetBrains, 2025년 1월 |
| JavaScript 사용 개발자 | 약 2,520만 명 | SlashData, 2024 Q1 |
| 풀스택 개발자 비중 | 31% | Stack Overflow Developer Survey 2024 |
| 프론트엔드 개발자 비중 | 5.6% | Stack Overflow Developer Survey 2024 |
| TypeScript 사용률 | 38.5% (전체) / 69% (대규모 웹앱 기준) | Stack Overflow Developer Survey 2024 |
| ESLint 사용률 | 89.3% | State of Frontend 2024 |
| Prettier 사용률 | 87.5% | State of Frontend 2024 |
| Vite 주간 npm 다운로드 | ~8,900만 건 | npm 공식 통계, 2024~2025 |

### TAM / SAM / SOM 추정

| 구분 | 추정 규모 | 근거 |
|------|----------|------|
| TAM (전체 잠재 시장) | 전 세계 웹·프론트엔드·풀스택 개발자 약 1,200만 명 | JavaScript 사용자 2,520만 명 × 웹 개발 비중 약 50% (추정치) |
| SAM (접근 가능 시장) | 약 300~500만 명 | TAM 중 프로젝트를 자주 시작하고 웹 기반 도구를 사용하는 개발자 (전체의 25~40%, 가정) |
| SOM (획득 가능 시장) | 초기 1~3만 MAU, 장기 10~30만 MAU | SEO 유입 기반 무료 서비스, 다국어 특화 — 유사 서비스(gitignore.io 등) 트래픽 대비 추정 |

**수익화 관련 시장 규모 (참고)**

소프트웨어 개발 도구 전체 시장: 2025년 기준 약 64억~75억 달러, 2031년까지 약 157억~374억 달러 규모로 성장 전망 (CAGR 16~17%).

**광고 수익 모델 (애드센스)**

ConfigDeck은 SEO 유입 기반 무료 서비스이므로, 광고(Google AdSense) 수익 모델이 자연스러운 수익화 경로다. 개발자 도구 사이트는 B2B 광고주 비중이 높아 일반 블로그 대비 RPM(1,000회 노출당 수익)이 높은 편이다.

| MAU | 예상 페이지뷰/월 | 예상 RPM | 월 수익 추정 |
| --- | --- | --- | --- |
| 1,000 | 3,000 | $2~5 | $6~15 |
| 10,000 | 30,000 | $2~5 | $60~150 |
| 100,000 | 300,000 | $3~8 | $900~2,400 |

> RPM 추정 근거: 개발자 도구/테크 사이트 평균 RPM $2~8 (출처: AdSense 카테고리별 RPM 벤치마크, 가정 기반 추정). 페이지뷰 배수는 사용자당 평균 3페이지 가정 (생성기 허브 → 파일별 생성기 → 옵션 조정).

SEO 유입 기반 서비스와 광고 모델은 궁합이 매우 좋다. 단일 사용 패턴(낮은 리텐션)이 약점이 아니라 "검색 유입 → 광고 노출 → 수익"의 정상 흐름이며, Cloudflare Pages 무료 + 광고 수익으로 사이드 프로젝트의 지속 가능성을 확보할 수 있다.

---

## 경쟁사 현황

### 직접 경쟁자

| 서비스 | URL | 주요 기능 | 강점 | 약점 |
|--------|-----|----------|------|------|
| gitignore.io (Toptal) | toptal.com/developers/gitignore | .gitignore 단일 파일 생성. 200개 이상 언어/IDE/OS 지원. CLI/API 제공 | 인지도 높음, GitHub 8.7K 스타, SEO 강력, CLI 지원 | 단일 파일(.gitignore)만 지원. 스택 번들 기능 없음. UI 구식. 다국어 없음 |
| PureDevTools TSConfig Generator | puredevtools.com | tsconfig.json 옵션별 UI 선택 생성 | 시각적 옵션 설명 있음 | 단일 파일(tsconfig)만 지원. 최신 ESLint flat config 미지원. 영어만 |
| ESLint Config Inspector | eslint.org/docs | ESLint flat config 시각화/디버그 도구 | 공식 ESLint 팀 제공 | 생성기가 아닌 디버거. 초보자에게 불친절 |
| npm init @eslint/config | npm CLI | ESLint 설정 초기화 CLI | ESLint 공식 | CLI만 지원(웹 없음). 단일 파일. 옵션 설명 없음 |
| Kocal/eslint-config-generator | github.com/Kocal/eslint-config-generator | ESLint config 생성 (AirBnB, Vue, TS, Prettier 지원) | 오픈소스 | 현재 archived(유지보수 종료). 웹 UI 미비 |
| github/gitignore (GitHub 공식) | github.com/github/gitignore | .gitignore 템플릿 저장소 | 공식, 신뢰성 | UI 없음. 수동 복붙 필요 |

### 간접 경쟁자 (CLI 스캐폴더)

| 서비스 | URL | 주요 기능 | ConfigDeck 대비 포지셔닝 |
|--------|-----|----------|------------------------|
| create-t3-app | create.t3.gg | Next.js + TypeScript + tRPC + Prisma 풀스택 보일러플레이트 | 특정 스택에 고정, 설정 파일 커스터마이징 어려움 |
| Vite 공식 CLI (npm create vite) | vite.dev | Vite 기반 프로젝트 스캐폴딩 | 최소한의 설정만 포함, ESLint/Prettier 미포함 |
| create-next-app | nextjs.org | Next.js 프로젝트 초기화 | Next.js에 특화, 타 프레임워크 불가 |
| degit | github.com/Rich-Harris/degit | GitHub 템플릿 복제 | 고정 템플릿, 옵션 선택 불가 |

### 대체재 (AI/기타)

| 대체재 | 설명 | ConfigDeck에 대한 위협도 |
|--------|------|------------------------|
| GitHub Copilot | IDE 내 AI 코드 생성. 설정 파일 제안 가능 | 중간 — 일관성·최신성 보장 어려움, 설명 없음 |
| Cursor AI | AI 에이전트 기반 코드 생성 | 중간 — 프로젝트 전체 컨텍스트 필요, 간단한 설정 생성에 과도 |
| ChatGPT/Claude | 프롬프트 기반 설정 파일 생성 | 낮음~중간 — 최신 설정 반영 불확실, 검증 필요 |
| 직접 복붙 (블로그/공식 문서) | 검색 후 수동 복사 | 낮음 — 파편화, 시간 소모, 파일 간 호환성 미확인 |
| dotfiles 관리 (chezmoi 등) | 개인 설정 버전 관리 도구 | 매우 낮음 — 개인화 도구, 신규 프로젝트 세팅과 다른 니즈 |

### AI 도구 설정 파일이라는 새 시장 기회

AI 코딩 도구 자체가 대체재이면서 동시에 **ConfigDeck의 새로운 수요원**이 될 수 있다. AI 도구를 사용하려면 프로젝트별 설정 파일이 필요하며, 이 설정 파일의 구조·옵션이 도구마다 달라 생성기 수요가 발생한다.

**AI 도구별 설정 파일 현황**

| AI 도구 | 설정 파일 | 용도 |
|---------|----------|------|
| Cursor | `.cursorrules`, `.cursorignore` | 프로젝트별 AI 행동 규칙, 무시 파일 지정 |
| GitHub Copilot | `.github/copilot-instructions.md` | 코드 생성 지침, 코딩 스타일 가이드 |
| Claude Code | `CLAUDE.md`, `.claude/settings.json` | 프로젝트 컨텍스트, 권한 설정 |
| Windsurf | `.windsurfrules` | 프로젝트별 AI 규칙 정의 |
| Aider | `.aider.conf.yml` | AI 코딩 어시스턴트 설정 |

이 파일들을 ConfigDeck에서 지원하면, AI 도구는 대체재가 아니라 **보완재** 관계로 전환된다. "AI 도구를 쓰려면 ConfigDeck에서 설정 파일부터 만든다"는 흐름이 가능하며, AI 도구 시장의 성장(Copilot 매출 248% 성장)이 곧 ConfigDeck의 성장 동인이 된다.

---

## 산업 트렌드

### 성장 동인

- **AI 코딩 도구 설정 파일 수요 급증**: Cursor, Copilot, Claude Code, Windsurf 등 AI 코딩 도구가 프로젝트별 설정 파일(.cursorrules, copilot-instructions.md 등)을 필요로 하며, 이 파일들의 생성 수요가 AI 도구 확산에 비례하여 증가 중이다. AI 도구가 대체재에서 보완재로 전환될 수 있는 기회. (출처: 각 AI 도구 공식 문서)
- **JavaScript/TypeScript 생태계 지속 성장**: TypeScript 사용률이 2024년 38.5%(전체 개발자 기준), 대규모 웹앱에서는 69%에 달하며 설정 파일 복잡도가 지속 증가 중이다. (출처: Stack Overflow Developer Survey 2024)
- **Vite 급성장**: Vite npm 주간 다운로드가 2024년 한 해 동안 750만에서 1,700만으로 두 배 이상 성장했으며, 2025년 초 기준 주간 8,900만 다운로드를 기록 중이다. Vite config 파일 수요가 급증하고 있다. (출처: State of JS 2024, npm 공식 통계)
- **ESLint v9 flat config 전환**: 2024년 4월 공식 릴리즈로 `.eslintrc` 형식이 deprecated되고 `eslint.config.mjs` 방식으로 전환됨. 마이그레이션 복잡성으로 인해 "새로 생성"과 "기존 파일 마이그레이션" 두 가지 수요가 동시에 발생하고 있다. 특히 레거시 .eslintrc를 flat config로 자동 변환해주는 웹 도구는 현재 시장에 부재하다. (출처: ESLint 공식 블로그, 2024)
- **원격 근무·사이드 프로젝트 문화 확산**: 개발자의 38%가 완전 원격, 42%가 하이브리드로 근무하며, 밀레니얼·Z세대 66%가 사이드 허슬을 시작하거나 계획 중이다. 새 프로젝트를 시작하는 빈도가 높아져 설정 파일 생성 수요가 증가한다. (출처: Stack Overflow 2024, Intuit 2024)
- **개발자 생산성 도구 시장 성장**: 소프트웨어 개발 도구 시장이 연 16~17% CAGR로 성장 중이다. (출처: Mordor Intelligence, Business Research Insights)
- **다국어 개발자 생태계 확대**: JavaScript 개발자 중 서유럽·이스라엘(20.4%)과 북미(20%) 외에도 아시아 지역 개발자 비중이 증가 중이다. (출처: SlashData 2025)

### 저해 요인

- **AI 코드 생성 도구의 확산**: GitHub Copilot 매출이 2025년 4억 달러(전년 대비 248% 성장)로 급성장하며, 개발자들이 AI로 설정 파일을 생성하는 비중이 늘고 있다. (출처: GitHub 공식, 2025)
- **CLI 우선 문화**: 숙련 개발자는 CLI(`npm create vite`, `npm init @eslint/config`)를 선호하여 웹 UI 도구 이탈 가능성이 있다.
- **단일 사용 패턴**: 프로젝트 시작 시 한 번만 사용하는 도구 특성상 재방문율이 낮아 트래픽 지속 유입을 SEO에 의존해야 한다.
- **빠른 생태계 변화**: ESLint, Vite, TypeScript 등 주요 도구의 버전 업이 잦아 콘텐츠 유지 비용이 높다.
- **진입 장벽 낮음**: 정적 사이트로 구현 가능한 단순한 서비스 구조로 경쟁자 진입이 용이하다.

---

## 거시환경 분석 (PESTLE)

| 요인 | 현황 | 영향도 |
|------|------|--------|
| **Political (정치)** | 오픈소스 라이선스 정책 안정적. 설정 파일 자체는 저작권 분쟁 소지 거의 없음. CC0/MIT 공개 일반적 | 낮음 (긍정) |
| **Economic (경제)** | 개발자 채용 시장 조정 중이나 프리랜서·사이드 프로젝트 수요는 지속. SaaS 지출 증가(2025년 클라우드 기반 툴 59% 시장 점유). 무료 서비스로 경기 영향 제한적 | 낮음~중간 (중립) |
| **Social (사회)** | 원격 근무 확산(개발자 80%가 원격 또는 하이브리드). 사이드 프로젝트 문화 강화. 글로벌 개발자 커뮤니티 성장(50% 증가, 2022~2025) | 높음 (긍정) |
| **Technological (기술)** | AI 코드 생성 급성장(위협). ESLint v9, Vite 6, TypeScript 5.x 등 주요 도구 변화 지속(기회). 빌드 도구 생태계 재편(Rspack, Rolldown 등장) | 높음 (양면적) |
| **Legal (법률)** | 설정 파일 자체는 CC0에 가깝고 저작권 문제 없음. 오픈소스 라이선스(MIT, Apache) 표시 의무 정도 | 낮음 (중립) |
| **Environmental (환경)** | 직접적 연관 없음. 정적 사이트 + Cloudflare 배포로 탄소 발자국 최소화 가능 | 해당 없음 |

---

## Porter's 5 Forces 분석

| 힘 | 평가 | 근거 |
|----|------|------|
| 기존 경쟁자의 위협 | 중간 | gitignore.io가 인지도 높으나 단일 파일 한정. 스택 기반 번들 공백 존재 |
| 신규 진입자 위협 | 높음 | 정적 사이트로 구현 가능, 진입 장벽 낮음. AI 기반 유사 서비스 등장 가능 |
| 대체재 위협 | 중간 | AI 도구(Copilot, ChatGPT)가 일부 대체하나, AI 도구 자체의 설정 파일(.cursorrules, copilot-instructions.md 등) 생성 수요가 새로 발생하여 보완재 관계 형성 가능. 일관성·최신성·설명 한계로 완전 대체 어려움 |
| 공급자 교섭력 | 낮음 | 오픈소스 기반. Cloudflare Pages 무료 플랜 활용. 의존도 높은 공급자 없음 |
| 구매자 교섭력 | 높음 | 무료 서비스, 전환 비용 0, 대안 다수 존재. 사용자 이탈 용이 |

---

## 불확실성 및 가정

1. **[가정]** SAM 추정에서 "프로젝트를 자주 시작하는 개발자" 비율을 TAM의 25~40%로 가정했다. 실제 빈도 데이터(연간 몇 회 새 프로젝트 시작하는지)는 공개 데이터로 확인되지 않았다.

2. **[가정]** SOM(초기 1~3만 MAU)은 gitignore.io의 공개 트래픽 데이터가 없어 GitHub 스타 수(8.7K), 관련 키워드 볼륨 등 간접 지표로 추정했다. 실제 트래픽 데이터는 SimilarWeb 유료 플랜 접근이 필요하다.

3. **[불확실]** AI 도구가 config 생성 영역을 얼마나 빠르게 대체할지 예측이 어렵다. AI 모델의 최신 설정 반영 주기, 할루시네이션 빈도가 핵심 변수다.

4. **[가정]** 비영어권(한국, 일본) 개발자 커뮤니티에 다국어 config 생성기가 부재한다는 판단은 직접 조사가 아닌 검색 결과 기반 추론이다. 실제 존재 여부를 한국어/일본어로 직접 확인 필요하다.

5. **[불확실]** ESLint v9 전환이 유발하는 수요가 일시적(마이그레이션 시점)인지 지속적인지 판단하기 어렵다. 전환 완료 후 수요가 감소할 수 있다.

6. **[가정]** 소프트웨어 개발 도구 시장 성장률(16~17% CAGR)은 ConfigDeck과 같은 무료 유틸리티 서비스에 직접 적용되지 않는다. 사용자 수 기반 비교가 더 적절하다.

---

## BA 인풋 포인트

business-analyst에게 넘길 핵심 정보 및 분석 요청 사항:

1. **경쟁 공백의 실질적 가치 판단 요청**: 스택 번들 config 생성 서비스가 시장에 없는 이유가 "수요가 없어서"인지 "아직 만든 사람이 없어서"인지 SWOT 관점에서 평가 필요. 시장 공백이 기회인지 함정인지 내부 역량과 연계해 분석 요청.

2. **AI 대체 위협의 현실적 수준 판단 요청**: AI가 config 파일 생성을 대체하는 속도와 한계를 ConfigDeck의 핵심 가치(최신 설정 반영, 파일 간 충돌 자동 해결, 설명 제공)와 대비해 포지셔닝 분석 요청.

3. **단일 사용 패턴의 비즈니스 모델 함의 분석**: 재방문율이 낮은 도구 특성상 SEO 유입 지속성이 핵심이다. 장기 트래픽 유지를 위한 내부 콘텐츠 역량(설정 업데이트 주기, 커뮤니티 기여 구조)이 있는지 역량 평가 요청.

4. **다국어 SEO 전략의 실행 가능성 검토**: 한국어/일본어 지원이 차별화 요소가 될 수 있으나, 지속적인 번역 유지와 각 언어권 SEO 키워드 전략이 필요하다. 이에 필요한 내부 역량(한국어 네이티브 여부, 일본어 지원 계획) 평가 요청.

5. **ESLint v9 전환 시기의 긴급성 평가**: 마이그레이션 혼란이 정점인 현재(2024~2025)가 진입 최적 타이밍일 수 있다. 이 시장 기회창(window)이 열려 있는 기간을 내부 개발 일정과 대조해 평가 요청.

6. **무료 서비스 지속 가능성의 내부 역량 평가**: 오픈소스 무료 서비스의 수익화 경로(팀 preset 유료화, CLI 등)가 확장 계획에 있으나 MVP 단계에서 수익화 없이 운영 가능한 비용 구조 분석 요청.

---

## 참고 자료

- [SlashData: Global Developer Population Trends 2025](https://www.slashdata.co/post/global-developer-population-trends-2025-how-many-developers-are-there)
- [JetBrains: Global Developer Population Reaches 19.6 Million in 2024](https://blog.jetbrains.com/research/2025/01/global-developer-population-2024/)
- [Stack Overflow Developer Survey 2024](https://survey.stackoverflow.co/2024/)
- [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/developers/)
- [State of JavaScript 2024: Build Tools](https://2024.stateofjs.com/en-US/libraries/build_tools/)
- [State of Frontend 2024](https://tsh.io/state-of-frontend)
- [JetBrains State of Developer Ecosystem 2024](https://www.jetbrains.com/lp/devecosystem-2024/)
- [ESLint v9.0.0 Released (2024)](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/)
- [ESLint v9.0.0 Retrospective](https://eslint.org/blog/2025/05/eslint-v9.0.0-retrospective/)
- [GitHub Universe 2024: Copilot 발표](https://github.com/newsroom/press-releases/github-universe-2024)
- [Are Boilerplates Becoming Obsolete in the Age of AI?](https://dev.to/jigar_online/are-boilerplates-becoming-obsolete-in-the-age-of-ai-code-generation-3i08)
- [Mordor Intelligence: Software Development Tools Market](https://www.mordorintelligence.com/industry-reports/software-development-tools-market)
- [Business Research Insights: Software Development Tools Market](https://www.businessresearchinsights.com/market-reports/software-development-tools-market-106006)
- [toptal/gitignore.io GitHub Repository](https://github.com/toptal/gitignore.io)
- [github/gitignore GitHub Repository](https://github.com/github/gitignore)
