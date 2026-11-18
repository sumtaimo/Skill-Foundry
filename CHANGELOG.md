# Changelog

Versions of Skill Foundry itself (the `skill-foundry` command and the set of skills it ships). Each skill keeps its own
version in its folder. Versions move slowly: a bump needs the owner's approval in chat; record smaller changes under the
current version.

## 1.0.1 - 2026-11-18

- Redesign the showcase site (`src/site/`, `docs/site/LANDING-SPEC.md`): light-first neutral React Bits–style layout with dark mode and EN/KH toggles, solid brand logo mark and favicon, unclipped hero heading, floating glass header with grouped tool buttons (`theme`, `lang`, GitHub), compact (`34px`) Stripe-height buttons, skill detail action above metadata, open `#proof` table without skill link underlines, simplified two-column footer (`Skill Foundry version 1.0.1` above `License MIT · © 2026 TAIMO`), and reliable scroll-to-top on load/reload.
- CLI & Release automation (`src/factory/foundry.mjs`, `src/factory/version-check.mjs`, `src/factory/release-check.mjs`): added `--version` / `-v`, `latestFoundry` in `check --json`, project-version and missing-default-skill notices in `check` and `doctor`, and automatic changelog/version tracking in `npm run release:check`.
- Sync Agentic-Harness to `1.0.18` (`B1`–`B11` fixes), untrack runtime `.harness/foundry-check.json`, and refresh `README.md` and `docs/PROJECT.md` (documenting separate project vs. skill versioning).

## 1.0.0 - 2026-11-17

- Skill Foundry (the project and its `npx` command) is now at 1.0.0. This number is separate from the version of each skill, which stays in the skill's own folder. From here both move slowly: a bump needs the product owner's approval in chat.
- The landing page shows one install command first (`npx github:sumtaimo/Skill-Foundry add --all`), the Skill Foundry version, and each card labelled with its own skill version. The other commands are folded under "More commands"; skill cards no longer carry an install button.
- `add --default` installs the five default skills; skills with an `engine/` script declare `engine: required | optional`; pointers use keywords when the harness exports `SKILL_MATCH`.
- `doctor` and `check --json` contracts documented in the tests; the package no longer tracks a local `node_modules` link.

## 0.1.0 - 2026-11-14

- First release for other projects: `npx github:sumtaimo/Skill-Foundry` with `list`, `add <skill>`, `add --all`,
  `add --role <ROLE>`, `check`, `update`, `remove`.
- `add` lists the skills in `AGENTS.md` and denies agents edit rights on installed skills by default
  (`--no-rules`, `--no-protect`).
- A project with an agentic harness gets each skill registered for its roles.
- Ships four skills: figure-craft 1.0.0, changelog-writer 1.0.0, copy-tight 0.2.0, test-planner 1.0.0.
  `skill-smith` stays in this repository (it only works here).
- The package holds only what users need (about 350 KB); evals (test prompts and recordings) are not shipped.
