---
id: "https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb"
tool: "huggingface"
title: "NVIDIA Nemotron 3 Embed Ranks #1 Overall on RTEB, Advancing Agentic Retrieval"
link: "https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb"
pubDate: 2026-07-16T16:01:21.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb"
contentType: "commentary"
summary: "NVIDIA released Nemotron 3 Embed, a family of three open embedding models (8B, 1B BF16, 1B NVFP4) for retrieval-augmented generation and agentic workflows. The 8B variant currently holds the #1 position on the RTEB leaderboard."
---

NVIDIA announced the Nemotron 3 Embed collection via the Hugging Face Blog — three open, commercially available embedding models targeting production RAG and agentic retrieval. The headline result is the 8B model claiming the top spot on the RTEB multilingual leaderboard with a 78.5% score.

## What's actually new

The release is a three-model lineup spanning different points on the accuracy-efficiency curve. The flagship Nemotron-3-Embed-8B-BF16 is built on a modified Ministral-3-8B-Instruct-2512 backbone, converted from a causal decoder into a bidirectional encoder. Below it sit two 1B variants — one in BF16 for cost-sensitive production serving, and an NVFP4 variant optimized for NVIDIA Blackwell GPUs that claims up to 2x throughput over BF16 while retaining 99%+ of its retrieval accuracy. All three models support a 32k context window and ship with open weights, datasets, and NeMo AutoModel fine-tuning recipes. A Rust-based NIM microservice for the 1B model is also available at launch.

The agentic angle is worth noting: NVIDIA evaluated the models by pairing them with Nemotron 3 Ultra as a search agent and measuring downstream token cost. Their claim is that stronger retrieval lets agents resolve queries with fewer re-searches and reasoning turns, directly cutting token spend. The 1B models were distilled from the 8B training line through structured pruning and NAS via NVIDIA ModelOpt, not trained independently from scratch — which means the quality floor of the smaller models is meaningfully tied to the flagship's training.

## What it means for your config

These are embedding models consumed through inference endpoints, not dev-tooling configs in the traditional sense. If you're already running Hugging Face-hosted embedding models in a RAG pipeline, the practical integration point is swapping model identifiers in your retrieval stack — the announcement confirms day-0 support in vLLM and as a NIM microservice, so your serving configuration depends on which backend you use.

For teams using NVIDIA NIM, the Rust-based microservice for the 1B model is a new deployment artifact to configure separately from a standard vLLM setup. The announcement doesn't detail NIM config schemas or environment variables, so check the NIM documentation directly before standing anything up.

If you're running quantized models on Blackwell hardware, the NVFP4 variant introduces a dependency on native NVFP4 support in your serving stack — this is hardware-specific, not a general-purpose quantization you can run on older GPUs. The announcement doesn't specify minimum driver versions or CUDA toolkit requirements for the NVFP4 path.

## Recommended next step

If you're evaluating embedding models for a production retrieval system, the most useful thing in this announcement isn't the leaderboard number — it's the agentic token-cost analysis in Figure 3. Before swapping models, measure your current retrieval hit rate and downstream token consumption on your own queries so you have a real baseline. Then try the 1B BF16 variant first; it's the most broadly deployable of the three and scored 72.4% on RTEB, which closes a significant chunk of the gap to the 8B model. Reserve the 8B for precision-critical workloads where you can absorb the serving cost, and the NVFP4 variant only if you're already on Blackwell infrastructure.

---

**Read the full announcement on Hugging Face Blog** → [NVIDIA Nemotron 3 Embed Ranks #1 Overall on RTEB, Advancing Agentic Retrieval](https://huggingface.co/blog/nvidia/nemotron-3-embed-wins-rteb)