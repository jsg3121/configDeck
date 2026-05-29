---
id: "https://astro.build/blog/astro-640/"
tool: "astro"
title: "Astro 6.4: 플러거블 마크다운 파이프라인과 Rust 기반 프로세서 도입"
link: "https://astro.build/blog/astro-640/"
pubDate: 2026-05-28T00:00:00.000Z
sourceName: "Astro Blog"
sourceUrl: "https://astro.build/blog/astro-640/"
contentType: "commentary"
summary: "Astro 6.4가 마크다운 프로세서를 교체 가능한 구조로 변경하고, Rust 기반 Sätteri 프로세서를 새로 제공한다. Cloudflare 고급 라우팅용 헬퍼도 추가되었다."
---

Astro Blog에서 Astro 6.4 릴리스를 발표했다. 핵심은 마크다운 처리 파이프라인을 통째로 교체할 수 있는 `markdown.processor` API, Rust로 작성된 새 마크다운 프로세서 Sätteri, 그리고 Cloudflare 고급 라우팅 헬퍼다.

## 무엇이 새로운가

가장 눈에 띄는 변화는 `markdown.processor` 설정 옵션이다. 기존에는 unified(remark/rehype) 파이프라인이 하드코딩되어 있었지만, 이제 이 자리를 다른 프로세서로 완전히 대체할 수 있다. 기본값은 여전히 `unified()`이므로 기존 프로젝트는 변경 없이 동작한다.

Sätteri는 Rust로 작성된 마크다운·MDX 파이프라인으로, `@astrojs/markdown-satteri` 패키지로 제공된다. Astro 팀 자체 테스트에서 Astro 문서 사이트와 Cloudflare 문서 사이트 빌드 시간이 각각 1분 이상 단축되었다고 한다. 다만 Sätteri는 remark/rehype 플러그인을 실행하지 않으므로, unified 생태계 플러그인에 의존하는 프로젝트는 당장 전환이 어렵다.

Cloudflare 쪽에서는 `@astrojs/cloudflare`가 `cf()` 헬퍼를 제공해 SESSION KV 바인딩, ASSETS 바인딩, `locals.cfContext`, 클라이언트 IP 등을 자동으로 연결해 준다. 커스텀 fetch 핸들러와 Hono 미들웨어 두 가지 방식을 모두 지원한다.

## 설정 파일에 어떤 의미인가

`astro.config.*` 파일 구조가 직접적으로 바뀐다. 기존 최상위 `markdown.remarkPlugins`, `markdown.rehypePlugins`, `markdown.remarkRehype`, `markdown.gfm`, `markdown.smartypants` 옵션은 **deprecated** 처리되었고, Astro 8.0에서 제거될 예정이다. 앞으로는 이 옵션들을 `markdown.processor` 안의 `unified({...})` 호출에 전달하는 방식으로 마이그레이션해야 한다.

당장 깨지는 것은 없다 — deprecated 옵션이 아직 작동하므로 급할 필요는 없지만, Astro 8.0 이전에 설정을 정리해 두는 게 좋다. Sätteri로 전환하려는 경우, remark/rehype 플러그인 목록을 점검해서 Sätteri 네이티브 기능으로 대체 가능한지 확인해야 한다. 원문에 따르면 Sätteri는 기존에 플러그인이 필요했던 여러 마크다운 기능을 네이티브로 구현하고 있다.

Cloudflare 배포 설정은 `cf()` 헬퍼 도입으로 보일러플레이트가 줄어든다. 다만 이 기능은 Astro 6.3에서 추가된 experimental 고급 라우팅을 전제로 하므로, 해당 실험 플래그를 먼저 활성화해야 한다.

## 다음 단계 제안

`npx @astrojs/upgrade`로 6.4로 올린 뒤, 기존 최상위 마크다운 옵션을 `markdown.processor: unified({...})` 형태로 옮기는 작업을 먼저 해두길 권한다. 마크다운 콘텐츠가 많은 사이트라면 Sätteri를 스테이징 환경에서 빌드 시간 비교 테스트해 볼 만하다. 새 Astro 프로젝트를 시작한다면 [Astro 설정 생성](/ko/generator/astro)에서 6.4 기준 설정 템플릿을 확인할 수 있다.

---

**원문 전체 보기**: [Astro 6.4](https://astro.build/blog/astro-640/) ([Astro Blog](https://astro.build/blog/astro-640/))