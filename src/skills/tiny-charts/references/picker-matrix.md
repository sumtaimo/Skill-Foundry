# Auto-Picker Decision Matrix & `CHART_SPEC` Contract

## 1. Choosing the right chart type

Pick the **single best** template from `assets/templates/` based on the core shape of the user's request, and state `Chart choice: <Type>` + `Why this chart: <reason>` visibly in the output:

| Chart Type | Choose when the prompt centers on... | Avoid when... | Template |
|---|---|---|---|
| **Statechart** | Statuses, lifecycle transitions, guards (`retries < 2`), failure/recovery loops | Purely linear chronological durations or static numbers | [statechart.html](../assets/templates/statechart.html) |
| **Sequence** | Ordered request/response messages across 2–5 named actors or services | A single entity changing internal states | [sequence.html](../assets/templates/sequence.html) |
| **Flowchart** | Explicit `if/else` decision gates, policy thresholds, Yes/No branches | Time-based phases or volume splits | [flowchart.html](../assets/templates/flowchart.html) |
| **Timeline** | Deadlines, overlapping phases, windows (`Day 0..14`), SLA stages | Branching conditional logic | [timeline.html](../assets/templates/timeline.html) |
| **Sankey** | Percentage or volume splitting/merging across funnel stages | Discrete event transitions or timelines | [sankey.html](../assets/templates/sankey.html) |

## 2. Declarative `CHART_SPEC` contract

Every generated HTML embeds one `CHART_SPEC` object in `<script>` with:
- `chartType`, `title`, `rationale`, `initialState`
- `states`: `[{ id, label, summary, x, y }]` (used for both stage state and the mini Logic Flowchart)
- `transitions`: `[{ id, from, to, event, guard }]`
- `rules`: `[{ id, from, event, guard, to, text }]` (rendered into the `"Show the logic"` Rules list)
- `demoSequence`: ordered event array for Play/Step playback

## 3. Color & Accessibility rules

- Define CSS variables on `:root`, `:root[data-theme="dark"]`, and `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` plus a Light/Dark toggle button.
- Keep primary `<svg>` text >= `12px` in `viewBox` units with `>= 12px` inset from edges so `390px` and `1440px` viewports never clip or scroll horizontally.
- Honor `@media (prefers-reduced-motion: reduce)` with near-zero transitions and static clarity.
