---
id: "https://www.searchenginejournal.com/google-ai-overviews-study-finds-lost-clicks-werent-lower-quality/581298/"
tool: "searchenginejournal"
title: "Google AI Overviews Study Finds Lost Clicks Weren't Lower Quality"
link: "https://www.searchenginejournal.com/google-ai-overviews-study-finds-lost-clicks-werent-lower-quality/581298/"
pubDate: 2026-07-01T23:56:14.000Z
sourceName: "Search Engine Journal"
sourceUrl: "https://www.searchenginejournal.com/google-ai-overviews-study-finds-lost-clicks-werent-lower-quality/581298/"
contentType: "commentary"
summary: "A revised randomized field experiment finds a ~40% drop in organic clicks when Google AI Overviews are shown, and the lost clicks show no measurable difference in quality compared to clicks that remain — undercutting Google's claim that AI Overviews primarily eliminate low-value visits."
---

Search Engine Journal covers an updated working paper by researchers Saharsh Agarwal and Ananya Sen that directly tests whether Google AI Overviews absorb only low-quality traffic. The short answer from the data: they don't.

## What's actually new

The revised paper now includes click-quality analysis alongside the traffic-loss numbers. Researchers measured back-button rates, sub-10-second bounces, and time on site for clicks in both the AI Overview and no-AI Overview groups — none of the three metrics showed a statistically significant difference. About 4 in 10 same-tab clicks returned to the SERP in both conditions, roughly 18% of visits ended within 10 seconds, and time on site was indistinguishable. This matters because Google VP Liz Reid has publicly argued that AI Overviews reduce "bounce clicks," but hasn't released supporting data. The researchers also broke results down by query type: the traffic losses are concentrated in informational queries, where AI Overviews triggered on 53% of searches. Position one nearly doubled its clicks when a top-of-page Overview was removed. Navigational and transactional queries showed no measurable change, though sample sizes were smaller.

## What it means for your config

This isn't a developer tooling or configuration change — it's an SEO research finding. There are no config files, build tools, or integration settings to update. That said, if you maintain any tooling that touches search analytics, structured data generation, or SEO monitoring dashboards, the study reinforces that declining organic click volumes from informational queries aren't necessarily a signal of worsening content quality on your end. Teams relying on bounce rate or time-on-site as proxy metrics for content effectiveness should note that these quality signals remain stable regardless of whether AI Overviews are present. If your monitoring configs use short-visit thresholds (e.g., flagging sub-10-second sessions as low quality), this study suggests those visits aren't disproportionately the ones AI Overviews are filtering out — so adjusting thresholds in response to AIO rollout isn't clearly justified by the data.

## Recommended next step

If you're tracking the impact of AI Overviews on your own properties, segment your analytics by query intent type. The study shows informational queries carry the bulk of the traffic loss while navigational and transactional queries are largely unaffected. That segmentation will give you a more honest picture than aggregate click totals. The paper is still a working draft on SSRN and hasn't completed peer review, so treat the specific figures as directional rather than settled — but the methodology (randomized field experiment with crossover) is strong enough to take seriously. Read the full SEJ writeup for the complete breakdown of the crossover results and per-position data.

---

**Read the full announcement on Search Engine Journal** → [Google AI Overviews Study Finds Lost Clicks Weren't Lower Quality](https://www.searchenginejournal.com/google-ai-overviews-study-finds-lost-clicks-werent-lower-quality/581298/)