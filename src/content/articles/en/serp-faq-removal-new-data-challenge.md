---
id: "https://www.searchenginejournal.com/serp-faq-removal-new-data-challenge-schemas-ai-search-value/574993/"
tool: "searchenginejournal"
title: "SERP FAQ Removal & New Data Challenge Schema's AI Search Value"
link: "https://www.searchenginejournal.com/serp-faq-removal-new-data-challenge-schemas-ai-search-value/574993/"
pubDate: 2026-05-16T12:00:54.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/serp-faq-removal-new-data-challenge-schemas-ai-search-value/574993/"
contentType: "commentary"
summary: "Google ended FAQ rich results and an Ahrefs study found no meaningful AI citation lift from adding JSON-LD schema to already-visible pages. The SEJ article examines what this means for schema strategies and the growing GEO advisory space."
---

Search Engine Journal published a detailed analysis combining two recent developments: Google's removal of FAQ rich results and an Ahrefs study measuring whether JSON-LD schema markup improves AI search citations. Together, the pieces challenge two of the most common justifications for investing in structured data markup.

## What's actually new

Google deprecated FAQ rich results, continuing a multi-year pattern of pulling back visible SERP rewards for specific structured data types (HowTo, Course Info, Claim Review, and others preceded it). Separately, Ahrefs tracked 1,885 pages that added JSON-LD against matched controls and found citation changes across AI Overviews, AI Mode, and ChatGPT were either statistically insignificant or, in AI Overviews' case, slightly negative. Crucially, every page in the Ahrefs dataset already had over 100 AI Overview citations before schema was added — so the study says nothing about whether schema helps undiscovered pages get indexed or cited for the first time. The study also pooled all schema types together, so type-specific effects (Product, Article, Organization, etc.) remain untested. Several prominent SEO practitioners weighed in, with opinions ranging from "schema for GEO is snake oil" to "the test scope was narrower than the headline suggests."

## What it means for your config

This isn't a tooling config change in the traditional sense, but if your build pipeline or CMS templates auto-inject FAQ JSON-LD expecting rich result rewards, that output is now dead weight for SERP features. Google says it will still use FAQ structured data to "better understand" pages, but what that yields in practice is undefined. Product, Review, Event, Video, and Organization schema types still have active rich result support or entity-description value, so a blanket removal of all structured data from your templates would be premature. If you maintain schema generation logic — whether in a static site generator, a CMS plugin, or a custom build step — the practical move is to audit which types you're emitting and why. Remove or deprioritize FAQ markup that was there purely for rich results. Keep types that still have documented SERP features or that accurately describe your content's entities. The Ahrefs data doesn't support adding schema specifically to chase AI citations on pages already being crawled and cited, but it also can't rule out benefits for pages not yet in that position.

## Recommended next step

Review your structured data output — in your site templates, CMS config, or build tooling — and identify any FAQ schema you're generating. If it was there for rich results, it no longer earns them. For other schema types, check Google's current structured data documentation to confirm they still power active features before investing maintenance effort. Don't rip out all structured data based on a single study that pooled types and tested only already-visible pages; but also stop treating "add schema" as a reliable lever for AI search visibility until better type-specific data exists. The SEJ article covers the practitioner debate and study limitations in detail worth reading before making broader changes.

---

**Read the full announcement on Search Engine Journal** → [SERP FAQ Removal & New Data Challenge Schema's AI Search Value](https://www.searchenginejournal.com/serp-faq-removal-new-data-challenge-schemas-ai-search-value/574993/)