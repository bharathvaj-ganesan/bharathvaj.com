---
title: My Experience with Next.js Why It's Bad (And Getting Worse)
slug: my-experience-with-nextjs
draft: false
pubDatetime: 2025-04-12T04:00:00.000Z
description: Why I'm stepping away from Next.js — and what you need to know about the middleware vulnerability.
tags:
  - nextjs
  - Javascript
  - react
  - developer-experience
---

For the longest time (since 2021), Next.js has been my go-to framework for working with React. It’s been my default choice, and for good reason, since ~~has~~ had,

✅ Great performance  
✅ SEO-friendly  
✅ Dev tools and integrations galore  
✅ Vercel made deployment a breeze  

But over time, things started to feel… off. And recently, downright frustrating.

Here’s my personal experience with Next.js — what started as admiration gradually turned into a checklist of red flags.

---

## 1. Ever Changing Principle

Next.js has become increasingly difficult to rely on due to its constantly shifting direction. It started as a champion of Jamstack and static site generation, but over time, pivoted toward serverless architecture and heavily promotes server-side rendering (SSR). Now, they’re moving away from serverless again in favor of microVMs.

These changes contradict its original philosophy and result in frequent shifts to the framework’s core foundations—forcing developers to constantly relearn and adapt.

## 2. From Simple to Spaceship 🚀 (Overengineering, Anyone?)

Next.js used to be simple. Then came the avalanche:

- App Router  
- Edge Functions  
- Middleware  
- React Server Components (RSCs)  
- Static + Dynamic + Hybrid + Incremental exports  

Each release promised more power — but also more complexity. It became easy to make mistakes.

Every time a major release comes out, my first thought is ‘what will they break this time?’ Although I appreciate the efforts to improve developer experience and application performance, it’s frustrating that these updates often end up breaking existing functionality, causing more problems than they solve.

Not building product. Not shipping value. Every project really felt like launching a spaceship.

---

## 3. Performance That Gaslights You ⚡️

Next.js markets itself on performance. But ironically, I often ran into **performance bottlenecks** that felt avoidable:

- Cold starts with serverless functions  
- Overhead from the App Router and RSC  
- Static site generation that isn’t really static anymore  

Even simple pages felt bloated. In my dev environment, pages take time to render when they are SSR/SSG. Connecting with database is a nightmare. You definitely need a serverless DB to connect even if you are running NextJS as traditional node server in Docker.


And when I saw Northflank — a company that handles tons of requests —[ write a post on why they ditched Next.js for performance reasons](https://northflank.com/blog/why-we-ditched-next-js-and-never-looked-back), it all clicked.

---

## 4. Security Nightmare 🔥

Here’s where it gets ugly.

**On March 24th, 2025**, the biggest **Next.js vulnerability ever** was disclosed — a **Critical 9.1 security advisory**. It allowed attackers to **bypass authentication and authorization** logic written in middleware.

> Yes, that means you could literally skip paywalls or protected dashboards with a simple header injection.

Why? Because Vercel's middleware security logic had a flaw. You could use the `x-middleware-subrequest` header to spoof access to **any route**, skipping important checks — *as long as you knew the middleware name*. Which, thanks to naming conventions, wasn’t hard.

What’s worse?

- The bug was reported on **Feb 27**
- It wasn’t patched until **March 18**
- That’s **~3 weeks of production risk** for SaaS apps using Next.js middleware

Meanwhile, drama exploded on Twitter. Cloudflare tried to block the exploit with a firewall rule, which backfired and broke Supabase logins. Then Cloudflare’s CEO and Vercel’s CEO started a meme war.

What a time to be alive.

---

## 5. Vendor Lock-In With Vercel 🧠🔒

Some features only work properly on Vercel, and migrating out is painful, if you try to self host.

While technically possible to self host for common apps but this is very hard to operate in any real-world production environment where a single instance isn’t sufficient.

The setup needs to be able to dynamically scale up very quickly in order to handle sudden bursts of traffic, while at the same time being able to scale down to zero in order to be cost-effective.

If you ever decide to move your infra to AWS or DigitalOcean?

- You lose edge function performance  
- You might need to rewrite your routing/middleware logic  
- You hit all sorts of unexpected behavior  

A framework should help you scale, not trap you in. And yet, more and more developers are asking:

---

## 5. Community Burnout and Framework Fatigue 😮‍💨

[Reddit](https://www.reddit.com/r/nextjs/comments/1fjluh2/we_are_finally_moved_out_of_nextjs/) is full of frustrated devs sharing how:

- Dev server is slower  
- Upgrades keep breaking things  
- The documentation can’t keep up with the changes  

It feels like we’re spending more time learning *how* to build with Next.js, than actually building.

---

## My Call: I'm Taking a Break from Next.js

After the recent security mess, the bloated dev experience, and the complexity creep, I’m stepping away from Next.js for now.

If you’re still using it, I recommend:

1. Upgrade your version *now* if you use middleware  
2. Evaluate if your project really needs all the features  
3. Consider simpler frameworks for smaller apps.
4. Don’t follow the trend. Focus on the problem statement and identify what will help you solve it. A framework should enable you to build faster and maintain it, allowing you to focus on building the business layer and not worry about the framework itself.

Credits: [Fireship](https://www.youtube.com/watch?v=AaCnBOqyvIM)
