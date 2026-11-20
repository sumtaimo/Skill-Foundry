# design-system review (2026-11-15, second round: mid-tone fill, saturation cap, showcase swatches)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.2.0 (2026-11-20; see the sections at the end: 1.1.0 UI-2026-02, then 1.2.0 design foundation).

Honest record: the author (an AI agent) ticked this list; the owner is the final reviewer. Every live answer
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
- [x] Lint 0 problems; version 1.1.0 in SKILL.md, CHANGELOG and registry

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

# design-system 1.1.0 (2026-11-20, UI-2026-02, branch `lab`)

Real-agent results are marked **real**; engine unit tests are marked **code**.

- [x] Optional 2026 token group (R-design-system-22), only with the engine flag `--modern`, only when the user asks for glass, glow, gloss, z-index layers or modern effects: `--glass-bg`, `--glass-blur`, `--r-xs`..`--r-xl` (4/6/10/14/16 px), `--z-sticky`, `--z-dropdown`, `--z-command`, `--z-modal`, `--z-toast`, `--glow`, `--btn-gloss`, `--font-weight-medium: 500` (names as in ui-craft). A named web font goes first in the stack; no files or imports. Tests (code): every 1.0.0 line is still in the output, the group is absent without the flag, dark values exist, path c never rewrites a user token (`--z-modal`)
- [x] Proof (**real**): cases `modern-glass` (Inter plus glass, glow, gloss, z layers), `modern-midtone` (#0d9488 keeps primary-800 button and 3.74:1 note) and `modern-not-asked` ("modern and clean" with no effect asked: none of the group is written). `node src/factory/live-evals.mjs design-system`: 17 passed, 0 failed. Run with `run-skill` (fresh `claude -p`, skill folder and prompt only). Smoke first (`modern-glass`), then the rest
- [x] Portable check re-recorded (**real**, empty project outside the repository): skill used, repository not touched, three files, answer read in full
- [x] Fixed in the skill, not in the cases: the 2026 line of the report was long enough to push `### Open questions` past the 4000-character recording, so it is now one short line
- [ ] Known weakness, not fixed: current fresh agents often add one lead-in sentence before the report ("The engine exited 0… Here is the report"), also on the old case `mood-calm`. Four wording changes (SKILL.md top line, layers 07, 08, 09, the engine's last line) did not remove it. The cases do not forbid it (parity with the 14 older cases); R-design-system-14 asks for no text before the heading. Owner to decide
- [x] Runners (`live-evals`, `portable-check`, `run-skill`) start the agent with the user's machine hooks off (`--settings` temp file, `disableAllHooks`) because a hook on the machine hung every headless run; the user's own settings are not changed
- [x] `npm run guard` ok. `npm test`: 409 passed, 2 failed, both from the recipe `tokens-then-polish`, now stale because design-system changed; a re-record was refused (the agent used neither skill and tried to publish an artifact). The owner chose to leave it for UI-2026-03 (ui-polish 1.1.0), which re-records it; until then `npm run release:check` is NOT READY on that gate only

# design-system 1.2.0: design foundation with variables (2026-11-20, branch `plan/design-foundation`)

Review against `docs/factory/REVIEW.md`. Plan: `docs/factory/notes/design-foundation-plan.md` (session S1, owner decisions D1 to D5). Real-agent results are marked **real**; engine tests and my own recomputation are marked **code**. The owner approved version 1.2.0 in chat.

## Clarity and rules
- [x] New rules R-design-system-23 to R-design-system-27 (foundation written by `init`, changed only by `set`, `check --code` only reports, Khmer line, stop after `init`); R-9, R-12 and R-22 reworded; SKILL.md 102 lines; lint 0 problems (**code**)
- [x] Ten core layers updated; new path d in layers 01 to 10; no repository path in the skill text; the word "2026" is gone from the skill text (the flag `--modern` and every token name are unchanged)
- [x] Cold start: the one-sentence ask is replaced by a six-line brief with a recommended answer on each line, asked once; answers saved in `design/BRIEF.md`

## Engine (`engine/variables.mjs`, no dependencies)
- [x] `init`, `set`, `check`, `explain`, `build`; three tiers (117 primitive, 43 semantic, 20 component variables), light and dark per semantic colour, scopes, code names (**code**, `tests/design-system-variables.test.mjs`, 17 tests)
- [x] `set` checks 43 contrast pairs in light and dark first and writes nothing when one fails; names the nearest passing value (a refused `#cccccc` muted text gives `#6b6b6b`); a value the user set is kept when the brand colour changes later; a colour role changes light mode only unless `--mode` says otherwise (**code**)
- [x] `check` finds a hand-edited generated file, broken aliases and cycles; `check --code` reports raw colours, raw sizes and a wrong scope in web files, ignores `href="#abc"`, and never edits code (**code**)
- [x] Paths a, b and c are unchanged: `engine/tokens.mjs` has only an override hook that is empty on those paths; the 17 earlier cases pass on the engine output (**code**, `tests/design-system.test.mjs`, 20 tests)

## Evals
- [x] 21 live cases, all re-recorded with fresh agents (`claude -p` through `run-skill`, skill folder and case prompt only): the 17 earlier cases, the changed `no-input` (the brief) and the new `foundation-ok`, `foundation-set-border`, `foundation-set-refused`, `foundation-defaults`. `live-evals` 21 of 21 (**real**)
- [x] The agents ran the engine and did not write the files by hand: `check` prints CHECK PASSED on the foundation of each recorded run (**code**)
- [x] Independent recomputation with separate code (Python, WCAG formula, resolving the `var()` chains of the agents' tokens.css per mode): 96 role-and-mode checks over four recorded foundations, 0 failing. `foundation-set-border` has `--color-border-default: #c9d3d2` in light; the refused run has its border unchanged (**code**)
- [x] The first portable run answered with only the last printout when one request needed `init` and then `set`; that was a gap in the skill, not in the case. Layers 06 and 08 and SKILL.md now say the reply is the `init` report, a blank line, then each printout; the portable check and the two set cases were run again and follow it (**real**)
- [x] Routing 62 of 62 with the new description, including two new cases `ds1` (design foundation) and `ds2` (change the border colour everywhere) (**real**)
- [x] Portable check re-recorded in an empty project outside the repository: skill used, no repository rules leaked, repository not touched, six files produced; the answer is the `init` report and the `set` printout (**real**)
- [x] Recipe `tokens-then-polish` re-recorded after the skill changed (**real**)

## Known limits (named, planned for S2, not hidden)
- Paths a and b still write the plain token files; path d is chosen by an explicit request or an existing `design/variables.json`. Making path d the default for them is a later change.
- Not in 1.2.0: more than two font weights, brands as modes, density and platform modes, stacks other than web (CSS), Figma import and export, component specs (`component-kit`).
- The recorder of the factory kept only 4000 characters of a reply; a path d reply is longer, so it now keeps 12000 (`src/factory/run-skill.mjs`, a separate commit).

