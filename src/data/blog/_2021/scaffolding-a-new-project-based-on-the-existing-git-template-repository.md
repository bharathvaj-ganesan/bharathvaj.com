---

title: Scaffolding a new project based on the existing git template repository
slug: scaffolding-new-project-using-template
draft: false
pubDatetime: 2021-03-06T00:55:18.990Z
description: Learn how to scaffold new project using git template repository.
category: productivity
tags:
  - git
  - npm
  - github
  - npx
---

As a developer in this open-source era, we often try to explore libraries/frameworks/project codebases and mostly starter template for kick starting personal projects. The most common way is to clone the repository using the *git clone* CLI command.

![Vite GitHub](/media/vite.png)

But cloning a repository will download its entire git history with all the branch details which are not needed and it takes time to clone it as well.

So how can we quickly download a GitHub repository?

Well, there are a couple of ways we can do it,

1. **Download as a zip file via GUI**

The easiest way from GUI. The zip file will be downloaded without git version control. We can then unzip and start working on it. 

Here we won't be able to download specific folders.

2. **git clone --depth 1**

With this method, we will be cloning the repository with only the last commit. This will be faster than the clone command without any args. Let's say if we are cloning a project template we don't want the template's git history or certain files like license, etc. 

It would be inconvenient for us to do re-init git and reset origin remote pointer and mostly we are likely to forget doing those due to the project's excitement.

3. **Via degit**

[degit](<https://github.com/Rich-Harris/degit>) is a cooler way of cloning a project from a remote repository if you are a keyboard user. It majorly supports Github/GitLab/BitBucket/Sourcehut.

We can globally install or run the commands using [npx](<https://nodejs.dev/learn/the-npx-nodejs-package-runner>).

```
npm install degit -g
```

To create a new folder for the project.

```
degit user/repo my-new-project

// eg. npx degit sveltejs/template svelte-app
```

By default *master* branch will be cloned. We can even clone based on a tag, branch, or a commit

```
npx degit user/repo#dev # branch

npx degit user/repo#v1.2.3 # release tag

npx degit user/repo#1234abcd # commit hash
```

Here comes the coolest part, we can clone only a specific folder instead of downloading the entire repository 🤩

```
npx degit user/repo/subdirectory

// eg. npx degit sveltejs/template/src

// This will download only the src folder
```

It also provides additional features like executing post scripts that helps us to run commands like 
*npm install*.

*How this is different from the 2nd solution?*
Author's [Rich Harris](<https://github.com/Rich-Harris>) Reply [here](<https://github.com/Rich-Harris/degit#wait-isnt-this-just-git-clone---depth-1>)

Alternative - [zel](<https://github.com/vutran/zel>)

Happy solving!

## Reference

* [Zel](https://github.com/vutran/zel)

* [npx](https://nodejs.dev/learn/the-npx-nodejs-package-runner)

* [GitHub Clone](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)
