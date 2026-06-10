---
id: "https://deepmind.google/blog/fluid-natural-voice-translation-with-gemini-35-live-translate/"
tool: "googledeepmind"
title: "Gemini 3.5 Live Translate — 70개 이상 언어를 지원하는 실시간 음성 번역 모델 출시"
link: "https://deepmind.google/blog/fluid-natural-voice-translation-with-gemini-35-live-translate/"
pubDate: 2026-06-09T15:16:25.000Z
sourceName: "Google DeepMind Blog"
sourceUrl: "https://deepmind.google/blog/fluid-natural-voice-translation-with-gemini-35-live-translate/"
contentType: "commentary"
summary: "Google DeepMind이 70개 이상 언어를 지원하는 실시간 음성-음성 번역 모델 Gemini 3.5 Live Translate를 발표했다. Gemini Live API 퍼블릭 프리뷰, Google Meet 프라이빗 프리뷰, Google Translate 앱 글로벌 배포로 동시에 출시된다."
---

Google DeepMind Blog에서 Gemini 3.5 Live Translate를 공식 발표했다. 70개 이상 언어를 자동 감지하여 실시간에 가까운 음성-음성 번역을 수행하는 오디오 모델이다.

## 무엇이 새로운가

기존 턴-바이-턴 방식과 달리, 화자가 말하는 동안 연속적으로 번역 음성을 생성한다. 화자의 억양·속도·피치를 보존하며 몇 초 이내의 지연만 발생한다고 한다. 배포 채널은 세 가지다. 개발자용 Gemini Live API와 Google AI Studio 퍼블릭 프리뷰, 기업용 Google Meet 프라이빗 프리뷰(이번 달 시작), 일반 사용자용 Google Translate 앱(Android·iOS 글로벌 롤아웃)이다. Google Meet의 경우 기존 5개 언어에서 70개 이상 언어, 2000개 이상 언어 조합으로 확장되며, 영어 중심이던 번역 제한도 해제된다. 개발자 측면에서는 Agora, LiveKit, Pipecat 등 파트너 플랫폼이 실시간 미디어 스트리밍 인프라를 처리하므로, 개발자는 사용자 경험에 집중할 수 있다고 설명한다. 또한 생성된 모든 오디오에는 SynthID 워터마크가 적용된다.

## 설정 파일에 어떤 의미인가

이 모델은 별도 언어 설정 없이 다국어 입력을 자동 처리한다고 명시하고 있어, API 호출 시 소스·타깃 언어를 수동으로 구성할 필요가 줄어들 가능성이 있다. 다만 원문에는 구체적인 API 파라미터, SDK 설정 옵션, 기존 Gemini API와의 호환성 변경 사항 등 설정 수준의 세부 내용은 다루지 않았다. Gemini Cookbook에 데모와 예제 코드가 있다고 언급하므로, 실제 통합 설정을 준비하려면 해당 리소스를 먼저 확인하는 편이 낫다. 노이즈 로버스트니스가 내장되어 있다는 점은, 기존에 오디오 전처리 파이프라인을 따로 구성하던 경우 해당 단계를 단순화할 수 있음을 시사하지만, 구체적인 설정 방법은 공식 문서 공개를 기다려야 한다.

## 다음 단계 제안

Gemini Live API 퍼블릭 프리뷰가 이미 열려 있으므로, 실시간 음성 번역을 제품에 통합할 계획이 있다면 Google AI Studio에서 직접 테스트해 보는 것이 가장 빠르다. 원문에서 언급된 Gemini Cookbook의 데모 코드를 살펴보면 스트리밍 입출력 구조와 다국어 자동 감지 동작을 빠르게 파악할 수 있다. Google Meet 연동은 아직 프라이빗 프리뷰이므로, Workspace 관리자라면 사전 등록 여부를 확인해 두자.

---

**원문 전체 보기**: [Fluid, natural voice translation with Gemini 3.5 Live Translate](https://deepmind.google/blog/fluid-natural-voice-translation-with-gemini-35-live-translate/) ([Google DeepMind Blog](https://deepmind.google/blog/fluid-natural-voice-translation-with-gemini-35-live-translate/))