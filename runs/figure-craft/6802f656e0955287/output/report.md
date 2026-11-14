# Electric kettle figure: report

## Input

Request, word for word:

> Show how an electric kettle boils water. I want to see the real parts of the kettle in detail, open, with the water inside.

Idea sentence (layer 01): "An electric kettle boils water: a heating element on the floor of the jug heats the water, and when it boils, the steam trips a switch that cuts the power."

Size: Figure (one object, inline).
Languages: English (the language of the request).
Motion: on, one story (the bubble rises). The page has a pause button.

## Files

All files are in `/home/user/Skill-Foundry/runs/figure-craft/6802f656e0955287/output/`:

| File | Full path |
|------|-----------|
| Page | `/home/user/Skill-Foundry/runs/figure-craft/6802f656e0955287/output/electric-kettle.html` |
| Front view, standalone SVG (open state) | `/home/user/Skill-Foundry/runs/figure-craft/6802f656e0955287/output/electric-kettle.svg` |
| Build script | `/home/user/Skill-Foundry/runs/figure-craft/6802f656e0955287/output/build-figure.mjs` |
| Lint result | `/home/user/Skill-Foundry/runs/figure-craft/6802f656e0955287/output/lint-report.json` |
| This report | `/home/user/Skill-Foundry/runs/figure-craft/6802f656e0955287/output/report.md` |

Regenerate: `node build-figure.mjs` from the output folder. Two rebuilds gave byte-identical files (sha256 compared).

## Facts drawn and their sources

No kettle model was supplied, so every arrangement is the common layout of an electric kettle, from general knowledge. The card under the figure repeats this source for each part.

- The heating element is a flat plate on the floor of the jug, under the water (common concealed-element kettle).
- The steam switch is a metal switch inside the jug near the spout, above the water. It is steam-operated, so steam from the spout trips it when the water boils. **Assumed:** its exact place differs between kettles.
- The jug stands on a round base; contacts on the base top carry power to the jug. The cord leaves the base at the back.
- The spout is on the back-left side and the handle on the right side, opposite each other, as is usual.
- The lid sits on the mouth of the jug. **Simplified:** real lids hinge at the back; this figure lifts the lid straight up and draws the hinge at the back.
- The water is drawn as clear glass, so the element stays visible through it. It is not to scale.
- The bubble is an illustration, not a kettle part. **Assumed**, marked on its card.
- Feet, base vents, the base light, the terminal blocks and the cord clip are typical features with positions that were not measured.

## Parts, real features and where each sits

Labelled parts (one hover label each; the page names every part in a card):

| Part (id) | Where it sits in the real object (source) | Details drawn (count, front view) |
|-----------|-------------------------------------------|-----------------------------------|
| Jug (`jug`) | Main round body on the base; its open top is the mouth under the lid (common layout) | Rings at the base and near the top, rim ring, weld seam, level window (glass band), level marks and ticks, window edges (13) |
| Lid (`lid`) | Sits on the mouth; lifted in the open state. Drawn lifting straight up (simplified) | Rim, inner ring, seam, knob and cap, steam vent, two vent slots, seal (7) |
| Water (`water`) | Fills the jug above the element, up to the window level (common layout) | Surface ring, rim ring, level ring (3) |
| Heating element (`element`) | Flat plate on the floor of the jug, under the water (common concealed-element kettle) | Three concentric rings, coil, two bolts, thermostat disc, two studs (9) |
| Steam switch (`steam-switch`) | Inside the jug near the spout, above the water. **Assumed** | Top seam, two strips, screw (4) |
| Spout (`spout`) | Fixed to the outside of the jug wall near the top, on the back-left side (common layout) | Three lip seams on the visible face (3) |
| Handle (`handle`) | Fixed to the outside on the right side, away from the spout, from the base to the top (common layout) | Three grooves, seam, top edge, six grip ribs (11) |
| Power base (`base`) | Round base under the jug, on four feet; the cord leaves at the back and contacts sit on its top (common layout) | Rings, top rings, switch band and slot, light, vents in two rows, back vents, two contacts with pins, notch (20) |
| Bubble (`bubble`) | Illustration inside the water above the element. **Assumed**; moving part, so it has no detail (exempt by L11) | None |

Parts that are drawn but not labelled: the four feet, cord and plug, the spout neck and flange, the lid hinges and the cord clip (behind the body), the two terminal blocks, the steam bimetal strip, the handle bars and the lid disc.

Rule R-figure-craft-31 is met: each card gives the part's location and its source, and the two uncertain locations are marked "Assumed".

## Motion story

The bubble rises from the element through the water (`anim: 'rise'`, move up 30 units, a loop of 3.2 s). The engine stops it under `prefers-reduced-motion`. The still frame (open state) already shows the water, the element, the steam switch and the lifted lid, so the idea reads without motion.

## Engine functions used

- `engine/iso.mjs`: `box`, `line`, `disc`, `labelTarget`
- `engine/kit.mjs`: `spout`, `handle`, `lid`, `attach`, `topRing`, `ring`, `rings`, `band`
- `engine/round.mjs`: `surfacePoint`
- `engine/orbit.mjs`: `renderViews` (one call per state), `orbitHtml`
- `engine/lint.mjs`: `lintStates` (runs `lintViews` for each state)
- `engine/page.mjs`: `lintCards`, `cardsHtml`
- `engine/tokens.mjs`: `tokensCss`

Deviation: `renderStates` gives every state one shared label list. The lid and the parts inside the jug need labels that differ by state, so each state is rendered with `renderViews` and its own labels. It is the same engine and the same lint. Without this change, the closed state showed Bubble, Water, Heating element and Steam switch as chips on the jug; `labelCheck` in the build catches that case.

## Checks run and results

Lint (`lintStates` over both states and all four views, plus `lintCards`):
- Errors: 0. Warnings: 0. (`lint-report.json`: `{ "errors": [], "warnings": [] }`)
- This covers L1 to L20 and R31 (card location).

Label targets (`labelCheck`, in the build):
- Open state: 9 labels, each on its intended part.
- Closed state: 5 labels, each on its intended part.
- Negative test (shared label list): the check fails with "closed: 9 labels shown, 5 expected". So the check detects the bug it was added for.

Figure fullness (layer 07 floors, measured on the open state):
- 27 solids; 116 drawn elements in the front view plus 5 back details = 121 (floor 120).
- 87 face details drawn in the front view (floor 40, and 4 per labelled part).

Output checks:
- Rebuild twice: `electric-kettle.html`, `electric-kettle.svg` and `lint-report.json` have identical sha256 hashes each time.
- HTML: no `<script src>`, no `<link>`, no external URL. The only `http` strings are the SVG namespace (`http://www.w3.org/2000/svg`). Scripts are inline.
- SVG: no fill or stroke attribute holds a raw colour (`fill="#` and `stroke="#` count 0). The hex values that do appear are the engine's token definitions in the inline style block.
- The SVG is the engine's output; the build script does not edit it.

Label size at 390px (calculated from the viewBox, not measured): the viewBox is 141 units wide; at 390px with the 16px gutter and 8px figure padding, about 340px of drawing width gives a label of about 26 CSS px (floor 11).

## Checklist answers

Items 7 to 11 are page-only (contents rail, rail markers, margin notes): answered "page only" for this single Figure. Item 33a applies only to the skill's own demo: answered "n/a".

| # | Item | Answer |
|---|------|--------|
| 0 | Starts from the goal the user stated | yes |
| 1 | Size chosen and stated | yes (Figure) |
| 2 | One idea, stated before drawing | yes |
| 3 | Concrete object | yes |
| 4 | Every fill and stroke a token (L6) | yes |
| 5 | Light and dark from `tokensCss()`, no per-figure overrides | yes (code reading) |
| 6 | Reads correctly in light and dark | not run: no browser or rasteriser in this session |
| 7-11 | Page-only items | page only |
| 12 | 16px phone gutter | yes (code reading: `main` padding 16px) |
| 13 | No horizontal scroll at 390px | not run: no browser |
| 14 | Support drawn before what rests on it (L1) | yes |
| 15 | Face details in their face (L2) | yes |
| 16 | Labels in side columns, gap 13 (L3) | yes (labels are hover chips; L3 has no errors) |
| 17 | Leaders avoid other solids (L4) | yes (no warnings) |
| 18 | Shapes inside viewBox (L5) | yes |
| 19 | No decorative dots | yes (every disc is a named feature: screw, bolt, contact, vent, thermostat, stud) |
| 20 | Shared projection, no hand skew | yes |
| 19u | Each part's location and source on its card (R31) | yes (`lintCards`: 0 errors; two "Assumed") |
| 19v | Round object round, cutaway, lid separate and lifts | yes |
| 19w | Handle, spout and hinge fixed to the outside (L20) | yes |
| 19s | Cutaway reads as solid hollow, not glass | yes by construction (walls 2.5, not glass); not seen by eye |
| 19t | Controls on faces, cables start on a face | yes |
| 19o | Inside parts inside the body (L18) | yes |
| 19p | Turnable, back sides carry real features | yes (base vents, cord clip, hinges, spout) |
| 19q | Figure full (L19) | yes (see counts above) |
| 19r | Hairline outlines only | yes (the build sets no stroke width) |
| 19k | Real materials, two or more (L17) | yes (steel, dark, white, glass) |
| 19l | Labelled parts at least 40% visible (L16) | yes |
| 19m | Looks like the real thing from outside | yes by design; not seen by eye |
| 19n | Light and shadow from the engine only | yes |
| 19f | Solid volumes (L13) | yes |
| 19g | Required parts drawn and labelled (L14) | yes |
| 19h | Nothing floats (L15) | yes |
| 19i | Labels hidden at rest; hover reveals them | yes by engine default; hover not run |
| 19j | A card names every labelled part | yes |
| 19e | Each labelled part at least 1% (L12), aim 3% | yes (no warnings) |
| 19a | Face details per part (L11) | yes |
| 19b | Parts on one base spaced (L10) | yes (no warnings) |
| 19c | Moving part labelled (L9) | yes (bubble) |
| 19d | SVG exactly what the engine rendered | yes |
| 20a | Leader lines have no dot or marker | yes (engine default) |
| 20b | Label text at least 11 CSS px at 390px | yes (calculated, about 26 px) |
| 20c | Theme toggle text and `aria-pressed` | yes (code reading); not clicked |
| 21 | Motion tells one story and loops | yes |
| 22 | Motion along one iso axis (L8) | yes |
| 23 | Still under reduced motion (L7) | yes (engine emits the block) |
| 24 | Still frame explains the idea | yes (judgement; no second reader) |
| 25 | One idea per sentence | yes |
| 26 | Short copy | yes |
| 27 | No claims the page does not keep true | yes |
| 28 | Same keys in every language | n/a (one language) |
| 29 | Build and lint zero errors | yes |
| 30 | Geometry checks on the rendered model | yes |
| 31 | Screenshots in light, dark, 390px, second language | not run: no browser |
| 32 | Browser console free of errors | not run: no browser |
| 33 | Reduced motion shows a still figure | not run in a browser (engine block and page code only) |
| 33a | Demo files match `buildDemo()` | n/a (not the skill's demo) |
| 34 | Someone other than the author states the idea back | not run: no second reader |
| 35 | Warnings fixed or justified | yes (0 warnings) |

## Open items

1. **The picture has not been seen.** No browser and no rasteriser were available, so I could not look at the figure. Please open `electric-kettle.html` and check that the cutaway, the lid, the handle and the spout read correctly. The lint and the geometry checks are the only verification of the drawing.
2. **Not browser-tested:** light and dark, 390px, reduced motion, console, hover and Tab reveal, the turn buttons and the state button.
3. **Second reader:** not run.
4. **Real model:** no kettle was supplied, so the layout is typical. Assumed: the steam switch position and the bubble. If you have a specific kettle, I can move the parts to match it.
5. **Simplifications:** the lid lifts straight up (real lids hinge at the back); the water is glass, not blue; sizes are not to scale; the cord and plug are simple solids.
6. **Engine path:** `build-figure.mjs` imports the engine from `../../../../src/skills/figure-craft/engine/` (relative to this folder). It runs only where the skill folder sits at that place.
7. **Label state:** the build renders each state with `renderViews` and its own labels, not `renderStates` (see Engine functions).
