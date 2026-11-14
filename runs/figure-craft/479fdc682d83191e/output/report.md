# Report: how a refrigerator keeps food cold

## Input

Request, word for word:

> Show my customers how a refrigerator keeps food cold. I want them to see the real parts of the fridge in detail.

Idea sentence (layer 01):

> A refrigerator keeps food cold by moving heat out of the cabinet, with refrigerant pumped around a closed loop.

Reader: customers, who know what a fridge is but not how it cools. Size: Figure (one inline object). Motion: on, one story. Language: English only (the language of the request). Labels: 16 units, sized so they render at 11 CSS px or more at 390px wide (see checks).

## Object and parts

A cutaway of a single-compartment household fridge: the cabinet has no top and no right-hand side, so the evaporator and shelf are visible. Five labelled parts, all named in the page:

| Label | Part (id) | Real feature shown | Shape | Face |
|-------|-----------|--------------------|-------|------|
| Door gasket | door (`door-gasket`) | the seal outline around the door's inner edge | line | y |
| Door gasket | door (`door-handle`) | the door handle | line (bold) | y |
| Cold air | cold-air | none: moving marker, not a part (exempt from L11 because it moves) | box, moving | - |
| Evaporator coil | evaporator (`evaporator-coil`) | the zigzag cooling coil | line | y |
| Compressor | compressor (`compressor-seam`) | the seam on the sealed shell | line | top |
| Condenser coil | condenser (`condenser-coil`) | the zigzag coil tubes | line | x |

Unlabelled parts drawn for structure: floor, back wall, left wall, shelf, and three refrigerant pipes (discharge, capillary, suction). The pipes are unlabelled and not dots, so the dot rules do not apply.

## Facts drawn and their source

No source material was supplied and the project contains no refrigerator data (a search of the repository found only the skill's own eval case). Every fact below is general knowledge of household refrigerators, not taken from a specific model. These are assumptions to confirm, not sourced facts:

- Compressor pumps refrigerant and raises its pressure. (Assumed general fact.)
- Refrigerant absorbs heat at the evaporator coil inside the cabinet and gives it up at the condenser coil outside. (Assumed general fact.)
- The capillary tube drops refrigerant pressure before the evaporator. (Assumed general fact.)
- Cooled air sinks past the food. (Assumed general fact; true for top-mounted evaporators.)
- The door gasket seals the door against warm room air. (Assumed general fact.)

## Assumptions (drawing placement)

1. The compressor and condenser coil are drawn beside the cabinet on the ground so both stay visible. In many models the compressor sits at the rear of the base and the coil runs along the back. This is a placement simplification.
2. The evaporator is drawn at the top back of the cabinet, as in top-freezer designs. Bottom-freezer and side-by-side models differ.
3. The door is drawn closed, on the front. The gasket is drawn as an outline on the door face, not as the true inner seal.
4. Proportions are not to scale and no dimensions are given.
5. The "cold air" box is a schematic marker for airflow, not a component.

## Motion story

The cold-air marker sinks 14 units from the evaporator's level toward the shelf, on the z axis, over a 3.2 s loop. Still frame (reduced motion): the marker sits in the gap between the evaporator and the shelf, labelled "Cold air", and the caption explains the loop without motion.

## Files produced

Directory: `/home/user/Skill-Foundry/runs/figure-craft/479fdc682d83191e/output`

- `refrigerator-cooling.html`: one self-contained page, tokens in one `<style>`, no external scripts, theme button and pause button.
- `refrigerator-cooling.svg`: the same figure, standalone.
- `build-figure.mjs`: builds both files and `lint-report.json` from the engine. It imports the engine from the skill folder by relative path (`../../../../src/skills/figure-craft/engine/`). The engine was not copied or edited.
- `lint-report.json`: `{ errors, warnings }` from `lint(model)`.
- `report.md`: this file.

Regenerate: `node build-figure.mjs` (from the output folder). Two consecutive runs were compared (see checks).

## Checks run and results

- Build and lint: `node build-figure.mjs`. Result: **0 errors, 2 warnings**.
- Token check: scanned the SVG for fill/stroke/stop-color values that are not `var(--…)`, `none` or `url(#…)`. Result: **0 raw colours**.
- External scripts: searched the HTML for `<script src`. Result: **none**.
- Reduced-motion block: the SVG contains `@media (prefers-reduced-motion: reduce)` for the one animation. Result: **present** (text check only; not run in a browser).
- Label size: `16 × 339 / 481 ≈ 11.3` CSS px at 390px wide, using the viewBox width of 481 and the usable width of 390 − 32 gutter − 2 × 8 figure padding − 2 border = 339 px. Estimated from the arithmetic, not measured in a browser.
- Determinism: the files were hashed (sha256), `node build-figure.mjs` was run again, and the hashes matched for `refrigerator-cooling.svg`, `refrigerator-cooling.html` and `lint-report.json`. Result: **identical bytes**.

### Lint warnings left in place

1. `L10-crowded: back-wall and left-wall are 0 apart on floor (min 4)`. The cabinet walls meet at their corner by design, so there is no gap to leave. Left in place.
2. `L10-crowded: left-wall and door are 0 apart on floor (min 4)`. Same reason: the door closes the cabinet corner. Left in place.

The earlier leader warning (`L4`, condenser label crossing the compressor) was fixed by moving the compressor back in the drawing and re-running the build. The final build has no L4 warning.

### Checklist answers

Yes: 0, 1, 2, 3, 4, 5, 7, 8, 9, 11, 12, 14, 15, 16, 17, 18, 19, 19a, 19c, 19d, 20, 20a, 20b (estimated), 20c (by code), 21, 22, 24, 25, 26, 27, 29, 30, 35.

Not run:
- 6 (both themes read correctly) and 31 (screenshots in light, dark, 390px and a second language) — **not run**; see browser checks below.
- 13 (no horizontal scroll at 390px) — **not run**; by CSS, the figure is `width:100%; max-width:560px`, but not measured.
- 23 and 33 (reduced motion shows a still figure) — **not run**; by CSS only.
- 32 (console clean) — **not run**.
- 34 (second reader states the idea back) — **not done**; no second reader was available.

No (blocks release until resolved or accepted):
- 19b: parts on one base at least 4 apart. Two pairs of cabinet walls touch at corners (the two L10 warnings above). The walls are the shell, not separate parts, but the lint cannot tell them apart. Needs your decision: accept, or change the cabinet to a single shell.

Not applicable: 10 (no margin notes), 28 (one language), 33a (only applies to the skill's demo).

## Browser checks: not run

Headless Chrome is installed (`/usr/bin/google-chrome`), but the sandbox blocked its launch behind a permission prompt, and I did not bypass that. As a result there are **no screenshots** and **no console check**. Light/dark, 390px, reduced-motion and console checks remain open and should be run before release.

## Open items

1. Browser checks not run (see above). Run them with `google-chrome --headless` or the `run` skill.
2. Checklist 19b is a "no" for the two cabinet-wall corners. Accept it or change the shell.
3. The placement of the compressor and condenser coil is schematic. If customers need a specific model, the parts and placement must come from that model's documentation.
4. Second-reader check (checklist 34) not done.
5. The "real parts" request was read as a generic household fridge, since no model was named. If the figure must match a product, supply that product's parts.

## Handoff

- Idea sentence and parts table above; file paths in the Files section.
- Copy the inline SVG and the `tokensCss()` style block from `refrigerator-cooling.html` into a page. Do not copy colours.
