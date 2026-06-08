---
id: "https://huggingface.co/blog/build-small-hackathon/amazingdigitaldentures"
tool: "huggingface"
title: "Amazing Digital Dentures — 실패한 프로젝트 회고"
link: "https://huggingface.co/blog/build-small-hackathon/amazingdigitaldentures"
pubDate: 2026-06-07T19:44:27.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/build-small-hackathon/amazingdigitaldentures"
contentType: "commentary"
summary: "Hugging Face의 Build Small 해커톤 참가자가 LLM으로 Three.js 게임을 자동 생성하려다 실패한 과정을 솔직하게 공유한 글이다. 최종 결과물은 간단한 HTML 토이 메이커로 축소되었다."
---

Hugging Face Blog의 Build Small 해커톤 프로젝트 회고 글이다. 참가자는 애니메이션 시리즈 The Amazing Digital Circus에서 영감을 받아 LLM 기반 "디지털 펫"이 Three.js 게임을 생성해주는 도구를 만들려 했지만, 결국 목표를 크게 축소해야 했다.

## 무엇이 새로운가

원래 아이디어는 LLM이 생산성 관련 모험(일종의 게이머화된 투두 리스트)을 생성하는 디지털 펫이었다. 투두 리스트 부분을 포기하고 "모험 생성" 쪽에 집중하면서 Nemotron 30b 모델로 Three.js 게임 코드를 생성하려 시도했다. 긴 프롬프트 → 실패, GitHub의 awesome-copilot 스킬 카드 주입 → 컨텍스트 윈도우 초과로 실패, 컨텍스트 윈도우 확장 → 여전히 실패, Codex로 스킬을 단일 텍스트로 증류한 뒤 RAG 적용 → 코드는 나오지만 빈 화면만 렌더링되는 결과가 반복됐다. 최종 결과물은 시계, 투두 리스트, Snake, Breakout 같은 간단한 HTML을 원샷으로 만드는 토이 메이커로, Tetris 수준만 돼도 깨진다고 저자가 직접 밝히고 있다. Hugging Face Spaces에 데모가 공개돼 있다.

## 설정 파일에 어떤 의미인가

이 글은 완성된 도구 릴리스가 아니라 해커톤 실패 회고이므로, 개발자 설정 파일에 직접적인 영향은 없다. 다만 LLM 코드 생성 파이프라인을 구축할 때 반복적으로 부딪힌 문제 — 컨텍스트 윈도우 한도, 프롬프트 길이 vs. 컴퓨트 트레이드오프, RAG 파이프라인 구성 — 는 비슷한 시도를 하는 개발자에게 참고가 된다. 특정 설정 변경이나 마이그레이션 사항은 원문에도 다루고 있지 않다.

## 다음 단계 제안

LLM으로 프론트엔드 코드를 자동 생성하는 파이프라인에 관심이 있다면, 이 글이 보여주는 실패 경로 자체가 유용한 체크리스트다. 컨텍스트 윈도우 예산 산정, 스킬 카드 증류 방식, RAG 적용 시 코드 품질 검증 단계 등을 자기 프로젝트에 미리 점검해볼 수 있다. Hugging Face Spaces의 데모를 직접 돌려보고 어디서 깨지는지 확인하면 모델 한계를 체감하는 데 도움이 될 것이다.

---

**원문 전체 보기**: [Amazing Digital Dentures (a failed project)](https://huggingface.co/blog/build-small-hackathon/amazingdigitaldentures) ([Hugging Face Blog](https://huggingface.co/blog/build-small-hackathon/amazingdigitaldentures))