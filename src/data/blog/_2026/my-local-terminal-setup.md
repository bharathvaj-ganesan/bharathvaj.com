---
title: "A local terminal setup that just works"
pubDatetime: 2026-11-11T00:00:00Z
type: tutorial
tags:
  - developer-experience
  - terminal
  - macos
description: My macOS terminal setup (zsh, Starship, fzf, zoxide and tmux) in one repo. It installs with one command, keeps secrets out of git, and checks itself.
---

Every few years I get a new Mac, and every time I lose an afternoon trying to remember what made my terminal feel right. Which plugin gave me the grey ghost text? Where did that `PATH` line come from?

So I put the whole thing in a repo: [my-local-setup](https://github.com/bharathvaj-ganesan/my-local-setup). It's plain shell scripts and dotfiles. There is no framework and no hidden state.

The stack is **zsh + oh-my-zsh + Starship + fzf + zoxide + tmux**.

## What's in the repo

```
my-local-setup/
├── install.sh                  # recreate the setup on a Mac
├── verify.sh                   # check everything is installed and healthy
├── config/
│   ├── zsh/zshrc               -> ~/.zshrc
│   ├── tmux/tmux.conf          -> ~/.tmux.conf
│   └── starship/starship.toml  -> ~/.config/starship.toml
├── secrets/                    # examples only
│   ├── secrets.example         -> ~/.secrets
│   └── zshrc.local.example     -> ~/.zshrc.local
└── docs/warp.md
```

Three config files, each mapped to exactly one place in `$HOME`. Two scripts. That's all of it.

## The tools

Each one fixes a specific annoyance.

- **Starship** is the prompt. It shows the git branch, language versions and whether the last command failed, and it's fast.
- **zsh-autosuggestions** shows ghost text from your history. Press `→` to accept it.
- **zsh-syntax-highlighting** turns valid commands green and typos red, before you hit enter.
- **fzf** gives you `Ctrl+R` for fuzzy history search and `Ctrl+T` for file search.
- **zoxide** gives you `z <name>`, which jumps to any folder you've been to before.
- **tmux** keeps sessions alive after you close the terminal window.

## Keeping the shell fast

Slow shell startup is the thing that makes people abandon a setup like this. The `zshrc` avoids it by lazy-loading the heavy version managers.

`nvm` is the usual offender, so the real `nvm` only loads the first time you call it:

```bash
export NVM_DIR="$HOME/.nvm"
_nvm_lazy() {
  unset -f nvm
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
}
nvm() { _nvm_lazy; nvm "$@"; }
```

The first `nvm` call replaces this stub with the real one, then forwards your arguments. `pyenv` gets the same trick. Its shims are already on `PATH`, so Python works immediately, and the full `pyenv init` only runs when you call `pyenv` itself.

One ordering rule matters: `zsh-syntax-highlighting` has to be sourced last, or it won't see the widgets defined after it.

## Secrets never touch the repo

I wanted the repo to be public without a second thought. So `zshrc` contains nothing private. It sources two untracked files if they exist:

```bash
[ -f "$HOME/.secrets" ] && source "$HOME/.secrets"
[ -f "$HOME/.zshrc.local" ] && source "$HOME/.zshrc.local"
```

| File | Holds |
|---|---|
| `~/.secrets` | API tokens and credentials (`chmod 600`) |
| `~/.zshrc.local` | SDK paths, extra `PATH` entries, work-specific aliases |

The repo only ships `.example` templates for them. `.gitignore` blocks the real files, and `verify.sh` fails if it finds a token-like string in a tracked file or an inline secret in `~/.zshrc`.

The catch is that these two files are now the part you have to back up yourself. I keep them in a password manager.

## Install without fear

```bash
git clone <this-repo> ~/personal/my-local-setup
cd ~/personal/my-local-setup
./install.sh
$EDITOR ~/.secrets ~/.zshrc.local   # fill in real values
./verify.sh                         # should end with "All checks passed."
```

I've been burned by dotfile installers that overwrite things, so `install.sh` is careful:

- **Existing config is backed up** as `*.bak-<timestamp>` before it's replaced, and only if the content differs.
- **Private files are never overwritten.** They are created from the examples only when missing.
- **`SKIP_PACKAGES=1 ./install.sh`** copies config files and nothing else: no brew, no git, no network.
- **It's easy to undo.** Restore a backup and delete `~/.tmux.conf`.

The script is safe to run twice, and the second run changes nothing.

## tmux that survives a restart

The tmux config is short. The useful parts are splits that stay in the current folder and two plugins:

```bash
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @continuum-restore 'on'
set -g @continuum-save-interval '10'
```

`continuum` saves the session every 10 minutes and `resurrect` brings the layout back after a reboot.

| Situation | Result |
|---|---|
| Close the terminal window | Everything keeps running |
| SSH drops (tmux on the server) | Everything keeps running |
| Mac restarts | Layout restored, but running processes are not |

That last row is the limit. You get your windows and panes back, not your dev servers, so you still have to start those again.

## Testing the setup

A setup script you've never run on a clean machine is a guess. So I rebuilt the whole thing in an empty throwaway `HOME` and compared it against my real shell. Env vars, aliases, `PATH` entries, lazy-loaded functions and plugins all matched.

`./verify.sh` is what I now trust for this. It checks that the tools are installed, that the config is in place and that the private files are correct. It exits non-zero on any problem, so it works as a check too. I also confirmed it fails on a fresh install with placeholder secrets, and that it catches a fake token I planted.

## Wrapping up

The repo does very little, and that's the point. After the next new Mac I'll run one command and a script that tells me if it worked.

Take a look at [the repo](https://github.com/bharathvaj-ganesan/my-local-setup) and copy whatever is useful. Just put your own tokens in `~/.secrets`.
