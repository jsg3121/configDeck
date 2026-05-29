---
id: "https://huggingface.co/blog/ibm-research/itbench-aa"
tool: "huggingface"
title: "ITBench-AA: Frontier Models Score Below 50% on the First Benchmark for Agentic Enterprise IT Tasks — by Artificial Analysis and IBM"
link: "https://huggingface.co/blog/ibm-research/itbench-aa"
pubDate: 2026-05-27T17:20:29.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/ibm-research/itbench-aa"
contentType: "commentary"
summary: "Artificial Analysis and IBM launch ITBench-AA, a benchmark testing frontier AI models on agentic SRE tasks like Kubernetes incident diagnosis. No model breaks 50%, making it one of the least saturated agentic benchmarks available."
---

Artificial Analysis and IBM have released ITBench-AA, a new benchmark series evaluating AI models on enterprise IT operations tasks, starting with Site Reliability Engineering. The announcement, published on the Hugging Face Blog, includes a 59-task SRE evaluation where every frontier model tested scores below 50%.

## What's actually new

ITBench-AA SRE gives models Kubernetes incident snapshots — alerts, events, traces, metrics, logs, and application topology — and asks them to identify the minimal set of root-cause entities. Scoring uses average precision gated on full recall: miss a single ground-truth root cause and the task scores zero. Claude Opus 4.7 (Adaptive Reasoning, Max Effort) leads at 47%, with GPT-5.5 (xhigh) at 46% and Qwen3.7 Max at 42%. The most striking finding is that more investigation doesn't help — Gemini 3.1 Pro Preview averaged 83 turns per task but scored only 30%, while Gemma 4 31B (Reasoning) averaged 58 turns and scored 37%. Models that over-investigate tend to submit upstream fault-injection artifacts or co-occurring symptoms as false positives, which the precision metric punishes directly.

The cost data is worth noting too. Gemma 4 31B (Reasoning) hit 37% at $0.14 per task, while the leaderboard-leading Claude Opus 4.7 configuration costs $5.38 per task — a roughly 38x cost difference for a 10-point accuracy gap. Open-weight models like GLM-5.1 (Reasoning) at 40% and $1.23 per task sit on the cost-efficiency frontier.

All models run inside Stirrup, an open-source agentic harness with shell access to a sandboxed filesystem, a 100-turn cap, and three repeats per task. Holding the harness constant isolates model capability from scaffolding differences, which is a common confounder in agentic evals.

## What it means for your config

This benchmark doesn't ship new tooling or configuration formats — it's an evaluation dataset. There are no config migrations, no breaking changes, and no new CLI flags to worry about. However, if you're building or evaluating AI-assisted incident response tooling that interacts with Kubernetes clusters, the benchmark's design choices are instructive: the recall-gated precision metric directly penalizes verbose or hedging agent behavior, which is something to consider when tuning agent prompts or tool-calling configurations. The dataset itself is available on the linked HuggingFace repo and GitHub, so teams building internal SRE agents can use it as a regression suite.

The announcement mentions FinOps and CISO task categories coming next, but no timeline or dataset details are provided yet. We'll revisit when those land.

## Recommended next step

If you're evaluating LLMs for operational automation — especially Kubernetes incident triage — clone the ITBench dataset from GitHub and run your candidate models through the Stirrup harness against the 40 public tasks before committing to a provider. The sub-50% ceiling and the wide cost spread across models suggest that model selection for SRE agents is still very much an open question, and your specific infrastructure topology may favor different models than the aggregate leaderboard suggests. The 19 held-out tasks also make this useful for honest internal benchmarking without train-on-the-test contamination.

---

**Read the full announcement on Hugging Face Blog** → [ITBench-AA: Frontier Models Score Below 50% on the First Benchmark for Agentic Enterprise IT Tasks — by Artificial Analysis and IBM](https://huggingface.co/blog/ibm-research/itbench-aa)