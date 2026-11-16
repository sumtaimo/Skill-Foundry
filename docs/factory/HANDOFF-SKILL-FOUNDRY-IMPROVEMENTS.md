# Handoff Brief: Skill Foundry Platform, Site `npx` UX, Auto-Positioning `doctor`, and Agentic-Harness Sync

> **Document Purpose:** Executable engineering handoff brief prepared for **Claude Code** on `sumtaimo/Skill-Foundry`.
> **Current Repo State (corrected 2026-11-16; branches `master` = released, `lab` = staging, see `docs/factory/STATUS.md`):**
> - **Phase A (`Workstream 2` core CLI + `doctor` + Cross-Repo Gate):** **`[DONE on master 2a27637]`** (`src/factory/foundry.mjs`, `tests/factory-foundry-cli.test.mjs`, `tests/factory-foundry-gate.test.mjs`).
> - **Phase B (`Workstream 1` site `npx` UX, new layout, 8 roles, `W2-8`, `W2-9`):** **`[DONE on master 6d0c255]`**. Shorter skill pages are **on `lab`** and wait for the release.
> - **Phase C (`Workstream 3`, re-update `.harness/` here):** **`[DROPPED by TAIMO 2026-11-16]`**. Rule L23: this project never changes the Agentic Harness; the `.harness/` copy here is updated from the `Agentic-Harness` project by TAIMO or its own session.
> - **Skill backlog from real use (S1 to S7):** in progress on `lab`; the list and status are in `docs/factory/STATUS.md` section 4.
> - **Release path:** work branch, then `lab`, then TAIMO confirms in chat, then `master` (`docs/factory/PUBLISHING.md` section 3b).
> **Scope Boundary:** Does **not** modify any skill folder under `src/skills/**` (one skill per session rule, `AGENTS.md` SKILL QUALITY LAW #8) or `src/factory/locks.json`.
> **Companion Doc (for `sumtaimo/Agentic-Harness`):** [`docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md`](HANDOFF-AGENTIC-HARNESS-SYNC.md)

---

## 0. Ready-to-Paste Kickoff Prompt for Claude Code (Phase B)

Copy and send this prompt to Claude Code inside `sumtaimo/Skill-Foundry` (on working branch `claude/foundry-harness-sync` or a fresh `claude/<topic>` branch from `origin/master` — never directly on `master`):

```text
Read `AGENTS.md`, `docs/PROJECT.md`, `docs/factory/PUBLISHING.md`, `.harness/memory/profile.md`,
`.harness/memory/lessons.md`, and `docs/factory/HANDOFF-SKILL-FOUNDRY-IMPROVEMENTS.md`.

Work strictly in this order:
1. Confirm we are on a `claude/...` working branch synced with `origin/master` (never edit directly on `master`), run `npm run setup` once if needed, and note that Phase A (`foundry.mjs` + `doctor` + gate tests) already landed in commit `2a27637`.
2. Ask TAIMO (Product Owner) in plain Khmer to confirm only the remaining Phase B Decisions (D2, D3, D4b, D6 in Section 6) before editing `src/site/`, `src/factory/registry.json`, or `foundry.mjs`.
3. Follow the Product Boundary, Skill-Foundry Precedence, and Smooth Confidentiality Rules in Section 0a strictly (`Skill-Foundry` ships ONLY skills — never `Agentic-Harness`).
4. Execute Phase B (`Workstream 1`: `src/site/**`, `llms.txt`, `skills.json`, tests, plus any approved `foundry.mjs` `W2-8` refinement). Do NOT edit `src/skills/**` or `src/factory/locks.json`.
5. Verify with `npm test`, `node src/site/build.mjs --check`, `npm run guard`, Playwright visual check (`1440`/`390` light/dark if installed), and `npm run release:check`; commit cleanly on the working branch and print the exact finished branch/commit link + Phase B summary ready to hand into `sumtaimo/Agentic-Harness` (`docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md`).
```

---

## 0a. Confirmed Product Boundary, Precedence & Smooth UX Rules (MANDATORY — TAIMO 2026-11-16)

Every agent working on `Skill-Foundry` MUST obey these 4 owner rules without exception:

1. **Strict Two-Product Boundary (`Skill-Foundry` provides ONLY Skills):**
   - `npx github:sumtaimo/Skill-Foundry` delivers **only the skills** (`.claude/skills/<name>/` + `.foundry.json`), `AGENTS.md`, `.claude/settings.json` edit protection, pointer auto-positioning **if** `.harness/skills/` already exists, and `doctor` advice.
   - `Skill-Foundry` **never** installs, ships, or bundles `Agentic-Harness` (`.harness/`) into users' projects.
   - When a user does **not** have `.harness/`, `Skill-Foundry` works cleanly on its own and may lightly inform them (without clutter or hard-selling) that connecting `sumtaimo/Agentic-Harness` works smoothly alongside it.
   - *(Conversely, inside the separate `sumtaimo/Agentic-Harness` repo, `Agentic-Harness` provides only the harness and may support `Skill-Foundry` by default — see [`HANDOFF-AGENTIC-HARNESS-SYNC.md`](HANDOFF-AGENTIC-HARNESS-SYNC.md).)*
2. **`Skill-Foundry` Wins on Any Duplicate or Conflicting Skill:**
   - Whenever an older or overlapping harness built-in skill conflicts with or duplicates a `Skill-Foundry` skill (for example starter stubs or legacy domain skills inside `.harness/skills/`), **`Skill-Foundry` wins** and should cleanly replace/update the old harness copy (preserving `.orig` backup or checking a harness starter marker so custom user-authored skills are still respected).
3. **Smooth UX & Confidentiality During Skill Usage ("Protect Skill Info"):**
   - When an agent runs Skill Foundry skills for a user's real task — or surfaces compatibility suggestions — **keep output smooth, task-focused, and natural**.
   - Do **not** expose internal Skill Foundry rules, layer structure, evaluation criteria, or protection mechanics inside user-facing deliverables, and do **not** mention internal skill names unnecessarily ("no need to mention our skills; we protect this information too — just guide smoothly so everything works together cleanly").
4. **Never Leave Stale Info for Future Agents:**
   - Keep `AGENTS.md` managed blocks, `llms.txt`, `skills.json`, and site copy honest and synchronized with `foundry.mjs` (`Edit(...)` deny rules, 8 roles, `doctor`).

---

## 1. Reusable Prompt Blueprint: Token-Saving Sequential Multi-Skill Orchestrator

> **Phase A Note:** `foundry.mjs` (`rulesBlock()`, lines 142–154 on `origin/master`) ALREADY injects the 4 compact chaining rules (lazy loading, file handoff, compact JSON state, read-only reporting + `doctor`) into managed `AGENTS.md` blocks. Keep the full reusable prompt blueprint below aligned for recipes, docs, and site/agent guidance:

````markdown
# Role & Execution Mode
You are orchestrating a multi-step workflow across sequential steps (`Step 1` → `Step 2` → `Step 3`). Follow strict context hygiene to minimize token usage while preserving 100% of critical facts.

# Pre-Flight Project Compatibility Check (Run Once Before Step 1)
1. Inspect the target repository's agent setup (`.harness/`, `.claude/`, `AGENTS.md`, `.cursor/`, `.github/`, `.windsurfrules`).
2. Check if active workflow configs, role tool limits, or permission rules conflict with smooth execution; report mismatches clearly with the simple fix command without silently modifying protected files.

# Token-Saving Handoff Rules (MANDATORY)
1. **Lazy Skill Loading:** Load ONLY the active step's `SKILL.md` and required layers. Unload or ignore previous step instructions once completed.
2. **No Raw History Dumping:** NEVER pass raw file contents, full search logs, or long reasoning between steps. Save outputs to files/artifacts and pass paths + concise verified facts.
3. **Structured State Compression:** At the end of each step, emit ONLY a compact JSON handoff payload matching this schema before moving to the next step:

```json
{
  "step_completed": "<step_name>",
  "verified_facts": ["<concise fact + file/line or artifact path>"],
  "gaps_or_risks": ["<specific blocker or edge case>"],
  "next_skill_input": {
    "target_scope": "<exact files or modules>",
    "action_required": "<1-sentence directive>"
  }
}
```
````

---

## 2. Workstream 1 (Phase B — `[PENDING]`): Showcase Website `npx` UX & Agent Discovery Audit (`src/site/`)

### Goal
Every visitor (human developer/PO/QA or AI agent) should see **`npx github:sumtaimo/Skill-Foundry`** as the clear, unified primary install & lifecycle path across the landing page, skill cards, skill detail pages, `"Give this to your agent"` prompt, `skills.json`, and `llms.txt` — while keeping `.zip` + SHA-256 + `curl/unzip` cleanly as an explicit offline/no-Node fallback, and clearly stating that **`npx` installs only the skills** (wiring cleanly into an existing `.harness/` if present, or running standalone).

### Expected User Outcome: What Copying & Running `npx` Delivers

| Deliverable in Target Project | Current State on `origin/master` (`2a27637`) | Phase B Remaining Gap / Target State |
|---|---|---|
| **Skill files (`.claude/skills/<name>/`)** | **`[DONE in foundry.mjs]`** Copies `SKILL.md`, 10 layers, `references/`, `engine/`, `examples/`, `preview.json` (excludes `evals/`, `_template/`, `skill-smith`). Writes `.foundry.json` SHA-256 stamp so `update` keeps user edits (`--force` resets). | **`[PENDING in src/site/]`** Card & header `"Copy install command"` (`render.mjs:56-59`) still copies `curl/unzip`, **bypassing** `.foundry.json`, `AGENTS.md`, protection, and `.harness/` wiring! (`W1-3` switches default copy to `npx`). |
| **Universal agent rules (`AGENTS.md`)** | **`[DONE in foundry.mjs:142-167]`** Managed block (`<!-- skill-foundry:begin -->`) with lazy-loading + file-handoff + JSON state + `doctor` reminder (`--no-rules` opt-out; keeps outside text untouched). | Verify phrasing follows Section 0a smooth confidentiality rules; sync site `#install` / `#agents` summary. |
| **Edit guard rails (`.claude/settings.json`)** | **`[DONE in foundry.mjs:170-189]`** Valid `Edit(.claude/skills/**)` and `Edit(.harness/skills/**)` deny rules; auto-strips legacy invalid `Write(...)` rules (`--no-protect` opt-out). | Site docs (`#install`) reflect `Edit(...)` protection accurately without claiming harness ownership. |
| **Existing `.harness/skills/` wiring** | **`[DONE in foundry.mjs:87-107]`** If `.harness/skills/` exists, creates non-stripping pointer (`['Edit', 'Write', 'Bash']` only for `engine/` skills; empty for others) across 8 roles + custom `.harness/roles/*.json`; warns on collision (`--sync-harness` replaces + saves `.orig`). | **`[W2-8 optional refinement]`** Per Section 0a #2: allow `Skill-Foundry` to auto-win/replace recognized `Agentic-Harness` starter stubs seamlessly (per Decision `D4b`) without risking user-custom skills. |
| **Projects without `.harness/`** | **`[DONE in foundry.mjs:340-350]`** Installs cleanly into `.claude/skills/`, `AGENTS.md`, `.claude/settings.json`; `doctor` detects Cursor/Windsurf/Gemini/Copilot/`.claude/agents/` and prints light advice + optional `sumtaimo/Agentic-Harness` mention (does **not** install `.harness/`). | Clarify on landing `#install` / `#agents` (per Decision `D2`) that `Skill-Foundry` delivers skills only and integrates easily if they already use (or choose to add) `sumtaimo/Agentic-Harness`. |

### Confirmed Site Findings & Line Evidence (`src/site/` — `[PENDING]`)

| ID | Area | File:Line Evidence | Current Problem on `origin/master` | Required Fix / Target Behavior |
|---|---|---|---|---|
| **W1-1** | `#install` step order & clarity | [`src/site/lib/render.mjs:339-343`](../../src/site/lib/render.mjs#L339-L343), [`src/site/lib/i18n.mjs:46-49,166-169`](../../src/site/lib/i18n.mjs#L46-L49) | Numbered steps `install.s1..s3` still describe the manual `.zip` + SHA-256 + `unzip` flow **before** `npx`, and do not mention `doctor` or the "skills only + optional harness compatibility" boundary clearly. | Structure **Option 1: One-command `npx` lifecycle [recommended]** (showing single skill / `--role` / `--all` / `doctor` / `check` / `update` / `remove`) cleanly above **Option 2: Offline/no-Node `.zip` + SHA-256 fallback**. Keep `en` and `kh` complete and natural in `i18n.mjs`. |
| **W1-2** | Fragmented `npx` boxes & missing copy button | [`src/site/lib/render.mjs:344-346`](../../src/site/lib/render.mjs#L344-L346) | `npx` commands sit in 2 separate `<div class="codebox">` blocks: Box 1 has `add <skill>` with copy button; Box 2 dumps 5 commands **without a copy button** and omits `doctor`. | Unify/organize the `npx` command panel cleanly with working copy buttons and include `npx github:sumtaimo/Skill-Foundry doctor`. Keep test selectors intact or update tests in lockstep. |
| **W1-3** | Primary card & header `"Copy install command"` uses `curl/unzip` | [`src/site/lib/render.mjs:56-59,242,444`](../../src/site/lib/render.mjs#L56-L59), [`src/site/assets/site.js:247-257`](../../src/site/assets/site.js#L247-L257) | Clicking `"Copy install command"` on landing cards or skill headers copies `curl ... unzip` over HTTP(S), bypassing `.foundry.json`, `AGENTS.md`, protection, and `.harness/` wiring. | Make `"Copy install command"` copy `npx github:sumtaimo/Skill-Foundry add <name>` for portable skills (keeping `.zip`/`curl` as secondary/fallback). *(Factory-only skills like `skill-smith` remain repo/zip only.)* |
| **W1-4** | `agents.prompt`, `llms.txt`, and `skills.json` | [`src/site/lib/i18n.mjs:115,235`](../../src/site/lib/i18n.mjs#L115), [`src/site/build.mjs:89-122`](../../src/site/build.mjs#L89-L122) | `llms.txt` and `agents.prompt` direct AI agents to raw `curl/unzip` (*"a folder to unzip into .claude/skills/"*) instead of `npx github:sumtaimo/Skill-Foundry`. | Make `npx github:sumtaimo/Skill-Foundry add <name>` (plus `doctor` / `check` / `update`) primary in `llms.txt`, `skills.json`, and `agents.prompt` (`en` + `kh`), keeping zip/curl SHA-256 details as no-Node fallback. |
| **W1-5** | Site role filter hardcoded to 4 roles | [`src/site/lib/render.mjs:254`](../../src/site/lib/render.mjs#L254), [`src/site/lib/content.mjs:15`](../../src/site/lib/content.mjs#L15), [`src/site/lib/i18n.mjs:96-99,216-219`](../../src/site/lib/i18n.mjs#L96-L99) | Site filter hardcodes `['PO_ARCHITECT', 'BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR']`, while `foundry.mjs:31` already supports 8 roles (`UX_DESIGNER`, `REVIEWER`, `SECURITY`, `COORDINATOR`). | Align `ROLES` across `content.mjs`, `render.mjs`, `i18n.mjs` (`en` + `kh`), and `registry.json` per Decision **D3** (hide empty roles cleanly or show friendly empty state). |

### Affected Tests to Update Together (Not Bypass!)
- [`tests/site-finder.test.mjs:28-33,73-79,133-135,163-173`](../../tests/site-finder.test.mjs#L28-L33) — asserts `llms.txt` `curl` pattern, `plate [data-install-zip]` `data-copy` regex, `skill-head` install button, and `agents.prompt`.
- [`tests/factory-foundry-cli.test.mjs:61-69`](../../tests/factory-foundry-cli.test.mjs#L61-L69) — asserts `#install` HTML `npx` strings.
- [`tests/site-i18n.test.mjs`](../../tests/site-i18n.test.mjs), [`tests/site-own-style.test.mjs`](../../tests/site-own-style.test.mjs), [`tests/site-links.test.mjs`](../../tests/site-links.test.mjs), [`tests/site-visual.test.mjs`](../../tests/site-visual.test.mjs).

---

## 3. Workstream 2 Status Summary (`src/factory/foundry.mjs`)

### Already Completed & Verified on `origin/master` (`2a27637`) — Do NOT Redo!
- **`W2-1` `[DONE]`:** `DENY` uses `Edit(.claude/skills/**)` and `Edit(.harness/skills/**)`; strips `LEGACY_DENY` `Write(...)` rules automatically (`foundry.mjs:170-189`).
- **`W2-2` `[DONE]`:** `pointerTools(s)` emits `['Edit', 'Write', 'Bash']` for `engine/` skills and omits `allowedTools` otherwise so role `Bash(npm test:*)` / `Bash(node:*)` are never wiped (`foundry.mjs:81,104`).
- **`W2-3` `[DONE in foundry.mjs]`:** `ROLES` expanded to 8 roles + dynamic `.harness/roles/*.json` scanning (`foundry.mjs:31,62-72`). *(Note: `src/factory/registry.json` role updates still pending Decision `D3`.)*
- **`W2-4` `[DONE baseline]`:** Collision no longer fails silently — emits explicit warning + supports `--sync-harness` with `SKILL.md.orig` backup (`foundry.mjs:93-98,383`). *(See `W2-8` below for auto-precedence on starter stubs.)*
- **`W2-5` `[DONE]`:** `rulesBlock()` upgrades `AGENTS.md` with 4 chained-skill rules (lazy loading, file handoff, compact JSON state, `doctor` pointer, read-only restraint) (`foundry.mjs:142-154`).
- **`W2-6` `[DONE]`:** Full `doctorProject()` + `doctor [--fix] [--json]` + compact post-`add`/`update` summary (`foundry.mjs:247-372,410-419`).
- **Cross-Repo Gate `[DONE]`:** [`tests/factory-foundry-gate.test.mjs`](../../tests/factory-foundry-gate.test.mjs) tests Order 1 (`Harness → Foundry`) and Order 2 (`Foundry → Harness`) against real `.harness/lib/governance.mjs` code.

### Remaining Workstream 2 Follow-Ups for Phase B (Small & Targeted)
| ID | Target | Gap / Requirement |
|---|---|---|
| **W2-8** | `foundry.mjs:93-98` + `tests/factory-foundry-cli.test.mjs` | **Skill-Foundry Precedence Over Legacy `Agentic-Harness` Built-In Skills (Decision `D4b`):** Per Section 0a #2, when `.harness/skills/<name>/SKILL.md` is an old/starter duplicate from `Agentic-Harness` (e.g., carries `starter-stub: agentic-harness` or matches known starter stub content, NOT user-written custom code), `Skill-Foundry` should **win and replace it automatically** (saving `SKILL.md.orig`), reserving collision-skip strictly for genuinely user-written custom skills unless `--sync-harness` is passed. |
| **W2-9** | `src/factory/foundry.mjs` (`writeRules`, `doctorProject`) | **Audit Messaging Against Smooth Confidentiality Rule (Section 0a #3):** Ensure user-facing tips and `doctor` output stay crisp, helpful, and focused on making the user's setup work smoothly without leaking unnecessary internal skill/protection mechanics. |

---

## 4. Workstream 3 (Phase C): **DROPPED (TAIMO, 2026-11-16; rule L23)**. Kept below for reference only, do not execute

> **Execution Timing:** Run **ONLY after** Step 2 (`sumtaimo/Agentic-Harness` `lab` → `release`) ships! TAIMO approved **`D1 (b)`** on 2026-11-16 (`docs/factory/notes/phase-c-harness-followup.md:3`).

### Exact Safety Checklist When Phase C Begins (TAIMO Approval Required Before Editing `.harness/`)
1. **Never pass `--reset`** (keeps `.harness/memory/profile.md`, `lessons.md`, `charter.md`, `backlog.json`, `.harness/skills/copy-tight/`).
2. **Pre-check `AGENTS.md` + root instruction files** (`CLAUDE.md`, `GEMINI.md`, `.cursor/rules/harness.mdc`, `.github/copilot-instructions.md`) for missing `<!-- agentic-harness -->` marker so updating never duplicates sections.
3. **Clean stale `gemini`/`orca`** entries in `.harness/config.json:9-168` and `.harness/team.json:19-34` (which `KEEP_IF_PRESENT` keeps).
4. **Preserve & verify Skill-Foundry coexistence:** Confirm `.claude/skills/*/.foundry.json`, `.harness/skills/*` pointers (`Skill-Foundry` winning over any harness duplicate), `.claude/settings.json` `Edit(...)` rules, `node .harness/engines.mjs` consent, `node .harness/team.mjs validate`, `node .harness/doctor.mjs`, and `npm test`.
5. **Confirm `L19` follow-up schedule** (`30 → 15 → 5` minutes, [`docs/factory/notes/phase-c-harness-followup.md`](notes/phase-c-harness-followup.md)) came cleanly with the `Agentic-Harness` release.

---

## 5. Phased Execution Plan & End-of-Phase-B Handoff

| Phase | Target Files | Deterministic Checks |
|---|---|---|
| **Phase A** | ~~`foundry.mjs`, `factory-foundry-cli.test.mjs`, `factory-foundry-gate.test.mjs`~~ | **`[DONE on master 2a27637]`** |
| **Phase B** *(`[DONE on master 6d0c255]`)* | `src/site/**`, `tests/site-*.test.mjs`, `src/factory/registry.json` (`D3`), optional `foundry.mjs` `W2-8` / `W2-9` (`D4b`) | `npm test`, `node src/site/build.mjs --check`, `npm run guard`, Playwright `1440`/`390` visual check (if installed), `npm run release:check` |
| **Step 2** *(Separate repo `sumtaimo/Agentic-Harness` `lab`)* | Execute [`HANDOFF-AGENTIC-HARNESS-SYNC.md`](HANDOFF-AGENTIC-HARNESS-SYNC.md) with completed `Skill-Foundry` link (`D1 (b)` includes `L19` + pruning duplicate harness skills) | `npm test`, `npm run audit`, Dual-Order Integration Test, release `lab` → `release` |
| **Phase C** *(`[DROPPED]`, L23)* | Safe `.harness/` sync from `Agentic-Harness#release`, dedup `AGENTS.md`, clean stale `gemini`/`orca` | `node .harness/team.mjs validate`, `node .harness/doctor.mjs`, `npm test` |

### End-of-Phase-B Deliverable (So TAIMO Can Jump Straight Into Step 2 `Agentic-Harness`)
At completion of Phase B, Claude Code MUST print for TAIMO:
1. The exact **finished `Skill-Foundry` link** (`branch` / `commit SHA` / `master` tag if merged).
2. A **pre-filled copy block** matching [`HANDOFF-AGENTIC-HARNESS-SYNC.md`](HANDOFF-AGENTIC-HARNESS-SYNC.md) (`Section 0`) AND reminding TAIMO to paste the full `HANDOFF-AGENTIC-HARNESS-SYNC.md` into Claude Code inside `sumtaimo/Agentic-Harness` (`lab` branch).

---

## 6. PO Decisions (`D2`, `D3`, `D4b`, `D6`): ALL RESOLVED 2026-11-16 (kept as record)

> Resolved as: D2 (a) npx primary; D3 8 roles, `UX_DESIGNER` only on design-system and ux-review; D4b recognised harness starter copies are replaced automatically with `.orig` kept; D6 keep read-only advice; D7 opt-in `--with-skills`. Full table: `docs/factory/STATUS.md` section 2.

Claude Code MUST confirm only these remaining items with TAIMO in plain Khmer (already resolved: `D1 = b`, `D5 = bare/omitted pointerTools shipped`, `D7` belongs in `Agentic-Harness` `H4`):

1. **`D2` — Exact Copy on Card/Header Button & Site Harness Mention (`W1-1`–`W1-4`):**
   - On cards/skill headers: switch primary `"Copy install command"` to copy `npx github:sumtaimo/Skill-Foundry add <name>`, keeping `.zip` / `curl` clearly labeled as offline/no-Node fallback — OK?
   - On `#install` / `#agents`: add a crisp 1-line note clarifying **"Skill Foundry installs only the skills (+ `AGENTS.md` & edit protection); it wires into an existing `.harness/` automatically, or you can pair it with `sumtaimo/Agentic-Harness` separately"** — OK?
2. **`D3` — Role Filter Expansion (`W1-5`) & `src/factory/registry.json`:**
   - `foundry.mjs` already supports 8 roles (`PO_ARCHITECT`, `BA_ANALYST`, `DEV_ENGINEER`, `QA_AUDITOR`, `UX_DESIGNER`, `REVIEWER`, `SECURITY`, `COORDINATOR`).
   - Confirm: Which existing skills in `registry.json` should gain `UX_DESIGNER`, `REVIEWER`, or `SECURITY` (remember `UX_DESIGNER` in harness `lab` currently owns CSS/SCSS/LESS only, while `design-system` outputs tokens/CSS cleanly and `ui-polish`/`a11y-audit` also check HTML/JSX)? And should the site role filter show all 8 roles or only roles that currently have >=1 ready skill?
3. **`D4b` — Auto-Replacing Old/Duplicate `Agentic-Harness` Built-In Skills (`W2-8`):**
   - Today `foundry.mjs:94` leaves any existing `.harness/skills/<name>/SKILL.md` without `installed-by: skill-foundry` untouched unless `--sync-harness` is passed.
   - Since you ruled **`Skill-Foundry` ALWAYS wins over duplicate/conflicting `Agentic-Harness` skills**: should `foundry.mjs` **automatically replace** recognized `Agentic-Harness` built-in/starter skills (saving `.orig` backup) even without `--sync-harness`, while still preserving unknown user-written custom skills?
4. **`D6` — Non-Harness Projects (`.cursor/`, `.windsurfrules`, `GEMINI.md`):**
   - `foundry.mjs` currently keeps installing `.claude/skills/` + `AGENTS.md` + `.claude/settings.json` and lets `doctor` print tool-specific instructions. Keep this read-only advice behavior (Recommended — zero surprise files), OR also add an opt-in `--sync-tools` flag to write `.cursor/rules/skills.mdc` / `@AGENTS.md` automatically?
   - Also check whether any wording in `doctor` or `AGENTS.md` exposes too much internal detail and should be softened per Section 0a #3.
