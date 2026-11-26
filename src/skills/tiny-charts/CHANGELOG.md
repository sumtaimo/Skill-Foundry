# Changelog

## 0.1.0 - 2026-11-26

- Created `tiny-charts` portable 10-layer skill with lean runtime `assets/` architecture (`assets/shell.html`, 5 chart templates in `assets/templates/`, and gold-standard `assets/examples/checkout-statechart.html`).
- Added auto-picker decision matrix (`Statechart`, `Sequence`, `Flowchart`, `Timeline`, `Sankey`) requiring explicit `Chart choice:` and `Why this chart:` rationale.
- Added declarative `CHART_SPEC` statechart engine driving interactive Play/Step/Reset/Event controls and the synchronized `"Show the logic"` (Rules + Flowchart) drawer in Light and Dark mode.
- Added zero-dependency `engine/lint-chart.mjs` (`C1`–`C8`) deterministic verifier and clear routing boundaries against `figure-craft`, `svg-mechanism`, `motion-craft`, `ui-craft`, and static data charts.
