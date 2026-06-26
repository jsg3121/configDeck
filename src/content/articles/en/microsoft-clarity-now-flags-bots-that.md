---
id: "https://www.searchenginejournal.com/microsoft-clarity-now-flags-bots-that-ignore-robots-txt/580446/"
tool: "searchenginejournal"
title: "Microsoft Clarity Now Flags Bots That Ignore Robots.txt"
link: "https://www.searchenginejournal.com/microsoft-clarity-now-flags-bots-that-ignore-robots-txt/580446/"
pubDate: 2026-06-24T20:13:45.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/microsoft-clarity-now-flags-bots-that-ignore-robots-txt/580446/"
contentType: "commentary"
summary: "Microsoft Clarity's Bot Analytics dashboard now detects and reports bot requests to URLs disallowed by robots.txt, giving site owners a free way to monitor crawler compliance. The feature requires a supported CDN or the latest Clarity WordPress plugin."
---

Microsoft Clarity has added a violations view to its Bot Analytics dashboard that flags bot requests targeting paths disallowed by a site's robots.txt, as reported by Search Engine Journal. The feature builds on Clarity's existing AI Visibility tools, which already surface grounding queries behind AI citations.

## What's actually new

Clarity now checks incoming bot requests against your robots.txt directives and calculates disallowed requests as a percentage of total bot activity over a chosen time period. You can filter by bot operator, bot name, request type, and requested URL/path, and there's a side-by-side comparison view for compliant crawlers versus violators. The feature is not on by default — a project admin needs to enable it under the AI Visibility section of Project Settings. It requires one of the supported CDNs (Fastly, Amazon CloudFront, Cloudflare, Azure Front Door, or Akamai) or the latest Microsoft Clarity WordPress plugin. An important caveat: this records requests that *reached* disallowed paths, not requests that were blocked. Robots.txt is advisory, and Clarity is a measurement layer, not an enforcement one.

## What it means for your config

This doesn't change how you write your robots.txt — it changes whether you can tell if anyone is ignoring it. If you've been maintaining extensive `Disallow` rules for AI crawlers (GPTBot, CCBot, etc.) but had no easy way to verify compliance beyond parsing raw server logs, Clarity now automates that audit.

There's no migration involved on the robots.txt side. Your existing directives are what Clarity checks against. But you do need infrastructure alignment: your site must sit behind one of the five named CDNs, or run the Clarity WordPress plugin. If you're on a different CDN or a non-WordPress CMS without CDN integration, this feature isn't available to you yet. The announcement doesn't detail whether additional CDN or platform support is planned.

One thing worth noting for teams that manage robots.txt as config-in-code (checked into version control, deployed via CI): the accuracy of Clarity's violation reports depends entirely on your live robots.txt being in sync with your intent. Stale or incorrectly deployed robots.txt files will produce misleading violation data. If you've been sloppy about treating robots.txt as a managed config artifact, this is a good reason to tighten that up.

## Recommended next step

If you're already running Clarity and using a supported CDN, go enable the feature in Project Settings → AI Visibility and let it collect a week or two of data before drawing conclusions. If you're not on Clarity yet, it's free and the setup cost is low — worth it just for this visibility. Either way, take a fresh look at your robots.txt to make sure it accurately reflects which paths you actually want to restrict. Clarity will only be as useful as the rules it's checking against, and many sites have robots.txt files that haven't been reviewed since before the current wave of AI crawlers existed.

---

**Read the full announcement on Search Engine Journal** → [Microsoft Clarity Now Flags Bots That Ignore Robots.txt](https://www.searchenginejournal.com/microsoft-clarity-now-flags-bots-that-ignore-robots-txt/580446/)