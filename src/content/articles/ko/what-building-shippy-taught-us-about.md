---
id: "https://huggingface.co/blog/allenai/shippy-tech-blog"
tool: "huggingface"
title: "Shippy를 만들며 배운 에이전트 구축 교훈"
link: "https://huggingface.co/blog/allenai/shippy-tech-blog"
pubDate: 2026-07-15T17:29:41.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/allenai/shippy-tech-blog"
contentType: "commentary"
summary: "Allen AI(Ai2)가 해양 감시 플랫폼 Skylight에 탑재한 AI 에이전트 Shippy의 아키텍처와 운영 교훈을 공유했다. 에이전트를 soul·skills·config 세 계층으로 분리하고, 비결정적 모델 위에 결정적 CLI 도구를 얹는 설계가 핵심이다."
---

Hugging Face Blog에 Allen AI(Ai2) Skylight 팀이 해양 도메인 AI 에이전트 Shippy의 아키텍처와 운영 과정에서 얻은 교훈을 정리한 글을 게시했다. 모델 자체보다 시스템 신뢰성 확보에 초점을 맞춘 엔지니어링 사례다.

## 무엇이 새로운가

Shippy는 에이전트를 **soul**(시스템 프롬프트), **skills**(마크다운 기반 작업 명세), **config**(런타임 설정)로 삼분한다. Soul과 skills는 Docker 이미지에 번들링되어 버전 관리되고, config는 에이전트 하네스(OpenClaw), LLM 모델(현재 Claude Opus 4.6), API 키 등을 런타임에 주입하는 구조다. Skills 파일은 Claude Code·Codex 등 코딩 도구에서 쓰이는 agent-skills 스펙(프론트매터가 포함된 마크다운)을 따른다.

모델이 직접 API를 호출하지 않고 전용 Skylight CLI를 거치게 한 점이 눈에 띈다. 초기 프로토타입에서 에이전트가 직접 API 호출을 구성했을 때 페이지네이션 오류, 지오메트리 인코딩 버그 등이 끊이지 않았고, CLI가 인증·페이지네이션·출력 포맷을 확정적으로 처리하면서 문제를 줄였다. 출력도 파이프가 아닌 로컬 JSON 파일로 기록해 버퍼 제한 문제를 회피한다.

사용자 격리를 위해 **Mothership**이라는 에이전트 호스팅 플랫폼을 자체 구축했다. 사용자 세션마다 Kubernetes 파드를 프로비저닝하고, JWT를 주입해 데이터 접근 범위를 제한한다.

## 설정 파일에 어떤 의미인가

이 글은 Hugging Face 라이브러리나 모델 허브의 설정 변경 사항이 아니라 Ai2 내부 에이전트 아키텍처 사례를 다룬다. 따라서 `transformers` config나 Hugging Face 생태계 설정 파일에 직접적으로 영향을 주는 내용은 없다.

다만 에이전트 설계 패턴 자체에서 설정 관리에 참고할 점이 있다. Soul·skills를 빌드 아티팩트로 고정하고 모델·하네스·시크릿은 config로 분리하는 접근은, 에이전트 기반 도구를 운영하는 팀이 "어디까지를 이미지에 굽고, 어디부터를 환경 변수로 뺄 것인가"를 결정할 때 명확한 기준선이 된다. Skills를 마크다운 프론트매터로 관리하는 방식은 YAML/JSON 스키마에 익숙한 팀이라면 바로 적용해볼 수 있는 구조다.

원문에서 OpenClaw 프레임워크의 구체적 config 스키마나 설정 예시는 제공되지 않았으므로, 실제 적용을 고려한다면 OpenClaw 저장소 문서를 별도로 확인해야 한다.

## 다음 단계 제안

에이전트에 외부 API를 연결하는 프로젝트를 진행 중이라면, Shippy 팀이 강조한 "모델이 직접 API를 호출하지 않고 결정적 CLI 계층을 거치게 하라"는 원칙을 자기 도구 체인에 대입해볼 만하다. 원문에서 언급된 agent-skills 마크다운 스펙과 OpenClaw 프레임워크의 공개 저장소를 살펴보면 구조 설계의 출발점을 잡을 수 있다. 평가(eval) 시스템 부분은 원문이 잘려 있으므로, 전체 글에서 나머지 내용을 확인하길 권한다.

---

**원문 전체 보기**: [What building Shippy taught us about building agents](https://huggingface.co/blog/allenai/shippy-tech-blog) ([Hugging Face Blog](https://huggingface.co/blog/allenai/shippy-tech-blog))