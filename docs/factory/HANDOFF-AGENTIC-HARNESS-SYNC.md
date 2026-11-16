# Handoff Brief: `sumtaimo/Agentic-Harness` ↔ `Skill-Foundry` Bi-Directional Default Sync

> **Document Purpose:** Self-contained engineering handoff brief written for **Claude Code** inside the **`sumtaimo/Agentic-Harness`** repository (`lab` branch → `release` flow per `docs/MAINTAINING.md`).
> Stored inside `Skill-Foundry/docs/factory/` so it is never forgotten and can be copied directly into an `Agentic-Harness` session later.
> **Investigation Status:** Read-only cross-repo verification completed against `sumtaimo/Agentic-Harness` branches **`release` (`15bd31e`, v1.0.6)** and **`lab` (`bf8b43c`, v1.0.9)** + `sumtaimo/Skill-Foundry` (`src/factory/foundry.mjs`). **0 files modified.**
> **Companion Doc (for `Skill-Foundry`):** [`docs/factory/HANDOFF-SKILL-FOUNDRY-IMPROVEMENTS.md`](HANDOFF-SKILL-FOUNDRY-IMPROVEMENTS.md)

---

## 0. Ready-to-Paste Kickoff Prompt for Claude Code (Inside `sumtaimo/Agentic-Harness`)

> **Important:** Because `sumtaimo/Agentic-Harness` is a **separate repository**, Claude Code inside `Agentic-Harness` cannot see `Skill-Foundry/docs/factory/` automatically unless you either copy **this entire document** below the prompt or give it the file path / GitHub link to `Skill-Foundry`'s `HANDOFF-AGENTIC-HARNESS-SYNC.md`.

When opening `sumtaimo/Agentic-Harness` (`lab` branch) in Claude Code **after finishing Step 1 in `Skill-Foundry`**, fill in the 2 placeholders below and paste this prompt together with the rest of this document:

```text
Completed Skill-Foundry reference (branch/commit/PR link): <PASTE_COMPLETED_SKILL_FOUNDRY_LINK_HERE>
Agreed Skill-Foundry Decisions from Step 1 (D3 roles, D4 spec-writer, D5 tools, D7 one-link default): <PASTE_STEP_1_DECISIONS_SUMMARY>

Read `AGENTS.md`, `docs/MAINTAINING.md`, and the Handoff Brief pasted below (`HANDOFF-AGENTIC-HARNESS-SYNC`).
Note that edits belong ONLY on the `lab` branch (never directly on `release` or a consuming project).

Work in this exact order:
1. Inspect `.harness/lib/governance.mjs`, `.harness/doctor.mjs`, `.harness/team.json`, `.harness/roles/*.json`, `.harness/skills/*/SKILL.md`, and `install.mjs` in this repository, AND inspect the completed Skill-Foundry CLI (`foundry.mjs` at the link above).
2. Ask TAIMO to confirm PO Decisions H1–H5 in plain Khmer (pre-filling what already aligns with Step 1) before changing governance/team/installer defaults (never guess).
3. Implement only the approved changes on `lab`, add unit + Dual-Order Cross-Repo Verification tests in `test/run-tests.mjs` and `test/audit.mjs`, run `npm test` and `npm run audit`, and report honestly for PO/QA release review (`lab` → `release`).
```

---

## 1. Goal: Bi-Directional Default Sync (One-Link Smart Integration)

Make **`sumtaimo/Agentic-Harness`** and **`sumtaimo/Skill-Foundry`** work together smoothly out of the box via a **single source of truth** (never copy-paste stale skill folders manually between repos):
1. Installing `Agentic-Harness` (`npx github:sumtaimo/Agentic-Harness#release .`) can **intelligently sync `Skill-Foundry` skills via `npx github:sumtaimo/Skill-Foundry`** (idempotent, conflict-free, safe offline fallback) so users do not need separate brittle wiring.
2. Matching workers/leads actually **receive and run** Skill Foundry skills without losing `Bash(npm test:*)`, `Bash(node:*)`, or write permissions — even when combined with built-in template skills (`code-craft`, `ui-craft`, `test-champion`).
3. `node .harness/doctor.mjs` automatically detects Skill Foundry installations (`.claude/skills/*/.foundry.json`) and surfaces actionable health checks (outdated skills, role tool mismatches, `team.json` blocking `autoApply`, pointer gaps).
4. Re-updating `.harness/` via `npx github:sumtaimo/Agentic-Harness#release .` never breaks Skill Foundry pointers, `.foundry.json`, or legacy `AGENTS.md` files.

---

## 2. Shared Cross-Repo Interface Contract (Confirmed Facts)

Both repositories must agree on this lightweight, zero-dependency file contract:

1. **Skill Foundry Install Stamp:** `.claude/skills/<name>/.foundry.json`
   - Contains `name`, `version`, `hash`, `source: "github:sumtaimo/Skill-Foundry"`, `files: { "<relpath>": "<sha256>" }`.
2. **Harness Pointer Frontmatter:** `.harness/skills/<name>/SKILL.md`
   - YAML frontmatter keys read by `Agentic-Harness` `.harness/lib/governance.mjs` (`loadSkills()`):
     - `name`, `description`, `roles[]`, `allowedTools[]` (optional/empty when preserving role tools), `toolsByRole`, `keywords[]`, `autoApply: true`
     - Marker key: `installed-by: skill-foundry <version>`
3. **Valid Claude Code Permission Rules:**
   - Only `Edit(<path>)` rules are valid for file edits (never `Write(<path>)`, per `Agentic-Harness/install.mjs:250-256`).
4. **Roles Shared Across Both Repos:**
   - Base (`release` v1.0.6): `PO_ARCHITECT`, `BA_ANALYST`, `DEV_ENGINEER`, `QA_AUDITOR`, `COORDINATOR`
   - Extended (`lab` v1.0.9): `UX_DESIGNER` (note: CSS/SCSS/LESS `writablePaths`), `REVIEWER`, `SECURITY`

---

## 3. Verified Gaps & Hidden Traps in `sumtaimo/Agentic-Harness` to Fix (`lab` Branch)

| ID | File in `Agentic-Harness` | Verified Current Behavior (`release` `v1.0.6` / `lab` `v1.0.9`) | Root Impact on `Skill-Foundry` | Proposed Change on `lab` |
|---|---|---|---|---|
| **AH-1** | `.harness/lib/governance.mjs` (`matchSkills`, lines ~244–264 in `lab`) & `.harness/team.json` (`lead-dev`, `lead-qa`, `lead-ux`) | `matchSkills()` checks `if (Array.isArray(sub.skills) && sub.skills.length)` → ignores all `autoApply: true` / keyword skills! Meanwhile default `team.json` sets `"skills": ["code-craft"]` on `lead-dev` & `lead-qa`, and `"skills": ["ui-craft"]` on `lead-ux` (`lab`). | **Any Skill Foundry skill installed into `.harness/skills/` with `autoApply: true` is silently skipped** whenever work delegates through `lead-dev`, `lead-qa`, or `lead-ux`! | Update `matchSkills()` so explicit lead `skills` (like `code-craft`/`ui-craft`) **compose with** matching `autoApply: true` / keyword-triggered skills (especially `installed-by: skill-foundry`), rather than shutting down auto-injection completely. Keep role filtering strict (`fits(s)` still blocks wrong roles!). |
| **AH-1b** | `.harness/lib/governance.mjs` (`computeAllowedTools`, lines ~146–174) + `.harness/skills/code-craft/SKILL.md` | **CRITICAL MULTI-SKILL BUG:** `computeAllowedTools` iterates sequentially: *"Tools the skill does not mention are dropped."* Currently: (a) if Skill 1 (`code-craft`) allows `Bash(npm test:*)` and Skill 2 omits `Bash`, **Skill 2 WIPES OUT `Bash(npm test:*)` completely!** (b) `code-craft` sets `allowedTools.DEV_ENGINEER: [..., "Bash(npm test:*)", "Bash(node --test:*)"]` + *"Do not use other commands"*, which **strips `Bash(node:*)`** needed by Skill Foundry `engine/*.mjs` scripts (`ui-polish`, `design-system`, `a11y-audit`, `figure-craft`)! | Even after fixing `matchSkills()`, composing `code-craft` + any Skill Foundry skill breaks either `npm test` OR `node .claude/skills/.../engine/*.mjs`! | Make `computeAllowedTools` safe for multi-skill composition (empty/unspecified `allowedTools` doesn't strip; audit union vs intersection semantics cleanly OR verify Skill Foundry pointers omit `allowedTools` when non-restrictive + ensure `code-craft` / `UX_DESIGNER` rules don't block Skill Foundry `engine/*.mjs` runs). Add explicit regression tests! |
| **AH-2** | `.harness/doctor.mjs` (section `Governance`, lines ~151–160) | Checks `.harness/skills/*` + `skillRulesNotGranted()`, but has **zero awareness** of `.claude/skills/*/.foundry.json`. | If a user installed Skill Foundry skills via `zip`, forgot pointers, has stale versions, or has a role/team config blocking Skill Foundry skills, `.harness/doctor.mjs` says everything is fine. | Scan `.claude/skills/*/.foundry.json` if present: verify each Foundry skill has a matching `.harness/skills/<name>/SKILL.md` pointer (unless `scope: factory`), check `skillRulesNotGranted` clearly with tool suggestions, warn if explicit `team.json` `skills` disables `autoApply`, and print helpful commands (`npx github:sumtaimo/Skill-Foundry doctor` / `check` / `update`). |
| **AH-3** | `.harness/roles/ba-analyst.json`, `qa-auditor.json`, `ux-designer.json` + `skills/ui-craft` | Only `DEV_ENGINEER` allows `Bash(npm:*)` & `Bash(node:*)`; `BA_ANALYST` & `UX_DESIGNER` allow `Bash(git status)` and `QA_AUDITOR` allows `Bash(npm test:*)`. Also `UX_DESIGNER` `writablePaths` is CSS/SCSS/LESS only (`ui-craft` says "Style only"). | Skill Foundry's deterministic scripts (`engine/*.mjs` in `design-system`, `ui-polish`, `figure-craft`, `a11y-audit`) lose `Bash(node:*)` outside `DEV_ENGINEER`, and `ui-polish` / `a11y-audit` also target `.html`/`.jsx` beyond CSS. | Decide via Decision **H2**: either grant safe script execution (`Bash(node .claude/skills/*)` / `Bash(node:*)`) or teach `doctor.mjs` + roles cleanly which role executes `engine/` vs review/CSS (`UX_DESIGNER` tokens/CSS vs `DEV_ENGINEER` markup/scripts). |
| **AH-4** | `.harness/skills/spec-writer/SKILL.md` (`15` lines) & other built-in skills (`ui-craft`, `test-champion`) | Template ships a 15-line `spec-writer` stub (same exact name as Skill Foundry's 10-layer `spec-writer`), while `ui-craft` vs `ui-polish`/`design-system` and `test-champion` vs `test-planner` need clear non-overlapping roles. | `spec-writer` collides silently (`foundry.mjs:61`); `ui-craft` and `test-champion` could confuse agents if boundaries aren't clear. | Decide via Decision **H3**: mark starter `spec-writer` stub so Skill Foundry's deeper tested `spec-writer` supersedes it cleanly when installed, and clearly document non-overlapping roles (`test-planner` = regression checklist vs `test-champion` = writing test code; `ui-craft` = general CSS rules vs `design-system`/`ui-polish` = token generation & final polish). |
| **AH-5** | `install.mjs` (one-link smart integration + traps to avoid!) | Installer ends with next steps (`doctor.mjs`, `engines.mjs`, `charter.md`, `/harness:run`), with no `Skill-Foundry` sync. **Traps if coded naively:** running floating `npx` blindly breaks offline environments, slows/breaks `test/run-tests.mjs`, or hits network failures! | Users who install `Agentic-Harness` with one link still have to manually discover & debug Skill Foundry sync. | Implement **One-Link Smart Integration** via Decision **H4**: wire `npx github:sumtaimo/Skill-Foundry add --all` (with offline/network error fallback, `--no-skills` / `--with-skills` flag control, idempotency on re-installs, and `HARNESS_OFFLINE=1` / test isolation so `test/run-tests.mjs` never hits GitHub in unit tests!). Also optionally invoke `foundry doctor` check at end if Foundry exists. |
| **AH-6** | `install.mjs` (upgrade path for pre-marker projects) | In projects that installed an older harness before `<!-- agentic-harness -->` marker existed (`install.mjs:174-184`), re-installing appends a duplicate `# Agentic harness` section in `AGENTS.md` and duplicate pointers in `CLAUDE.md`/`GEMINI.md`. *(Observed directly in `Skill-Foundry`!)* | Re-updating older projects creates duplicate prompt instructions and noisy diffs. | Harden `install.mjs` detection so existing legacy `# AGENTS.md — instructions for any AI working in this folder` / `Agentic Harness` blocks add the marker or upgrade in place without appending duplicates. |

---

## 4. Open PO Decisions Required Before Implementation (`H1`–`H5`)

Claude Code in `sumtaimo/Agentic-Harness` MUST confirm these with TAIMO before editing `lab` (no guessing!):

1. **`H1` — How should `matchSkills()` + `computeAllowedTools()` compose explicit `skills` (like `"code-craft"`, `"ui-craft"`) with Skill Foundry `autoApply: true` skills?**
   - *(a — Recommended)* Additive merge in `matchSkills()` + fix `computeAllowedTools()` so a skill with empty `allowedTools` (or non-tool-restricting pointer) NEVER drops `Bash(npm test:*)` from the role/lead, while allowing `engine/*.mjs` scripts when approved.
   - *(b)* Remove hardcoded `"skills"` arrays from default `team.json` (`lead-dev`, `lead-qa`, `lead-ux`) and set `autoApply: true` on `code-craft` / `ui-craft` instead.
2. **`H2` — Security rule for Skill Foundry `engine/` scripts (`node .claude/skills/<name>/engine/...`) in non-`DEV` roles (`BA_ANALYST`, `QA_AUDITOR`, `UX_DESIGNER`):**
   - *(a — Recommended, tighter security)* Allow narrow prefix `Bash(node .claude/skills/*)` (verify exact `covers()` matching in `governance.mjs:125` + real Claude CLI syntax first!) or `Bash(node:*)` for roles assigned engine skills.
   - *(b)* Keep `BA_ANALYST`/`QA_AUDITOR`/`UX_DESIGNER` without `Bash(node:*)`, and make `doctor.mjs` warn clearly which skills require `DEV_ENGINEER` (or ask user to enable `Bash(node:*)` per project).
3. **`H3` — `spec-writer` stub coexistence & overlapping starter skills (`ui-craft`, `test-champion`):**
   - Should `.harness/skills/spec-writer/SKILL.md` carry a marker like `starter-stub: agentic-harness` so `Skill-Foundry` safely replaces it with the 10-layer tested `spec-writer` when installed — while `code-craft`, `api-craft`, `security-guard`, `test-champion`, `ui-craft` stay harness-owned with clear boundary lines?
4. **`H4` — Default behavior of One-Link Integration in `Agentic-Harness` `install.mjs`:**
   - *(a)* Auto-run `npx github:sumtaimo/Skill-Foundry add --all` **by default** at the end of `install.mjs` (skip if `--no-skills` or offline/no-git, warn nicely if offline so install still succeeds!).
   - *(b)* Opt-in via `--with-skills` flag, and print a clear 1-line next-step suggestion during normal install (zero surprise network call unless requested).
5. **`H5` — Exact target link / branch of `Skill-Foundry` to pull from (`#master` vs tagged release):**
   - Should `Agentic-Harness` call `npx github:sumtaimo/Skill-Foundry add --all` (default branch `master` after TAIMO approves release) or pin a branch/tag?

---

## 5. Verification Checklist Inside `sumtaimo/Agentic-Harness` (Cross-Repo Guarantee)

Before TAIMO approves copying `lab` → `release` (`docs/MAINTAINING.md`):
1. `npm test` and `npm run audit` pass cleanly (`test/run-tests.mjs` stays offline-safe and cleans temp dirs).
2. Add unit regression tests covering:
   - `matchSkills()` with lead `"skills": ["code-craft"]` + Skill Foundry `autoApply: true` pointer.
   - **`computeAllowedTools()` multi-skill test:** composing `code-craft` (`Bash(npm test:*)`, `Bash(node --test:*)`) + Skill Foundry skill NEVER drops `Bash(npm test:*)`, and `engine/` skills preserve `Bash(node:*)` as designed.
   - `doctor.mjs` detecting `.claude/skills/*/.foundry.json` (healthy vs missing pointer vs tool deficit vs blocked by `team.json`).
   - `install.mjs` legacy `AGENTS.md` upgrade without duplicate sections.
3. **Mandatory Live Dual-Order Integration Test (against TAIMO's completed `Skill-Foundry` link):**
   - **Order 1 (`Agentic-Harness` first → `Skill-Foundry` second):** Install `Agentic-Harness` into clean temp project, run `Skill-Foundry add --all` (or automatic `--with-skills`), then run `node .harness/doctor.mjs` + `node .harness/team.mjs validate` + `Skill-Foundry doctor` → **exit 0, zero conflicts, zero invalid `Write(...)` rules**.
   - **Order 2 (`Skill-Foundry` first → `Agentic-Harness` update second):** Install `Skill-Foundry` first, then run `Agentic-Harness` `install.mjs` on top → confirm `.claude/skills/*/.foundry.json`, `.harness/skills/*`, and `AGENTS.md` survive cleanly without duplicates or lost pointers!

---

## 6. After `Agentic-Harness` Is Done (Final Closure Steps Across Both Repos)

Once TAIMO approves merging `Agentic-Harness` `lab` → `release` (`v1.0.9+` / `v1.1.0`):
1. **Release `Skill-Foundry` to `master` (if still on `claude/foundry-harness-sync`):** Follow `docs/factory/PUBLISHING.md` in `Skill-Foundry` (`npm run release:check` READY → TAIMO approves → merge working branch → `master`), so `npx github:sumtaimo/Skill-Foundry` (without `#branch`) serves the updated CLI & site!
2. **Sync `Skill-Foundry/.harness/` cleanly (if deferred via Decision D1):** Inside `Skill-Foundry`, run `npx github:sumtaimo/Agentic-Harness#release .` **without `--reset`**, dedup `AGENTS.md` if needed, clean any stale `gemini`/`orca` entries, and verify `node .harness/doctor.mjs` + `npm test`.
3. **One-Command Empty-Folder Smoke Test:** In a brand-new empty folder (`mkdir /tmp/test-sync && cd /tmp/test-sync && git init`), run the single command `npx github:sumtaimo/Agentic-Harness#release .` and verify both `.harness/` and `Skill-Foundry` skills install, protect (`Edit(...)`), inject, and pass `doctor` without manual fixing!

