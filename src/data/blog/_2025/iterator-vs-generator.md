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

| Aspect         | **Iterator** | **Generator** |
|----------------|--------------|----------------|
| **Definition** | Any object that implements the iterator protocol (`__iter__()` and `__next__()` in Python, or `.next()` in JavaScript). | A special type of iterator that **yields** values using `yield` or `yield*`, often created with less boilerplate. |
| **Creation**   | Manually implemented by defining a class (Python) or an object with `.next()` (JavaScript). | Automatically created when a function contains `yield`. |
| **Syntax**     | Verbose, needs boilerplate code. | Concise and easy to write. |
| **Memory**     | Can be optimized if implemented carefully. | Always lazy (values are produced one at a time, on demand). |
| **Use Case**   | When you need more control over the iteration protocol. | When you want to produce a sequence lazily with simpler syntax. |
| **Example**    | `iter([1, 2, 3])`, or custom classes implementing `__next__()` | Functions using `yield` like `range()` or custom generator functions |

---

## 🐍 Python Example

### ✅ Iterator (Manual)

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

### ✅ Generator (Simpler!)

```python
def my_generator(limit):
    for i in range(limit):
        yield i

for val in my_generator(3):
    print(val)  # 0 1 2
```

---

## 🌐 JavaScript Example

### ✅ Iterator (Manual)

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

### ✅ Generator

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

| Feature           | **Iterator**                     | **Generator**                     |
|------------------|----------------------------------|----------------------------------|
| How it's made     | Manually via class or object     | Automatically via `function*` or `yield` |
| Verbosity         | More code                        | Less code                         |
| Use cases         | Custom iteration logic           | Simple, lazy sequence generation  |
| Is lazy?          | Can be                           | Always lazy                       |

---

🧠 **Rule of Thumb**:  
Use **generators** when you want quick, lazy iteration.  
Use **iterators** when you need more control or are implementing custom container types.