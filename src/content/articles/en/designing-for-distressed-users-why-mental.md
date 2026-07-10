---
id: "https://smashingmagazine.com/2026/07/designing-distressed-users-mental-health-apps-ui/"
tool: "smashingmagazine"
title: "Designing For Distressed Users: Why Mental Health Apps Shouldn't Follow Every UI Fashion"
link: "https://smashingmagazine.com/2026/07/designing-distressed-users-mental-health-apps-ui/"
pubDate: 2026-07-09T15:00:00.000Z
sourceName: "Smashing Magazine"
sourceUrl: "https://smashingmagazine.com/2026/07/designing-distressed-users-mental-health-apps-ui/"
contentType: "commentary"
summary: "Kat Homan argues in Smashing Magazine that mental health apps face a severe retention crisis partly because trendy UI patterns add cognitive load exactly when users can least handle it, and proposes an evaluation framework for assessing whether design choices support or harm distressed users."
---

Kat Homan, writing for Smashing Magazine, lays out a case that mental health app interfaces are systematically failing their users by chasing visual trends designed for attention capture rather than cognitive relief. The article introduces an evaluation framework for deciding when a UI trend helps and when it actively drives people away.

## What's actually new

The core argument rests on a striking retention stat: roughly 95% of mental health app users abandon the app within 30 days, with a median 30-day retention of just 3.3%. Even top-tier apps lose about half their users in the first ten days. Homan traces part of this to a "foundational conflict of purpose" — trend-driven design optimizes for novelty and engagement signals, while distressed users need reduced cognitive strain, trust, and immediate clarity. She identifies five fronts where this tension surfaces, with cognitive friction being the first and most detailed in the excerpt. Neo-brutalist layouts, hidden navigation via non-standard gestures, and abstract unlabeled icons are called out as specific offenders. The article walks through real app examples — including Nonori's linear-flow approach as a positive case and comprehensive tracking apps like Bearable as a trade-off worth scrutinizing — without framing it as a ranking. The full piece appears to cover all five tension areas; see the original for the complete framework.

## What it means for your config

This is a UX/design-strategy piece, not a tooling or configuration change. There are no new libraries, build tools, design tokens, or config files to update. That said, if your team maintains a design system with configurable component libraries (think theme tokens, accessibility presets, or interaction-pattern defaults), Homan's framework is worth internalizing as a design-review checklist. The key question she proposes — "does this trend lower the cost of using the app when the user can least afford it?" — could translate into concrete acceptance criteria for component variants shipped in sensitive product contexts. But the article doesn't prescribe specific tooling or implementation details, so there's nothing to migrate or reconfigure here.

## Recommended next step

If you build or maintain health-related products — or anything where users arrive stressed, fatigued, or in crisis — read the full article for the complete five-front evaluation framework. The retention numbers alone justify an audit of your onboarding and panic/crisis flows. For teams using design-system tooling, consider adding a "cognitive cost at low capacity" review gate to your component acceptance process: can a user with depleted executive function complete the primary action without hesitation? That single question, applied consistently, is more useful than any trend adoption checklist.

---

**Read the full announcement on Smashing Magazine** → [Designing For Distressed Users: Why Mental Health Apps Shouldn't Follow Every UI Fashion](https://smashingmagazine.com/2026/07/designing-distressed-users-mental-health-apps-ui/)