---
title: Understanding .well-known URIs
slug: understanding-well-known-uris-rfc-8615
draft: false
pubDatetime: 2025-04-21T04:00:00.000Z
description: Learn what .well-known URIs are, why they were introduced through RFC 8615, and explore real-world use cases like Let's Encrypt, OAuth discovery, and more.
tags:
  - RFC
---

Recently, while exploring internal OAuth documents at work, I stumbled upon URLs that looked like this:

```
https://example.com/.well-known/interal-auth/...
```

The `.well-known` URI grabbed my attention, so in this blog, we'll demystify the concept, RFC 8615, and explore some real-world examples.


## TL;DR

| Aspect | Details |
|:---|:---|
| **What** | A standard URI prefix (`/.well-known/`) for service discovery and configuration. |
| **Why** | Brings predictability, reduces conflicts, simplifies client-server interactions. |
| **Examples** | Let's Encrypt challenges, OAuth discovery, security.txt, password management, Universal Links, and more. |


## What is `.well-known`? (RFC 8615)

[RFC 8615](https://datatracker.ietf.org/doc/html/rfc8615) defines a special URI path prefix — **`.well-known/`** — intended for **service discovery**. 

In simple terms:
- It’s a **standardized location** on a server where applications can reliably look for specific information or configurations.
- Instead of inventing different locations for different apps, `.well-known/` gives a **consistent, predictable** way to find resources.

This path is always at the root of the domain (e.g., `https://yourdomain.com/.well-known/...`) and is intended to be **reserved and controlled** by the web server owner.

## But why ?

The internet needs order — especially when different apps, services, and protocols need to communicate automatically.

Before `.well-known`, developers and companies had to invent random paths to place their service configuration files. This led to:
- **Inconsistency**: Different services using different unpredictable URLs.
- **Conflicts**: Two services wanting the same root path.
- **Harder discovery**: Clients couldn't assume where to find a particular configuration.

`.well-known` solves this by:
- **Standardizing** where to place resources needed for discovery and configuration.
- **Reducing ambiguity**: Everyone knows to check `.well-known/`.
- **Simplifying clients**: Applications can hardcode `.well-known/` patterns rather than guess or configure different URLs.

In short, `.well-known` **brings predictability and interoperability** across the web.

## Real-World Use Cases

| Use Case | Purpose | `.well-known` Path |
|:---|:---|:---|
| **Let's Encrypt - ACME Challenge** | Verifies domain ownership for issuing SSL certificates. | `/acme-challenge/<token>` |
| **OAuth 2.0 Authorization Servers** | Enables OpenID Connect clients to discover authorization endpoints. | `/openid-configuration` |
| **Security.txt** | Provides security researchers with contact information and vulnerability reporting guidelines. | `/security.txt` |
| **Password Change / Account Management** | Allows browsers to redirect users to password update pages. | `/change-password` |
| **Apple App Site Association (AASA)** | Enables iOS apps to handle Universal Links by associating apps with domains. | `/apple-app-site-association` |


So the next time you see a `.well-known` URL, you’ll know: it’s not just a random folder — it’s a tiny piece of internet architecture helping everything run smoothly.