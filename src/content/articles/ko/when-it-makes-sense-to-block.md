---
id: "https://smashingmagazine.com/2026/07/when-makes-sense-block-main-thread/"
tool: "smashingmagazine"
title: "메인 스레드를 '블로킹'하는 것이 오히려 합리적인 경우"
link: "https://smashingmagazine.com/2026/07/when-makes-sense-block-main-thread/"
pubDate: 2026-07-17T08:00:00.000Z
sourceName: "Smashing Magazine"
sourceUrl: "https://smashingmagazine.com/2026/07/when-makes-sense-block-main-thread/"
contentType: "commentary"
summary: "Smashing Magazine에서 Chrome 확장 프로그램 스크린샷 기능 구현 사례를 통해, 무조건 백그라운드 워커로 작업을 넘기는 것이 항상 최선이 아닐 수 있다는 주장을 다룬 글이 게시되었다."
---

Smashing Magazine에 Victor Ayomipo가 기고한 글로, "절대 메인 스레드를 블로킹하지 말라"는 웹 성능 원칙에 대한 예외 상황을 실제 Chrome 확장 프로그램 개발 경험을 통해 설명한다. 스크린샷 확장 프로그램 Fastary를 만들면서 Offscreen Document로 작업을 분리했음에도 2~3초의 레이턴시가 발생한 사례를 중심으로 전개된다.

## 무엇이 새로운가

글의 핵심 논점은 "작업 자체가 비싼가, 작업을 옮기는 것이 비싼가"를 구분해야 한다는 것이다. `postMessage()`가 내부적으로 사용하는 Structured Clone Algorithm(SCA)은 동기적 O(n) 복사 연산이며, 대용량 이미지 데이터를 전송할 때 직렬화-복사-역직렬화 비용 자체가 메인 스레드를 블로킹한다. Transferable Objects(`ArrayBuffer`, `ImageBitmap` 등)로 우회할 수 있지만, 전송 후 원본 컨텍스트에서 데이터 접근이 불가능해지고, Chrome 확장의 `chrome.runtime.sendMessage()`는 JSON 직렬화를 강제하기 때문에 Transferable을 쓸 수 없는 상황도 존재한다. 저자는 원칙을 "절대 메인 스레드를 블로킹하지 말라"가 아니라 "너무 오래 블로킹하지 말라"로 재해석해야 한다고 주장한다. 원문은 아키텍처 결정 과정의 구체적인 흐름을 포함하고 있으니 전체를 읽어볼 만하다.

## 설정 파일에 어떤 의미인가

이 글은 특정 도구의 설정 파일 변경이나 마이그레이션을 다루는 내용이 아니다. 다만 웹 워커 기반 아키텍처를 설정으로 제어하는 도구(예: Parcel, Vite의 worker 옵션, webpack의 `worker-loader` 등)를 사용하는 개발자라면, 무조건 워커로 분리하는 설정이 오히려 성능을 해치는 시나리오가 있다는 점을 인지할 필요가 있다. Chrome 확장 프로그램의 `manifest.json`에서 Offscreen Document 권한을 설정하는 패턴을 사용 중이라면, 해당 아키텍처의 데이터 전송 비용을 프로파일링해 보는 것이 좋다. 원문에서 구체적인 설정 변경 가이드가 제공되지는 않으므로, 프로젝트별로 직접 측정 후 판단해야 한다.

## 다음 단계 제안

Chrome 확장이나 워커 기반 아키텍처를 사용 중이라면, DevTools의 Performance 탭에서 `postMessage()` 호출 전후의 직렬화 시간을 측정해 보자. 데이터 크기에 따라 SCA 비용이 실제 처리 비용을 초과하는 경우가 있는지 확인하고, 그 결과에 따라 메인 스레드에서 직접 처리하는 방식을 검토할 수 있다. 원문에는 저자의 아키텍처 변경 과정이 더 상세히 나와 있다.

---

**원문 전체 보기**: [When It Makes Sense To "Block" The Main Thread](https://smashingmagazine.com/2026/07/when-makes-sense-block-main-thread/) ([Smashing Magazine](https://smashingmagazine.com/2026/07/when-makes-sense-block-main-thread/))