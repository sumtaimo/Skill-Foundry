# Layer 04 — Flow (Auto-Picker & Geometry)

Select the best chart type, explain why, and build the playable diagram from `assets/shell.html` and one template.

1. Evaluate the prompt against the auto-picker matrix in [references/picker-matrix.md](../references/picker-matrix.md) (`Statechart`, `Sequence`, `Flowchart`, `Timeline`, or `Sankey`) and lock in ONE chart type unless the user explicitly requested a specific type.
2. Write a crisp 1–2 sentence rationale (`Why this chart: ...`) explaining what structural feature of the prompt makes that chart type the clearest fit.
3. Read the single matching template in `assets/templates/` (`statechart.html`, `sequence.html`, `flowchart.html`, `timeline.html`, or `sankey.html`).
4. Design the primary `<svg>` inside `viewBox="0 0 920 380"` (or clean integer height if needed) keeping all `<text>` labels >= `12px` in viewBox units and >= `12px` inset from viewBox edges, with every clickable stage marked `data-state-node="<id>"`, `tabindex="0"`, `role="button"`, and `aria-pressed`.
5. Author the declarative `CHART_SPEC` object (`chartType`, `title`, `rationale`, `initialState`, `states`, `transitions`, `rules`, `demoSequence`) so every node, event button, Play/Step sequence, and `"Show the logic"` Rules + Flowchart entry derives from the same source of truth.
6. Merge the SVG and `CHART_SPEC` into `assets/shell.html` with zero external CDN scripts or stylesheets.
