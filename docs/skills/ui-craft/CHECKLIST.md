# ui-craft review (2026-11-20, updated for session S4)

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
- [x] Modern UI surfaces (light/dark, glassmorphism + fallback, specular gradients, `--z-*`), `Ctrl+K`/`Cmd+K` command navigation, adaptive nav/sliding active pill, GPU/reduced-motion physics, all 8 lifecycle states, inline AI bars, and CSS-only `UX_DESIGNER` `Markup Handoff Contract`
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

## Session S4 (foundation first, gate, design-system names, Khmer, no year)

Changes are recorded in `CHANGELOG.md` under 1.0.0, each marked "needs the owner's decision on 1.1.0". Version stays 1.0.0.

- [x] Foundation first (`R-ui-craft-19`, layer 02 step 0): real-agent case `reads-design-foundation` (the foundation is pasted in the prompt, because a live agent gets only the skill and the prompt). I checked the reply by hand: every `var(--...)` exists in the pasted file, component variables first, no raw hex, rgb or radius, no `design/` file edited, missing variables named for `design-system`.
- [x] Cold-start gate (`R-ui-craft-20`, layer 03 step 3): real-agent case `gate-cold-start` answers with the one fixed sentence and no code. Single components (palette, state grid, AI bar, CSS handoff, the portable top bar) skip it, proven by their re-recorded real runs.
- [x] Changed on purpose: the prompt of `bento-glass-landing` now starts with "This is a prototype, just use your defaults (no design foundation)". Reason: it asks for a whole landing page in an empty project, which the gate now stops by design. The new prompt keeps the same craft expectations and the case still checks the same output. No expectation was weakened.
- [x] Token names (D5): the private names are replaced by the `design-system` names in rules, layers, references and examples; `tests/ui-craft.test.mjs` fails if one comes back.
- [x] Khmer: one body line-height 1.6 (`--line-height-khmer`), `letter-spacing: 0` under `:lang(km)`, heading tracking never reaches Khmer. Real-agent case `khmer-line-height`.
- [x] The year is removed from the skill text, description, rules, layers, references, `preview.json` and this checklist's coverage line (test-enforced; dates in changelogs stay).
- [x] Description: building tokens or variables goes to `design-system`, finished code to `ui-polish`, plus "onboarding flow" in the use list. Routing re-recorded with a fresh agent: 64 of 64 (new cases `uc5`, `uc6`; one first-run miss on `ux7` fixed by the description, not by changing the case).
- [x] All 8 old live cases re-recorded with fresh `claude` agents (their recordings were stale because the skill changed), plus 3 new: 11 of 11 pass. One batch run died on a workspace-trust warning at `lifecycle-states-grid`; it was simply run again.
- [x] `checkPage` (1440 and 390, light and dark, reduced motion): 0 problems on 5 pages saved in `evals/live/files/` (extracted from the real replies, not hand written): bento-glass-landing, command-palette-shell, lifecycle-states-grid, khmer-line-height, and the settings page of reads-design-foundation (with the pasted `tokens.css` excerpt as its fixture).
- [x] Portable check re-recorded in an empty project with a fresh agent (sticky top bar with palette). Read by hand: three files, default block with `design-system` names, gate skipped because it is one component, no publish attempt, no year, no private names.
- Hand-written, not real-agent: the reference answers in `tests/ui-craft.test.mjs` (unit fixtures for the scorer and `checkPage`), and the fixture `tokens.css` excerpt pasted in the `reads-design-foundation` prompt (a shortened copy of what the engine writes).
- Open: the live case proves reading from a pasted foundation, not from real files in a folder; a project-folder run belongs to the recipe `product-from-zero` (session S7). The version bump to 1.1.0 needs the owner's OK in chat.
