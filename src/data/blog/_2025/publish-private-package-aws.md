---
title: Easily Publish Private Packages to AWS CodeArtifact via GitHub Actions Workflow
slug: publish-private-package-aws
draft: false
pubDatetime: 2025-04-16T01:10:00.000Z
description: A concise guide to configure AWS credentials and automate publishing Node.js packages to AWS CodeArtifact using GitHub Actions.
tags:
  - aws
  - github-actions
  - codeartifact
---

You can seamlessly publish private packages to AWS CodeArtifact using GitHub Actions. This guide walks you through:

- **Phase 1**: AWS Console setup
- **Phase 2**: GitHub Actions workflow to publish

I’ve used the npm package for Node.js as an example in this article. This can be easily applied to other registries as well.

## ⚙️ Phase 1: Set Up AWS CodeArtifact (One-time setup)

### 1. Create a CodeArtifact Domain & Repository

1. Go to [AWS CodeArtifact Console](https://console.aws.amazon.com/codeartifact).
2. Create a **Domain** (e.g., `netflix`).
3. Inside that domain, create a **Repository** (e.g., `netflix-dev` or `netflix-prod`). You can also create one for dev and prod.

### 2. Create an IAM Role for GitHub OIDC

Refer [my previous blog](/posts/create-iam-role-with-github-web-identity-provider/) on how to setup the base IAM role. Then, attach the following policies:
   - `AWSCodeArtifactAdminAccess` (or scoped-down custom policy)
   - `sts:AssumeRoleWithWebIdentity`

---

## 🤖 Phase 2: GitHub Actions Workflow

Here's the minimal setup required to authenticate and publish your package.

### 🔐 1. Set AWS Credentials action step

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::<account-id>:role/<role-name>
    role-duration-seconds: 3600
    aws-region: us-east-1
    role-session-name: github-actions-codeartifact
```

### 🔑 2. Setup AWS CodeArtifact & `.npmrc`

This step creates a ⁠.npmrc file at the project root. Alternatively, you can create one at the home root by naming it ⁠~/.npmrc.

```yaml
- name: Setup AWS CodeArtifact
  run: |
    export CODEARTIFACT_AUTH_TOKEN=$(aws codeartifact get-authorization-token \
      --domain cb-artifactory \
      --domain-owner <account-id> \
      --query authorizationToken \
      --output text)

    export ARTIFACTORY_PUBLISH_URL=https://cb-artifactory-<account-id>.d.codeartifact.us-east-1.amazonaws.com/npm/<repository>
    
    echo "registry=$ARTIFACTORY_PUBLISH_URL/" > .npmrc
    echo "//$(echo $ARTIFACTORY_PUBLISH_URL | sed 's|https://||')/:_authToken=$CODEARTIFACT_AUTH_TOKEN" >> .npmrc
```

### 🚀 3. Publish Package

Finally, publish the package. Nothing fancy.

```yaml
- name: Publish SDK
  run: npm publish
```

Setting up a root registry file, such as an npmrc, will change the publish command for other registries. 

You can view the complete GitHub Action workflow here: [👉 GitHub Action Workflow Gist](https://gist.github.com/bharathvaj-ganesan/f27fab1a7b80d88366cc93f000f07c82)