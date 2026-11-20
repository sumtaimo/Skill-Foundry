# ui-craft review (2026-11-20)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.0.0.

Honest record: the author (an AI agent) wrote the skill and the reference outputs. Every live, routing and portable recording below came from a fresh real `claude -p` agent; none were hand-written. Real-agent failures were fixed in the skill, never by weakening a case.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-ui-craft-<n>` (18 rules)
- [x] No step relies on unstated knowledge (tokens, glass surfaces, navigation/command patterns, motion physics, lifecycle states and AI bars documented in `references/`)
- [x] SKILL.md is at most 150 lines (`chk-size`)
- [x] Ten core layers with numbered steps, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no `src/`, `docs/` or `tests/` paths in SKILL.md, layers or references (`chk-portable`)

## Triggers
- [x] Description says when to use and when not (`ui-polish`, `design-system`, `figure-craft`, `a11y-audit`, `copy-tight`)
- [x] Routing cases `r11`, `r19`, `r24`, `ay10`, `ux7` now expect `ui-craft`; new `uc1`..`uc4` added; recorded with a fresh `claude` agent: 60/60 pass

## Coverage
- [x] Modern 2026 UI surfaces (light/dark, glassmorphism + fallback, specular gradients, `--z-*`), `Ctrl+K`/`Cmd+K` command navigation, adaptive nav/sliding active pill, GPU/reduced-motion physics, all 8 lifecycle states, inline AI bars, and CSS-only `UX_DESIGNER` `Markup Handoff Contract`
- [x] Every rule in RULES.json has a check (`tests/ui-craft.test.mjs`) or checklist item

## Examples & Visuals
- [x] Examples follow the skill's own rules (`examples/README.md`)
- [x] `preview.json` tagline <= 90 chars and 5 tags; `preview/cover.svg` uses only `var(--...)` and `currentColor`
- [x] Reference HTML checked with `checkPage` at widths `1440` and `390` in light and dark themes with reduced motion (`0` console errors, `0` horizontal scroll, `0` SVG text overflow)

## Live & Portable Verification
- [x] Live evals: 8/8 recorded and passing with fresh `claude` agents (`polish-only-declined` by `agy`). Fixes driven by real failures: short reply for vague asks, full code in the reply, exact `--z-*` names, native `<dialog>` palette. Per-case timeout raised to 1200s.
- [x] Portable check recorded in an empty project with a fresh `claude` agent (prompt: sticky top bar + Ctrl+K palette). Read by hand: full HTML file inside the reply, no publish attempt. Earlier tries failed on quota, timeouts, and answers with only an excerpt or a publish request; the "Delivery rule (read first)" section in SKILL.md fixed that. Timeout raised to 1200s.
- [x] Status promoted to `ready` 1.0.0 and project `package.json` bumped to 1.1.0 (the owner approved in chat, 2026-11-19)
- [ ] Final reviewer: the owner
