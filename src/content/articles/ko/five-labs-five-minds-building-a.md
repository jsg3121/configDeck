---
id: "https://hugging face.co/blog/build-small-hackathon/thousand-token-wood-sim-v2"
tool: "huggingface"
title: "다섯 연구소, 다섯 모델: 소형 모델로 만든 멀티모델 금융 시뮬레이션 후기"
link: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim-v2"
pubDate: 2026-06-06T19:02:33.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim-v2"
contentType: "commentary"
summary: "Build Small Hackathon 참가작 'Thousand Token Wood v2'의 엔지니어링 후기. 네 개 연구소의 소형 모델을 에이전트별로 다르게 배치하고, 내부자 정보 방화벽·감정 메모리 등 구조적 장치로 신뢰성을 확보한 과정을 정리한다."
---

Hugging Face Blog에 Build Small Hackathon 참가작 **Thousand Token Wood v2**의 엔지니어링 보고서가 게시됐다. 한 명의 개발자가 네 개 연구소(OpenAI, OpenBMB, NVIDIA, 본인 파인튜닝 Qwen)의 소형 모델을 에이전트별로 배치해 경제 시뮬레이션 게임을 만든 과정과 교훈을 공유한다.

## 무엇이 새로운가

v1이 단일 0.5B 파인튜닝 모델로 다섯 에이전트를 돌렸다면, v2는 gpt-oss-20b, MiniCPM3-4B, Nemotron-Mini-4B, 파인튜닝 Qwen 0.5B 네 모델을 혼합 투입한다. 모두 32B 이하이며 Modal 위에서 서빙한다. 저자가 꼽는 핵심 교훈은 모델링 계층이 아니라 **서빙 계층**에서 마찰이 집중된다는 점이다. vLLM 0.22.1이 로드 시 JIT 컴파일을 수행하면서 nvcc를 요구해 CUDA devel 이미지로 베이스를 바꿔야 했고, gpt-oss-20b의 MXFP4 양자화는 24GB L4에 올라가지만 채널 포맷 래핑 후처리가 필요했으며, MiniCPM3는 `trust_remote_code` 한 줄이 추가로 필요했다. 이 차이들을 흡수하는 핵심 장치는 **관용적 JSON 파싱-수리 레이어**로, 모든 모델 출력이 이 레이어를 통과하며 살릴 수 없는 출력은 버린다. 한 번 구축하면 모델 추가가 설정 항목 하나로 끝난다는 설명이다.

또한 내부자 정보의 진위 플래그를 프롬프트 밖(플레이어 원장)에만 보관하고, 매 턴 에이전트 프롬프트 전체를 스캔해 금지 토큰 노출이 없는지 검증하는 테스트를 가장 중요한 테스트로 꼽았다. 감정 메모리는 정수 기반 감정값을 한 줄 버킷 요약으로 압축해 프롬프트에 넣고, 원시 히스토리는 절대 프롬프트에 포함하지 않는 방식으로 프롬프트 팽창을 억제한다.

## 설정 파일에 어떤 의미인가

이 글은 특정 라이브러리의 설정 스키마 변경을 다루는 것이 아니라 멀티모델 서빙 아키텍처의 실전 노하우를 공유하는 글이다. 다만 vLLM 서빙 환경을 구성하는 개발자에게 직접적으로 유용한 포인트가 있다. vLLM 0.22.1 기준으로 CUDA devel 이미지가 필수라는 점, 모델별로 `trust_remote_code` 같은 한 줄짜리 설정 차이가 존재한다는 점은 Docker 이미지나 서빙 설정을 작성할 때 참고할 만하다. 다만 구체적인 설정 파일 예시나 Docker 구성은 원문에도 상세히 나와 있지 않으므로, 실제 적용 시에는 각 모델 저장소의 문서를 직접 확인하는 편이 안전하다.

## 다음 단계 제안

소형 모델 여러 개를 하나의 애플리케이션에서 서빙하려는 경우, 이 글의 접근법 — 관용적 출력 파서를 공통 레이어로 두고 모델별 차이를 설정 항목으로 흡수 — 은 좋은 출발점이 된다. 원문에 파인튜닝 0.5B 모델의 신뢰도 수치와 방화벽 테스트 결과가 표로 정리돼 있으니, 유사한 멀티에이전트 구조를 설계 중이라면 원문의 "What actually happened" 표와 트레이스 데이터를 직접 확인해 보길 권한다.

---

**원문 전체 보기**: [Five labs, five minds: building a multi-model finance drama on small models](https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim-v2) ([Hugging Face Blog](https://huggingface.co/blog/build-small-hackathon/thousand-token-wood-sim-v2))