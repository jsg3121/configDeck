---
id: "https://www.searchenginejournal.com/emergency-brand-audit-what-ai-says-about-your-locations-recap/583422/"
tool: "searchenginejournal"
title: "Emergency Brand Audit: What AI Says About Your Locations"
link: "https://www.searchenginejournal.com/emergency-brand-audit-what-ai-says-about-your-locations-recap/583422/"
pubDate: 2026-07-24T19:53:26.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/emergency-brand-audit-what-ai-says-about-your-locations-recap/583422/"
contentType: "commentary"
summary: "A GatherUp webinar recap on Search Engine Journal walks through how AI search tools assemble local business descriptions from reviews, listings, and public web mentions — and why query-context matching now outranks star ratings in some AI answers."
---

Search Engine Journal published a recap of a GatherUp webinar where Annie Jackson and Jason Wertham demonstrated how ChatGPT, Google AI Overviews, and Ask Maps describe local businesses — often surfacing a 3.3-star result because it matched the query's specifics (vehicle type, service type, location) better than higher-rated competitors. The session introduced a four-prompt audit workflow and a "build, manage, defend" rollout for multi-location brands.

## What's actually new

The core finding worth internalizing: major directories like Google and Yelp block LLM crawlers from scraping review content on business profiles. Reviews only enter AI-generated answers when they're republished somewhere crawlable — your own website via review widgets, social media posts, etc. This means a business with thousands of Google reviews but no republished review content is effectively invisible to ChatGPT and similar tools for queries about "popular" or "highly reviewed" options.

Their consumer data from fall 2025 adds useful context: 55% of consumers had consulted Google or Bing AI summaries, 48% had asked ChatGPT about a local business, and 45% prioritize review recency over star rating. The presenters also flagged Google's AI slop penalty — Google is now actively penalizing low-value AI-generated content rather than just ignoring it.

One practical observation that's easy to miss: LLM answers behave non-deterministically. The same query across different devices, accounts, and times of day returns different results. Position tracking is the wrong metric; citation breadth across sources is what predicts whether your brand appears at all.

## What it means for your config

This isn't a developer tooling announcement, so there's no config file or build pipeline impact. But if you maintain structured data, schema markup, or CMS templates for multi-location sites, the takeaway is relevant: your review widget implementation matters for AI discoverability. If your site embeds reviews in a way that's rendered client-side only (e.g., loaded entirely via JavaScript after page load with no server-rendered content), LLM crawlers likely can't read them. The article doesn't go into technical implementation details on widget markup — the full on-demand session reportedly covers which widget placements make review content readable to crawlers, including carrying business replies alongside reviews. If you're managing location page templates, that's worth watching for specifics before changing anything.

The AI slop penalty is also worth noting if your content pipeline auto-generates location pages or FAQ sections with LLM tools. Generic AI-produced content for local pages is now a liability, not just noise.

## Recommended next step

If you manage multi-location sites or local SEO tooling, the most concrete action from this session is to run the four audit prompts they describe — in incognito or temporary-chat mode to avoid personalization bias — and see what AI tools actually say about your locations today. The prompts themselves, the republishing strategy details, and the monthly re-run method are all in the on-demand recording linked from the original article. Start there before rebuilding any templates or review integrations.

---

**Read the full announcement on Search Engine Journal** → [Emergency Brand Audit: What AI Says About Your Locations](https://www.searchenginejournal.com/emergency-brand-audit-what-ai-says-about-your-locations-recap/583422/)