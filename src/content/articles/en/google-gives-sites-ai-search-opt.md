---
id: "https://www.searchenginejournal.com/google-gives-sites-ai-search-opt-out-but-not-the-data-to-use-it/577978/"
tool: "searchenginejournal"
title: "Google Gives Sites AI Search Opt-Out, But Not The Data To Use It"
link: "https://www.searchenginejournal.com/google-gives-sites-ai-search-opt-out-but-not-the-data-to-use-it/577978/"
pubDate: 2026-06-06T13:31:25.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-gives-sites-ai-search-opt-out-but-not-the-data-to-use-it/577978/"
contentType: "commentary"
summary: "The UK's CMA now requires Google to let publishers opt out of AI search features without ranking penalties, and Google has started testing a Search Console toggle for it — but the reporting only includes impressions, not the click data publishers need to make an informed decision."
---

Search Engine Journal breaks down the convergence of three separate events this week: the UK CMA's conduct requirement forcing Google to offer an AI search opt-out, Google's own Search Console toggle (currently testing with UK sites), and new AI performance reports in Search Console. The piece highlights a sharp gap between the opt-out mechanism and the data needed to evaluate it.

## What's actually new

Three things landed simultaneously. The CMA's conduct requirement legally obliges Google to let publishers withhold content from AI search features and AI model training, without ranking penalties. Google's new Search Console toggle lets publishers exclude their sites from AI Overviews, AI Mode, and AI Overviews in Discover at the domain level — page-level controls aren't available yet, with a deadline of March 2027 for those. And new AI performance reports in Search Console show impressions broken down by page and country, but notably lack click-throughs and click-through rates — two data points the CMA's interpretive notes explicitly say Google should provide. Previously, the `Google-Extended` tag could block AI training and grounding but not AI Overviews, and `nosnippet` blocked both AI and regular snippets together. The new toggle finally separates AI search participation from standard search visibility.

## What it means for your config

This is less about config files and more about site-level policy decisions, but the technical surface area is worth tracking. If you manage crawl directives — `robots.txt` rules, meta robots tags, or `Google-Extended` — the new Search Console toggle adds another layer to reason about. It operates at the domain level through the Search Console UI rather than through markup or `robots.txt`, so it doesn't change what's in your codebase today. However, anyone maintaining documentation or runbooks for SEO-related config should note that the previous workarounds (`Google-Extended` for training, `nosnippet` for snippets) now sit alongside a distinct domain-level AI search opt-out. The interaction between these controls — what happens if you set `Google-Extended` *and* use the toggle, or if you have `nosnippet` on specific pages while the domain-level toggle is off — isn't fully documented yet. Until Google publishes clearer precedence rules, treat these as separate controls with potentially overlapping scope and test conservatively.

## Recommended next step

If you operate sites that appear in Google's AI features, check whether your Search Console account has access to the new AI performance reports and review your current impression data as a baseline. Don't rush to flip the opt-out toggle — the whole point of the SEJ piece is that you can't yet measure what you'd lose. Instead, document your current crawl directives and AI-related tags (`Google-Extended`, `nosnippet`, any `data-nosnippet` attributes), so when click data does arrive in the reports, you can make a fast, informed decision rather than scrambling to audit your setup under pressure.

---

**Read the full announcement on Search Engine Journal** → [Google Gives Sites AI Search Opt-Out, But Not The Data To Use It](https://www.searchenginejournal.com/google-gives-sites-ai-search-opt-out-but-not-the-data-to-use-it/577978/)