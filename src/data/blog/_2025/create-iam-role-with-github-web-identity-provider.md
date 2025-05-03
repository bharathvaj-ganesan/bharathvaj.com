---
title: Creating an AWS IAM Role with GitHub as a Web Identity Provider
slug: create-iam-role-with-github-web-identity-provider
draft: false
pubDatetime: 2025-04-15T04:00:00.000Z
description: Learn how to create an IAM role that allows GitHub Actions to authenticate using OIDC as a Web Identity Provider in AWS IAM.
tags:
  - AWS
  - GitHub Actions
  - IAM
---

To enable your GitHub Actions workflows to securely interact with AWS services, you can set up OIDC (OpenID Connect) authentication. By configuring GitHub as a Web Identity Provider, you can create an IAM role that GitHub Actions can assume without needing AWS credentials. Here's how you can set this up.


### Step 1: Sign in to AWS Management Console
   - Go to the [AWS IAM Console](https://console.aws.amazon.com/iam/).
   - Make sure you have the necessary permissions to manage IAM resources.

### Step 2: Navigate to Identity Providers
   - In the left sidebar, click on **Identity providers** under **Access management**.

### Step 3: Add a New Identity Provider
   - Click on the **Add provider** button.
   - Select **OpenID Connect** for the provider type.
   - **Web Identity Provider URL**: Enter `https://token.actions.githubusercontent.com`.
   - **Audience**: Enter `sts.amazonaws.com`.

### Step 4: Create an IAM Role for GitHub Actions
   - After configuring the identity provider, create a new **IAM Role**.
   - Go to the **Roles** section and click **Create role**.
   - Select **Web Identity** as the trusted entity type.
   - Under **Identity provider**, select the GitHub identity provider you just created.
   - For **Audience**, enter `sts.amazonaws.com`.
   - You can mention the Github Org name and repository name for fine gain access control.

### Step 4: Define the Trust Relationship for the Role
   - GitHub Actions workflows will assume this role using the trust policy. Here's an example of the trust policy you can use:

Here’s an example trust policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Principal": {
                "Federated": "arn:aws:iam::<account-id>:oidc-provider/token.actions.githubusercontent.com"
            },
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": [
                        "sts.amazonaws.com"
                    ]
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": [
                        "repo:<owner>/<repo>"
                    ]
                }
            }
        }
    ]
}
```

- Replace `<account-id>` with your AWS account ID.
- Replace `<owner>` and `<repo>` with your GitHub repository's owner and name.

### Step 5: Attach Permissions to the IAM Role
   - Add the necessary permissions for the role. These permissions define what resources the GitHub Actions workflow can access (e.g., deploy code, interact with AWS services).

### Step 6: Review and Create the Role
   - Review your settings, and click **Create role**. The IAM role is now ready to be used by your GitHub Actions workflows.

### Step 7: Configure GitHub Actions Workflow
   - In your GitHub Actions workflow file (`.github/workflows/your-workflow.yml`), add a step to configure AWS credentials using the role you've created.

Here's an example of the step to configure AWS credentials:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::<account-id>:role/<role-name>
    role-duration-seconds: 3600
    aws-region: <aws-region>
```

### Conclusion
Now your GitHub Actions workflow can securely interact with AWS services using OIDC authentication, eliminating the need for static access keys. By following these steps, you'll enhance security and streamline the process of automating deployments and other tasks.

Happy provisioning! 