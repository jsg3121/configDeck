---
id: "https://www.searchenginejournal.com/googles-spam-update-now-reaches-ai-answers-enforcement-is-hard/580535/"
tool: "searchenginejournal"
title: "Google's Spam Update Now Reaches AI Answers. Enforcement Is Hard"
link: "https://www.searchenginejournal.com/googles-spam-update-now-reaches-ai-answers-enforcement-is-hard/580535/"
pubDate: 2026-06-27T12:00:59.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/googles-spam-update-now-reaches-ai-answers-enforcement-is-hard/580535/"
contentType: "commentary"
summary: "Google's June spam update now enforces policies against manipulating generative AI answers in Search. A Cornell Tech preprint shows why enforcement is structurally difficult — the user-generated pages AI agents rely on are the same surfaces attackers can poison."
---

Search Engine Journal reports that Google's June 2025 spam update — the year's second — now explicitly enforces the policy treating manipulation of generative AI responses as spam. The piece ties this to a Cornell Tech preprint (not yet peer-reviewed) that demonstrates how planted text on user-generated pages can steer AI research agents' output.

## What's actually new

The spam policy itself isn't new — Google previously added language about manipulating generative AI responses. What's new is active enforcement via a spam update. The Cornell Tech paper, surfaced by 404 Media, gives that enforcement some uncomfortable context: the researchers found that roughly 13 words of planted text on a frequently retrieved community page were enough to inject an attacker's chosen entity into AI-generated reports in 38% to 51% of sessions that retrieved the page. Spreading the planted text across multiple pages pushed that to 42% to 62%. The three agents tested — STORM, Co-STORM, and OmniThink — are open-source; ChatGPT Deep Research and Gemini Deep Research were only observed for citation habits, not directly attacked, for ethical reasons. The researchers tried three defensive approaches (excluding user-generated sources, pre-screening with an LLM, and post-hoc fact-checking) and none worked without degrading result quality.

## What it means for your config

This isn't a tooling or config change in the traditional sense — there's no schema update, no new robots directive, and no structured-data field to add. But if you maintain any configuration that governs how your site's content appears on user-generated platforms (review widgets, forum embeds, comment sections with indexable markup), this is worth auditing. Google hasn't disclosed whether enforcement runs through SpamBrain, manual review, or a dedicated mechanism, so there's no specific technical signal to watch for yet. The article also notes that no dashboard currently tells site owners whether their content was cited, skipped, or misrepresented in an AI-generated answer — meaning there's no monitoring config you can set up on Google's side today. If you run SEO tooling configs (crawl directives, sitemap policies, structured data), nothing changes right now. We'll revisit if Google publishes specific guidance on how sites can signal or protect against third-party manipulation in AI retrieval contexts.

## Recommended next step

Read the full Search Engine Journal piece for the research specifics and the broader SEO implications, especially if you work in ecommerce or local search where the paper's test cases (product recommendations, service queries, restaurant picks) map directly to your traffic. The practical takeaway is defensive: audit user-generated content surfaces you control (forums, comment sections, community pages) for injected recommendations you didn't write. And if you're on the other side — tempted to plant brand mentions across community pages to appear in AI answers — understand that Google now classifies this as spam and is actively updating against it, even if enforcement remains structurally hard.

---

**Read the full announcement on Search Engine Journal** → [Google's Spam Update Now Reaches AI Answers. Enforcement Is Hard](https://www.searchenginejournal.com/googles-spam-update-now-reaches-ai-answers-enforcement-is-hard/580535/)