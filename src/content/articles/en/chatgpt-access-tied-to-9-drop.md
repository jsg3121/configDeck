---
id: "https://www.searchenginejournal.com/chatgpt-access-tied-to-9-drop-in-traditional-search/582167/"
tool: "searchenginejournal"
title: "ChatGPT Access Tied To 9% Drop In Traditional Search"
link: "https://www.searchenginejournal.com/chatgpt-access-tied-to-9-drop-in-traditional-search/582167/"
pubDate: 2026-07-13T17:54:10.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/chatgpt-access-tied-to-9-drop-in-traditional-search/582167/"
contentType: "commentary"
summary: "A Bocconi University study using Comscore clickstream data finds that broader ChatGPT Search access correlated with a 9.4% drop in traditional search queries, with the sharpest declines in informational and academic categories."
---

Search Engine Journal covers a Bocconi University paper analyzing U.S. desktop clickstream data to measure how ChatGPT Search's rollout — from paid subscribers to free and anonymous users — affected traditional search behavior. The findings paint a specific, numbers-backed picture of where AI chat is pulling attention away from conventional search engines.

## What's actually new

The headline number: broader ChatGPT Search access correlated with a 9.4% weekly reduction in traditional search queries, growing to 17% after 20 weeks. Among users who were already on ChatGPT before the expanded rollout, the drop was smaller — 4.9% on average, reaching 8.2% after 20 weeks. The decline concentrated heavily in informational queries: academic research referrals fell 32.8% and reference queries dropped 26.5%, while transactional and recreational searches stayed roughly flat. ChatGPT referred users to outside websites in 5.2% of sessions versus Google's 31.1%, and the destinations skewed toward smaller, specialized sites — SaaS platforms, developer tools, academic resources, and non-profit or subscription-based services rather than ad-supported properties. The researchers are explicit about the limits of their claim: they measured traffic allocation changes, not consumer surplus or publisher revenue impact.

## What it means for your config

This isn't a tooling release, so there's no config migration or breaking change to worry about. But if you maintain developer-facing documentation sites, API references, or SaaS landing pages, the data is worth noting: ChatGPT's referral patterns appear to favor exactly these kinds of properties over mainstream ad-supported destinations. That has implications for how you think about discoverability. If your docs site or developer portal relies on organic search traffic for adoption metrics, a portion of that funnel may be quietly shifting to AI-mediated discovery — where your content gets consumed but generates fewer actual visits. There's no config switch to flip for this; it's a structural trend in how traffic arrives. Teams that instrument referral sources (via analytics configs, UTM parameters, or server log parsing) should make sure they're tagging AI-originated traffic distinctly so they can actually measure the shift rather than guessing.

## Recommended next step

If you run a developer docs site or SaaS platform, check whether your analytics setup distinguishes AI referrals from traditional search. Most default configurations lump them together or miss them entirely. Adding referrer-based segmentation now gives you a baseline before the trend deepens. For the full data and the researchers' own caveats about scope, read the original coverage — the Bocconi team is deliberately narrow in their claims, and that restraint is worth understanding before you act on the numbers.

---

**Read the full announcement on Search Engine Journal** → [ChatGPT Access Tied To 9% Drop In Traditional Search](https://www.searchenginejournal.com/chatgpt-access-tied-to-9-drop-in-traditional-search/582167/)