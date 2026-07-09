---
id: "https://devblogs.microsoft.com/typescript/?p=5246"
tool: "typescript"
title: "TypeScript 7.0 발표 — Go로 네이티브 포팅, 빌드 속도 최대 12배 향상"
link: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/"
pubDate: 2026-07-08T15:58:29.000Z
sourceName: "Microsoft TypeScript Blog"
sourceUrl: "https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/"
contentType: "commentary"
summary: "Microsoft가 TypeScript 7.0을 공식 출시했다. Go로 작성된 네이티브 포트로 풀 빌드 기준 8~12배 빠른 속도를 보이며, LSP 기반 에디터 지원과 멀티스레딩이 핵심이다."
---

Microsoft TypeScript Blog에서 TypeScript 7.0 정식 출시를 발표했다. 기존 TypeScript 컴파일러를 Go로 네이티브 포팅한 결과물로, 네이티브 코드 속도와 공유 메모리 멀티스레딩을 통해 대규모 프로젝트에서 체감 가능한 성능 개선을 제공한다.

## 무엇이 새로운가

원문에 따르면, 대형 오픈소스 코드베이스 기준 풀 빌드 속도가 7.7배(tldraw)에서 11.9배(VS Code)까지 빨라졌다. VS Code 코드베이스에서는 에디터를 열고 첫 에러를 확인하기까지 약 17.5초에서 1.3초 미만으로 줄었다고 한다. 메모리 사용량도 프로젝트에 따라 6%~26% 감소했다. 에디터 측면에서는 새로운 LSP(Language Server Protocol) 지원이 도입되어 VS Code, Visual Studio, WebStorm 등에서 바로 사용 가능하다. Slack은 CI 타입 체크 시간이 약 7.5분에서 1.25분으로 줄었다고 보고했고, Canva는 에디터에서 첫 에러 표시까지 약 58초에서 약 4.8초로 단축되었다고 한다.

## 설정 파일에 어떤 의미인가

설치 방식은 기존과 동일하게 `npm install -D typescript`로 진행한다. `tsconfig.json` 설정 형식 자체의 변경 사항은 원문에서 언급되지 않았다. 즉, 기존 설정 파일을 그대로 사용할 수 있을 가능성이 높지만, 구체적인 호환성 세부사항은 원문만으로 확인이 어렵다.

주의할 점은 TypeScript 7.0이 아직 **API를 제공하지 않는다**는 것이다. `typescript-eslint` 같은 도구가 프로그래밍 방식으로 컴파일러에 접근해야 하는 경우, `@typescript/typescript6` 호환 패키지를 함께 설치해서 6.0 API를 계속 사용해야 한다. 이 패키지는 `tsc6`이라는 별도 바이너리를 제공하므로 7.0의 `tsc`와 이름 충돌 없이 병렬 운영이 가능하다. 7.1에서 새로운(그리고 다른) API가 제공될 예정이라고 한다.

ESLint, Prettier, Next.js 등 기존 툴체인과의 상호작용에 대해서는 원문에서 자세히 다루지 않았다. 특히 `typescript-eslint` 사용자라면 `@typescript/typescript6` 패키지 설정이 추가로 필요할 수 있으므로, 공식 마이그레이션 가이드가 나오면 다시 정리하겠다.

## 다음 단계 제안

우선 비프로덕션 프로젝트에서 `npm install -D typescript`로 7.0을 설치하고 `npx tsc`로 기존 빌드가 정상 동작하는지 확인해 보자. `typescript-eslint`를 쓰고 있다면 `@typescript/typescript6` 패키지를 함께 설치하는 것을 잊지 말아야 한다. 새 프로젝트를 시작하거나 `tsconfig.json`을 처음 구성해야 한다면 [TypeScript 설정 생성](/ko/generator/tsconfig)을 활용해 볼 수 있다.

---

**원문 전체 보기**: [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) ([Microsoft TypeScript Blog](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/))