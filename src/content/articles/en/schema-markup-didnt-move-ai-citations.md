---
id: "https://www.searchenginejournal.com/schema-markup-didnt-move-ai-citations-in-ahrefs-test/574568/"
tool: "searchenginejournal"
title: "Schema Markup Didn't Move AI Citations In Ahrefs Test"
link: "https://www.searchenginejournal.com/schema-markup-didnt-move-ai-citations-in-ahrefs-test/574568/"
pubDate: 2026-05-11T21:06:10.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/schema-markup-didnt-move-ai-citations-in-ahrefs-test/574568/"
contentType: "commentary"
summary: "Ahrefs ran a controlled test on 1,885 pages and found that adding JSON-LD schema markup produced no meaningful increase in AI citations across Google AI Overviews, AI Mode, or ChatGPT. The correlation between schema and AI visibility appears to reflect overall site quality, not a direct causal link."
---

Search Engine Journal covered a new Ahrefs report that directly tested whether adding JSON-LD schema markup causes pages to get cited more by AI systems. The short answer: it doesn't — at least not for pages that are already being cited.

## What's actually new

Ahrefs analyzed 6 million URLs and confirmed that pages cited by AI are roughly three times more likely to have JSON-LD. That's the correlation people have been pointing to. But when they isolated the variable — matching 1,885 pages that added schema against control pages with similar citation levels that never added it — none of the three platforms tested (Google AI Overviews, AI Mode, ChatGPT) showed a meaningful citation bump. Google AI Overviews actually showed a small decline relative to controls, though Ahrefs doesn't commit to calling that a real negative effect. A separate searchVIU experiment cited in the report found that five AI systems fetching pages in real time ignored JSON-LD, Microdata, and RDFa entirely, extracting only visible HTML.

The critical caveat: every page in the dataset already had 100+ AI Overview citations before schema was added. The report explicitly cannot tell us whether schema helps pages that aren't yet visible to AI. That's a different question entirely, and Ahrefs acknowledges it needs a separate study.

## What it means for your config

This isn't a developer tooling release, so there's no config migration or breaking change to worry about. But if you maintain structured data configs — whether through a CMS plugin, a static site generator pipeline, or hand-rolled JSON-LD templates — the takeaway is practical: don't add schema markup *specifically* to chase AI citations. The data doesn't support that use case for already-visible pages.

Schema still earns its keep for rich results, knowledge graph eligibility, and general machine-readability. If you're generating JSON-LD as part of your build (e.g., via Next.js metadata APIs, Nuxt SEO modules, or Gatsby plugins), there's no reason to rip it out. But if someone on your team is proposing a sprint to retrofit schema across existing high-traffic pages purely for "AI SEO," this report is a useful counterargument.

The report doesn't address whether specific schema types (e.g., `FAQPage`, `HowTo`, `Article`) behave differently — all types were pooled. So if you're making fine-grained decisions about which schemas to implement, the data here won't help you differentiate.

## Recommended next step

Read the full Ahrefs report (linked from the article) for the methodology details, especially the matched difference-in-differences approach. If you're evaluating structured data ROI for your site, the honest move is to keep schema for its documented benefits — rich snippets, entity disambiguation, crawl hints — and stop treating it as an AI visibility lever until there's evidence it works for pages not already in the AI consideration set. For pages that AI already cites, your time is better spent on content quality and link signals, which Ahrefs suggests are the actual drivers behind the correlation.

---

**Read the full announcement on Search Engine Journal** → [Schema Markup Didn't Move AI Citations In Ahrefs Test](https://www.searchenginejournal.com/schema-markup-didnt-move-ai-citations-in-ahrefs-test/574568/)