# Changelog

Versions of Skill Foundry itself (the `skill-foundry` command and the set of skills it ships). Each skill keeps its own
version in its folder. Versions move slowly: a bump needs the owner's approval in chat; record smaller changes under the
current version.

## 1.6.0 - 2026-11-21

- New skill `journey-mapper` 0.1.0 (fetched on demand, not in the default core; BA_ANALYST): grows a short feature goal into the whole user journey, read-only in the reply: steps with loading, empty, error, success, validation, reload and permission slots, every fact quoted from the goal, every gap an open business question. Asked for by Agentic-Harness for its read-only `[HARNESS FEATURE_BA]` planner call (1.0.39); proven by fresh real agents (live 7 of 7, routing 83 of 83, portable).

## 1.5.0 - 2026-11-21

- New skill `browser-check` 0.1.0 (fetched on demand, not in the default core; QA_AUDITOR, UX_DESIGNER, DEV_ENGINEER): clicks through one flow of a local app in a real browser, finds each element from the user's own words and says which one it used (asks when several match), and reports each step PASS, FAIL or NOT RUN with errors and screenshots. Asked for by Agentic-Harness 1.0.36; proven by fresh real agents (live 8 of 8, routing 77 of 77, portable).

## 1.4.0 - 2026-11-21

- CI: the Pages workflow builds and deploys in two jobs, so deploy no longer misses the artifact.
- CI: GitHub Actions moved to the Node.js 24 versions (checkout v7, setup-node v7, upload-pages-artifact v5, deploy-pages v5).
- `doctor` mirrors Agentic-Harness 1.0.34: when a skill pointer narrows a worker's tools, the role's own `mcp__` tools are kept (like Read/Grep), so engine skills no longer report "strips mcp__playwright".
- Memory rule L1: talk with the owner in Khmer.

- The default set is a small core again, one starter skill per role (TAIMO: "Small core, fetch rest"): spec-writer (PO, BA), design-system (UX), copy-tight (DEV), test-planner (QA). The Agentic-Harness installer adds this core once; harness 1.0.32 or later adds any other skill the first time a task needs it (from `list --json`), at most two skills per task, and says which skill it added and why. Projects that already have more skills keep them.
- README and landing describe the core set and the fetch on demand.
- The lab's own harness is updated to Agentic-Harness 1.0.32, with `"skillFetch": false`: this repository is the skill source, so its harness never fetches skills into `.claude/skills/`.

## 1.3.1 - 2026-11-21

- New `list --json`: every ready portable skill, installed or not, with name, version, description, roles, keywords, default, engine, installed version and current. JSON only on stdout, exit 0, read from the registry in the package (works offline). The Agentic-Harness reads it to add a skill the first time a task needs it (planned for harness 1.0.32). Nothing else changes; the default set stays as in 1.3.0 until that harness is released.

## 1.3.0 - 2026-11-21

- Every ready portable skill is now a default skill (11: the old five plus design-system, ui-craft, ui-polish, component-kit, a11y-audit, figure-craft). The Agentic-Harness installer runs `add --default` once, so a new harness project gets every skill wired to its roles with no second command. A worker still gets only the skills that fit its role and the words of its task, each as a short pointer. The old rule that a default skill has no `engine/` script is dropped: Node.js is always there, because `npx` and the harness run on it; every engine skill declares `engine: required | optional`. Projects that already have the old defaults see the new ones in `check` and `doctor` and add them with `add --default`.
- README and landing: with Agentic-Harness you need no second command.
- The lab's own harness is updated from Agentic-Harness 1.0.23 to 1.0.31 (installed with `--no-skills`; config keeps the owner's values, removed engines dropped). README: `--role` needs Agentic-Harness 1.0.31 or later.

## 1.2.0 - 2026-11-21

- `component-kit` 1.0.0 is ready: turns a project's design variables into component specs (button, input, card, dialog and more, with the eight states, ARIA and Khmer notes) and checks specs and code against `design/tokens.css`; proven by real-agent live (9 of 9), portable and routing (71 of 71) evals.
- `design-system` 1.2.0: a design foundation with variables (`init`, `set`, `check`, `explain`) and a brief, with real-agent proof.
- `ui-polish` 1.1.0: token mode reads the `design/` variables, keeps the modern group, reports drift and follows the Khmer rules.
- `ui-craft` reads `design/` first, has a cold-start gate, uses the design-system token names and one Khmer line height, and no longer writes a year.
- `ux-review` 1.0.1: boundaries synced with `ui-polish`, `ui-craft` and the design foundation.
- The run recorder keeps up to 12000 characters of the agent reply (was 4000); routing re-recorded on the merged descriptions; Agentic-Harness template updated from 1.0.18 to 1.0.23.
- `tests/component-kit.test.mjs` normalises CRLF line endings, so the suite also passes on a Windows checkout with `core.autocrlf`.
- `check` and `update` ignore line endings when they compare installed skill files: a Windows clone with `core.autocrlf` no longer reports every skill as "CHANGED LOCALLY", and `update` no longer keeps the old files because of it. Stamps written by older versions still match.
- `design-system` 1.2.1: the report says `text-disabled` is exempt from contrast (WCAG 1.4.3) and gives its hex, so an agent or reviewer no longer "fixes" it; found in a real Codex harness run that looped three times on it. Fresh real-agent portable check and `tokens-then-polish` recipe.
- README and landing: what to expect with an agentic harness (a worker needs a role to get a skill; each skill arrives as a short pointer) and how long real runs take (1 to 2 minutes for a small task, about 4 minutes per round for a design-token build, measured with Codex). README versions corrected (1.2.0, harness copy 1.0.23).

## 1.1.0 - 2026-11-19

- `ui-craft` 1.0.0 is ready: modern 2026 product UI, command palette, adaptive navigation, lifecycle states and inline AI bars for `DEV_ENGINEER` and `UX_DESIGNER`, proven by real-agent live, portable and routing evals.
- `design-system` 1.1.0 (UI-2026-02): an optional 2026 token group (`--glass-bg`, `--glass-blur`, `--r-xs`..`--r-xl`, `--z-sticky`/`-dropdown`/`-command`/`-modal`/`-toast`, `--glow`, `--btn-gloss`, `--font-weight-medium: 500`), with the same names as `ui-craft`, added by the engine flag `--modern` only when the user asks for those effects; every 1.0.0 token is unchanged. Proven by fresh real agents (live, portable).
- `live-evals.mjs` and `portable-check.mjs` wait up to 1200s per run (were 600s and 900s) so long UI builds can finish.

## 1.0.1 - 2026-11-18

- Redesign the showcase site (`src/site/`, `docs/site/LANDING-SPEC.md`): light-first neutral React Bits–style layout with dark mode and EN/KH toggles, solid brand logo mark and favicon, unclipped hero heading, floating glass header with grouped tool buttons (`theme`, `lang`, GitHub), compact (`34px`) Stripe-height buttons, skill detail action above metadata, open `#proof` table without skill link underlines, simplified two-column footer (`Skill Foundry version 1.0.1` above `License MIT · © 2026 TAIMO`), and reliable scroll-to-top on load/reload.
- CLI & Release automation (`src/factory/foundry.mjs`, `src/factory/version-check.mjs`, `src/factory/release-check.mjs`): added `--version` / `-v`, `latestFoundry` in `check --json`, project-version and missing-default-skill notices in `check` and `doctor`, and automatic changelog/version tracking in `npm run release:check`.
- Sync Agentic-Harness to `1.0.18` (`B1`–`B11` fixes), untrack runtime `.harness/foundry-check.json`, and refresh `README.md` and `docs/PROJECT.md` (documenting separate project vs. skill versioning).
- Add draft `ui-craft` skill (`0.1.0`, modern 2026 UI/navigation/motion/lifecycle states/AI-bar builder with `DEV_ENGINEER` + `UX_DESIGNER` controller-lead-worker support), register Agentic-Harness starter stub upgrade in `src/factory/foundry.mjs`, add `--engine agy` support to `live-evals.mjs`/`routing-evals.mjs`/`portable-check.mjs`, and configure `antigravity` CLI tiers in `.harness/config.json` and `.harness/team.json`.
- `copy-tight` moves from 0.2.0 to 1.0.0 with fresh real-agent proof (12 of 12 live cases, portable check, `ship-a-change` recipe). One tightening of rule R-copy-tight-7: a reason or change-list bullet never repeats a removed word or phrase in any form. A quoted removed phrase can still appear now and then in a fresh run; it passes on re-run.
- Pointers and `.foundry.json` carry a `schema_version`; the `ui-craft` draft keywords are narrower so the skill is injected only for UI tasks.
- Owner name replaced by "the owner" in the skill checklists under `docs/skills/`.

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
