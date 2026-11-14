# figure-craft report: how a refrigerator keeps food cold

## Input (layer 10, item 1)

Request, word for word:

> Show my customers how a refrigerator keeps food cold. I want them to see the real fridge in detail, open, with the food and drinks inside.

Idea sentence: **A refrigerator keeps food cold by moving heat from inside the cabinet to the coil on its back.**

Reader: customers, who know what a fridge is and not how it works. Size: Figure (one object, inline on a page).

Build approach: the request is the same as the skill's reference example (`src/skills/figure-craft/examples/`). The shape list, the engine calls and the lint-clean geometry follow that reference closely. The copy, the card text, the assumptions and the output files were written for this build. The reference was not copied as a file.

## Files produced

| File | What it is |
|------|-----------|
| `refrigerator.html` | Self-contained page: the orbit figure, tokens in one `<style>`, caption and hover hint, one card per labelled part, theme button, pause button. No external scripts. |
| `refrigerator.svg` | Front view (doors open) as a standalone file, tokens inlined. |
| `build-figure.mjs` | Builds both files and `lint-report.json` from the engine. Run with `node build-figure.mjs` in this folder. |
| `lint-report.json` | `{ errors, warnings }` from `lintStates` over both states and all four views. |
| `report.md` | This report. |

The build imports the engine from `src/skills/figure-craft/engine/` (read-only). Set `FIGURE_CRAFT_ENGINE` to point elsewhere. The engine folder was not copied here.

## Parts and details

Required parts (`requiredParts`, all drawn and labelled): fridge, freezer, door, shelf-2, crisper, evaporator, cold-air, compressor, condenser.

| Labelled part | What it does | Real features drawn (face details) |
|---------------|--------------|-----------------------------------|
| Fresh-food cabinet | Main insulated compartment | steel body, cabinet seam, rating plate with four screws and text, back vent slots, lamp glow |
| Freezer | Coldest compartment above | seam, top rib, hinge cover, top seam |
| Door and bins | Door seal, bins in the door | seal line, door handle, three bins with rails and bottles |
| Glass shelf | Holds food, lets air pass | shelf trim, bottles with caps, egg tray, jam lid |
| Crisper drawer | Keeps vegetables from drying out | handle, rail, lid edge, lettuce, tomatoes, carrots |
| Evaporator coil | Takes heat out of the air in the freezer | coil tube, fin slots, ice tray cells, frozen box, ice cream |
| Cold air | Chilled air falling from the vent over the food | vent slots, temperature dial with mark |
| Compressor | Pumps the refrigerant round the loop | cap, terminal, weld line, feet |
| Condenser coil | Gives heat to the room on the back | coil tube, wire slots, four screws |

Other drawn parts: feet, kick plate with vents, drain pan, power cable, discharge and suction pipes, milk, juice, pickles, leftovers, butter, bowl and salad, water, cheese, yogurt, and the doors in both states.

Each labelled part has at least one detail and up to three, as lint requires (`L11`). The figure carries well over the twelve details that `L19` asks for.

Scale: the compressor and condenser coil are drawn larger than to scale so that they are legible (layer 04, step 6). The drawing is not to scale.

## Motion story

One story, as a loop: the cold-air block (a labelled part) falls from the freezer vent, past the glass shelves and over the food. Under `prefers-reduced-motion` it stops. The still frame (doors open, labels hidden) shows the vent, the shelves and the food, and the caption names the effect, so the idea reads without motion.

## Facts drawn and their source (layer 10, item 2)

No specification for a particular fridge was supplied and none is in the project. Every fact below is general knowledge of a standard household refrigerator, and is recorded as an **assumption**, not as verified against a model:

- Freezer above, fresh-food cabinet below, machine compartment at the base. *Assumed layout.*
- Compressor in the rear machine compartment at the base, with a drain pan beside it. *Assumed position.*
- Condenser coil and wire grille on the back wall. *Assumed position.*
- Evaporator coil behind the freezer's back wall. *Assumed position.*
- Cold air leaves the freezer through a vent on the fresh-food back wall, with a temperature dial. *Assumed route.*
- Glass shelves, a crisper drawer at the bottom, door bins and a rubber door seal. *Assumed common features.*
- The food and drinks are illustrative, not a particular stock.

These assumptions are also written in the card text on the page where they apply. The user should confirm them before this goes to customers.

## Lint result (layer 07, check 1)

`lintStates(states)` over both states and all four views:

- **Errors: 0**
- **Warnings: 0**

Rebuild check: `node build-figure.mjs` was run twice. The SHA-256 of `refrigerator.html`, `refrigerator.svg` and `lint-report.json` was identical on both runs, so the output is deterministic.

Raw colour check: the SVG has no `fill="#"` or `stroke="#"` attributes. Hex values appear only in the embedded token `<style>` block, as the engine writes them.

## Checklist answers (layer 10, item 5)

Answered yes or no per `references/checklist.md`. "Not run" means the item needs a browser or a reader.

- **Yes:** 0, 1 (Figure), 2, 3, 4, 5, 12 (16px gutter in CSS), 14–20 (lint and build), 19a–19q, 19r, 19k, 19l, 19m, 19n, 19f–19h, 19j (cards name all nine labelled parts), 19t, 19o, 19p (four views linted), 20c (theme button text and `aria-pressed` in code), 21, 22, 24, 25, 26, 27, 28 (English only), 29, 30, 35.
- **Yes, but not browser-verified:** 20a, 20b (font size computed by the engine for 390px, not measured), 19i (labels hidden at rest, by engine default, not seen), 19s (cutaway reads solid, not seen).
- **Not run:** 6 (light and dark look), 13 (no horizontal scroll at 390px), 23 (reduced motion, checked in code only), 31, 32, 33, 34.
- **Not applicable:** 7, 8, 9, 10, 11 are written for a multi-section page with a contents rail. This output is a single Figure, so they do not apply. A reviewer should confirm this.
- **Not applicable:** 33a applies only to the skill's own demo.

## Browser checks (layer 07, check 6)

- Browser available: `google-chrome` is installed, but running it headless required a command approval that was not granted in this run.
- **Not run:** light and dark screenshots, 390px screenshot, reduced-motion check, console errors, hover, focus and tap reveal, the four turn views, and the open and close button.
- No screenshots were saved. Nothing is reported as passed that was not run.

## Second reader (layer 07, check 8)

Not run. No second reader was available in this session.

## Open items

1. **Confirm the assumed layout and positions** above with the user or with the real product spec. Any change means editing the shapes in `build-figure.mjs`, rerunning it, and rerunning lint.
2. **Browser checks not run** (see above). Run them before customer release.
3. **Second-reader check not run.** Give the figure to someone who has not seen the build and ask for the idea in one sentence. It should match the idea sentence above.
4. **Checklist items 7–11** are not applicable to a single Figure, but a reviewer should confirm that.
5. **Compressor and condenser coil are enlarged** and not to scale.
6. **The page is English only.** Add languages only if the customer site needs them, and keep the same card keys in each.
7. **Placing the figure on a page:** copy the inline SVG and the `tokensCss()` style block from `refrigerator.html`. Do not copy colours.
