---
id: "https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/"
tool: "googledeepmind"
title: "Start building with Nano Banana 2 Lite and Gemini Omni Flash"
link: "https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/"
pubDate: 2026-06-30T16:02:40.000Z
sourceName: "Google DeepMind Blog"
sourceUrl: "https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/"
contentType: "commentary"
summary: "Google DeepMind released Nano Banana 2 Lite for fast, cheap image generation and opened Gemini Omni Flash to developers for video generation and conversational editing via the Gemini API and Google AI Studio."
---

Google DeepMind announced two model releases on June 30, 2026: Nano Banana 2 Lite, a speed-and-cost-optimized image generation model, and the developer preview of Gemini Omni Flash for video generation and editing. Both are available now through Google AI Studio, the Gemini API, and Gemini Enterprise Agent Platform.

## What's actually new

**Nano Banana 2 Lite** (`gemini-3.1-flash-lite-image`) is positioned as a drop-in upgrade for developers using the original Nano Banana (`gemini-2.5-flash-image`). Google quotes 4-second text-to-image latency and a cost of $0.034 per 1K-resolution image. The blog lays out the full Nano Banana family hierarchy: Lite for speed, Nano Banana 2 as the generalist, and Nano Banana Pro for complex professional tasks.

**Gemini Omni Flash** (`gemini-omni-flash-preview`) brings video generation and conversational video editing to the API for the first time. It accepts text, image, and video inputs and is priced at $0.10 per second of video output. Notable current limitations: output is capped at 10 seconds, video references up to 3 seconds are accepted by the API schema but not correctly processed by the model, and audio references and scene extension aren't yet supported via the API.

The intended developer workflow is chaining the two: generate images quickly with Nano Banana 2 Lite, then pass them as references to Omni Flash for animation. Google mentions an Interactions API that maintains session history for up to three sequential edits in multi-turn experiences.

## What it means for your config

These are API-level model identifiers, not local tooling configs — so there's no `.config` file to update in the traditional sense. That said, if you have pipelines or agent configs that reference the old model string `gemini-2.5-flash-image`, Google explicitly recommends swapping it for `gemini-3.1-flash-lite-image`. Any environment variables, CI secrets, or orchestration configs that pin a Gemini image model ID should be reviewed.

For Omni Flash, the model identifier is `gemini-omni-flash-preview` — the `preview` suffix is worth noting. If you're building production workflows around it, expect the identifier and behavior to change. The limitations around video reference processing and the 10-second cap mean you'll want guard rails in any config or prompt template that feeds video inputs to this model.

The announcement doesn't detail breaking changes in the API schema itself beyond the model swap, so if you're already on the Gemini API, integration should be additive rather than disruptive. Check the developer docs (linked from the original post) for regional limitations and the full capability matrix before wiring anything into production.

## Recommended next step

If you're using the legacy Nano Banana model, the swap to Nano Banana 2 Lite looks straightforward — update the model ID and verify your outputs still meet quality expectations, since Lite explicitly trades some fidelity for speed. For Omni Flash, treat it as an exploration target: the preview label and the list of acknowledged limitations (especially the broken video-reference processing) suggest it's not production-ready yet. Google provides demo apps you can remix to test the chained Nano Banana → Omni Flash workflow, which is worth a look before committing engineering time.

---

**Read the full announcement on Google DeepMind Blog** → [Start building with Nano Banana 2 Lite and Gemini Omni Flash](https://deepmind.google/blog/start-building-with-nano-banana-2-lite-and-gemini-omni-flash/)