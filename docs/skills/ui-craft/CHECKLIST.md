# ui-craft review (2026-11-18)

Review against `docs/factory/REVIEW.md`. Status: draft. Version 0.1.0.

Honest record: the author (an AI agent) prepared this draft and checked lint, reference evals, starter-stub integration, and Playwright visual output on the reference HTML. Fresh real-agent runs (`claude -p` live evals, routing evals, portable check) remain unchecked until the owner approves token spend and promoting `ui-craft` to `ready`.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-ui-craft-<n>` (18 rules)
- [x] No step relies on unstated knowledge (tokens, glass surfaces, navigation/command patterns, motion physics, lifecycle states and AI bars documented in `references/`)
- [x] SKILL.md is at most 150 lines (`chk-size`)
- [x] Ten core layers with numbered steps, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no `src/`, `docs/` or `tests/` paths in SKILL.md, layers or references (`chk-portable`)

## Triggers
- [x] Description says when to use and when not (`ui-polish`, `design-system`, `figure-craft`, `a11y-audit`, `copy-tight`)
- [ ] Routing cases (`r11`, `r19`, `r24`, `ay10` plus new cases) updated and recorded with fresh agent (`routing-evals.mjs --run`) once ready

## Coverage
- [x] Modern 2026 UI surfaces (light/dark, glassmorphism + fallback, specular gradients, `--z-*`), `Ctrl+K`/`Cmd+K` command navigation, adaptive nav/sliding active pill, GPU/reduced-motion physics, all 8 lifecycle states, inline AI bars, and CSS-only `UX_DESIGNER` `Markup Handoff Contract`
- [x] Every rule in RULES.json has a check (`tests/ui-craft.test.mjs`) or checklist item

## Examples & Visuals
- [x] Examples follow the skill's own rules (`examples/README.md`)
- [x] `preview.json` tagline <= 90 chars and 5 tags; `preview/cover.svg` uses only `var(--...)` and `currentColor`
- [x] Reference HTML checked with `checkPage` at widths `1440` and `390` in light and dark themes with reduced motion (`0` console errors, `0` horizontal scroll, `0` SVG text overflow)

## Live & Portable Verification (Blocked by External CLI Quota / Hook)
- [ ] Live evals: `1 of 8` recorded and passed with fresh `agy` agent (`polish-only-declined`); remaining 7 cases blocked by `agy` quota (`RESOURCE_EXHAUSTED 429`) and `claude -p` user hook failure (`SessionEnd hook ... failed: Hook cancelled`)
- [ ] Portable check recorded in empty project (`node src/factory/portable-check.mjs ui-craft --prompt "..." --record`)
- [ ] Status promoted from `draft` to `ready` and `package.json` version bumped (`1.0.1` -> `1.1.0`) once live/portable/routing recordings complete
- [ ] Final reviewer: the owner
