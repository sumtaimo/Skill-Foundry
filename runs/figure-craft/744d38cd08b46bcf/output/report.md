# figure-craft report: how a refrigerator keeps food cold

## Input

Request, word for word:

> Show my customers how a refrigerator keeps food cold. I want them to see the real fridge in detail, open, with the food and drinks inside.

Idea sentence: **A refrigerator keeps food cold by moving heat from inside the cabinet to the coil on its back.**

Reader: customers, who do not know how a fridge works. Size: Figure (one object, one page).

## Files

| File | Full path |
|------|-----------|
| Page (orbit, cards, theme and pause buttons) | `/home/user/Skill-Foundry/runs/figure-craft/744d38cd08b46bcf/output/refrigerator.html` |
| Front view, doors open, standalone SVG | `/home/user/Skill-Foundry/runs/figure-craft/744d38cd08b46bcf/output/refrigerator.svg` |
| Build script (regenerates the three files) | `/home/user/Skill-Foundry/runs/figure-craft/744d38cd08b46bcf/output/build-figure.mjs` |
| Lint result | `/home/user/Skill-Foundry/runs/figure-craft/744d38cd08b46bcf/output/lint-report.json` |
| This report | `/home/user/Skill-Foundry/runs/figure-craft/744d38cd08b46bcf/output/report.md` |

Regenerate: `node build-figure.mjs` in the output folder (Node 22 or newer; verified on v22.23.4).
The script imports the engine from `../../../../src/skills/figure-craft/engine/`, which resolves only in the repository layout this run used. The engine was not copied into the output folder (see open items).

## Parts

Every part is in `requiredParts`: fridge, freezer, door, shelf-2, crisper, evaporator, cold-air, compressor, condenser. Each labelled part has a card under the figure. Every location is an **assumption**: no product spec was supplied, so each card is marked "Assumed".

| Label | Real feature drawn (details) | Where it sits (assumed) |
|-------|------------------------------|-------------------------|
| Fresh-food cabinet | seam where the shells meet, rating plate with screws, rear vent slots, lamp glow | Tall compartment under the freezer, above the machine bay |
| Freezer | top seam and rib, hinge cover, evaporator seam | Top compartment, own door |
| Door and bins | door seal, liner, handle, three bins with bottles | Front of both compartments, hinged on the left |
| Glass shelf | trim edge, back edge, with milk, juice, bottles, eggs, jam on it | Between the crisper and the top shelf in the fresh-food cabinet |
| Crisper drawer | handle, rail, lid edge, lettuce, tomatoes, carrots | Bottom of the fresh-food cabinet, above the machine bay |
| Evaporator coil | coil tube, fin slots, ice tray, frozen box, ice cream | Back wall inside the freezer |
| Cold air | falling block from the vent | From the vent on the back wall, down over the shelves |
| Compressor | cap, terminal, weld seam | Machine bay at the bottom, behind the kick plate |
| Condenser coil | coil tube, wire slots, screws | On the back of the cabinet, bay up to freezer |

Parts that are not labelled but are drawn: four feet, kick-plate vents, side vents, drain pan, power cable, base with open back, back vents, dial and vent on the cold-air vent, door display and knobs (closed state).

Scale: the drawing is stylised, not measured to scale. Small parts such as the compressor are sized so they read on a phone. The lint check L12 (each labelled part covers at least 1% of the drawing) passed for every label; I did not check whether any part is drawn larger than its real size, so that remains open.

## Motion story

The cold-air block falls 34 units from the vent on the back wall, over the shelves, and loops. The still frame (doors open) explains the idea alone: the cold air is shown in place. Under `prefers-reduced-motion: reduce` the motion stops (engine block). The page has a pause button.

## Engine functions used

- `box`, `line`, `panel`, `disc`, `glow` from `engine/iso.mjs`
- `renderStates`, `orbitHtml` from `engine/orbit.mjs` (states `open` and `closed`, four views each)
- `lintStates` from `engine/lint.mjs`
- `slots`, `screws`, `repeat` from `engine/kit.mjs`
- `cardsHtml`, `lintCards` from `engine/page.mjs`
- `tokensCss` from `engine/tokens.mjs`

## Checks run and results

1. `lintStates` on both states and all four views, plus `lintCards` on the nine cards: **0 errors, 0 warnings.** Output: `lint-report.json`.
2. Build run twice: the HTML, SVG and lint report have identical SHA-256 hashes on both runs (`767df175…`, `6745ce54…`, `e0c2924b…`). Deterministic.
3. SVG colour check: the only `fill`/`stroke` values are `none`. The one `#` hex match is the inlined token block in the SVG's own `<style>`, which is the expected place for token values.
4. Requirements matched against the layer lists: `requiredParts` contains the nine parts above; every label has a card (checked by `lintCards`).

## Checks not run

- **Browser checks** (light and dark, 390px, reduced motion, console errors, hover and tap reveal, screenshots): **not run: no permission.** No browser was opened, so nothing about those is claimed.
- **Second-reader check** (state the idea back in one sentence): **not run.**
- **Checklist (`references/checklist.md`)**: the lint-backed items are covered by the zero-error result. The remaining items (copy, the page-only rail items 7–11, the browser items 31–33, the second reader) were not answered individually and are not claimed.

## Open items

1. **Facts need confirming.** No product spec was supplied. Every part position and its function is the common layout of a household fridge-freezer and is marked "Assumed" on the cards. Confirm them before the figure goes to customers, especially the position of the cold-air vent, the evaporator, and where the compressor sits.
2. **Engine location.** `build-figure.mjs` imports the engine from the skill folder by relative path. Copying the engine into the output folder was not done because the copy needed an approval that was not granted. Regeneration works only where that folder layout exists.
3. **Shape list follows the skill's reference figure.** `examples/build-demo.mjs` in the skill is a refrigerator figure for the same request. This build uses its layout and detail level as the target that the skill asks for, with my own labels, cards and assumptions. A reviewer should know that the geometry is close to that reference.
4. **Browser and second-reader checks** above, if the customer release needs them.
