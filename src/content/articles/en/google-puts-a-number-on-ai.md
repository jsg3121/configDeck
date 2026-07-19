---
id: "https://www.searchenginejournal.com/google-puts-a-number-on-ai-search-clicks-without-the-data/582755/"
tool: "searchenginejournal"
title: "Google Puts A Number On AI Search Clicks, Without The Data"
link: "https://www.searchenginejournal.com/google-puts-a-number-on-ai-search-clicks-without-the-data/582755/"
pubDate: 2026-07-18T05:00:48.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-puts-a-number-on-ai-search-clicks-without-the-data/582755/"
contentType: "commentary"
summary: "Google claims AI features in Search send billions of clicks to websites weekly, but provides no underlying data, methodology, or per-site metrics to verify the claim. Search Engine Journal breaks down what's actually available — and what's not — in Search Console's new AI reports."
---

Search Engine Journal reports that Google SVP Nick Fox publicly stated AI features in Search now send "billions of clicks to websites every week," adding to Google's longstanding claim of billions of daily clicks from Search overall. SEJ's analysis focuses on a critical gap: neither figure comes with a baseline, denominator, or any verifiable methodology.

## What's actually new

There are two distinct claims now in play. The daily click figure has been cited before — Liz Reid used it in an August 2025 blog post, noting organic click volume was relatively stable year-over-year without providing exact numbers. The weekly AI-feature figure appears to be new; SEJ couldn't find any prior Google statement breaking out click counts by AI features before Fox's post on July 17. Both numbers are stated only as "billions," making it impossible to determine what share of total Search clicks originate from AI features. Meanwhile, Google is rolling out generative AI performance reports in Search Console to a limited group of site owners. These reports show impressions with page, country, and device breakdowns — but notably do not include click data.

## What it means for your config

This isn't a tooling or configuration change — it's a data availability problem. If you maintain SEO monitoring pipelines, analytics dashboards, or automated reporting configs that pull from the Search Console API, the new AI performance reports won't give you click metrics to work with. Your existing Search Console integration will continue to function as before for standard search data, but there's no new click endpoint or data field to configure for AI-sourced traffic. Google says more metrics will come to the AI reports eventually but hasn't specified which ones or when. Until that happens, there's nothing to reconfigure. If you're building alerting or reporting around AI search visibility, impressions are the ceiling of what's available right now — plan your dashboards accordingly.

## Recommended next step

If you rely on Search Console data for traffic analysis or SEO tooling, check whether your account has access to the new generative AI performance reports. If it does, familiarize yourself with what's actually there (impressions, not clicks) so you don't build reporting assumptions around data that doesn't exist yet. For anyone tracking the impact of AI features on referral traffic, your own analytics (server logs, GA, etc.) remain the only source of ground truth for your site. Google's aggregate "billions" number tells you nothing about your traffic specifically, and the tooling to bridge that gap isn't shipped yet. Watch for updates to the Search Console API documentation — that's where any real config changes will surface.

---

**Read the full announcement on Search Engine Journal** → [Google Puts A Number On AI Search Clicks, Without The Data](https://www.searchenginejournal.com/google-puts-a-number-on-ai-search-clicks-without-the-data/582755/)