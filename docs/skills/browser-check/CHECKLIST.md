# browser-check review (2026-11-21)

Review against `docs/factory/REVIEW.md`. Status: ready, version 0.1.0, waiting for the owner's approval to merge to master.

Honest record: the author (an AI agent) ticked this list; the owner is the final reviewer. The 7 live answers, the routing answers (`77 of 77`) and the portable check came from fresh real agents (`claude -p`, no Playwright MCP, so every run used the script). The worked examples in `examples/README.md` are hand-written and are not proof. Live runs used the fixtures in `evals/fixtures/`, copied into an empty project folder outside the repository; the agent got a copy of the skill without `evals/`.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-browser-check-<n>` (14 rules)
- [x] Allowed commands are listed at the top of SKILL.md (from the Agentic-Harness trial: workers lost turns on denied shell commands)
- [x] SKILL.md is at most 150 lines (about 90)
- [x] Ten core layers, linked from SKILL.md (`chk-layers`); self-contained (`chk-portable`)

## Triggers
- [x] Description names the triggers (check in the browser, click through a flow, screenshots, console errors, journey test) and the exclusions (test-planner, a11y-audit, ui-polish, ux-review, public sites)
- [x] Routing cases bc1 to bc6 pass: three positives, a test-planner neighbour, an a11y-audit neighbour, a "none" case (writing a Playwright test file)

## Coverage
- [x] A flow with a real failing step and a 404 request (`signin-flow`)
- [x] A flow where every step passes, with screenshots at both widths (`signup-all-pass`)
- [x] The app is not running: fixed first line, every step NOT RUN, no PASS (`app-not-running`)
- [x] A public site: fixed refusal, nothing opened (`public-site`)
- [x] No address: one exact question (`no-address`)
- [x] The user's words match two buttons: the step fails, both are listed, the agent asks which one and does not guess (`ambiguous-join`, R-browser-check-14)
- [x] Every action step names the element it used ("used input \"Work email\"")
- [x] Boundary: a test-plan request gets the fixed sentence, then the flow runs and a page error is reported (`plan-boundary`)
- [x] Every rule in RULES.json has a checklist item

## Engine
- [x] `engine/check.mjs` refuses non-local hosts before a browser starts, validates steps, finds elements by the user's words (exact name first, then partial; none or several matches fail with the closest controls), serves a local file on 127.0.0.1, and exits 0, 1 or 2 (`tests/browser-check.test.mjs`)

## Evals
- [x] 7 live cases, `7 of 7` passing on recordings by fresh agents; engine report and steps files kept in `evals/live/files/`
- [x] Portable check: used the skill, no repository rule leaked, nothing in the repository touched; found a real wrong text and did not edit the page
