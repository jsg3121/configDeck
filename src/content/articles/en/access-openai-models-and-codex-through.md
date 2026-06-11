---
id: "https://openai.com/index/openai-on-oracle-cloud"
tool: "openainews"
title: "Access OpenAI models and Codex through your Oracle cloud commitment"
link: "https://openai.com/index/openai-on-oracle-cloud"
pubDate: 2026-06-10T20:00:00.000Z
sourceName: "OpenAI News"
sourceUrl: "https://openai.com/index/openai-on-oracle-cloud"
contentType: "commentary"
summary: "OpenAI announced that its models and Codex are now accessible through Oracle Cloud, letting enterprise customers apply existing Oracle cloud commitments toward OpenAI usage with enterprise-grade security and governance."
---

OpenAI announced that its models and the Codex agent are now available through Oracle Cloud. According to OpenAI News, this lets enterprise customers use existing Oracle cloud spending commitments to build and deploy AI workloads with enterprise security and governance controls.

## What's actually new

The core news is a procurement and deployment channel: organizations with Oracle Cloud contracts can now consume OpenAI models — including Codex — against those existing commitments rather than setting up a separate billing relationship with OpenAI. The announcement emphasizes enterprise security and governance, suggesting the integration inherits Oracle Cloud's compliance and access-control infrastructure. Beyond these high-level points, the available excerpt is thin on specifics — no details on which models are included, how Codex is exposed (API, hosted IDE, or both), or what Oracle Cloud services sit underneath. The original post likely covers those details, so check the link below.

## What it means for your config

For teams already calling OpenAI APIs, the practical question is whether this Oracle-hosted path uses the same API surface (endpoints, authentication, SDK config) or introduces a different base URL and auth flow — similar to what happened with the Azure OpenAI Service. If it follows that pattern, you'd swap your `OPENAI_API_BASE` and authentication headers in whatever config or environment file your application uses, while the rest of your integration code stays the same. But the announcement doesn't yet specify endpoint structure, SDK compatibility, or whether existing OpenAI client libraries will support an Oracle target out of the box. We'll revisit once Oracle or OpenAI publish integration docs. If you manage infrastructure-as-code on Oracle Cloud (Terraform OCI provider, for example), watch for new resource types or service definitions related to this offering.

## Recommended next step

If your organization has meaningful Oracle Cloud commitments and is already paying OpenAI separately, this is worth evaluating purely from a cost-consolidation angle — talk to your Oracle account team about how credits map. For the engineering side, hold off on any config changes until the actual developer documentation drops. Bookmark the announcement, keep an eye on Oracle's docs portal, and look for SDK changelogs from OpenAI that reference Oracle Cloud as a deployment target. That's when the real integration work starts.

---

**Read the full announcement on OpenAI News** → [Access OpenAI models and Codex through your Oracle cloud commitment](https://openai.com/index/openai-on-oracle-cloud)