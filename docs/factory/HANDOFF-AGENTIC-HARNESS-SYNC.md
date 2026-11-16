# Handoff Brief: `sumtaimo/Agentic-Harness` ↔ `Skill-Foundry` Bi-Directional Sync

> **Document Purpose:** Self-contained engineering handoff brief written for **Claude Code** inside **`sumtaimo/Agentic-Harness`** (`lab` branch → `release` flow per `docs/MAINTAINING.md`).
> Stored inside `Skill-Foundry/docs/factory/` so nothing is forgotten and it can be pasted directly into an `Agentic-Harness` session after `Skill-Foundry` Phase B.
> **Investigation Status:** Cross-repo verified against `sumtaimo/Agentic-Harness` **`release` (`15bd31e`, v1.0.6)** & **`lab` (`bf8b43c`, v1.0.9)** AND `sumtaimo/Skill-Foundry` **`origin/master` (`c8e0e9a` — Phase A `2a27637` shipped)**.
> **Companion Doc (for `Skill-Foundry`):** [`docs/factory/HANDOFF-SKILL-FOUNDRY-IMPROVEMENTS.md`](HANDOFF-SKILL-FOUNDRY-IMPROVEMENTS.md)

---

## 0. Ready-to-Paste Kickoff Prompt for Claude Code (Inside `sumtaimo/Agentic-Harness`)

> **Important:** Because `sumtaimo/Agentic-Harness` is a **separate repository**, Claude Code inside `Agentic-Harness` cannot see `Skill-Foundry/docs/factory/` automatically unless you paste **this entire document** below the prompt (or give it the path / raw GitHub URL to this file).

When opening `sumtaimo/Agentic-Harness` (`lab` branch) in Claude Code **after finishing Phase B in `Skill-Foundry`**, fill in the 2 placeholders below and paste this prompt together with the rest of this document:

```text
Completed Skill-Foundry reference (branch/commit/PR link): <PASTE_COMPLETED_SKILL_FOUNDRY_LINK_HERE>
Agreed Skill-Foundry Decisions from Phase B (D3 roles, D4b stub precedence): <PASTE_PHASE_B_DECISIONS_SUMMARY>

Read `AGENTS.md`, `docs/MAINTAINING.md`, and the Handoff Brief pasted below (`HANDOFF-AGENTIC-HARNESS-SYNC`).
Note that edits belong ONLY on the `lab` branch (never directly on `release` or a consuming project).

Work in this exact order:
1. Inspect `.harness/lib/governance.mjs`, `.harness/doctor.mjs`, `.harness/team.json`, `.harness/roles/*.json`, `.harness/skills/*/SKILL.md`, `install.mjs`, and `watch.mjs` / `daemon.mjs` in this repository, AND inspect the completed `Skill-Foundry` (`foundry.mjs` at the link above).
2. Strictly enforce the Product Boundary & Skill-Foundry Precedence Rules in Section 1 (`Agentic-Harness` provides ONLY the harness + at most 1 harness-operational skill; delete/retire duplicate domain skills; `Skill-Foundry` ALWAYS wins on conflicts/doubles; keep user-facing skill suggestions smooth without leaking protected skill internals).
3. Ask TAIMO to confirm PO Decisions H1–H6 in plain Khmer before changing governance/skills/installer/schedule defaults (never guess).
4. Implement only the approved changes on `lab`, add unit + Dual-Order Cross-Repo Integration tests + L19 schedule tests in `test/run-tests.mjs` and `test/audit.mjs`, run `npm test` and `npm run audit`, and report honestly for PO/QA release review (`lab` → `release`).
```

---

## 1. Core Architectural Rules & Goal (TAIMO Confirmed 2026-11-16)

Both repositories work cleanly together under a strict **division of responsibility**:

1. **Product Split (No Bloated Overlap):**
   - **`Skill-Foundry`** (`npx github:sumtaimo/Skill-Foundry`) provides **only domain skills** (`.claude/skills/` + `.foundry.json` + `AGENTS.md` + `Edit(...)` guard rails + `doctor`) — it **never** installs `Agentic-Harness`.
   - **`sumtaimo/Agentic-Harness`** (`npx github:sumtaimo/Agentic-Harness`) provides **only the Agentic Harness** (controller, charter, roles, team hierarchy, verification loop, session tracking) — it must **not** carry a competing library of domain skills! Keep **only 1 minimal harness-matched skill** (for running/operating within the harness itself — exact survivor confirmed via Decision `H3`) and delete/retire duplicate or conflicting domain skills (`spec-writer` stub, `ui-craft`, `test-champion`, etc.).
2. **`Skill-Foundry` ALWAYS Wins on Double or Conflicting Skills:**
   - Whenever an older `.harness/skills/<name>` from `Agentic-Harness` duplicates or conflicts with a `Skill-Foundry` skill, **`Skill-Foundry` wins**: clean/delete old duplicate harness skills on upgrade (`lab` → `release`) and let `Skill-Foundry` replace/update `.harness/skills/<name>/SKILL.md` cleanly without silent collisions.
3. **Default Two-Way Support Inside `Agentic-Harness`:**
   - Because `Agentic-Harness` is TAIMO's harness, it supports `Skill-Foundry` **by default**: when installed or run, workers can seamlessly receive and execute `Skill-Foundry` skills (`autoApply`, non-stripping `computeAllowedTools`, `engine/*.mjs` scripts, optional one-link `npx github:sumtaimo/Skill-Foundry` pull per Decision `H4`) without breaking `Bash(npm test:*)`.
4. **Smooth UX & Protected Skill Info:**
   - During skill execution or setup checks, keep compatibility/fix suggestions **smooth, plain, and task-focused** — **do not unnecessarily mention internal skill names, internal rules, or expose Skill Foundry's protection internals** in user deliverables ("we protect this information too — just tell them how to make it run smoothly").

---

## 2. Shared Cross-Repo Interface Contract (Synced With `Skill-Foundry` `origin/master` `2a27637`)

`Skill-Foundry` Phase A (`foundry.mjs` on `origin/master`) ALREADY implements this exact side of the contract:

1. **Skill Foundry Install Stamp:** `.claude/skills/<name>/.foundry.json`
   - Fields: `name`, `version`, `hash`, `source: "github:sumtaimo/Skill-Foundry"`, `files: { "<relpath>": "<sha256>" }`.
2. **Harness Pointer Frontmatter (`foundry.mjs:74-107`):** `.harness/skills/<name>/SKILL.md`
   - Ordinary skills **omit `allowedTools`** (`[]`), so `computeAllowedTools` preserves all role tools untouched.
   - Skills with local `engine/*.mjs` scripts declare bare names `allowedTools: ["Edit", "Write", "Bash"]` so existing role `Edit`/`Write`/`Bash` permissions stay intact (`foundry.mjs:81`).
   - Sets `roles`, `keywords`, `autoApply: true`, and marker `installed-by: skill-foundry <version>`.
3. **Valid Claude Code Permission Rules (`foundry.mjs:170-189`):**
   - Writes only `Edit(.claude/skills/**)` & `Edit(.harness/skills/**)` and auto-strips legacy `Write(...)` rules.
4. **Roles (`foundry.mjs:31,62-72`):**
   - `PO_ARCHITECT`, `BA_ANALYST`, `DEV_ENGINEER`, `QA_AUDITOR`, `UX_DESIGNER`, `REVIEWER`, `SECURITY`, `COORDINATOR` + any custom roles defined in `.harness/roles/*.json`.

---

## 3. Verified Gaps & New Requirements in `sumtaimo/Agentic-Harness` (`lab` Branch)

| ID | File in `Agentic-Harness` | Verified Current Behavior (`release` `v1.0.6` / `lab` `v1.0.9`) | Root Impact | Required Change on `lab` |
|---|---|---|---|---|
| **AH-1** | `.harness/lib/governance.mjs` (`matchSkills`, ~244–264) & `.harness/team.json` | `if (Array.isArray(sub.skills) && sub.skills.length)` ignores ALL `autoApply: true` skills! Default `team.json` sets `"skills": ["code-craft"]` on `lead-dev`/`lead-qa` and `"skills": ["ui-craft"]` on `lead-ux`. | **Every `Skill-Foundry` skill with `autoApply: true` is skipped** whenever delegating through `lead-dev`, `lead-qa`, or `lead-ux`. | Compose explicit harness skill (if any kept per `H3`) **together with** matching `autoApply: true` / keyword skills (`installed-by: skill-foundry`), keeping strict role matching (`fits(s)`). |
| **AH-1b** | `.harness/lib/governance.mjs` (`computeAllowedTools`, ~146–174) + `.harness/skills/code-craft/SKILL.md` | If Skill 1 allows `Bash(npm test:*)` and Skill 2 omits `Bash`, Skill 2 **wipes `Bash`**! Plus `code-craft` narrows `DEV_ENGINEER`'s `Bash` down to `npm test` / `node --test`, **blocking `Bash(node:*)` for Skill Foundry `engine/*.mjs` scripts** (`design-system`, `ui-polish`, `a11y-audit`, `figure-craft`). | Composing `code-craft` + any Skill Foundry skill breaks either project tests or `engine/*.mjs` runs. | Fix `computeAllowedTools` so empty/unspecified `allowedTools` never strips role tools, ensure `code-craft` (if kept) never blocks `Bash(node:*)` / `engine/*.mjs` runs, keep suggestion messages smooth & clean, and add regression tests. |
| **AH-2** | `.harness/doctor.mjs` (~151–160) | Has zero awareness of `.claude/skills/*/.foundry.json` or smooth compatibility guidance. | Misses stale skills, missing harness pointers, `team.json` overrides blocking `autoApply`, or role/tool mismatches. | Scan `.claude/skills/*/.foundry.json` if present: verify `.harness/skills/<name>/SKILL.md` pointer exists (`Skill-Foundry` wins on conflict), verify tool coverage & `team.json`, and emit smooth, actionable fixes (without leaking internal Foundry rules/secrets). |
| **AH-3** | `.harness/roles/ba-analyst.json`, `qa-auditor.json`, `ux-designer.json` | `BA_ANALYST` & `UX_DESIGNER` lack `Bash(npm:*)`/`Bash(node:*)`; `QA_AUDITOR` lacks `Bash(node:*)`; `UX_DESIGNER` `writablePaths` is CSS/SCSS/LESS only (`ui-polish` & `a11y-audit` inspect/fix `.html`/`.jsx` too). | `engine/*.mjs` scripts in `design-system`, `ui-polish`, `a11y-audit`, `figure-craft` fail outside `DEV_ENGINEER`. | Decide via Decision **`H2`** (`Bash(node .claude/skills/*)` vs delegating engine step to `DEV_ENGINEER` cleanly). |
| **AH-4** | `.harness/skills/` (all 6 built-in skills on `lab`: `spec-writer`, `ui-craft`, `test-champion`, `api-craft`, `security-guard`, `code-craft`) | Template ships 6 skills overlapping/duplicating `Skill-Foundry` (notably 15-line `spec-writer` stub, `ui-craft`, `test-champion`), AND installer `KEEP_IF_PRESENT` leaves old template skills behind when updating older repos! | Violates PO rule *"Agentic-Harness provides ONLY the harness (+ 1 harness-matched skill); Skill-Foundry ALWAYS wins on duplicates/conflicts"*. | Per Decision **`H3`**: remove/retire duplicate domain skills (`spec-writer`, `ui-craft`, `test-champion`, etc.), retain ONLY the 1 approved harness-operational skill, AND teach `install.mjs` (on upgrade of older `.harness/`) to cleanly delete/migrate retired template skills (while marking/cleaning old stubs so `Skill-Foundry` wins). |
| **AH-5** | `install.mjs` (default `Skill-Foundry` support + offline traps) | Ends with harness steps only; naive floating `npx` calls fail offline or break CI (`test/run-tests.mjs`). | `Agentic-Harness` should support `Skill-Foundry` smoothly out of the box per TAIMO's goal. | Implement via Decision **`H4`**: auto-sync `npx github:sumtaimo/Skill-Foundry add --all` cleanly (or `--with-skills`), with `--no-skills`, `HARNESS_OFFLINE=1`, idempotent re-runs, and graceful offline warning (exit 0). Also protect confidential UX wording per Section 1 #4. |
| **AH-6** | `install.mjs` (~174–184) | Projects installed before `<!-- agentic-harness -->` marker existed get duplicate `# Agentic harness` blocks on re-install *(confirmed on `Skill-Foundry`)*. | Re-updating older projects creates duplicate root prompt blocks (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`). | Detect legacy harness headers and insert/upgrade inside markers cleanly in place without appending duplicates. |
| **AH-7** | `watch.mjs` / `daemon.mjs`, `/harness:run`, `/harness:auto`, `AGENTS.md` | Orchestrator/daemon wait loops do not implement TAIMO's shrinking check-in schedule (`L19` captured in `Skill-Foundry/docs/factory/notes/phase-c-harness-followup.md`). | Long worker jobs/usage-limit waits use fixed/inefficient intervals. | Implement **Shrinking Follow-Up Schedule (`L19`)**: check at **30 min** after start → if not done, **15 min** later → then every **5 min** until done/stopped/blocked (usage-limit counts as not done: resume after reset time and continue schedule). Document in `/harness:run`, `/harness:auto`, `AGENTS.md`, and add simulation test (`H6`). |

---

## 4. Open PO Decisions Required Before Implementation (`H1`–`H6`)

Claude Code in `sumtaimo/Agentic-Harness` MUST confirm these with TAIMO in plain Khmer before editing `lab`:

1. **`H1` — Multi-Skill Composition & `Bash` Rules (`matchSkills` + `computeAllowedTools`):**
   - Compose explicit harness skill cleanly with `Skill-Foundry` `autoApply: true` pointers AND ensure `computeAllowedTools` preserves `Bash(npm test:*)` and `Bash(node:*)` for `engine/*.mjs` — OK?
2. **`H2` — Security Rule for `engine/*.mjs` Outside `DEV_ENGINEER` (`BA_ANALYST`, `QA_AUDITOR`, `UX_DESIGNER`):**
   - *(a — Recommended)* Grant narrow `Bash(node .claude/skills/*)` (verify exact `covers()` prefix match in `governance.mjs` + Claude CLI first!) to roles using engine skills.
   - *(b)* Keep `Bash(node:*)` on `DEV_ENGINEER` only and have `doctor.mjs` advise delegating engine runs smoothly.
3. **`H3` — Exact Cleanup of `Agentic-Harness` Built-In Skills (Only 1 Harness Skill Kept; `Skill-Foundry` Wins Duplicates):**
   - Confirm: out of `lab`'s 6 current built-in skills (`code-craft`, `ui-craft`, `spec-writer`, `test-champion`, `api-craft`, `security-guard`), **which exact `1` harness-matched skill stays** (e.g., a slimmed `code-craft` stripped of `Bash(node:*)` conflicts, or a dedicated harness-worker loop skill), and approve deleting the duplicate/conflicting ones (`spec-writer`, `ui-craft`, `test-champion`, etc.) + deleting retired copies on older project upgrades?
4. **`H4` — Default One-Link Auto-Pull Behavior in `Agentic-Harness` `install.mjs`:**
   - *(a — Matches PO default-support goal)* Auto-run `npx github:sumtaimo/Skill-Foundry add --all` **by default** at the end of `Agentic-Harness` install (with `--no-skills` opt-out + graceful offline fallback so install still exits 0 without internet), keeping messaging smooth & protected.
   - *(b)* Opt-in via `--with-skills` flag only.
5. **`H5` — Target Reference of `Skill-Foundry` (`master` vs pinned tag):**
   - Call `npx github:sumtaimo/Skill-Foundry add --all` (default `master` after `Skill-Foundry` Phase B ships) or pin a release tag?
6. **`H6` — Shrinking Follow-Up Schedule (`L19` — `30 → 15 → 5` min in `AH-7`):**
   - Confirm applying the `30 → 15 → 5` minute schedule cleanly to `daemon.mjs` / `watch.mjs` + `/harness:run` + `/harness:auto` + `AGENTS.md` (and exact handling on usage-limit cooldown wait).

---

## 5. Verification Checklist Inside `sumtaimo/Agentic-Harness` (Before `lab` → `release`)

1. `npm test` and `npm run audit` pass cleanly (`test/run-tests.mjs` stays 100% offline-safe via `HARNESS_OFFLINE=1` / mocks and cleans temp dirs).
2. Regression tests cover:
   - `matchSkills()` composing the retained harness skill + `Skill-Foundry` `autoApply: true` pointers.
   - **`computeAllowedTools()` multi-skill test:** composing retained skill + `Skill-Foundry` pointer (with & without `engine/`) NEVER strips `Bash(npm test:*)`, `Bash(node --test:*)`, or `Bash(node:*)`.
   - Old duplicate harness skills (`spec-writer`, `ui-craft`, etc.) cleaned up on upgrade and `Skill-Foundry` winning on collision.
   - `doctor.mjs` scanning `.claude/skills/*/.foundry.json` cleanly + smooth output.
   - `install.mjs` legacy `AGENTS.md` marker upgrade without duplicate blocks + graceful offline fallback.
   - **`L19` long-job schedule test:** asserts check times `30, 45, 50, 55...` minutes and stops cleanly on completion (`phase-c-harness-followup.md:25-26`).
3. **Mandatory Live Dual-Order Integration Test (against completed `Skill-Foundry`):**
   - **Order 1 (`Agentic-Harness` first → `Skill-Foundry` second)** & **Order 2 (`Skill-Foundry` first → `Agentic-Harness` update second)** both exit `0` with zero duplicates, zero invalid `Write(...)` rules, working pointers, and `doctor` healthy.

---

## 6. After `Agentic-Harness` Releases (`lab` → `release`) — Final Closure (Phase C)

1. Merge `Skill-Foundry` Phase B working branch to `master` (if not merged yet) per `docs/factory/PUBLISHING.md`.
2. Return to `Skill-Foundry` for **Phase C (`Workstream 3`)**: run `npx github:sumtaimo/Agentic-Harness#release .` **without `--reset`**, verify zero duplicate `AGENTS.md` headers, remove stale `gemini`/`orca` entries, and confirm `node .harness/doctor.mjs` + `npm test` pass cleanly.
3. Smoke-test in a clean temporary folder:
   - `Skill-Foundry`-only user (`npx github:sumtaimo/Skill-Foundry add --all`) → gets ONLY skills + protection + `AGENTS.md`, no `.harness/` installed.
   - `Agentic-Harness` user (`npx github:sumtaimo/Agentic-Harness#release .`) → gets harness + seamless default `Skill-Foundry` integration with zero duplicate skills or tool conflicts.
