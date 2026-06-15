---
id: "https://www.searchenginejournal.com/what-apples-gemini-powered-siri-means-for-search-visibility/578931/"
tool: "searchenginejournal"
title: "Apple의 Gemini 기반 Siri가 검색 노출에 미치는 영향"
link: "https://www.searchenginejournal.com/what-apples-gemini-powered-siri-means-for-search-visibility/578931/"
pubDate: 2026-06-13T12:00:28.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/what-apples-gemini-powered-siri-means-for-search-visibility/578931/"
contentType: "commentary"
summary: "Apple이 WWDC에서 Gemini 모델 기반의 Siri AI를 발표했다. Search Engine Journal은 웹 답변 생성, 출처 링크 정책의 불투명함, 그리고 사이트 운영자가 Applebot 크롤러 설정으로 대응할 수 있는 범위를 분석했다."
---

Search Engine Journal이 WWDC에서 발표된 Siri AI의 검색 노출 영향을 분석했다. Gemini 모델을 기반으로 재구축된 Siri가 웹에서 실시간 정보를 가져와 답변을 생성하며, iPad·Mac의 Spotlight에 통합된다는 점이 핵심이다.

## 무엇이 새로운가

Siri AI는 웹에서 최신 정보를 끌어와 거의 모든 주제에 대해 답변을 생성할 수 있다. Apple은 이 답변에 출처 링크가 "포함될 수 있다(may include)"고만 밝혔을 뿐, 링크가 언제·얼마나 자주 노출되는지, 이를 측정할 방법이 있는지는 설명하지 않았다. 출처 정책에 대한 유일한 언급은 프레스 릴리스가 아닌 Applebot 지원 페이지에 있다. Safari도 페이지 변경 모니터링(Notify Me), 자동 비밀번호 변경 같은 에이전트형 기능을 추가했는데, 이 자동 방문이 웹사이트에 어떤 User-Agent로 식별되는지는 공개되지 않았다. 영어권 사용자 베타가 올해 후반 시작되고, iOS 27과 함께 더 넓은 배포가 예정돼 있지만 EU와 중국은 초기 대상에서 제외된다.

## 설정 파일에 어떤 의미인가

이번 발표의 실질적 설정 접점은 `robots.txt`와 메타 태그 수준이다. Apple의 Applebot 지원 페이지에 따르면, `Applebot-Extended`를 `robots.txt`에서 차단하면 파운데이션 모델 훈련 데이터에서 제외된다. `nosnippet` 메타 태그를 추가하면 AI 답변 생성 시 해당 페이지가 컨텍스트로 사용되지 않는다. 유료 콘텐츠는 구조화 데이터(structured data)로 페이월 표시를 하면 답변 생성 소스에서 빠진다. 다만 이 중 어떤 것도 Apple 검색 인덱스 자체에서의 제거를 의미하지는 않는다.

개발자 도구 관점에서 보면, 이건 전형적인 크롤러 제어 설정 문제다. 기존에 `Googlebot`이나 `GPTBot` 대응으로 `robots.txt`를 관리하고 있었다면, `Applebot-Extended` 항목을 추가하는 것은 동일한 패턴의 연장이다. 다만 Safari의 에이전트형 자동 방문이 어떤 봇 시그니처를 사용하는지가 아직 불명확하므로, 봇 관리 및 분석 파이프라인에서 이를 구분할 수 있을지는 Apple의 추가 문서를 기다려야 한다.

## 다음 단계 제안

지금 당장 할 수 있는 일은 자사 `robots.txt`에서 `Applebot` 및 `Applebot-Extended` 관련 규칙이 의도대로 설정돼 있는지 확인하는 것이다. AI 답변 소스에서 제외되길 원한다면 `nosnippet` 태그와 페이월 구조화 데이터 적용 여부도 점검하자. 원문에서 구체적인 설정 예시와 업계 반응을 더 확인할 수 있다.

---

**원문 전체 보기**: [What Apple's Gemini-Powered Siri Means For Search Visibility](https://www.searchenginejournal.com/what-apples-gemini-powered-siri-means-for-search-visibility/578931/) ([Search Engine Journal](https://www.searchenginejournal.com/what-apples-gemini-powered-siri-means-for-search-visibility/578931/))