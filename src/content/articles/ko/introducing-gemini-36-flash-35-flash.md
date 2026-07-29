---
id: "https://deepmind.google/blog/introducing-gemini-36-flash-35-flash-lite-and-35-flash-cyber/"
tool: "googledeepmind"
title: "Gemini 3.6 Flash, 3.5 Flash-Lite, 3.5 Flash Cyber 공개"
link: "https://deepmind.google/blog/introducing-gemini-36-flash-35-flash-lite-and-35-flash-cyber/"
pubDate: 2026-07-21T15:16:30.000Z
sourceName: "Google DeepMind Blog"
sourceUrl: "https://deepmind.google/blog/introducing-gemini-36-flash-35-flash-lite-and-35-flash-cyber/"
contentType: "commentary"
summary: "Google DeepMind이 Gemini Flash 시리즈 신규 모델 세 종을 발표했다. 토큰 효율성·지연시간·가격 측면에서 에이전트 워크플로 대규모 운용을 겨냥한 업데이트다."
---

Google DeepMind Blog에서 Gemini 3.6 Flash, 3.5 Flash-Lite, 3.5 Flash Cyber(CodeMender 결합) 세 가지 모델을 공개했다. 프로덕션 AI 에이전트를 대규모로 운영하는 개발자를 주 타깃으로 삼고 있다.

## 무엇이 새로운가

**3.6 Flash**는 3.5 Flash 대비 Artificial Analysis Index 기준 출력 토큰 사용량을 17% 줄이고, DeepSWE 같은 벤치마크에서는 최대 65%까지 줄였다고 밝혔다. 가격은 입력 $1.50/1M 토큰, 출력 $7.50/1M 토큰으로 3.5 Flash보다 낮다. DeepSWE 49% vs 37%, MLE Bench 63.9% vs 49.7%, OSWorld-Verified 83.0% vs 78.4% 등 코딩·에이전트·멀티모달 벤치마크 전반에서 상승폭을 보고했다. Computer use가 Gemini API의 빌트인 클라이언트 사이드 도구로 제공된다.

**3.5 Flash-Lite**는 350 출력 토큰/초(Artificial Analysis 측정)로 3.5 시리즈 최고 속도를 자처하며, 입력 $0.30/1M, 출력 $2.50/1M으로 가격 대비 성능 비를 강조한다. 3.1 Flash-Lite 대비 Terminal-Bench 2.1(54% vs 31%), GDPval-AA v2(1140 vs 642) 등에서 큰 폭의 개선을 보였고, 일부 에이전트·코딩 벤치마크에서는 기존 3 Flash까지 넘어선다.

**3.5 Flash Cyber**는 사이버보안 특화 모델로, CodeMender라는 코드 보안 에이전트와 함께 제공된다. 또한 Gemini 3.5 Pro가 파트너 테스트 중이며, Gemini 4 사전학습이 이미 시작됐다고 언급했다.

## 설정 파일에 어떤 의미인가

이번 발표는 LLM 모델 자체의 성능·가격 변경이므로 기존 설정 파일 포맷이 직접 바뀌지는 않는다. 다만 Gemini API를 호출하는 설정이 있다면 모델 식별자(model name) 교체가 필요할 수 있다. 원문에서는 구체적인 API 엔드포인트 변경이나 SDK 마이그레이션 절차를 다루지 않으므로, 기존 3.5 Flash 기반 파이프라인을 운영 중이라면 공식 모델 카드와 API 문서를 직접 확인하는 편이 안전하다. Computer use가 빌트인 도구로 전환됐다는 점은 별도 플러그인이나 도구 설정을 걷어낼 수 있는 여지가 있지만, 구체적 설정 방법은 원문에서도 상세히 다루지 않았다.

3.5 Flash-Lite의 thinking level 설정(minimal, low, 그 이상)으로 지연시간과 추론 깊이를 워크로드별로 조절할 수 있다는 언급이 있으므로, 에이전트 오케스트레이션 설정에서 thinking level 파라미터를 새로 다뤄야 할 가능성이 있다.

## 다음 단계 제안

현재 3.5 Flash나 이전 Flash-Lite를 프로덕션에서 쓰고 있다면, 3.6 Flash의 토큰 효율성 개선과 가격 인하가 비용에 어떤 영향을 주는지 기존 워크로드 기준으로 빠르게 추산해 볼 만하다. 고처리량·저지연이 핵심인 파이프라인은 3.5 Flash-Lite로 전환 시 비용 절감 여부를 확인하자. 원문에 링크된 3.6 Flash 모델 카드에서 안전성 가드레일 변경 사항도 함께 확인하는 것을 권한다.

---

**원문 전체 보기**: [Introducing Gemini 3.6 Flash, 3.5 Flash-Lite, and 3.5 Flash Cyber](https://deepmind.google/blog/introducing-gemini-36-flash-35-flash-lite-and-35-flash-cyber/) ([Google DeepMind Blog](https://deepmind.google/blog/introducing-gemini-36-flash-35-flash-lite-and-35-flash-cyber/))