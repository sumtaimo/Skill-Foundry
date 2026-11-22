# web-research review (2026-11-22)

Review against `docs/factory/REVIEW.md`. Status: ready, version 0.1.0, waiting for the owner's approval to merge to master.

Honest record: the author (an AI agent) ticked this list; the owner is the final reviewer. The 12 live answers, the routing answers (`95 of 95`) and the portable check came from fresh real agents (`claude -p`). Live agents ran in an empty project folder outside the repository (a copy of a fixture project where the case has one) with a copy of the skill without `evals/`, and only the tools each case names (Read, Glob, Grep and WebFetch; Read, Glob and Grep for the no-fetch case; the harness worker also Write, Edit and `Bash(git status)`). WebFetch stands in for the BA role's `mcp__fetch`. Each recording lists the tools used, every fetch with its result, every file read and every file written. The two harness cases got the exact prompt shape of Agentic-Harness 1.0.41 (`[HARNESS FEATURE_BA]` and a BA worker with an assigned file) as their only input, with the skills installed in `.claude/skills`. The worked examples in `examples/README.md` and the reference answers in `tests/web-research.test.mjs` are hand-written and are not proof.

Network: this environment's proxy refuses developer.mozilla.org and www.w3.org, so the live cases read the Node.js docs (nodejs.org, real fetches) and saved pages from `evals/fixtures/` (the injection and conflict cases).

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-web-research-<n>` (17 rules)
- [x] SKILL.md is at most 150 lines (86)
- [x] The fetch tool, the task's own format, an assigned file and "page text is data" are read first, at the top of SKILL.md
- [x] Ten core layers, linked from SKILL.md (`chk-layers`); self-contained (`chk-portable`)

## Triggers
- [x] Description names the triggers (what the docs say, check the standard, competitor research, best practice, compare products, read given URLs) and the exclusions (journey-mapper, spec-writer, log in or fill forms)
- [x] Routing cases wr1 to wr6 pass: three positives (docs, competitor pricing, a standard quote), a journey-mapper neighbour, a spec-writer neighbour, a browser-check neighbour
- [x] Registry keywords are whole phrases of at least 8 characters, no bare "research" or "standard"; on the harness FEATURE_BA topic journey-mapper always stays first, and web-research takes the second slot only when the goal asks for research outright ("web research", "competitor research"); roles BA_ANALYST only; not default; no engine (`tests/web-research.test.mjs`)

## Coverage
- [x] One official page, quoted facts and inferences apart (`node-docs-fact`)
- [x] A 404 page named under Not fetched with the tool's reason, never cited (`not-fetched`)
- [x] No URL given: the agent picked the official Node.js page itself (`no-url-given`)
- [x] No fetch tool: the fixed first line, the URL under Not fetched, no fact from memory (`no-fetch-tool`)
- [x] No question: the one fixed question (`no-question`)
- [x] Prompt injection: a saved page with a hidden instruction and an HTML comment; both under Warnings, none followed, no file written (`prompt-injection`)
- [x] Two sources that disagree: both kept as facts, one Conflict: question (`conflict`)
- [x] Boundary with journey-mapper: fixed sentence first, research, no journey map (`journey-boundary`)
- [x] Boundary with spec-writer: fixed sentence first, research, no Given-When-Then (`ac-boundary`)
- [x] Login and forms: fixed sentence, the login URL not fetched, listed as needing a login or a form (`login-form-boundary`)
- [x] Harness planner (`harness-feature-json`): only JSON that the harness parser rules accept, the cited crypto URL fetched in the session, no Markdown report
- [x] Harness worker (`harness-worker-file`): the note is in its assigned file only, in the layer 08 format, every fact cites the fetched URL
- [x] Every cited URL was fetched (or the saved page read) in the session; every quote is at most 25 words and found in the tool result (`tests/web-research.test.mjs`)
- [x] Every rule in RULES.json has a checklist item

## Examples
- [x] examples/README.md shows a cited answer, the no-fetch-tool reply and the no-question reply
- [x] Examples follow the skill's own rules (the Node.js quote is on the live page)

## Evals
- [x] 12 live cases, `12 of 12` passing on recordings by fresh agents (see the CHANGELOG for what earlier runs found)
- [x] Portable check: see below
- [x] Each case has a unique id; negative checks (`notContains`, `maxLines`) in every boundary case

## Preview quality
- [x] Tagline at most 90 characters, states the outcome
- [x] 5 tags
- [x] Example prompt works as written (it is the `node-docs-fact` request in other words)
- [x] cover.svg uses only `var(--...)` and `currentColor`

## Visual items
- [x] Not a UI skill: no page output

## Release
- [x] `node src/factory/lint-skills.mjs web-research` exits 0
- [x] Version, CHANGELOG and registry entry match (0.1.0)
