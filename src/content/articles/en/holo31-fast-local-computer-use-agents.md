---
id: "https://huggingface.co/blog/Hcompany/holo31"
tool: "huggingface"
title: "Holo3.1: Fast & Local Computer Use Agents"
link: "https://huggingface.co/blog/Hcompany/holo31"
pubDate: 2026-06-02T14:13:23.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/Hcompany/holo31"
contentType: "commentary"
summary: "H Company releases the Holo3.1 family of computer-use models in four sizes (0.8B to 35B-A3B) with quantized checkpoints for local inference, expanded mobile support, and native function-calling protocols."
---

H Company announced Holo3.1 on the Hugging Face Blog, a follow-up to their Holo3 computer-use model family. The release focuses on three axes: broader environment support (web, desktop, mobile), compatibility with third-party agent frameworks, and — most interesting from an infrastructure standpoint — quantized weights designed for local and edge deployment.

## What's actually new

Holo3.1 ships in four model sizes: 0.8B, 4B, 9B, and 35B-A3B (a mixture-of-experts variant based on the Qwen family). The headline addition is quantized checkpoints — FP8, Q4 GGUF, and NVFP4 — for the 35B-A3B model, which is a first for this line. On DGX Spark, the NVFP4 variant cuts average agent step time from 6.8s to 3.3s compared to FP8, roughly a 2× end-to-end speedup when combined with agent harness optimizations developed with NVIDIA. Importantly, FP8 and NVFP4 reportedly score only about two points below full-precision BF16 on OSWorld.

On the capability side, mobile automation gets a notable bump: the 35B-A3B model goes from 67% to 79.3% on AndroidWorld, while the 4B and 9B models jump from 58% to 72%. Holo3.1 also adds native function-calling protocol support alongside the structured JSON output that Holo3 already had, with near-parity performance between the two execution modes. H Company reports over 25% improvement versus Holo3 when evaluated inside their own Holotab product harness.

The Q4 GGUF checkpoints specifically target consumer hardware — the post references running them on Apple Silicon Macs or on a DGX Spark on the local network, keeping all inference fully private.

## What it means for your config

This release is more about model serving and agent orchestration than about traditional dev-tool config files. That said, there are a few practical implications worth flagging. If you're running local inference via llama.cpp or similar GGUF-compatible runtimes, you now have an official Q4 checkpoint to point at — no need to roll your own quant. For vLLM users on NVIDIA hardware, the NVFP4 W4A16 checkpoints are designed to slot in directly.

The function-calling support is relevant if you're wiring Holo into an existing agent framework (LangChain, custom tool-calling loops, etc.) — it means you no longer need to parse JSON outputs and translate them yourself. The announcement doesn't detail specific schema changes or breaking differences from Holo3's JSON format, so if you're migrating an existing integration, check the model cards on Hugging Face for the exact protocol spec before swapping model references.

There's no config-level interaction with typical web-dev toolchains here. This is squarely in the ML-ops / agent-infra lane.

## Recommended next step

If you're evaluating local computer-use agents, the most useful thing to do right now is grab the Q4 GGUF or NVFP4 checkpoint from the Hugging Face collection and benchmark it against your own workflow — the published numbers are on OSWorld and AndroidWorld, which may or may not reflect your use case. The four model sizes give you a genuine cost-performance spectrum to test against, especially if you're weighing privacy (local inference) against capability (the 35B-A3B model). Start with the model cards linked in the original post for hardware requirements and supported runtimes.

---

**Read the full announcement on Hugging Face Blog** → [Holo3.1: Fast & Local Computer Use Agents](https://huggingface.co/blog/Hcompany/holo31)