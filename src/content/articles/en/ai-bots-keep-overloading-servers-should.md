---
id: "https://www.searchenginejournal.com/ai-bots-keep-overloading-servers-should-website-owners-keep-paying/579018/"
tool: "searchenginejournal"
title: "AI Bots Keep Overloading Servers. Should Website Owners Keep Paying?"
link: "https://www.searchenginejournal.com/ai-bots-keep-overloading-servers-should-website-owners-keep-paying/579018/"
pubDate: 2026-06-11T23:53:14.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/ai-bots-keep-overloading-servers-should-website-owners-keep-paying/579018/"
contentType: "commentary"
summary: "Search Engine Journal covers a Kinsta report showing AI bot traffic has become an infrastructure and cost problem, not just a scraping concern. The piece argues site owners need granular bot management strategies rather than blanket allow/block policies."
---

Search Engine Journal published a detailed piece examining how AI bot traffic has moved well beyond the scraping debate into real infrastructure cost and analytics reliability territory. The article draws heavily on a Kinsta report and commentary from Cloudflare's David Belson.

## What's actually new

The core finding is that poorly coded bots — not sophisticated scrapers — are the bigger operational headache. The article cites a pattern where Meta's meta-externalagent crawler followed URL variations for days before mitigation kicked in, not out of malice but out of bad automation hygiene. Cloudflare's Belson puts it bluntly: people are vibe-coding bots and releasing them without even checking `robots.txt`. The report states roughly 80% of AI crawling activity is tied to model training, and AI bot traffic grew 300% over the past year, with approximately one in every 31 visits on TollBit's network coming from an AI bot by end of 2025. The real damage happens when bots hit dynamic endpoints — cart pages, checkout flows, filtered product listings — triggering PHP execution, database queries, and session handling that bypass caching entirely.

## What it means for your config

This isn't about a specific tool releasing a new version, so there's no config migration to worry about. But if you manage server configuration — whether that's Nginx rules, Cloudflare WAF policies, CDN caching layers, or `robots.txt` — the takeaway is actionable. The article advocates separating search crawlers from AI training crawlers in your access policies rather than applying a single blanket rule. That means your `robots.txt` and any rate-limiting config should distinguish between user agents you can tie to discoverability value (search engine crawlers) and those associated with model training or unknown purposes. The article also highlights that parameter-heavy URLs and dynamic commerce endpoints deserve stricter bot restrictions than static content pages. If you're running an e-commerce stack, auditing which paths are exposed to unchecked crawler access is the most immediate config concern. The article doesn't prescribe specific directives or tool configurations, so check the Kinsta report for any concrete implementation guidance.

## Recommended next step

Before touching any config, audit your server logs or CDN analytics to see what automated traffic is actually hitting your dynamic endpoints. Identify repeat-request patterns, crawler loops, and bot traffic to high-cost paths like cart and search pages. Once you have that visibility, you can make informed decisions about which user agents get access to which parts of your site — rather than guessing or applying a blanket block that might hurt your search visibility. The original article and the linked Kinsta report are worth reading in full for the data backing these recommendations.

---

**Read the full announcement on Search Engine Journal** → [AI Bots Keep Overloading Servers. Should Website Owners Keep Paying?](https://www.searchenginejournal.com/ai-bots-keep-overloading-servers-should-website-owners-keep-paying/579018/)