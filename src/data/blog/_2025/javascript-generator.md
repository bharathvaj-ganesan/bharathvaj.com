---
title: How does generator functions in JavaScript works?
slug: javascript-generator-state
draft: false
pubDatetime: 2025-04-27T10:00:00.000Z
description: Generator functions in JavaScript pause and resume execution while maintaining internal state. This post explores how they work and what happens when you add the async keyword in simple terms.
tags:
  - javascript
  - generators
  - sse
---

Ever wondered how `function*` in JavaScript actually works? Or what happens when you mix in `async`? Let’s explore generator functions, how they maintain state, and how they play with the `async` keyword.

## 🌀 What is a Generator Function?

A generator function is defined with `function*` and uses the `yield` keyword to pause execution. When you call it, it returns an **iterator** that lets you step through its execution.

```js
function* countUp() {
  yield 1;
  yield 2;
  yield 3;
}

const counter = countUp();
console.log(counter.next().value); // 1
console.log(counter.next().value); // 2
console.log(counter.next().value); // 3
```

Each time you call `.next()`, the generator resumes from where it left off. This means it **remembers local variables and state** between calls. Pretty neat, right?

---

## 🧠 How is State Maintained?

Check this out:

```js
function* counter() {
  let x = 10;
  yield x;
  x++;
  yield x;
}

const gen = counter();
console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
```

Even though we paused execution with `yield`, the variable `x` persisted. That’s the magic — the generator keeps its own execution context.

---

## ⚡ What About `async`?

You can’t do `async function*` and expect it to behave like a regular `function*`. But you **can** use `async function*` to create an **asynchronous generator**.

This lets you both `await` and `yield`, which is useful when working with streams or network requests.

```js
async function* fetchData() {
  const res1 = await fetch('/api/data1');
  yield await res1.json();

  const res2 = await fetch('/api/data2');
  yield await res2.json();
}
```

You’d consume it like this:

```js
(async () => {
  for await (const item of fetchData()) {
    console.log(item);
  }
})();
```

Yup, **`for await...of`** is how you loop over values from an async generator.

---

## ⏳ Async Generators Maintain State Too

They don’t just pause at `yield`, they also wait for promises to resolve. Here’s a basic countdown:

```js
async function* countdown() {
  let i = 3;
  while (i > 0) {
    await new Promise(r => setTimeout(r, 1000)); // wait 1 sec
    yield i--;
  }
}

(async () => {
  for await (const num of countdown()) {
    console.log(num); // 3, 2, 1 (with 1 sec between)
  }
})();
```

The function keeps track of `i` and where it left off — just like a regular generator, but asynchronous.

---

## 🚀 Wrap-up

So yes, generator functions **do maintain state**, and async generators take it a step further by waiting on promises too. They're incredibly useful when dealing with streams, pagination, or chunked APIs.

Next time you see a `function*` or `async function*`, remember: you’re working with mini state machines that can pause, resume, and even wait on the network. This greatly helps in streaming responses from LLM. Checkout my [other blog](https://bharathvaj.com/posts/async-generator-sse/) on how generator works with SSE.

## References

- [Generator Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)
- [Async Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function*)

Happy generating!


