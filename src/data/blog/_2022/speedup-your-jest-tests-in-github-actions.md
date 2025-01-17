---

title: Speedup your Jest tests in GitHub Actions
slug: speedup-jest-github-actions
draft: false
pubDatetime: 2022-02-24T03:43:57.425Z
description: Learn how to speed up your jest tests in GH Actions.
tags:
  - Jest
  - GitHub
  - GitHub Action
  - Optimization
---
Recently at work, was working on optimizing the jest unit test case CI execution time for our front-end application. We are using [GitHub Action](https://github.com/features/actions) that runs on every PR raised against _master_ branch. 

### Backstory
At our current scale, it roughly takes about _~14mins_ to complete. We have this branch protection rule where the automated test cases should pass in order to be eligible for merging to _master_.

We have many developers working on this repository and on average 15+ PRs are raised per day. Also, this CI action will run every commit that is pushed to the branch after the PR is raised. 

This reduces the velocity of the developers at the same increases billing costs unnecessarily.

<div style="text-align:center">
  <img src="https://i.imgur.com/NPeTwup.png" width="600" />
</div>

In the above image, you can see we also have Jest Cache enabled. Though this reduces the time considerably still it is not enough.

### Mainstory

Asked my buddy Google and tried a couple of solutions suggested. Nothing worked!!!😔. At first glance, this appeared like this is expected as the codebase has grown large, but wanted to confirm before arriving at a conclusion as usual 😜.

Started verifying whether the optimization configurations provided by jest out of the box are working as expected one by one. Surprisingly one setting [**maxWorkers**](https://jestjs.io/docs/cli#--maxworkersnumstring) was not working as mentioned in the CI environment. As per the docs, jest will utilize all the available cores in CI env. GH Action provides 2 cores Linux machines and Jest was consuming only one!!!.

<div style="text-align:center">
 <img src="https://media1.giphy.com/media/jOyc4EahGNPb3FoNuk/giphy.gif" width="420" />
</div>


When we explicitly passed the value as 2 `--maxWorkers=2`, the time got reduced by **~6mins**.

<div style="text-align:center">
  <img src="https://i.imgur.com/IxNK8TR.png" width="600" />
</div>


Yeah! I know it is time-consuming to verify, but is really worth it since it is now 6 mins less wait for every developer working on this project for every PR push. Just do the Math!!!

<div style="text-align:center">
<img src="https://media2.giphy.com/media/QXPmPdudTz4So2P4OQ/giphy.gif" style="max-width: 400px;" />
</div>

Happy Hacking!


