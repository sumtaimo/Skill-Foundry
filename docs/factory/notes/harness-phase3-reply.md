# REPLY PROMPT BACK TO AGENTIC-HARNESS (PHASE 3)

You are the auditor of Agentic-Harness. The Skill Foundry audit (branch `lab`, foundry 1.1.0 working copy, 2026-11-20) verified the contract below by reading `src/factory/foundry.mjs` and running it in an empty project with `.harness/skills/`. Evidence-first: re-check your own files; do not push or commit without the user's explicit yes.

## 1. Verified Skills contract (what Foundry writes today)

Full skill: `.claude/skills/<name>/` + `.foundry.json`:
```json
{ "name": "copy-tight", "version": "0.2.0", "foundryVersion": "1.1.0", "hash": "<sha256>", "source": "github:sumtaimo/Skill-Foundry", "files": { "<relpath>": "<sha256>" } }
```
`foundryVersion` is optional (absent in old stamps).

Pointer: `.harness/skills/<name>/SKILL.md` (only when `.harness/skills/` exists; foundry.mjs:116-136). Frontmatter, in this order:
```
name: <name>
description: <one line>
roles: ["BA_ANALYST","DEV_ENGINEER"]          # JSON array, upper-case harness roles
allowedTools: [...]                           # only when the skill has engine/ (bare tool names)
keywords: ["..."]                             # registry keywords, else preview.json tags
engine: required|optional                     # only when the skill has engine/
autoApply: true|false                         # false only if governance exports SKILL_MATCH='keywords-with-explicit'
installed-by: skill-foundry <skill version>
```
Pointer version == `.foundry.json.version` == registry version (same source). `starter-stub` is never written by Foundry. `scope: factory` skills (skill-smith) are refused by `add`.

Registry (`src/factory/registry.json`, array): `{ name, version, purpose, status: draft|ready, roles[], keywords[], default?: true, engine?: required|optional }`. Only `status: ready` ships.

## 2. CLI contract (verified by running it)

| Command | Behaviour | Exit |
|---|---|---|
| `add --default --quiet` | installs registry `default: true` = changelog-writer, copy-tight, spec-writer, test-planner, ux-review (identical to your fallback list) | 0 |
| `add --all --quiet` | every ready non-factory skill | 0 |
| `add <names> --quiet` | named skills; unknown name → stderr `unknown or not ready skill "x"` | 0 / 1 |
| `add` with nothing resolved | stderr `usage: add <skill…> \| add --all \| add --default \| add --role <ROLE>` | 1 |
| `update <names> --quiet` | updates installed skills; a current skill still rewrites its pointer (`current x → harness: …`) | 0 |
| `update <n> --sync-harness` | replaces a non-foundry pointer, keeps `SKILL.md.orig` | 0 |
| `check --json` | JSON array `{ name, installed, latest, foundryVersion, latestFoundry, current, modified[] }` | 0 all current, 2 outdated/modified, 1 error |
| `doctor [--json] [--fix]` | 0 healthy, 2 findings, 1 usage | |

Two extra keys vs your A.7 note: `foundryVersion`, `latestFoundry` (nullable). Ignore unknown keys.

## 3. Decision: schema_version / min_harness_version

- ADOPT `schema_version: 1` (int) in the pointer frontmatter and `schemaVersion: 1` in `.foundry.json` (Foundry change pending user OK). It versions the pointer FORMAT, not the skill.
- REJECT `min_harness_version`. Foundry already gates on capability flags (`SKILL_MATCH`, `SKILL_COMPOSITION`) read from your governance file; semver pinning across two repos would drift. Keep exporting capability constants instead.
- REJECT `triggers`, `inputs`, `outputs`: `keywords` is the trigger mechanism; no skill has machine-readable inputs/outputs today.

## 4. Precise Harness changes

1. Loader (`governance.mjs loadSkills`): read `schema_version` (default 1 when missing). If it is greater than a new exported `SKILL_SCHEMA_MAX = 1`, skip the skill and log `SKILL_SCHEMA_UNSUPPORTED <name>`; never crash.
2. Doctor: warn on `schema_version > SKILL_SCHEMA_MAX` with fix `npx github:sumtaimo/Agentic-Harness#release` (update harness); tolerate `foundryVersion`/`latestFoundry` in `check --json`; treat `check` exit 2 as valid (already).
3. Keyword matching: confirm whether matching is substring or whole-word. Foundry's ui-craft currently has short keywords (`ui`, `button`, `react`) that substring-match almost every prompt; report which, so Foundry can narrow them.
4. `install.mjs` fallback: keep `/usage:/i` (still exact). Additionally fall back when stderr contains `unknown or not ready skill` for `--default` on very old foundry builds? No: those builds print `usage:`. No change needed.
5. Tests: loader skips schema 2 pointer; loader accepts pointer without schema_version; doctor tolerates extra check-json keys; install fallback triggers on `usage:` output only.

## 5. Termination

When both repos ship sections 3-4 and the Foundry pointer test passes, reply exactly `SYNC COMPLETE: 100% VERIFIED`.
