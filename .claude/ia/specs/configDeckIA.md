개발 설정 파일 생성 서비스 기획서 / IA 초안
1. 서비스 개요
서비스명

가칭: Config Builder, Dev Setup Generator, Project Config Hub

한 줄 소개

프론트엔드, 백엔드, iOS, Android 개발자가 프로젝트 시작 시 필요한 각종 설정 파일을 선택형 옵션 UI로 조합하고, 즉시 다운로드 또는 복사할 수 있게 해주는 다국어 웹 서비스

서비스 목적

개발자가 신규 프로젝트를 시작할 때 반복적으로 작성하는 설정 파일을 빠르게 생성할 수 있도록 하여,

초기 세팅 시간을 줄이고
설정 누락을 방지하며
최신 권장 방식 기반의 설정을 쉽게 적용할 수 있도록 돕는다.
핵심 가치
빠름: 설정 파일을 검색하고 복붙하는 시간을 줄임
정확함: 최신 스택 기준으로 파일 구조를 제공
조합 가능: 체크박스와 프리셋으로 필요한 옵션만 반영
다국어 지원: 한국뿐 아니라 해외 개발자도 쉽게 사용 가능
확장성: 단일 파일 생성이 아니라 프로젝트 세팅 번들 생성으로 확장 가능
2. 문제 정의
기존 문제

신규 프로젝트 생성 시 개발자는 아래 문제를 자주 겪는다.

어떤 설정 파일이 필요한지 매번 다시 찾아봐야 함
같은 설정을 여러 프로젝트에서 반복 작성함
ESLint, Prettier, TypeScript, Git, 테스트, CI 등 서로 연관된 설정의 조합이 번거로움
.gitignore처럼 단순해 보이는 파일도 실제로는 OS, IDE, 언어, 프레임워크에 따라 달라짐
공식 문서를 보더라도 “최소 설정”과 “실전용 설정” 사이 간극이 있음
해결 방향

사용자가

개발 파트를 선택하고
스택과 옵션을 체크하면
해당 조합에 맞는 설정 파일들을 생성해
개별 복사 또는 ZIP 다운로드할 수 있도록 한다.
3. 타겟 사용자
1차 타겟
주 타겟
프론트엔드 개발자
신규 프로젝트를 자주 세팅하는 개발자
개인 프로젝트/사이드 프로젝트를 자주 시작하는 개발자
템플릿보다 세부 옵션 조정이 필요한 개발자
세부 타겟
주니어 개발자: 무엇을 넣어야 할지 잘 모르는 사용자
미드/시니어 개발자: 빠르게 표준 세팅을 만들고 싶은 사용자
프리랜서/에이전시 개발자: 반복 세팅이 많은 사용자
팀 리드: 팀 표준 preset을 만들고 싶은 사용자
2차 타겟
백엔드 개발자
Android 개발자
iOS 개발자
개발 교육/부트캠프 수강생
4. 서비스 범위
MVP 범위

초기 버전은 가장 수요가 높고 텍스트 기반 설정 파일 생성에 적합한 영역부터 시작한다.

공통
.gitignore
.editorconfig
.env.example
프론트엔드 / Node 중심
package.json
tsconfig.json
eslint.config.*
prettier.config.*
vite.config.*
vitest.config.*
jest.config.*
next.config.*
postcss.config.*
tailwind 관련 설정
lint-staged
husky
부가 기능
코드 복사
파일 다운로드
전체 ZIP 다운로드
preset 저장 및 공유(후순위)
확장 범위
백엔드
NestJS
Spring Boot
Python/FastAPI
ASP.NET
Go
모바일
Android
iOS
DevOps / 공통 개발 환경
Docker
Docker Compose
GitHub Actions
CI/CD 템플릿
VS Code Workspace 설정
5. 서비스 컨셉
핵심 컨셉

“설정 파일 생성기”가 아니라
“프로젝트 초기 세팅 빌더”

즉,

파일 하나만 만드는 것이 아니라
스택 전체를 기준으로
관련 파일을 묶어서 제공하는 것이 차별점이다.
예시 시나리오

사용자가

Frontend
React
Vite
TypeScript
ESLint
Prettier
Vitest
Husky
macOS
VS Code

를 선택하면,
서비스는 아래를 함께 생성한다.

.gitignore
.editorconfig
package.json
tsconfig.json
eslint.config.mjs
prettier.config.mjs
vite.config.ts
vitest.config.ts
.vscode/settings.json 또는 추천 설정
lint-staged, husky 설정 예시
6. 핵심 기능 정의
6-1. 파일 생성 기능

사용자가 옵션을 선택하면 해당 조합에 맞는 설정 파일을 생성한다.

생성 방식
개별 파일 보기
복사하기
파일 단건 다운로드
전체 ZIP 다운로드
6-2. 옵션 조합 기능

파일별로 세부 옵션을 체크박스, 라디오, 셀렉트 UI로 제공한다.

예시
.gitignore
Node
macOS
Windows
VS Code
JetBrains
Android Studio
Xcode
.env
dist
build
.next
coverage
사용자 지정 폴더 추가
ESLint
JS / TS
React / Vue / Next / Node
import 정렬
unused vars 처리
엄격도 수준
prettier 연동 여부
Prettier
single quote
trailing comma
semi
print width
tab width
TypeScript
strict 여부
path alias
module resolution
target / lib
6-3. 프리셋 기능

사용자 편의를 위해 많이 쓰는 조합을 미리 제공한다.

예시 preset
React + Vite + TypeScript
Next.js + TypeScript
Astro + TypeScript
Node API + TypeScript
NestJS Starter
Android Kotlin Starter
iOS Swift Starter
6-4. 설명 기능

각 옵션과 파일이 왜 필요한지 설명을 제공한다.

예시
이 옵션을 켜면 무엇이 달라지는지
어떤 환경에서 주로 쓰는지
다른 옵션과 충돌하는지
권장 조합은 무엇인지
6-5. 다국어 기능
UI 번역
설명 문구 번역
가이드/문서 번역
다국어 SEO 페이지 운영

단, 실제 생성되는 설정 키/패키지명/명령어는 원문 유지

7. IA (정보 구조)

> **변경 이력**: ADR-0006에 의해 프리셋 페이지를 생성기 내로 통합하고, 사용자 플로우를 2단계로 단순화함 (2026-04-06)

/
├─ /en
│  ├─ /                    # 홈 (서비스 소개 + CTA)
│  ├─ /generator           # 생성기 (프리셋 + 직접 선택 + 옵션 + 미리보기 통합)
│  ├─ /files
│  │  ├─ /gitignore
│  │  ├─ /eslint-config
│  │  ├─ /prettier-config
│  │  ├─ /tsconfig
│  │  ├─ /vite-config
│  │  ├─ /next-config
│  │  └─ ...
│  ├─ /stacks
│  │  ├─ /frontend
│  │  ├─ /backend
│  │  ├─ /ios
│  │  └─ /android
│  ├─ /docs
│  ├─ /blog
│  ├─ /faq
│  └─ /about
├─ /ko
│  └─ 동일 구조
├─ /ja
│  └─ 동일 구조
├─ /pt-br
│  └─ 동일 구조
8. 페이지 구조 상세
8-1. 홈
목적

서비스 소개 및 주요 진입점 제공

핵심 콘텐츠
서비스 한 줄 소개
생성기 바로가기 (주요 CTA)
인기 프리셋 미리보기 (클릭 시 생성기로 이동하여 해당 프리셋 적용)
인기 파일 생성기 바로가기
언어 선택
주요 사용 사례
SEO용 설명 섹션
주요 CTA
설정 파일 만들기 → 생성기 이동
인기 프리셋으로 시작하기 → 생성기 이동 (프리셋 사전 선택)
8-2. 생성기 메인
목적

사용자가 설정 파일을 조합하고 실시간으로 확인하는 핵심 페이지. 프리셋과 직접 선택이 하나의 인터페이스에 통합된다.

> **변경**: ADR-0006에 의해 프리셋 페이지를 생성기 내로 통합, 2분할 레이아웃 채택

레이아웃 (PureDevTools 스타일 2분할)
좌측 패널 — 설정 영역
  프리셋 버튼 (상단)
    React + Vite + TS Starter
    Next.js App Router Starter
    Astro Blog Starter
    Node API Starter
    Android Kotlin Starter
    → 클릭 시 해당 옵션들이 자동 선택되고 우측 미리보기에 즉시 반영
  설정 파일 선택
    .gitignore
    tsconfig.json
    eslint.config.mjs
    prettier.config.mjs
    ...
  파일별 세부 옵션
    체크박스, 드롭다운, 토글, 텍스트 입력 등 옵션 유형에 맞는 컨트롤
    프로그레시브 디스클로저: 고급 옵션은 기본 숨김 → 펼치기
우측 패널 — 미리보기 영역
  선택된 파일의 생성 결과 코드를 실시간 표시
  파일 탭으로 여러 파일 전환
  결과 액션
    복사
    파일 단건 다운로드
    전체 ZIP 다운로드
    공유 링크 생성(후순위)
반응형
  모바일: 상하 배치 (설정 → 미리보기)

사용자 플로우
경로 A (프리셋): 프리셋 버튼 클릭 → 옵션 자동 선택 + 미리보기 반영 → 필요 시 옵션 조정 → 복사/다운로드
경로 B (직접 선택): 파일 선택 → 세부 옵션 설정 → 미리보기 확인 → 복사/다운로드
8-4. 파일 단위 랜딩 페이지
목적

SEO 유입 및 단일 파일 생성 니즈 대응

예시 페이지
/files/gitignore
/files/eslint-config
/files/prettier-config
/files/tsconfig
페이지 구성
파일 설명
언제 쓰는지
자주 사용하는 옵션
생성기 진입 버튼
예시 출력
FAQ
8-5. 스택별 랜딩 페이지
목적

“프레임워크/언어 중심” 검색 유입 대응

예시
/stacks/frontend/react
/stacks/frontend/nextjs
/stacks/backend/nestjs
/stacks/android/kotlin
구성
해당 스택에서 자주 필요한 설정 파일 목록
추천 preset
자주 쓰는 조합
바로 생성하기 CTA
8-6. 문서 / 가이드
목적

학습형 유입 확보 및 신뢰도 강화

예시 문서
ESLint flat config란?
.gitignore에 무엇을 넣어야 하나?
React 프로젝트 초기 세팅 체크리스트
TypeScript strict 모드 추천값
Prettier와 ESLint 함께 쓰는 방법
8-7. 블로그
목적

검색 유입 확보

예시 주제
eslint.config.mjs 예제 모음
Next.js에서 추천하는 tsconfig 구성
Android 프로젝트용 .gitignore 예시
VS Code 팀 공통 설정 파일 만드는 방법
8-8. FAQ
목적

사용자 불안 해소

예시 질문
생성된 파일은 최신 기준인가요?
설정이 공식 문서와 다른 이유가 있나요?
회사 프로젝트에 바로 써도 되나요?
여러 파일을 한 번에 받을 수 있나요?
모바일 프로젝트도 지원하나요?
9. 사용자 플로우

> **변경**: ADR-0006에 의해 4단계 → 2단계 플로우로 단순화, 프리셋 플로우를 생성기 내로 통합

플로우 A: 직접 생성
홈 진입
“설정 파일 만들기” 클릭 → 생성기 페이지 이동
파일 선택 + 세부 옵션 설정 (좌측 패널)
실시간 미리보기 확인 (우측 패널)
복사 또는 다운로드
플로우 B: 프리셋 사용
홈 진입
“설정 파일 만들기” 클릭 → 생성기 페이지 이동
프리셋 버튼 클릭 → 옵션 자동 선택 + 미리보기 즉시 반영
필요한 옵션만 조정
다운로드
플로우 C: 검색 유입
사용자가 “eslint config generator” 검색
파일 랜딩 페이지 진입
설명 확인
“생성기에서 만들기” CTA 클릭 → 생성기 페이지 이동 (해당 파일 사전 선택)
옵션 조정
결과 다운로드
10. 내비게이션 구조

> **변경**: ADR-0006에 의해 Presets 메뉴 제거 (생성기 내 통합)

글로벌 내비게이션
Generator
Files
Stacks
Docs
Blog
FAQ
유틸리티 내비게이션
Language Switcher
Theme Toggle
GitHub
Feedback
Changelog
11. 다국어 전략
지원 언어
영어
한국어
일본어
브라질 포르투갈어
원칙
UI, 설명, 문서만 번역
생성 파일 내부 키/명령어는 번역하지 않음
locale별 URL 분리
언어 자동 감지는 추천 수준만 제공
사용자가 직접 언어 전환 가능해야 함
URL 예시
/en/generator
/ko/generator
/ja/generator
/pt-br/generator
12. 콘텐츠 전략
핵심 콘텐츠 유형
생성기 페이지
파일 단위 설명 페이지
스택 단위 설명 페이지
사용 가이드
비교/추천 문서
예제 모음
주요 검색 유입 키워드 방향
gitignore generator
eslint config generator
prettier config generator
tsconfig generator
vite config template
next.js config example
react starter config
android gitignore template
13. 기능 우선순위
P0
홈
생성기 메인
.gitignore 생성
ESLint / Prettier / TS config 생성
프리셋 3~5개
다운로드 / 복사
영어 / 한국어 지원
P1
Vite / Next / Jest / Vitest
스택별 랜딩
파일별 랜딩
문서/FAQ
일본어 / 포르투갈어 추가
P2
백엔드 설정 확장
Android / iOS 설정 확장
공유 링크
사용자 preset 저장
로그인
팀 preset 기능
14. MVP 추천 범위

초기 출시 버전은 아래 정도가 가장 적절합니다.

지원 스택
Common
Frontend
Node
지원 파일
.gitignore
.editorconfig
.env.example
tsconfig.json
eslint.config.mjs
prettier.config.mjs
vite.config.ts
vitest.config.ts
next.config.js
제공 기능
옵션 선택
미리보기
복사
다운로드
ZIP 다운로드
영어 / 한국어
15. 차별화 포인트
기존 생성기와 차이

단순히 파일 하나를 만드는 것이 아니라,

스택 기준으로 묶어서 생성
파일 간 충돌을 줄여줌
최신 권장 방식 반영
설명까지 함께 제공
다국어 지원
SEO 유입용 랜딩 구조 포함
핵심 메시지

“개발 설정 파일 하나를 만드는 서비스”가 아니라
“프로젝트 시작에 필요한 설정을 한 번에 정리해주는 서비스”

16. 성공 지표
핵심 KPI
생성기 진입 수
파일 다운로드 수
ZIP 다운로드 수
preset 사용률
언어별 유입 비중
SEO 랜딩 페이지 유입
재방문율
공유 링크 생성 수
보조 지표
파일별 사용률
스택별 사용률
이탈이 많은 단계
가장 많이 선택되는 옵션 조합
검색 유입 상위 키워드
17. 향후 확장 아이디어
팀 표준 preset 저장/공유
GitHub repo용 설정 패키지 export
CLI 제공
VS Code extension
“내 스택 추천 세팅” 자동 제안
AI 기반 설정 리뷰
framework boilerplate 생성
CI/CD 템플릿 자동 추가
18. 한 줄 정리

이 서비스는
개발자가 프로젝트 시작 시 필요한 설정 파일을 스택 기반으로 빠르게 조합·생성·다운로드할 수 있게 해주는 다국어 프로젝트 세팅 빌더로 정의할 수 있다.