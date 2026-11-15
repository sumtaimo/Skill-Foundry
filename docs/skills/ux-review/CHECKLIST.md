# ux-review review (2026-11-15)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.0.0.

Honest record: the author (an AI agent) ticked this list; the owner (TAIMO) is the final reviewer. Live answers (11 cases), the routing answers (35 cases) and the portable check came from fresh real agents (`claude -p`); the worked examples are hand-written and are not proof.

## Clarity
- [x] Layers are numbered clauses with defined terms (layer 01), so each clause can be cited
- [x] Every rule uses MUST or NEVER and has an id `R-ux-review-<n>` (25 rules: 13 usability, 12 conduct and folder)
- [x] No step relies on unstated knowledge (severity questions in layer 04 clause 9; how to check each rule in the references)
- [x] SKILL.md is at most 150 lines (85)
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
- [x] Eleven cases with unique ids and strict expectations (headings, fixed sections, exact sentences, `notContains`, `maxLines`)
- [x] Pass with `runEvals` on bad answers rejected in `tests/ux-review.test.mjs`
- [x] Live evals: 11 of 11 pass on fresh real-agent recordings in `evals/live/`; every answer was read by hand
- [x] Found by reading the first recordings and fixed in the skill, not in the cases: evidence was wrapped in backticks, a missing thing had no clear line (now "Shown absent:"), and one answer listed 9 to 11 open questions including code-correctness doubts (now at most 8, none about code correctness). All 11 cases were recorded again

## Preview quality
- [x] Tagline under 90 characters, 5 tags
- [x] Cover uses only `--cover-bg`, `--cover-accent` and `currentColor`

## Visual items
- Not a UI-output skill (text output); skipped.

## Install and portable
- [x] `node src/factory/portable-check.mjs ux-review --record`: used the skill in an empty project outside the repository, no repository rule leaked; the recorded answer was read (5 findings, correct severities, evidence quotes present, open questions for what the description did not show)

## Release
- [x] `node src/factory/lint-skills.mjs ux-review` exits 0
- [x] Version 1.0.0 matches SKILL.md, CHANGELOG and registry
- [x] Registry roles `BA_ANALYST`, `QA_AUDITOR`, as the owner's task states
