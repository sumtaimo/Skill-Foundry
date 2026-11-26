# Review Checklist — `tiny-charts`

- **Skill version:** `0.1.0` (`ready` — Skill Foundry `1.11.0`)
- **Date:** `2026-11-26`
- **Roles:** `DEV_ENGINEER`, `UX_DESIGNER`

## Machine & Factory Gates
- [x] `node src/factory/lint-skills.mjs tiny-charts` passes with 0 problems
- [x] `node --test tests/tiny-charts.test.mjs` passes (`5/5` pass, `0` skipped — including `engine/lint-chart.mjs` C1–C8, gold example `assets/examples/checkout-statechart.html`, and Playwright `checkPage` on all 5 live HTML outputs)
- [x] `node src/factory/live-evals.mjs tiny-charts` passes all `9/9` real-agent recordings (`codex` for 4 vague/boundary cases + fresh `research-subagent` for 5 HTML diagram cases)
- [x] All 5 generated standalone HTML files in `src/skills/tiny-charts/evals/live/files/` (`checkout-statechart.html`, `actor-sequence.html`, `refund-flowchart.html`, `trial-timeline.html`, `funnel-sankey.html`) pass `lintTinyChart` (C1–C8) and Playwright `checkPage` (`1440px` & `390px`, light/dark, reduced motion, 0 console errors, 0 sideways scroll)
- [x] Shadow routing eval (`docs/skills/tiny-charts/proof/shadow.mjs` via `codex`) passes `114/114` (`108/108` existing + `6/6` new `tiny-charts` and boundary cases)
- [x] Portable check in empty external project (`evals/portable.json`, `checkRecording('src/skills/tiny-charts')`) passes (`usedSkill: true`, `leakedRepoRules: false`, `touchedRepo: []`, `lintTinyChart` `ok: true`, Playwright `checkPage` `ok: true`)
- [x] `npm run guard` passes cleanly (`skill-guard: ok (skill: tiny-charts)`)

## Manual Craft & Boundary Review
- [x] `R-tiny-charts-1` & `R-tiny-charts-3`: Auto-picks the right chart family (`Statechart`, `Sequence`, `Flowchart`, `Timeline`, `Sankey`) with visible `Chart choice:` and `Why this chart:` rationale driven by declarative `CHART_SPEC`
- [x] `R-tiny-charts-5`: `"Show the logic"` toggle reveals synchronized **Rules** and **Logic Flowchart** reflecting the active state
- [x] `R-tiny-charts-11`: Verified in Playwright at `1440px` and `390px` across Light, Dark, and Reduced Motion
- [x] Clean routing boundaries against `figure-craft`, `svg-mechanism`, `motion-craft`, `ui-craft`, and static pie/bar charts
