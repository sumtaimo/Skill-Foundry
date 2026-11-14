# Refrigerator with door open: report

## 1. Input and idea

**Request (word for word):** "Show my customers how a refrigerator keeps food cold. I want them to see the real fridge in detail, open, with the food and drinks inside."

**Idea sentence:** Cold air from the vent moves across the shelves, so the food stays cold.

**Size:** Hero (one object at the top of a page).
**Reader:** customers with no engineering background; they know what a fridge is.
**Language:** English (the language of the request).
**Motion:** on, one story (a puff of cold air moves forward from the vent over the top shelf, then loops).

## 2. Facts drawn and their source

The project holds no refrigerator specification, so every fact below is general knowledge of a household refrigerator, not a checked product spec.

| Fact drawn | Source |
|---|---|
| Cold air leaves a vent inside the cabinet and moves across the food | General knowledge of household refrigerators (forced-air cooling) |
| Coils at the back give the heat out; a compressor pumps the refrigerant | General knowledge of the vapour-compression cycle |
| Door hinged on one front edge, with a gasket, handle, bins and a control display | General knowledge |
| Kick plate at the base, compressor under the back, power cord, rating plate on the back | General knowledge |
| Crisper drawer at the bottom; glass shelves | General knowledge |

### Assumptions (drawn, not confirmed)

- **Generic model, not a specific brand.** The user asked for "the real fridge"; no photo or spec of a particular model was supplied. Dimensions are typical household values (60 wide, 65 deep, 180 tall, in cm) and the parts are drawn to that scale.
- **Single-compartment fridge with no freezer section.** The drawing shows the fresh-food cabinet only.
- **Cold air vent on the inside wall, not the back wall.** This is a drawing choice. From the chosen view angle the back wall of the cabinet is hidden behind the right inner wall, so a back-wall vent could not be seen. Many real fridges vent from the back wall. This should be confirmed against the product the customers use.
- **Food and drinks** (milk, cheese, meat, yogurt, juice, cranberry, water, lettuce) are illustrative and simplified.
- **Back features** (condenser coils, compressor fins, rating plate, power cord) are typical placements, visible only after turning.

## 3. Parts table

Labelled parts (hover or tap reveals the name; each is also listed in a card under the figure):

| Part (id) | Real feature | Shape | Face | Notes |
|---|---|---|---|---|
| body | gasket (seal) on the left and right of the opening | line | y | `seal-left`, `seal-right` |
| body | top seal at the rim | line | y | `seal-top` |
| body | upper and lower hinge knuckles on the front-left edge | dark panel | y | `hinge-upper`, `hinge-lower` |
| body | front trim above the kick | line | y | `front-trim` |
| body | top and base seams on the side | line | x | `side-top-seam`, `side-base-seam`, `side-front-edge` |
| body | top panel seam | line | top | `top-seam` |
| door | inside liner | white panel | x | `door-liner` |
| door | three door-bin edges | line | x | `door-bin-1..3` |
| door | temperature display on the inside | dark panel | x | `door-display` |
| door | handle on the free edge | bold line | y | `door-handle` |
| door | outside handle | bold line | -x | `door-handle-outer` (after one turn) |
| door | outside top and bottom edges | line | -x | `door-top-edge`, `door-bottom-edge` (after one turn) |
| vent | five louvre slats | line | x | `vent-slat-1..5` |
| drawer | rim of the opening | line | y | `drawer-rim` |
| drawer | front handle on the rim | bold line | y | `drawer-handle` |
| drawer | side runner | line | x | `drawer-runner` |

Unlabelled parts with details: kick plate slots (2), milk seam (1), back coils (13 lines), rating plate, power cord, compressor fins (3), left-side seams (2). These are not part of the lint checks.

Every labelled part passes the size and detail rules on the front view: each covers at least 3% of the drawing (L12), and each has the face details its share calls for (L11). The moving cold-air block is exempt from both because it moves. No percentages are quoted here because the lint computes them, and the report does not repeat unmeasured values.

Labels (5, hover mode): Insulated cabinet, Door (swung open), Cold air vent, Cold air (moves forward), Crisper drawer.

Named in the cards only (not labelled): the glass shelves with milk, cheese, leftovers, meat, yogurt and bottles of juice, cranberry and water.

## 4. Motion story

One loop. A small "cold air" block (ink material) rests on the top shelf, beside the juice and water bottles, and moves forward along the shelf (+y, one iso axis, z held at 0). It starts next to the vent and travels toward the door, then returns. The still frame shows the cold-air block and the vent at the start of its path, so the idea is still legible with motion off.

## 5. Checks run and their results

**Lint (front view, four views of the orbit).**

- Front view: **0 errors, 0 warnings.**
- Views 1–4 under the lintViews rule set (L2, L5, L6, L7, L15, L18 on every view): **0 errors.**
- Full per-view lint, run for information (lintViews does not include L11 or L16 for turned views):
  - View 2, left side: 2 × L11 and 3 × L16. Cause: the cold-air vent and the drawer sit inside the cabinet on the wall that faces away from the reader in this view, so their details and visibility fall to 0%. The cabinet itself is 38% visible. Not fixed.
  - View 3, back: 0 errors.
  - View 4, right-back: 1 × L16. The door is 18% visible behind the cabinet. Not fixed.

The lint result is in `lint-report.json`.

**Build.** `node build-figure.mjs` runs and exits 0 (front-view errors: none). Running it twice gave identical checksums for `refrigerator.svg`, `refrigerator.html` and `lint-report.json`.

**Static checks on the outputs.**

- No external `src` or `href` references in the HTML. Three inline `<script>` blocks: the theme switch, the orbit control (both from the engine or the page builder), and the page's own script.
- No hex colour in any fill or stroke attribute of the SVG; all colours are tokens.
- Stroke widths used: 0.5 (hairline), 0.6 and 0.75 (chip frame and leader, both from the engine), and 1.3 for the bold handle and cord lines. The build script sets no stroke widths itself.
- Label font size is 11 units in a viewBox 193.2 units wide. At 390px with the 16px gutter the figure is about 326px wide, which gives a label size of about 18.6 CSS px. This is calculated, not measured.

**Browser checks: not run.** Google Chrome is installed, but launching it requires command approval that was not granted in this run. Not run: light and dark screenshots, 390px width, no horizontal scroll, reduced motion, console errors, hover and Tab reveal of each label, and the four turn views. No screenshots were saved.

**Second reader: not run.** It needs a rendered figure.

## 6. Checklist answers (`references/checklist.md`)

- **Yes:** 0, 1, 2, 3, 4, 9, 11, 12 (CSS gutter 16px), 14, 15, 18, 19, 19a, 19b, 19c, 19d, 19e, 19f, 19g, 19h, 19k, 19l (front view), 19m, 19n, 19o, 19p, 19q, 19r (no build-script stroke widths), 19j, 20a, 20c (theme button names the target theme and sets aria-pressed), 21, 22, 25, 26, 27, 29, 30, 35.
- **Yes, by reading only:** 5, 16 (hover mode; five labels), 20b (calculated), 24 (still frame), 23 (lint L7 passes; the page hides the pause button under reduced motion).
- **Not verified (no browser):** 6, 13, 17 (L4 is skipped in hover mode), 19i (the reveal and hover behaviour), 31, 32, 33.
- **Not applicable to a single-figure page, answered as no and flagged for the reviewer:** 7 (contents rail), 8 (rail marker), 10 (margin notes). 28 is not applicable: only one language is shipped.
- **Not applicable:** 33a (applies only to the skill's own demo).
- **Not done:** 34 (a second reader).
- **Answered no:** 7, 8, 10 as described above; no other "no".

## 7. Open items

1. **Labels in turned views (engine limitation, most important).** `renderViews` passes every label to every view. When the cabinet's open side faces away, the vent, drawer and cold-air labels still exist, and each one resolves to the cabinet. On the back and right-back views, hovering the cabinet therefore shows those chips, even though the parts are hidden. Fixing this needs per-view label filtering in the engine. It was not patched by hand.
2. **Turned-view lint, left side (view 2):** 2 × L11 and 3 × L16 (see section 5). The lintViews rule set does not block these, but they should be addressed if the orbit must meet the full per-view rules.
3. **View 4 (right-back): door 18% visible** (1 × L16). Not blocking under lintViews.
4. **Vent location** is a drawing choice (inside left wall). Confirm against the product the customers use.
5. **Glass shelves are not labelled.** A full-width shelf is at most about 40% visible through the opening from this angle, so a label would fail L16. The food and drinks are named in the cards.
6. **Compressor and coils are not labelled.** They are behind the cabinet in the front view, so they cannot pass L16 there. They appear on the back view and are described in the caption.
7. **Generic model.** If the customers' own fridge is a particular model, send its dimensions or photos, and the parts can be redrawn to match.
8. **Browser checks and the second reader were not run** (section 5). Run them with browser access before release.
9. **Checklist items 7, 8 and 10** answered as "no" because the page is a single figure with no contents rail or margin notes. The reviewer decides whether that blocks release.

## 8. Files

- `refrigerator.html`: the orbit page (four views, turn buttons, drag and arrow keys), tokens in one style block, caption, hint, one card per labelled part, theme button, pause button.
- `refrigerator.svg`: the front view as a standalone file (the engine's output, unedited).
- `build-figure.mjs`: builds both files and runs lint. It imports the engine from the figure-craft skill folder (`src/skills/figure-craft/engine/`), so it needs that folder present. Run `node build-figure.mjs` in this folder.
- `lint-report.json`: `{ errors, warnings }` for the four-view lint, plus `perView` with the full lint of each view.
- `report.md`: this report.
- `screenshot-*.png`: none. Not produced (see section 5).
