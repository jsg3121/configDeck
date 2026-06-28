---
id: "https://prettier.io/blog/2026/06/27/3.9.0"
tool: "prettier"
title: "Prettier 3.9: 주요 파서 업그레이드와 포매팅 개선"
link: "https://prettier.io/blog/2026/06/27/3.9.0"
pubDate: 2026-06-27T00:00:00.000Z
sourceName: "Prettier Blog"
sourceUrl: "https://prettier.io/blog/2026/06/27/3.9.0"
contentType: "commentary"
summary: "Prettier 3.9가 Markdown, YAML, GraphQL, Flow 파서를 대폭 업그레이드하고, JavaScript/TypeScript의 --no-semi 모드 포매팅 안정성을 개선했다."
---

Prettier Blog에서 Prettier 3.9 릴리스를 발표했다. 이번 버전의 핵심은 다섯 개 언어 파서의 메이저 업그레이드와 JavaScript/TypeScript 포매팅 엣지 케이스 수정이다.

## 무엇이 새로운가

Markdown 파서가 오래된 remark-parse v8에서 micromark v4로 교체되었다. CommonMark 및 GFM 준수도가 높아지고 다수의 장기 파싱 버그가 해결된다. 단, MDX 파서는 아직 마이그레이션이 완료되지 않았으며 커뮤니티 기여를 요청하고 있다. YAML 파서도 yaml v2로 업그레이드되어 기존 파싱 문제들이 수정되었다.

GraphQL 쪽에서는 GraphQL.js v17의 새 문법—디렉티브 정의 위 디렉티브, 프래그먼트 인자 등—을 지원한다. Flow는 새로운 Rust 기반 파서(oxidized)로 전환되었고, 원문에 따르면 로컬 파서 전용 벤치마크에서 유효한 Flow 픽스처 파싱 시간이 중간값 기준 422.6ms에서 266.4ms로 단축되었다.

JavaScript/TypeScript에서는 `--no-semi` 모드에서 `break`/`continue` 뒤 주석이 있을 때 포매팅 결과가 매번 달라지던 문제(idempotency 깨짐)가 해결되었고, 임베디드 템플릿 보간의 정렬 불일치, IIFE 함수 주석 위치, CSS 셀렉터 내 불필요한 공백 삽입 등 여러 엣지 케이스가 수정되었다.

## 설정 파일에 어떤 의미인가

Prettier 설정 파일(`.prettierrc` 등)의 옵션 스키마 자체가 바뀌진 않는다. 다만 주의할 점이 몇 가지 있다.

- **버전 고정 권장**: 원문에서 `package.json`에 `"prettier": "3.9.0"`처럼 정확한 버전을 명시하라고 강조한다. `^3.9.0` 같은 범위 지정은 파서 교체 규모를 고려하면 위험할 수 있다.
- **플러그인 동반 업그레이드**: `@prettier/plugin-oxc`나 `@prettier/plugin-hermes`를 사용 중이라면 반드시 함께 업그레이드해야 새 포매팅 규칙이 적용된다.
- **포매팅 출력 변경 가능성**: Markdown·YAML 파서가 통째로 바뀌었으므로, 기존에 포매팅된 `.md`/`.yaml` 파일에서 diff가 발생할 수 있다. CI에서 `prettier --check`를 돌리고 있다면 업그레이드 후 한 번 전체 포매팅(`prettier --write`)을 실행하고 결과를 리뷰하는 게 안전하다.
- **`--no-semi` 사용자**: `break`/`continue` 주변 포매팅이 안정화되면서 기존 출력과 달라질 수 있다. 의도된 수정이니 diff를 확인 후 커밋하면 된다.

## 다음 단계 제안

업그레이드 전에 프로젝트 전체에 `npx prettier@3.9.0 --check .`을 돌려서 기존 포매팅과의 차이를 먼저 확인하자. Markdown이나 YAML 파일이 많은 문서 프로젝트라면 파서 교체에 따른 diff 규모가 클 수 있으니 별도 PR로 분리하는 편이 리뷰에 유리하다. 새 프로젝트에 Prettier 설정을 처음 잡는다면 [Prettier 설정 생성](/ko/generator/prettier-config)에서 시작해 보자.

---

**원문 전체 보기**: [Prettier 3.9: Major parser upgrades and Formatting improvements](https://prettier.io/blog/2026/06/27/3.9.0) ([Prettier Blog](https://prettier.io/blog/2026/06/27/3.9.0))