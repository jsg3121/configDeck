---
id: "https://vite.dev/blog/announcing-vite8-1"
tool: "vite"
title: "Vite 8.1 출시 — 번들 개발 모드, 청크 임포트 맵, Wasm ESM 통합 등"
link: "https://vite.dev/blog/announcing-vite8-1"
pubDate: 2026-06-23T00:00:00.000Z
sourceName: "Vite Blog"
sourceUrl: "https://vite.dev/blog/announcing-vite8-1"
contentType: "commentary"
summary: "Vite 8.1이 실험적 번들 개발 모드, 청크 임포트 맵, Wasm ESM 통합 지원 등 주요 기능을 추가하며 출시되었다. 대규모 앱의 개발 서버 성능 병목을 정면으로 겨냥한 릴리스다."
---

Vite Blog에서 Vite 8.1 출시를 공식 발표했다. 3월에 Rolldown 기반 단일 번들러로 전환한 Vite 8 위에 실험적 기능 여러 개를 얹은 릴리스다.

## 무엇이 새로운가

가장 눈에 띄는 건 **실험적 번들 개발 모드(Bundled Dev Mode)**다. Vite의 정체성이었던 언번들 개발 서버 방식이 대규모 프로젝트에서 요청 수 폭증으로 성능 저하를 일으키는 문제를 해결하기 위해 도입됐다. 원문에 따르면 10,000개 React 컴포넌트를 로딩하는 앱에서 시작 속도 약 15배, 풀 페이지 리로드 약 10배 개선을 확인했고, Linear 팀의 실제 앱에서도 콜드 스타트 렌더링 최대 3배, 풀 리로드 약 40% 빨라졌다고 한다. 단, 서드파티 플러그인 호환은 아직 제한적이라 명시하고 있다.

**실험적 청크 임포트 맵**은 프로덕션 빌드에서 한 청크 내용이 바뀔 때 해시가 연쇄적으로 전파되는 문제를 import map을 활용해 해결한다. **Wasm ESM 통합**은 `.wasm` 파일을 직접 import해 사용할 수 있게 해준다. 그 밖에 `import.meta.glob`의 대소문자 무시 매칭 옵션, HTML 커스텀 엘리먼트·속성에 대한 에셋 탐색 확장, Lightning CSS 기본 전환을 향한 전처리기 개선이 포함됐다.

## 설정 파일에 어떤 의미인가

직접적으로 `vite.config.js`에 영향을 주는 변경이 여럿 있다.

- **번들 개발 모드**: `experimental.bundledDev: true`를 설정하거나 CLI에서 `--experimental-bundle` 플래그를 전달하면 활성화된다. 기존 설정과 병행 가능하지만, 플러그인 호환성 이슈가 있을 수 있으므로 즉시 프로덕션 워크플로에 적용하기보다 별도 브랜치에서 테스트하는 게 안전하다.
- **청크 임포트 맵**: `experimental.renderBuiltUrl` 옵션과는 현재 함께 사용할 수 없다고 명시돼 있다. 빌드 출력 경로를 커스텀하는 설정을 쓰고 있다면 충돌 여부를 확인해야 한다.
- **Lightning CSS**: `css.transformer: 'lightningcss'`로 전환해 볼 수 있으며, 다음 메이저에서 기본값 변경을 검토 중이라고 한다. PostCSS 플러그인 체인에 의존하는 프로젝트라면 미리 호환성을 점검해두는 것이 좋다.
- **HTML 에셋 탐색**: `html.additionalAssetSources` 옵션이 신설되어 커스텀 엘리먼트나 비표준 속성의 에셋도 빌드 파이프라인에 포함시킬 수 있다.

Breaking change에 대해서는 원문이 별도 마이그레이션 가이드를 언급하지 않았고, 신규 기능 대부분이 실험적 플래그 뒤에 있어 기존 설정이 즉시 깨질 가능성은 낮아 보인다.

## 다음 단계 제안

대규모 모노레포나 컴포넌트 수가 많은 앱을 운영 중이라면 `experimental.bundledDev`를 개발 환경에서 켜보고 체감 차이를 직접 확인해 볼 만하다. PostCSS 의존도가 높은 프로젝트라면 `css.transformer: 'lightningcss'`로 빌드를 돌려보고 이슈를 Vite 디스커션에 미리 피드백하는 것도 유의미하다. 각 실험적 기능의 디자인 문서와 피드백 디스커션 링크가 원문에 정리돼 있으니 참고하자.

---

**원문 전체 보기**: [Vite 8.1 is out!](https://vite.dev/blog/announcing-vite8-1) ([Vite Blog](https://vite.dev/blog/announcing-vite8-1))