# figure-craft run report

Request: "Make a bar chart of monthly sales."

Decision: stopped. No figure was produced.

## Why

- figure-craft draws isometric explanatory figures of real objects. Its description and "When to use" section both exclude data charts (bars, lines, pies).
- layer 01 (intent), step 6: "If the request is a data chart, photo, logo, UI mockup or decoration, say this skill does not cover it and stop."
- No monthly sales values were supplied, so there is nothing to plot.

## Files produced

- `report.md` (this file).

## Checks

- Read: `SKILL.md`, `layers/01-intent.md`, `layers/03-inputs.md`, `references/README.md`.
- Not read: the other layers, the other references, the engine and the examples. The run stopped at layer 01, so they do not apply to this request.
- No lint, checklist or browser checks were run, because no figure was built.

## Open items

1. For a bar chart of monthly sales, the `dataviz` skill is the right route. To build one, the monthly sales values are needed (month labels with numbers, or a path to a CSV or JSON file).
2. If a figure-craft figure is wanted instead, give it an explanatory subject, for example how a kettle heats water, and the parts the reader should see.
