---
id: "https://deepmind.google/blog/introducing-computer-use-in-gemini-3-5-flash/"
tool: "googledeepmind"
title: "Introducing computer use in Gemini 3.5 Flash"
link: "https://deepmind.google/blog/introducing-computer-use-in-gemini-3-5-flash/"
pubDate: 2026-06-24T16:30:01.000Z
sourceName: "Google DeepMind Blog"
sourceUrl: "https://deepmind.google/blog/introducing-computer-use-in-gemini-3-5-flash/"
contentType: "commentary"
summary: "Google DeepMind has integrated computer use as a built-in tool in Gemini 3.5 Flash, moving it from a standalone model into the main Flash model. Developers can now build agents that interact with browser, mobile, and desktop environments via the Gemini API and Enterprise Agent Platform."
---

Google DeepMind announced that computer use is now natively integrated into Gemini 3.5 Flash as a built-in tool, available through the Gemini API and the Gemini Enterprise Agent Platform. Previously, computer use required a separate standalone Gemini 2.5 model; it now ships inside the main Flash model alongside existing built-in tools like Search and Maps grounding.

## What's actually new

The key shift is architectural consolidation: computer use joins function calling and other built-in tools as a first-class capability within a single model rather than living in a dedicated side model. Google says this delivers their best performance yet for agentic computer use tasks, though the announcement doesn't publish specific benchmarks — check the original for any supplementary materials. The target use cases are long-horizon automation: continuous software testing, knowledge work across professional apps, and cross-platform agent workflows spanning browser, mobile, and desktop. On the safety side, Google is releasing two optional enterprise safeguard systems — one requiring explicit user confirmation for sensitive or irreversible actions, and another that automatically halts tasks when an indirect prompt injection is detected. They recommend layering these with sandboxing, human-in-the-loop verification, and strict access controls. A demo environment hosted by Browserbase is available for immediate experimentation.

## What it means for your config

This is less of a config-file story and more of an API integration story. If you were previously pointing agent orchestration code at a separate Gemini 2.5 computer use model endpoint, you'll want to check whether your API client configuration (model identifiers, endpoint URLs, tool declarations) needs updating to target 3.5 Flash instead. The announcement doesn't spell out the exact migration path or whether the standalone 2.5 computer use model is being deprecated, so watch the API docs for deprecation timelines.

For teams running agents in CI or production pipelines, the two new safeguard systems — confirmation gates and prompt-injection auto-stop — are worth wiring into your agent configuration early, especially if your agents touch anything with write access. The announcement doesn't detail how these are configured (flags, API parameters, platform settings), so consult the referenced best practices documentation before assuming defaults are safe enough for your environment.

If you're using orchestration frameworks (LangChain, Vertex AI Agent Builder, etc.) that abstract model selection, confirm that your framework version actually supports the new built-in computer use tool declaration. A mismatch there could silently fall back to text-only behavior.

## Recommended next step

Start with the Browserbase-hosted demo to get a feel for what computer use actually looks like in 3.5 Flash before committing engineering time. Then review the reference implementation Google links from the announcement — it'll tell you more about the actual API surface than the blog post does. If you have existing agents on the standalone 2.5 computer use model, open a tracking issue now to migrate and validate, rather than waiting for a deprecation notice to force your hand.

---

**Read the full announcement on Google DeepMind Blog** → [Introducing computer use in Gemini 3.5 Flash](https://deepmind.google/blog/introducing-computer-use-in-gemini-3-5-flash/)