# Refrigerator figure: report

## Input

Request, word for word: "Show my customers how a refrigerator keeps food cold. I want them to see the real fridge in detail, open, with the food and drinks inside."

Idea sentence: **A refrigerator keeps food cold by moving heat from inside the cabinet to the coil on its back.**

Reader: customers, who do not need prior knowledge of refrigeration. Size: Figure (one object, with a page around it).

## Files

All in `/home/user/Skill-Foundry/runs/figure-craft/15e0141944aceb9e/output/`:

- `refrigerator.html`: one self-contained page. Tokens in one `<style>`, no external scripts, no external links. The figure is an orbit: four views, turn buttons, drag and arrow keys, an Open it / Close it state button. Labels appear on hover, focus or tap. Nine part cards, a theme button and a pause button.
- `refrigerator.svg`: the front view with the doors open, as a standalone file. Colours are `var(--...)` tokens, with the token values in its own `<style>` block.
- `build-figure.mjs`: builds the three files from the engine. Run `node build-figure.mjs` in this folder (Node 22 or newer). It imports the engine from `../../../../src/skills/figure-craft/engine/` in this repository, so it works here and not as a standalone copy.
- `lint-report.json`: `{ errors: [], warnings: [] }` from `lintStates` (both states, four views each) plus `lintCards`.
- `report.md`: this file.

## Facts and assumptions

No product spec, photo or model of a specific fridge was supplied. The drawing is the common layout of a household fridge-freezer, with a fresh-food cabinet under a freezer, a machine bay in the base, a condenser coil on the back and an evaporator in the freezer. **Every part location is an assumption.** Each card is marked "Assumed" on the page, and its source line says so. The real model may differ in layout, proportions and count of shelves.

The general mechanism (compressor, condenser on the back, evaporator inside, cold air moved through the cabinet) is the standard vapour-compression refrigeration cycle. It is the basis of the idea sentence. The drawing is stylised and not to scale; a small real part (the compressor) is drawn larger than to scale for legibility.

## Parts

| Part (id in build) | Where it sits (assumed) | Details drawn |
|---|---|---|
| Compressor (`compressor`) | machine bay in the base, behind the kick plate | cap, terminal, weld seam |
| Condenser coil (`condenser`, `condenser-tube`) | back of the cabinet, bay to freezer | coil tube, wire slots, corner screws |
| Evaporator coil (`evaporator`) | back wall inside the freezer | coil tube, fins |
| Cold air (`cold-air`) | leaves the vent on the back wall of the fresh-food cabinet | vent, slots, temperature dial |
| Freezer (`freezer`) | top compartment, own door | seams, top rib, hinge cover, ice tray, frozen box |
| Fresh-food cabinet (`fridge`) | tall compartment under the freezer | seams, rating plate, back vent, lamp glow |
| Glass shelf (`shelf-2`) | fresh-food cabinet, between crisper and top shelf | trim, back edge, bottles, container, eggs, jam |
| Crisper drawer (`crisper`) | bottom of fresh-food cabinet, above the machine bay | handle, rail, lid edge, lettuce, tomatoes, carrots |
| Door and bins (`door`) | front of both compartments, hinged on the left | liner, seal, bins with bottles, rating-plate side, handle, display |

Contents, drawn inside the open body: milk, juice, pickles, leftovers, butter, bowl with salad, eggs, jam, water, cheese, yogurt, ice cream and frozen food. Bottles are in the door bins.

## Motion story

One shape moves. The blue cold-air block falls 34 units down from the vent over the shelves. It is labelled "Cold air", so the motion is tied to its label. Under `prefers-reduced-motion: reduce` the animation stops and the still figure explains the idea alone (the cold-air block is then a labelled block at the vent, and the card says it falls over the shelves). The page's pause button is hidden for those readers.

## Engine functions used

From `engine/iso.mjs`: `box`, `line`, `panel`, `disc`, `glow`. From `engine/kit.mjs`: `slots`, `screws`, `repeat`. From `engine/orbit.mjs`: `renderStates`, `orbitHtml` (`renderViews` runs inside `renderStates`). From `engine/lint.mjs`: `lintStates`. From `engine/page.mjs`: `cardsHtml`, `lintCards`. From `engine/tokens.mjs`: `tokensCss`.

Not used: `handle`, `spout`, `attach`, `lid`, `ring`, `band`, `studs`, `topRing` (the figure has no round vessel with a lid or outside handle). `renderSvg` and `layoutLabels` run inside `renderStates`.

## Checks run

1. **Lint, `lintStates` on both states and all four views**: 0 errors, 0 warnings. This covers the rules L1 to L20 (painter order, face details, label overlap, leader crossings, viewBox, raw colours, reduced motion, motion axis, moving part labelled, crowding, detail per part, minimum size, solid bodies, required parts, floating parts, hidden parts, one material per solid group, contents inside the body, the detail floor, attached parts outside the body).
2. **Cards, `lintCards` against the nine labels**: 0 errors. Every label has a card with what it does, where it sits and the source.
3. **Determinism**: the build was run twice. SHA-256 hashes were the same both times:
   - `refrigerator.html` `bc8ff158…b9b24b4`
   - `refrigerator.svg` `ef4dcdf9…a678`
   - `lint-report.json` `e0c2924b…aff75`
4. **Colours in the SVG**: all 725 `fill` and `stroke` attributes are `none`, `var(...)` or `url(#...)`. No colour literals appear outside the one token `<style>` block. The page has no hex, `rgb()` or named colours in attributes.
5. **External references**: the HTML has no `<script src>` and no link to any external host. Its only URL is the SVG namespace string. It has 3 inline `<script>` blocks (the orbit's, the page's and the theme/pause handler).
6. **Required parts against labels**: `REQUIRED_PARTS` (9 ids) and `LABELS` (9 texts) match the card names one to one. No required part was removed.

## Checks not run

- **Browser checks (light and dark, 390px wide, reduced motion, console, hover reveal, turn buttons, state button)**: not run. This session has no browser permission. Nothing here claims they passed.
- **Second-reader check** (state the idea back in one sentence): not run. Nobody else has read the figure.
- **Full checklist** (`references/checklist.md`): not answered item by item. The items the lint covers (L1 to L20, `lintStates`, `lintCards`) are answered by the lint result above. The rest need a browser or a second reader, or a judgement on the real object: the location of each part (19u) rests on assumptions, and the scale (open item 2) was not measured. Item 33a does not apply, since it concerns the skill's own demo.

## Open items

1. **Confirm the layout against the real fridge.** Every location is an assumption (see Facts and assumptions). If the customer has a specific model, send its spec sheet or a photo and the parts can be checked against it.
2. **Scale is not measured.** The compressor is drawn larger than to scale, and so are the shelves and the coil. The figure is stylised.
3. **Geometry origin.** The geometry is taken from the skill's reference figure (`examples/build-demo.mjs`) for this same request. The labels, cards, assumption marks and the build script are my own work.
4. **Engine path.** The build script imports the engine from the skill folder by a relative path, so it regenerates only where the repository layout is the same.
5. **Motion axis.** The cold-air block falls straight down (vertical). Lint accepts it because the block is not resting on another part. Rule R-figure-craft-8 (one iso axis) is met in the engine's sense; a reviewer may still want a horizontal motion.
6. **Browser and second-reader checks** are not run (see above).
