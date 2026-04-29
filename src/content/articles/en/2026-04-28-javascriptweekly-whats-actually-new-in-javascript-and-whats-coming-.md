---
id: "https://javascriptweekly.com/issues/783"
tool: "javascriptweekly"
title: "What's actually new in JavaScript (and what's coming next)"
link: "https://javascriptweekly.com/issues/783"
pubDate: 2026-04-28T00:00:00.000Z
summary: "JavaScript Weekly #783 covers major ecosystem updates including TypeScript 7.0 Beta with 10x faster compilation, pnpm 11.0 release with improved performance, and comprehensive coverage of ES2025/ES2026 features. Essential reading for staying current with JavaScript tooling and language evolution."
---

## Major Tool Updates Reshaping JavaScript Development

This week brings significant updates to core JavaScript tooling that will impact development workflows across the ecosystem. **TypeScript 7.0 Beta** introduces a revolutionary **Go-powered compiler** delivering approximately **10x faster compilation performance**, marking a major architectural shift for the language. While TypeScript 6.0's deprecations and config changes provide a smooth upgrade path from v5 to v7, developers should note that the stable programmatic API won't arrive until v7.1.

**pnpm 11.0** enhances the popular package manager with several performance improvements, including an **SQLite-backed store index** for faster installations and `minimumReleaseAge` set to one day by default. The release also introduces native package publishing capabilities and the new `pack-app` feature. Additionally, work has resumed on **Pacquet**, a Rust-powered port that promises even greater performance gains.

## ES2025 and ES2026 Language Features Overview

The JavaScript language continues evolving with substantial additions in **ES2025** and **ES2026**. Key features include **Iterator helpers** that simplify working with iterables, **Promise.try** for cleaner error handling, and **Map.getOrInsert** for more efficient map operations. The **using statement** brings automatic resource management to JavaScript, while the long-awaited **Temporal API** provides modern date and time handling.

**Node.js v26.0** (Current) is expected to enable Temporal API support by default following an upgrade to V8 14.6, making these powerful date/time capabilities immediately available to server-side developers. This represents a significant step forward in JavaScript's standard library capabilities.

## Build Tools and Framework Innovations

The bundling landscape sees major improvements with **Rspack 2.0**, the Rust-based webpack-compatible bundler now delivering **10% better performance** than v1.7. The release includes enhanced static analysis capabilities and experimental React Server Components (RSC) support, alongside the companion **Rsbuild 2.0** release.

**TSRX** emerges as an ambitious TypeScript language extension for declarative UIs, created by a Svelte maintainer and former React core engineer. This JSX alternative includes built-in control flow, scoped styles, and locals support while compiling to React, Preact, Solid, and Ripple frameworks.

**Fresh 2.3**, Deno's full-stack web framework, now ships zero JavaScript by default for pages that don't require it, implements first-class WebSocket support, and simplifies View Transitions API usage with single-attribute implementation.

## Development Ecosystem and Tooling Updates

The broader development ecosystem continues expanding with specialized tools addressing specific needs. **Nano Stores 1.3** offers an ultra-lightweight state manager at just 286 bytes, providing atomic and derived stores across all major frameworks and vanilla JavaScript applications.

**Lightweight Charts™ 5.2** from TradingView delivers optimized canvas-based charting specifically for financial data, featuring rounded candle plots, box whisker plots, and dual range histograms. The library's seven-year development history and extensive interactive demos demonstrate its maturity and capabilities.

**BWIP-JS 4.10** provides comprehensive barcode generation supporting over 100 different standards, while **Aube** introduces another performance-focused package manager option from the creator of Mise. These specialized tools highlight the JavaScript ecosystem's continued growth in addressing domain-specific requirements.

The **Nuxt UI 4.7** release adds new components including Listbox and a Prompt component specifically designed for displaying AI prompts, reflecting the growing integration of AI capabilities into development workflows.