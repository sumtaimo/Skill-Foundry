# test-planner review (2026-11-14)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.0.0.

Honest record: the author (an AI agent) ticked this list; the owner is the final reviewer. Live answers came from fresh real agents (`claude -p`, one per case); the worked examples are hand-written and are not proof.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-test-planner-<n>` (14 rules)
- [x] No step relies on unstated knowledge (terms are defined in layer 01; exact sentences in layers 03 and 06)
- [x] SKILL.md is at most 150 lines (67)
- [x] Ten core layers with numbered steps, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no `src/`, `docs/` or `tests/` paths in SKILL.md, layers or references (`chk-portable`)

## Triggers
- [x] Description says when to use and when not (test code, bug review, plans for features the change does not describe)
- [x] Trigger words match the two requests users give ("what should we retest", "regression checklist for this diff")
- [x] Does not overlap skill-smith, figure-craft, changelog-writer or copy-tight; routing cases r13 to r16 pass

## Coverage
- [x] Main path (description), diff path, removed behaviour, user-named area not in the change, description/diff conflict
- [x] Missing-input paths: nothing given, title only (two different exact replies)
- [x] Negative paths: test-code request, bug-review request (exact decline sentence, no code)
- [x] Every rule in RULES.json has a check or checklist item

## Examples
- [x] Three examples (description, diff, test-code request); they follow the skill's own rules

## Evals
- [x] Nine cases with unique ids and strict expectations (headings, exact sentences, `notContains`, `maxLines`)
- [x] Pass with `runEvals` in `tests/test-planner.test.mjs`; the same test shows bad answers fail
- [x] Live evals: 9 of 9 pass on fresh real-agent recordings in `evals/live/`; every answer was read by hand
- [x] Failures found and fixed in the skill, not weakened: area meant a field (fixed in layer 01 and 04); title-only used the wrong reply (layer 03 split); a second item guessed from the same phrase (layer 04 step 8). One case expectation was wrong (`### Footer` instead of `### footer`); the change text writes it in lower case. The reason is in CHANGELOG.md

## Preview quality
- [x] Tagline under 90 characters, 4 tags
- [x] Cover uses only `--cover-bg`, `--cover-accent` and `currentColor`; rendered with the site stylesheet in light and dark and read by eye (the first draft used undefined tokens and was unreadable; redrawn)

## Visual items
- Not a UI skill (text output); skipped.

## Install
- [x] Zip unpacked into `.claude/skills/` of an empty project; a plain request that did not name the skill loaded it and gave a correct checklist

## Release
- [x] `node src/factory/lint-skills.mjs test-planner` exits 0
- [x] Version 1.0.0 matches SKILL.md, CHANGELOG and registry
- [x] Registry roles `BA_ANALYST`, `QA_AUDITOR`: chosen by the author (test planning is analysis plus QA); the owner can change them
- [x] Packed: `test-planner-1.0.0.zip` (`node src/factory/pack.mjs test-planner`)
