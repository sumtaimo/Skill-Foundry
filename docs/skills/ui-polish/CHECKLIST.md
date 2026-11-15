# ui-polish review (2026-11-15)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.0.0.

Honest record: the author (an AI agent) ticked this list; the owner (TAIMO) is the final reviewer. Live answers came from fresh real agents (`claude -p`, one per case, read access only); the worked examples are hand-written and are not proof.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-ui-polish-<n>` (19 rules)
- [x] No step relies on unstated knowledge: terms in layer 01, scales and contrast table in references, exact sentences in layers 03 and 06
- [x] SKILL.md is at most 150 lines (75)
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
- [x] Eight cases with strict expectations (exact ratios, kept text, headings, `notContains`, `maxLines`)
- [x] Pass with `runEvals` in `tests/ui-polish.test.mjs`; the same test shows bad answers fail
- [x] Live evals 8 of 8 on fresh real-agent recordings; every answer read by hand and every contrast ratio recomputed
- [x] First run: all 8 agents were blocked from reading the skill (no read permission); re-run with read-only tools. One case was wrong (2.85:1 on white; the background is #f9fafb, so 2.73:1); reason in CHANGELOG.md

## Visual items
- [x] Polished HTML from three live recordings, copied word for word into `evals/live/files/`; `checkPage` 0 problems at 1440 and 390 wide, light and dark, reduced motion

## Portable check
- [x] `evals/portable.json`: skill used, no repository rules leaked, repository not touched. One hand-computed ratio was 7.14:1 against a real 7.13:1 (still passes); the agent said it computed it by hand

## Preview quality
- [x] Tagline under 90 characters, 4 tags; cover uses only `--cover-bg`, `--cover-accent` and `currentColor`
