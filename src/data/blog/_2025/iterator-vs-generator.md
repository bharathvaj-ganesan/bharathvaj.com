---
title: Iterator vs Generator — What’s the Difference?
slug: iterator-vs-generator
draft: false
pubDatetime: 2025-04-30T01:00:00.000Z
description: A practical guide to understanding the difference between iterators and generators in Python and JavaScript, with real-world examples and use cases.
tags:
  - Javascript
  - Python
  - Performance
---

Iterators and generators are closely related and often used together, they are not the same. Let’s break it down clearly.

## 🔁 **Iterator**

An **iterator** is an object that defines a sequence and potentially a return value upon completion. It must implement a `next()` method that returns an object with `value` and `done` properties.

Use **iterators** when:
- You want **fine-grained control** over iteration.
- You are implementing **custom data structures** (e.g., trees, graphs) that need to conform to the iterable protocol.
- You want to **manually manage** the state of iteration.

### **Example**
```js
function createIterator(arr) {
  let index = 0;
  return {
    next: function () {
      if (index < arr.length) {
        return { value: arr[index++], done: false };
      } else {
        return { done: true };
      }
    }
  };
}

const it = createIterator([10, 20, 30]);
console.log(it.next()); // { value: 10, done: false }
console.log(it.next()); // { value: 20, done: false }
console.log(it.next()); // { value: 30, done: false }
console.log(it.next()); // { done: true }
```

---

## ⚙️ **Generator**

A **generator** is a special function using `function*` syntax that can pause and resume execution using the `yield` keyword.

Use **generators** when:
- You need **lazy evaluation** or infinite sequences.
- You want to create **iterators more simply**.
- You need to **pause and resume** logic (like co-routines).
- You're working with **asynchronous flows** (using `async generators` with `for await`).

### **Example**
```js
function* numberGenerator() {
  yield 10;
  yield 20;
  yield 30;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 10, done: false }
console.log(gen.next()); // { value: 20, done: false }
console.log(gen.next()); // { value: 30, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

---

## 🆚 Key Differences

| Feature               | Iterator                                  | Generator                                 |
|-----------------------|-------------------------------------------|-------------------------------------------|
| Syntax                | Manual object with `next()`               | Uses `function*` and `yield`              |
| Code Complexity       | More verbose                              | Concise and readable                      |
| State Management      | Manual                                     | Automatically managed                     |
| Reusability           | Custom setup needed                       | Can be reused easily                      |
| Use in Loops          | Harder, manual loop                       | Works with `for...of` out of the box      |
| Lazy Evaluation       | Yes, but manually                         | Yes, naturally supported                  |
| Pause/Resume logic    | No                                         | Yes, with `yield`                         |
| Async Support         | No (without Promises)                     | Yes, via `async function*`                |

---

## Examples

### 🐍 Python Example

#### Iterator

```python
class MyIterator:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.limit:
            raise StopIteration
        val = self.current
        self.current += 1
        return val

it = MyIterator(3)
for val in it:
    print(val)  # 0 1 2
```

#### Generator

```python
def my_generator(limit):
    for i in range(limit):
        yield i

for val in my_generator(3):
    print(val)  # 0 1 2
```

---

### 🌐 JavaScript Example

#### Iterator (Manual)

```js
const myIterator = {
  current: 0,
  limit: 3,
  [Symbol.iterator]() {
    return {
      current: this.current,
      limit: this.limit,
      next() {
        if (this.current < this.limit) {
          return { value: this.current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const item of myIterator) {
  console.log(item);
}
```

#### Generator

```js
function* myGenerator(limit) {
  for (let i = 0; i < limit; i++) {
    yield i;
  }
}

for (const val of myGenerator(3)) {
  console.log(val); // 0 1 2
}
```

You can also have async generator but you need to await the iterator.

```js
async function* myGenerator(limit) {
  for (let i = 0; i < limit; i++) {
    yield i;
  }
}

for await (const val of myGenerator(3)) {
  console.log(val); // 0 1 2
}
```

---

## ✅ Summary

- Use **generators** when you want a simpler, more powerful way to create iterators or need to pause/resume execution. When performance optimization is needed.
- Use **iterators** when you want **custom control** over how iteration works or need to implement the **iterator protocol** manually.