---
id: "https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/"
tool: "searchenginejournal"
title: "Google Drops FAQ Rich Results From Search"
link: "https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/"
pubDate: 2026-05-10T08:54:15.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/"
contentType: "commentary"
summary: "Google has fully deprecated FAQ rich results, completing a rollback that started in 2023. The markup won't break anything, but it no longer produces visible results — and Search Console tooling support is being removed on a staggered timeline through August 2026."
---

Search Engine Journal reports that Google has officially deprecated FAQ rich results, with visible results disappearing from search as of May 7. This completes a three-year wind-down that began in 2023 when Google restricted FAQ rich results to government and health sites only.

## What's actually new

The deprecation follows a three-stage timeline. FAQ rich results already stopped appearing in search on May 7. In June, Google will remove the FAQ search appearance filter, the rich result report, and Rich Results Test support. API support in Search Console follows in August, giving teams a window to update any automated reporting that pulls FAQ data. Notably, Google offered no explanation for the change — just a deprecation notice added to its documentation. The remaining government and health site eligibility appears to be gone too.

## What it means for your config

If you maintain structured data configs — whether through CMS plugins, JSON-LD templates, or static site generators — the practical impact is narrow but worth noting. Your existing `FAQPage` schema markup won't cause crawl errors or penalties; Google's docs explicitly say unused structured data is fine. But any CI/CD pipelines, monitoring dashboards, or reporting scripts that query the Search Console API for FAQ rich result data will break after August. If you're generating structured data through a build tool or headless CMS config, there's no urgent need to strip `FAQPage` markup out, but you might want to stop actively adding it to new pages since it no longer earns any visible search feature.

The more interesting question is around AI search. Some practitioners have been recommending FAQ schema as a way to make content more parseable by AI systems. Google has said nothing connecting this deprecation to that use case. If your structured data strategy is built around that theory, this announcement doesn't validate or invalidate it — but it does remove the one concrete, measurable benefit (rich results) that FAQ schema used to provide in Google Search specifically.

There's no migration path because there's nothing to migrate to. Google hasn't offered a replacement rich result type for FAQ-style content.

## Recommended next step

Audit your reporting first, not your markup. If you have automated alerts or dashboards pulling FAQ performance data from the Search Console API, update those calls before the August cutoff to avoid silent failures. For the markup itself, leave it or remove it — neither choice affects search visibility anymore. If you decide to clean it up, treat it as low-priority housekeeping rather than an urgent fix.

---

**Read the full announcement on Search Engine Journal** → [Google Drops FAQ Rich Results From Search](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)