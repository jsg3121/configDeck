---
id: "https://huggingface.co/blog/Photoroom/prx-part4-data"
tool: "huggingface"
title: "PRX 시리즈 4편: Photoroom의 이미지 생성 모델 데이터 전략 공개"
link: "https://huggingface.co/blog/Photoroom/prx-part4-data"
pubDate: 2026-07-06T15:30:55.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/Photoroom/prx-part4-data"
contentType: "commentary"
summary: "Photoroom이 7B 규모 이미지 생성 모델 PRX의 사전학습 데이터 파이프라인 설계를 공개했다. 데이터 포맷 선택(Lance와 MDS 병용), 캡션 전략, JPEG 품질 검증 등 실무적 결정과 그 근거를 상세히 다룬다."
---

Photoroom이 Hugging Face Blog를 통해 PRX 시리즈 4편을 게시하며, 7B 이미지 생성 모델의 사전학습 데이터 파이프라인 전반을 공개했다. 모델 아키텍처와 학습 설계를 다룬 이전 편에 이어, 이번에는 데이터 수집·캡셔닝·포맷·저장까지의 과정과 실험 결과를 다룬다.

## 무엇이 새로운가

핵심 설계 결정이 몇 가지 눈에 띈다. 첫째, 데이터 포맷으로 Lance와 Mosaic Data Shards(MDS)를 병용한다. Lance는 컬럼형 포맷으로 필터링·탐색에 쓰고, MDS는 분산 학습 시 스트리밍에 쓰는 식이다. 둘째, 텍스트 인코더를 T5Gemma에서 Qwen3-VL로 교체하면서 텍스트 latent를 사전 계산하는 대신 학습 루프 안에서 온더플라이로 계산하도록 바꿨다. 7B 규모에서 처리량 손실은 약 3–4%(30일 학습 기준 약 1일 추가) 수준이었다고 한다. 셋째, 이미지를 PNG 대신 JPEG quality 92로 통일 저장하는 결정을 내렸는데, 실제로 PNG와 JPEG 각각으로 학습한 두 모델의 생성 결과가 사실상 구분 불가능했다는 비교 실험 수치를 함께 제시한다. 캡션 전략에서는 짧은 캡션 대신 이미지를 충실히 서술하는 긴 캡션을 VLM으로 재생성하는 방식을 택했고, 이것이 샘플 품질 향상에 직접적으로 기여했다고 밝힌다.

## 설정 파일에 어떤 의미인가

이 글은 Photoroom 내부의 데이터 파이프라인 설계 기록이며, 특정 라이브러리의 설정 스키마 변경이나 breaking change를 수반하지 않는다. 다만 Mosaic Streaming(MDS)과 Lance를 조합하는 패턴은 대규모 이미지 학습 파이프라인을 직접 구축하는 팀에게 참고할 만하다. MDS 데이터셋은 컬럼 추가나 서브셋 생성 시 전체 재작성이 필요하다는 점을 Photoroom도 명시적으로 언급했으므로, MDS 기반 파이프라인을 운영 중이라면 Lance 같은 컬럼형 포맷과의 병행 사용을 검토해볼 수 있다. 텍스트 latent 사전 계산 여부 결정 역시 모델 규모와 스토리지 제약에 따라 달라지는 트레이드오프인데, 원문에 구체적인 수치와 판단 근거가 잘 정리되어 있다.

## 다음 단계 제안

대규모 이미지-텍스트 학습 데이터셋을 다루는 팀이라면 원문의 JPEG vs PNG 비교 실험 테이블과 텍스트 latent 온더플라이 계산의 처리량 영향 수치를 먼저 확인하는 것을 권한다. 자체 파이프라인에서 비슷한 포맷·품질 결정을 내려야 할 때 벤치마크 기준선으로 유용하다. PRX 시리즈 1–3편도 함께 읽으면 아키텍처부터 데이터까지의 의사결정 맥락이 연결된다.

---

**원문 전체 보기**: [PRX Part 4: Our Data Strategy](https://huggingface.co/blog/Photoroom/prx-part4-data) ([Hugging Face Blog](https://huggingface.co/blog/Photoroom/prx-part4-data))