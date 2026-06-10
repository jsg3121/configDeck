---
id: "https://deepmind.google/blog/fluid-natural-voice-translation-with-gemini-35-live-translate/"
tool: "googledeepmind"
title: "Fluid, natural voice translation with Gemini 3.5 Live Translate"
link: "https://deepmind.google/blog/fluid-natural-voice-translation-with-gemini-35-live-translate/"
pubDate: 2026-06-09T15:16:25.000Z
sourceName: "Google DeepMind Blog"
sourceUrl: "https://deepmind.google/blog/fluid-natural-voice-translation-with-gemini-35-live-translate/"
contentType: "commentary"
summary: "Google DeepMind announced Gemini 3.5 Live Translate, a speech-to-speech translation model supporting 70+ languages, available via the Gemini Live API, Google Meet, and the Google Translate app. Developers get public preview access through the Live API and Google AI Studio."
---

Google DeepMind has released Gemini 3.5 Live Translate, a real-time speech-to-speech translation model that auto-detects and translates across 70+ languages while preserving speaker intonation, pacing, and pitch. The model is rolling out across multiple Google surfaces, with developer access available now in public preview via the Gemini Live API and Google AI Studio.

## What's actually new

The core differentiator here is continuous translation — rather than waiting for a speaker to finish a sentence before producing output, the model generates translated speech on the fly, staying a few seconds behind the speaker. It handles multilingual inputs without manual language configuration and includes noise robustness for unpredictable environments. For Google Meet, this is a major scope expansion: the previous system supported only five languages and English-only translation pairs, while 3.5 Live Translate opens up 2000+ language combinations in a single meeting. Google Meet integration starts in private preview for select Workspace customers this month. On the consumer side, the Google Translate app on Android and iOS gets the model globally, plus Android users get a new "listening mode" that streams translated audio through the phone's earpiece without headphones. All generated audio is watermarked with SynthID.

## What it means for your config

For developers building voice translation features, the relevant integration point is the Gemini Live API. The announcement mentions that platforms like Agora, LiveKit, Pipecat, Fishjam, and Vision Agents already provide integrations that handle real-time media streaming infrastructure on top of this API. If you're already using the Gemini API in your stack, the Live Translate model appears to be an additional capability within that same API surface — the blog points to the Gemini Cookbook for example code and demos. The announcement doesn't detail specific API configuration changes, new SDK versions, authentication changes, or breaking differences from existing Gemini Live API usage. There's also no mention of pricing tiers for the public preview. If you have existing Gemini API configs, check the model card and cookbook linked in the original post before assuming your current setup carries over unchanged. We'll revisit once more detailed API documentation surfaces.

## Recommended next step

If you're building anything involving multilingual voice — customer support, telehealth, logistics coordination, live events — the public preview via the Gemini Live API is worth evaluating now. Start with the Gemini Cookbook demos referenced in the announcement to understand the streaming behavior and latency characteristics before committing to an integration. Grab's use case (driver-traveler communication across 10 million monthly voice calls) gives a sense of the scale Google is targeting. For enterprise teams already on Google Workspace, reach out to your Google account rep about the Meet private preview if cross-language meetings are a pain point.

---

**Read the full announcement on Google DeepMind Blog** → [Fluid, natural voice translation with Gemini 3.5 Live Translate](https://deepmind.google/blog/fluid-natural-voice-translation-with-gemini-35-live-translate/)