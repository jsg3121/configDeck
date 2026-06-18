---
id: "https://huggingface.co/blog/allenai/molmomotion"
tool: "huggingface"
title: "MolmoMotion: Language-guided 3D motion forecasting"
link: "https://huggingface.co/blog/allenai/molmomotion"
pubDate: 2026-06-17T15:26:44.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/allenai/molmomotion"
contentType: "commentary"
summary: "Allen AI releases MolmoMotion, a model that predicts 3D point trajectories from a single video frame, query points, and natural language instructions, along with a 1.16M-video dataset and a human-validated benchmark."
---

Allen AI announced MolmoMotion via the Hugging Face Blog — a motion forecasting model that takes a video frame, a set of 3D query points on an object, and a written action description, then predicts where those points will move in 3D space over the next few seconds. The release includes open model weights, a large-scale training dataset (MolmoMotion-1M), and a new evaluation benchmark (PointMotionBench).

## What's actually new

MolmoMotion is built on the Molmo 2 backbone and ships in two variants: an autoregressive version (MolmoMotion-AR) that outputs future coordinates as structured text tokens step by step, and a flow-matching version (MolmoMotion-FM) that works in continuous 3D coordinate space to handle ambiguous instructions where multiple plausible futures exist. The key design choice is representing motion as sparse, class-agnostic 3D surface points in a world frame — not tied to any object template — which keeps the output compact and directly consumable by downstream systems like robot policies or video generators.

MolmoMotion-1M consists of 3D point trajectories extracted from 1.16M videos via an automated pipeline that grounds objects, tracks dense 2D points, lifts them to metric 3D, filters noisy tracks, and clips to meaningful motion windows. The dataset spans 736 motion types and 5.6K distinct objects. PointMotionBench provides 2.7K human-validated clips across 111 object categories and 61 motion types for evaluation. Both the dataset and benchmark are published on Hugging Face, and code is on GitHub.

The downstream applications demonstrated include robotics planning and trajectory-conditioned video generation, though the source article was truncated before full benchmark numbers were presented — check the original and the linked tech report for detailed results.

## What it means for your config

This is a research model release, not a library update or config schema change. There's no new Hugging Face Transformers API surface or configuration format that would affect existing `config.json` files or pipeline definitions in your projects. If you're pulling Molmo 2-based models via the `transformers` library, MolmoMotion sits alongside them as a separate collection rather than replacing anything.

For teams running inference pipelines that already use Hugging Face model configs, the two variants (AR and FM) will likely each have their own model card and config, but the announcement doesn't detail specific config keys or breaking changes. We'll revisit once the model cards and integration docs are fleshed out.

## Recommended next step

If you work on robotics planning, video generation, or any system that needs to reason about future object motion, the most useful thing to do right now is look at the PointMotionBench benchmark to understand how it evaluates forecasting accuracy — it's a cleaner signal than trying to benchmark your own pipeline ad hoc. The dataset and model weights are all openly available on Hugging Face, and the GitHub repo has the training and evaluation code. Start with the tech report linked from the project page to understand the architecture choices before spinning up inference.

---

**Read the full announcement on Hugging Face Blog** → [MolmoMotion: Language-guided 3D motion forecasting](https://huggingface.co/blog/allenai/molmomotion)