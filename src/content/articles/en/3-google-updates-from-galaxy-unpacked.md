---
id: "https://blog.google/products-and-platforms/platforms/android/galaxy-unpacked-2026/"
tool: "googleaiblog"
title: "3 Google updates from Galaxy Unpacked 2026"
link: "https://blog.google/products-and-platforms/platforms/android/galaxy-unpacked-2026/"
pubDate: 2026-07-22T13:00:00.000Z
sourceName: "Google AI Blog"
sourceUrl: "https://blog.google/products-and-platforms/platforms/android/galaxy-unpacked-2026/"
contentType: "commentary"
summary: "Google announced expanded Gemini task automation across 40+ apps, a preinstalled Gemini Notebook app on new Samsung foldables, and Gemini integration on Galaxy Watch 9 and upcoming smart glasses."
---

Google used Samsung's Galaxy Unpacked event in London to detail three Gemini-centric updates shipping on the new Galaxy Z Fold8 Ultra, Fold8, Flip8, Galaxy Watch 9, and forthcoming smart glasses. The Google AI Blog post frames these under "Gemini Intelligence," the company's branding for proactive, on-device AI assistance.

## What's actually new

First, Gemini's task automation — previously a beta limited to a small set of apps — now supports more than 40 apps for delegating everyday actions like booking restaurants, purchasing event tickets, and ordering rideshares. Gemini can also parse on-screen content and complex images as prompts, so you can show it a shopping list instead of dictating one. Second, Gemini Notebook (the rebranded NotebookLM) comes preinstalled on the new foldables and supports drag-and-drop of photos, documents, voice recordings, and other media into a side-by-side workspace. Samsung is bundling a six-month trial of Google AI Pro with the new devices. Third, Gemini is coming to the Galaxy Watch 9 with a raise-to-activate gesture (no wake word), and to smart glasses built in partnership with Samsung, Gentle Monster, and Warby Parker, with Wear OS watch gestures controlling the glasses.

## What it means for your config

This announcement is consumer-hardware and platform-level — there's nothing here about SDK changes, new API surfaces, build configs, or developer tooling integration points. If you're building Android apps that interact with Gemini's task automation layer, the expansion to 40+ supported apps *might* eventually mean new intent or agent APIs, but Google hasn't published any developer documentation on that front yet. The Gemini Notebook preinstall is an end-user feature, not something that touches your project's config files or CI pipeline. In short: no migration, no config changes, and no breaking behavior to worry about today. We'll revisit if Google follows up with developer-facing docs or SDK updates tied to these capabilities.

## Recommended next step

If you're an Android developer building apps that could benefit from Gemini task automation support (e.g., commerce, travel, food delivery), keep an eye on Google's developer channels for any public API or agent integration program. The consumer rollout to 40+ apps suggests Google is onboarding third-party developers somehow, but the blog post doesn't explain the mechanism. For now, the most useful action is reading the full announcement for product context and then watching the Android developer blog and Google I/O session archives for the technical counterpart.

---

**Read the full announcement on Google AI Blog** → [3 Google updates from Galaxy Unpacked 2026](https://blog.google/products-and-platforms/platforms/android/galaxy-unpacked-2026/)