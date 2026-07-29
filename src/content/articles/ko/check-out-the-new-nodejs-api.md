---
id: "/blog/announcements/new-api-docs-beta?1784919600000"
tool: "nodejs"
title: "Node.js API 문서 새 디자인 베타 미리보기 공개"
link: "https://nodejs.org/en/blog/announcements/new-api-docs-beta"
pubDate: 2026-07-24T19:00:00.000Z
sourceName: "Node.js Blog"
sourceUrl: "https://nodejs.org/en/blog/announcements/new-api-docs-beta"
contentType: "commentary"
summary: "Node.js 프로젝트가 API 문서의 디자인과 내비게이션을 전면 개편한 베타 버전을 beta.docs.nodejs.org에 공개했다. 문서 내용 자체는 동일하지만, 내장 검색·통합 디자인 시스템·llms.txt 등이 추가됐다."
---

Node.js Blog에서 API 문서의 새로운 베타 버전을 공개했다. beta.docs.nodejs.org에서 미리 사용해 볼 수 있으며, 정식 전환 전 실사용 피드백을 모으는 단계다.

## 무엇이 새로운가

문서 콘텐츠 자체는 기존과 동일하다 — 여전히 nodejs/node 저장소의 같은 Markdown 파일에서 생성된다. 달라진 건 프레젠테이션 레이어다. 가장 눈에 띄는 추가 기능은 **내장 검색**으로, 모든 페이지에 검색 박스와 키보드 단축키가 제공되어 외부 검색 엔진 없이 API를 탐색할 수 있다. nodejs.org 웹사이트와 동일한 디자인 시스템을 적용해 영구 사이드바, 페이지별 목차, 모바일 대응 레이아웃이 들어갔다. AI 도구를 위한 **llms.txt**도 이미 포함되어 있고, JavaScript 비활성화 및 오프라인 환경에서도 페이지가 동작한다. 내부적으로는 기존 레거시 문서 생성기를 대체하는 **doc-kit**이라는 독립 도구로 빌드된다.

## 설정 파일에 어떤 의미인가

솔직히 말하면, 이번 변경은 문서 생성·표시 파이프라인의 교체이므로 **프로젝트의 Node.js 설정 파일(package.json, .node-version, tsconfig 등)에 직접적인 영향은 없다.** 기존 ESM/CJS 전환 토글도 그대로 유지되므로, `"type": "module"` 같은 설정 관련 문서를 참조하는 워크플로에 변화가 생기지는 않는다.

다만 doc-kit을 자체 프로젝트 문서 생성에 활용하려는 경우, doc-kit 저장소의 설정 방식을 별도로 확인해야 한다 — 원문에서는 구체적인 설정 옵션까지 다루지 않으므로 해당 저장소를 직접 참고하는 편이 정확하다.

## 다음 단계 제안

beta.docs.nodejs.org를 일상 레퍼런스로 한두 주 써 보고, 불편한 점이 있으면 nodejs/doc-kit 저장소에 이슈를 열어 피드백하자. 특히 내장 검색의 정확도와 오프라인 사용성은 직접 체감해 봐야 판단할 수 있다. Node.js 프로젝트 설정을 새로 잡아야 한다면 [Node.js 설정 생성](/ko/generator/nodejs)에서 기본 구조를 빠르게 만들 수 있다.

---

**원문 전체 보기**: [Check out the New Node.js API Documentation Preview](https://nodejs.org/en/blog/announcements/new-api-docs-beta) ([Node.js Blog](https://nodejs.org/en/blog/announcements/new-api-docs-beta))