---
id: "https://www.searchenginejournal.com/googles-q2-precise-revenue-figures-click-claims-you-cant-check/583280/"
tool: "searchenginejournal"
title: "Google's Q2: Precise Revenue Figures, Click Claims You Can't Check"
link: "https://www.searchenginejournal.com/googles-q2-precise-revenue-figures-click-claims-you-cant-check/583280/"
pubDate: 2026-07-25T12:30:24.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/googles-q2-precise-revenue-figures-click-claims-you-cant-check/583280/"
contentType: "commentary"
summary: "Search Engine Journal examines the asymmetry in Google's Q2 reporting: precise revenue figures filed with the SEC versus vague, unverifiable claims about outbound clicks to websites. Independent datasets each measure different slices, and none can confirm or deny Google's aggregate assertions."
---

Search Engine Journal published an analysis of Alphabet's Q2 earnings, highlighting a stark contrast between the precision of Google's financial disclosures and the vagueness of its claims about traffic sent to the open web. The piece categorizes Google's public statements about clicks into three types and tests each against available third-party data.

## What's actually new

The core observation is structural, not breaking news: Google Search & Other revenue hit $63.27 billion (up 17% YoY), with every dollar accounted for in SEC filings. Meanwhile, Google's claims about outbound clicks — from Pichai's "queries at an all-time high" to Fox's "billions of clicks weekly" to Reid's "quality clicks" framing — come via blog posts and LinkedIn, with no consistent definitions, no baselines, and no breakdown between traditional results, AI Overviews, and AI Mode. The article organizes these into usage claims, volume claims, and quality claims, and notes that none include precise counts or time-series data comparable to the revenue disclosures.

The piece also surveys independent measurement: Seer Interactive found organic CTR on queries with AI Overviews dropped from 1.76% to 0.61% year over year. Pew data showed 8% click-through when AI Overviews appeared versus 15% without. But each dataset covers a different slice — specific query panels, referral paths, or devices — so none can reproduce Google's aggregate outbound-click numbers. Search Console's generative AI reports show impressions but not clicks, which is a telling gap for anyone trying to audit traffic impact at the site level.

## What it means for your config

This isn't a tooling release, so there's no config migration or breaking change to worry about. But if you maintain analytics pipelines, SEO monitoring dashboards, or traffic-attribution configs, the takeaway is practical: don't treat any single data source as ground truth for AI-driven search traffic. Your Search Console setup won't show you AI Overview click-throughs. Your rank-tracking tool's CTR data won't isolate AI surfaces. And Google's own public statements won't give you the numbers to reconcile the two.

If you're configuring alerts or reporting thresholds based on organic traffic trends, build in awareness that the measurement landscape is fragmented. There's no authoritative click dataset to calibrate against right now, and the article makes clear that situation hasn't changed despite multiple quarters of earnings reports.

## Recommended next step

Read the full SEJ analysis for the detailed comparison table mapping each third-party study to what it actually measures (and what it doesn't). If you're responsible for traffic reporting or SEO tooling, use that table as a checklist: understand which slice of reality each of your data sources covers, and resist the temptation to extrapolate any single one into a verdict on whether AI search is helping or hurting your site. The honest answer, for now, is that the data to answer that question definitively doesn't exist in public.

---

**Read the full announcement on Search Engine Journal** → [Google's Q2: Precise Revenue Figures, Click Claims You Can't Check](https://www.searchenginejournal.com/googles-q2-precise-revenue-figures-click-claims-you-cant-check/583280/)