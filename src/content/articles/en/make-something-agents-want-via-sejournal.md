---
id: "https://www.searchenginejournal.com/make-something-agents-want/576188/"
tool: "searchenginejournal"
title: "Make Something Agents Want"
link: "https://www.searchenginejournal.com/make-something-agents-want/576188/"
pubDate: 2026-06-21T12:00:34.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/make-something-agents-want/576188/"
contentType: "commentary"
summary: "Search Engine Journal outlines how six major infrastructure companies — Cloudflare, Shopify, Stripe, Supabase, Netlify, and Google — independently built for AI agent visitors, and argues that agent-readiness is now a concrete distribution concern for any website."
---

Search Engine Journal published an analysis arguing that AI agents are becoming a real distribution channel for websites, not a hypothetical one. The piece documents how six companies across different industries each invested in agent-facing infrastructure within the same recent window, without coordinating with each other.

## What's actually new

The article's core evidence is the convergence: Cloudflare devoted a full launch week to agent tooling (identity via Web Bot Auth, content via Markdown for Agents, functions via WebMCP, measurement via an Agent Readiness Score). Shopify shipped an Agent Toolkit that lets AI agents browse catalogs, check inventory, and complete checkout via structured API — enabled by default for all merchants. Google expanded Universal Commerce Protocol at I/O 2026 with Universal Cart and added Agent Payments Protocol to the FIDO Alliance with 60 organizations. Stripe launched Projects for agent-driven account creation and payments. Netlify built a separate `netlify.ai` entry point specifically for non-human visitors to deploy and manage sites. Supabase's machine-readable identity ("Postgres development platform") made it a default for AI-built apps almost by accident. The article frames agent-readiness as three layers: can agents read your content (server-rendered HTML, semantic structure), can they discover what you offer (robots.txt acknowledging AI user agents, current sitemaps, structured data), and can they act (protocol-level transaction support via UCP, MCP, WebMCP).

## What it means for your config

This isn't a release with migration steps — it's a strategic framing piece. But for teams that manage web infrastructure config, a few concrete items surface. First, rendering strategy matters: if your site depends entirely on client-side JavaScript to display core content, agents see nothing. Server-side rendering or static generation is the baseline config decision here, and it's one most developer tooling sites can address in their framework config (Next.js, Nuxt, Astro, etc.). Second, `robots.txt` and sitemap configs need attention — specifically whether they acknowledge AI-specific user agents or inadvertently block them. Third, structured data markup (JSON-LD, schema.org) becomes more load-bearing when agents, not just search crawlers, rely on it to understand what your site offers. The article doesn't prescribe specific config syntax for any of these — it operates at the strategy layer. If you're running Cloudflare, Shopify, Netlify, or Stripe, the original piece links to the specific agent tooling each platform now offers, and those docs will have the real config details.

## Recommended next step

Audit your current rendering pipeline and `robots.txt` before chasing protocol-level integrations. The article makes a clear case that server-rendered HTML and proper crawl permissions are the lowest-effort, highest-impact changes. If your site already server-renders and has clean structured data, the next thing to investigate is whether your platform (Shopify, Netlify, Cloudflare, etc.) has shipped agent-specific tooling you haven't enabled yet — Shopify's Agent Toolkit being on by default means your store may already be participating without you reviewing what product data it exposes. Read the full piece for the specifics on each platform's approach.

---

**Read the full announcement on Search Engine Journal** → [Make Something Agents Want](https://www.searchenginejournal.com/make-something-agents-want/576188/)