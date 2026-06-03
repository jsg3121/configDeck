---
id: "https://huggingface.co/blog/Hcompany/holo31"
tool: "huggingface"
title: "Holo3.1: 빠르고 로컬에서 동작하는 컴퓨터 사용 에이전트"
link: "https://huggingface.co/blog/Hcompany/holo31"
pubDate: 2026-06-02T14:13:23.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/Hcompany/holo31"
contentType: "commentary"
summary: "H Company가 Holo3.1 모델 패밀리를 공개했다. 웹·데스크톱·모바일 환경을 아우르는 컴퓨터 사용 에이전트로, 양자화 체크포인트를 통한 로컬 추론을 처음으로 공식 지원한다."
---

H Company가 Hugging Face Blog를 통해 Holo3.1 모델 패밀리를 발표했다. Qwen 기반의 컴퓨터 사용(Computer Use) 에이전트 모델로, 브라우저·데스크톱에 더해 모바일 환경까지 지원 범위를 넓히고, 로컬 추론을 위한 양자화 체크포인트를 처음 제공한다.

## 무엇이 새로운가

모델 크기는 0.8B, 4B, 9B, 35B-A3B 네 가지로 나뉜다. 모바일 성능이 눈에 띄는데, AndroidWorld 벤치마크에서 35B-A3B 모델은 67%에서 79.3%로, 4B·9B 모델은 58%에서 72%로 개선됐다. 기존 Holo3의 구조화 JSON 출력에 더해 function-calling 프로토콜을 네이티브로 지원하며, Holotab 하네스 기준 Holo3 대비 25% 이상 성능 향상이 있다고 밝혔다.

양자화 체크포인트는 35B-A3B 모델 기준 FP8, Q4 GGUF, NVFP4 세 종류가 제공된다. NVFP4(W4A16)는 DGX Spark에서 BF16 대비 1.74배 토큰 처리량을 기록하면서도 OSWorld 점수 하락은 약 2포인트 수준이라고 한다. NVIDIA와 공동으로 에이전트 하네스를 최적화한 결과, FP8 기준 평균 스텝 시간 6.8초를 NVFP4로 3.3초까지 줄여 약 2배의 end-to-end 속도 향상을 달성했다. Q4 GGUF 체크포인트는 Apple Silicon을 포함한 소비자 하드웨어에서의 완전 로컬 실행을 목표로 한다.

## 설정 파일에 어떤 의미인가

Holo3.1은 추론 모델 자체이므로 빌드 도구나 린터 같은 프로젝트 설정 파일에 직접 영향을 주는 성격은 아니다. 다만 에이전트 파이프라인을 자체 인프라에 구성하는 팀이라면 배포 타깃에 따라 양자화 포맷(FP8, NVFP4, GGUF)을 선택하고, vLLM 등 서빙 레이어 설정을 맞춰야 한다. 원문에서 function-calling과 JSON 출력 간 성능 패리티가 확보됐다고 언급하므로, 기존 Holo3를 JSON 모드로 사용 중이었다면 에이전트 프레임워크 쪽 호출 방식 변경 여부를 검토할 시점이다. 구체적인 서빙 설정이나 마이그레이션 가이드는 원문에 상세히 다뤄지지 않았으므로, Hugging Face 컬렉션 페이지와 Holo Models API 문서를 직접 확인하는 편이 정확하다.

## 다음 단계 제안

로컬 컴퓨터 사용 에이전트에 관심 있다면, 우선 Hugging Face의 Holo3.1 컬렉션에서 자신의 하드웨어에 맞는 양자화 체크포인트를 확인하고, 0.8B나 4B 같은 작은 모델부터 로컬에서 돌려보는 것이 부담이 적다. 프로덕션 도입을 고려한다면 AndroidWorld·OSWorld 벤치마크 수치와 자신의 워크플로 환경이 얼마나 일치하는지 원문의 비교표를 꼼꼼히 살펴보길 권한다.

---

**원문 전체 보기**: [Holo3.1: Fast & Local Computer Use Agents](https://huggingface.co/blog/Hcompany/holo31) ([Hugging Face Blog](https://huggingface.co/blog/Hcompany/holo31))