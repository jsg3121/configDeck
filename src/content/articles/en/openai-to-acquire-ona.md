---
id: "https://openai.com/index/openai-to-acquire-ona"
tool: "openainews"
title: "OpenAI to acquire Ona"
link: "https://openai.com/index/openai-to-acquire-ona"
pubDate: 2026-06-11T00:00:00.000Z
sourceName: "OpenAI News"
sourceUrl: "https://openai.com/index/openai-to-acquire-ona"
contentType: "commentary"
summary: "OpenAI announced plans to acquire Ona, aiming to bring secure, persistent cloud environments to Codex for long-running AI agent workflows in enterprise settings."
---

OpenAI has announced its intention to acquire Ona, a company whose infrastructure will feed into the Codex product line. The announcement was published on OpenAI News.

## What's actually new

The stated goal is to expand Codex with secure, persistent cloud environments — the kind that let AI agents run long-lived tasks rather than spinning up disposable sessions that vanish after a single prompt-response cycle. The acquisition is explicitly framed around enterprise workflows, suggesting OpenAI sees durable agent execution environments as a gap it needs to fill for larger customers. Beyond that high-level framing, the RSS excerpt is thin on technical specifics; the original post likely has more detail on Ona's existing product and how the integration will work.

## What it means for your config

If you're integrating with Codex today — via the API or through OpenAI's platform tooling — the immediate impact is unclear. The announcement doesn't describe new API surfaces, changed authentication flows, or deprecations. For teams that have built automation around Codex's current sandbox model (ephemeral environments scoped to a single task), the introduction of persistent environments could eventually change assumptions about state management, secrets handling, and network policies in your agent configurations.

The announcement doesn't yet detail how persistent environments will interact with existing Codex config or whether current workflows will need migration. We'll revisit once OpenAI publishes technical docs or integration guides.

## Recommended next step

If your team relies on Codex for automated coding or CI-adjacent agent tasks, bookmark the original announcement and watch for follow-up documentation. The shift from ephemeral to persistent environments will likely carry new configuration surface area — things like environment lifecycle policies, volume mounts, and credential scoping — that you'll want to evaluate before adopting. Until those details land, there's nothing to act on today.

---

**Read the full announcement on OpenAI News** → [OpenAI to acquire Ona](https://openai.com/index/openai-to-acquire-ona)