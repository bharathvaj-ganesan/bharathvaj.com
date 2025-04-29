---
title: EventSource vs Async Generator - What to Use for LLM Streaming?
slug: eventsource-vs-async-generator
draft: false
pubDatetime: 2025-04-24T03:00:00.000Z
description: Compare EventSource and fetch-based async generators for handling SSE and LLM streaming responses. Learn when to use each approach.
tags:
  - sse
  - javascript
---

When it comes to consuming streaming responses in the browser, especially from Server-Sent Events (SSE), two main approaches emerge:

- Using the native `EventSource` API
- Using `fetch` with an **async generator** to manually parse the stream

Let’s break down the differences and when to use each.

---

## 🔁 Quick Comparison

| Feature | `EventSource` | `fetch` + Async Generator |
|---------|----------------|-----------------------------|
| HTTP Method | **GET only** | ✅ Supports POST, PUT |
| Custom Headers | ❌ Limited | ✅ Full control |
| Streaming Support | ✅ Yes | ✅ Yes |
| LLM API Friendly | ❌ No | ✅ Yes |
| Reconnection | ✅ Auto | ❌ Manual |
| Binary Support | ❌ No | ✅ Yes |
| Browser Support | ✅ | ✅ (modern browsers) |
| Node.js Use | ❌ | ✅ (with polyfills) |

---

## 🧠 When to Use What?

### ✅ Use `EventSource` if:
- Your server supports only **GET-based SSE**
- You need **auto-reconnect**
- You’re building a **simple real-time dashboard**

```js
const es = new EventSource('/events');
es.onmessage = (e) => console.log(e.data);
```

### ✅ Use `fetch` + async generator if:
- You're working with **LLM APIs** that require **POST** or **auth headers**
- You want fine-grained control over **stream parsing**

```js
async function* streamSSE(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Incomplete line

    for (const line of lines) {
      if (line.startsWith('data: ')) yield line.slice(6);
    }
  }
}
```

---

## 🔚 Summary

| Use Case | Best Approach |
|----------|---------------|
| Authenticated LLM streaming | `fetch` + async generator |
| Lightweight real-time updates | `EventSource` |