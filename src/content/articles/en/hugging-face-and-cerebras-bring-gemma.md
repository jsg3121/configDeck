---
id: "https://huggingface.co/blog/cerebras-gemma4-voice-ai"
tool: "huggingface"
title: "Hugging Face and Cerebras bring Gemma 4 to real-time voice AI"
link: "https://huggingface.co/blog/cerebras-gemma4-voice-ai"
pubDate: 2026-07-01T00:00:00.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/cerebras-gemma4-voice-ai"
contentType: "commentary"
summary: "Hugging Face and Cerebras demo a cascaded speech-to-speech pipeline using Gemma 4 31B for the LLM layer, Nvidia Parakeet for ASR, and Qwen3TTS for synthesis, targeting low-latency voice AI interactions."
---

Hugging Face Blog announced a collaboration with Cerebras demonstrating a real-time voice AI pipeline built around Google DeepMind's Gemma 4 31B model. The demo pairs Cerebras inference hardware with an open, modular speech-to-speech stack already in use on Hugging Face's Reachy Mini robots.

## What's actually new

The pipeline is a cascaded architecture — not an end-to-end speech model — composed of three distinct stages: Nvidia Parakeet for speech recognition, Gemma 4 31B running on Cerebras for language-model inference, and Alibaba's Qwen3TTS for text-to-speech output. Each component is swappable, which is the main selling point over monolithic voice AI systems. Hugging Face notes the stack already powers more than 9,000 Reachy Mini robots. The motivation for using Cerebras specifically is P95 tail-latency reduction: the announcement highlights that many production voice systems hit acceptable median latency but suffer multi-second delays at the 95th percentile, especially when tool calls or multimodal steps are involved. The demo is available as a Hugging Face Space, and the underlying code lives in the `huggingface/speech-to-speech` repository.

## What it means for your config

This is a demo and integration showcase, not a library release with new config surfaces. There are no new Hugging Face Transformers config options, model cards with novel parameters, or pipeline YAML schemas introduced in the announcement. If you're building on the `huggingface/speech-to-speech` repo, the pipeline composition — which ASR model, which LLM endpoint, which TTS model — is presumably configured in that codebase, but the blog post doesn't detail the config format or environment variables involved. Similarly, pointing inference at Cerebras rather than a GPU endpoint will require API-level configuration, but the specifics aren't covered here.

If you're already running a speech-to-speech setup with Hugging Face tooling, nothing breaks. This is additive. The announcement doesn't yet detail how to wire up Cerebras inference in existing Hugging Face pipeline configs — we'll revisit once more granular docs or integration guides land.

## Recommended next step

If low-latency voice AI is on your roadmap, the most useful thing to do right now is clone the `huggingface/speech-to-speech` repository and look at how the pipeline stages are composed. The modular design means you can swap in your own ASR or TTS models without rearchitecting. Try the Hugging Face Space demo to get a feel for the latency profile before committing engineering time. For Cerebras-specific integration details, you'll likely need to follow up with their inference API docs separately — the blog post focuses on the architecture and the "why" rather than step-by-step setup.

---

**Read the full announcement on Hugging Face Blog** → [Hugging Face and Cerebras bring Gemma 4 to real-time voice AI](https://huggingface.co/blog/cerebras-gemma4-voice-ai)