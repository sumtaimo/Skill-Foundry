---
name: tiny-charts
description: Auto-picks the best diagram type (Statechart, Sequence, Flowchart, Timeline, or Sankey) from a short workflow, rule, or system prompt, explains why, and outputs a single playable self-contained HTML file with a live statechart engine and a Show the logic (Rules + Flowchart) toggle. Use when asked for an interactive playable chart, statechart, decision flowchart, sequence diagram, timeline, or sankey explainer in standalone HTML. Do not use for static pie/bar/line charts of spreadsheet numbers, 3D isometric physical cutaways (use figure-craft), token-synced 2D architecture SVGs without statechart logic drawers (use svg-mechanism), scroll showcases (use motion-craft), or product UI screens (use ui-craft).
version: 0.1.0
---

# tiny-charts

Turn any short prompt describing a workflow, decision policy, actor interaction, timeline, or resource split into one playable, zero-dependency `.html` file built from `assets/shell.html` and the matching template in `assets/templates/`. Every diagram runs on a declarative `CHART_SPEC` statechart engine and includes a **"Show the logic"** toggle rendering synchronized Rules and a Logic Flowchart.

## Delivery rule

Your reply MUST state `Chart choice: <Type>` and `Why this chart: <1–2 sentences>`, followed by the complete, runnable single-file HTML inside a fenced `html` code block (never truncated, never relying on external CDNs).

## When to use

- Use when: the user wants a playable interactive diagram, statechart, sequence diagram, decision flowchart, phase timeline, or sankey allocation from a short prompt, with clickable states/events, Light/Dark mode, and a `"Show the logic"` panel.
- Do not use when:
  - Static pie, bar, or line charts of raw spreadsheet numbers -> refuse in one sentence (out of scope).
  - 3D isometric physical object cutaways -> redirect to `figure-craft`.
  - Token-synced 2D technical architecture/pipeline SVGs (`design/tokens.css`, `<defs>` gradients, Play/Pause without a `"Show the logic"` statechart drawer) -> redirect to `svg-mechanism`.
  - Full-page scroll choreography / GSAP / WebGL -> redirect to `motion-craft`.
  - Full product UI screens, navbars, or dashboards -> redirect to `ui-craft`.

## Procedure

For fast, high-craft runtime output, read [assets/shell.html](assets/shell.html), the single selected template in `assets/templates/`, and [assets/examples/checkout-statechart.html](assets/examples/checkout-statechart.html); read the ten layer chapters only when an edge case needs extra detail.

1. Intent: [layers/01-intent.md](layers/01-intent.md)
2. Context: [layers/02-context.md](layers/02-context.md)
3. Inputs: [layers/03-inputs.md](layers/03-inputs.md)
4. Flow (Auto-Picker & Geometry): [layers/04-flow.md](layers/04-flow.md)
5. Rules: [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: [layers/06-states.md](layers/06-states.md)
7. Checks: [layers/07-checks.md](layers/07-checks.md)
8. Output: [layers/08-output.md](layers/08-output.md)
9. Handoff: [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: [layers/10-evidence.md](layers/10-evidence.md)

References:
- Auto-picker decision matrix & palette contract: [references/picker-matrix.md](references/picker-matrix.md)
- Overview: [references/README.md](references/README.md)
- Gold-standard working example: [assets/examples/checkout-statechart.html](assets/examples/checkout-statechart.html)

## Auto-picker matrix

| Prompt pattern | Pick | Template |
|---|---|---|
| Statuses, guards, retries, lifecycle events | `Statechart` | [assets/templates/statechart.html](assets/templates/statechart.html) |
| Ordered messages between 2–5 actors/services | `Sequence` | [assets/templates/sequence.html](assets/templates/sequence.html) |
| Explicit if/else rules, thresholds, Yes/No branches | `Flowchart` | [assets/templates/flowchart.html](assets/templates/flowchart.html) |
| Durations, deadlines, overlapping phases over time | `Timeline` | [assets/templates/timeline.html](assets/templates/timeline.html) |
| Proportional split/drop-off across funnel stages | `Sankey` | [assets/templates/sankey.html](assets/templates/sankey.html) |

## Rules

Full rule objects live in `RULES.json`:

- `R-tiny-charts-1`: Auto-pick the single best chart type from the matrix and state `Chart choice:` and `Why this chart:` before or inside the deliverable (`tinycharts-autopick-rationale`).
- `R-tiny-charts-2`: Output MUST be a single self-contained HTML5 file built from `assets/shell.html` with zero external CDN `<script>` or `<link>` URLs (`tinycharts-self-contained`).
- `R-tiny-charts-3`: Every diagram MUST embed one declarative `CHART_SPEC` (`states`, `transitions`, `rules`, `demoSequence`) that drives both the main SVG and the `"Show the logic"` drawer (`tinycharts-declarative-statechart`).
- `R-tiny-charts-4`: Provide Play, Step, Reset, and clickable/keyboard-focusable stage nodes or event triggers with an `aria-live="polite"` status readout (`tinycharts-playable-controls`).
- `R-tiny-charts-5`: Include a `"Show the logic"` toggle (`aria-expanded`) revealing synchronized **Rules** and a **Logic Flowchart** (`tinycharts-show-logic`).
- `R-tiny-charts-6`: Primary `<svg>` MUST declare numeric `viewBox`, `role="img"`, `aria-labelledby`, `<title>`, `<desc>`, and keep `<text>` inside safe margins (`tinycharts-svg-a11y`).
- `R-tiny-charts-7`: Support Light and Dark mode (`:root`, `[data-theme="dark"]`, `@media (prefers-color-scheme: dark)` + theme toggle) with accessible contrast (`tinycharts-light-dark`).
- `R-tiny-charts-8`: Honor `@media (prefers-reduced-motion: reduce)` and render cleanly at `1440px` and `390px` with zero horizontal overflow (`tinycharts-reduced-motion`).
- `R-tiny-charts-9`: NEVER invent business rules or numbers; if the prompt gives no process, rule, or system to visualize, ask 1–2 short clarifying questions and output no HTML (`tinycharts-ask-when-vague`).
- `R-tiny-charts-10`: Refuse out-of-scope requests (static pie/bar data charts, `figure-craft`, `svg-mechanism`, `motion-craft`, `ui-craft`) in one concise sentence with no HTML (`tinycharts-refuse-out-of-scope`).

## Checks

- Run `node engine/lint-chart.mjs <file.html>` when Node.js is available (`C1`–`C8`: self-contained HTML, SVG `viewBox`/a11y, light/dark tokens, playable controls, `"Show the logic"`, `CHART_SPEC`, rationale, reduced motion).
- Verify visually in a browser at `1440px` and `390px` in light, dark, and reduced-motion modes (zero console errors, zero horizontal scroll, zero clipped text).

## Review

Verify the generated HTML against [assets/examples/checkout-statechart.html](assets/examples/checkout-statechart.html), `RULES.json`, and [references/picker-matrix.md](references/picker-matrix.md). Confirm the chosen chart type matches the prompt, clicking states/events transitions cleanly, and `"Show the logic"` matches the live state.

## Output

Deliver `Chart choice`, `Why this chart`, the complete standalone `.html` in a fenced `html` block (plus file path if saved to disk), and honest verification notes. See [layers/08-output.md](layers/08-output.md).
