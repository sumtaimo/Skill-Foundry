# ui-polish review (2026-11-15, updated for design tokens and the contrast script)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.0.0.

Honest record: the author (an AI agent) ticked this list; the owner (TAIMO) is the final reviewer. Live answers came from fresh real agents (`claude -p`, one per case, read access only); the worked examples are hand-written and are not proof.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-ui-polish-<n>` (25 rules)
- [x] No step relies on unstated knowledge: terms in layer 01, scales and contrast table in references, exact sentences in layers 03 and 06
- [x] SKILL.md is at most 150 lines (under 150, lint checks it)
- [x] Ten core layers with numbered steps, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no repository paths in SKILL.md, layers or references (`chk-portable`)

## Triggers
- [x] Description says when to use and when not (new design, copy rewrite, full accessibility audit)
- [x] Routing cases r17 to r20 pass (20 of 20 overall); the copy-tight neighbour still routes to copy-tight

## Coverage
- [x] Plain CSS, Tailwind JSX, brand colour that fails contrast, text-rewrite request, already polished
- [x] Missing input: no code, description only (one exact sentence)
- [x] Negative path: new design request (exact decline sentence, no code)
- [x] Every rule in RULES.json has a check or checklist item

## Examples
- [x] Three hand-written examples (sign-in form, no code, new design); they follow the skill's own rules

## Evals
- [x] Twelve cases with strict expectations (exact ratios, kept text, headings, `notContains`, `maxLines`); four are token cases: CSS tokens, Tailwind/JSX with CSS variables, a value with no matching token, tokens that fail contrast
- [x] Pass with `runEvals` in `tests/ui-polish.test.mjs`; the same test shows bad answers fail
- [x] Live evals 12 of 12 on fresh real-agent recordings (the 8 old cases re-recorded); every answer read by hand and every table ratio recomputed with `engine/contrast.mjs` (87 pairs, 0 differences)
- [x] First run: all 8 agents were blocked from reading the skill (no read permission); re-run with read-only tools. One case was wrong (2.85:1 on white; the background is #f9fafb, so 2.73:1); reason in CHANGELOG.md

## Visual items
- [x] Polished HTML from three live recordings, copied word for word into `evals/live/files/`; `checkPage` 0 problems at 1440 and 390 wide, light and dark, reduced motion

## Portable check
- [x] `evals/portable.json`: skill used, no repository rules leaked, repository not touched. One hand-computed ratio was 7.14:1 against a real 7.13:1 (still passes); the agent said it computed it by hand

## Preview quality
- [x] Tagline under 90 characters, 4 tags; cover uses only `--cover-bg`, `--cover-accent` and `currentColor`

## Design tokens and contrast script (this update)
- [x] Token mode: tokens used wherever one matches, primary action on the primary-fill tokens, no invented token name (searched in the four token recordings), token file not edited, no `:root` in the polished code
- [x] A value with no matching token stays plain and is an Open question (`tokens-no-match`: `#7c3aed`); a failing token pair is kept and reported (`tokens-fail-contrast`: `--color-text-muted` 2.54:1)
- [x] Default mode unchanged: `settings-card` and `tailwind-jsx` contain no `var(--`
- [x] `engine/contrast.mjs`: standard library only, read-only, agrees with the reference table, reads `tokens.css` and `design-tokens.json` the same way (tests in `tests/ui-polish.test.mjs`)
- [x] Ratio source stated in every reply; two recordings were made on purpose without permission to run commands (table and by-hand sentences). The by-hand ratios were 0.01 off once (4.62:1 for 4.63:1) and the reply said so; the table now has #f9fafb and #f3f4f6 columns
- [x] Portable check in an empty project that has `styles/tokens.css` and `design-tokens.json`: the agent found the token file by itself, used the skill, leaked no repository rules
- [x] Recipe `tokens-then-polish` recorded: design-system then ui-polish, both used
- [x] Visual: polished HTML of six live recordings (three of them with the pasted tokens.css) in `evals/live/files/`, `checkPage` 0 problems
- [ ] Final reviewer: TAIMO. Not covered by an eval: a token file in another tool's naming (the skill says to match by meaning); dark-theme check of token pairs (stated in layer 06, step 18, seen in the recipe answer only)

## S1, S2, S3 update (2026-11-16, version stays 1.0.0)
- [x] S1: the script is run as one plain command with its full path (rule 26); the reply says plainly when it could not run. Real agent, `script-one-command`: "Ratios computed with the contrast script." under a sandbox that only allows `node`
- [x] S2: never lower a passing pair, never swap a passing value for a different token value, a found-but-not-loaded token file is reported (rules 27 to 29). Real agent, `passing-dark-button`: near-black button kept at 18.88:1, token values that differ listed under Open questions; the recipe answer keeps a passing heading and asks
- [x] S3: optional screenshot or measurement sheet and a text-overflow rule (rule 30); one stylesheet patch plus per-page deltas (rule 31). Real agents, `overflow-measured` and `shared-stylesheet`
- [x] Four new cases (16 in total); all 12 old cases re-recorded with fresh agents after the change; `tokens-css` expectation changed (reason in CHANGELOG.md); the S2 cases and the recipe were re-recorded once more after one wording fix
- [x] Portable check and recipe `tokens-then-polish` re-recorded; `checkPage` 0 problems on the 9 HTML files in `evals/live/files/`
- [ ] Known, not fixed here: the portable agent sometimes rewords the fixed ratio-source sentence and the summary line; the recipe agent added a link to `tokens.css` that the input did not have (rule 12 intends only links already present). Final reviewer: TAIMO
