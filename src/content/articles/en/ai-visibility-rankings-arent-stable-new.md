---
id: "https://www.searchenginejournal.com/ai-visibility-rankings-arent-stable-new-research-shows-its-mostly-statistical-noise/581905/"
tool: "searchenginejournal"
title: "AI Visibility Rankings Aren't Stable – New Research Shows It's Mostly Statistical Noise"
link: "https://www.searchenginejournal.com/ai-visibility-rankings-arent-stable-new-research-shows-its-mostly-statistical-noise/581905/"
pubDate: 2026-07-11T12:30:19.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/ai-visibility-rankings-arent-stable-new-research-shows-its-mostly-statistical-noise/581905/"
contentType: "commentary"
summary: "An upcoming IQRush paper, previewed by Search Engine Journal, demonstrates that AI visibility citation shares are unstable across repeated queries, and that no single sample size universally guarantees reliable rankings across platforms and topics."
---

Search Engine Journal covers a forthcoming IQRush preprint arguing that AI visibility tracking dashboards report single snapshots of inherently noisy data, not stable metrics. The piece also ties this to an independent April study from University of St. Gallen researchers that reached the same conclusion via a separate dataset.

## What's actually new

The core finding is straightforward: querying SearchGPT, Gemini, or Perplexity with the same prompt yields different cited sources each time, because these models inject randomness into responses by design. A single citation-share reading can't reliably distinguish your brand from a competitor's. The paper proposes a two-part stopping rule — rankings must stabilize *and* the gap between top sites must exceed the margin of error — before a ranking should be trusted. In the paper's 30 platform-topic tests, the number of citation-bearing answers needed before both conditions held ranged from 33 to 94, and three tests on SearchGPT never converged even after 125 questions. Notably, the same answer count buys different confidence levels on different engines: Gemini clusters citations on a few sites per answer (less independent information), while SearchGPT spreads them out, so raw citation counts are not directly comparable across platforms.

## What it means for your config

This isn't a tooling release or API change, so there's no configuration migration or breaking change to worry about. But if your team pipes AI visibility data into dashboards, CI reports, or automated alerting (say, a scheduled script that hits a tracking API and posts to Slack), the practical takeaway is about how you interpret the numbers those configs produce. A threshold alert firing on a three-point citation-share swing is likely reacting to noise, not signal. If your monitoring setup treats AI visibility scores the same way it treats deterministic analytics — single reads, hard thresholds — this research suggests that design is unsound. The announcement doesn't provide a concrete sampling formula you can plug in today; the author explicitly defers a pre-collection budget calculator to future work. Until that lands, the honest answer is that any automation around these metrics should be treated as directional, not precise.

## Recommended next step

If you're consuming AI visibility data programmatically, audit whether your provider reports confidence intervals or just point estimates. Ask them — as Rand Fishkin suggests in the piece — to "show their math." For any before/after content experiment, measure multiple times on both sides rather than comparing two single readings. And if your tooling can't tell you "not enough data yet," treat top-of-list positions as the only defensible signal; the article notes that margin of error on a top-10 site typically spans about five positions, and one in five is wider than ten. Read the full paper (linked from the original article) for the specific platform-by-platform nuance.

---

**Read the full announcement on Search Engine Journal** → [AI Visibility Rankings Aren't Stable – New Research Shows It's Mostly Statistical Noise](https://www.searchenginejournal.com/ai-visibility-rankings-arent-stable-new-research-shows-its-mostly-statistical-noise/581905/)