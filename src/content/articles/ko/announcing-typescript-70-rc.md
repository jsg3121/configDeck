---
id: "https://devblogs.microsoft.com/typescript/?p=5203"
tool: "typescript"
title: "TypeScript 7.0 RC 발표 — Go로 재작성된 컴파일러의 첫 릴리스 후보"
link: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/"
pubDate: 2026-06-18T14:31:17.000Z
sourceName: "Microsoft TypeScript Blog"
sourceUrl: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/"
contentType: "commentary"
summary: "TypeScript 7.0 RC가 공개되었다. 기존 TypeScript 코드베이스를 Go로 포팅한 결과물로, TypeScript 6.0 대비 약 10배 빠른 성능을 보인다고 Microsoft가 밝혔다."
---

Microsoft TypeScript Blog에서 TypeScript 7.0 Release Candidate를 공식 발표했다. 기존 TypeScript(JavaScript로 컴파일되는 부트스트랩 코드베이스)를 Go로 포팅한 완전히 새로운 기반 위에 구축된 첫 번째 RC다.

## 무엇이 새로운가

핵심은 언어 자체의 변경이 아니라 컴파일러 구현의 전면 교체다. Go 네이티브 코드와 공유 메모리 병렬 처리를 결합해 TypeScript 6.0 대비 약 10배 빠른 속도를 달성했다고 한다. 타입 체킹 로직은 기존 구현과 구조적으로 동일하게 포팅되었으며, 10년간 축적된 테스트 스위트를 통과했다. 병렬화와 관련해 `--checkers` 플래그(기본값 4)로 타입 체커 워커 수를, `--builders` 플래그로 프로젝트 레퍼런스 빌드 병렬 수를 조절할 수 있다. Bloomberg, Canva, Figma, Google, Vercel 등 외부 팀들이 프리릴리스 빌드를 이미 대규모 코드베이스에서 사용 중이라고 밝혔다.

## 설정 파일에 어떤 의미인가

`tsconfig.json` 자체의 스키마 변경은 원문에서 언급되지 않았다. 타입 체킹 시맨틱이 6.0과 동일하므로 기존 설정이 그대로 동작할 가능성이 높지만, 새로 추가된 `--checkers`와 `--builders` 플래그는 CI 환경에 따라 튜닝이 필요할 수 있다. 특히 `--checkers` 수를 변경하면 드물게 순서 의존적 결과가 달라질 수 있다고 원문이 명시하고 있으므로, 팀 내 빌드 환경 간 일관성을 원한다면 이 값을 고정하는 것이 권장된다.

주의할 점은 프로그래매틱 API다. 안정적인 API는 7.1까지 제공되지 않으므로, `typescript-eslint` 등 TypeScript API에 의존하는 도구는 당분간 6.0이 필요하다. 원문은 `@typescript/typescript6` 호환 패키지와 npm alias를 통한 병행 설치 방법을 상세히 안내하고 있다. `package.json`에서 `"typescript": "npm:@typescript/typescript6@^6.0.0"`으로 alias를 걸면 기존 도구 체인이 6.0 API를 계속 사용하면서 7.0의 `tsc`도 함께 쓸 수 있다.

VS Code에서는 TypeScript Native Preview 확장을 설치하면 에디터 경험을 바로 체험할 수 있으며, LSP 기반이므로 다른 에디터에서도 활용 가능하다.

## 다음 단계 제안

가장 부담 없는 시작은 기존 프로젝트에 `npm install -D typescript@rc`를 실행하고 `npx tsc`로 빌드 결과를 비교해 보는 것이다. CI 러너처럼 자원이 제한된 환경이라면 `--checkers` 값을 낮춰 메모리 사용량을 조절하자. 새 프로젝트의 TypeScript 설정을 처음부터 구성해야 한다면 [TypeScript 설정 생성](/ko/generator/tsconfig)을 활용해 기본 틀을 잡은 뒤, 병렬화 플래그를 환경에 맞게 추가하는 방식을 권한다.

---

**원문 전체 보기**: [Announcing TypeScript 7.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/) ([Microsoft TypeScript Blog](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/))