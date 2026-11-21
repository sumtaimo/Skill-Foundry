# journey-mapper review (2026-11-21)

Review against `docs/factory/REVIEW.md`. Status: ready, version 0.1.0, waiting for the owner's approval to merge to master.

Honest record: the author (an AI agent) ticked this list; the owner is the final reviewer. The 7 live answers, the routing answers (`83 of 83`) and the portable check came from fresh real agents (`claude -p`). Live agents ran in an empty project folder outside the repository with a copy of the skill without `evals/`, and only the tools Read, Glob and Grep (like the read-only `[HARNESS FEATURE_BA]` planner call); each recording lists the tools used and the files written (none). The worked examples in `examples/README.md` and the reference answers in `tests/journey-mapper.test.mjs` are hand-written and are not proof.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-journey-mapper-<n>` (13 rules)
- [x] SKILL.md is at most 150 lines (about 75)
- [x] Ten core layers, linked from SKILL.md (`chk-layers`); self-contained (`chk-portable`)

## Triggers
- [x] Description names the triggers (map the user journey, user flow, whole workflow, states and edge cases of onboarding, sign-up or checkout) and the exclusions (spec-writer, test-planner, ux-review, screen design, browser-check)
- [x] Routing cases jm1 to jm6 pass: three positives, a spec-writer neighbour, a test-planner neighbour, a "none" case (estimate and build order)
- [x] Registry keywords hit the FEATURE_BA match text ("journey", "workflow", "feature"), every keyword at least 4 characters; roles BA_ANALYST only; not default; no engine

## Coverage
- [x] A stated goal with a rule, a step and an end state, all quoted (`signup-short`)
- [x] A thin goal: gaps become questions, no payment provider or method is suggested (`checkout-thin`)
- [x] No goal: the one fixed question, no map (`no-goal`)
- [x] Boundary with spec-writer: fixed sentence first, then the map, no Given-When-Then clause (`ac-boundary`)
- [x] Boundary with test-planner: only the fixed sentence, no map, no checklist (`retest-boundary`)
- [x] Two roles, a stated reload rule, a skipped step and a conflict of limits as one blocking "Conflict:" question (`onboarding-roles-reload`)
- [x] Read-only: a request to save a file gets the fixed sentence and the map; nothing was written (`save-file-read-only`)
- [x] Every step of every live map has the seven slots in order, every question id used is asked, blocking questions first, no question suggests (`tests/journey-mapper.test.mjs`)
- [x] Every rule in RULES.json has a checklist item

## Evals
- [x] 7 live cases, `7 of 7` passing on recordings by fresh agents. First run was 6 of 7: the conflict line read "Conflict (steps 2-3):"; the skill now gives the exact line, the case was not changed
- [x] Portable check: used the skill, no repository rule leaked, nothing written; a book-club goal gave 3 quoted steps and 9 blocking questions (tie, voting window, votes per member) with no invented rule
