---

title: Adding type safety to environment variables in NextJS
slug: environment-variables-nextjs
draft: false
pubDatetime: 2023-02-05T02:58:08.065Z
description: Learn how to setup env variable validations in NextJS
tags:
  - Nextjs
  - Webhooks
  - System Design
---

I have been working with Next.js for sometime, but we used to find hard time with environment variables mainly when getting started to contribute to existing projects.

Projects usually have `.env.example` file that helps contributors in setting up the project in local environment where we might be creating `.env.local` file based on the example env. Reason for this is that `.env.local` will be not be tracked in git version control because it might contain sensitive data.

Challenges that one might encounter,

- Unclear Runtime errors because env variables required are not set.
- Unclear compile time errors because env variables required are not set.
- Unexpected behaviour in the application because required variable for local env is not set
  ....
  ....

and the list grows...

These challenges are not limited to local, even while deploying to a remote environment like [Vercel](https://vercel.com/) these env variables when not set will cause run time error but ideally this would have been better if are caught during build time itself.

Validating environment variables is an important step in the development process of any application. Environment variables are used to store sensitive information such as API keys and passwords that should not be stored directly in the codebase. It's essential to validate these variables to ensure that the application is secure and functions correctly.

We can use the [Zod](https://zod.dev/) library to validate environment variables. Zod is a powerful, fast and lightweight JavaScript library for validating and transforming data. It supports many data types, including strings, numbers, arrays, objects, and even custom data types.

Here is a step-by-step guide on how to validate environment variables using Zod in a Next.js application:

### 1. Install Zod:

In your Next.js application, run the following command to install Zod:

```
npm install zod
```

### 2. Create a schema for your environment variables:

Zod allows you to create a schema for your environment variables, which defines the structure and types of variables that you expect. Here's an example of a schema for a few environment variables:

```js
const zod = require('zod');

const envSchema = zod.object({
  API_KEY: zod.string().required(),
  API_SECRET: zod.string().required(),
  PORT: zod.number().integer().required(),
});
```

### 3. Validate environment variables:

`.parse` method of Zod will parse the object and validates against the `envSchema`.

```js
// You can't destruct `process.env` as a regular object, so you have to do it manually here.
export const env = envSchema.parse({
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  PORT: process.env.PORT,
});
```

Finally, you have to run the above ones when Next.js builds the application. You can create a file called `env.js` and have the above scripts within it, so that we can easily run them just by importing to `next.config.js` as shown below

```js
// next.config.js
import './src/env.js';

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
};
```

Whenever Next.js builds it will consume `next.config.js` configuration file and this file be executed at build time and validation happens.

### BONUS: Consume environment variables:

You can also easily consume the env variables with better typing support.

```js
import { env } from './env';

// Example
lib.init({
  API_KEY: env.API_KEY,
  API_SECRET: env.API_SECRET,
});
```

[T3 stack](https://create.t3.gg/) template handles this out of the box for you. Please do check that out. You can also handle client and server environment variables separately for fine grain control so that your server secrets doesn't expose to client.

```js
const zod = require('zod');

const clientSchema = Zod
  .object
  // your client schema goes here
  ();
export const clientEnv = clientSchema({});

const serverSchema = Zod
  .object
  // your server schema goes here
  ();
export const serverEnv = serverSchema({});
```

Happy managing environment variables.

### References

- [T3 Stack](https://create.t3.gg/en/usage/env-variables)
