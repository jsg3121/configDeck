---
id: "https://openai.com/index/gpt-5-6-preferred-model-microsoft-365-copilot"
tool: "openainews"
title: "GPT-5.6 is now the preferred model in Microsoft 365 Copilot"
link: "https://openai.com/index/gpt-5-6-preferred-model-microsoft-365-copilot"
pubDate: 2026-07-09T13:00:00.000Z
sourceName: "OpenAI News"
sourceUrl: "https://openai.com/index/gpt-5-6-preferred-model-microsoft-365-copilot"
contentType: "commentary"
summary: "OpenAI announced that GPT-5.6 is now the preferred model powering Microsoft 365 Copilot across Word, Excel, PowerPoint, Chat, and Cowork. The update promises stronger AI capabilities and faster, higher-quality outputs within the Microsoft 365 suite."
---

OpenAI announced that GPT-5.6 has become the preferred model behind Microsoft 365 Copilot, replacing whatever model previously powered those integrations. The announcement, published on OpenAI News, highlights improvements across Word, Excel, PowerPoint, Chat, and a feature called Cowork.

## What's actually new

GPT-5.6 is now the default model driving Copilot experiences in the core Microsoft 365 apps. OpenAI describes the upgrade as delivering stronger AI capabilities and faster, higher-quality work across the suite. Beyond that top-line framing, the RSS excerpt doesn't break down specific benchmarks, latency improvements, or new capabilities in detail — the full announcement on OpenAI's site will have more. The mention of "Cowork" is notable; it suggests Copilot's collaborative or agentic features are also receiving the model upgrade, not just the single-document assistants.

## What it means for your config

This is primarily a platform-side model swap — Microsoft and OpenAI are handling the rollout within Copilot, so there's no config file you need to touch to get the new model inside Word or Excel. If you're building on top of the OpenAI API separately and currently specify a model version in your API config or orchestration layer, this announcement doesn't necessarily mean GPT-5.6 is the same model string you'd pass to the API. Microsoft 365 Copilot model selection and OpenAI API model availability often operate on different timelines.

For teams that integrate Copilot outputs into developer workflows — code generation in Excel macros, automated documentation in Word, slide decks from specs — the underlying model change could affect output quality or formatting in ways that downstream tooling depends on. If you have any validation or post-processing scripts that parse Copilot output, it's worth spot-checking those after the rollout hits your tenant.

The announcement doesn't detail whether this affects Copilot Studio configurations, custom plugin schemas, or any declarative config surfaces that enterprise developers manage. We'll revisit once Microsoft's admin documentation reflects the change.

## Recommended next step

Read the full announcement to understand the scope of improvements across each M365 app. If your team relies on Copilot outputs feeding into automated pipelines or custom plugins, queue up a quick smoke test once GPT-5.6 is live in your environment. For API users curious about GPT-5.6 availability outside the Copilot context, watch the OpenAI API changelog separately — Copilot model updates and API model releases don't always ship in lockstep.

---

**Read the full announcement on OpenAI News** → [GPT-5.6 is now the preferred model in Microsoft 365 Copilot](https://openai.com/index/gpt-5-6-preferred-model-microsoft-365-copilot)