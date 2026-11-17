# design-system review (2026-11-15, second round: mid-tone fill, saturation cap, showcase swatches)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.0.0.

Honest record: the author (an AI agent) ticked this list; the owner (TAIMO) is the final reviewer. Every live answer
came from a fresh real agent (`claude -p`, one per case, started outside the repository so no repository rules reached
it, with only the skill folder and an output folder). The worked examples in `examples/README.md` are hand-written and are not proof.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-design-system-<n>` (18 rules; R-design-system-1 now covers `--color-brand`, the saturation taper and the 400 to 700 cap)
- [x] No step relies on unstated knowledge: terms in layer 01, scales, roles, groups and contrast formula in `references/README.md`, archetype numbers in `references/archetypes.md`
- [x] SKILL.md is at most 150 lines
- [x] Ten core layers with numbered steps, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no repository paths (`chk-portable`); the engine is inside the skill folder and uses only the Node.js standard library

## Triggers
- [x] Description says when to use it and when not (screens and pages; finished UI code goes to ui-polish)
- [x] Routing cases r21 to r26 pass (26 of 26 overall, re-run with real agents after this change); ui-polish (r26) and copy-tight (r25) neighbours still route correctly; "landing page in #0d9488" routes to none

## Coverage
- [x] Path a (one hex, two hexes with roles, a light yellow that fails with white text, a mid-tone teal #0d9488 whose button moves to primary-800, a dark navy, a red with a named font)
- [x] Path b (mood only: archetype default colour) and "like <brand>" (mapped, name never written)
- [x] Path c (pasted tokens: gap files only, existing failing pair kept and reported)
- [x] Missing input (exact ask sentence) and a screen request (exact decline sentence, no files, no markup)
- [x] Every rule in RULES.json has a check or checklist item

## Evals
- [x] Eleven cases (new: `midtone-teal`: `--color-brand: #0d9488`, primary-400 `#6bddd3`, fill `var(--color-primary-800)` with white text, both ratios 3.74:1 and 5.95:1 in the report) with strict expectations: exact ratios, hex placed at its exact step, file names, `notContains` for external links and the compared brand, `maxLines` for the fixed sentences
- [x] `tests/design-system.test.mjs`: cases pass on engine output and fail on bad answers; engine keeps hue (1 degree at steps 300 to 800, 4 elsewhere, 2000 random colours), tapers saturation, keeps steps 400 to 700 no more colourful than the input, and moves only mid-tone fills to the nearest darker step that carries white, passes every pair for all archetypes and edge colours, never overwrites in path c
- [x] Live evals 11 of 11 (`node src/factory/live-evals.mjs design-system`), all re-recorded after the change with `run-skill` so the produced files are kept in `runs/design-system/`. Each agent was `claude -p` started in a new folder under /tmp (outside the repository) with a copy of the skill folder without its `evals/` and only the case prompt; tools Read, Glob, Grep, Write, Edit and Bash for node, cd and ls
- [x] Every contrast ratio in every recorded run recomputed with separate code (Python, WCAG formula, resolving the CSS variables of the agent's tokens.css per mode): 262 role-and-mode checks, 0 failing, 0 differences from the reported numbers. White on #0d9488 3.74:1, white on #0b7067 5.95:1, black on #0d9488 5.61:1
- [x] Earlier rounds failed and the skill was fixed, not the cases: agents replied with their own summary instead of the report (the run wrapper asks for a "short report"), quoted searched strings, ran the engine inside the skill folder, and the long contrast table was cut by the 4000-character recording limit. Fixes: the report is shaped as files, checks, open questions; the engine prints how to reply, refuses to write into the skill folder, adds its own open questions and groups the table by role. Second round: a fresh agent added a files/checks list after the screen decline sentence (`screen-declined`, too many lines); layers 03 and 06 now say the fixed sentence is the whole reply even when a report is asked for, and every case was re-recorded. A first batch also failed because the runner did not allow `cd … && node`; that was the runner, not the skill, and those runs were discarded

## Visual items
- [x] `evals/live/files/hex-invoicing-demo.html` uses only tokens from the agent's tokens.css, copied word for word from the new run as `hex-invoicing-tokens.css`; `checkPage` 0 problems at 1440 and 390, light and dark, reduced motion (re-run after the change)

## Portable check
- [x] `evals/portable.json` re-recorded: skill used, no repository rules leaked, repository not touched, three files produced. The answer keeps #0d9488 at primary-700 and as `--color-brand`, puts the button on primary-800 #0b7067 with white text and shows both ratios (3.74:1 and 5.95:1, re-checked with separate code)

## Preview quality
- [x] Tagline 87 characters, 5 tags; cover uses only `--cover-bg`, `--cover-accent` and `currentColor`
- [x] Site cover is real output: colour swatches (brand, neutral, status) and a primary and secondary button with a text sample in light and dark, every colour read from the tokens.css of the `midtone-teal` live run (registry `showcase`); the file must match the run manifest's sha256 and the case must pass (`tests/site-real-output.test.mjs`). The skill page also names the run and request. Screenshots `showcase-landing.png`, `showcase-skill.png` and `showcase-skill-dark.png` at 1440 wide, device scale 2

## Release
- [x] Lint 0 problems; version 1.0.0 in SKILL.md, CHANGELOG and registry

# design-system S1 + S5 (2026-11-17, branch `claude/design-system-s1-s5`)

Review against `docs/factory/REVIEW.md`. Version stays 1.0.0 (L4); changes are in `CHANGELOG.md`. Real-agent results are marked **real**; engine unit tests and my own recomputation are marked **code**.

- [x] S1: SKILL.md and layer 04 tell the agent to run the engine as ONE plain command with the path of the script (no `cd`, no shell variable, no pipe, no `;` or `&&`), and the engine's own output says the same (after a run, and on an error with the exact open-question sentence for a hand build) (R-design-system-19). Tests: `tests/design-system.test.mjs` "S1" (code)
- [x] S1 proof (**real**): case `engine-one-command`: the fresh agent ran `node <path>/engine/tokens.mjs --out ... --primary ...`, one plain command; the report has the engine's text and no hand-build wording. Case `engine-unavailable`: with commands forbidden, the fresh agent built by hand and said "The engine could not run (...), so the tokens were built by hand; run the engine to confirm the numbers." as the first line after the heading and as an open question
- [x] S5: a family is present only with 3 or more matching tokens (`FAMILY_MIN`); with 1 or 2 it is partly present and its missing tokens are written to the gap files by name; no user token is defined again, also not in dark shadows, reduced motion or density blocks (R-design-system-20). Tests (code): a file with only `--gutter` still gets the full spacing scale, radius, shadow, motion and dark mode; the user file is byte for byte unchanged; running again with `--force` gives identical files
- [x] S5: the neutral scale keeps the project's own greys at their value, interpolates the missing steps and is contrast-checked; the default tinted scale is used, with the reason in the report, only when it cannot pass (R-design-system-21). Tests (code): greys found by value, kept steps and interpolated steps, strictly lighter to darker, every pair passes
- [x] S5 proof (**real**): case `existing-partial` (partial token file with `--gutter`, three greys and a brand colour): the report says spacing is only partly present, `--space-16: 16px` and the other families are written, and the neutral scale holds `#1f2933` at neutral-900, `#cbd2d9` at 200, `#f5f7fa` at 50. `existing-gaps` re-recorded (a single `--brand-primary`, `--radius-card`, `--font-body` no longer hide the primary, radius and type families)
- [x] All 14 live cases re-recorded once, fresh, on the final skill (`claude -p` outside the repository, a copy of the skill folder without `evals/`, only the case prompt, tools Read Glob Grep Write and Bash for node); `node src/factory/live-evals.mjs design-system`: 14 passed, 0 failed. Weakness found by the run and fixed in the skill, not the case: one agent wrote a forbidden font-rule string in its own open question (`font-editorial`); layer 04 now says to describe it in words
- [x] Every contrast ratio recomputed with separate code (Python, WCAG formula, resolving the CSS variables of each recorded tokens.css and tokens.gaps.css per mode): 792 role-and-mode checks, 0 failing; 334 report rows compared with the recomputed lowest ratio, 0 differences (rows of the hand-built run that use their own wording are skipped)
- [x] Portable check re-recorded by a fresh agent in an empty project (budgeting app, `#0d9488`): the engine report is the answer, repository not touched, three files; recipe `tokens-then-polish` re-recorded
- [x] Site cover still shows swatches from a recording (`midtone-teal`, `tests/site-real-output.test.mjs` passes)
- [x] `npm test` 0 failed, `npm run guard` ok, `npm run release:check` prints READY
