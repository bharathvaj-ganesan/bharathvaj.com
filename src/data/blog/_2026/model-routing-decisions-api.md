---
title: "Decision API Use Case: Model Routing"
pubDatetime: 2026-11-09T00:00:00Z
type: til
tags:
  - openai
  - ai
  - model-routing
description: Use OpenAI’s Decisions API to classify a request, choose a model, and generate an answer.
---

Not every request needs the same model. A quick rewrite and a complex debugging problem have different requirements. **Model routing** lets your application choose which model handles each request.

OpenAI’s [Decisions API](https://developers.openai.com/api/docs/guides/decisions) returns typed answers to questions about an input. Here, a `choice` question classifies the work; your code selects the answering model.

## Classify, route, and answer

Install the current OpenAI Python SDK (`pip install --upgrade openai`) and set `OPENAI_API_KEY` in your server environment. This script prints the routing decision, each option’s probability, and the final response from the selected model.

```python
import os

from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
prompt = "Explain why this distributed job can run twice and suggest a fix."

decision = client.decisions.create(
    model="gpt-6-luna",
    input=prompt,
    questions=[
        {
            "type": "choice",
            "name": "complexity",
            "instructions": "Classify the work required to answer this request.",
            "choices": [
                {
                    "value": "simple",
                    "description": "A short rewrite or factual question.",
                },
                {
                    "value": "complex",
                    "description": "Multi-step reasoning or debugging.",
                },
            ],
        }
    ],
)

answer = decision.answers[0] if decision.answers else None
if answer is not None and answer.type == "refusal":
    raise RuntimeError("Routing refused; handle the request separately.")

print("\nRouting decision")
print(f"  Question:   {answer.name}")
print(f"  Choice:     {answer.choice}")
print(f"  Confidence: {answer.confidence:.0%}")
print("  Probabilities:")
for option in answer.probabilities:
    print(f"    {option.value:<8} {option.probability:.0%}")

# Illustrative threshold: tune using labeled application requests.
use_small_model = (
    answer is not None
    and answer.type == "choice"
    and answer.choice == "simple"
    and answer.confidence >= 0.8
)
model = "gpt-6-luna" if use_small_model else "gpt-6.1-sol"

response = client.responses.create(model=model, input=prompt)
print("\nFinal response")
print(f"  Model: {model}")
print(f"  Answer:\n{response.output_text}")
```

The decision call chooses a route; the Responses call produces the answer. Measure answer quality, total latency, and the cost of **both** calls before assuming routing saves money. Confidence is a routing signal, not a guarantee that the eventual answer is correct.
