# spec-writer review (2026-11-15)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.0.0.

Honest record: the author (an AI agent) ticked this list; the owner is the final reviewer. Live answers, routing answers, the portable check and the recipe run came from fresh real agents (`claude -p`); the worked examples in `examples/README.md` and the reference answers in `tests/spec-writer.test.mjs` are hand-written and are not proof.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-spec-writer-<n>` (14 rules)
- [x] No step relies on unstated knowledge (ten terms defined in layer 01; exact sentences in layers 03 and 06)
- [x] SKILL.md is at most 150 lines (66)
- [x] Ten core layers written as numbered clauses, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no `src/`, `docs/` or `tests/` paths in SKILL.md, layers or references (`chk-portable`)

## Triggers
- [x] Description says when to use ("write acceptance criteria", "turn this user story into Given-When-Then", "spec this requirement")
- [x] Description says when not, and names the alternatives (test-planner for a regression checklist, copy-tight for copy)
- [x] Trigger words match how a BA or PO phrases the request
- [x] Does not overlap another skill: routing cases sw1 to sw9 (spec-writer vs test-planner vs changelog-writer vs copy-tight vs none) pass, 35 of 35 in the full routing run by a fresh agent
- [x] Overlap gate (`docs/factory/ROADMAP.md`): spec-writer was the approved Candidates row; no Built skill writes acceptance criteria. Its row moved to Built

## Coverage
- [x] Main path with validation, limits and an exclusion; roles, disabled state and reload; thin text (one statement); vague words; conflicting statements
- [x] Missing-input paths: nothing given, a title only (two different exact replies)
- [x] Boundary paths: test code, regression checklist for a diff (points to test-planner, no criteria), estimate and priority
- [x] Every rule in RULES.json has a check or checklist item
- [x] Checklist rules R-spec-writer-1 to 10 reviewed against the ten recorded answers: each clause states only what its request states; one line, Given-when-then once each; source phrase found in the request (also asserted by the test); ids in one run; no empty heading; every gap a question starting with a heading name, none suggesting a value; vague words ("fast", "easy", "simple") got the measurable-value question and no number; out of scope only the text's own exclusions; fixed sentences exact

## Examples
- [x] `examples/README.md` shows two realistic inputs with outputs and the fixed sentences
- [x] Examples follow the skill's own rules

## Evals
- [x] Twelve cases with unique ids and strict expectations (headings, exact sentences, `notContains`, `maxLines`)
- [x] Pass with `runEvals` in `tests/spec-writer.test.mjs`; the same test shows bad answers fail (criteria instead of a fixed sentence, test code, a checklist, story points, a made-up number for "fast", an invented limit, a clause on a conflict)
- [x] Live evals: 12 of 12 pass on fresh real-agent recordings in `evals/live/` (`node src/factory/live-evals.mjs spec-writer`); every answer was read by hand
- [x] One case expectation was wrong and was corrected, not weakened: `vague-words` expected the quote "easy to use" where the vague word is "easy". The reason is in CHANGELOG.md. No skill fix was needed after the first recordings

## Preview quality
- [x] Tagline is 87 characters and states the outcome; 4 tags
- [x] Example prompt works as written (it is a shorter form of the portable-check request)
- [x] Cover uses only `--cover-bg`, `--cover-accent` and `currentColor`. On the site the cover is not this drawing: it is the real portable-check answer drawn as a document (`showcase-landing.png`, `showcase-skill.png`)

## Visual items
- Not a UI skill (text output); skipped.

## Install
- [x] Portable check: installed into an empty project outside the repository with the user CLI path; a plain request that did not name the skill loaded it and gave correct criteria (`evals/portable.json`; 6 clauses, all 7 source phrases in the request, no repository rule in the answer)
- [x] Recipe `spec-then-retest`: with spec-writer and test-planner installed together, a real agent used spec-writer for the story and test-planner for the change, in that order (`src/factory/recipes/spec-then-retest.json`)

## Release
- [x] `node src/factory/lint-skills.mjs spec-writer` exits 0
- [x] Version 1.0.0 matches SKILL.md, CHANGELOG and registry
- [x] Registry roles `BA_ANALYST`, `PO_ARCHITECT` (set by the owner in the task)
- [x] Packed: `spec-writer-1.0.0.zip` (`node src/factory/pack.mjs spec-writer`)
- [x] `npm run release:check` prints READY

## Update: fewer, blocking-first open questions (2026-11-15, version stays 1.0.0)
- [x] Only questions that block a clause are `[blocking]`; each ends with `Blocks:` and an existing clause id or a quoted source phrase found in the request (checked in `tests/spec-writer.test.mjs` on every recording)
- [x] Blocking questions come first and have no cap; a vague word and a conflict are always blocking (rule R-spec-writer-7, layer 04 clauses 10 and 11)
- [x] Minor questions are at most three lines of two questions each, or dropped when they restate a default (R-spec-writer-15)
- [x] New eval cases `many-blocking-questions` (six blocking questions kept) and `minor-questions-merged`
- [x] All 12 live evals, the portable check and the recipe `spec-then-retest` re-recorded with fresh agents; showcase screenshots retaken; routing not re-recorded (description unchanged)
- [x] Honest note: the author (an AI agent) ticked this list; the owner is the final reviewer. `examples/README.md` and the reference answers in the test are hand-written, not proof

## Update: Agentic-Harness 1.0.47 alignment (2026-11-25, version stays 1.0.0)
- [x] Added rule `R-spec-writer-16`: multi-step/multi-screen features include a compact `### Flow & State Table` (`Step | User does | System shows (loading / empty / error / success) | Next or exit`) plus 1 line each for `Entry point:`, `Exit:`, `Reload:`, and `Permissions:`; single-screen stories omit it
- [x] Added rule `R-spec-writer-17`: when `docs/foundation/product.md` or `docs/foundation/domain.md` is present, read it by reference for product context and treat any `(fill me)` line as unknown under `### Open questions` (`Needs a decision`) without inventing rules
- [x] Added two new eval cases (`multi-step-flow-table`, `foundation-fill-me-unknown`) and recorded live answers from fresh `agy` agents (`14/14` pass in `node src/factory/live-evals.mjs spec-writer`)
- [x] Re-recorded `evals/portable.json` (`usedSkill: true`, `leakedRepoRules: false`, `touchedRepo: []`) and `src/factory/recipes/spec-then-retest.json` (`used: ["spec-writer", "test-planner"]`) with fresh `agy` agents; routing not re-recorded because frontmatter `description:` did not change
- [x] Honest note: new live recordings (`multi-step-flow-table`, `foundation-fill-me-unknown`), `evals/portable.json`, and `spec-then-retest.json` came from fresh `agy` agents; reference answers in `tests/spec-writer.test.mjs` are hand-written and are not proof
