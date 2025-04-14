---

title: How to Evaluate a System Design?
slug: how-to-evaluate-system-design
draft: false
pubDatetime: 2025-04-13T01:00:00.000Z
description: A simple guide to evaluating system designs using three key principles - fidelity, simplicity, and cost effectiveness.
tags:
  - System Design
---

### TL;DR  
When evaluating system design, think of it like a triangle:  
- ✅ **Fidelity** – It does what it's supposed to.  
- ✅ **Simplicity** – It's easy to work and modify.
- ✅ **Cost Effectiveness** – It won’t break the bank. 

Designing a system is only half the battle—evaluating whether it's a *good* design is just as important. Whether you're reviewing a new architecture proposal, evaluating a solution during an interview, or building something yourself, here are three key principles to guide your assessment:

### 1. Fidelity: Does it meet the requirements?

Start by asking: **Does this design solve the right problem?**  
A great design is rooted in the real-world needs it's trying to address. Fidelity is about how well the system aligns with functional and non-functional requirements—think scalability, performance, security, and user experience. If the design misses the mark here, nothing else matters.

> **Example:**  
Suppose you're designing a notification system for an e-commerce platform. If the business requirement is to support email, SMS, and push notifications with retries, and your design only covers email—it's not high fidelity. Even if it’s beautifully architected, it fails at the goal.

### 2. Simplicity: Is it easy to understand, manage, and evolve?

A simple design is easier to build, debug, scale, and onboard new developers into. Look for:
- Clear separation of concerns
- Minimal moving parts
- Logical naming and documentation

Complexity is a debt—aim for simplicity without sacrificing flexibility.


> **Example:**  
Instead of building a custom orchestration engine for the notification system from scratch, you opt to use a queue (like SQS or RabbitMQ) and worker services with retry logic. This leverages existing tools and keeps the architecture lean and understandable.


### 3. Cost Effectiveness: Is it practical to implement and maintain?

Every system comes with a cost—infra, licenses, third-party tools, and engineering effort. A design should make good use of resources and avoid over-engineering. Ask:
- Is this affordable for our current scale?
- Can this grow with us without exponential cost?
- Are there cheaper alternatives that deliver the same outcome?

> **Example:**  
Choosing AWS SNS + Lambda to deliver notifications may cost pennies and scale effortlessly. On the other hand, integrating a full-blown Kafka cluster for a low-volume use case might be overkill—adding cost and complexity without real benefit.

Happy Building!!