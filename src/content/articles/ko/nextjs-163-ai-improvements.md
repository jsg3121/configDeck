---
id: "/blog/next-16-3-ai-improvements"
tool: "nextjs"
title: "Next.js 16.3: AI 코딩 에이전트 지원 강화"
link: "https://nextjs.org/blog/next-16-3-ai-improvements"
pubDate: 2026-06-26T15:00:00.000Z
sourceName: "Next.js Blog"
sourceUrl: "https://nextjs.org/blog/next-16-3-ai-improvements"
contentType: "commentary"
summary: "Next.js 16.3 프리뷰가 AI 코딩 에이전트를 위한 AGENTS.md 자동 관리, 퍼스트파티 Skills, agent-browser React 인트로스펙션, 액션 가능한 에러 메뉴 등을 추가했다. 프레임워크가 에이전트 주도 개발을 일급 워크플로우로 끌어올리려는 방향이 뚜렷하다."
---

Next.js Blog에서 Next.js 16.3 프리뷰의 AI 관련 개선 사항을 공개했다. 16.0에서 도입된 DevTools MCP 서버, 16.2의 번들 문서·next-browser에 이어 에이전트 중심 개발 경험을 한층 더 넓히는 릴리스다.

## 무엇이 새로운가

핵심 변경은 여섯 가지다. 첫째, `next dev` 실행 시 AI 코딩 에이전트가 감지되면 `AGENTS.md`에 버전에 맞는 문서 포인터를 자동으로 삽입·갱신한다. 기존 프로젝트도 업그레이드만 하면 별도 작업 없이 적용되고, `agentRules: false` 옵션으로 끌 수 있다. 둘째, `next-dev-loop`, `next-cache-components-adoption`, `next-cache-components-optimizer` 세 가지 퍼스트파티 Skills가 추가됐다. 이전에 skills.sh에서 설치하던 지식형 Skills는 번들 문서로 대체되어 퇴역하며, `npx skills update`로 제거할 수 있다. 셋째, `next-browser`가 범용 `agent-browser` CLI로 통합되었고, 0.27 버전부터 React DevTools 인트로스펙션(컴포넌트 트리 탐색, 리렌더 프로파일링, Suspense 상태 확인 등)을 지원한다. 넷째, Cache Components 활성 상태에서 서버 측 await가 발생하면 Instant Insights가 세 가지 구체적 수정 옵션(Suspense 래핑, `"use cache"`, `export const instant = false`)을 에러 오버레이와 터미널 양쪽에 표시하고, "Copy as prompt" 버튼으로 에이전트에 바로 붙여넣을 수 있는 프롬프트를 생성한다. 다섯째, MCP 서버에서 지식 베이스 도구를 빼고 빌드 진단 도구를 추가해 범위를 좁혔다. 여섯째, nextjs.org/docs의 모든 URL에 `.md`를 붙이면 마크다운 원문을 받을 수 있다.

## 설정 파일에 어떤 의미인가

`next.config.ts`에 직접 영향을 주는 변경은 `agentRules` 옵션이다. AGENTS.md 자동 관리를 비활성화하려면 `agentRules: false`를 설정하면 된다. Cache Components를 켠 상태에서 Instant Insights가 동작하므로, Cache Components 관련 설정이 이미 적용되어 있는지 확인이 필요하다. 이전 버전의 skills.sh 기반 지식 Skills를 사용 중이라면 `npx skills update`로 정리해야 충돌을 피할 수 있다. `next-browser` CLI를 스크립트나 CI에서 참조하고 있었다면 `agent-browser`로 교체해야 한다. 그 외 빌드 설정이나 라우팅 설정의 breaking change는 원문에서 별도로 언급하지 않았으므로, 상세 마이그레이션 경로는 안정 릴리스 문서를 기다리는 것이 안전하다.

## 다음 단계 제안

아직 프리뷰 단계이므로 프로덕션 적용보다는 사이드 프로젝트에서 `next dev`를 실행해 AGENTS.md 자동 생성과 Instant Insights 에러 메뉴를 직접 확인해 보는 것을 권한다. Claude Code나 Cursor와 함께 `next-dev-loop` Skill을 돌려 보면 에이전트가 브라우저-빌드 피드백 루프를 얼마나 자율적으로 타는지 체감할 수 있다. 새 프로젝트의 Next.js 설정을 빠르게 잡고 싶다면 [Next.js 설정 생성](/ko/generator/nextjs)을 활용해도 좋다.

---

**원문 전체 보기**: [Next.js 16.3: AI Improvements](https://nextjs.org/blog/next-16-3-ai-improvements) ([Next.js Blog](https://nextjs.org/blog/next-16-3-ai-improvements))