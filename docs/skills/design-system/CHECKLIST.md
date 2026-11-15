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
