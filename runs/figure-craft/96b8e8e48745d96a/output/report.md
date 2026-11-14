# Figure report: how a refrigerator keeps food cold

## Input

Request, word for word:

> Show my customers how a refrigerator keeps food cold. I want them to see the real parts of the fridge in detail.

Idea sentence (layer 01):

> A refrigerator keeps food cold by moving heat out of the cabinet with a sealed refrigerant loop.

- Reader: customers with no technical background.
- Size: Figure (one object, inline on a page).
- Languages: English (the language of the request).
- Motion: on, one story (the heat marker moves out of the cabinet toward the condenser).
- Label font size: 12 viewBox units. At 390px wide the labels render at about 18.7 CSS px (minimum 11).

## Facts drawn and their source

No project files describe a refrigerator, so the facts come from general knowledge of how a vapour-compression refrigerator works. They were not checked against a specific model.

| Fact | Source |
|------|--------|
| A sealed compressor pumps refrigerant and makes it hot when it squeezes it | General knowledge, vapour-compression cycle |
| The condenser coil gives the refrigerant's heat to the room air | General knowledge |
| A capillary tube (or similar expansion device) drops the pressure of the liquid before the evaporator | General knowledge |
| The evaporator coil takes heat from the air around it, so the cabinet stays cold | General knowledge |
| An evaporator fan moves air over the coil and into the cabinet (not in every model) | General knowledge; the position of the fan varies |
| Freezer door above, fresh-food door below, rubber door gasket, handles, hinge pins, kick plate with a grille | General knowledge of common home refrigerators |

## Assumptions

1. **Layout is not a true cutaway.** The engine cannot cut a solid steel cabinet open without hiding the parts inside it. The evaporator, its fan, and the condenser are therefore drawn beside the cabinet on the same base, with copper and coloured pipes joining them. In a real refrigerator the evaporator and fan sit inside the cabinet and the condenser sits at the back or base. The page and the card for each part say so.
2. **The fan sits on top of the evaporator.** This is a drawing choice. Real placement varies.
3. **The heat marker is a diagram device, not a part.** It is drawn as a labelled moving block so the figure has one motion story. It travels along the floor, which is a simplification: in a real fridge the refrigerant carries heat through the pipes. It is labelled "Heat moving out" and the card says it is not a part.
4. **Proportions are approximate** (about 60 x 60 x 150 for the cabinet). The compressor, the evaporator fan and the condenser coil are drawn larger than to scale so that each one covers at least 3% of the drawing and can be read.
5. **Food is not drawn.** The cabinet is closed, so the figure shows the cooling system, not what is inside.

## Parts table

| Part (id) | Label on hover | Real feature | Shape | Face |
|-----------|----------------|--------------|-------|------|
| cabinet | Food cabinet | Door seam between freezer and fresh-food doors | line | y |
| cabinet | Food cabinet | Upper door gasket | line | y |
| cabinet | Food cabinet | Lower door gasket | line | y |
| cabinet | Food cabinet | Upper door handle | line (bold) | y |
| cabinet | Food cabinet | Lower door handle | line (bold) | y |
| cabinet | Food cabinet | Temperature control panel | panel (dark) | y |
| cabinet | Food cabinet | Upper door hinge | line | x |
| cabinet | Food cabinet | Lower door hinge | line | x |
| plinth | (not labelled) | Grille slats on the kick plate | line x2 | y |
| evaporator | Evaporator (cold coil) | Fin coil lines on the side | line | x |
| evaporator | Evaporator (cold coil) | Drain pan along the bottom | line | y |
| fan | Evaporator fan | Fan guard bar on top | line | top |
| condenser | Condenser coil | Zigzag wire coil on the front | line | y |
| compressor | Compressor | Terminal cover on top | line | top |

Pipes (not labelled, no `on`): warm discharge pipe (compressor to condenser), copper capillary tube (condenser to evaporator), cold suction pipe (evaporator back to compressor).

## Motion story

The heat marker (id `heat`, labelled "Heat moving out") sits at the cabinet's side and moves 60 units along the x axis toward the condenser, then loops. It is on one iso axis and rests on the floor, so z does not change. Under `prefers-reduced-motion: reduce` it stops.

The still frame explains the idea without motion: the labelled parts and the pipe colours show the loop, and the caption and cards name each part.

## Files produced

All in `/home/user/Skill-Foundry/runs/figure-craft/96b8e8e48745d96a/output/`:

- `refrigerator-cooling.html`: one self-contained page. The figure is inline, tokens are in one `<style>`, there are no external scripts, a caption, the hover hint, six part cards, a theme button and a pause button.
- `refrigerator-cooling.svg`: the same figure as a standalone file.
- `build-figure.mjs`: builds both files from the engine in `src/skills/figure-craft/engine/` and runs lint. Run with `node build-figure.mjs` from this folder.
- `lint-report.json`: `{ "errors": [], "warnings": [] }`.
- `report.md`: this file.
- `screenshot-*.png`: not produced (see checks).

## Lint result

`lint(model)`: **0 errors, 0 warnings.**

Along the way, lint found one error that was fixed by changing the shapes, not by removing the part: the evaporator fan covered 1.5% and then 2.7% of the drawing (minimum 3%). The evaporator was deepened and the fan enlarged to 30 units across. The fan is drawn larger than to scale for that reason.

## Checks run and their results

| Check | Result |
|-------|--------|
| Build and lint (L1–L17) on the rendered model | Pass: 0 errors, 0 warnings |
| Build is deterministic: rebuilding gives the same bytes | Pass for the SVG and lint report (same SHA-256 before and after rebuild). The HTML changed only when the copy was edited, and then was stable. |
| No raw colour in SVG attributes (every fill and stroke is a token, `none` or `url(#...)`) | Pass: 0 non-token colour attributes; no hex or rgb outside the `<style>` block |
| No external scripts, stylesheets or links in the page | Pass: 0 found |
| Inline page script parses (checked with `new Function`) | Pass: both inline scripts parse |
| Reduced-motion rule present in the SVG | Pass: 2 `prefers-reduced-motion` rules |
| Labels hidden at rest (CSS `opacity:0` on `.rc-label[data-for]`) | Present in the CSS. Not confirmed in a browser. |
| Rendered label size at 390px | Calculated: 12 x (390 - 32 - 16) / 219.72 = 18.7 CSS px, minimum 11. Calculated, not measured. |
| Duplicate ids in the SVG | Pass: none |
| Six part cards, one per labelled part | Pass: 6 cards |

## Checks not run

- **Browser checks: not run.** Google Chrome is installed, but running it and ImageMagick needs approval in this session, and approval was not given. So I did not take screenshots, did not check light or dark appearance, did not check 390px layout or horizontal scroll, did not check the console, did not check the hover, focus or tap reveal, and did not check the reduced-motion still frame. Those items are open.
- **Second reader: not run.** No one has read the figure and stated the idea back.

## Checklist answers (skill checklist)

Yes, by lint or by code inspection:
- Items 1, 2, 3, 4, 5 (tokens only, from `tokensCss()`), 14–19h (lint), 19d (SVG from engine, not edited by hand), 19e, 19a, 19b, 19c, 19f, 19g, 20a, 20b (by calculation), 21, 22, 23 (CSS rule present), 24 (by reasoning), 25, 26, 27 (no live claims), 28 (one language), 29, 30, 35 (no warnings).

Not verified (browser or review needed):
- 6, 12, 13, 19i (CSS only), 20c (code only), 31, 32, 33, 34.

Not applicable to this page:
- 7, 8, 10 (the page has no contents rail, rail marker or margin notes). 33a (applies only to the skill's own demo).

Items 7 and 8 read "no" for this page, because the page has no contents rail. The checklist says any no blocks release. I have not added a rail, because the figure page is short and a rail is not needed for a single figure. This needs the user's decision.

## Open items

1. Run the browser checks (light, dark, 390px, reduced motion, console, hover, focus, tap) and save screenshots. This needs Chrome to be approved for use in this session.
2. Get a second reader to state the idea back.
3. Decide on the layout: it is a drawn arrangement, not a true cutaway. If customers need the evaporator shown inside the cabinet, the figure would need a different design, such as a glass-fronted model.
4. Confirm the facts against the refrigerator model the customers buy. The fan's position, the condenser's position and the pipe routing are simplified.
5. Checklist items 7 and 8 (contents rail, rail marker) are "no" for this page; the user needs to decide whether they apply.
