---
id: "https://www.searchenginejournal.com/google-notebooklm-rebrand-may-expose-your-site-to-more-ai-scraping/582775/"
tool: "searchenginejournal"
title: "Google NotebookLM의 Gemini Notebook 리브랜딩, 사이트가 더 많은 AI 스크래핑에 노출될 수 있다"
link: "https://www.searchenginejournal.com/google-notebooklm-rebrand-may-expose-your-site-to-more-ai-scraping/582775/"
pubDate: 2026-07-18T10:09:29.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-notebooklm-rebrand-may-expose-your-site-to-more-ai-scraping/582775/"
contentType: "commentary"
summary: "Google NotebookLM이 Gemini Notebook으로 리브랜딩되면서 user agent 문자열이 변경되었고, 기존 차단 설정을 업데이트하지 않으면 2026년 8월부터 AI 스크래핑을 막을 수 없게 된다."
---

Search Engine Journal이 Google NotebookLM의 Gemini Notebook 리브랜딩에 따른 user agent 변경과 사이트 보호 관련 이슈를 정리했다. 기존에 `Google-NotebookLM` user agent를 기준으로 차단 규칙을 설정해 둔 사이트 운영자라면 조치가 필요한 시점이다.

## 무엇이 새로운가

기존 user agent `Google-NotebookLM`이 `Google-GeminiNotebook`으로 변경되었다. Google 문서에서 이전 user agent는 2026년 8월까지만 지원된다고 명시하고 있으므로 유예 기간은 몇 주 남짓이다. Gemini Notebook의 user-triggered fetcher는 사용자 요청에 의해 작동하기 때문에 robots.txt를 따르지 않는다 — 이 점은 리브랜딩 전후로 달라지지 않았다. 또한 Discover Sources 기능은 사용자가 지정한 주제에 맞는 온라인 글을 최대 10개까지 자동으로 가져와 AI 요약을 생성하며, 원본 사이트로의 레퍼럴은 발생하지 않는다. Project Mariner 관련 언급도 문서에서 완전히 제거되었다.

## 설정 파일에 어떤 의미인가

이번 변경의 핵심은 서버 사이드 설정 파일에 직접적인 영향을 준다는 점이다. `.htaccess`에 `Google-NotebookLM` 문자열로 차단 규칙을 하드코딩해 둔 경우, 8월 이후에는 새로운 user agent를 잡아내지 못한다. 원문에서는 `.htaccess`의 `RewriteCond`에서 `Google-GeminiNotebook`을 매칭하는 예시를 제공하고 있다. 방화벽(WAF) 규칙에서도 동일하게 user agent 문자열을 업데이트해야 한다.

robots.txt로는 이 fetcher를 차단할 수 없다는 점을 다시 강조할 필요가 있다. robots.txt에 `Google-NotebookLM`이나 `Google-GeminiNotebook`을 넣어봤자 무시된다. 실질적인 차단은 `.htaccess` 또는 방화벽 레벨에서만 가능하다. 개발자 도구 설정 관점에서 보면, CI/CD 파이프라인에서 `.htaccess`를 템플릿으로 관리하거나 IaC(Infrastructure as Code)로 WAF 규칙을 정의하는 경우 해당 문자열을 일괄 교체해야 한다.

## 다음 단계 제안

우선 현재 서버 설정 파일과 방화벽 규칙에서 `Google-NotebookLM` 문자열을 검색해 `Google-GeminiNotebook`으로 교체하는 것이 가장 급하다. grep이나 IDE 전체 검색으로 `.htaccess`, nginx conf, CDN 규칙 등을 훑어보면 된다. 원문에서 제공하는 새로운 모바일·데스크톱 user agent 전체 문자열도 확인해 두면 더 정밀한 매칭이 가능하다. 8월 이전에 처리하지 않으면 기존 차단이 조용히 무력화되므로, 콘텐츠 보호가 중요한 사이트라면 지금 바로 점검하길 권한다.

---

**원문 전체 보기**: [Google NotebookLM Rebrand May Expose Your Site To More AI Scraping](https://www.searchenginejournal.com/google-notebooklm-rebrand-may-expose-your-site-to-more-ai-scraping/582775/) ([Search Engine Journal](https://www.searchenginejournal.com/google-notebooklm-rebrand-may-expose-your-site-to-more-ai-scraping/582775/))