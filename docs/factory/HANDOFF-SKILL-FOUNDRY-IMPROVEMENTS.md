# Handoff Brief: Skill Foundry Platform, Site `npx` UX, Auto-Positioning `doctor`, and Agentic-Harness Sync

> **Document Purpose:** Executable engineering handoff brief prepared for **Claude Code** (or another coding session) on `sumtaimo/Skill-Foundry`.
> **Investigation Status:** Completed read-only audit as of **2026-11-16** — **0 code files modified** yet.
> **Scope Boundary:** Platform/Site/CLI improvements (`src/site/**`, `src/factory/foundry.mjs`, `src/factory/registry.json`, `tests/**`) + `.harness/` re-update plan. Does **not** modify any skill folder under `src/skills/**` (one skill per session rule, `AGENTS.md` SKILL QUALITY LAW #8).
> **Companion Doc (for the other repo):** [`docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md`](HANDOFF-AGENTIC-HARNESS-SYNC.md)

---

## 0. Ready-to-Paste Kickoff Prompt for Claude Code

Copy and send this prompt to Claude Code inside `sumtaimo/Skill-Foundry` (on the `claude/foundry-harness-sync` working branch — never directly on `master`):

```text
Read `AGENTS.md`, `docs/PROJECT.md`, `docs/factory/PUBLISHING.md`, `.harness/memory/profile.md`,
`.harness/memory/lessons.md`, and `docs/factory/HANDOFF-SKILL-FOUNDRY-IMPROVEMENTS.md`.

Work strictly in this order:
1. Ensure we are on working branch `claude/foundry-harness-sync` (never edit directly on `master`), run `npm run setup` once if needed, verify the cited file:line references, and inspect Section 6 (Open PO Decisions D1–D7).
2. Ask TAIMO (Product Owner) in plain Khmer to confirm Decisions D1–D7 before editing `.harness/` or product behavior.
3. Once approved, execute Workstream 3 (safe `.harness/` update if approved), then Workstream 2 (`foundry.mjs` + `doctor`), then Workstream 1 (`src/site/` + `llms.txt` / `skills.json`).
4. Respect one-skill-per-session (do NOT edit `src/skills/**` or `src/factory/locks.json`).
5. Verify every phase with `npm test`, `node src/site/build.mjs --check`, `node .harness/doctor.mjs`, and `npm run guard` (plus `npm run release:check` before release), commit cleanly on `claude/foundry-harness-sync` (never push/merge `master` without TAIMO approval), and print the exact completed branch/commit link + agreed D1–D7 summary ready to paste into `sumtaimo/Agentic-Harness` (`docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md`).
```

---

## 1. Reusable Prompt Blueprint: Token-Saving Sequential Multi-Skill Orchestrator + Pre-Flight Harness Doctor

> Keep this prompt verbatim for users and as the behavior target for `AGENTS.md` (managed block in `foundry.mjs writeRules()`) and recipe/agent guidance.

````markdown
# Role & Execution Mode
You are orchestrating a multi-step workflow across sequential skills (`Skill 1` → `Skill 2` → `Skill 3`). Follow strict context hygiene to minimize token usage while preserving 100% of critical facts.

# Pre-Flight Project & Harness Compatibility Check (Run Once Before Step 1)
1. Inspect the target repository for `.harness/` (or other instruction/skill config: `.claude/`, `AGENTS.md`, `.cursor/`, `.github/`, `.windsurfrules`).
2. Check if Skill Foundry skills are positioned correctly and whether any harness rule, role tool limit (`allowedTools`), explicit `team.json` `skills` override, or deny rule conflicts with the active workflow.
3. Report detected mismatches as actionable advice before proceeding; **never** silently edit user harness/governance files unless explicitly approved.

# Token-Saving Handoff Rules (MANDATORY)
1. **Lazy Skill Loading:** Load ONLY the active skill's `SKILL.md` and required layers for the current step. Unload or ignore previous skill instructions once their step completes.
2. **No Raw History Dumping:** NEVER pass raw file contents, full search logs, or long conversational reasoning from one skill to the next. Write intermediate deliverables to disk/artifacts and pass paths + facts.
3. **Structured State Compression:** At the end of each skill, emit ONLY a compact JSON handoff payload matching this schema before invoking the next skill:

```json
{
  "step_completed": "<skill_name>",
  "verified_facts": ["<concise fact + file/line or artifact path>"],
  "gaps_or_risks": ["<specific blocker or edge case>"],
  "next_skill_input": {
    "target_scope": "<exact files or modules>",
    "action_required": "<1-sentence directive>"
  }
}
```
````

### Target Code Integration for This Blueprint
- [`src/factory/foundry.mjs:105-116`](../../src/factory/foundry.mjs#L105-L116) (`writeRules()`): Currently only writes *"Use one skill per step; when a request needs several, use them in the order the request gives."* Upgrade the managed `AGENTS.md` block so any agent (Claude, Codex, Cursor, Gemini, Windsurf) also follows **Lazy Skill Loading** + **Artifact/Compact JSON State Handoff** across chained skills without dumping full raw logs.

---

## 2. Workstream 1: Showcase Website `npx` UX & Agent Discovery Audit (`src/site/`)

### Goal
Every visitor (human developer/PO/QA or AI agent) should see **`npx github:sumtaimo/Skill-Foundry`** as the unified, primary install & lifecycle path across the landing page, cards, skill detail pages, `"Give this to your agent"` prompt, `skills.json`, and `llms.txt` — while keeping `.zip` + SHA-256 + `curl/unzip` available cleanly as an explicit fallback for environments without Node.js/git.

### Confirmed Findings & Line Evidence

| ID | Area | File:Line Evidence | Current Problem | Required Fix / Target Behavior |
|---|---|---|---|---|
| **W1-1** | `#install` step order | [`src/site/lib/render.mjs:339-343`](../../src/site/lib/render.mjs#L339-L343), [`src/site/lib/i18n.mjs:46-49,166-169`](../../src/site/lib/i18n.mjs#L46-L49) | Numbered steps `install.s1..s3` still describe the legacy manual `.zip` + SHA-256 + `unzip` flow **before** introducing `npx`. | Make `npx` (or dual-path clarity: **Option 1: One-command `npx` lifecycle [recommended]** vs **Option 2: Offline/no-Node `.zip` + SHA-256 fallback**) unmistakably structured. Update both `en` and `kh` in `i18n.mjs`. |
| **W1-2** | Fragmented `npx` boxes & missing copy button | [`src/site/lib/render.mjs:344-346`](../../src/site/lib/render.mjs#L344-L346) | `npx` commands are split across 2 separate `<div class="codebox">` blocks: Box 1 has `add <skill>` with a copy button, while Box 2 dumps 5 commands (`add --role QA_AUDITOR`, `add --all`, `check`, `update`, `remove <skill>`) **with NO copy button** and no `doctor` command. | Unify/organize the `npx` command panel cleanly (with working copy buttons on copyable commands/presets, clear workflow order: install one / by role / `--all` → `doctor` → `check` → `update` → `remove`). Ensure existing test selectors / assertions stay satisfied or updated alongside tests. |
| **W1-3** | Primary card & header `"Copy install command"` uses `curl/unzip` instead of `npx` | [`src/site/lib/render.mjs:56-59,242,444`](../../src/site/lib/render.mjs#L56-L59), [`src/site/assets/site.js:247-257`](../../src/site/assets/site.js#L247-L257) | On every landing card (`renderCard`) and every skill header (`renderSkillPage`), `installButton()` copies `mkdir -p .claude/skills && curl -fsSL ... unzip` when served over HTTP(S). Using `curl/unzip` bypasses `.foundry.json` version stamps, `.harness/skills/` role wiring, `AGENTS.md`, and `.claude/settings.json` protection. | Make primary `"Copy install command"` (or `"Copy npx install"` + secondary zip/curl toggle) copy `npx github:sumtaimo/Skill-Foundry add <name>` for portable skills, and clarify zip/curl as no-Node fallback. *(Note: `factoryOnly` skills like `skill-smith` stay zip/repo-only.)* |
| **W1-4** | `agents.prompt`, `llms.txt`, and `skills.json` direct AI agents to raw `curl/unzip` | [`src/site/lib/i18n.mjs:115,235`](../../src/site/lib/i18n.mjs#L115), [`src/site/build.mjs:89-122`](../../src/site/build.mjs#L89-L122) | `"Give this to your agent"` points to `llms.txt`, whose `install:` lines use `curl ... unzip` and whose intro calls every skill *"a folder to unzip into .claude/skills/"*. Neither `llms.txt` nor `skills.json` surfaces `npx github:sumtaimo/Skill-Foundry add <name>`, `--role`, `doctor`, `check`, or `update` as primary! | Update `agentIndex()` (`skills.json`) and `llmsTxt()` (`llms.txt`) to provide **`npxInstallCommand`** (`npx github:sumtaimo/Skill-Foundry add <name>`) as primary `installCommand` / documented first-class method, keeping `curl` + SHA-256 `zipInstallCommand` / fallback intact for environments without `npx`. Update `agents.prompt` (`en` & `kh`) accordingly. |
| **W1-5** | Site role filter hardcoded to 4 roles | [`src/site/lib/render.mjs:254`](../../src/site/lib/render.mjs#L254), [`src/site/lib/content.mjs:15`](../../src/site/lib/content.mjs#L15), [`src/site/lib/i18n.mjs:96-99,216-219`](../../src/site/lib/i18n.mjs#L96-L99) | Hardcodes `['PO_ARCHITECT', 'BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR']` only. Misses `UX_DESIGNER`, `REVIEWER`, `SECURITY`, `COORDINATOR` introduced in `Agentic-Harness` `lab` (`v1.0.9`). | Align `ROLES` across `content.mjs`, `render.mjs`, `i18n.mjs` (`en` + `kh`), and `foundry.mjs` once Decision **D3** confirms role expansion. |

### Affected Tests to Update Together (Not Bypass!)
- [`tests/site-finder.test.mjs:28-33,73-79,133-135,163-173`](../../tests/site-finder.test.mjs#L28-L33) — asserts `llms.txt` `curl` pattern, `plate [data-install-zip]` `data-copy` regex, `skill-head` install button, and `agents.prompt`.
- [`tests/factory-foundry-cli.test.mjs:61-69`](../../tests/factory-foundry-cli.test.mjs#L61-L69) — asserts exact HTML match for `npx github:sumtaimo/Skill-Foundry add --role QA_AUDITOR` and `npx github:sumtaimo/Skill-Foundry add ${s.name}<`.
- [`tests/site-i18n.test.mjs`](../../tests/site-i18n.test.mjs) — requires identical non-empty keys in `DICTS.en` and `DICTS.kh`.
- [`tests/site-own-style.test.mjs`](../../tests/site-own-style.test.mjs), [`tests/site-links.test.mjs`](../../tests/site-links.test.mjs), [`tests/site-visual.test.mjs`](../../tests/site-visual.test.mjs) — CSS tokens only, zero external scripts, `checkPage` at 1440px & 390px light/dark.

---

## 3. Workstream 2: Auto-Positioning Skills, `doctor`, Conflict Advice & `Agentic-Harness` Compatibility (`src/factory/foundry.mjs`)

### Goal
Whether a user's project **has** `sumtaimo/Agentic-Harness`, has a **different setup** (`.claude/`, Cursor, Windsurf, Gemini, Copilot, plain git repo), or has **no harness yet**, running `npx github:sumtaimo/Skill-Foundry add / update / doctor` must:
1. Auto-position skills cleanly into the right paths without clobbering user files.
2. Stay 100% valid against latest `Agentic-Harness` (`v1.0.6` `release` & `v1.0.9` `lab`).
3. Detect harness/role/tool/config conflicts automatically and emit clear, copyable advice so either the user OR their project's agent knows exactly what to add or fix.

### Confirmed Bugs & Exact Fixes Needed in `src/factory/foundry.mjs`

| ID | File:Line | Confirmed Bug / Gap | Exact Fix Specification |
|---|---|---|---|
| **W2-1** | [`foundry.mjs:118`](../../src/factory/foundry.mjs#L118) & [`tests/factory-foundry-cli.test.mjs:117`](../../tests/factory-foundry-cli.test.mjs#L117) | `DENY` writes invalid rules `'Write(.claude/skills/**)'` and `'Write(.harness/skills/**)'`. Latest `Agentic-Harness` (`1.0.4+`, commit `66e8ef0`) explicitly confirmed Claude Code reports `Write(path)` rules as invalid (`Edit(path)` covers all file tools). | Change `DENY` to `['Edit(.claude/skills/**)', 'Edit(.harness/skills/**)', 'Bash(npx github:sumtaimo/Skill-Foundry update*)', 'Bash(npx github:sumtaimo/Skill-Foundry add*)']`. Also automatically strip legacy `Write(.claude/skills/**)` and `Write(.harness/skills/**)` from existing `.claude/settings.json` during `protectSkills()` / `doctor --fix`, and update `tests/factory-foundry-cli.test.mjs:117`. |
| **W2-2** | [`foundry.mjs:66`](../../src/factory/foundry.mjs#L66) & [`.harness/lib/governance.mjs:129-165`](../../.harness/lib/governance.mjs#L129-L165) | **CRITICAL MULTI-SKILL BUG:** `harnessPointer()` hardcodes `allowedTools: ["Read", "Edit", "Write"]` for EVERY skill. Under `computeAllowedTools()` (`governance.mjs:136-154`), *"tools the skill does not mention are dropped"* — so **this WIPES OUT `Bash(npm test:*)`, `Bash(node --test:*)`, and `Bash(node:*)`** even for `DEV_ENGINEER` and `QA_AUDITOR`, breaking both project test runs AND skills with local `engine/*.mjs` scripts (`design-system`, `ui-polish`, `figure-craft`, `a11y-audit`)! | Understand `governance.mjs:138`: when a skill omits `allowedTools` (empty array `[]`), `computeAllowedTools` skips narrowing and **preserves the role's allowed tools cleanly**! For normal Skill Foundry skills without special restrictions, **do not write restrictive `allowedTools: ["Read", "Edit", "Write"]`** (or explicitly preserve `Bash` / omit `allowedTools` when empty). For `engine/` skills (`existsSync(join(s.dir, 'engine'))`), declare `Bash(node:*)` / tool requirements cleanly and verify with `computeAllowedTools` across every role (plus warn in `doctor` when `code-craft` or a role restricts `Bash(node:*)`). |
| **W2-3** | [`foundry.mjs:27,173`](../../src/factory/foundry.mjs#L27) | `ROLES` only allows `['PO_ARCHITECT', 'BA_ANALYST', 'DEV_ENGINEER', 'QA_AUDITOR']`. Rejects `--role UX_DESIGNER` / `REVIEWER` / `SECURITY` / `COORDINATOR` present in `Agentic-Harness` `lab` (`v1.0.9`). | Expand `ROLES` (or support known Agentic-Harness v1.0.9 roles + dynamic roles discovered in `.harness/roles/*.json` when running inside a harness project) and align `src/factory/registry.json` `roles` fields per Decision **D3** (note: `UX_DESIGNER` currently owns CSS/SCSS/LESS only, while `ui-polish` & `a11y-audit` also inspect/fix HTML/JSX!). |
| **W2-4** | [`foundry.mjs:61`](../../src/factory/foundry.mjs#L61) | When `.harness/skills/<name>/SKILL.md` exists without `installed-by: skill-foundry` (notably `Agentic-Harness`'s built-in 15-line `spec-writer` stub!), `harnessPointer()` silently returns `null` without warning or pointer info. | Do not fail silently: detect the collision, emit an explicit warning (`harness  ! spec-writer: .harness/skills/spec-writer/SKILL.md already exists without skill-foundry marker — pointer skipped (use --sync-harness to wrap/replace or keep yours)`), and implement the approved collision strategy per Decision **D4**. |
| **W2-5** | [`foundry.mjs:105-116`](../../src/factory/foundry.mjs#L105-L116) | `writeRules()` `AGENTS.md` block omits sequential multi-skill lazy-loading + compact JSON handoff rules and omits mentioning `doctor`. | Enhance `writeRules()` managed block cleanly (keeping outside text untouched and marker compatibility intact) to state lazy skill loading, step-by-step artifact handoff without raw dumping, and `npx github:sumtaimo/Skill-Foundry doctor`. |
| **W2-6** | New command in `foundry.mjs` | No `doctor` command (`npx github:sumtaimo/Skill-Foundry doctor`) and no automatic post-`add`/`update` diagnostic output for project harness structure. | Implement `doctorProject()` + CLI subcommand `doctor` (plus concise summary after `add` / `update` unless `--quiet`). See specification below. |
| **W2-7** | CLI interface for one-link Agentic-Harness auto-integration | `Agentic-Harness` `install.mjs` needs a stable, scriptable way to invoke `npx github:sumtaimo/Skill-Foundry` automatically (idempotent, non-breaking on retries, clear exit codes / structured summary). | Keep `npx github:sumtaimo/Skill-Foundry add --all` / `add --role <ROLE>` / `update` / `doctor` **100% idempotent & machine-friendly** (optional `--json` output on `check`/`doctor` and `--from-harness` or safe collision handling so running `Agentic-Harness` installer multiple times never errors or duplicates rules). See Cross-Repo Verification Gate in Section 5! |

### `skill-foundry doctor` Specification (Handles BOTH Harness & Non-Harness Projects)

1. **Detect Project Environment (Read-Only Diagnostics):**
   - Check Node version (`>=18`) & `git` presence (`--version`, `rev-parse`).
   - Check installed Skill Foundry skills in `.claude/skills/*/.foundry.json`: out-of-date vs current, local edits (`CHANGED LOCALLY`).
   - Detect which agent configs exist:
     - **Case A — Has `Agentic-Harness` (`.harness/` exists):**
       - Read `.harness/MANIFEST.json` (detect template version & whether `v1.0.6+` / `v1.0.9+` or pre-MANIFEST legacy).
       - Read `.harness/roles/*.json`: check if any installed Skill Foundry skill maps to an unknown role OR requires `Bash(node:*)` (`engine/` skills) that the assigned role (`BA_ANALYST`, `QA_AUDITOR`, `UX_DESIGNER`) does not allow, OR if `UX_DESIGNER` CSS-only `writablePaths` conflicts with HTML/JSX UI skills (`ui-polish`, `a11y-audit`) — explain exact rule missing and suggest updating role config or delegating `engine/` step to `DEV_ENGINEER`.
       - Read `.harness/team.json`: warn if any lead has explicit `"skills": [...]` (e.g. `"code-craft"`, `"ui-craft"`), explaining **why**: in current `governance.mjs:227-243`, explicit `skills` disables `autoApply: true` injection AND `code-craft`'s `Bash(node --test:*)` overrides `Bash(node:*)`! Suggest upgrading `Agentic-Harness` ([`HANDOFF-AGENTIC-HARNESS-SYNC.md`](HANDOFF-AGENTIC-HARNESS-SYNC.md)) or fixing lead config.
       - Read `.harness/config.json` & `.harness/team.json`: warn if stale removed engines (`"gemini"`, `"orca"`) are referenced.
       - Check `.harness/skills/<name>/SKILL.md`: verify pointers exist, have `installed-by: skill-foundry`, verify pointer `allowedTools` doesn't strip role `Bash(npm test:*)`, and detect stub collisions like `spec-writer`.
       - Check `.claude/settings.json`: detect invalid legacy `Write(.claude/skills/**)` / `Write(.harness/skills/**)` rules and suggest repair.
     - **Case B — Does NOT have `Agentic-Harness` (no `.harness/`):**
       - Detect installed tools/editors from project files: `.claude/`, `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.cursor/rules/`, `.windsurfrules`, `.github/copilot-instructions.md`.
       - Check if `AGENTS.md` is missing the `skill-foundry` managed block (`writeRules` missing) or if `.claude/settings.json` lacks protection rules (or has invalid `Write(...)` rules) or contains non-foundry `.claude/skills/<name>` collisions.
       - Check if another custom agent/skill folder exists (e.g. `.claude/agents/`, `.cursor/rules/`) and print concrete guidance on wiring skills into it — plus note: *"Want one-link team governance and isolated workers? Run `npx github:sumtaimo/Agentic-Harness#release .`"*
2. **Actionable Advice Format (For Human AND Agent):**
   - Group output cleanly as `✔ ok`, `! warn (with exact fix command or snippet)`, `✖ problem (with exact fix)`.
   - Exit codes: `0` = healthy, `1` = usage/fatal error, `2` = warnings/problems found (actionable in CI/scripts).

---

## 4. Workstream 3: Safe Re-Update of `.harness/` Inside `Skill-Foundry` from `sumtaimo/Agentic-Harness`

### Context Verified from `sumtaimo/Agentic-Harness`
- [`Skill-Foundry/.harness/`](../../.harness/) is an older snapshot (pre-`MANIFEST.json`), whereas `sumtaimo/Agentic-Harness` now has:
  - **`release` (`v1.0.6`, commit `15bd31e`)**: `MANIFEST.json`, `sessions.mjs`, `/harness:sessions`, `COORDINATOR` role, `engines.mjs` consent (`approvals.json`), `usage.mjs`, `lib/integration.mjs`, `REMOVED_PROFILES = ['gemini', 'orca']`, `CORE_DENY` `Edit(...)` rules + removal of invalid `Write(.harness/...)`, `.gitattributes` LF rules, `.windsurfrules`.
  - **`lab` (`v1.0.9`, commit `bf8b43c`)**: adds `UX_DESIGNER`, `REVIEWER`, `SECURITY` roles + `lead-ux` + `ui-craft` + `lib/handoff.mjs` + quota fallback + Windows `.exe` / backslash fixes (not merged to `#release` yet per `docs/MAINTAINING.md`).

### Exact Safety Check & Re-Update Playbook (Do ONLY with TAIMO Approval)
- **What `install.mjs` automatically preserves (`KEEP_IF_PRESENT`):**
  `.harness/memory/profile.md`, `.harness/memory/lessons.md`, `.harness/charter.md`, `.harness/backlog.json`, `.harness/roles/*.json` (`Skill Foundry goal: ...`), `.harness/skills/copy-tight/`, `.harness/config.json`, `.harness/team.json`.
  **CRITICAL: NEVER pass `--reset`** (that wipes `profile.md`, `lessons.md`, `charter.md` objectives).
- **4 Exact Traps Verified on `Skill-Foundry` Before Updating:**
  1. **Trap 1 (`AGENTS.md` + instruction files lack `<!-- agentic-harness -->`):** Grep confirmed `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/harness.mdc`, `.github/copilot-instructions.md` do **not** have the `<!-- agentic-harness -->` marker yet. Running `install.mjs` directly will append a duplicate `# Agentic harness` section / pointer.
     - **Safe handling:** Add `<!-- agentic-harness -->` cleanly above the existing harness blocks (or clean duplicate immediately after running installer and review `git diff AGENTS.md CLAUDE.md GEMINI.md .cursor/rules/harness.mdc .github/copilot-instructions.md`).
  2. **Trap 2 (Stale `gemini` & `orca` in kept files):** Because `KEEP_IF_PRESENT` skips existing `.harness/config.json` & `.harness/team.json`, [`.harness/config.json:9-168`](../../.harness/config.json#L9-L168) (`gemini`, `orca`) and [`.harness/team.json:19-34`](../../.harness/team.json#L19-L34) (`"engine": "gemini"`) stay stale until cleaned after update (`autoOrder`, remove `gemini`/`orca` profiles, re-run `node .harness/team.mjs auto-assign` or reset member `engine` fields cleanly).
  3. **Trap 3 (`engines.mjs` consent):** After core upgrade to `v1.0.6+`, run `node .harness/engines.mjs` once so local `approvals.json` (gitignored) grants consent.
  4. **Trap 4 (`Write(...)` deny rules vs `foundry.mjs`):** `install.mjs` strips `Write(.harness/...)`, but keep `.claude/settings.json` clean when Workstream 2 (`W2-1`) updates `DENY` in `foundry.mjs`.
- **Verification After Re-Update:** Run `node .harness/team.mjs validate`, `node .harness/team.mjs sync-agents`, `node .harness/doctor.mjs`, and `npm test`.

---

## 5. Phased Execution Plan & Mandatory Cross-Repo Verification Gate

### Phased Plan (Sequence: Fix `Skill-Foundry` First → Then Hand Off Link to `Agentic-Harness`)

| Phase | Target Files | Deterministic Checks |
|---|---|---|
| **Phase 0** | Resolve Open Decisions `D1–D7` with TAIMO in chat | Explicit PO approval recorded |
| **Phase 1** *(if approved)* | Re-update `.harness/` from `Agentic-Harness` (`D1`), dedup `AGENTS.md` marker, clean stale `gemini`/`orca` | `node .harness/doctor.mjs`, `node .harness/team.mjs validate`, `npm test` |
| **Phase 2** | `src/factory/foundry.mjs`, `src/factory/registry.json` (`D3`, `D4`, `D7`), `tests/factory-foundry-cli.test.mjs` (`Edit(...)`, non-stripping pointer `allowedTools`, `doctor`, idempotent `--all`, upgraded `AGENTS.md` block) | `npm test` + Mandatory Cross-Repo Verification Gate (below) |
| **Phase 3** | `src/site/lib/render.mjs`, `src/site/lib/i18n.mjs`, `src/site/lib/content.mjs`, `src/site/build.mjs`, `src/site/assets/site.js`, `src/site/assets/site.css`, `tests/site-*.test.mjs` | `node src/site/build.mjs --check`, `npm test`, browser visual check at `1440` & `390` light/dark |
| **Phase 4** | Final audit (`git diff`, `npm run guard`, `npm test`) + generate **End-of-Step-1 Handoff Output** for TAIMO to paste into `sumtaimo/Agentic-Harness` | Zero unintended edits (`src/skills/**` untouched, `locks.json` untouched) |

### End-of-Step-1 Deliverable (So TAIMO Can Continue Straight in `Agentic-Harness`)
At the end of Phase 4, Claude Code MUST print for TAIMO:
1. The exact **finished `Skill-Foundry` reference link** (`branch` / `commit SHA` / `PR` URL + whether `master` is merged yet).
2. The exact **agreed decisions summary** (`D3` roles list, `D4` `spec-writer` stub policy, `D5` pointer `allowedTools` + `Bash(node:*)`, `D7` one-link default).
3. A **pre-filled copy block** matching `docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md` (`Section 0`) AND reminding TAIMO to paste the full `HANDOFF-AGENTIC-HARNESS-SYNC.md` content when opening Claude Code inside the separate `sumtaimo/Agentic-Harness` repo (`lab` branch).

### Mandatory Cross-Repo Verification Gate (Do NOT Skip!)
To guarantee **both repos work and sync without conflict now AND in the future**, Phase 2 MUST verify in a clean temporary project (`mkdtempSync`):
1. **Order 1 (`Agentic-Harness` first → `Skill-Foundry` second):**
   - Simulate `Agentic-Harness` project layout (`.harness/lib/governance.mjs`, `.harness/roles/*.json`, `.harness/team.json`, `.harness/skills/spec-writer/` stub, `.claude/settings.json`).
   - Run `foundry add --all` and `foundry update` (verify idempotent).
   - Run `matchSkills()` and **`computeAllowedTools()`** for EVERY role (`PO_ARCHITECT`, `BA_ANALYST`, `DEV_ENGINEER`, `QA_AUDITOR`, plus `UX_DESIGNER` if `D3` enabled): assert that **Skill Foundry pointers NEVER strip `Bash(npm test:*)`, `Bash(node --test:*)`, `Bash(git status)`, or target `Edit/Write` rules from any role**, AND verify `engine/` skills preserve required `Bash(node:*)` rules.
   - Assert `.claude/settings.json` contains **zero `Write(...)` deny rules** (`Edit(...)` only).
   - Run `foundry doctor` → verify exit code & accurate diagnostics.
2. **Order 2 (`Skill-Foundry` first → `Agentic-Harness` install/re-update second):**
   - Install Skill Foundry skills + `AGENTS.md` + `.claude/settings.json` first.
   - Apply `Agentic-Harness` install behavior (`KEEP_IF_PRESENT` on `.harness/skills/`, `AGENTS.md` marker append, `.claude/settings.json` merge).
   - Verify `.claude/skills/*/.foundry.json`, `.harness/skills/*`, and `AGENTS.md` stay valid with zero data loss and `foundry check` + `foundry doctor` pass.

---

## 6. Open PO Decisions Required Before Implementation (`D1`–`D7`) + History Gap Check

Claude Code MUST confirm these decisions with TAIMO before writing code (no guessing!):

1. **`D1` — When and from which branch should `.harness/` inside `Skill-Foundry` be updated?**
   - *(a)* Update now from `sumtaimo/Agentic-Harness#release` (`v1.0.6`).
   - *(b)* First finish `Skill-Foundry` fix + `Agentic-Harness` `lab` (`v1.0.9`) sync, release `Agentic-Harness`, then update `Skill-Foundry/.harness/`.
   - *(c)* Update directly from `#lab` for dogfooding.
2. **`D2` — Card & Skill Header `"Copy install command"` button behavior (`renderCard` / `renderSkillPage`):**
   - *(a — Recommended)* Copy `npx github:sumtaimo/Skill-Foundry add <name>` (keeps harness auto-positioning, `.foundry.json`, and protection), while keeping `curl/unzip` + `.zip` under `#install` manual fallback.
   - *(b)* Keep `curl/unzip` on the card button and put `npx` prominently beside/above it.
   - *(c)* Same choice for `skills.json` / `llms.txt` / `agents.prompt` (`npx` primary vs `curl` primary).
3. **`D3` — Role expansion (`UX_DESIGNER`, `REVIEWER`, `SECURITY`, `COORDINATOR`) & CSS-only `UX_DESIGNER` nuance:**
   - Notice in `Agentic-Harness` `lab` (`v1.0.9`), `UX_DESIGNER` is scoped to `src/**/*.css`, `*.scss`, `*.less` (`ui-craft` says "Style only"), whereas `ui-polish` & `a11y-audit` check/edit `.html` / `.jsx` too!
   - Confirm: Which Skill Foundry skills should list `UX_DESIGNER` / `REVIEWER` / `SECURITY` in `registry.json` (`design-system` matches CSS tokens directly; what about `ui-polish`, `ux-review`, `copy-tight`, `a11y-audit`, `figure-craft`)?
4. **`D4` — Collision policy when `.harness/skills/<name>/SKILL.md` already exists without `installed-by: skill-foundry` (e.g., `spec-writer`):**
   - *(a — Recommended)* Warn by default + add `--sync-harness` (or safely replace recognized `Agentic-Harness` starter stubs) so `Skill-Foundry`'s tested 10-layer `spec-writer` replaces the 15-line stub cleanly.
   - *(b)* Never overwrite automatically; only warn and print exact manual instructions.
5. **`D5` — `team.json` `"skills": ["code-craft"]` & `computeAllowedTools` intersection:**
   - How should Skill Foundry pointers declare `allowedTools` (`omit/[]` so role & `code-craft` `Bash(npm test:*)` are NEVER stripped, plus explicit `Bash(node:*)` ONLY when `engine/` exists)?
6. **`D6` — Auto-positioning behavior in non-harness projects:**
   - When a project has **no** `.harness/` (e.g. only Cursor `.cursor/rules/`, Windsurf `.windsurfrules`, Gemini `GEMINI.md`, Copilot `.github/copilot-instructions.md`, or nothing yet):
     - Should `skill-foundry add` **keep** installing into `.claude/skills/` + `AGENTS.md` + `.claude/settings.json` only and print tool-specific advice in `doctor`, OR also write lightweight pointer files for detected tools (`.cursor/rules/`, etc.) automatically / behind a flag?
7. **`D7` — One-link `Agentic-Harness` → `Skill-Foundry` auto-install default (`HANDOFF-AGENTIC-HARNESS-SYNC` link):**
   - When someone installs `Agentic-Harness` with its ONE link (`npx github:sumtaimo/Agentic-Harness#release .`), should `Skill-Foundry` skills be pulled **automatically by default** (with `--no-skills` opt-out + graceful offline fallback), or **opt-in via `--with-skills`**? (Needed to design flags/output of `foundry.mjs` cleanly in Step 1 before wiring `Agentic-Harness` in Step 2!)

### Notes on Earlier Conversation (Compaction Verification)
Every point investigated across the earlier turns was re-verified directly against repository files before updating this doc:
- Sequential lazy-loading prompt + JSON compression schema + pre-flight harness check (Section 1)
- Landing page `npx` split, zip/curl vs `npx` mismatch on `#install`, cards, `agents.prompt`, `llms.txt`, `skills.json` (Section 2)
- Auto-positioning + `doctor` + conflict/improvement suggestions for projects with OR without an agentic harness (Section 3)
- Multi-skill `computeAllowedTools` `Bash`-dropping bug, one-link harness handshake, safe `.harness/` re-update + Mandatory Cross-Repo Verification Gate (Sections 3–5 + companion doc).

**Ask TAIMO once before coding:** *"Did you have any custom UI mockup/sketch or additional rule for the landing `#install` layout, non-harness tool paths (Cursor/Windsurf/Antigravity), or the one-link harness auto-install UX beyond Sections 1–6?"*
