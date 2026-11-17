# Release workflow: from the lab to every user's project

This repository is the **lab**. A skill reaches other people only through this path, in this order.
Every agent follows it; nobody skips a step. Owner approvals happen in chat with the product owner.

```
1 BUILD (claude/... branch) → 2 PROVE (real agents) → 3 RELEASE CHECK → 4 LAB (integrate + check) → 5 OWNER OK → 6 MASTER → 7 USERS UPDATE
```

Branches: `claude/...` = one piece of work; **`lab`** = the staging branch where finished work is integrated and checked
before a release (the product owner's name for UAT, set 2026-11-16); `master` = the release (GitHub Pages and `npx` read it).

## 1. Build, on a `claude/...` working branch, never on master

- One skill per session (`AGENTS.md`, SKILL QUALITY LAW rule 8). Never a skill in `src/factory/locks.json`.
- Follow `src/skills/skill-smith/SKILL.md` and `docs/factory/STANDARD.md` (ten layers).
- Version stays `1.0.0` until the product owner calls it final; record changes under the current version (lessons L4).
- Correct `roles` in `src/factory/registry.json`: they decide which harness roles receive the skill in users' projects.

## 2. Prove it with real agents (costs tokens; never hand-written)

| Proof | Command | Required |
|---|---|---|
| Live evals, fresh agent per case | `node src/factory/live-evals.mjs <name> --run` or `node src/factory/run-skill.mjs <name> --case <id>` | every case |
| Routing (does the right skill get picked) | `node src/factory/routing-evals.mjs --run` | after any description change |
| Someone else's empty project | `node src/factory/portable-check.mjs <name> --prompt "<request>" --record` | every skill that is not `scope: factory` |
| Skills working together | `node src/factory/recipe-run.mjs <id> --record` | when a recipe uses the skill |

When an agent fails, fix the skill, not the case (L9). Read the recorded answer yourself, not only the flags.

## 3. Release check (free, one command)

```
npm run release:check
```

It runs every gate: tests (including stale-recording, real-output site and CLI tests), lint, routing, live evals of
every ready skill, site build, and the skill guard. It prints `READY` or `NOT READY`. Only `READY` may go further.
Set `status: ready` in the registry only when this passes.

## 3b. Lab (staging) before master

- Merge each finished, verified `claude/...` branch into `lab` (merge commit), one at a time; resolve shared files there
  (`registry.json`, routing cases, ROADMAP, PROJECT, STATUS) and re-record routing once after combining descriptions.
- On `lab`, run `npm run release:check` (must print READY) and the site check (`node src/site/build.mjs --check`, screenshots).
- `lab` may be verified a second time by another agent before release. Pushing to `lab` needs no extra approval;
  pushing to `master` does.

## 4. Owner approval

Ask the product owner in chat to release `lab` to `master`, listing what `lab` holds. Report in Khmer: what changed, which results came from real agents, the `release:check` output, open items.
Merge only after the product owner approves **in chat**. Never merge, push to master, or force-push on your own.

## 5. Master = the release

A merge of `lab` into `master` (merge commit, or fast-forward when `master` has nothing new) is the release. `.github/workflows/pages.yml` runs the tests again and publishes the
site at https://sumtaimo.github.io/Skill-Foundry/. Check the workflow run succeeded and the page opens.

## 6. Users get it

| User has | Command | What their agents get |
|---|---|---|
| Claude Code | `npx github:sumtaimo/Skill-Foundry add <skill>` | the skill in `.claude/skills/`, picked by its description |
| An agentic harness | `npx github:sumtaimo/Skill-Foundry add --role <ROLE>` | also `.harness/skills/<skill>/`, injected into workers of the matching role |
| Codex, Cursor, Gemini, any agent | (default) | one managed block in `AGENTS.md` listing the skills and when to use each; their own text is kept. Opt out with `--no-rules` |
| Any Claude Code project | (default) | deny rules in `.claude/settings.json` so the agent cannot edit the installed skills or run `add`/`update`; only the user updates skills. Existing settings are merged, never replaced. Opt out with `--no-protect`. A guard rail, not a lock: tested with a real agent (edit blocked), but a user can always change it |
| Already installed | `npx github:sumtaimo/Skill-Foundry check` then `update` | new content; files they changed are kept |

Never break `add`, `check`, `update` or `--rules` for projects that already installed a skill
(`tests/factory-foundry-cli.test.mjs`).

## Versions (slow on purpose)

- Each skill has its own version (frontmatter, CHANGELOG, registry). It stays where it is until the product owner calls it final (L4).
- Skill Foundry itself has one version in `package.json` and the root `CHANGELOG.md` (now 0.1.0). Bump it only with
  the product owner's approval: PATCH for fixes, MINOR for new commands or skills. Record smaller changes under the current version.
- After a release merge, tag it: `git tag v<version>` on the merge commit.

## What users receive

`package.json` `files` decides what `npx` downloads: `foundry.mjs`, the registry and the skills that work outside this
repository. Not shipped: `skill-smith` and `_template` (lab only), evals (test prompts and recordings), `runs/`, `docs/`, `tests/`,
`.harness/`, `.claude/`. A new skill that is only for this lab gets `scope: factory` and a `!src/skills/<name>/` line.
Checked by `tests/factory-package.test.mjs`.

## Downloads (zip)

The site also offers each skill as a zip with a SHA-256 in `checksums.json` (`node src/factory/pack.mjs --all`).
