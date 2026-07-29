---
id: "https://www.searchenginejournal.com/ai-search-is-working-how-to-prove-it-with-real-tests-recap/583306/"
tool: "searchenginejournal"
title: "AI Search is Working. How to Prove It With Real Tests."
link: "https://www.searchenginejournal.com/ai-search-is-working-how-to-prove-it-with-real-tests-recap/583306/"
pubDate: 2026-07-23T19:38:11.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/ai-search-is-working-how-to-prove-it-with-real-tests-recap/583306/"
contentType: "commentary"
summary: "Search Engine Journal recaps a seoClarity webinar laying out a split-testing methodology for measuring AI search citations across ChatGPT, Claude, Perplexity, Gemini, and Google's AI surfaces, including a controlled FAQ test that demonstrated causation rather than correlation."
---

Search Engine Journal published a detailed recap of a webinar run by seoClarity's product and engineering team, focused on how to actually prove that on-page changes affect AI search citations. The session covered split-testing methodology, Google's new Search Console AI reports, and results from three real client tests.

## What's actually new

Two things stand out. First, Google launched dedicated Search Console reports (as of June 3, per the article) for AI Overviews and AI Mode, giving page-level first-party data on how often URLs appear inside Google's AI features. The seoClarity team calls this the biggest measurement upgrade for AI search testing so far, though they note it only covers Google — ChatGPT, Claude, and Perplexity still need third-party tracking.

Second, and more interesting from a methodology standpoint: they ran a controlled test across roughly 1,000 prompts where adding FAQ sections to pages lifted AI citations, and — critically — reverting the change dropped citations back down. That reversion step is the causation proof most teams skip. Two other tests (meta descriptions and listicle formatting) did not produce the same clear signal, which the team frames as equally valuable data. The webinar apparently includes the specifics on why those tests didn't land, plus schema and markdown test blueprints.

## What it means for your config

This isn't a tooling release with config files to update, so there's no migration path or breaking change to worry about. But for teams managing structured data, FAQ markup, or content templates through any kind of config-driven pipeline, the practical takeaway is worth noting: how you implement collapsible content matters. The webinar specifically flags that one common collapsible FAQ implementation keeps content readable to AI crawlers and Google, while another renders it invisible to both. If your CMS or component library controls FAQ rendering via configuration (accordion components, `details`/`summary` elements, JavaScript-driven toggles), the implementation detail determines whether AI engines can read the content at all. The source doesn't specify which implementations pass or fail — that's in the full recording.

The broader point for config-driven workflows: if you're templating structured content across many pages (product FAQs, help docs, comparison tables), the split-testing approach described here — control group of correlated pages, defined baseline period, minimum test window — is a reasonable framework before rolling template changes site-wide.

## Recommended next step

If you have access to Google Search Console, check whether the new AI Overview and AI Mode reports are available for your properties. They're rolling out to a subset of sites. If you're running any kind of structured content at scale, the webinar's methodology for constructing a control group without true A/B testing capability is worth understanding before you invest in on-page changes aimed at AI citation. The full recording covers the prompt tiering system, control group construction, and the specific test outcomes in detail — the recap deliberately holds back the specifics to drive you there.

---

**Read the full announcement on Search Engine Journal** → [AI Search is Working. How to Prove It With Real Tests.](https://www.searchenginejournal.com/ai-search-is-working-how-to-prove-it-with-real-tests-recap/583306/)