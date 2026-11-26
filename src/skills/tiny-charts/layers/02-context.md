# Layer 02 — Context

Load only the minimum runtime context needed so output stays sharp and focused.

1. Inspect the working directory only to check whether the user expects a file saved on disk or code in chat, and preserve any existing project files.
2. Read `assets/shell.html` for the base HTML5 structure, Light/Dark CSS variables, declarative `CHART_SPEC` statechart runner, and `"Show the logic"` drawer.
3. Read [references/picker-matrix.md](../references/picker-matrix.md) if you need the full chart-type selection rubric or `CHART_SPEC` schema.
4. Read only the single chosen template from `assets/templates/` after Layer 04 selects the chart type (plus `assets/examples/checkout-statechart.html` when referencing a full working example).
