---

title: ' How to use SSL with Vue CLI for local development'
slug: use-ssl-with-vue-cli-locally
draft: false
pubDatetime: 2020-10-03T16:00:21.780Z
description: Learn how to serve a local VueJS app via HTTPS. In this article, we
  will be setting up HTTPS in development for our app with our SSL certificate.
category: snippets
tags:
  - vue
  - vue-cli
  - ssl
  - https
---

Usually in local development environment the vue app is served via `http` protocol. But in production environment it is served via `https`. Running the local server in `https` might be needed if you consume API that is forced to be consumed only by the app served via HTTPS.

In this guide, we will be setting up HTTPS in our development environment for our vue app with our own SSL certificate.

### Vue CLI

The most common way to scaffold a vue project is via its [vue-cli](https://cli.vuejs.org/guide/) tooling and running following commands

```
npm install -g @vue/cli
vue create hello-world
cd hello-world
npm run serve
```

The app runs locally at `http://localhost:8080`

![Vue Default](/media/vue-default.jpg)

Now we want the app to be served via `https`. We can do this easily by setting up our own SSL certificate in development for `localhost` using [mkcert](https://mkcert.org/)

### Step 1: Creating an SSL Certificate

To create a valid SSL certificate easily we make use of mkcert tool. Run the following commands to obtain a certificate.

```
brew install mkcert

mkcert -install
```

Now we have successfully created Certificate Authority (CA) on our machine which enables us to generate certificates for all of our future projects.

From the root of our hello-world project, run the following commands,

```
mkdir -p .certs

mkcert -key-file ./.certs/key.pem -cert-file ./.certs/cert.pem "localhost"

```

Now we have a `.certs` folder with key and cert files inside it.

_Please, make sure to add this folder to `.gitignore` so that we don't accidently commit these files to version control._

### Step 2: Adding HTTP to vue config file

Vue CLI allows us to configure it via config file as follows

```js
const fs = require('fs');

module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: {
      key: fs.readFileSync('.certs/key.pem'),
      cert: fs.readFileSync('.certs/cert.pem'),
    },
    hotOnly: false,
  },
};
```

Here we are pointing to CLI where our certificate file is by simply passing an object with a key and cert to devServer's https config.

We are almost at the end of the process. Let's restart the server again. Voila, now our app is served via `https`.

![Vue Default](/media/vue-default-https.jpg)

<img src="https://media.giphy.com/media/JqDeI2yjpSRgdh35oe/giphy.gif" />

Happy solving!

## Reference

- [Vue config.js Doc](https://cli.vuejs.org/config/#vue-config-js)
- [Stackoverflow Question](https://stackoverflow.com/questions/45807049/how-to-run-vue-js-dev-serve-with-https/50123119)
