---
id: "https://deepmind.google/blog/introducing-gemini-36-flash-35-flash-lite-and-35-flash-cyber/"
tool: "googledeepmind"
title: "Introducing Gemini 3.6 Flash, 3.5 Flash-Lite, and 3.5 Flash Cyber"
link: "https://deepmind.google/blog/introducing-gemini-36-flash-35-flash-lite-and-35-flash-cyber/"
pubDate: 2026-07-21T15:16:30.000Z
sourceName: "Google DeepMind Blog"
sourceUrl: "https://deepmind.google/blog/introducing-gemini-36-flash-35-flash-lite-and-35-flash-cyber/"
contentType: "commentary"
summary: "Google DeepMind ships three new Gemini models targeting agentic workloads: 3.6 Flash (cheaper and more token-efficient than 3.5 Flash), 3.5 Flash-Lite (350 tokens/s throughput at rock-bottom pricing), and 3.5 Flash Cyber paired with the CodeMender security agent. Gemini 4 pre-training is also confirmed underway."
---

Google DeepMind announced three new models in the Gemini Flash line — 3.6 Flash, 3.5 Flash-Lite, and 3.5 Flash Cyber — all aimed squarely at production agentic workloads. The blog also confirms that Gemini 3.5 Pro is in partner testing and that pre-training for Gemini 4 has begun.

## What's actually new

**3.6 Flash** is positioned as the successor to 3.5 Flash with a direct pricing undercut: $1.50/1M input tokens and $7.50/1M output tokens. The announcement cites a 17% reduction in output token usage versus 3.5 Flash (per the Artificial Analysis Index) and up to 65% on DeepSWE. Benchmark-wise, DeepSWE jumps from 37% to 49%, MLE Bench from 49.7% to 63.9%, and OSWorld-Verified from 78.4% to 83.0%. Computer use is now a built-in client-side tool in the Gemini API and Gemini Enterprise.

**3.5 Flash-Lite** targets high-throughput, low-latency use cases. It runs at 350 output tokens/s and is priced at $0.30/1M input and $2.50/1M output. The benchmarks show large jumps over 3.1 Flash-Lite — Terminal-Bench 2.1 goes from 31% to 54%, long-context MRCR from 60.1% to 72.2%. Notably, it also outperforms the older Gemini 3 Flash on SWE-Bench Pro (54.2% vs 49.6%) and OSWorld-Verified (74.0% vs 65.1%), which makes it a potential drop-in replacement for teams still on 2.5 or 3 Flash.

**3.5 Flash Cyber** ships as part of CodeMender, a code security agent. The blog frames it as a model-plus-agent-infrastructure pairing rather than a standalone model, but specific details on CodeMender's architecture are sparse.

Google also mentions enhanced Frontier Safety safeguards on 3.6 Flash targeting CBRN and cyber offense misuse, with reduced over-refusals for legitimate use.

## What it means for your config

If you're calling Gemini models via the Gemini API, the main config-level change is model identifier selection. The announcement confirms computer use is now a "built-in client side tool" — meaning teams that previously wired up custom tool definitions for browser/desktop interaction may be able to simplify their agent config. Flash-Lite supports configurable thinking levels (minimal, low, and higher), so your request-level config will need a `thinking` parameter or equivalent depending on your SDK.

The pricing changes are worth encoding into cost-estimation tooling. If you have rate-limit or budget configs scoped to specific model tiers, 3.5 Flash-Lite's throughput profile (350 tokens/s) and lower cost could meaningfully alter your concurrency and batching math versus 3.5 Flash.

The announcement doesn't detail breaking API changes, migration commands, or schema differences between 3.5 and 3.6 Flash. We'll revisit once the API docs and model cards are fully published.

## Recommended next step

If you're running agentic workloads on 3.5 Flash today, test 3.6 Flash with your existing prompts and measure actual token consumption — the 17% efficiency claim is an aggregate, and your mileage will depend on task shape. For high-volume, latency-sensitive sub-agent tasks (search, extraction, classification), benchmark 3.5 Flash-Lite against your current model; the pricing and speed profile make it a serious candidate for inner-loop agent calls. Check the 3.6 Flash model card linked in the original post for safety and capability details before rolling anything to production.

---

**Read the full announcement on Google DeepMind Blog** → [Introducing Gemini 3.6 Flash, 3.5 Flash-Lite, and 3.5 Flash Cyber](https://deepmind.google/blog/introducing-gemini-36-flash-35-flash-lite-and-35-flash-cyber/)