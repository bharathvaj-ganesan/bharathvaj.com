---
title: "Emoji in Domain Names"
pubDatetime: 2026-11-17T00:00:00Z
type: til
tags:
  - web
  - domains
  - dns
description: How emoji and symbols work in domain names, and why only some top-level domains allow them.
---

I came across Vercel CEO [Guillermo Rauch](https://x.com/rauchg)'s profile, where he has pinned this post:

<blockquote class="twitter-tweet" data-dnt="true"><p>Pinned post by Guillermo Rauch</p>&mdash; <a href="https://x.com/rauchg/status/2089179650891432270">View on X</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I had never seen a symbol in a domain name before, so I wanted to understand how it works.

## What is Punycode?

Punycode is an encoding that turns Unicode text into plain ASCII letters, digits and hyphens. Each converted domain label gets an `xn--` prefix so software knows it was encoded. For example, `münchen` becomes `xn--mnchen-3ya`. I wrote more about it in [what is Punycode](/posts/punycode-deprecation-nodejs/#-what-is-punycode).

## How it works

DNS only understands ASCII. Any domain with other characters is converted to Punycode.

The triangle in `▲.to` becomes `xn--c1h.to`. They are the same domain written two ways, not a redirect. Chrome may show the Punycode form in the address bar to guard against look-alike phishing domains. Safari tends to show the symbol itself.

## Does every top-level domain support it?

No. It depends on the registry that runs the TLD:

- **.com, .net, .org** and most major TLDs don't allow emoji. The current IDN standard (IDNA2008) excludes them.
- **.to** accepts a wide range of Unicode characters, which is why `▲.to` works. Some other country-code TLDs, such as `.ws`, `.fm`, `.gg` and `.la`, are also known to allow emoji.

Check with your registrar before you plan on one.

## The catch

Email is unreliable with these domains, they are hard to type, and links can break when shared. I wouldn't use one as a primary domain, but for a short link or a fun project it's cool.
