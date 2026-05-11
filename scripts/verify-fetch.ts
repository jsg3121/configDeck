/**
 * 원문 fetch 모듈 sample 검증 스크립트 (SPEC-0007 §6.3 페이즈 2 체크포인트)
 *
 * 15개 RSS 소스의 최근 글 1건씩을 fetch하여 본문 추출 성공률을 측정한다.
 * 페이즈 2 머지 전 사용자 확인 자료로 사용.
 *
 * 실행: pnpm tsx scripts/verify-fetch.ts
 *
 * 출력:
 *  - 소스별 성공/실패 + 본문 길이 + 실패 사유
 *  - 전체 성공률 (목표: ≥80%)
 */

import { FEED_CONFIGS, fetchFeed, type RSSItem } from './fetch-rss'
import { fetchArticleContent } from './fetch-article-content'

interface SampleResult {
  tool: string
  source: string
  url: string
  ok: boolean
  reason?: string
  rawLength?: number
  contentPreview?: string
}

const main = async (): Promise<void> => {
  console.log(`Fetching latest item from ${FEED_CONFIGS.length} RSS sources...\n`)

  // 1. 각 RSS 소스에서 최신 글 1건씩 추출
  //    (filterByYesterday를 거치지 않으므로 fetchFeed를 직접 호출)
  const samples: RSSItem[] = []
  for (const config of FEED_CONFIGS) {
    const items = await fetchFeed(config)
    if (items.length > 0) {
      // 가장 최근 글 (RSS는 보통 최신순 정렬이지만 안전하게 정렬)
      const latest = items.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())[0]
      samples.push(latest)
    } else {
      console.warn(`  ⚠️  ${config.name}: no items in feed`)
    }
  }

  console.log(`\nCollected ${samples.length} samples. Testing content fetch...\n`)

  // 2. 각 sample의 원문 fetch 시도
  const results: SampleResult[] = []
  for (const item of samples) {
    process.stdout.write(`  ${item.tool.padEnd(22)} ... `)
    const result = await fetchArticleContent(item.link)

    const sampleResult: SampleResult = {
      tool: item.tool,
      source: item.title,
      url: item.link,
      ok: result.ok,
      reason: result.reason,
      rawLength: result.rawLength,
      contentPreview: result.content?.slice(0, 100).replace(/\s+/g, ' '),
    }
    results.push(sampleResult)

    if (result.ok) {
      console.log(`✅ ${result.rawLength} chars`)
    } else {
      console.log(`❌ ${result.reason}`)
    }
  }

  // 3. 결과 보고
  console.log('\n' + '='.repeat(70))
  console.log('  Sample Fetch Verification Report')
  console.log('='.repeat(70))

  const successCount = results.filter((r) => r.ok).length
  const successRate = (successCount / results.length) * 100

  console.log(`\nTotal: ${results.length} sources`)
  console.log(`Success: ${successCount} (${successRate.toFixed(1)}%)`)
  console.log(`Failed: ${results.length - successCount}`)
  console.log(`Target: ≥ 80%`)
  console.log(`Status: ${successRate >= 80 ? '✅ PASS' : '⚠️  BELOW TARGET'}\n`)

  console.log('Per-source results:')
  console.log('-'.repeat(70))
  for (const r of results) {
    const status = r.ok ? '✅' : '❌'
    const detail = r.ok ? `${r.rawLength} chars` : r.reason
    console.log(`  ${status} ${r.tool.padEnd(22)} ${detail}`)
    if (r.ok && r.contentPreview) {
      console.log(`     preview: ${r.contentPreview}...`)
    }
    console.log(`     url:     ${r.url}`)
  }

  console.log('\n' + '='.repeat(70))

  // 실패가 있더라도 exit 0 — 검증 보고가 목적이며, 실패 사유 자체가 가치 있음
  process.exit(0)
}

main().catch((error) => {
  console.error('Verification script error:', error)
  process.exit(1)
})
