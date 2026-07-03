---
id: "https://www.searchenginejournal.com/google-ends-cache-served-amp-pages-in-search/581405/"
tool: "searchenginejournal"
title: "Google Ends Cache-Served AMP Pages In Search"
link: "https://www.searchenginejournal.com/google-ends-cache-served-amp-pages-in-search/581405/"
pubDate: 2026-07-02T20:06:10.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-ends-cache-served-amp-pages-in-search/581405/"
contentType: "commentary"
summary: "As of July 1, Google Search no longer serves AMP pages from its AMP Cache or AMP viewer. Clicks on AMP results now route directly to the domain's own AMP host page, while AMP content continues to rank like any other page."
---

Search Engine Journal reports that Google has stopped serving AMP pages through its AMP Cache, AMP viewer, and signed exchanges. As of July 1, clicking an AMP result in Google Search takes users directly to the publisher's own AMP host page instead of a Google-cached version.

## What's actually new

Previously, tapping an AMP result caused Google to serve the page from its own cache infrastructure, displayed inside the AMP viewer under a `google.com` URL. Signed exchanges existed as a workaround to let the original domain URL appear instead. Google has now removed all three mechanisms — AMP Cache, AMP viewer, and signed exchanges — from the serving path entirely. The AMP documentation has been updated to reflect this, and the AMP URL on the publisher's domain is what users see when they click through from Search. Ranking behavior is unchanged: AMP content ranks like any other web page.

## What it means for your config

This is mostly a subtraction. If you've been maintaining signed exchange configurations specifically so your domain URL would display instead of a `google.com` AMP Cache URL, that entire setup is now unnecessary. You can safely remove signed exchange headers and any related server configuration without affecting how Google serves your AMP pages.

For teams still publishing AMP pages alongside canonical pages, the infrastructure simplification is worth noting: your AMP pages are now just regular pages from a serving perspective. There's no special Google-side caching layer sitting in front of them. This means your own CDN, caching headers, and server performance matter more than they did when Google's cache was absorbing the load. If you were leaning on Google's AMP Cache as an implicit performance layer, verify your origin can handle the traffic directly.

If you've been on the fence about maintaining AMP pages at all, this removes one of the last pieces of AMP-specific plumbing. AMP is now just another page format that Google indexes and ranks normally — no special delivery mechanism, no Top Stories requirement (that was dropped back in 2021), no lightning-bolt icon. The decision to keep or drop AMP is now purely a question of whether the framework serves your development workflow and performance goals.

## Recommended next step

Audit your server and deployment configs for any AMP Cache or signed exchange references. If you find signed exchange response headers, link-rel preload entries for AMP Cache origins, or any AMP Cache–specific CORS rules, those can be cleaned up. Then confirm your AMP host pages load correctly and perform well when served directly from your own infrastructure — Google is no longer fronting them for you.

---

**Read the full announcement on Search Engine Journal** → [Google Ends Cache-Served AMP Pages In Search](https://www.searchenginejournal.com/google-ends-cache-served-amp-pages-in-search/581405/)