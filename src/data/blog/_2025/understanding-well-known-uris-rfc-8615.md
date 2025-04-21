---
title: Understanding .well-known URIs and RFC 8615
slug: understanding-well-known-uris-rfc-8615
draft: false
pubDatetime: 2025-04-27T04:00:00.000Z
description: Learn what .well-known URIs are, why they were introduced through RFC 8615, and explore real-world use cases like Let's Encrypt, OAuth discovery, and more.
tags:
  - web standards
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


## Some Real-World Use Cases

### 1. **Let's Encrypt - ACME Challenge**
When you get a free SSL certificate via Let's Encrypt, it needs to verify that you control your domain.  
It does this by checking a file at:

```
https://yourdomain.com/.well-known/acme-challenge/<token>
```

This shows the certificate authority you own the domain.



### 2. **OAuth 2.0 Authorization Servers**
When apps need to authenticate via OAuth 2.0, they use **OpenID Connect Discovery** to automatically find the right authorization endpoints.

They do this by fetching:

```
https://yourdomain.com/.well-known/openid-configuration
```

This file (a JSON document) describes where the token endpoint, authorization endpoint, and other critical details are located.



### 3. **Security.txt**
Websites often provide a way for security researchers to report vulnerabilities.  
The community standard is to publish a `security.txt` file at:

```
https://yourdomain.com/.well-known/security.txt
```

It contains contact details, disclosure policy, and other security-relevant information.



### 4. **Password Change / Account Management (Well-Known URLs)**
Browsers like Chrome use `.well-known/change-password` to automatically redirect users to password management pages.

For example:

```
https://yourdomain.com/.well-known/change-password
```

Instead of users manually navigating, browsers can help them directly update their passwords on your site.



### 5. **Apple App Site Association (AASA) for Universal Links**
If you want iOS apps to open your website links natively inside the app, you need to host an AASA file at:

```
https://yourdomain.com/.well-known/apple-app-site-association
```

Apple devices fetch this file to trust and associate your app with your domain.

---

So the next time you see a `.well-known` URL, you’ll know: it’s not just a random folder — it’s a tiny piece of internet architecture helping everything run smoothly.