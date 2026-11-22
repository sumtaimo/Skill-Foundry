# bug-hunter review (2026-11-22)

Review against `docs/factory/REVIEW.md`. Status: ready, version 0.1.0, waiting for the owner's approval to merge to master.

Honest record: the author (an AI agent) ticked this list; the owner is the final reviewer. The 12 live answers, the routing answers (`89 of 89`) and the portable check came from fresh real agents (`claude -p`). Live agents ran in an empty project folder outside the repository with a copy of the skill without `evals/` and, for 11 cases, a fixture project from `evals/fixtures/` (a tiny ES module, `node --test` tests and a `test` script, each with known bugs on known lines). Tools: Read, Glob, Grep and Bash with `Bash(npm test:*)` and `Bash(node --test:*)` allowed; Write and Edit only in `assigned-test-file`. Each recording lists every command the agent ran and every file it changed. The worked examples in `examples/README.md` and the reference answers in `tests/bug-hunter.test.mjs` are hand-written and are not proof.

Known gap, reported honestly: Claude Code auto-allows its own read-only shell commands inside the project, so in 4 of 12 final recordings the agent also listed or read files with `find` or `cat` although SKILL.md says not to (nothing was written; all cited lines are still right, `tests/bug-hunter.test.mjs` checks each one). In a read-only harness call that denies those commands, the agent loses that turn and then uses the read tool.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-bug-hunter-<n>` (15 rules)
- [x] SKILL.md is at most 150 lines (about 90)
- [x] Ten core layers, linked from SKILL.md (`chk-layers`); self-contained (`chk-portable`)

## Triggers
- [x] Description names the triggers (hunt for bugs, bug hunt, find the bug, why does this crash, what is broken, check for regressions, edge cases that break this code) and the exclusions (test-planner, ui-polish, a11y-audit, writing the fix)
- [x] Routing cases bh1 to bh6 pass: three positives, a test-planner neighbour (regression checklist), an a11y-audit neighbour, a "none" case (CI setup)
- [x] Registry keywords rank bug-hunter first on the HUNTER match text "bug hunt regression tests: <scope>" (4 hits, longest phrase) over test-champion (4 hits, shorter) and security-guard, and never match "regression checklist"; every keyword at least 4 characters; roles QA_AUDITOR only; not default; no engine

## Coverage
- [x] Confirmed bug from a failing test, with the user's symptom (`cart-symptom`)
- [x] Harness HUNTER request: one confirmed (NaN on an empty list) and one suspect (mutation against its doc comment); no false finding on a `filter().sort()` trap (`harness-hunter`)
- [x] Green tests, real bug found by reading: suspect with input, `file:line` and Red test (`uncovered-suspect`)
- [x] No test command (npm placeholder script): fixed sentence, every finding a suspect (`no-test-command`)
- [x] Honest "no bug found" line, no invented edge case (`clean-no-bug`; an earlier run reported `clamp(NaN)`, the skill was fixed)
- [x] Boundary with ui-polish and a11y-audit: fixed sentence first, no style finding (`style-boundary`)
- [x] Boundary with test-planner: only the fixed sentence (`retest-boundary`)
- [x] Request to fix: read-only sentence and the Red-Green plan, nothing written (`fix-read-only`)
- [x] No code: the one fixed line (`no-code`)
- [x] Task-required JSON format: valid JSON only, each finding keeps status, line, Red and Green (`json-format`)
- [x] Assigned test file with a write tool: only that file changed, Red test added, test command ran again, suspect became confirmed, no fix written (`assigned-test-file`)
- [x] Pasted code: cited as `pasted:<line>`, no test command (`pasted-code`)
- [x] Every rule in RULES.json has a checklist item

## Evals
- [x] 12 live cases, `12 of 12` passing on recordings by fresh agents. Skill fixes from real runs: function-fine paragraphs, shell reads giving a wrong line number (`orders.js:10` for line 9), a `NaN` suspect with an invented expected value, a misplaced fixed sentence in the JSON summary, pasted code citation. Two cases were wrong and changed (exact suspect count; one named fix where several are right), each explained in the skill CHANGELOG
- [x] Portable check: used the skill, no repository rule leaked, nothing written; a pasted `invoiceTotal` gave the no-test sentence and one correct suspect at `pasted:5` (percent used as a fraction: 800 instead of 107)
