---
id: "https://www.searchenginejournal.com/google-is-ai-modes-no-2-cited-domain-data-shows/582941/"
tool: "searchenginejournal"
title: "Google Is AI Mode's No. 2 Cited Domain, Data Shows"
link: "https://www.searchenginejournal.com/google-is-ai-modes-no-2-cited-domain-data-shows/582941/"
pubDate: 2026-07-20T23:26:26.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-is-ai-modes-no-2-cited-domain-data-shows/582941/"
contentType: "commentary"
summary: "Data from AI-visibility platform Profound shows google.com climbed to the second most-cited domain in Google's AI Mode, with citation share growing 8.4x between mid-April and late June — driven almost entirely by Business Profile cards and Product Knowledge Panels."
---

Search Engine Journal reports that google.com has become the second most-cited domain in Google's AI Mode, based on data from Profound, an AI-visibility tracking platform. The finding reinforces a self-citation pattern SEJ has been documenting for over a year across AI Overviews and AI Mode.

## What's actually new

The specific data point here is the 8.4x increase in google.com citation share between April 15 and June 30, concentrated in two Google-hosted surfaces: Business Profile cards (for local queries) and Product Knowledge Panels (for product queries). The sectors most affected on the local side include hospitality and travel, home services, restaurants and dining, real estate, and healthcare. For product searches, queries involving comparisons, compatibility checks, or spec lookups tend to surface the panel instead of linking to a retailer or brand site directly. Profound interprets the Product Knowledge Panel growth as a possible early signal of Google's Universal Commerce Protocol, but SEJ is careful to note this is Profound's read, not an official Google confirmation. Importantly, citation share measures what AI Mode links to — not where traffic ultimately lands.

## What it means for your config

This isn't a developer tooling or config story in the traditional sense — there's no schema change, no new API endpoint, and no build config to update. But if you maintain structured data feeds that power Google's surfaces, the implication is direct: the data inputs you already control (Google Business Profile fields, product feed attributes) are what populate the cards AI Mode is increasingly citing. If your team manages product feeds via Merchant Center or maintains Business Profiles programmatically through the Google Business Profile API, the quality and completeness of those data inputs now has a second downstream consumer beyond traditional Search. There's no new migration path or breaking change to flag here — the cards are built from existing data pipelines. The announcement doesn't detail any new markup or feed spec requirements, so there's nothing to change in your configs today.

## Recommended next step

Audit the completeness of the data you already push into Google's surfaces. For local businesses, that means hours, photos, reviews, and category accuracy in your Business Profile. For product listings, make sure your feed attributes — specs, compatibility info, pricing — are thorough, because those are the fields AI Mode appears to be pulling into its cited panels. This is less about adopting something new and more about treating existing structured data submissions as a first-class concern rather than a set-and-forget checkbox. The SEJ piece has useful context on the broader self-citation trend and the UCP angle worth reading in full.

---

**Read the full announcement on Search Engine Journal** → [Google Is AI Mode's No. 2 Cited Domain, Data Shows](https://www.searchenginejournal.com/google-is-ai-modes-no-2-cited-domain-data-shows/582941/)