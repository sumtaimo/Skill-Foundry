# Layer 05 — Rules

Enforce every rule in `RULES.json` before finalizing the output.

1. `R-tiny-charts-1`: Auto-pick the single best chart type and state both `Chart choice:` and `Why this chart:` (`tinycharts-autopick-rationale`).
2. `R-tiny-charts-2`: Output MUST be a single self-contained HTML5 file built from `assets/shell.html` with zero external CDN `<script>` or `<link>` URLs (`tinycharts-self-contained`).
3. `R-tiny-charts-3`: Embed one declarative `CHART_SPEC` driving both the stage and the `"Show the logic"` drawer (`tinycharts-declarative-statechart`).
4. `R-tiny-charts-4`: Provide Play, Step, Reset, event triggers, and clickable/keyboard-focusable nodes updating an `aria-live="polite"` readout (`tinycharts-playable-controls`).
5. `R-tiny-charts-5`: Include a `"Show the logic"` toggle (`aria-expanded`) revealing synchronized **Rules** and a **Logic Flowchart** (`tinycharts-show-logic`).
6. `R-tiny-charts-6`: Primary `<svg>` MUST declare numeric `viewBox`, `role="img"`, `aria-labelledby`, `<title>`, `<desc>`, and safe `<text>` margins (`tinycharts-svg-a11y`).
7. `R-tiny-charts-7`: Support Light and Dark themes (`:root`, `[data-theme="dark"]`, `@media (prefers-color-scheme: dark)` + toggle button) (`tinycharts-light-dark`).
8. `R-tiny-charts-8`: Honor `@media (prefers-reduced-motion: reduce)` and render cleanly at `1440px` and `390px` (`tinycharts-reduced-motion`).
9. `R-tiny-charts-9`: Never invent unstated rules; ask 1–2 questions when vague (`tinycharts-ask-when-vague`).
10. `R-tiny-charts-10`: Refuse out-of-scope requests in one sentence with no HTML (`tinycharts-refuse-out-of-scope`).
11. `R-tiny-charts-11`: Verify rendered output via `engine/lint-chart.mjs` and browser checks when available.
