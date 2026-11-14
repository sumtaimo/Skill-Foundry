# figure-craft run: not applicable

## Input

User request, word for word: "Make a bar chart of monthly sales."

Idea sentence: none. The request is a data chart, not an explanatory figure, so the skill does not produce a figure from it.

## Decision

Stopped at layer 01 (intent), step 6: "If the request is a data chart, photo, logo, UI mockup or decoration, say this skill does not cover it and stop."

The skill's description and "When to use" section say the same: do not use it for data charts (bars, lines, pies). A bar chart of monthly sales is a data chart.

Also missing: no monthly sales values were supplied, so there is nothing to plot even with a suitable tool.

## Files produced

- `/home/user/Skill-Foundry/runs/figure-craft/4742569cd099ef3c/output/report.md` (this file)

No figure, SVG, HTML page, build script or lint report was produced, because the skill does not apply.

## Checks

- Read `SKILL.md`, layers 01, 02, 03, 05, 08, 09, 10. Layers 04, 06, 07 and the references, engine and examples were not opened, because the run stopped at layer 01.
- No lint, checklist or browser checks were run. None apply to this run.

## Open items

- Route for this request: the `dataviz` skill is the appropriate one for a bar chart.
- To build it, the monthly sales data is needed: twelve or so month labels with their values, or a CSV/JSON file path.
- Figure-craft remains the right skill for an explanatory isometric figure of a real object, such as "how a kettle heats water".
