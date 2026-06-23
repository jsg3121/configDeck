---
id: "https://huggingface.co/blog/PaddlePaddle/pp-ocrv6"
tool: "huggingface"
title: "PP-OCRv6 on Hugging Face: 50-Language OCR from 1.5M to 34.5M Parameters"
link: "https://huggingface.co/blog/PaddlePaddle/pp-ocrv6"
pubDate: 2026-06-22T13:18:56.000Z
sourceName: "Hugging Face Blog"
sourceUrl: "https://huggingface.co/blog/PaddlePaddle/pp-ocrv6"
contentType: "commentary"
summary: "PaddleOCR's PP-OCRv6 ships three model tiers (1.5M–34.5M params) with 50-language support and multiple inference backends including Transformers, ONNX Runtime, and Paddle Inference, all hosted on Hugging Face Hub."
---

PaddlePaddle announced PP-OCRv6 on the Hugging Face Blog, the latest generation of their PaddleOCR model family targeting practical text detection and recognition across documents, screenshots, and multilingual images. Models and an online demo are available now on Hugging Face Hub.

## What's actually new

PP-OCRv6 introduces three model tiers — tiny (1.5M params), small (7.7M), and medium (34.5M) — all sharing a unified PPLCNetV4 backbone. The medium and small tiers support 50 languages in a single model, covering Chinese (simplified and traditional), English, Japanese, and 46 Latin-script languages. On PaddleOCR's in-house benchmarks, the medium tier hits 86.2% detection Hmean and 83.2% recognition accuracy, which they report as +4.6 and +5.1 percentage points over PP-OCRv5_server respectively. The detection module now uses RepLKFPN (a large-kernel feature pyramid network), and recognition uses EncoderWithLightSVTR combining local and global attention. The interesting deployment detail: PaddleOCR 3.7 exposes a unified `engine` parameter that lets you swap between Paddle Inference, Transformers, and ONNX Runtime backends without changing your pipeline code.

## What it means for your config

This isn't a config-file-level change in the traditional sense — there's no `.paddleocrrc` or YAML schema to manage. The integration point is code-level: you instantiate `PaddleOCR()` and pass `engine="transformers"` or `engine="onnxruntime"` to select your backend. That said, if you're managing OCR in a deployment pipeline (Docker images, CI, model registry references), the three-tier structure matters. You can swap `PP-OCRv6_tiny` into an edge deployment config and `PP-OCRv6_medium` into a server pipeline without changing the surrounding code, just the model reference.

For teams already using PaddleOCR with Paddle Inference, the migration path looks straightforward — the `PaddleOCR()` constructor defaults to the medium model and Paddle Inference backend, so existing code should work with a `pip install --upgrade paddleocr`. If you're in a PyTorch-centric stack, the Transformers backend means you don't need PaddlePaddle installed as a runtime dependency, which simplifies container images. The ONNX path is similarly useful for environments where you've standardized on ONNX Runtime.

The announcement doesn't detail any breaking changes from PP-OCRv5 at the API level, but if you're pinning model versions in your deployment configs, you'll want to explicitly test the v6 models against your specific document types before swapping — the benchmark numbers are on PaddleOCR's own test set, not yours.

## Recommended next step

Start with the hosted Hugging Face Space demo to eyeball PP-OCRv6 against your actual document types before committing to integration work. If your OCR needs are multilingual (especially CJK + Latin mixed), the unified 50-language support in the small and medium tiers could replace multiple single-language models you might be running today — worth auditing your current model inventory. For production integration, pick the backend that matches your existing inference stack and test the three tiers against your latency and accuracy requirements; the parameter count spread from 1.5M to 34.5M gives you real room to trade off.

---

**Read the full announcement on Hugging Face Blog** → [PP-OCRv6 on Hugging Face: 50-Language OCR from 1.5M to 34.5M Parameters](https://huggingface.co/blog/PaddlePaddle/pp-ocrv6)