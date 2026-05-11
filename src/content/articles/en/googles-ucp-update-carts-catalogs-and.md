---
id: "https://www.searchenginejournal.com/googles-ucp-update-carts-catalogs-and-loyalty-in-ai-shopping/571496/"
tool: "searchenginejournal"
title: "Google's UCP Update: Carts, Catalogs, And Loyalty In AI Shopping"
link: "https://www.searchenginejournal.com/googles-ucp-update-carts-catalogs-and-loyalty-in-ai-shopping/571496/"
pubDate: 2026-05-10T12:00:07.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/googles-ucp-update-carts-catalogs-and-loyalty-in-ai-shopping/571496/"
contentType: "commentary"
summary: "Google's Universal Commerce Protocol added cart management, live catalog queries, and OAuth 2.0-based loyalty account linking in its March 2026 update, alongside a simplified Merchant Center onboarding path targeting retailers without dedicated engineering teams."
---

Search Engine Journal covers Google's March 2026 UCP update, which adds three capabilities that bring the protocol closer to what AI shopping agents actually need to complete real transactions. This follows the initial UCP announcement at NRF in January 2026, which supported only single-item checkout sessions.

## What's actually new

Three capabilities landed. **Cart** lets AI agents bundle multiple items from one retailer into a single transaction instead of running separate checkout sessions per product — it also supports pre-purchase basket-building before a shopper commits. **Catalog** gives agents real-time inventory queries (variants, pricing, stock) rather than relying on periodically updated product feeds. **Identity Linking** uses OAuth 2.0 to connect a shopper's retailer account (and its loyalty pricing, member discounts, free shipping) to UCP-integrated platforms like Google AI Mode. Cart and Catalog are published as draft specs; Identity Linking is already in UCP's stable release.

On the onboarding side, Google is building UCP setup directly into Merchant Center, targeting retailers who manage product feeds there today. Products using the `native_commerce` product attribute will surface a checkout button in Google AI Mode and the Gemini app. Platform-side, Commerce Inc, Salesforce, and Stripe have committed to implementing UCP — notable because Salesforce already supports OpenAI/Stripe's competing ACP, and Stripe co-created ACP, making it the shared payment layer across both protocols.

## What it means for your config

This is not a developer-tooling config story in the traditional sense — there's no CLI, no build tool, no `.config.js` to adjust. But if you maintain product feed configurations for Google Merchant Center, two things are worth flagging. First, the `native_commerce` product attribute is the concrete knob that enables UCP checkout in AI Mode; the article doesn't detail its schema or allowed values, so watch for Google's Merchant Center docs to land. Second, the Catalog capability implies your static product feed data may become supplementary rather than primary for AI agent interactions — live inventory queries could eventually matter more than feed freshness tuning.

If you're on Shopify, Salesforce Commerce Cloud, or Stripe, UCP implementation will be handled at the platform layer, similar to how Shopify's Agentic Storefronts already abstract protocol complexity. No direct integration work needed on your end, but you'll want to confirm your platform partner's timeline since Google describes it only as "in the near future."

The announcement doesn't detail API schemas, endpoint configurations, or migration steps for existing Merchant Center setups — we'll revisit once Google publishes the onboarding flow and the Cart/Catalog specs move from draft to stable.

## Recommended next step

If you're a retailer on Merchant Center, the most useful thing you can do right now is audit your product data quality — clean titles, accurate inventory, structured attributes — because that's the foundation UCP's Catalog capability will query in real time. If you run loyalty programs, start thinking about your OAuth 2.0 readiness for Identity Linking; that's the one capability already in stable release and the clearest differentiation UCP has over ACP. For everyone else, the original article has a thorough comparison of where UCP and ACP now stand relative to each other, which is worth reading before you pick a lane or decide to support both.

---

**Read the full announcement on Search Engine Journal** → [Google's UCP Update: Carts, Catalogs, And Loyalty In AI Shopping](https://www.searchenginejournal.com/googles-ucp-update-carts-catalogs-and-loyalty-in-ai-shopping/571496/)