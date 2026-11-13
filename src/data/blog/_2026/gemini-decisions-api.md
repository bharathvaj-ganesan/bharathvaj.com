---
title: "Gemini Decisions API"
pubDatetime: 2026-11-13T00:00:00Z
type: til
tags:
  - google-gemini
  - ai
  - decision-models
description: A brief comparison of Gemini Decision 1, TypeSafe Jev, and OpenAI’s Decisions API.
---

[Google has introduced](https://x.com/Google/status/2120583966272983331) the **Gemini Decisions API**, powered by **Gemini Decision 1**.

[![Gemini Decisions API accepts multimodal input and returns calibrated answers](@/assets/images/gemini-decisions-api.jpg)](https://x.com/Google/status/2120583966272983331)

_Image source: [Google](https://x.com/Google/status/2120583966272983331)_

Instead of generating text token by token, it evaluates shared input and returns typed decisions with probabilities and confidence scores in one pass.

## What stood out

- Supports text, images, audio, video, and PDFs
- Evaluates up to **1,000 independent questions** per request
- Supports yes/no, fixed-choice, and rubric-scoring decisions
- Costs **$0.10 per 1M input tokens**, with **no output-token charge**

## Quick comparison

| API / model | Input | Questions per request | Input price | Output price |
| --- | --- | ---: | ---: | ---: |
| **Gemini Decision 1** | Text, JSON, images, audio, video, PDFs | Up to **1,000** | **$0.10 / 1M tokens** | Free |
| **TypeSafe Jev 1.14** | Text, JSON, images | Context-bound; no separate question limit | **$0.042 / 1M tokens** | Free |
| **OpenAI GPT-6 Luna** | Text, JSON, images, conversation and tool history | Up to **400** | **$0.10 / 1M uncached tokens** | Free |

## How they fundamentally differ

All three are **decision models**, not general text generators. You provide a closed answer space, and the model scores the candidates directly instead of autoregressively writing and then parsing a response. This makes them better suited to routing, moderation, policy checks, ranking, and other decisions that code must consume.

The main difference is what each system is optimized around:

- **Gemini Decision 1** uses Gemini’s native multimodal architecture to score many isolated questions over the same text, image, audio, video, or PDF input in a single forward pass. It has the largest fixed question limit and broadest media support.
- **Jev** is TypeSafe’s purpose-built “System One” model, trained with Reinforcement Learning for Calibrated Decisions. It exposes `Noul`, `Choice`, `Score`, and an image `Box` primitive. It is the cheapest here and has no separate question-count limit, but does not natively accept audio or video.
- **OpenAI’s Decisions API** uses the dedicated GPT-6 Luna model and exposes `predicate`, `choice`, and `score` questions. Its distinction is workflow integration: it can evaluate conversation history, function/tool calls, and JSON directly, and supports prompt caching.

Their low-level architectures are not fully public, so the safest comparison is their observable contract: all return bounded, probabilistic decisions; they mainly differ in modalities, primitives, batching limits, workflow context, and pricing.

## TIL

Decision-first models are becoming a distinct model category:

- Pick **Gemini** for native multimodal input or large batches of questions.
- Pick **Jev** for lower-cost decisions or its bounding-box primitive.
- Pick **OpenAI** when decisions need existing OpenAI conversation, tool-call, or caching workflows.

Confidence is still a routing signal, not a guarantee. Test it on labeled data from your own application before automating high-impact actions.

## References

- [Google’s announcement](https://x.com/Google/status/2120583966272983331)
- [Gemini Decisions API documentation](https://aistudio.google.com/docs/decisions-api)
- [Gemini Decision 1 launch post](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/)
- [TypeSafe System One documentation](https://docs.typesafe.ai/concepts/system-one)
- [TypeSafe Jev models and pricing](https://docs.typesafe.ai/models)
- [OpenAI Decisions API documentation](https://developers.openai.com/api/docs/guides/decisions)
