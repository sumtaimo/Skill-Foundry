# Skill Foundry (`v1.3.0`)

A factory for AI agent skills by **TAIMO**. Each skill is a self-contained folder structured into ten core layers (`docs/factory/STANDARD.md`), verified by a machine linter, fresh real-agent evals, portable empty-project checks, and routing tests. The showcase site (`src/site/`, specified in `docs/site/LANDING-SPEC.md`) uses a calm, neutral React Bits–inspired layout with light/dark themes and EN/KH toggles and displays only real recorded agent outputs. Node 24, ES modules, zero runtime dependencies (`playwright` is a dev dependency for browser checks).

Read `docs/PROJECT.md` first for project goals, per-skill status, and quality rules.

## Install skills into your project

Requires Node.js and git. Tested on Linux, macOS, and Windows.

**Using [Agentic-Harness](https://github.com/sumtaimo/Agentic-Harness)?** You need no second command: its installer runs `add --default` once, so every ready skill is installed and given to the matching roles. Use the commands below in a project without the harness, or to check, update or remove skills.

```sh
npx github:sumtaimo/Skill-Foundry --version                 # project version (1.3.0)
npx github:sumtaimo/Skill-Foundry list                      # ready skills, versions, roles
npx github:sumtaimo/Skill-Foundry add test-planner          # install one skill
npx github:sumtaimo/Skill-Foundry add --default             # install the default set (every ready skill)
npx github:sumtaimo/Skill-Foundry add --role QA_AUDITOR     # every skill for a role
npx github:sumtaimo/Skill-Foundry add --all                 # all portable skills (same set today)
npx github:sumtaimo/Skill-Foundry check [--json]            # check installed versions and local edits
npx github:sumtaimo/Skill-Foundry update                    # update skills while keeping local changes
npx github:sumtaimo/Skill-Foundry remove test-planner       # remove a skill cleanly
npx github:sumtaimo/Skill-Foundry doctor [--fix] [--json]   # diagnose setup and harness wiring
```

What `add` writes in your project:
- Copies the skill into `.claude/skills/<name>/` (with `.foundry.json` hashes so `check` and `update` preserve your edits).
- If `.harness/skills/` exists (for example, Agentic-Harness), registers the skill for matching roles so workers load it automatically (`--sync-harness` wraps or replaces existing harness starter copies while keeping `.orig`).
- Updates a managed block in `AGENTS.md` so any agent (Claude Code, Codex, Gemini CLI, Cursor) discovers the installed skills (`--no-rules` to skip).
- Adds deny rules to `.claude/settings.json` so agents cannot edit installed skills (`--no-protect` to skip).

### With an agentic harness: what to expect

- A worker gets a skill only when the skill lists the worker's **role** and one of the skill's keywords is in the task. Each skill arrives as a short pointer (about half a kilobyte); the worker opens the full skill only when it fits, so several installed skills do not fill its context.
- Give headless tasks a role, for example `node .harness/dispatch.mjs --goal "…" --role DEV_ENGINEER`. `--role` and the `SKILL_NEEDS_ROLE` notice (a task without a role gets no skills; the notice names the skills it missed) need Agentic-Harness 1.0.31 or later, which also matches keywords as whole words. Team mode, the editor workflow and backlog tasks already carry roles.
- Real runs take minutes, not seconds, because the agent does the work. Measured in a demo project with Codex: tightening UI copy and writing acceptance criteria took 1 to 2 minutes each; a design-token build took about 4 minutes per round. A release proof (live evals, portable check, recipes) takes much longer and runs only in this lab.

- `npm run release:check` runs all release gates automatically, including [version & changelog tracking](src/factory/version-check.mjs) against `master` so shipped changes always carry updated `CHANGELOG.md` entries and new ready/default skills require a `package.json` version bump.
- Existing text and settings outside managed blocks are preserved. Downloadable `.zip` archives with SHA-256 checksums, `skills.json`, and `llms.txt` are published on the showcase site: https://sumtaimo.github.io/Skill-Foundry/

## Versioning: Project version vs. Skill versions

Skill Foundry tracks two separate version numbers so the CLI/platform and individual skills evolve independently:

- **Skill Foundry project version (`package.json`, currently `1.3.0`)**: versions the `skill-foundry` CLI, showcase site, `llms.txt`, `skills.json`, and harness integration (`npx github:sumtaimo/Skill-Foundry --version`). Shown in the page footer as `Skill Foundry version 1.3.0`.
- **Individual skill version (`src/skills/<name>/SKILL.md` and `src/factory/registry.json`, e.g. `1.0.0` or `0.2.0`)**: versions each skill's own instructions, rules, and engine inside its folder. Shown on each skill card and skill detail page as `Skill version <x.y.z>` and recorded in `.claude/skills/<name>/.foundry.json` so `check` and `update` only update skills whose content changed.

## Showcase site and verification

```sh
npm install
npm test                         # full suite (factory, CLI, recipes, showcase, Playwright visual checks)
node src/factory/lint-skills.mjs # lint all skills against STANDARD.md & QUALITY-LAYERS.md
npm run dev                      # build and preview the showcase site locally
```

## Work in this repository (the lab)

Run `npm run setup` once per clone to enable the `.githooks` pre-commit `skill-guard` hook (`AGENTS.md`, one skill per session). The local harness controller runs Agentic-Harness `1.0.31` inside `.harness/`.

Release flow:
1. Build or update at most one skill per session on `lab`, following `docs/factory/STANDARD.md` and `docs/factory/QUALITY-LAYERS.md`.
2. Record real-agent proof (never hand-written):
   - `node src/factory/live-evals.mjs <name>`
   - `node src/factory/portable-check.mjs <name> --prompt "<request>" --record`
   - `node src/factory/routing-evals.mjs`
   - `node src/factory/run-skill.mjs <name> --case <id>` (for file-producing skills like `figure-craft`)
3. Add or review the entry in `src/factory/registry.json` (`docs/factory/REVIEW.md`).
4. Run `npm run release:check`; it must print `READY` before TAIMO approves merging `lab` into `master` (GitHub Pages deploys from `master`).

## License

MIT License — Copyright (c) 2026 TAIMO. See `LICENSE`.
