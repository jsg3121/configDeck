---
id: "https://blog.google/products-and-platforms/products/search/google-images-25th-anniversary/"
tool: "googleaiblog"
title: "구글 이미지 25주년 — 비주얼 검색의 주요 이정표와 신규 기능 두 가지"
link: "https://blog.google/products-and-platforms/products/search/google-images-25th-anniversary/"
pubDate: 2026-07-14T16:00:00.000Z
sourceName: "Google AI Blog"
sourceUrl: "https://blog.google/products-and-platforms/products/search/google-images-25th-anniversary/"
contentType: "commentary"
summary: "Google Images 25주년을 맞아 새로운 브라우저블 홈 갤러리와 AI Overviews 내 이미지 생성 기능이 발표되었다. 아울러 2001년부터 2026년까지 비주얼 검색 진화 타임라인이 함께 정리되었다."
---

Google AI Blog에서 Google Images 출시 25주년을 기념하며 두 가지 신규 기능과 함께 지난 25년간의 비주얼 검색 발전사를 회고하는 글을 공개했다. 작성자는 Search 시니어 엔지니어링 디렉터 Brad Kellett이다.

## 무엇이 새로운가

첫 번째 신규 기능은 Google Images의 **브라우저블 홈**이다. 웹 전역의 이미지를 실시간으로 업데이트하며 사용자 관심사에 맞춰 맞춤 갤러리를 제공한다. 저장한 아이디어는 컬렉션 탭으로 갤러리 상단에 표시되어 탐색을 이어갈 수 있다. 미국 내 영어 데스크톱 환경에서 수 주 내 롤아웃 예정이다.

두 번째는 **AI Overviews 내 이미지 생성** 기능으로, 최신 Nano Banana 모델을 사용해 텍스트 프롬프트로부터 고품질 이미지를 직접 생성한다. AI Mode에서 이미지 생성을 지원하는 모든 영어 권역에 순차 배포된다. 타임라인 부분에서는 2026년 신규로 Circle to Search 다중 객체 인식과 Intelligent Search Box(이미지 여러 장 업로드 후 질문)도 언급되었다.

## 설정 파일에 어떤 의미인가

이번 발표는 최종 사용자 대상 검색 UI·AI 기능 업데이트이므로, 개발자 빌드 설정이나 프로젝트 구성 파일에 직접적인 영향은 없다. Google Search API나 Custom Search JSON API를 사용하는 프로젝트라면 새 기능이 API 응답 형식에 반영되는지 지켜볼 필요가 있겠지만, 원문에는 API 수준의 변경 사항이 언급되지 않았다. Nano Banana 모델 역시 Search 내부에서 작동하는 것으로 소개되었을 뿐, 외부 호출이나 SDK 연동에 대한 정보는 아직 공개되지 않았다. 관련 설정 변경이 필요해지는 시점은 공식 개발자 문서가 업데이트된 뒤가 될 것이다.

## 다음 단계 제안

Google Images나 AI Overviews 결과를 자사 서비스에 활용하고 있다면, 롤아웃 후 실제 응답 구조에 변화가 있는지 확인하는 것이 우선이다. 특히 이미지 검색 트래픽이 중요한 사이트라면 새로운 갤러리 UI에서 노출이 어떻게 달라지는지 모니터링해 볼 만하다. Nano Banana 모델의 외부 접근 가능성은 Google Cloud 또는 Vertex AI 쪽 공지가 나올 때 다시 확인하길 권한다.

---

**원문 전체 보기**: [Celebrating 25 years of visual search innovation](https://blog.google/products-and-products/products/search/google-images-25th-anniversary/) ([Google AI Blog](https://blog.google/products-and-platforms/products/search/google-images-25th-anniversary/))