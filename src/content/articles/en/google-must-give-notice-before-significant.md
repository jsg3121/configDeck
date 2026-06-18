---
id: "https://www.searchenginejournal.com/google-must-give-notice-before-significant-ranking-changes/579696/"
tool: "searchenginejournal"
title: "Google Must Give Notice Before Significant Ranking Changes"
link: "https://www.searchenginejournal.com/google-must-give-notice-before-significant-ranking-changes/579696/"
pubDate: 2026-06-17T18:04:48.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-must-give-notice-before-significant-ranking-changes/579696/"
contentType: "commentary"
summary: "The UK's CMA has imposed two new conduct requirements on Google: fair and transparent organic ranking with advance notice of significant changes, and mandatory data portability. Both are UK-only and carry defined implementation timelines."
---

Search Engine Journal reports that the UK's Competition and Markets Authority (CMA) has issued two new conduct requirements targeting Google's general search services. One mandates fair, objective organic ranking with advance notice of changes; the other turns Google's voluntary UK Data Portability API into a legal obligation.

## What's actually new

The fair ranking requirement compels Google to rank organic results — including those surfaced in AI Overviews, but not sponsored results — using objective and non-discriminatory criteria. Google must also provide advance notice before making significant ranking changes and establish a formal process for businesses to raise concerns. The data portability requirement converts Google's existing voluntary API into a legally enforceable obligation, aligning UK users' data rights more closely with the EU's Digital Markets Act. Google has six months to implement the ranking requirement and three months for data portability. Importantly, the CMA is not requiring Google to publish its ranking algorithm; the obligations are around criteria transparency, notice, and complaints handling.

## What it means for your config

This is a regulatory action, not a technical API or tooling change, so there's nothing to update in your build pipelines, CI configs, or developer tooling right now. No new endpoints, schemas, or SDK versions are involved on the ranking side.

The data portability piece is more interesting from a developer perspective. If you're building services that consume Google search data for UK users — personalized recommendations, cashback tools, or similar — the mandatory API access could make that integration more reliable than it was when it was voluntary. But the source doesn't detail any changes to the API's shape, auth model, or rate limits, so there's nothing concrete to configure against yet.

For teams managing SEO tooling or search-monitoring configs (crawl schedules, rank-tracking alert thresholds, etc.), the advance-notice requirement could eventually give you a more predictable signal for when to re-baseline your metrics. That said, the requirement's practical value depends entirely on what "advance notice" looks like in implementation — days, weeks, or something vaguer. The CMA hasn't specified, and Google hasn't disclosed its plan.

## Recommended next step

If you operate services that depend on Google search data for UK users, keep an eye on the Data Portability API over the next three months for any changes to access terms or technical specs. For everyone else, this is a wait-and-see situation: the six-month implementation window for fair ranking means the earliest tangible effects won't land until late 2026. The original article covers the regulatory context and business-side implications in more detail than we can add from a tooling angle.

---

**Read the full announcement on Search Engine Journal** → [Google Must Give Notice Before Significant Ranking Changes](https://www.searchenginejournal.com/google-must-give-notice-before-significant-ranking-changes/579696/)