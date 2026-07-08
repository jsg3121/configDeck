---
id: "https://blog.google/innovation-and-ai/technology/developers-tools/expanding-managed-agents-gemini-api/"
tool: "googleaiblog"
title: "Expanding Managed Agents in Gemini API: background tasks, remote MCP and more"
link: "https://blog.google/innovation-and-ai/technology/developers-tools/expanding-managed-agents-gemini-api/"
pubDate: 2026-07-07T08:54:00.000Z
sourceName: "Google AI Blog"
sourceUrl: "https://blog.google/innovation-and-ai/technology/developers-tools/expanding-managed-agents-gemini-api/"
contentType: "commentary"
summary: "Google adds background execution, remote MCP server support, custom function calling, and credential refresh to managed agents in the Gemini Interactions API, aimed at making agent workflows more production-viable."
---

Google AI Blog announced a set of new capabilities for managed agents in the Gemini Interactions API. The updates cover four areas: background (async) execution, remote MCP server integration, custom function calling mixed with sandbox tools, and network credential refresh.

## What's actually new

**Background execution** lets you avoid holding an HTTP connection open for long-running agent tasks. You pass `background: true`, get back an ID immediately, and poll or stream for results while the agent continues working server-side. **Remote MCP server integration** means you can point a managed agent at your own Model Context Protocol servers — private databases, internal APIs — without writing proxy middleware. You can combine remote MCP tools with built-in capabilities like Google Search or code execution in the same interaction. **Custom function calling** now works alongside the sandbox's built-in tools; built-in tools execute automatically on the server while custom functions pause the interaction with a `requires_action` status so your client handles local logic. Finally, **credential refresh** lets you pass updated tokens or API keys on subsequent interactions without losing sandbox state — filesystem, installed packages, and cloned repos all persist.

## What it means for your config

These features primarily affect how you structure API calls and agent definitions rather than static config files in your repo. The remote MCP integration is the most config-relevant piece: if you already run MCP servers (for database access, internal tooling, etc.), you'll need to pass `mcp_server` tool definitions at interaction time. That configuration lives in your API request payload, not in a standalone config file, at least based on what's been shared so far. The credential refresh mechanism similarly operates at the API layer — you supply new network configuration alongside an existing `environment_id`. The announcement doesn't detail a declarative config file format for agent definitions or environment rules; it references a quickstart and overview doc for "custom agent definitions, environment configurations, network rules, and advanced streaming patterns." Until those docs are fully fleshed out, it's hard to say whether a `.json` or `.yaml` agent config will become a thing teams need to version-control. We'll revisit once the documentation stabilizes.

## Recommended next step

If you're already using the Gemini Interactions API, the background execution flag is the lowest-effort win — it removes the fragility of long-lived HTTP connections, which is a real pain point in production agent deployments. If you run internal MCP servers, the remote MCP integration is worth evaluating next since it eliminates a custom middleware layer. Start with the Gemini Interactions API overview and the managed agents quickstart linked in the original post; they cover environment configurations and streaming patterns that the blog post only mentions in passing.

---

**Read the full announcement on Google AI Blog** → [Expanding Managed Agents in Gemini API: background tasks, remote MCP and more](https://blog.google/innovation-and-ai/technology/developers-tools/expanding-managed-agents-gemini-api/)