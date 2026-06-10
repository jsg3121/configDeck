---
id: "https://huggingface.co/blog/ServiceNow-AI/code-switching"
tool: "huggingface"
title: "음성 에이전트는 이중 언어 고객을 처리할 수 있는가? 코드스위칭 음성에 대한 최신 ASR 벤치마크"
link: "https://huggingface.co/blog/ServiceNow-AI/code-switching"
pubDate: 2026-06-09T19:38:28.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/ServiceNow-AI/code-switching"
contentType: "commentary"
summary: "ServiceNow AI 팀이 이중 언어 코드스위칭 음성에 대해 7개 ASR 모델을 벤치마크한 결과를 Hugging Face Blog를 통해 공개했다. ElevenLabs Scribe V2, Gemini 3 Flash, AssemblyAI Universal 3-Pro가 상위권을 차지했다."
---

ServiceNow AI 팀이 Hugging Face Blog를 통해 코드스위칭(문장 중간에 언어를 전환하는 현상) 음성에 대한 ASR 벤치마크 결과를 발표했다. 엔터프라이즈 음성 에이전트 파이프라인의 첫 단계인 음성 인식이 이중 언어 환경에서 얼마나 정확한지를 측정한 연구다.

## 무엇이 새로운가

벤치마크는 스페인어-영어, 프랑스어-영어, 캐나다 프랑스어-영어, 독일어-영어 네 가지 언어 쌍을 대상으로 한다. 데이터는 HR 문의와 IT 서비스 관리(ITSM) 시나리오를 기반으로 GPT-5로 코드스위칭 텍스트를 생성하고, ElevenLabs Multilingual V2로 음성을 합성한 뒤 원어민 언어학자가 검수하는 파이프라인을 거쳤다. 최종 데이터셋은 언어 쌍별로 173~298건 규모다. 평가 지표는 WER(단어 오류율), SWER(의미적 단어 오류율), AER(답변 오류율) 세 가지를 사용한다. 7개 모델 중 ElevenLabs Scribe V2가 WER·SWER·AER 전 지표에서 1위를 기록했고, Gemini 3 Flash는 AER에서 AssemblyAI를 제치고 2위로 올라섰다. OpenAI Whisper Large V3 Turbo는 언어 파라미터 없이 코드스위칭 오디오를 넣으면 영어로 번역해 버리는 알려진 한계로 인해 최하위였다.

## 설정 파일에 어떤 의미인가

이번 발표는 ASR 모델 선택에 관한 벤치마크이지, 특정 라이브러리의 설정 파일 스키마나 구성 방식이 바뀌는 내용은 아니다. 다만 음성 에이전트 파이프라인을 구성할 때 ASR 모델을 환경 변수나 파이프라인 설정에서 지정하는 경우가 많은데, Whisper 계열을 코드스위칭 환경에서 사용한다면 `language` 파라미터를 명시적으로 설정해야 한다는 점은 실무적으로 중요하다. 벤치마크 데이터와 평가 도구는 ServiceNow의 AU-Harness를 통해 공개되므로, 자체 음성 파이프라인의 ASR 구성을 검증하려는 팀이라면 직접 재현해 볼 수 있다. 설정 파일 차원의 breaking change나 마이그레이션은 원문에서 다루지 않았다.

## 다음 단계 제안

이중 언어 고객을 상대하는 음성 에이전트를 운영 중이라면, 현재 사용 중인 ASR 모델이 코드스위칭에서 어떤 수준의 오류율을 보이는지 원문의 언어 쌍별 상세 결과를 확인해 볼 만하다. 특히 Whisper 기반 파이프라인이라면 언어 파라미터 누락 여부를 즉시 점검하고, AU-Harness를 통해 자사 도메인 데이터로 벤치마크를 재현해 보는 것이 실질적인 첫걸음이 될 것이다.

---

**원문 전체 보기**: [Can Voice Agents Handle Bilingual Customers? Benchmarking Frontier ASR on Code-Switched Speech](https://huggingface.co/blog/ServiceNow-AI/code-switching) ([Hugging Face Blog](https://huggingface.co/blog/ServiceNow-AI/code-switching))