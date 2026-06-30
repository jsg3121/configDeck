---
id: "https://www.searchenginejournal.com/search-and-agents-are-one-product-you-only-need-one-playbook/576191/"
tool: "searchenginejournal"
title: "Search And Agents Are One Product. You Only Need One Playbook"
link: "https://www.searchenginejournal.com/search-and-agents-are-one-product-you-only-need-one-playbook/576191/"
pubDate: 2026-06-28T12:00:52.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/search-and-agents-are-one-product-you-only-need-one-playbook/576191/"
contentType: "commentary"
summary: "Search Engine Journal argues that Google's agentic search direction and classical SEO share one optimization playbook, citing statements from Sundar Pichai and SVP Nick Fox. The practical upshot for developers: server-rendered HTML, semantic markup, and structured data matter for both human visitors and AI agents."
---

Search Engine Journal published an analysis pulling together statements from Google CEO Sundar Pichai and SVP Nick Fox to argue that optimizing for AI-driven agentic search and traditional search are the same discipline. The piece makes a concrete case that the technical requirements for both converge on the same set of web fundamentals.

## What's actually new

The article centers on two recent Google executive quotes. Pichai described Search becoming "an agent manager" where information-seeking queries turn agentic, with users completing tasks and running multiple threads inside AI Mode. Fox, at Google Marketing Live 2026, stated plainly: "The way to optimize for AI search is the same way to optimize for search. Create great content." Fox added that content needs to go beyond surface-level summaries because AI already handles first-level responses — the value is in original data, first-person experience, and specificity the model can't generate itself. The article also references a study of 274 fintech companies finding that 36% are partially invisible to AI crawlers due to JavaScript rendering dependencies, with 17% delivering zero content without JS execution.

## What it means for your config

This isn't a config-file story in the traditional sense, but the technical checklist the article describes maps directly to decisions developers make in build tooling and deployment configs. If your site depends on client-side JavaScript to render core content, the argument here is that you're invisible to both traditional crawlers and the new class of AI agents. That means your framework config — whether it's Next.js, Nuxt, SvelteKit, or anything else — needs to be set up for server-side rendering or static generation as the default path, not as an afterthought.

Structured data (JSON-LD, schema markup) and semantic HTML aren't new requirements, but the article frames them as equally critical for agents browsing on behalf of users with OS-level permissions. If you're shipping a site without structured data today, the surface area of things that can't parse your content just got wider.

The article doesn't introduce any new config format, migration path, or breaking change. It's reinforcing that the existing best practices — SSR/SSG defaults, semantic markup, structured data, fast TTFB, crawlable internal links — are now doing double duty for a visitor class that includes autonomous agents. No new tooling to adopt; just a stronger reason to audit what you already have.

## Recommended next step

Run a quick check on your site's raw HTML output. Curl your key pages without JavaScript and see what comes back. If the answer is an empty `<div id="app">`, your framework's rendering config is the first thing to fix. After that, validate your structured data with Google's Rich Results Test and make sure your internal linking doesn't depend on JS-driven navigation. The article's core point is that these aren't separate agent-readiness tasks — they're the same SEO hygiene you should already be doing, now with a more concrete reason to prioritize them.

---

**Read the full announcement on Search Engine Journal** → [Search And Agents Are One Product. You Only Need One Playbook](https://www.searchenginejournal.com/search-and-agents-are-one-product-you-only-need-one-playbook/576191/)