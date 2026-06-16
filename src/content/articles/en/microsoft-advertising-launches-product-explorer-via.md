---
id: "https://www.searchenginejournal.com/microsoft-advertising-launches-product-explorer/579316/"
tool: "searchenginejournal"
title: "Microsoft Advertising Launches Product Explorer"
link: "https://www.searchenginejournal.com/microsoft-advertising-launches-product-explorer/579316/"
pubDate: 2026-06-15T18:55:36.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/microsoft-advertising-launches-product-explorer/579316/"
contentType: "commentary"
summary: "Microsoft Advertising added Product Explorer to Merchant Center, giving U.S. advertisers with under 100,000 SKUs a searchable, filterable view of product catalog status and performance data in one place."
---

Microsoft Advertising has released Product Explorer, a new feature inside Merchant Center that consolidates product feed health and performance data into a single searchable interface. Search Engine Journal covered the launch, including direct commentary from Microsoft Advertising Ads Liaison Navah Hopkins.

## What's actually new

Product Explorer lets advertisers search and filter their product catalog by feed attributes (title, product ID, brand, GTIN, product type, custom labels, and others) alongside performance metrics (impressions, clicks, conversions, spend, CTR, conversion rate). The practical upshot is that you can cross-reference feed data with performance data — for example, finding products with zero impressions in a specific product category — without stitching together separate Merchant Center diagnostics and campaign reports. Filtered results can be exported for offline analysis. The tool also ties into Microsoft's existing Recommended Actions feature, surfacing guidance on how to fix rejected or limited products. Right now, access is limited to U.S. advertisers with catalogs under 100,000 SKUs, and Microsoft says it's collecting feedback before expanding further.

## What it means for your config

This is an advertising platform UI feature, not a developer-facing config or API change. There's no new feed specification, no schema migration, and no changes to how you structure your product feed files. If you're generating Microsoft Shopping feeds programmatically — whether through a custom pipeline, a feed management tool, or an e-commerce platform plugin — nothing about your feed format or submission process changes here.

That said, Product Explorer could indirectly affect how you organize feed configuration. The ability to filter and analyze performance by custom labels and product types makes the taxonomy decisions baked into your feed generation logic more visible and auditable. If your feed configs assign custom labels arbitrarily or your product type hierarchy is flat and unstructured, this tool will make that messiness more obvious. It's worth reviewing how your feed templates map products into those fields.

The announcement doesn't mention any API access to Product Explorer's data or any changes to the Microsoft Advertising API. If you're building automated feed monitoring, you're still relying on existing diagnostics endpoints. We'll revisit if Microsoft exposes this functionality programmatically.

## Recommended next step

If you're a U.S. advertiser under the SKU threshold, open Merchant Center and try Product Explorer against your current feed. The most immediately useful workflow is filtering for products with zero impressions or rejected status — this is the kind of audit that previously required exporting diagnostics reports and joining them with campaign data manually. Use what you find to audit your feed generation logic: are rejected products failing on data quality issues your config could prevent upstream? Beyond that, keep an eye on whether Microsoft expands the SKU limit or adds API support, which would make this relevant for automated tooling.

---

**Read the full announcement on Search Engine Journal** → [Microsoft Advertising Launches Product Explorer](https://www.searchenginejournal.com/microsoft-advertising-launches-product-explorer/579316/)