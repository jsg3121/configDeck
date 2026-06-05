---
id: "https://vite.dev/blog/cloudflare-supports-vite"
tool: "vite"
title: "Cloudflare, Vite의 미션을 지원하다 — VoidZero 합류와 100만 달러 오픈소스 펀드"
link: "https://vite.dev/blog/cloudflare-supports-vite"
pubDate: 2026-06-04T00:00:00.000Z
sourceName: "Vite Blog"
sourceUrl: "https://vite.dev/blog/cloudflare-supports-vite"
contentType: "commentary"
summary: "VoidZero가 Cloudflare에 합류하며, Cloudflare는 Vite 생태계를 위한 100만 달러 오픈소스 펀드를 발표했다. Vite는 MIT 라이선스, 벤더 중립성, 기존 팀 거버넌스를 그대로 유지한다."
---

Vite Blog에서 VoidZero가 Cloudflare에 합류한다는 소식을 공식 발표했다. Evan You의 VoidZero 발표문과 Cloudflare 블로그 포스트가 함께 공개되었으며, Vite 팀은 이번 변화가 프로젝트의 거버넌스·미션·철학에 영향을 주지 않는다고 명시했다.

## 무엇이 새로운가

핵심은 두 가지다. 첫째, VoidZero 소속이던 Vite 팀원 전원이 Cloudflare로 이동하며 Vite 작업을 계속한다. 동일한 원칙이 Vitest, Rolldown, Oxc, Vite+에도 적용된다. 둘째, Cloudflare가 Vite 생태계 전용 **$1M 오픈소스 펀드**를 신설했다. 이 펀드는 인기 플러그인·툴링 지원, 독립 코어 팀원 스티펜드, 프레임워크·배포 플랫폼·표준 기구와의 협업, 보안 이슈 대응 가속 등에 쓰일 예정이다. 기존 Open Collective 펀드는 여전히 Vite 팀이 관리하며 별도로 유지된다. Vite는 MIT 라이선스와 벤더 중립 원칙을 유지하고, 어디서든 동작하는 것을 목표로 한다고 재확인했다.

## 설정 파일에 어떤 의미인가

이번 발표는 조직·거버넌스 차원의 변화이므로, **현재 `vite.config.ts` 작성 방식이나 플러그인 호환성에 즉각적인 변경은 없다.** 마이그레이션이 필요한 breaking change도 언급되지 않았다. 다만 원문 말미에 Vite 8에서 진행 중인 Full Bundle Mode와 Vite 9에서 Environment API 안정화를 목표한다는 언급이 있다. 이 기능들이 실제로 랜딩되면 설정 구조에 변화가 생길 수 있지만, 구체적인 설정 옵션이나 스키마 변경은 아직 공개되지 않았다. 공식 마이그레이션 가이드가 나오면 다시 정리하겠다.

## 다음 단계 제안

당장 설정을 바꿀 필요는 없다. 다만 Vite 8의 Full Bundle Mode와 Ecosystem Sync Calls, 그리고 Vite 9의 Environment API 안정화 로드맵에 관심이 있다면 Vite Blog와 VoidZero·Cloudflare의 발표문을 함께 읽어두는 것이 좋다. 특히 Rolldown·Oxc 통합이 빌드 파이프라인에 미칠 영향을 가늠하려면 해당 프로젝트의 릴리스 노트를 구독해 두자. Cloudflare의 오픈소스 펀드 지원 대상이 플러그인·툴링으로 확대되므로, 생태계 플러그인 유지보수자라면 펀드 신청 경로가 공개될 때 확인해볼 만하다.

---

**원문 전체 보기**: [Cloudflare supports Vite's mission](https://vite.dev/blog/cloudflare-supports-vite) ([Vite Blog](https://vite.dev/blog/cloudflare-supports-vite))