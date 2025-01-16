---

title: How to keep two branches in sync on Github
slug: /blog/keep-two-branches-in-sync
draft: false
pubDatetime: 2021-04-02T13:30:00.000Z
description: Learn how to keep two branches in sync using GitHub Action
category: productivity
tags:
  - git
  - GitHub
  - GitHub Action
---
[GitHub Actions](https://github.com/features/actions) allows you to automate, customize and execute your software development workflows inside your repository. 

Let's say we have two branches `master` and `develop` in our repositories following [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) methodology. We often encounter a situation when a hotfix is merged directly to `master` then those changes has to be reverse merged to `develop` else they will not get reflected in the develop branches thereby creating an inconsistency.

We can set up a workflow using GitHub Actions to keep two branches in sync. To do so, we only need repositories enabled with GitHub Action workflows.

At the time of write, GitHub Actions are free for public repositories and have a limit of 2000 mins for a free account.

Let’s get into action,
* Create a hidden folder `.github` (*dot GitHub*) at the root of the repository. 
* Now create a `workflows` folder under `.github`. This holds all the action workflows configured for the repository.

<div style="text-align:center">
  <img src="https://i.imgur.com/Ri53Des.png" width="600" />
</div>

* Create the following `sync-develop.yml` inside workflows folder.

```yaml
name: Sync Back to Develop

on:
  push:
    branches:
      - master

jobs:
  sync-branches:
    runs-on: ubuntu-latest
    name: Syncing branches
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Set up Node
        uses: actions/setup-node@v1
        with:
          node-version: 12
      - name: Opening pull request
        id: pull
        uses: tretuna/sync-branches@1.2.0
        with:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
          FROM_BRANCH: 'master'
          TO_BRANCH: 'develop'
```

Here we are creating a *Sync Back to Develop* workflow that runs the `sync-branches` job when changes are pushed to `master` remote branch. We won't be getting into details about the configuration file as this beyond our article's scope. To learn more, you can get started with the [official docs](https://docs.github.com/en/actions).

We are making use of [tretuna/sync-branches](https://github.com/marketplace/actions/sync-branches) action. This action provides options which allows to configure the branch names and details of the PR raised.

 * All set. Let's save these changes and push them to remote `master` branch. Now we can see the action getting triggered under the `Actions` tab of GitHub GUI.

<div style="text-align:center">
  <img src="https://i.imgur.com/q7LAtmH.png" width="600" />
</div>


* This tiny workflow might run for 1-2 mins. Once done, you can see a PR being raised against `develop`. You can manually merge this PR or have another action [Auto Merge PR](https://github.com/pascalgn/automerge-action) to automatically merge this.

<div style="text-align:center">
  <img src="https://i.imgur.com/xDytrBp.png" width="600" />
</div>

Crazy Stuff. Now bots can raise PR and merge one based on conditions without manual intervention. 

<div style="text-align:center">
<img src="https://media.giphy.com/media/eaECZB7V6GACc/giphy.gif"  width="300" />
</div>

We have now successfully automated the workflow. We have merely touched the surface, we can do more with GitHub Actions. Sky is the limit for ideas.

Happy Solving!.

### Reference
* [GitHub Actions](https://docs.github.com/en/actions)