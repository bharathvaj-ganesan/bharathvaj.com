---
title: How Async Generators Work with SSE in JavaScript
slug: async-generator-sse
draft: false
pubDatetime: 2025-04-25T02:05:00.000Z
description: Explore how async generators handle Server-Sent Events (SSE) and power real-time streaming in JavaScript, especially for LLMs.
tags:
  - javascript
  - sse
---

Async generators in JavaScript provide an elegant way to handle **Server-Sent Events (SSE)**—especially when dealing with token-by-token or chunked data streams from LLMs.

Let’s explore how they help you handle real-time streaming with ease.

---

## 🎥 What is SSE?

[**SSE (Server-Sent Events)**](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) lets the server push text messages to the browser over a single HTTP connection. Each message looks like:

```
data: Hello

data: world!
```

SSE is great for:
- Real-time logs
- Chat apps
- Streaming LLM responses

---

## 🔄 Enter Async Generators

An `async function*` lets you:
- Read from a stream incrementally
- Use `await` while iterating
- Yield chunks as soon as they arrive

---

## ✨ Example: Consuming SSE with Async Generator

```js
async function* parseSSE(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        yield line.slice(6);
      }
    }
  }
}
```

Usage:

```js
const response = await fetch('/api/stream', {
  method: 'POST',
  headers: { Accept: 'text/event-stream' }
});

for await (const chunk of parseSSE(response.body)) {
  console.log('Chunk:', chunk);
}
```

---

## 🚀 Benefits

- ✅ Clean syntax with `for await...of`
- ✅ Supports POST & headers (good for LLMs)
- ✅ Works in Node.js (with fetch polyfill)
- ✅ Custom parsing logic

---

## 🔚 Summary

Async generators give you **streaming superpowers** with SSE:
- Handle LLM output in real-time
- Decode and react to each message chunk
- Maintain control over request method, headers, and stream parsing

> Perfect for modern AI-powered apps using LLM APIs that stream!
