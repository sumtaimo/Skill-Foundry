# figure-craft report: how a refrigerator keeps food cold

## Input (layer 10, item 1)

Request, word for word:

> Show my customers how a refrigerator keeps food cold. I want them to see the real fridge in detail, open, with the food and drinks inside.

Idea sentence (layer 01): **The figure shows that a refrigerator keeps food cold by pumping heat out of the cabinet and releasing it through the coil on its back.**

Reader: customers, who know what a fridge is and not how it works. Size: **Figure** (one object, shown open and turnable, with one labelled-part card list under it).

## Files produced

| File | What it is |
|------|-----------|
| `refrigerator.html` | One self-contained page: the orbit figure, tokens in one `<style>`, caption, hover hint, nine part cards, theme button, pause-motion button. No external scripts. |
| `refrigerator.svg` | Front view (doors open), the engine's output, standalone with its own tokens. |
| `build-figure.mjs` | Builds the three files and runs lint. `node build-figure.mjs` regenerates them. |
| `lint-report.json` | `{ errors, warnings }` from `lintStates` over both states and all eight views. |
| `report.md` | This report. |

Regeneration check: two consecutive runs produced identical bytes (`sha256` matched for all three generated files).

## Facts and assumptions (layer 02)

No specific fridge model, photo or drawing was supplied, so the object is a generic household refrigerator.

Facts drawn (general to how the appliance works):
- A compressor in a machine bay at the bottom pushes refrigerant round a loop.
- A condenser coil on the back gives the refrigerant's heat to the room.
- An evaporator coil in the freezer takes heat out of the air.
- Chilled air falls from a vent and passes over the food.
- Insulated walls and a rubber door seal keep the cold in.

Assumptions (not confirmed against a real model):
- All proportions: cabinet about 70 × 60 × 108 units, freezer above it, machine bay in the base.
- The layout: freezer on top, three glass shelves, a crisper drawer, a door with bins.
- The food and drinks shown are typical contents, not a specific product.
- **The compressor is drawn larger than to scale** so that it reads as a part (layer 04, step 6). The figure is not to scale overall.

## Parts table (layer 04, steps 5 and 7)

Nine labelled parts, all in `REQUIRED_PARTS`:

| Part (id) | Label | Real feature drawn | Shape | Face |
|-----------|-------|--------------------|-------|------|
| fridge | Fresh-food cabinet | door-side seam, rating plate with four screws and text, back vent slots, interior lamp glow | line, panel, slots, screws | -x, -y, x |
| freezer | Freezer | top rib, hinge cover, top seam, back seam | line, panel | top, -x |
| door | Door and bins | door seal, handle, display, display knobs, badge, liner | line, panel, disc | x, y, -x |
| shelf-2 | Glass shelf | trim and back edge | line | top |
| crisper | Crisper drawer | handle, rail, lid edge | line | y, top |
| evaporator | Evaporator coil | cold-flow tube as a zigzag, fin rows | line, slots | y |
| cold-air | Cold air | the moving block (falls from the vent) | box (moves) | — |
| compressor | Compressor | cap, terminal, weld seam | disc, line | top |
| condenser | Condenser coil | tube zigzag, wire slots, screws | line, slots, screws | -y |

Further details (not labelled, but real features): four feet, kick-plate vents, side vents, drain pan and rim, power cable, suction and discharge pipes, dial and dial mark on the vent, ice tray cells, bottle caps, egg tops, jam lid and the food and drinks on each shelf.

Lint counts the face details for the figure. The check needs at least 12 and is passed.

## Motion story (layer 04, step 9)

One block of cold air (`cold-air`, labelled) moves straight down (−z) from the vent through the cabinet, then fades and restarts. It moves along one iso axis, rests on nothing, and stops under `prefers-reduced-motion`. The still frame shows the same block at the vent over the shelves, so the idea is also readable without motion.

## Checks run and results

| Check | Result |
|-------|--------|
| `lintStates` over open and closed states, four views each (layer 07, item 1) | **0 errors, 0 warnings** |
| Lint rule coverage | Every rule the engine implements, L1 to L19 (`engine/lint.mjs`), ran on every state and view. I did not separately audit `RULES.json`. |
| Determinism: two builds, same bytes | Passed (sha256 match) |
| No external scripts in the page (`src=` count) | 0 |
| Raw colour in the SVG (any fill/stroke/stop not `var(--…)`, `none` or `url(#…)`) | None found |
| Viewport meta present | Yes |
| Label size at 390px (estimate from geometry, not measured) | Label text 7 units in a 195.5-unit viewBox; about 12 CSS px at 390px wide. Above the 11 px minimum. |
| Node run | Ran on Node v22.23.4. The engine header says Node 24; no runtime error. |

Checklist (`references/checklist.md`): every item was answered yes, no or not applicable from the build and the code. Summary:

- **Yes:** items 0–5, 9, 11, 14–20, 19a–19h, 19j–19o, 19q, 19r, 20a, 20c, 21–23, 25–30, 35. Several of these rest on lint results or the engine's own code, not on viewing the page.
- **Not verified (no browser):** 6 (both themes read correctly), 13 (no horizontal scroll at 390px), 19i (labels hidden at rest and revealed on hover), 20b (label size measured in a browser), 24 (the still frame explains the idea, judged from the geometry only).
- **Not run:** 31 (screenshots in light, dark, 390px and a second language), 32 (console clean), 33 (reduced motion shown as a still figure), 34 (second reader states the idea back).
- **Not applicable:** 7 and 8 (the contents rail and rail marker are not in the page spec, layer 04 step 13), 10 (no margin notes), 28 (one language only), 33a (applies only to the skill's own demo).

## Open items

1. **Browser checks not run.** No Chromium was on PATH, and the Python Playwright check needed an approval I did not request. Light and dark, 390px, reduced motion, console and hover/tap behaviour are unverified. Under the skill's rules, the figure is not released until those checks and the second-reader check (item 34) are done.
2. **Second reader not done.** Give the figure to someone who has not seen the build and ask for the idea in one sentence. If the answer differs from the idea sentence, go back to layer 04.
3. **Not a specific fridge.** The request says "the real fridge", but no model was supplied. If customers should see a particular model, send its dimensions or photos and the proportions can be redrawn.
4. **Geometry reuse.** The scene follows the skill's reference figure (`examples/build-demo.mjs`), because the subject is the same. The labels, cards, copy, page and build script are written for this request. The output is an engine render, but the scene itself is not new work.
5. **Build script depends on the skill folder.** `build-figure.mjs` imports the engine from `../../../../src/skills/figure-craft/engine/`. It runs as long as the output folder stays where it is. Move the output and the imports break.
6. **Not committed.** The output folder is a git repo, but nothing has been committed, since no commit was asked for.
