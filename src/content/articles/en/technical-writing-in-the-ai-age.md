---
id: "https://css-tricks.com/?p=395048"
tool: "csstricks"
title: "Technical Writing in the AI Age"
link: "https://css-tricks.com/technical-writing-in-the-ai-age/"
pubDate: 2026-05-26T13:49:28.000Z
sourceName: "CSS-Tricks"
sourceUrl: "https://css-tricks.com/technical-writing-in-the-ai-age/"
contentType: "commentary"
summary: "CSS-Tricks editor Geoff Graham reflects on sharply declining traffic across front-end publications and makes a case for why human-written technical content still matters — and how it should adapt."
---

CSS-Tricks published an editorial examining the state of technical writing as AI tools absorb the kind of quick-reference queries that once drove massive traffic to developer blogs and documentation sites. The piece shares CSS-Tricks' own traffic decline openly and situates it alongside similar drops at Stack Overflow and other publications.

## What's actually new

This isn't a product launch or a feature release — it's an honest internal assessment from one of the longest-running front-end publications. The article cites data from the 2025 AI Index by Stanford HAI as evidence that AI adoption is the primary headwind for technical content sites. CSS-Tricks acknowledges that its extensive CSS Almanac, maintained since roughly 2009 and expanded recently, now competes directly with in-IDE AI chat for answering the same kinds of property-level questions. The editorial argues that the site's ongoing value is in making specs and documentation more *humanly accessible* — less reference manual, more coffee-table conversation. The practical writing advice boils down to: lean into real-life problem-solving narratives over pure documentation, be cautious about using AI for the actual writing (it flattens voice and risks inaccuracy), and reserve AI for low-lift tasks like spell-checking and Markdown-to-HTML conversion.

## What it means for your config

This article doesn't introduce any tooling change, new configuration surface, or API. There's nothing here that affects how you write config files, set up build pipelines, or integrate linting tools. What it *does* signal is a shift in where developers look for answers. If your team maintains internal docs or a developer blog, the implicit message is worth internalizing: purely definitional content (what does `gap` do, what are the values for `display`) is now commodity knowledge that AI serves up instantly. The content that still earns human attention is contextual — why you chose a particular approach in a real project, what broke when you upgraded, how two tools interacted in a way the docs didn't predict. For ConfigDeck readers specifically, that means the most useful config-related writing going forward is probably experience reports ("here's how our ESLint flat config migration actually went") rather than yet another property reference.

## Recommended next step

If you write or maintain technical content — even just internal READMEs or onboarding docs — read the full piece and take stock of what percentage of your content is pure reference versus narrative problem-solving. The former is where AI has already eaten the lunch; the latter is where human writers still have clear leverage. And if you rely on a technical blog or newsletter that's helped you ship better work, the article makes a small but sincere ask: tell those writers. A comment, an email, a mention — that signal matters more now than it did three years ago when traffic alone was enough feedback.

---

**Read the full announcement on CSS-Tricks** → [Technical Writing in the AI Age](https://css-tricks.com/technical-writing-in-the-ai-age/)