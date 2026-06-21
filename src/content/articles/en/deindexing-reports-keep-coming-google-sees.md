---
id: "https://www.searchenginejournal.com/deindexing-reports-keep-coming-google-sees-nothing-unusual/579847/"
tool: "searchenginejournal"
title: "Deindexing Reports Keep Coming, Google Sees Nothing Unusual"
link: "https://www.searchenginejournal.com/deindexing-reports-keep-coming-google-sees-nothing-unusual/579847/"
pubDate: 2026-06-20T12:30:44.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/deindexing-reports-keep-coming-google-sees-nothing-unusual/579847/"
contentType: "commentary"
summary: "Since late April, site owners have reported pages falling out of Google's index with no manual action or crawl error to explain it. Google says the data looks normal; Search Engine Journal breaks down what's actually happening and what to check before you react."
---

Search Engine Journal has published a detailed breakdown of the ongoing reports from SEO professionals and site owners who say pages are disappearing from Google's index without explanation. The reports have been accumulating since late April 2026, and Google's John Mueller has described the movement as ordinary.

## What's actually new

The core issue: pages that were previously indexed are showing up as "crawled, currently not indexed" in Search Console, and in some cases entire properties have flipped to that status. The article traces the wave back to a question from Pedro Dias, a former Google employee, who asked if others were seeing elevated deindexing rates. Many confirmed they were.

What makes the SEJ piece worth reading is the diagnostic framework it lays out. The article identifies five distinct causes that all look like "my pages are gone": actual deindexing, ranking losses mistaken for deindexing, canonical consolidation, technical blocking (stray noindex, robots rules), and Search Console reporting artifacts. That last one is especially relevant — Google's own Data Anomalies page documents a logging error that misreported impressions from May 2025 through late April 2026. The correction itself looks like a traffic cliff.

The article also notes that Google's 2026 update calendar has been packed — spam and core updates in March, another core update in May — making it hard to isolate signal from noise. Glenn Gabe's independent investigation of one site eventually uncovered a manual action that wasn't initially visible, which is a useful cautionary tale about trusting first impressions.

## What it means for your config

This isn't a developer tooling or configuration story in any direct sense. There are no new APIs, schema changes, or technical settings to adjust. But if you manage sites with programmatic page generation — location pages, faceted ecommerce URLs, templated content — the article highlights that these are the page types most likely to land in the "crawled, currently not indexed" bucket. If your build pipeline or CMS config generates large numbers of near-duplicate pages, this is a good prompt to audit whether you're sending clear canonical signals and whether thin templates are earning their place in the index.

The article doesn't prescribe specific technical fixes beyond the basics: use URL Inspection (not `site:` searches) to confirm actual index status, cross-reference Search Console click data with GA4 organic sessions to filter out the impression reporting artifact, and avoid reactive moves like adding noindex tags to "reset" pages or restructuring URLs before you've confirmed the real problem.

## Recommended next step

If you've noticed index count drops or impression cliffs recently, resist the urge to restructure anything before you've confirmed what you're actually looking at. Start with URL Inspection on a sample of affected pages, compare click trends (not impressions) against GA4 organic sessions, and check Google's Data Anomalies page to see if your timeline overlaps with the known logging error. The SEJ article walks through the full diagnostic tree — read it before you file a ticket or start ripping out URL paths.

---

**Read the full announcement on Search Engine Journal** → [Deindexing Reports Keep Coming, Google Sees Nothing Unusual](https://www.searchenginejournal.com/deindexing-reports-keep-coming-google-sees-nothing-unusual/579847/)