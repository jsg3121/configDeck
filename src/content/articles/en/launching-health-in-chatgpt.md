---
id: "https://openai.com/index/health-in-chatgpt"
tool: "openainews"
title: "Launching Health in ChatGPT"
link: "https://openai.com/index/health-in-chatgpt"
pubDate: 2026-07-23T00:00:00.000Z
sourceName: "OpenAI News"
sourceUrl: "https://openai.com/index/health-in-chatgpt"
contentType: "commentary"
summary: "OpenAI announced a Health feature in ChatGPT that lets eligible U.S. users connect medical records and Apple Health data for personalized health insights."
---

OpenAI News announced "Health in ChatGPT," a feature that allows eligible U.S. users to securely connect their medical records and Apple Health data to ChatGPT. The goal is to provide more personalized health-related insights based on a user's actual health information.

## What's actually new

ChatGPT can now ingest two categories of health data: medical records and Apple Health information. The feature is limited to eligible users in the United States. OpenAI frames this as a way to help people "better understand their health" through personalized responses grounded in their own data. Beyond that, the available source excerpt is thin on implementation specifics — the original announcement likely covers data handling, privacy controls, and eligibility criteria in more detail.

## What it means for your config

This is a consumer-facing ChatGPT feature, not an API or developer platform change. Based on the available information, there's no indication that this affects the OpenAI API surface, model configuration, or any developer-facing tooling. If you're building on top of the OpenAI API and wondering whether health data connectors are exposed programmatically, the announcement doesn't address that — it appears scoped to the ChatGPT product itself.

For teams building health-adjacent applications on OpenAI's API, the interesting question is whether any of the underlying data-connection patterns (structured medical record ingestion, Apple HealthKit integration) will eventually surface as API capabilities or plugin patterns. Nothing in the current announcement suggests that, but it's worth watching.

If you maintain OpenAI-related configs — API keys, model selection, system prompts — there's nothing here that requires a change today.

## Recommended next step

If you're a developer working in the health data space, read the full announcement for details on how OpenAI handles data privacy, consent, and retention for this feature. Understanding how a major LLM provider approaches HIPAA-adjacent territory and Apple Health integration could inform your own architecture decisions, even if this particular feature isn't developer-facing yet. For everyone else, this is a "note and move on" announcement — no action required on your tooling or configs.

---

**Read the full announcement on OpenAI News** → [Launching Health in ChatGPT](https://openai.com/index/health-in-chatgpt)