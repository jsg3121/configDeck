---
id: "https://www.searchenginejournal.com/lighthouse-fails-your-llms-txt-without-markdown-links/577590/"
tool: "searchenginejournal"
title: "Lighthouse가 마크다운 링크 없는 llms.txt를 실패 처리하는 이유"
link: "https://www.searchenginejournal.com/lighthouse-fails-your-llms-txt-without-markdown-links/577590/"
pubDate: 2026-07-03T14:00:03.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/lighthouse-fails-your-llms-txt-without-markdown-links/577590/"
contentType: "commentary"
summary: "Lighthouse의 새 Agentic Browsing 카테고리가 llms.txt를 마크다운으로 파싱하면서, 일반 텍스트 형식의 링크를 링크로 인식하지 못해 감사를 실패 처리한다. 파일 확장자와 MIME 타입은 text/plain인데 파서는 마크다운 문법을 요구하는 불일치가 핵심이다."
---

Search Engine Journal이 Lighthouse의 새로운 Agentic Browsing 감사 카테고리에서 llms.txt 검사가 마크다운 링크 문법을 강제하는 동작을 상세히 분석했다. 파일 확장자가 `.txt`이고 서버가 `text/plain`으로 응답하더라도, Lighthouse 파서는 내용을 마크다운으로 해석하며 `[text](url)` 형식이 아닌 링크는 전부 무시한다.

## 무엇이 새로운가

Lighthouse 13.3.0이 기존 Performance, Accessibility, SEO, Best Practices 옆에 Agentic Browsing 카테고리를 추가했다. 이 카테고리에는 기본 6개 감사 항목이 포함되며, 그중 하나가 llms.txt 검사(`llms-txt`)다. 카테고리 점수는 0~100이 아닌 분수 형태의 통과 비율로 반환된다. 원문 저자가 자신의 사이트에서 테스트한 결과, 5KB 이상의 구조화된 콘텐츠와 정확한 링크가 담긴 llms.txt 파일이 "File does not appear to contain any links"라는 에러와 함께 실패했다. 링크당 5글자(`[`, `]`, `(`, `)`, 그리고 구분자 변경)를 추가해 마크다운 문법으로 바꾸자 점수가 0.67에서 1.0으로 올라갔다. llmstxt.org의 공식 스펙 자체가 마크다운 문서를 명시하고 있어, Lighthouse는 그 스펙을 엄격히 따르는 것이다.

## 설정 파일에 어떤 의미인가

llms.txt는 전통적인 개발 도구 설정 파일은 아니지만, 사이트의 머신 가독성 레이어에 해당하는 선언 파일이다. 설정 관점에서 주목할 점은 파일 포맷과 파서 기대치의 불일치다. `.txt` 확장자와 `text/plain` MIME 타입이 암시하는 것과 실제 파서가 요구하는 것이 다르다는 사실은, CI에서 Lighthouse를 돌리거나 배포 파이프라인에 감사를 포함하는 팀에게 직접적인 영향을 준다. Agentic Browsing 카테고리가 CI 점수에 잡히기 시작하면, 지금까지 수동으로 관리하던 llms.txt의 포맷 규칙을 린트 단계에 추가해야 할 수 있다.

원문이 지적하듯, AIOSEO 같은 플러그인이 자동 생성하는 llms.txt는 마크다운 문법을 기본 출력하므로 감사를 통과하지만, 직접 작성한 파일은 실패할 가능성이 높다. 감사 통과 여부가 파일의 실제 품질이나 정확성을 반영하지 않는다는 점도 염두에 둘 필요가 있다. 이 감사는 "파싱 가능 여부"만 측정하며 "유용한 콘텐츠인지"는 판단하지 못한다.

## 다음 단계 제안

llms.txt를 이미 운영 중이라면 Lighthouse CLI로 `--only-categories=agentic-browsing` 옵션을 붙여 한번 돌려보는 것이 가장 빠른 확인 방법이다. 실패가 뜨면 링크를 `[텍스트](URL)` 형식으로 전환하면 된다. 기계적 변환이라 스크립트로 일괄 처리할 수 있다. 다만 감사 통과에만 집중하기보다, 파일 내용이 사이트를 정확히 기술하고 있는지 직접 검토하는 단계를 함께 두는 편이 낫다. Lighthouse가 점검하지 못하는 영역이 바로 그 부분이다.

---

**원문 전체 보기**: [Lighthouse Fails Your Llms.txt Without Markdown Links](https://www.searchenginejournal.com/lighthouse-fails-your-llms-txt-without-markdown-links/577590/) ([Search Engine Journal](https://www.searchenginejournal.com/lighthouse-fails-your-llms-txt-without-markdown-links/577590/))