---
id: "https://www.searchenginejournal.com/google-says-hyphenated-domain-names-are-okay-for-seo/578390/"
tool: "searchenginejournal"
title: "Google Says Hyphenated Domain Names Are Okay For SEO"
link: "https://www.searchenginejournal.com/google-says-hyphenated-domain-names-are-okay-for-seo/578390/"
pubDate: 2026-06-08T23:43:54.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-says-hyphenated-domain-names-are-okay-for-seo/578390/"
contentType: "commentary"
summary: "Google's John Mueller confirmed on Bluesky that hyphenated domain names carry no SEO penalty, noting the technical limit is 61 hyphens. Search Engine Journal provides historical context on why the SEO community has long treated them as spammy."
---

Google's John Mueller stated on Bluesky that hyphens in domain names are fine for SEO, and that the technical upper limit is apparently 61 hyphens. Search Engine Journal covered the statement along with a deep historical look at why hyphenated domains fell out of favor.

## What's actually new

The core news is thin: Mueller's comment is a casual Bluesky post confirming something Google hasn't formally penalized. There's no algorithm update, no documentation change, and no new Search Console signal involved. What the Search Engine Journal article adds is useful context — hyphenated domains were heavily exploited in the early 2000s for keyword-stuffing reasons, and once those tactics stopped working, the community assumed hyphens themselves were the problem. The article points out that brands like Mercedes-Benz, T-Mobile, Coca-Cola, and Merriam-Webster all use hyphenated domains and rank without issue. The W3C-affiliated web-platform-tests.org and the U.S. government's e-verify.gov are cited as additional examples. The practical takeaway from the article is that any historical stigma around hyphens was tied to the low-quality sites that used them, not the hyphens as a ranking signal.

## What it means for your config

This has zero impact on build tooling, deployment configs, or developer infrastructure. If you're setting up DNS records, reverse proxies, or CI/CD pipelines, hyphens in domain names have always been technically valid per RFC 952 and RFC 1123 — nothing changes there. Where this might matter for dev teams: if your company is choosing a domain for a new product or microservice and someone vetoed a hyphenated option purely on SEO grounds, Mueller's comment removes that objection. Your nginx configs, Cloudflare settings, and SSL certificates don't care about hyphens, and apparently neither does Google's ranking system. The article does flag legitimate UX concerns — hyphenated domains are harder to type on mobile and can look less trustworthy to users — but those are branding decisions, not config decisions.

## Recommended next step

If you've been avoiding hyphens in domain names solely because of SEO folklore, this is a reasonable data point that the concern was overblown. Before registering a hyphenated domain for a new project, weigh the actual UX tradeoffs the article mentions (mobile typing friction, user trust perception) against readability gains. For existing hyphenated domains, there's nothing to migrate away from. Read the full article for the historical context and the list of prominent sites that rank fine with hyphens — it's a useful reference next time this debate comes up in a planning meeting.

---

**Read the full announcement on Search Engine Journal** → [Google Says Hyphenated Domain Names Are Okay For SEO](https://www.searchenginejournal.com/google-says-hyphenated-domain-names-are-okay-for-seo/578390/)