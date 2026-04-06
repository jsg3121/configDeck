# seo/

ConfigDeck의 SEO 및 시맨틱 HTML 가이드라인을 정의하는 폴더이다.

## 이 폴더의 역할

- 에이전트가 페이지를 구현할 때 SEO와 시맨틱 마크업 규칙을 준수하도록 가이드를 제공한다
- ConfigDeck은 SEO 유입이 핵심 전략(파일별/스택별 랜딩, 다국어 SEO 페이지)이므로 별도 폴더로 독립 관리한다
- 모든 가이드에는 공식 스펙/문서 출처를 명시한다

## 폴더 구조

- `index.md` — 이 파일. 폴더 역할 설명 및 가이드 목록
- `guides/` — 실제 SEO 가이드 문서 보관

## 가이드 목록

- [semantic-html.md](guides/semantic-html.md) — 시맨틱 태그 사용 규칙, 페이지 유형별 마크업 구조
- [meta-tags.md](guides/meta-tags.md) — title, description, OG, Twitter Card, hreflang, canonical
- [structured-data.md](guides/structured-data.md) — JSON-LD 구조화 데이터 (WebApplication, FAQPage, HowTo)
