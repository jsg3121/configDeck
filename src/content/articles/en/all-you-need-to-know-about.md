---
id: "https://www.searchenginejournal.com/all-you-need-to-know-about-cloudflares-agent-readiness-score/574226/"
tool: "searchenginejournal"
title: "All You Need To Know About Cloudflare's Agent Readiness Score"
link: "https://www.searchenginejournal.com/all-you-need-to-know-about-cloudflares-agent-readiness-score/574226/"
pubDate: 2026-05-24T12:00:59.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/all-you-need-to-know-about-cloudflares-agent-readiness-score/574226/"
contentType: "commentary"
summary: "Search Engine Journal breaks down Cloudflare's new Agent Readiness Score scanner — a 16-check, 5-category audit tool at isitagentready.com that scores how prepared a website is for AI agent interaction. The article details every check, flags where the composite score is structurally misleading, and walks through a real scan result."
---

Search Engine Journal published a detailed walkthrough of Cloudflare's Agent Readiness Score, a public scanner shipped during Cloudflare Agents Week that grades any website on its preparedness for AI agent traffic. The article dissects all 16 checks across 5 categories, runs the author's own site through the scanner, and critically examines where the single composite number misleads.

## What's actually new

Cloudflare's scanner at isitagentready.com checks websites across five categories: Discoverability (robots.txt, sitemap, Link headers), Content (Markdown content negotiation via the Accept header), Bot Access Control (AI-specific robots.txt directives, Content Signals, Web Bot Auth signing), API/Auth/MCP/Skill Discovery (six checks covering RFC 9727 API catalogs, OAuth/OIDC discovery, MCP server cards, agent skills indexes, and experimental WebMCP), and Commerce (optional checks for x402, UCP, and ACP). The scanner is available as a web tool, integrated into Cloudflare Radar, exposed via the Cloudflare URL Scanner API, and — notably — available as a stateless MCP server so AI agents themselves can invoke it. The article flags that a content-focused blog can score poorly because it legitimately doesn't need MCP endpoints or OAuth discovery, making the composite number misleading without category-level context.

## What it means for your config

This is relevant to anyone maintaining `robots.txt`, `sitemap.xml`, or `.well-known/` paths — which is squarely config territory. Several of the checks map to files developers already manage: adding AI-specific User-agent directives (GPTBot, ClaudeBot, etc.) to `robots.txt`, ensuring `sitemap.xml` is either at the standard path or declared via a `Sitemap:` directive, and optionally serving content at well-known endpoints like `/.well-known/api-catalog` or `/.well-known/mcp/server-card.json`. The Content Signals spec (directives inside `robots.txt`) and Markdown content negotiation are both nascent — neither is an IETF standard yet — so adoption costs are real but the ecosystem is still forming. If you run a content site and your score tanks on API/Auth/MCP checks, that's the structural mislead the article warns about, not a config deficiency. No breaking changes to existing configs here; this is additive. The standards underlying several checks (RFC 9727, RFC 9728, SEP-1649) are either drafts or very new, so expect these to shift.

## Recommended next step

Run your site through the scanner at isitagentready.com and select the appropriate website type (Content Site vs. API/Application vs. All Checks) before reading your score — the category filter changes which checks count. Focus on the per-category pass/fail results, not the composite number. If you maintain `robots.txt` already, the cheapest wins are adding AI-specific bot directives and Content Signals. For everything else — MCP server cards, WebMCP, agent skills indexes — read the original article's full breakdown of each check before deciding whether the spec maturity justifies the implementation effort for your use case.

---

**Read the full announcement on Search Engine Journal** → [All You Need To Know About Cloudflare's Agent Readiness Score](https://www.searchenginejournal.com/all-you-need-to-know-about-cloudflares-agent-readiness-score/574226/)