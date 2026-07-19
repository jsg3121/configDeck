---
id: "https://openai.com/index/a-scorecard-for-the-ai-age"
tool: "openainews"
title: "A scorecard for the AI age"
link: "https://openai.com/index/a-scorecard-for-the-ai-age"
pubDate: 2026-07-17T10:00:00.000Z
sourceName: "OpenAI News"
sourceUrl: "https://openai.com/index/a-scorecard-for-the-ai-age"
contentType: "commentary"
summary: "OpenAI CFO Sarah Friar proposes a scorecard framework for measuring AI ROI across four dimensions: useful work, cost per successful task, dependability, and return on compute."
---

OpenAI CFO Sarah Friar has published a framework for evaluating AI investments through a structured scorecard. The post, published on OpenAI News, lays out four metrics organizations should track when assessing whether AI deployments are actually paying off.

## What's actually new

The scorecard centers on four measurement axes: useful work performed, cost per successful task, dependability, and return on compute. This is OpenAI's CFO — not a research lead — framing AI value in financial and operational terms rather than benchmark scores or model capability comparisons. The framing is notable because it shifts the conversation from "how smart is the model" to "how much verifiable output did it produce per dollar spent." The full details of how Friar defines each metric and any suggested tooling or methodology are in the original post, which is worth reading in full.

## What it means for your config

This announcement is a strategic framework, not a product release or API change. There are no new endpoints, SDK versions, or configuration surfaces to update. If you're integrating OpenAI APIs into your toolchain today, nothing about your existing config files, environment variables, or model parameters needs to change based on this post.

That said, the scorecard's emphasis on "cost per successful task" and "dependability" is relevant to how teams configure retry logic, model selection fallbacks, and token budget caps in their API integration layers. If you're already tracking API spend or task success rates through observability tooling, this framework gives you a vocabulary to map those metrics against. But the announcement doesn't prescribe specific implementation details — it's a measurement philosophy, not a spec.

## Recommended next step

If your team is spending meaningful budget on OpenAI API calls, read the full scorecard and see whether Friar's four axes map to metrics you're already collecting. Many teams track token usage and latency but haven't formalized what "useful work" or "dependability" means for their specific use case. This is a good prompt (no pun intended) to define those before your next cost review, rather than after. The framework is high-level enough to apply regardless of which model or provider you're using.

---

**Read the full announcement on OpenAI News** → [A scorecard for the AI age](https://openai.com/index/a-scorecard-for-the-ai-age)