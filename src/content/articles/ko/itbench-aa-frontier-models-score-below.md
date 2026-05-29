---
id: "https://huggingface.co/blog/ibm-research/itbench-aa"
tool: "huggingface"
title: "ITBench-AA: 최초의 에이전트 기반 엔터프라이즈 IT 벤치마크에서 최상위 모델들이 50% 미만 기록"
link: "https://huggingface.co/blog/ibm-research/itbench-aa"
pubDate: 2026-05-27T17:20:29.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/ibm-research/itbench-aa"
contentType: "commentary"
summary: "Artificial Analysis와 IBM이 Kubernetes 장애 대응 중심의 SRE 에이전트 벤치마크 ITBench-AA를 공개했으며, 현재 최상위 모델 어느 것도 정확도 50%를 넘지 못했다."
---

Artificial Analysis와 IBM Software Innovation Lab이 Hugging Face Blog를 통해 ITBench-AA SRE 벤치마크 결과를 공개했다. 이 벤치마크는 AI 모델이 Kubernetes 장애 스냅샷을 분석해 근본 원인 엔터티를 식별하는 에이전트 기반 SRE 태스크로 구성되어 있다.

## 무엇이 새로운가

총 59개 SRE 태스크(공개 40개, 비공개 19개)로 구성되며, 모델은 알림·이벤트·트레이스·메트릭·로그·토폴로지가 포함된 Kubernetes 장애 스냅샷에서 셸 명령을 통해 원인을 진단한다. 1위는 Claude Opus 4.7(Adaptive Reasoning, Max Effort)로 47%, GPT-5.5(xhigh)가 46%, Qwen3.7 Max가 42%로 뒤를 이었다. 주목할 점은 턴 수가 많다고 정확도가 높지 않다는 것이다. Gemini 3.1 Pro Preview는 평균 83턴을 사용하고도 30%에 그친 반면, GPT-5.5(xhigh)는 31턴으로 46%를 기록했다. 오픈 웨이트 모델 중에서는 GLM-5.1(Reasoning)이 40%로 선두를 차지했고, Gemma 4 31B(Reasoning)는 태스크당 $0.14의 비용으로 37%를 기록하며 비용 대비 효율 면에서 눈에 띈다. 스코어링은 recall-gated precision 방식이어서 실제 근본 원인을 모두 찾지 못하면 0점, 찾더라도 거짓 양성이 있으면 감점된다.

## 설정 파일에 어떤 의미인가

ITBench-AA는 설정 파일 포맷이나 빌드 도구 설정에 직접적인 영향을 주는 릴리스가 아니다. 다만 DevOps·SRE 도구 체인에 AI 에이전트를 통합하려는 팀이라면 관심을 가질 만하다. 평가에 사용된 에이전트 하네스 Stirrup은 오픈소스로 공개되어 있어, 자체 에이전트 파이프라인을 셋업할 때 참고할 수 있다. 현재 원문에서는 Stirrup의 구체적 설정 옵션이나 파이프라인 통합 방법을 자세히 다루지 않는다 — GitHub 레포와 arXiv 논문에서 상세 내용을 확인하는 편이 낫다.

## 다음 단계 제안

Kubernetes 운영 환경에서 AI 에이전트 도입을 검토 중이라면, ITBench-AA 데이터셋(HuggingFace 레포에 공개)을 내려받아 자체 모델이나 에이전트의 장애 진단 능력을 직접 측정해 보는 것이 실질적이다. 특히 턴 수 증가가 오히려 거짓 양성을 늘려 점수를 깎는다는 결과는, 에이전트의 탐색 깊이를 제한하는 전략이 비용과 정확도 양쪽에서 유리할 수 있음을 시사한다. 향후 FinOps·CISO 태스크도 추가될 예정이므로 리더보드를 주기적으로 확인하면 좋다.

---

**원문 전체 보기**: [ITBench-AA: Frontier Models Score Below 50% on the First Benchmark for Agentic Enterprise IT Tasks — by Artificial Analysis and IBM](https://huggingface.co/blog/ibm-research/itbench-aa) ([Hugging Face Blog](https://huggingface.co/blog/ibm-research/itbench-aa))