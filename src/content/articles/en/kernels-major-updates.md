---
id: "https://huggingface.co/blog/revamped-kernels"
tool: "huggingface"
title: "🤗 Kernels: Major Updates"
link: "https://huggingface.co/blog/revamped-kernels"
pubDate: 2026-07-06T00:00:00.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/revamped-kernels"
contentType: "commentary"
summary: "Hugging Face has redesigned its Kernels project with a new Hub repository type, a trust-based security model with code signing, cleaner CLI separation, and expanded framework support including Torch Stable ABI and Apache TVM FFI."
---

Hugging Face has published a substantial update to its Kernels project — the packaging and distribution layer for custom GPU kernels on the Hub. The post covers a near-complete redesign touching repository structure, security, CLI tooling, framework coverage, and early support for agent-driven kernel development.

## What's actually new

Kernels are now a first-class repository type on the Hub (alongside models, datasets, and spaces), with dedicated pages showing supported accelerators, operating systems, and backend versions. On the security side, the project now enforces "trusted publishers" by default — kernels from untrusted sources require an explicit `trust_remote_code=True` opt-in. Code signing via Sigstore's cosign adds a second layer: even if a trusted publisher's Hub credentials are compromised, an attacker can't sign a kernel without the ephemeral private key. Signature verification on load isn't enforced yet; the team is testing before full rollout.

The CLI has been split cleanly: `kernels` handles loading and preparation, `kernel-builder` handles builds. Framework support now includes the Torch Stable ABI (target a Torch version and get roughly two years of forward compatibility) and Apache TVM FFI, which enables cross-framework kernels that work with PyTorch, JAX, and CuPy. The post also lays out how `kernel-builder`'s predictable project layout and non-interactive CLI are designed to slot into agentic workflows where an agent scaffolds, builds, benchmarks, and iterates on kernels.

## What it means for your config

If you're consuming kernels in your Python projects, the main behavioral change is the trusted-publisher gate. Code that previously loaded any kernel from the Hub without flags will now fail for untrusted publishers unless you pass `trust_remote_code=True`. That's a breaking change worth auditing in CI pipelines or Docker builds where kernel loading happens automatically.

For kernel *authors*, publishing now requires an explicit access request from your account settings — you can't just push a kernel repo anymore. Build reproducibility relies on Nix, and code signing setup details are in the v0.16.0 release notes linked from the post. If you maintain build configs or CI workflows that publish kernels, you'll want to review the new `kernel-builder` CLI docs since responsibilities previously shared with `kernels` have been reshuffled.

The Torch Stable ABI support is worth noting for anyone maintaining version matrices in their build configs. Rather than compiling against every minor Torch release, you can target a single ABI version and cover a wide range — though the exact compatibility window depends on the version you target.

The announcement doesn't detail how TVM FFI kernels interact with existing PyTorch-only kernel configurations or whether mixed-framework setups require additional config. We'll revisit once more documentation lands.

## Recommended next step

If you're already using `kernels` from the Hub, audit your loading calls for the new trusted-publisher requirement before upgrading. If you're a kernel author, check whether your org has publisher access and review the signing setup in the v0.16.0 release notes. For everyone else, the new kernel browsing page on the Hub is the quickest way to see what's available and whether any kernels match your hardware — worth bookmarking if you work with custom CUDA or Triton code.

---

**Read the full announcement on Hugging Face Blog** → [🤗 Kernels: Major Updates](https://huggingface.co/blog/revamped-kernels)