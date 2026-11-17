# Skill Foundry status: one page for every session

Every AI session reads this page first and updates it before it reports (lesson L20).
It holds what is done, what is open, every decision TAIMO made, and every skill weakness found in real use,
so no session has to guess and nothing found is forgotten. Details live in the linked files; this page only points.

Last updated: 2026-11-17, shipped eval runner quota-limit guard + `live-evals.mjs --case` on `lab` (0 Claude tokens); `claude/a11y-audit-s1-s6` (`e23ae5c`) still held for real-agent recording.

## 1. Where we are

| Phase | What | Branch / commit | Status |
|---|---|---|---|
| Skills | ui-polish, design-system, ux-review, a11y-audit, spec-writer, plus the earlier five | `master` | Done, released |
| Audit | Our skills run on our own site by real agents | report `docs/factory/notes/landing-audit-2026-11-16.md` (evidence now on `lab`) | Done, input for Phase B |
| A | CLI fixes: Edit-only deny rules, pointers that keep role tools, 8 roles, collision warning, `doctor` | `master` `2a27637` | Done, released |
| B | Site: npx-first install, new layout from the reference TAIMO gave, 8 roles on the site, W2-8, W2-9 | `master` `6d0c255` | Done, released |
| B2 | Site: shorter skill pages (request once, full answer collapsed) | `lab` | On lab, checked; waits for TAIMO to release lab |
| A2 | Platform: scope note on Install and For-agents (en + kh draft, done); ownership-line tests; gate over three user situations and every harness source; joint-test plan | `claude/platform-a2` | Done: snapshots of the real harness (release 15bd31e, lab 0f39c98) vendored by the orchestrator; gate and ownership tests pass against both |
| Handoff | Both handoff briefs corrected to the real state (A and B done, lab workflow, dropped Phase C, real-use findings AH-8 to AH-13, questions H7 to H11) | `docs/factory/HANDOFF-*.md` on `lab` | Done 2026-11-17 (AH-12/AH-13 added on `lab`); TAIMO pastes the Agentic-Harness one into that repository, and removes internal handoff/process docs after Step 2 before public release |
| Guide | Paste-ready guide + kickoff prompt + sync loop for the Agentic-Harness repository | `docs/factory/GUIDE-FOR-AGENTIC-HARNESS.md` on `lab` | Done 2026-11-17 (H1–H11, `handoff.mjs`/`sessions.mjs` added); remove after Step 2 before public release |
| Step 2 | `sumtaimo/Agentic-Harness` repository, `lab` then `release` | other repository | Not started; brief: `docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md` |
| C | Re-update this repository's `.harness/` | none | **Dropped by TAIMO on 2026-11-16** (L23: this project never changes the harness; the Agentic-Harness project updates it when TAIMO orders) |

Handoff briefs written by TAIMO: `docs/factory/HANDOFF-SKILL-FOUNDRY-IMPROVEMENTS.md`, `docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md`.

Release path (2026-11-16): `claude/...` work branch → **`lab`** (integrate and check, like UAT) → TAIMO confirms in chat → `master`. Details: `docs/factory/PUBLISHING.md` section 3b.

## 2. Decisions TAIMO made (do not ask again)

| Id | Decision |
|---|---|
| Product boundary | Skill Foundry ships only skills; Agentic Harness ships only the harness (at most one harness-operating skill). |
| Precedence | Skill Foundry always wins over a duplicate or conflicting harness skill; keep a `.orig` backup; never overwrite an unknown user-written skill. |
| Smooth confidentiality | In user-facing output, guide plainly; do not expose internal skill rules, layers, eval criteria or protection mechanics, and do not name internal skills when not needed. |
| D1 (b) | Update `.harness/` here only after the Agentic-Harness release. |
| D2 (a) | npx is the primary install everywhere; zip + SHA-256 is the no-Node fallback. |
| D3 | 8 roles are known; `UX_DESIGNER` only on design-system and ux-review (it writes CSS only). |
| D4 (a) / D4b | Warn on a name collision, `--sync-harness` to replace; recognised harness starter copies are replaced automatically. |
| D5 | Pointers keep role tools: no `allowedTools` for normal skills; bare `Edit, Write, Bash` for skills with `engine/` (a literal `Bash(node:*)` strips role rules, proven by test). |
| D6 | Without a harness, install to `.claude/skills`, `AGENTS.md`, `.claude/settings.json`; `doctor` advises; no automatic files for other tools. |
| D7 | Agentic-Harness pulls skills only with `--with-skills` (opt-in) for now. |
| Layout | First screen guides a first-time visitor; the real recorded result is the biggest thing on a skill page; one primary action per view; structure (not text or art) from https://skills.wheresryan.sh/anatomy . |
| Books and brands | Use principles only; never name books, authors or outside brands (L10, L15). |
| Lab branch | All finished work goes to `lab` first and is checked there; release `lab` → `master` only after TAIMO confirms (another agent may verify `lab` a second time). |
| Harness feedback | This project never changes the Agentic Harness; it only reports issues to TAIMO (private doc "Agentic Harness feedback" on claude.ai, items H1-H9); fixes happen in the separate `sumtaimo/Agentic-Harness` project. |
| Model choice | The orchestrator picks the model for child sessions by job and cost; not a fixed rule. |

### A2 details (2026-11-16)

- **Ownership line as tests:** `tests/factory-foundry-ownership.test.mjs` (byte-for-byte: after `add --all`, `update`, `remove`, `doctor --fix` only `.claude/skills/<name>/`, `.harness/skills/<name>/SKILL.md(.orig)`, our `AGENTS.md` block and our deny rules change; after a harness install or update our deny rules, skills, pointers stay and `check`/`doctor` are healthy; worst case "harness overwrites settings.json" is detected and repaired by `doctor --fix`). Skill Foundry did not break the line in any scenario.
- **Gate:** `tests/factory-foundry-gate.test.mjs` runs S1 (Skill Foundry only), S2 (harness then Skill Foundry), S3 (Skill Foundry then harness install and update) for every harness source, every role must keep `Bash(npm test:*)`, `Bash(node --test:*)` and its Edit/Write rules. Sources today: this repository's own `.harness/` copy. Helpers: `tests/helpers/harness-project.mjs`.
- **Was blocked, now done:** the A2 session could not clone `sumtaimo/Agentic-Harness` (`add_repo` denied); the orchestrator read the public repository read-only and vendored the snapshots (release v1.0.6 `15bd31e`, lab v1.0.15 `0f39c98`; lab had moved past the `bf8b43c` in the briefs). Findings re-checked in `docs/factory/notes/harness-findings-2026-11-16.md`.
- **Harness findings (reports only):** `docs/factory/notes/harness-findings-2026-11-16.md`.
- **Joint test plan:** `docs/factory/JOINT-TEST-PLAN.md`.

## 3. How we work (summary; the rules are in `.harness/memory/lessons.md`)

- One skill per session (L11); check `docs/factory/ROADMAP.md` for overlap before any new skill (L16).
- Real-agent proof for every release; during work re-record only affected cases, all cases once before release (L18).
- Child sessions: follow up at 30, then 15, then every 5 minutes (L19); run real agents one at a time; push after each step.
- Cost caps: site work at most 6 real agent runs per phase; reuse recorded audits instead of re-running them.
- TAIMO approves every merge to `master` in chat (L14).

## 4. Skill backlog: weaknesses found in real use (not fixed yet)

Found when our own skills worked on our own site (audit and Phase B, 2026-11-16). Each line is one future improvement,
done in its own session for that skill only. Evidence: audit report section (c) and `docs/factory/notes/site-phase-b-2026-11-16.md` "Skill weaknesses" (on `claude/site-phase-b`).

| # | Skill | Weakness seen | Proposed fix | Priority |
|---|---|---|---|---|
| S1 | all skills with `engine/` (design-system, ui-polish, a11y-audit, figure-craft). **ui-polish: done, on `lab`; design-system: done, branch `claude/design-system-s1-s5` (commit `9baf719`)**; **a11y-audit: done, branch `claude/a11y-audit-s1-s6`**; figure-craft still open | Agents chain `cd …; VAR=…; node engine/x.mjs`; sandboxes refuse chained shell, so agents fall back to hand work (audit: design-system twice; Phase A check: ui-polish three times) | Each skill tells the agent to run its script as one plain command from the skill folder (`node <skill>/engine/x.mjs --flag`), no `cd`, no variables | High |
| S2 | ui-polish **(done, branch `claude/ui-polish-s1-s2-s3`, on `lab`)** | Lowered contrast: replaced a passing near-black primary button (16:1) with brand green (4.9:1); replaced the site's own values with preset token values the site does not load | Never lower the contrast of a passing pair; ask before replacing an existing value with a different token value; when tokens are not loaded, say so instead of rewriting | High |
| S3 | ui-polish **(done, same branch)** | Cannot see order, page length, overflow or overlap; one patch per page for one shared stylesheet | Accept a screenshot or measurement sheet; rule for text overflowing its box; one patch for a shared stylesheet plus per-page deltas | Medium |
| S4 | ux-review **(done, on `lab`; open note: in its measurement-sheet recording the first-screen, section-order and page-length findings are all S3 although the h1 sat at 866 px on an 8-screen page; check the severity scale in a later ux-review session)** **(done, branch `claude/ux-review-s4`; commit in the lab merge)** | None of its 13 rules can catch first-screen content, section order, page length, duplicated blocks or number of calls to action; ranks a finding S2 when the script it needs was not given | Add rules for those; accept a screenshot or measurements; cap at S3 or move to open questions when a needed script is missing; report a repeated template once | High |
| S5 | design-system **(done, branch `claude/design-system-s1-s5`, commit `9baf719`)** | With a partial token file one matching name hides a whole family (a single `--gutter` hid the spacing scale); the neutral scale ignores existing greys | Detect a family by several matching tokens; build neutrals from the project's greys | Medium |
| S6 | a11y-audit **(done, branch `claude/a11y-audit-s1-s6`)** | Khmer label without `lang` came out as a question, not a finding; a "0 findings" header hides that contrast and target size were skipped by rule | Add the language-of-parts check (WCAG 3.1.2); say in the header which checks were skipped by rule | Medium |
| S7 | copy-tight **(done, branch `claude/copy-tight-s7`, final commit after `98a8aee`)** | Output format not stable (some answers listed part of the strings or dropped lines); "What changed" too generic; may reword a claim label | Fixed table (id, before, after, saved, reason); never drop an input line; let the user mark "keep as is" labels; split strings over about 25 words | High (weakest of the five) |

S4 result: five shape rules (R-ux-review-26 to 30), optional measurement sheet or screenshot description (the "Reviewed:" line names it), S3 cap for a missing script (R-ux-review-31), one finding per template with pages listed (R-ux-review-32); 14 live cases and the portable check re-recorded by fresh agents. Weakness found while testing and fixed: a placeholder shown in a command was still ranked S2 although the missing script could replace it; the rule now covers text a missing script could set. Open for later: the shape thresholds (6 screens per page, 2 per section, 7 controls in the first screen, 3 screens to the main action) are the owner's call; TAIMO may tune them.

S1 + S5 result (design-system): rules R-design-system-19 to 21; the skill and the engine's own messages say "one plain command with the path of the script", and a hand build says plainly on its first line and in an open question that the engine could not run; a family is present only with 3 or more matching tokens, a partly present family gets its missing tokens by name and never overwrites a user token (also not in dark shadows, reduced motion or density); neutrals are built from the project's own greys (kept, interpolated, contrast-checked, default scale with a reason when they cannot pass). 3 new live cases (`engine-one-command`, `existing-partial`, `engine-unavailable`); all 14 live cases, the portable check and the recipe `tokens-then-polish` re-recorded by fresh agents. Weakness found while testing and fixed: an agent wrote the string of a forbidden font rule inside its own open question (layer 04 now says to describe it in words). Open for later: an agent can still chain commands in other skills (S1 open for a11y-audit and figure-craft).

S1 + S6 result (a11y-audit): rules R-a11y-audit-17 to 19; the script runs as one plain command with its path and its own output tells the agent how to reply (header lines to copy, errors give the first-line sentence); a reply that could not run the script says so on its first line; new check `lang-parts` (SC 3.1.2 Language of Parts, AA; 39 checks) with the same-script case left as a manual test; every reply header carries the fixed skipped-by-rule sentence. 3 new live cases (`lang-parts-khmer`, `engine-one-command`, `engine-unavailable`); all 16 live cases and the portable check re-recorded by fresh agents; `release:check` READY. Weakness found while testing: a lab-recorder run without Bash permission records a by-reading answer, so the recorder should allow Bash for engine skills (factory note, not fixed here). Open for later: figure-craft S1.

Harness side (Step 2, not a skill change): roles `QA_AUDITOR` and `BA_ANALYST` cannot run `node`, so engine skills fail in those roles (`doctor` warns). Fix in Agentic-Harness role configs.

## 5. Open questions for TAIMO

1. ~~Skill page length~~ Answered by TAIMO: request shown once beside the result, full answer collapsed. Done on `claude/site-skill-page-length`: pages are 2900 to 3250 px at 1440 (about 3.2 screens, was 3500 to 4640). Open for TAIMO: cut more (Install block lower, or drop "What it does") or accept.
2. Khmer strings added in Phase B and the new "Show the full answer" are drafts and need a native review.
3. Skill backlog order: approved by TAIMO (per skill: ui-polish S1-S3 done, then copy-tight S7, ux-review S4 (done), design-system S1+S5, a11y-audit S1+S6, figure-craft S1).

## 5b. After the current plan

- Two-way gap loop with the Agentic Harness: a clear, shared way for this project's AI and the Agentic Harness project's AI to hand issues to each other (report, fix, confirm) without confusion. Design it with TAIMO after the skill backlog is done.
- Multi-engine eval adapter in `Skill-Foundry` (`src/factory/live-evals.mjs`, `routing-evals.mjs`, `portable-check.mjs`, `recipe-run.mjs`): currently tied to `claude` CLI flags / `stream-json`; consider `--engine agy | codex` adapter (keeping proof quality equivalent to `usedSkill`) after Step 2 if needed.
- ~~`src/factory/live-evals.mjs` safety & cost-saving fixes~~ **(done on `lab`, 2026-11-17)**: `isQuotaError` + non-overwrite guard + `--case <id[,id...]>` in `src/factory/live-evals.mjs`, plus quota-limit/failure overwrite protection across `portable-check.mjs`, `routing-evals.mjs`, and `run-skill.mjs` (unit-tested in `tests/factory-*.test.mjs`). Next `a11y-audit` session can run `--case contrast-request,certificate-request,no-code`.

## 5c. Cost note

The cost a child session reports leaves out the `claude -p` evaluation agents it runs (copy-tight showed $0.22 although it recorded real agents), so real spend is higher than the reported figures.

## 5d. Decided 2026-11-17

- `docs/factory/notes/harness-findings-2026-11-16.md` stays on `lab` only; it is removed in a commit on `lab` before `lab` is released to `master` (L25).
- Internal handoff and process docs (`docs/factory/HANDOFF-*.md`, `docs/factory/GUIDE-FOR-AGENTIC-HARNESS.md`, `docs/factory/JOINT-TEST-PLAN.md`, `docs/factory/notes/harness-findings-2026-11-16.md`) must be removed from `docs/` after Step 2 is done and before public `master` release so internal working processes do not leak (L26).
- Block TAIMO with a clear risk warning before acting whenever a request/suggestion relies on incomplete facts or risks wasting tokens or failing checks (L27).
- Hold `claude/a11y-audit-s1-s6` (`e23ae5c`) Claude re-recording until weekly quota resets; `0`-token skill/test/CHECKLIST prep already pushed there.
- Near the weekly usage limit: one session at a time, stop at `lab`, TAIMO decides the release.

## 5e. Decided and done 2026-11-17

- **figure-craft S1: skipped for now** (TAIMO). Any change to the skill makes its 11 recorded runs stale and the re-recording would replace the approved refrigerator (L5). S1 stays on the backlog for figure-craft.
- **a11y-audit S1+S6** is on `lab` (16 live cases, portable check, `release:check` READY).
- **Joint test, free part done:** the real `install.mjs` of harness `release` and `lab` was run in both orders with Skill Foundry from `lab`; ownership line held, our skills and deny rules survived; details at the end of `docs/factory/notes/harness-findings-2026-11-16.md`. Still open for the joint test: the real-agent flows (they cost money; agree a cap first).
- **Release order (L26):** the internal handoff, guide, joint-test plan and harness-findings docs are removed from `docs/` after Step 2 (the Agentic-Harness work) and before `lab` is released to `master`. Until then `master` stays as it is.

## 6. Cost log (list price reported by child sessions)

Skills build-out about $92; audit about $30; Phase A $1.46; Phase B $3.94 plus follow-up. Lesson: re-record only what changed, reuse audits, one session per phase, one agent at a time.
