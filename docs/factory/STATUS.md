# Skill Foundry status: one page for every session

Every AI session reads this page first and updates it before it reports (lesson L20).
It holds what is done, what is open, every decision TAIMO made, and every skill weakness found in real use,
so no session has to guess and nothing found is forgotten. Details live in the linked files; this page only points.

Last updated: 2026-11-16, by the site-skill-page-length session.

## 1. Where we are

| Phase | What | Branch / commit | Status |
|---|---|---|---|
| Skills | ui-polish, design-system, ux-review, a11y-audit, spec-writer, plus the earlier five | `master` | Done, released |
| Audit | Our skills run on our own site by real agents | `claude/landing-audit` (`b8338eb`), report `docs/factory/notes/landing-audit-2026-11-16.md` | Done, input for Phase B |
| A | CLI fixes: Edit-only deny rules, pointers that keep role tools, 8 roles, collision warning, `doctor` | `master` `2a27637` | Done, released |
| B | Site: npx-first install, new layout from the reference TAIMO gave, 8 roles on the site | `claude/site-phase-b` | Built, gates READY; follow-ups W2-8, W2-9 in progress; waits for TAIMO's merge approval |
| B2 | Site: shorter skill pages (request once, full answer collapsed), 10 pages 610 to 1557 px shorter at 1440 | `claude/site-skill-page-length`, note `docs/factory/notes/site-skill-page-length-2026-11-16.md` | Built, gates READY; waits for TAIMO's merge approval |
| Step 2 | `sumtaimo/Agentic-Harness` repository, `lab` then `release` | other repository | Not started; brief: `docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md` |
| C | Re-update this repository's `.harness/` from the Agentic-Harness release | `docs/factory/notes/phase-c-harness-followup.md` | Waits for Step 2 (decision D1 b) |

Handoff briefs written by TAIMO: `docs/factory/HANDOFF-SKILL-FOUNDRY-IMPROVEMENTS.md`, `docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md`.

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
| Model choice | The orchestrator picks the model for child sessions by job and cost; not a fixed rule. |

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
| S1 | all skills with `engine/` (design-system, ui-polish, a11y-audit, figure-craft) | Agents chain `cd …; VAR=…; node engine/x.mjs`; sandboxes refuse chained shell, so agents fall back to hand work (audit: design-system twice; Phase A check: ui-polish three times) | Each skill tells the agent to run its script as one plain command from the skill folder (`node <skill>/engine/x.mjs --flag`), no `cd`, no variables | High |
| S2 | ui-polish | Lowered contrast: replaced a passing near-black primary button (16:1) with brand green (4.9:1); replaced the site's own values with preset token values the site does not load | Never lower the contrast of a passing pair; ask before replacing an existing value with a different token value; when tokens are not loaded, say so instead of rewriting | High |
| S3 | ui-polish | Cannot see order, page length, overflow or overlap; one patch per page for one shared stylesheet | Accept a screenshot or measurement sheet; rule for text overflowing its box; one patch for a shared stylesheet plus per-page deltas | Medium |
| S4 | ux-review | None of its 13 rules can catch first-screen content, section order, page length, duplicated blocks or number of calls to action; ranks a finding S2 when the script it needs was not given | Add rules for those; accept a screenshot or measurements; cap at S3 or move to open questions when a needed script is missing; report a repeated template once | High |
| S5 | design-system | With a partial token file one matching name hides a whole family (a single `--gutter` hid the spacing scale); the neutral scale ignores existing greys | Detect a family by several matching tokens; build neutrals from the project's greys | Medium |
| S6 | a11y-audit | Khmer label without `lang` came out as a question, not a finding; a "0 findings" header hides that contrast and target size were skipped by rule | Add the language-of-parts check (WCAG 3.1.2); say in the header which checks were skipped by rule | Medium |
| S7 | copy-tight | Output format not stable (some answers listed part of the strings or dropped lines); "What changed" too generic; may reword a claim label | Fixed table (id, before, after, saved, reason); never drop an input line; let the user mark "keep as is" labels; split strings over about 25 words | High (weakest of the five) |

Harness side (Step 2, not a skill change): roles `QA_AUDITOR` and `BA_ANALYST` cannot run `node`, so engine skills fail in those roles (`doctor` warns). Fix in Agentic-Harness role configs.

## 5. Open questions for TAIMO

1. ~~Skill page length~~ Answered by TAIMO: request shown once beside the result, full answer collapsed. Done on `claude/site-skill-page-length`: pages are 2900 to 3250 px at 1440 (about 3.2 screens, was 3500 to 4640). Open for TAIMO: cut more (Install block lower, or drop "What it does") or accept.
2. Khmer strings added in Phase B and the new "Show the full answer" are drafts and need a native review.
3. Order of the skill backlog in section 4 (proposed: S1 first because it blocks four skills, then S7, S2, S4).

## 6. Cost log (list price reported by child sessions)

Skills build-out about $92; audit about $30; Phase A $1.46; Phase B $3.94 plus follow-up. Lesson: re-record only what changed, reuse audits, one session per phase, one agent at a time.
