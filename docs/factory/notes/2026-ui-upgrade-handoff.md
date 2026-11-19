# 2026 UI & Agentic Skill Upgrade Handoff Playbook

> **Read this before starting work on any remaining UI skill task on branch `lab`.**
> Last updated: `2026-11-19` · Base commit on `lab`: `f82dd71` · Matching backlog: `.harness/backlog.json` (`UI-2026-01` .. `UI-2026-05`, all kept `BACKLOG` until CLI quota resets).

---

## 1. Goal & Design Benchmarks

Upgrade Skill Foundry's UI/UX/SVG skill suite so generated product UIs and agentic workflows match modern 2026 interfaces across external projects (`npx github:sumtaimo/Skill-Foundry add`) and `.harness/` (`controller -> lead -> workers`):

- **Product & Motion References:** `https://reactbits.dev/`, `https://21st.dev/`, `https://hermes-agent.nousresearch.com/`, `docs/site/LANDING-SPEC.md`
- **2D Animated Mechanism SVG Reference:** `https://skills.wheresryan.sh/anatomy/community?kind=svg&tag=mechanism`
- **Core 7 UI & Navigation Pillars Required:**
  1. **Design Tokens & Surfaces:** Light/dark semantic tokens, frosted glass (`backdrop-filter` + opaque contrast fallback), `1px` hairline borders, subtle specular button/card highlights & glows, explicit `--z-*` layering (`sticky`, `dropdown`, `command`, `modal`, `toast`).
  2. **Command-First Navigation (`⌘K`):** Accessible `Ctrl+K`/`Cmd+K` dialog, fuzzy filter input, arrow/Enter/Escape keyboard contract, `<kbd>` hints, empty search reset.
  3. **Adaptive Navigation & Menus:** Floating translucent navbar, sticky section sub-bar with sliding active pill indicator, collapsible sidebar icon-rails, floating docks, mobile drawers (`< 768px`, `0px` horizontal scroll at `390px`).
  4. **Micro-Interactions & Motion Physics:** GPU-only (`transform`, `opacity`, `120ms-240ms`), crisp cubic-bezier / CSS `linear()` springs, `@media (prefers-reduced-motion: reduce)` fallback preserving state visibility.
  5. **Layout & Spatial Discipline:** `4px` spacing grid, `--r-xs`..`--r-xl` (`4/6/10/14/16px`) nested radii, Bento grids, fluid `clamp()` headings (`-0.02em`), weights `400/500/600/700`, `tabular-nums`, Khmer-safe line-heights.
  6. **Complete UI Lifecycle States:** Default, Hover, `:focus-visible`, Active/Selected, Disabled, Dimension-locked Loading Skeleton (`CLS = 0`), Empty Filter/Search with Reset CTA, Inline Error (`role="alert"`) with Retry.
  7. **Inline AI / Contextual Action Bars:** Compact prompt input, quick-action chips, live `aria-live` streaming/thinking state, Stop/Cancel trigger, Diff/Accept + Undo/Revert controls.

---

## 2. Already Completed & Committed (`lab` @ `f82dd71`)

- **`ui-craft` (Draft `0.1.0`):** Full 10-layer skill created in `src/skills/ui-craft/` (`RULES.json` 18 rules, 4 references, 8 eval cases, `preview/cover.svg`, `docs/skills/ui-craft/CHECKLIST.md`, `tests/ui-craft.test.mjs` with Playwright `checkPage`).
  - `1/8` live eval recorded cleanly by fresh `agy` agent: `src/skills/ui-craft/evals/live/polish-only-declined.json`.
- **Factory CLI (`src/factory/foundry.mjs`):** Added `STARTER_SHA['ui-craft']` so `add ui-craft` / `add --all` automatically upgrades Agentic-Harness's 17-line starter `.harness/skills/ui-craft/SKILL.md` stub (`replaced-starter`, keeping `.orig`), tested in `tests/factory-foundry-cli.test.mjs`.
- **Multi-Engine Eval Support:** Added `--engine agy` (isolated temp `cwd` + `--add-dir` / `stream-json` parsing) to `src/factory/live-evals.mjs`, `routing-evals.mjs`, `portable-check.mjs`, tested in `tests/factory-portable-check.test.mjs`.
- **Harness Team Wiring:** `.harness/config.json` (`antigravity` verified `-p {prompt} --mode auto --disable-slash-commands --model ...`), `.harness/team.json` routed to `antigravity`, `.claude/agents/lead-qa.md` synced (`node .harness/doctor.mjs` passes `0` failures).
- **Release Status:** `npm run release:check` is `READY` (`package.json` still `1.0.1`, `master` untouched).

---

## 3. Why Work Paused & Mandatory Pre-Flight Check

Two external CLI blockers stopped fresh-agent eval recording on `2026-11-18`:
1. **`claude -p`:** Failed on user-level telemetry hook `SessionEnd hook [sh "C:/Users/ksg-usr/.claude/hooks/we-adk-usage-collector/session-end.sh"] failed: Hook cancelled`.
2. **`agy -p`:** Hit `RESOURCE_EXHAUSTED (code 429): Individual quota reached` (resets ~`160h26m` from `2026-11-18T08:38Z`).

**Pre-flight rule for any new session (DO NOT skip):**
Run ONE single lightweight check before running a full eval suite:
```bash
node src/factory/live-evals.mjs ui-craft --run --case vague-no-surface-ask --engine agy
# or once Claude hook is fixed:
node src/factory/live-evals.mjs ui-craft --run --case vague-no-surface-ask --engine claude
```
Only continue recording if that command exits `0` without quota/hook errors. **Never write recordings by hand.**

---

## 4. Strict Repository Guardrails for Every Session

1. **One skill per session & commit (`AGENTS.md` SKILL QUALITY LAW #8):** `npm run guard` (`src/factory/skill-guard.mjs`) fails if uncommitted changes touch more than ONE skill under `src/skills/<name>/` or `docs/skills/<name>/`. Finish, test (`npm run release:check`), and commit ONE skill on `lab` before starting the next!
2. **Real-agent proof required before `ready`:** Every `ready` portable skill needs `live-evals.mjs <name>`, `portable-check.mjs <name> --record`, `routing-evals.mjs`, Playwright `checkPage` on HTML/SVG outputs saved in `evals/live/files/`, and updated recipe recordings when a recipe member changes.
3. **Owner approvals & `.harness/charter.md`:** Autonomous `.harness/` workers only write inside `allowedPaths: src/**, docs/**, tests/**, test/**`. Root `package.json` version bumps (`1.0.1 -> 1.1.0 -> 1.2.0`), root `CHANGELOG.md`, `git commit`, and `master` merges require Editor AI / Product Owner confirmation in chat (`docs/PROJECT.md` section 7).
4. **User Language Rule (`.harness/memory/lessons.md` L1):** Always reply to TAIMO in **Khmer** (keep file paths, rule IDs, commands, and CSS tokens verbatim).

---

## 5. Ordered Remaining Sessions (`lab`)

| Backlog ID | Skill | Target Version | Scope & Actions | Commit Gate |
|---|---|---|---|---|
| `UI-2026-01` | `ui-craft` (finish Session 1) | `ui-craft` `1.0.0` (`ready`), Project `1.1.0` | Run remaining 7 live cases (`live-evals.mjs ui-craft --run`), save real HTML outputs to `src/skills/ui-craft/evals/live/files/` & verify with `checkPage` in `tests/ui-craft.test.mjs`, run `portable-check.mjs ui-craft --record`, update `src/factory/routing/cases.json` (`r11`, `r19`, `r24`, `ay10` -> `ui-craft`, add `uc1..uc4`, verify `ux7`) + run `routing-evals.mjs --run`, update `tests/site-finder.test.mjs` line 172 (`['design-system', 'ui-craft', 'ux-review']`), update `docs/skills/ui-craft/CHECKLIST.md`, set `status: "ready"` & `version: "1.0.0"`, bump root `package.json` `1.1.0` + `CHANGELOG.md` (with PO OK). | `npm run release:check` -> `READY`, `npm run guard` ok -> commit on `lab` |
| `UI-2026-02` | `design-system` (Session 2) | `design-system` `1.1.0` | Add optional 2026 token groups (`--glass-bg`, `--glass-blur`, `--r-xs..--r-xl`, `--z-*`, `--glow`, `--btn-gloss`, `--font-weight-medium: 500`, optional Web Font support when named) without breaking `1.0.0` tokens, `midtone-teal`, or existing 14 cases. Add eval cases, re-record `live-evals` + `portable-check`, update `CHANGELOG.md` + `docs/skills/design-system/CHECKLIST.md` + `registry.json` (`1.1.0`). *(Wait to finalize `tokens-then-polish` recipe until `UI-2026-03` or re-record after each.)* | `npm run release:check` -> `READY`, `npm run guard` ok -> commit on `lab` |
| `UI-2026-03` | `ui-polish` (Session 3) | `ui-polish` `1.1.0` | Update `references/tokens.md`, `references/README.md`, `SKILL.md` so Token Mode honors 2026 tokens (`--glass-*`, `--r-*`, `--z-*`, `--glow`, weight `500`, `backdrop-filter`, fluid/tabular styles) instead of flattening them, clarify redirect to `ui-craft` for designing new UI, re-record `live-evals` + `portable-check` + `node src/factory/recipe-run.mjs tokens-then-polish --record` + `checkPage` on live HTML files, commit on `lab`. | `npm run release:check` -> `READY`, `npm run guard` ok -> commit on `lab` |
| `UI-2026-04` | `ux-review` (Session 3b) | `ux-review` `1.0.1` | Clean overlap between `R-ux-review-8/9` (`44px`/`8px` target sizing) and `ui-polish` (`R-ui-polish-1/7`), refine `R-ux-review-30` (`<= 7` controls distinction for persistent header/rail nav vs hero CTAs), clarify screen-design redirect (`ui-craft`), re-record `live-evals` + `portable-check`, commit on `lab`. | `npm run release:check` -> `READY`, `npm run guard` ok -> commit on `lab` |
| `UI-2026-05` | `svg-mechanism` (Session 4) | `svg-mechanism` `1.0.0`, Project `1.2.0` | Create new portable skill (`roles: ["DEV_ENGINEER", "UX_DESIGNER"]`) for animated 2D architecture/mechanism SVGs (`skills.wheresryan.sh` style) synced to `design-system` / `ui-craft` CSS tokens, `<defs>` gradients, interactive play/pause + `prefers-reduced-motion: reduce`, safe `viewBox` without clipped `<text>` (`checkPage`), leaving `figure-craft` untouched. Complete 10 layers, `lint-skills`, `tests/svg-mechanism.test.mjs`, `live-evals`, `portable-check`, routing cases, bump `package.json` `1.2.0` + `CHANGELOG.md` (with PO OK). | `npm run release:check` -> `READY` -> ask TAIMO to approve merge `lab` -> `master` |

---

## 6. How to Resume in ANY Agentic Session Later

### Option A — Editor AI Session (Antigravity, Claude Code, Codex, Cursor, Copilot)
Paste this prompt in a fresh chat after CLI quota resets:
> Read `AGENTS.md`, `docs/PROJECT.md`, `docs/factory/notes/2026-ui-upgrade-handoff.md`, and `.harness/backlog.json`. Check `git branch` (`lab`). First run the 1-case smoke test from section 3 to verify `agy`/`claude` works without quota or hook errors. Then execute the next uncompleted backlog task (`UI-2026-01`, strictly one skill per commit on `lab`) until `npm run release:check` prints `READY`. Ask TAIMO in Khmer before bumping `package.json` or merging to `master`.

### Option B — `.harness/` Controller → Lead → Workers
Notice `UI-2026-01..05` are pre-loaded in `.harness/backlog.json` with `status: "BACKLOG"` so autopilot will not misfire early. When ready:
1. Run `node .harness/backlog.mjs list` to inspect tasks.
2. Promote **one** task at a time: `node .harness/backlog.mjs ready UI-2026-01` (for `UI-2026-02`..`04` keep `DEV_ENGINEER` inside `src/**, docs/**, tests/**`; promote root `package.json`/`CHANGELOG.md` in Editor AI with PO approval).
3. Run `/harness:run` (or `/harness:auto` / `node .harness/daemon.mjs --tick` after verifying engine quota).
