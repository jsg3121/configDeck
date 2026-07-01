---
id: "https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/"
tool: "googledeepmind"
title: "Nano Banana 2 Lite와 Gemini Omni Flash로 빌드 시작하기"
link: "https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/"
pubDate: 2026-06-30T16:02:40.000Z
sourceName: "Google DeepMind Blog"
sourceUrl: "https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/"
contentType: "commentary"
summary: "Google DeepMind가 Nano Banana 패밀리의 최신 경량 이미지 모델 Nano Banana 2 Lite와 영상 생성·편집 모델 Gemini Omni Flash를 Gemini API 및 Google AI Studio에 동시 공개했다."
---

Google DeepMind Blog가 2026년 6월 30일자로 두 가지 생성형 미디어 모델을 개발자에게 공개했다. Nano Banana 2 Lite(이미지)와 Gemini Omni Flash(비디오)로, 둘 다 Gemini API, Google AI Studio, Gemini Enterprise Agent Platform에서 바로 사용할 수 있다.

## 무엇이 새로운가

**Nano Banana 2 Lite**(모델 ID: `gemini-3.1-flash-lite-image`)는 텍스트-이미지 생성 레이턴시 4초, 1K 해상도 이미지당 $0.034 비용을 내세운다. 기존 첫 번째 Nano Banana(`gemini-2.5-flash-image`)를 대체하는 권장 모델로 안내되며, 교체 시 품질·속도·비용 모두에서 이점을 얻을 수 있다고 명시하고 있다. Nano Banana 패밀리는 이제 Lite → 2 → Pro → 레거시 순으로 네 단계 라인업을 갖추었다.

**Gemini Omni Flash**(모델 ID: `gemini-omni-flash-preview`)는 영상 생성·대화형 편집 모델로, 출력 비용은 초당 $0.10이다. 텍스트·이미지·비디오를 혼합한 멀티모달 입력을 지원하고, 자연어로 영상을 편집할 수 있다. 다만 현재 생성 길이는 10초로 제한되며, 오디오 레퍼런스 업로드와 장면 확장은 API에서 아직 미지원이다. 3초 이하 비디오 레퍼런스는 스키마에는 허용되지만 모델이 올바르게 처리하지 못한다고 원문이 직접 밝히고 있다.

두 모델을 체이닝하는 시나리오도 제시된다. Nano Banana 2 Lite로 이미지를 빠르게 생성한 뒤 Omni Flash에 레퍼런스로 넘겨 영상화하는 구조이며, Interactions API를 활용하면 최대 세 차례 순차 편집을 세션 컨텍스트 안에서 유지할 수 있다.

## 설정 파일에 어떤 의미인가

이번 발표는 인프라·빌드 설정 차원의 변경보다는 API 엔드포인트와 모델 ID 교체에 가까운 성격이다. 기존에 `gemini-2.5-flash-image`를 호출하던 코드나 설정 파일이 있다면 모델 ID를 `gemini-3.1-flash-lite-image`로 바꾸는 것이 권장 마이그레이션 경로다. 다만 구체적인 SDK 설정 변경이나 breaking change 목록은 원문에서 상세히 다루지 않으므로, 공식 개발자 문서를 반드시 확인해야 한다. Omni Flash는 프리뷰 단계이므로 프로덕션 파이프라인에 바로 넣기보다는 제약사항(10초 제한, 비디오 레퍼런스 미처리 등)을 먼저 파악하고 접근하는 편이 안전하다.

## 다음 단계 제안

기존 Nano Banana 모델을 사용 중이라면 모델 ID 교체 후 레이턴시와 비용 차이를 자체 벤치마크로 확인해 보는 것이 가장 직접적인 첫 단계다. Omni Flash에 관심이 있다면 원문에서 언급된 데모 앱을 리믹스해 두 모델 체이닝 워크플로를 먼저 체험해 보길 권한다. 양쪽 모두 정식 통합 가이드와 리전별 제한 사항은 Google 개발자 문서에서 최신 상태를 확인하는 것이 좋다.

---

**원문 전체 보기**: [Start building with Nano Banana 2 Lite and Gemini Omni Flash](https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/) ([Google DeepMind Blog](https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/))