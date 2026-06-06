---
id: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim"
tool: "huggingface"
title: "Thousand Token Wood: 3B 모델 위에 멀티 에이전트 경제 시뮬레이션 올리기"
link: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim"
pubDate: 2026-06-05T22:18:46.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim"
contentType: "commentary"
summary: "Qwen2.5-3B 기반 에이전트 다섯 개로 실시간 경제 시뮬레이션을 구축한 Build Small Hackathon 프로젝트의 엔지니어링 후기. 소형 모델의 포맷 생성 능력과 추론 한계를 구조·프롬프트로 메꾼 사례 보고다."
---

Hugging Face Blog에 Build Small Hackathon 참가작 Thousand Token Wood의 엔지니어링 후기가 올라왔다. Qwen2.5-3B 모델 다섯 인스턴스를 에이전트로 돌리며 실시간 경제 시뮬레이션을 만든 과정과, 소형 모델의 실질적 한계를 어떻게 우회했는지를 다룬다.

## 무엇이 새로운가

핵심 관찰은 명쾌하다. 3B 모델은 JSON 포맷 출력 성공률 100%(75회 호출 기준)를 보였지만, 경제적 판단은 형편없었다 — 자기가 생산하는 물건을 사려는 주문을 내는 수준이었다. 해법은 모델 크기를 키우는 것이 아니라 프롬프트를 정밀하게 다듬는 것이었다. 에이전트별로 생산 품목과 부족한 품목 목록을 명시하고 예시를 하나 넣자 거래 품질이 올라갔다. 시뮬레이션 인프라는 vLLM을 Modal 위에서 서빙하고, Gradio를 프론트엔드로 쓴 구성이다. 튤립 마니아, 남해 버블 같은 역사적 에피소드를 "숲 전설" 카드로 주입하면 에이전트가 스크립트 없이 자산 투매, 가격 폭락 등을 재현한다는 점이 데모의 포인트다.

## 설정 파일에 어떤 의미인가

이 프로젝트는 특정 라이브러리의 설정 스키마 변경이나 breaking change를 수반하지 않는다. vLLM 서빙 설정, Modal 배포 설정, Gradio 앱 구성 등이 언급되지만 원문은 구체적인 설정 파일 내용이나 옵션을 공개하지 않았다. 다만 소형 모델 멀티 에이전트 파이프라인을 직접 구성하려는 팀이라면 주목할 패턴이 있다. JSON 출력이 깨질 때를 대비한 parse-and-repair 레이어, 응답 실패 시 no-op으로 degradation하는 방어 로직 등은 에이전트 오케스트레이션 설정을 설계할 때 참고할 수 있는 구조다. 구체적 설정 예시는 원문에도 없으므로, 공개된 Space와 에이전트 트레이스 데이터셋을 직접 확인하는 편이 낫다.

## 다음 단계 제안

원문 링크의 Space에서 시뮬레이션을 직접 돌려보고, 공개된 에이전트 트레이스 데이터셋에서 프롬프트-응답 쌍을 살펴보는 것이 가장 빠른 학습 경로다. 소형 모델로 멀티 에이전트 시스템을 고려 중이라면, "포맷은 모델에 맡기고 판단은 프롬프트와 시스템 규칙으로 보강한다"는 이 프로젝트의 설계 원칙이 자기 파이프라인에도 적용 가능한지 점검해볼 만하다.

---

**원문 전체 보기**: [Thousand Token Wood: shipping a multi-agent economy on a 3B model](https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim) ([Hugging Face Blog](https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim))