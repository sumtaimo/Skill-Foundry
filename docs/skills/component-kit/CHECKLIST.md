# component-kit 1.0.0 review (status: draft, not yet ready)

Review against `docs/factory/REVIEW.md`. Real-agent results are marked **real**; checker unit tests and my own re-runs are marked **code**; hand-written files are marked **hand-written**.

## Built
- [x] Two steps (SPEC, CODE) that hand off through `design/STATUS.md`; one step per turn; ten core layers, RULES.json (17 rules), CHANGELOG, preview, cover. Lint 0 problems, `npm run guard` ok (**code**)
- [x] `engine/spec-check.mjs` (`status`, `spec`, `code`), no dependencies; 15 tests in `tests/component-kit.test.mjs` (**code**)
- [x] `examples/sample-design/` is a real design-system foundation (tokens.css) with hand-written BRIEF.md and two **hand-written** model specs (button, card); they are fixtures, not proof. `examples/install-sample.mjs` copies them into a test project

## Real-agent proof
- [x] 9 live cases recorded with fresh `claude -p` agents through `run-skill` (skill folder and case prompt only): no-design, spec-three, spec-all-capped, spec-new-vars, code-html, code-tailwind, code-no-spec, both-in-one, code-demo. `live-evals component-kit`: 9 passed, 0 failed (**real**)
- [x] I re-ran the checker myself on the files of every recorded run: all specs and all code PASSED (**code**)
- [x] First round found two case mistakes (the fixture's own tokens.css contains the brand hex, so the "no raw hex" expectation measured the fixture; Tailwind writes `focus-visible:` without a colon) and two skill gaps (code used variables the spec did not list; `--dir` was not explained). The skill and the two expectations were fixed, and every case was recorded again on the final text
- [x] `evals/live/files/code-demo.html` (agent-written demo with every state, plus its tokens.css and component CSS): `checkPage` 0 problems at 1440 and 390, light and dark, reduced motion (**real** output, **code** check)

## Not done yet (real blocker, named)
- [ ] Routing recording and portable recording. Blocker: `routing-evals.mjs` and `portable-check.mjs` only accept skills with registry status `ready`, and AGENTS.md rule 6 forbids `ready` before `npm test` passes, which fails until those two recordings exist. Cases `ck1` to `ck6` are added (3 positive, ck4 to ck6 near misses ui-craft, ui-polish, a11y-audit). Needs the owner or coordinator to allow a temporary `ready` for these two runs
- [ ] `npm run release:check` READY: depends on the item above
- [ ] Known risk: ui-craft's description says "build a UI component"; routing of "build the button" requests may go to ui-craft until its S4 session narrows that wording
