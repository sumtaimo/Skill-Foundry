# Report: How a refrigerator keeps food cold

## Input

Request, word for word: "Show my customers how a refrigerator keeps food cold. I want them to see the real fridge in detail, open, with the food and drinks inside."

Idea sentence (layer 01): "A refrigerator keeps food cold by moving heat from inside the cabinet to the coil on its back."

- Size: Figure (one object, inline on a page).
- Reader: customers who know what a fridge is, not how it works.
- Languages: English (the language of the request).
- Motion: on, one story. Still figure available with reduced motion.

## Files

| File | What it is |
|------|------------|
| `refrigerator.html` | One self-contained page: the orbit figure (open/closed, four turned views), caption with hover hint, nine part cards, theme button, pause button. No external scripts or stylesheets. |
| `refrigerator.svg` | The front view with the doors open, tokens inlined, as a standalone file. |
| `build-figure.mjs` | Builds both files and `lint-report.json` from the figure-craft engine. Run `node build-figure.mjs` in this folder; the output is byte-identical on every run. |
| `lint-report.json` | `lintStates(states)` result: `{ "errors": [], "warnings": [] }`. |
| `report.md` | This file. |
| `screenshots/` | Not created: see Checks (browser checks not run). |

The build script reads the engine from `/home/user/Skill-Foundry/src/skills/figure-craft/engine` by default; set `FIGURE_CRAFT_ENGINE` to use another copy.

## Facts and assumptions

The request gave no drawing or model. The layout below is the standard layout of a top-freezer domestic refrigerator, from general knowledge. It was not checked against a specific model.

- Facts drawn (general, standard layout): freezer above the fresh-food cabinet; evaporator coil on the freezer's back wall; cold air leaves a vent on the back wall of the fresh-food cabinet; crisper drawer at the bottom; glass shelves; door bins; condenser coil on the rear; compressor in a machine bay at the base's back.
- Assumptions (not confirmed against a model):
  - Proportions are schematic. The compressor is drawn larger than to scale so it reads; the cabinet is about 70 × 60 × 156 units.
  - The cold air is shown falling from the vent past the shelves. In a real fridge a fan moves the air; the fall is the story, not the mechanism.
  - The refrigerant pipes between compressor, condenser and evaporator are not drawn. The loop is implied, not shown.
  - Food and drinks are generic boxes and cylinders in the engine's colour materials, not real product shapes.

## Parts table

Labelled parts, in the order the labels appear. Face-detail counts are from the front-view model plus the back sides (lint L11, L19).

| Part (id) | Real feature | Shape | Face | Count (front / back) |
|-----------|--------------|-------|------|----------------------|
| Fresh-food cabinet (fridge) | rating plate with screws and text; seam on the back-left side; side seam when closed | panel, line, screws, slots | -x (back), x (closed) | 0 / 9 |
| Freezer (freezer) | top rib, top seam, hinge cover on top; back seam | line, panel | top, -x | 3 / 1 |
| Door and bins (door) | door liner, seal, outward handle (open); handle, display, knobs, badge (closed); bins with rails | panel, line, box | x, -x, y | 2 / 1 |
| Glass shelf (shelf-2) | front trim and back edge of the shelf | line | top | 2 / 0 |
| Crisper drawer (crisper) | handle, rail, lid edge | line | y, top | 3 / 0 |
| Evaporator coil (evaporator) | coil tube (cold tone) and fins on the back wall | line, slots | y | 8 / 0 |
| Cold air (cold-air) | the moving part; a labelled block falling from the vent | box (moves along z) | — | — |
| Compressor (compressor) | cap, fins; in the machine bay, shut from the front | disc, slots | top, y | 0 / 0 (visible after turning) |
| Condenser coil (condenser) | copper tube, rungs and screws on the rear grille | line, slots, screws | -y | 0 / 13 |

Total face details in the figure (front and back): 85. Lint L19 needs at least 24: three per labelled part, counted over the eight static labelled parts (the moving cold air is excluded).

Compressor: its three detail shapes sit on its shut body, so they only appear after the reader turns the object to the open machine bay. Its front-view count is 0 by design (see L16 handling in Checks).

## Motion story

The cold air block (one labelled part) falls about 34 units from the vent past the glass shelves, holds, and returns, on a 3.2 s loop. It moves only along one axis (z) and rests nowhere. Under `prefers-reduced-motion: reduce` the animation stops, and the block sits at the vent; the still frame shows the vent, the shelves and the cold air leaving it, which explains the idea without motion (not yet checked by eye).

## Checks run and results

| Check | Result |
|-------|--------|
| `lintStates(states)` (all lint rules L1–L19 on the open state's four views; the gate rules on the closed state and the other views) | 0 errors, 0 warnings |
| Required parts (`requiredParts`): 9 ids, all drawn and labelled in the open state | Pass (L14) |
| Parts visibility: the compressor is hidden from the front but clears 40% from view 3 (base open on both back sides); the evaporator clears 40% from the front view | Pass (L16 with the cross-view rule) |
| Build is repeatable: running the script again gives identical bytes for all three generated files | Pass |
| Labels: all nine labels appear in at least one view of each state | Pass (build script assertion) |
| No external scripts, stylesheets or links in `refrigerator.html` (the only `http` strings are SVG namespace IDs) | Pass |
| SVG colours: every fill and stroke is a `var(--...)`, `none` or `url(#...)` | Pass (0 raw colour attributes) |
| Label text size at 390 px: font size 7 units on a 195.47-unit viewBox, 340 px available width, computed | 12.2 CSS px, passes the 11 px minimum (computed, not rendered) |
| Cards under the figure: one per labelled part | 9 of 9 |
| Engine checklist items answered (see below) | Partly; see below |

Checklist answers (`references/checklist.md`), in brief:

- Yes: 0, 2, 3, 4, 5, 9, 11, 12, 15, 18, 19, 19a–19h, 19j, 19k–19m, 19n, 19f, 19g, 19i (by the engine's CSS, not run in a browser), 20a, 20c (by the page's script, not run), 21, 22, 25–27, 28 (one language, vacuous), 29, 30, 35.
- No, and why:
  - 7 and 8 (contents rail, rail marker): no. This is a one-figure page. The rail is for multi-section pages. The reference demo has no rail either. Needs a decision from you.
  - 14 (supports before what rests on them, in every view): front view yes; turned views 2 and 4 have ordering flags on contents of glass shelves (see Open items).
  - 16 (labels in side columns, gap 13): no. Labels are hover chips above each part, the engine's default (`labelMode: 'hover'`); L3 is not applied in that mode.
  - 17 (leader lines avoid crossing solids): not checked. L4 runs only in always-shown label mode.
  - 31, 32, 33 (screenshots, console, reduced motion in a browser): not run (see below).
  - 34 (a second reader states the idea back): not done.
- Not checked, marked unverified: 6 (light and dark, by eye), 13 (no horizontal scroll at 390 px), 24 (still frame, by eye).
- 33a: applies only to the skill's own demo; not applicable.

## Browser checks

Not run. Headless Chrome is installed, but the commands that would create the screenshot folder and run Chrome needed approval and were not approved, so no screenshot, console check, hover or Tab check, reduced-motion check or light/dark check was done. Nothing in this report says those checks passed.

## Open items

1. Browser checks not run: light and dark, 390 px width, reduced motion, console errors, hover/Tab reveal of each label, turn buttons, state button. Run them before release.
2. Second reader: have someone other than the author state the idea back in one sentence (checklist 34).
3. Contents rail (checklist 7, 8): does this page need one, or is the one-figure layout intended? The reference demo has none.
4. Labels as hover chips rather than side columns (checklist 16): accepted engine default, or switch to `labelMode: 'always'` for a printed, static version. Always mode runs L3 and L4 and allows five labels.
5. Painter order in turned views (lint L1, not in the gate): in view 2, the containers on the middle shelves are drawn before the shelf; in view 4, butter, eggs and cheese are drawn before their shelves. The glass shelves are see-through, so the visible effect is small, but the rule is not met in those views. The engine's `sortShapes` orders by depth, not by `rests`.
6. Turned-view detail counts (lint L11, not in the gate): in view 2, the condenser has no detail on its visible faces (its coil and screws are on the rear face); in view 4, the crisper and evaporator show fewer details than their size calls for.
7. Refrigerant pipes between compressor, condenser and evaporator are not drawn (Facts and assumptions).
8. Schematic proportions: the compressor is drawn larger than to scale (noted above).
9. Summary: the build and lint are clean, but the checklist is not fully answered "yes". Per the skill, release is blocked until items 1, 2 and the checklist "no" answers (7, 8, 16, 17) are decided.
