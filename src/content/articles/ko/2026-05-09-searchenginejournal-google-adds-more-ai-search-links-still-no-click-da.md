---
id: "https://www.searchenginejournal.com/google-expands-ai-search-links-without-new-click-data/574307/"
tool: "searchenginejournal"
title: "구글, AI 검색에 더 많은 링크 추가하지만 SEO를 위한 클릭 데이터는 여전히 제공하지 않아"
link: "https://www.searchenginejournal.com/google-expands-ai-search-links-without-new-click-data/574307/"
pubDate: 2026-05-09T12:00:34.000Z
summary: "구글이 AI 검색 결과에 더 많은 링크를 추가했지만 퍼블리셔를 위한 새로운 리포팅 기능은 제공하지 않고 있습니다. AI 응답이 나타날 때 클릭률이 감소한다는 연구 결과가 지속적으로 나오고 있어 개발자와 SEO 전문가들이 주목해야 할 변화입니다."
---

## AI 검색 링크 확장의 배경

구글이 **AI Search** 기능에 더 많은 링크 표면을 추가했다고 발표했습니다. 이는 AI 생성 응답이 검색 결과에서 차지하는 비중이 증가하면서, 웹사이트 트래픽 감소에 대한 우려를 해결하려는 시도로 보입니다. 그러나 퍼블리셔들이 가장 원하는 **클릭 데이터 투명성**은 여전히 제공되지 않고 있어 논란이 계속되고 있습니다.

AI 검색 결과는 사용자의 질문에 대해 직접적인 답변을 제공하면서, 전통적인 검색 결과 클릭 패턴을 크게 변화시키고 있습니다. 개발자들이 운영하는 기술 블로그나 문서 사이트들도 이러한 변화의 직접적인 영향을 받고 있어, 새로운 SEO 전략이 필요한 시점입니다.

## 링크 표면 확장의 구체적 변화사항

구글은 AI 검색 응답 내에서 **참조 링크의 가시성**을 높이는 여러 방법을 도입했습니다:

- **인라인 인용**: AI 응답 텍스트 내에 직접 출처 링크를 삽입
- **확장된 참조 섹션**: 응답 하단에 더 많은 관련 링크 표시
- **시각적 개선**: 링크를 더 눈에 띄게 만드는 UI 변경사항
- **모바일 최적화**: 모바일 기기에서도 링크 접근성 향상

이러한 변화는 특히 기술 문서나 튜토리얼과 같은 콘텐츠에 긍정적인 영향을 미칠 수 있습니다. 개발자들이 작성하는 상세한 가이드나 API 문서는 AI 응답의 참조 자료로 활용될 가능성이 높기 때문입니다.

```javascript
// 예시: 구글 Search Console API를 통한 검색 성과 모니터링
const searchConsole = require('googleapis').searchconsole('v1');

async function getSearchAnalytics(siteUrl, startDate, endDate) {
  const response = await searchConsole.searchanalytics.query({
    siteUrl: siteUrl,
    resource: {
      startDate: startDate,
      endDate: endDate,
      dimensions: ['query', 'page'],
      rowLimit: 1000
    }
  });
  
  return response.data.rows;
}
```

## 클릭 데이터 부재가 개발자에게 미치는 영향

**Google Search Console**에서 AI 검색으로 인한 클릭 데이터를 별도로 제공하지 않는 것은 개발자 커뮤니티에게 중요한 문제입니다. 현재 상황에서 개발자들이 직면하는 주요 과제들:

- **성과 측정 어려움**: AI 검색에서 얼마나 많은 트래픽이 발생하는지 정확히 파악 불가
- **콘텐츠 최적화 방향성 부족**: 어떤 콘텐츠가 AI 검색에서 잘 노출되는지 데이터 부족
- **ROI 계산의 복잡성**: 기술 블로그나 문서 사이트의 투자 대비 효과 측정 곤란

개발자들은 현재 다음과 같은 우회 방법들을 사용하고 있습니다:

```python
# 예시: 사용자 에이전트 분석을 통한 AI 봇 트래픽 추적
def analyze_ai_bot_traffic(log_file):
    ai_bots = [
        'GoogleOther',
        'ChatGPT-User',
        'Claude-Web'
    ]
    
    with open(log_file, 'r') as f:
        for line in f:
            for bot in ai_bots:
                if bot in line:
                    # AI 봇 방문 로그 처리
                    process_ai_visit(line)
```

## 실무 대응 전략과 권장 사항

개발자와 기술 콘텐츠 제작자들이 이러한 변화에 적응하기 위한 구체적인 전략들:

**콘텐츠 구조화 최적화:**
- **스키마 마크업** 적극 활용하여 구조화된 데이터 제공
- **FAQ 섹션** 추가로 직접적인 질문-답변 형태 콘텐츠 제공
- **단계별 가이드** 형태로 콘텐츠 재구성

**기술적 SEO 개선:**
```html
<!-- 예시: 기술 문서를 위한 스키마 마크업 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "React Hooks 완전 가이드",
  "author": {
    "@type": "Person",
    "name": "개발자명"
  },
  "proficiencyLevel": "Intermediate",
  "dependencies": "React 16.8+",
  "codeRepository": "https://github.com/example/react-hooks"
}
</script>
```

**모니터링 및 분석 강화:**
- **Google Analytics 4**에서 유입 경로 세밀 분석
- **서버 로그 분석**을 통한 AI 봇 활동 추적
- **브랜드 검색량** 모니터링으로 간접적 영향 측정

## 향후 전망과 대비책

AI 검색의 발전에 따라 개발자들이 준비해야 할 장기적 전략들:

**콘텐츠 전략의 진화:**
- **심층 분석 콘텐츠**: AI가 요약하기 어려운 복잡한 기술적 인사이트 제공
- **실시간 업데이트**: 최신 기술 동향과 버전 정보를 빠르게 반영
- **인터랙티브 요소**: 코드 플레이그라운드, 라이브 데모 등 AI로 대체 불가능한 경험 제공

**기술적 준비사항:**
```yaml
# 예시: robots.txt 설정으로 AI 크롤러 관리
User-agent: GoogleOther
Crawl-delay: 1
Disallow: /private-docs/

User-agent: ChatGPT-User
Disallow: /premium-content/
```

구글의 AI 검색 확장은 피할 수 없는 트렌드입니다. 클릭 데이터의 투명성 부족은 아쉽지만, 개발자들은 새로운 환경에 적응하기 위한 창의적인 접근법을 개발해야 합니다. 중요한 것은 사용자에게 진정한 가치를 제공하는 고품질 콘텐츠를 지속적으로 만드는 것입니다.