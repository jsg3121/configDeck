---
id: "https://css-tricks.com/?p=393604"
tool: "csstricks"
title: "곧 자바스크립트를 ShadowRealm으로 추방할 수 있게 된다"
link: "https://css-tricks.com/soon-we-can-finally-banish-javascript-to-the-shadowrealm/"
pubDate: 2026-05-12T13:59:35.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/soon-we-can-finally-banish-javascript-to-the-shadowrealm/"
contentType: "commentary"
summary: "TC39에서 진행 중인 ShadowRealm 제안을 CSS-Tricks가 상세히 해설했다. 메인 스레드를 공유하면서도 별도의 전역·내장 객체를 갖는 격리된 realm을 통해 서드파티 코드 샌드박싱 등의 사용 사례를 다룬다."
---

CSS-Tricks가 TC39의 ShadowRealm API 제안을 깊이 있게 해설하는 글을 게시했다. 자바스크립트의 realm 개념부터 시작해 ShadowRealm이 왜 필요한지, 기존 realm·Web Worker와 어떻게 다른지를 차근차근 풀어낸다.

## 무엇이 새로운가

ShadowRealm은 자체 전역 객체와 내장 객체(Array, Object 등)를 갖지만 **별도의 실행 스레드는 갖지 않는** 새로운 종류의 realm이다. 코드를 ShadowRealm에 넘기면 여전히 생성 측 realm의 메인 스레드에서 실행되므로, Web Worker처럼 메시지 기반 통신을 할 필요가 없다. 핵심 사용 사례로 원문은 테스트 스위트의 "클린룸" 실행, 서드파티 라이브러리의 전역 스코프 오염 방지, 광고·애널리틱스 스크립트 격리 등을 언급한다. 기존 iframe을 이용한 realm 분리와 달리 DOM이나 별도 문서 컨텍스트 없이 순수 자바스크립트 수준의 샌드박스를 제공하는 것이 차별점이다. 아직 TC39 제안 단계이므로 브라우저 구현 상태나 최종 API 형태는 원문에서도 확정적으로 다루지 않는다.

## 설정 파일에 어떤 의미인가

현재 시점에서 ShadowRealm이 기존 빌드·번들러·린터 설정 파일에 직접적인 변경을 요구하지는 않는다. 다만 장기적으로 몇 가지 접점이 생길 수 있다.

- **테스트 러너 설정**: Jest, Vitest 등이 ShadowRealm을 테스트 격리 전략으로 채택하면, 테스트 환경 설정(`testEnvironment` 등)에 새 옵션이 추가될 가능성이 있다.
- **번들러 타깃**: ShadowRealm 내부에서 실행될 코드를 별도 엔트리로 번들링해야 한다면 Webpack·Vite 설정에 엔트리 포인트나 출력 형식 관련 조정이 필요할 수 있다.
- **ESLint·TypeScript**: ShadowRealm API가 표준화되면 `@typescript-eslint`나 `lib` 설정에서 해당 전역 타입을 포함해야 한다.

다만 이 모두 제안이 Stage 4에 도달하고 런타임이 구현한 이후의 이야기다. 원문에서도 구체적인 설정 변경 사항은 다루지 않으므로, 공식 사양이 확정되면 다시 정리하겠다.

## 다음 단계 제안

원문은 realm의 기초 개념부터 ShadowRealm의 동기까지 꼼꼼하게 설명하고 있어, 자바스크립트 런타임 모델을 복습하기에 좋은 글이다. TC39 제안 저장소에서 현재 스테이지와 열린 이슈를 확인해 두면, 향후 도구 체인 변경에 선제적으로 대응할 수 있다. 당장 설정을 바꿀 일은 없지만, 서드파티 스크립트 격리가 프로젝트의 관심사라면 제안 진행 상황을 워치리스트에 넣어 두길 권한다.

---

**원문 전체 보기**: [Soon We Can Finally Banish JavaScript to the ShadowRealm](https://css-tricks.com/soon-we-can-finally-banish-javascript-to-the-shadowrealm/) ([CSS-Tricks](https://css-tricks.com/soon-we-can-finally-banish-javascript-to-the-shadowrealm/))