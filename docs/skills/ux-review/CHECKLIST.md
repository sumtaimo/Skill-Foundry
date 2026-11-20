# ux-review review (2026-11-15, S4 update 2026-11-16)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.0.1 (update of 2026-11-20 below).

Honest record: the author (an AI agent) ticked this list; the owner is the final reviewer. Live answers (14 cases), the routing answers (35 cases) and the portable check came from fresh real agents (`claude -p`); the worked examples are hand-written and are not proof.

## Clarity
- [x] Layers are numbered clauses with defined terms (layer 01), so each clause can be cited
- [x] Every rule uses MUST or NEVER and has an id `R-ux-review-<n>` (32 rules: 13 control and step rules, 5 shape rules R-ux-review-26 to 30, 14 conduct, cap, template and folder rules)
- [x] No step relies on unstated knowledge (severity questions in layer 04 clause 9; how to check each rule in the references)
- [x] SKILL.md is at most 150 lines (95)
- [x] Ten core layers with numbered steps, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no `src/`, `docs/` or `tests/` paths in SKILL.md, layers or references (`chk-portable`); no book, author or brand named

## Triggers
- [x] Description says when to use and when not (fix code, rewrite text, contrast, ARIA, design, retest plan)
- [x] Trigger words match how users ask: "UX review", "usability review", "where will users get stuck"
- [x] Does not overlap ui-polish, copy-tight or test-planner; routing cases ux1 to ux9 pass, including none cases for design, accessibility audit and research interview guide

## Coverage
- [x] Main paths: code, step-by-step description, code plus description, design tokens cited
- [x] Not shown goes to open questions, never a finding (`not-shown-goes-to-open-questions`); no findings (`no-findings`); code and description conflict
- [x] Boundary cases with exact sentences: nothing to review, fix request, design request, rewrite text, contrast and ARIA
- [x] Every rule in RULES.json has a check or checklist item

## Examples
- [x] Four examples (description, fix request, nothing to review, design request); they follow the skill's own rules

## Evals
- [x] Fourteen cases with unique ids and strict expectations (headings, fixed sections, exact sentences, `notContains`, `maxLines`)
- [x] Pass with `runEvals` on bad answers rejected in `tests/ux-review.test.mjs`
- [x] Live evals: 14 of 14 pass on fresh real-agent recordings in `evals/live/`; every answer was read by hand
- [x] Found by reading the first recordings and fixed in the skill, not in the cases: evidence was wrapped in backticks, a missing thing had no clear line (now "Shown absent:"), and one answer listed 9 to 11 open questions including code-correctness doubts (now at most 8, none about code correctness). All 11 cases were recorded again
- [x] S4 (shape of a screen), added 2026-11-16 under version 1.0.0: five shape rules (first screen, section order, page length, duplicated blocks, calls to action), an optional measurement sheet or screenshot description (the "Reviewed:" line says which input it had), a cap at S3 when a script or run-time content is not given, and one finding per template with its pages listed. Three cases added; all 14 recorded again with fresh agents. Found by reading the recordings and fixed in the skill, not in the case: the first answer on the missing-script case still ranked a placeholder finding S2 because the visible text looked wrong by itself, so the rule now says that text a missing script could set or replace is dependent on it
- [x] Boundary kept: no contrast ratios, focus styles, spacing scales, semantics or ARIA, no text rewriting; call-to-action findings count actions and name the main one, they do not judge style

## Preview quality
- [x] Tagline under 90 characters, 5 tags
- [x] Cover uses only `--cover-bg`, `--cover-accent` and `currentColor`

## Visual items
- Not a UI-output skill (text output); skipped.

## Install and portable
- [x] `node src/factory/portable-check.mjs ux-review --record`: used the skill in an empty project outside the repository, no repository rule leaked; the recorded answer was read (5 findings, correct severities, evidence quotes present, open questions for what the description did not show)

## Release
- [x] `node src/factory/lint-skills.mjs ux-review` exits 0
- [x] Version 1.0.1 matches SKILL.md, CHANGELOG and registry
- [x] Registry roles `BA_ANALYST`, `QA_AUDITOR`, as the owner's task states

## Update 1.0.1 (2026-11-20, task UI-2026-04)

Honest record: every live answer below is from a fresh real agent (`claude -p`, recorded by `live-evals.mjs`); nothing was hand-written. The worked examples in `examples/` are hand-written and unchanged.

- [x] Overlap with ui-polish removed: R-ux-review-8 is now Reach and R-ux-review-9 Grouping. No px threshold; a hit problem is a finding about the task and its recommendation ends with "; the sizes are for ui-polish." A request to measure sizes, gaps or tokens gets one fixed sentence naming ui-polish (layer 06, clause 18). Tested in `tests/ux-review.test.mjs` (no 44 or 8 px in rules 8 and 9)
- [x] R-ux-review-30: persistent navigation (header, rail, sidebar) is counted apart from hero actions and cards, and never added to the 7. New terms in layer 01
- [x] Redirect sentences: fix the code names ui-polish, design a screen names ui-craft; both tested word for word
- [x] R-ux-review-33: a token's name, value or absence is never a finding; tokens go to design-system, contrast to a11y-audit
- [x] No "2026" wording in the skill text (tested; the changelog date is a date, not wording)
- [x] Live evals 17 of 17. Re-recorded with fresh agents: design-request, fix-request, design-tokens-cited, signup-form-code, shape-rules-measurement-sheet, template-repeated-reported-once, contrast-and-aria-out-of-scope, no-findings. New cases: size-request-redirected-to-ui-polish, design-tokens-not-a-finding, persistent-nav-not-counted-with-hero
- [x] Case changes, with the reason (the rule changed, the bar did not drop): design-request and fix-request now expect the longer sentence and the skill name; design-tokens-cited no longer demands R-ux-review-8, `--size-6` and "24" (rule 8 no longer measures sizes) and now demands the ui-polish pointer and no 44 or "8 px"; `--btn-h` is not forbidden in design-tokens-not-a-finding because the agent may cite a resolved token as evidence or in an open question, while the bait tokens (off-scale 13px, low-contrast #aaa) must not appear
- [x] Found by reading recordings: the first version of size-request-redirected-to-ui-polish put Save beside "Back to notes", which really is a grouping problem, so the agent was right and the case was wrong; the case was rebuilt (prompt changed, recorded again). The first design-tokens-cited answer lacked the ui-polish pointer on a grouping finding, so the skill was fixed (R-ux-review-9 now carries the pointer too). One run of shape-rules-measurement-sheet missed the "866" quote and passed on the next run with the case unchanged (agent variance, not weakened)
- [x] Routing: the description did not change, so routing was not re-run
- [x] Portable check recorded again (`portable-check.mjs ux-review --record`); I read the answer: 4 findings, evidence quotes present, no repository rule leaked, and an open question asks whether the 3 first-screen controls are persistent navigation

