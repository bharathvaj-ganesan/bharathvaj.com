---
title: Understanding the Relation Between FastAPI and Uvicorn
slug: relation-between-fastapi-and-uvicorn
draft: false
pubDatetime: 2025-04-28T04:00:00.000Z
description: A quick guide to understanding how FastAPI and Uvicorn work together to build and serve modern async web applications.
tags:
  - fastapi
  - python
---

If you're coming from a JavaScript ecosystem (like I did) and are trying to develop apps in Python, you’ll likely find yourself comparing the components to better understand how they map across. Well, I’ve done that comparison for you — thank me later!

Let’s first take a look at the Python components and see how they compare to their JavaScript counterparts.

[FastAPI](https://fastapi.tiangolo.com/) and [Uvicorn](https://www.uvicorn.org/) are two essential building blocks when developing high-performance Python APIs.

- **FastAPI** is the **web framework**. It helps you define routes, handle requests, perform validation, and build APIs easily. It follows the **ASGI** (Asynchronous Server Gateway Interface) standard.

- **Uvicorn** is the **ASGI server**. It is responsible for running your FastAPI app, handling incoming HTTP connections, and managing the event loop efficiently.

To illustrate this, think of **FastAPI as the chef** preparing the food (your API responses), and **Uvicorn as the waiter** delivering that food to the customer (handling requests and responses).


In simple terms:  
> **FastAPI** builds the application,  
> **Uvicorn** serves it to the world.

You develop your API with FastAPI, then use Uvicorn to launch it like this:

```bash
uvicorn main:app --reload
```

Here, main is your Python file, and app is your FastAPI instance. Together, FastAPI and Uvicorn enable you to build modern, fast, and scalable Python APIs with minimal effort.

## Comparison

| **Aspect**                | **FastAPI + Uvicorn**                              | **Node.js Ecosystem (Express.js/Fastify)**        |
|---------------------------|----------------------------------------------------|---------------------------------------------------|
| **Framework**              | FastAPI (Python web framework)                    | Express.js, Fastify (JavaScript frameworks)       |
| **Server**                 | Uvicorn (ASGI server)                             | Node.js HTTP server (Express.js, Fastify)         |
| **Asynchronous Support**   | Natively asynchronous (async/await)               | Natively asynchronous (async/await, Promises)     |
| **Performance**            | High performance, handles many concurrent requests | High performance with event-driven architecture   |
| **Serving the App**        | `uvicorn main:app --reload`                       | `node server.js`                                  |
| **Use Case**               | Ideal for high-performance, async I/O-bound APIs  | Ideal for handling many concurrent connections    |
| **Chef/Waiter Analogy**    | FastAPI is the chef, Uvicorn is the waiter        | Express/Fastify is the chef, Node.js is the waiter|

