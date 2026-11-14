# figure-craft report: how a refrigerator keeps food cold

## 1. Input

Request, word for word:

> Show my customers how a refrigerator keeps food cold. I want them to see the real fridge in detail, open, with the food and drinks inside.

Idea sentence: **A refrigerator keeps food cold by moving heat from inside the cabinet to the coil on its back.**

Reader: customers with no technical background. Size: Figure (one object, inline on a page). Motion: on, one story. Languages: English (language of the request).

No real model or specification was supplied. The object is the common household fridge-freezer, so every location below is an assumption and is marked as one.

## 2. Parts, details and where each sits

Location source for every part: general layout of a household fridge-freezer. No model, photo or spec was supplied, so each card is marked **Assumed**.

| Part (id, label) | What it does | Where it sits (assumed) | Identifying details drawn |
|---|---|---|---|
| fridge, Fresh-food cabinet | insulated walls keep cold in, heat out | tall compartment under the freezer, above the machine bay | side seam, rating plate with screws, back vent slots, door-liner panel |
| freezer, Freezer | coldest space, next to the evaporator | top compartment, own door | side and top seams, top rib, hinge cover, evaporator, ice tray, frozen box, ice cream |
| door, Door and bins | rubber seal; bins hold bottles | front of both compartments, hinged on the left | door seal line, handle, display panel, knobs, bin rails, bottles in bins |
| shelf-2, Glass shelf | lets cold air pass round food | fresh-food cabinet, middle shelf | trim, back edge, bottle caps, container lid, eggs, jam lid |
| crisper, Crisper drawer | keeps vegetables from drying out | bottom of fresh-food cabinet, above the machine bay | handle, rail, lid edge, lettuce, tomatoes, carrots |
| evaporator, Evaporator coil | takes heat out of the air | back wall inside the freezer | coil tube (cold tone), fin slots |
| cold-air, Cold air | chilled air falls from the vent | leaves the vent on the back wall of the fresh-food cabinet | vent slots, temperature dial and mark |
| compressor, Compressor | pushes refrigerant round the loop | machine bay at the bottom, behind the kick plate | cap, terminal, weld line |
| condenser, Condenser coil | gives heat to the room | back of the cabinet | copper tube, wire slots, screws |

Every card on the page carries the same location and the same source line. Details were drawn to the engine's floor (lint `L19-sparse` passes); the counts were not tallied by hand.

Scene geometry is adapted from `examples/build-demo.mjs` in the skill folder, the reference refrigerator. The same subject and the same engine calls were used, so the geometry is the skill's own, with my parts list, labels and cards.

## 3. Motion story

One story: the cold-air block (`cold-air`, blue) falls 34 units from the vent on the back wall, over the shelves. It is labelled. Under reduced motion the figure is still. The still frame shows the open cabinet, the cold-air vent and the food, so the idea reads without motion.

## 4. Engine functions used

- `box`, `line`, `panel`, `disc`, `glow` from `engine/iso.mjs`
- `renderStates` and `orbitHtml` from `engine/orbit.mjs` (open and closed states, four views each)
- `slots`, `screws`, `repeat` from `engine/kit.mjs`
- `lintStates` from `engine/lint.mjs`
- `cardsHtml`, `lintCards` from `engine/page.mjs`
- `tokensCss` from `engine/tokens.mjs`

## 5. Files

Full paths, all written to the output folder:

- `/home/user/Skill-Foundry/runs/figure-craft/6459bbf9a17c82cf/output/refrigerator.html`: the orbit page (self-contained, tokens in one `<style>`, no external scripts or stylesheets, theme button, pause button, one card per part).
- `/home/user/Skill-Foundry/runs/figure-craft/6459bbf9a17c82cf/output/refrigerator.svg`: front view, doors open, as the engine rendered it.
- `/home/user/Skill-Foundry/runs/figure-craft/6459bbf9a17c82cf/output/build-figure.mjs`: build script. Run `node build-figure.mjs` in the output folder to regenerate all files.
- `/home/user/Skill-Foundry/runs/figure-craft/6459bbf9a17c82cf/output/lint-report.json`: `{ errors, warnings }` from `lintStates` plus `lintCards`.
- `/home/user/Skill-Foundry/runs/figure-craft/6459bbf9a17c82cf/output/report.md`: this report.

Note: `build-figure.mjs` imports the engine from `/home/user/Skill-Foundry/src/skills/figure-craft/engine/`. I did not copy the engine into the output folder, because the copy command was refused. If the skill folder moves, change the `ENGINE` constant at the top of the script.

## 6. Checks run and results

| Check | Result |
|---|---|
| `node build-figure.mjs` (Node v22.23.4) | ran; `lint: 0 errors, 0 warnings` |
| `lintStates(states)`: L1 to L20, all states and all four views | 0 errors, 0 warnings |
| `lintCards(CARDS, LABELS)`: R31 location and source on each card, every label has a card | 0 errors, 0 warnings |
| Rebuild determinism: sha256 of `refrigerator.html`, `refrigerator.svg`, `lint-report.json` before and after a second run | identical (`141fbe94…3035e`, `ab6b61a6…7d7e5`, `e0c2924b…3aff75`) |
| No external resources in the page: grep for `http(s)://`, `<script src`, `@import`, `<link` | only the SVG namespace URL (`http://www.w3.org/2000/svg`); no `<script src`, no imports, no links |
| Baseline: the skill's reference `demoLint()` run before the build | 0 errors, 0 warnings (engine works here) |

Not run:

- Browser checks (light and dark, 390px wide, reduced motion, console, hover and Tab reveal, and visual check of screenshots). No browser tool or permission was available in this session. This is not a pass. Nothing here says the browser checks passed.
- Second-reader test (checklist item 34). Not run.
- Visual inspection of the rendered SVG by eye. Not run.

## 7. Checklist (`references/checklist.md`)

Answered from the build and the lint result; no browser was used.

- Yes: idea sentence stated before drawing; one concrete object; size stated (Figure); every colour is a token (L6); parts drawn before what rests on them (L1); labels and leaders hidden at rest and revealed on hover, focus or tap (engine behaviour, from `orbitHtml`); the page lists every labelled part in a card; cards carry location and source (R31); the object is full solid volumes with a real material mix (L13, L17); parts above the ground rest on something (L15); labelled parts stay visible (L16); outside parts attached to the outside (L20, no handles or spouts here, so vacuously met); four views for turning (`renderStates`, `orbitHtml`); lint zero errors.
- Not confirmed: item 12 and 13 (no horizontal scroll at 390px), item 20b (label text 11 CSS px at 390px), item 6 (light and dark), items 31 to 33 (screenshots, console, reduced-motion check). These need a browser and were not run.
- Page-only items 7 to 11 (contents rail, reading column): N/A for a Figure.
- Item 28 (languages): one language, no translation keys.
- Item 33a (demo byte-match): N/A, this is not the skill's demo.
- Item 34 (second reader): not run.

## 8. Open items

1. **Location assumptions.** No real fridge model was supplied. Every card is marked Assumed and cites the common household layout. If the customers want a specific model, send its spec or photos and I will correct the locations and the parts.
2. **Browser checks not run.** Light and dark, 390px, reduced motion, the console and hover behaviour all need a browser. Run them on the page before release.
3. **Visual check not done.** I have not looked at the rendered picture. Open `refrigerator.svg` or the page and check that the object reads as a fridge with its doors open. Check the cold-air block and the bins.
4. **Engine path.** `build-figure.mjs` depends on the skill folder staying at its current path (see section 5).
5. **Scale.** Parts are drawn for legibility, not to real dimensions. I did not measure them against a real fridge, so proportions are approximate.
6. **Second reader.** Give the figure to someone who has not seen the brief and ask for the idea in one sentence.
