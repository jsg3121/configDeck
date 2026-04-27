# ConfigDeck

> A multilingual web service for developers to generate project configuration files based on their tech stack

[![Built with Claude](https://img.shields.io/badge/Built%20with-Claude%20Code-blueviolet)](https://claude.ai/code)
[![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro)](https://astro.build)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

🔗 **Live**: [configdeck.dev](https://configdeck.dev)

## Overview

ConfigDeck reduces the time spent on project initial setup. Instead of copy-pasting config files from previous projects, select your options and generate ready-to-use configuration files.

### Features

| Feature            | Description                                                            |
| ------------------ | ---------------------------------------------------------------------- |
| **File Generator** | Select options with real-time preview, copy or download                |
| **Stack Presets**  | Generate multiple configs at once for React+Vite, Next.js, Astro, etc. |
| **Migration**      | Convert legacy formats (`.eslintrc` → `eslint.config.mjs`)             |
| **ZIP Download**   | Bundle multiple config files into a single download                    |
| **i18n**           | English and Korean support                                             |

### Supported Config Files

- `.gitignore`
- `.editorconfig`
- `.env.example`
- `tsconfig.json`
- `eslint.config.mjs`
- `prettier.config.mjs`
- `vite.config.ts`
- `vitest.config.ts`
- `next.config.js`

## Tech Stack

| Layer          | Technology          | Why                                              |
| -------------- | ------------------- | ------------------------------------------------ |
| Meta Framework | Astro 6             | SSG-first, 0KB JS for content pages              |
| Interactive UI | Svelte 5 (Runes)    | Compiler-based, minimal runtime, two-way binding |
| Styling        | Tailwind CSS 4      | Utility-first, CSS-based theme config            |
| Language       | TypeScript          | Strict mode, no `any`                            |
| Testing        | Vitest + Playwright | Unit + E2E coverage                              |
| Deployment     | Cloudflare Pages    | Static output, global CDN                        |

## Getting Started

### Prerequisites

- Node.js 22.12.0+
- pnpm 9.x+

### Installation

```bash
git clone https://github.com/jsg3121/configDeck.git
cd configDeck
pnpm install
pnpm dev
```

### Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm preview      # Preview build output
pnpm lint         # ESLint check
pnpm format       # Prettier formatting
pnpm test         # Unit tests
pnpm test:e2e     # E2E tests
```

---

## AI-Driven Development with Claude Code

**This project was built using Claude Code with a custom harness system. Human code writing was minimized — the AI handled planning, implementation, testing, and quality assurance.**

### The Harness System

The `.claude/` directory contains **74 harness documents** that guide AI behavior:

```
.claude/
├── CLAUDE.md              # Project context and rules
├── settings.json          # Permissions and automation
├── ia/                    # Planning docs (IA, feature SPECs)
│   ├── specs/             # Service IA and feature specifications
│   └── templates/         # SPEC templates
├── decisions/             # ADRs (Architecture Decision Records)
│   └── records/           # 13 recorded decisions
├── conventions/           # Coding, styling, workflow rules
│   └── guides/            # coding.md, styling.md, workflow.md, etc.
├── seo/                   # SEO guidelines
│   └── guides/            # Semantic HTML, meta tags, JSON-LD
├── research/              # Research reports
│   └── reports/           # Market analysis, UX research
├── skills/                # Custom skills (9 total)
├── agents/                # Specialized agents (12 total)
├── qa/                    # QA harness and reports
│   ├── templates/         # Report templates
│   └── guides/            # Quality gates
└── hooks/                 # Automation scripts
```

### Architecture Decision Records (ADR)

Every technical decision is documented with context and rationale:

| ADR  | Decision                                                            |
| ---- | ------------------------------------------------------------------- |
| 0002 | Framework: Astro + Svelte (SSG-first, minimal runtime)              |
| 0003 | Package Manager: pnpm (strict deps, disk efficient)                 |
| 0004 | Deployment: Cloudflare Pages (static, global CDN)                   |
| 0005 | Share Links: URL-based option encoding                              |
| 0006 | Generator-centric IA redesign                                       |
| 0007 | Page structure redesign                                             |
| 0008 | Option schema redesign (input types / option definitions separated) |
| 0009 | Stack generator UX pattern (accordion inline options)               |
| 0010 | Article content strategy                                            |
| 0011 | AI summarization automation (Gemini API)                            |
| 0012 | PR validation steps made optional                                   |
| 0013 | AI tool evaluation for article summarization                        |

The AI references relevant ADRs before starting new work to maintain consistency.

### Specialized Agents

12 agents handle different domains:

| Category    | Agent                 | Role                                          |
| ----------- | --------------------- | --------------------------------------------- |
| Planning    | `product-planner`     | Feature SPEC creation and management          |
| Development | `config-maker`        | Config file schema, options, generation logic |
|             | `ui-publisher`        | Astro/Svelte component implementation         |
|             | `ux-designer`         | User flow, layout, interaction design         |
|             | `seo-specialist`      | Semantic HTML, meta tags, JSON-LD, i18n SEO   |
| QA          | `qa-agent`            | QA orchestrator                               |
|             | `unit-tester`         | Vitest unit tests                             |
|             | `e2e-tester`          | Playwright E2E tests                          |
|             | `static-analyzer`     | ESLint/TypeScript static analysis             |
| Business    | `market-intelligence` | Market research, competitor analysis          |
|             | `business-analyst`    | Competitive positioning                       |
|             | `strategy-planner`    | Strategy development                          |

### Agent Collaboration Patterns

**Pipeline (Sequential)**

```
product-planner → ux-designer → ui-publisher → qa-agent
(planning)        (design)       (implement)    (verify)
```

**Fan-out/Fan-in (Parallel Research)**

```
config-maker (ESLint)  ─┐
config-maker (Prettier) ─┼→ Merge
config-maker (TSConfig) ─┘
```

**QA Orchestration**

```
              qa-agent
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
 unit-tester  e2e-tester  static-analyzer
  (Vitest)   (Playwright)  (ESLint/TS)
      │          │          │
      └──────────┼──────────┘
                 ▼
           QA Report
```

### Custom Skills

9 skills automate repetitive tasks via slash commands:

| Skill                | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `/research`          | External research for tech comparisons, library selection |
| `/create-pr`         | PR creation with template-based body, auto label mapping  |
| `/component-builder` | Astro/Svelte component scaffolding                        |
| `/lint-check`        | Prettier/ESLint full check                                |
| `/code-review`       | Pre-PR code review                                        |
| `/a11y-check`        | Accessibility (WCAG) audit                                |
| `/seo-audit`         | SEO audit (meta tags, JSON-LD, hreflang)                  |
| `/test-writer`       | Vitest unit test generation                               |
| `/e2e-test`          | Playwright E2E test generation                            |

### Convention Guides

Detailed guides ensure consistent code:

- **coding.md** — TypeScript rules, Astro vs Svelte usage, Svelte 5 Runes, naming conventions
- **styling.md** — Tailwind CSS rules, responsive strategy, design tokens
- **workflow.md** — Branch strategy, commit messages, PR rules
- **rendering.md** — SSG/SSR strategy per page type

### Why-First Principle

Harness documents explain **why**, not just **what**:

```markdown
# Bad

- Component filenames use PascalCase

# Good

- Component filenames use PascalCase
  → To instantly distinguish Astro/Svelte components from utility files by filename alone
```

### Automation Hooks

`settings.json` defines hooks for automatic quality control:

- **PostToolUse**: Auto-format on file save
- **Stop**: Build/lint verification before task completion

---

## Project Structure

```
configDeck/
├── src/
│   ├── components/         # UI components
│   │   ├── common/         # Header, Footer
│   │   ├── home/           # Home page sections
│   │   └── generator/      # Generator-related
│   ├── lib/
│   │   ├── data/           # Options, presets, file definitions
│   │   ├── generators/     # Config generation logic
│   │   ├── migration/      # Legacy migration
│   │   └── schemas/        # Option schemas
│   ├── pages/              # Astro pages
│   ├── i18n/               # Internationalization
│   └── types/              # TypeScript types
├── tests/
│   ├── unit/               # Vitest unit tests
│   └── e2e/                # Playwright E2E tests
├── .claude/                # AI harness system
└── public/                 # Static assets
```

## Contributing

This project experiments with AI-driven development. When contributing, please reference the harness documents in `.claude/`.

1. Open an issue first to discuss
2. Fork and work on a feature branch
3. Create a PR (see `.claude/conventions/templates/pr-template.md`)

## License

MIT
