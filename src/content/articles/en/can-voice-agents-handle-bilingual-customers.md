---
id: "https://huggingface.co/blog/ServiceNow-AI/code-switching"
tool: "huggingface"
title: "Can Voice Agents Handle Bilingual Customers? Benchmarking Frontier ASR on Code-Switched Speech"
link: "https://huggingface.co/blog/ServiceNow-AI/code-switching"
pubDate: 2026-06-09T19:38:28.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/ServiceNow-AI/code-switching"
contentType: "commentary"
summary: "ServiceNow AI published a benchmark and dataset evaluating seven ASR models on code-switched (bilingual) speech across four language pairs, released through their AU-Harness evaluation tool. ElevenLabs Scribe V2, Gemini 3 Flash, and AssemblyAI Universal 3-Pro came out on top, while Whisper Large V3 Turbo performed poorly due to defaulting to translation mode on mixed-language audio."
---

ServiceNow AI's research team published a benchmark on the Hugging Face Blog specifically targeting how well automatic speech recognition systems handle code-switched speech — audio where speakers fluidly alternate between two languages mid-sentence. The benchmark, dataset, and evaluation harness (AU-Harness) are publicly available.

## What's actually new

The benchmark covers four language pairs — Spanish-English, French-English, Canadian French-English, and German-English — with the non-English language as the primary frame and English embedded at varying lengths. The dataset was built from IT support and HR interaction scenarios (password resets, benefits inquiries, etc.), synthesized using ElevenLabs Multilingual V2 TTS, and reviewed by native-speaker linguists. The final dataset contains 918 total records across the four pairs.

Seven ASR models were evaluated using three metrics: standard Word Error Rate (WER), Semantic WER (SWER, using Gemma-4-31B as judge), and Answer Error Rate (AER, which tests whether downstream comprehension survives transcription errors). ElevenLabs Scribe V2 led across most metrics, with AssemblyAI Universal 3-Pro and Gemini 3 Flash close behind. An interesting divergence: AssemblyAI ranked higher on raw WER but Gemini 3 Flash beat it on semantic metrics, suggesting Gemini's errors were less consequential for downstream tasks. OpenAI Whisper Large V3 Turbo landed at the bottom — without an explicit language parameter, it defaults to translating code-switched audio into English rather than transcribing it, a known but painful failure mode.

## What it means for your config

This is directly relevant if you're configuring voice agent pipelines that rely on ASR as a first stage. The Whisper result is the most actionable finding from a config perspective: if you're using Whisper on multilingual audio without setting a language parameter, you're likely getting translation output instead of transcription. That's not a bug in the model — it's a default behavior that needs to be overridden in your pipeline config. The announcement doesn't detail the exact parameter or API call to fix this, but it's a documented Whisper behavior worth auditing if your users code-switch.

For teams choosing between ASR providers, the benchmark suggests model selection should depend on whether you optimize for transcription fidelity (WER) or downstream task accuracy (AER/SWER) — the rankings shift between these. The AU-Harness is released publicly, so you could run the same evaluation against your own language pairs or domain-specific scenarios rather than taking these numbers at face value.

There's no direct impact on Hugging Face model card configs or `transformers` pipeline configurations here — this is a benchmark release, not a model or library update.

## Recommended next step

If you operate voice agents serving bilingual populations, run your current ASR provider against the released benchmark data via AU-Harness to see where you actually stand. Pay particular attention to the AER metric rather than WER alone — a transcription that drops an accent mark is very different from one that loses a case number, and AER is designed to catch the latter. The full results tables and methodology are in the original post.

---

**Read the full announcement on Hugging Face Blog** → [Can Voice Agents Handle Bilingual Customers? Benchmarking Frontier ASR on Code-Switched Speech](https://huggingface.co/blog/ServiceNow-AI/code-switching)