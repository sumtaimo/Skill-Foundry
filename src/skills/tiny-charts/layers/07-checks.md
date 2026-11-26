# Layer 07 — Checks

Verify the deliverable deterministically and visually before claiming it is ready.

1. Run `node engine/lint-chart.mjs <file.html>` when Node.js is available (or verify `C1`–`C8` manually when running without shell access):
   - `C1`: Standalone HTML5 with zero external script/stylesheet URLs
   - `C2`: Numeric `viewBox`, `role="img"`, `aria-labelledby`, `<title>`, `<desc>`, safe `<text>` margins
   - `C3`: Light (`:root`) and Dark (`[data-theme="dark"]` / `prefers-color-scheme: dark`) tokens
   - `C4`: Playable Play/Step/event controls + `aria-live="polite"` readout
   - `C5`: `"Show the logic"` button (`aria-expanded`) + Rules & Flowchart
   - `C6`: Declarative `CHART_SPEC` (`states`, `transitions`, `rules`)
   - `C7`: Visible `Why this chart:` / `Chart choice:` rationale
   - `C8`: `@media (prefers-reduced-motion: reduce)` fallback
2. Inspect in a real browser at `1440px` and `390px` (Light, Dark, Reduced Motion) when available: confirm zero console errors, zero horizontal overflow, zero clipped SVG text, working event triggers, and working `"Show the logic"` toggle.
3. Report honestly which checks ran and mark any unrun tool check as `not run`.
