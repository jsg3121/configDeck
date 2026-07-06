---
id: "https://www.searchenginejournal.com/google-put-ai-visibility-inside-the-seo-tool-on-purpose/577889/"
tool: "searchenginejournal"
title: "구글이 AI 가시성을 SEO 도구 안에 넣은 건 의도적이었다"
link: "https://www.searchenginejournal.com/google-put-ai-visibility-inside-the-seo-tool-on-purpose/577889/"
pubDate: 2026-07-05T12:00:33.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-put-ai-visibility-inside-the-seo-tool-on-purpose/577889/"
contentType: "commentary"
summary: "구글이 Search Console 안에 AI Overviews·AI Mode 노출 리포트를 추가했다. Search Engine Journal은 별도 도구가 아닌 기존 SEO 도구 내 배치 자체가 'GEO는 SEO와 별개가 아니다'라는 구글의 입장 표명이라고 분석한다."
---

Search Engine Journal이 구글의 Search Console AI 가시성 리포트 추가를 분석하는 글을 게재했다. 핵심 논점은 새 기능 자체보다 그것이 기존 Search Console 안에 배치되었다는 사실이 전하는 메시지다.

## 무엇이 새로운가

구글이 Search Console에 생성형 AI 퍼포먼스 리포트를 추가한다. AI Overviews, AI Mode, Discover의 AI 기능에서 페이지가 노출된 횟수(임프레션)를 보여주며, 기존 퍼포먼스 리포트와 동일한 차원—페이지, 국가, 디바이스, 날짜(시간 단위 세분화 포함)—을 제공한다. 현재 영국 웹사이트 일부에 먼저 롤아웃 중이다. 중요한 두 가지 부재: 클릭 데이터는 제공하지 않으며(노출만), 동시에 AI 응답에서 콘텐츠를 제외할 수 있는 옵트아웃 컨트롤도 함께 출시됐다. 즉 노출 계기판과 퇴장 스위치를 동시에 건넨 셈이다.

## 설정 파일에 어떤 의미인가

이 소식은 개발자 도구의 설정 파일(config)을 직접 변경하는 종류의 발표가 아니다. robots.txt나 메타 태그 수준에서 AI 크롤러 옵트아웃과 관련된 설정이 이미 존재하지만, 원문은 구체적인 설정 방법이나 새로운 디렉티브를 다루지 않는다. 다만 개발자 관점에서 짚을 부분은 있다. 옵트아웃 컨트롤이 Search Console UI에 들어왔다는 것은, 기존에 서버 사이드 설정(예: robots.txt의 사용자 에이전트 차단, 메타 태그 nosnippet 등)으로 관리하던 AI 노출 제어가 구글 쪽 대시보드에서도 가능해졌음을 시사한다. 하지만 이 옵트아웃이 기존 서버 설정과 어떻게 상호작용하는지—우선순위가 어떤지, 충돌 시 어떤 쪽이 적용되는지—는 원문에서 다루지 않았다. 공식 문서가 구체화되면 다시 정리할 필요가 있다.

## 다음 단계 제안

영국 외 지역이라면 당장 할 일은 없지만, 롤아웃이 확대되기 전에 현재 사이트의 AI 크롤러 관련 설정(robots.txt 내 AI 봇 규칙, 메타 태그 등)을 점검해 두는 것이 좋다. Search Console에 옵트아웃 스위치가 생겼다고 해서 서버 사이드 설정을 무시해도 된다는 의미는 아니다. 원문이 강조하듯 임프레션 데이터만으로 비즈니스 성과를 판단하는 함정에 빠지지 않도록, ChatGPT·Claude·Perplexity 등 구글 외 AI 엔진의 노출까지 함께 볼 수 있는 크로스엔진 모니터링 체계를 병행하는 편이 현실적이다.

---

**원문 전체 보기**: [Google Put AI Visibility Inside The SEO Tool On Purpose](https://www.searchenginejournal.com/google-put-ai-visibility-inside-the-seo-tool-on-purpose/577889/) ([Search Engine Journal](https://www.searchenginejournal.com/google-put-ai-visibility-inside-the-seo-tool-on-purpose/577889/))