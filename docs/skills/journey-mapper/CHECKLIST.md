# journey-mapper review (2026-11-21)

Review against `docs/factory/REVIEW.md`. Status: ready, version 0.1.0, waiting for the owner's approval to merge to master.

Honest record: the author (an AI agent) ticked this list; the owner is the final reviewer. The 9 live answers, the routing answers (`89 of 89`) and the portable check came from fresh real agents (`claude -p`). Live agents ran in an empty project folder outside the repository with a copy of the skill without `evals/`, and only the tools Read, Glob and Grep; each recording lists the tools used and the files written. The two harness cases ran in a copy of a fixture project (`evals/fixtures/`) with journey-mapper and spec-writer installed in `.claude/skills`, and got the exact prompts the Agentic-Harness session captured from harness 1.0.41 as their only input. The worked examples in `examples/README.md` and the reference answers in `tests/journey-mapper.test.mjs` are hand-written and are not proof.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-journey-mapper-<n>` (13 rules)
- [x] SKILL.md is at most 150 lines (about 85)
- [x] The task's own format and assigned file are read first, at the top of SKILL.md (R-journey-mapper-14 and 15, from the Agentic-Harness risk check)
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
- [x] Harness planner (`harness-feature-json`): the reply is only JSON that the harness parser accepts (tested against its rules: titles, 1 to 4 workers, roles and paths, test files only for QA, no overlap, one whole-journey step last); 10 steps grown from "login", each guessed rule left in `needsDecision`, no Markdown map
- [x] Harness worker (`harness-step-worker`): wrote the map into its assigned file `docs/signup-spec.md` and no other file; quoted "at least 8 characters"; left the validation messages as blocking questions and said in its report which acceptance criterion that leaves open
- [x] Every step of every live map has the seven slots in order, every question id used is asked, blocking questions first, no question suggests (`tests/journey-mapper.test.mjs`)
- [x] Every rule in RULES.json has a checklist item

## Evals
- [x] 9 live cases, `9 of 9` passing on recordings by fresh agents. First run was 6 of 7: the conflict line read "Conflict (steps 2-3):"; the skill now gives the exact line, the case was not changed. The worker case first allowed 8 reply lines; it allows 30 because the worker's report on each acceptance criterion is wanted (in the CHANGELOG)
- [x] Portable check: used the skill, no repository rule leaked, nothing written; a book-club goal gave 3 quoted steps and 8 blocking questions; it had a write tool and wrote nothing (tie, voting window, votes per member) with no invented rule
