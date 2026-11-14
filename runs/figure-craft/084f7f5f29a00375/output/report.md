# figure-craft report: how an electric kettle boils water

## 1. Input

Request, word for word:

> Show how an electric kettle boils water. I want to see the real parts of the kettle in detail, open, with the water inside.

Idea sentence (layer 01): "An electric kettle boils water by sending current through a heating element at the bottom of the jug, which heats the water until it boils."

Size: Figure (one object, inline on a page). Reader: a person who has used a kettle and has not seen its inside (assumed; no reader was named).

## 2. Facts drawn, their sources, and assumptions

No kettle model was supplied, and the request names no product, so the project was not searched for kettle data. The layout is the usual arrangement of a cordless electric kettle, drawn from general knowledge. It is not measured from a real model.

| Fact drawn | Source | Status |
|---|---|---|
| Round jug on a separate round base; the jug is the part that boils | General layout of a cordless kettle | Common arrangement |
| Heating element on the inner floor of the jug, under the water | General layout | Assumption (card marked "Assumed"): many models hide the element in the base of the jug |
| Lid sits on the open top, lifts clear, has a knob and steam vent slots | General layout | Common arrangement |
| Handle on one side, spout on the opposite side | General layout | Common arrangement |
| Base has contacts on its top ring, a power light and a switch, and the cord leaves one side | General layout | Common arrangement; exact positions are drawn, not measured |
| Water filling a bit over half the jug's height (48 of 88 units), with a level window | Figure choice | Assumption: a typical fill, not measured |
| Rising bubble from the element to the surface | Illustration of boiling | Assumption (card marked "Assumed"): not a part, not to scale |
| Four feet under the base, rating plate, cord plug, terminal pins, thermostat disc, element nut | General layout | Common arrangement; small features drawn for detail |

Sizes are not to scale. The bubble is drawn larger than life so it can be read (lint L12 needs every labelled part to cover at least 1% of the drawing).

## 3. Parts table (labelled parts, the required parts list)

Required parts: `kettle`, `lid`, `handle`, `spout`, `element`, `water`, `base` (the moving `bubble` is also labelled). Each labelled part has face details that identify it (lint L11 passes for all eight).

| Part (id) | Real feature drawn | Where it sits | Source / status |
|---|---|---|---|
| Kettle body (`kettle`) | Round steel jug, cut open on its front-left quarter in the open state; level window with marks; weld seams; rings at foot, waist and rim | The jug, standing on the base | Common layout |
| Lid (`lid`) | Separate lid with rim, seal ring, knob, steam vent slots, hinge on the back wall | Sits on the mouth when closed; lifts clear when open | Common layout |
| Handle (`handle`) | Two fixing bars with two screws each; grip with grooves and a seam | Outside the wall, right-hand side, opposite the spout | Common layout |
| Spout (`spout`) | Neck and lip with a dark mouth, rim and seam | Outside the wall near the top, far side (behind the jug in the front view) | Common layout |
| Heating element (`element`) | Flat element with nine concentric tube rings, a band, a central nut, a thermostat disc, two terminal pins with screws | Inside the jug, on the floor, under the water | Assumption (card marked "Assumed") |
| Water (`water`) | Clear glass, waterline and meniscus rings at the surface | Inside the jug, lower part | Assumption: typical fill |
| Power base (`base`) | Round dock on four feet; three contacts with pins; power light; switch with rocker; rating plate; cord grip; cord and plug | Under the jug, on the ground | Common layout |
| Rising bubble (`bubble`, moving) | Round bubble with a rim | Starts by the element, rises through the water | Illustration (card marked "Assumed") |

## 4. Motion story

One bubble rises from the element through the water, along one vertical axis, and loops. It is the only moving shape. Under `prefers-reduced-motion` it stops. The still frame shows the open kettle with the lid lifted, the water, the element and the bubble at its start.

## 5. Engine functions used

- `engine/iso.mjs`: `box`, `line`, `panel`, `disc`, `dot`
- `engine/orbit.mjs`: `renderViews` per state, `orbitHtml` (see open item 4: `renderStates` is not used)
- `engine/kit.mjs`: `ring`, `band`, `lid`, `handle`, `spout`, `slots`, `attach`, `topRing`
- `engine/round.mjs`: `arcPoints`, `surfacePoint`
- `engine/lint.mjs`: `lintStates`
- `engine/page.mjs`: `cardsHtml`, `lintCards`
- `engine/tokens.mjs`: `tokensCss`

## 6. Files (full paths)

- `/home/user/Skill-Foundry/runs/figure-craft/084f7f5f29a00375/output/electric-kettle.html`: the page (one file, no external scripts or links; both states, four views each, cards, theme button)
- `/home/user/Skill-Foundry/runs/figure-craft/084f7f5f29a00375/output/electric-kettle.svg`: the front view (open state, view 1), standalone
- `/home/user/Skill-Foundry/runs/figure-craft/084f7f5f29a00375/output/build-figure.mjs`: the build script (regenerates the two files and lint)
- `/home/user/Skill-Foundry/runs/figure-craft/084f7f5f29a00375/output/lint-report.json`: `{ errors, warnings }` from the lint
- `/home/user/Skill-Foundry/runs/figure-craft/084f7f5f29a00375/output/report.md`: this report

Regenerate: `node build-figure.mjs` in the output folder. The script imports the engine from `../../../../src/skills/figure-craft/engine/` relative to itself, or from the folder named in the `FIGURE_CRAFT_ENGINE` environment variable.

## 7. Checks run and results

| Check | Result |
|---|---|
| `node build-figure.mjs` (Node 22.23.4) | Ran. `errors: 0, warnings: 0` |
| `lintStates` over both states, four views each (L1 to L20, including L14 required parts, L19 floor, L20 attachments) | 0 errors, 0 warnings |
| `lintCards` (R31 card location and source) for 8 labels and 8 cards | 0 errors |
| Rebuild twice and compare checksums of the HTML and the SVG | Byte-identical (`electric-kettle.html` md5 `8dd3710c0cc7b38a8d11b34a52bd979c`, `electric-kettle.svg` md5 `54793803ce2d7cbd77bf7920b7a4d4d5`) |
| Colours: fills and strokes in the SVG use `var(--...)`; the hex values present are the token definitions in the embedded `<style>` | Passes L6 |
| Page structure: no `<script src>` or `<link>`; the orbit builder enforces four views per state | Checked by reading the output |
| Label size at 390px: the front viewBox is 134.85 units wide; the content is about 342 CSS px wide at 390px; 11 units is about 27 CSS px | Computed from the viewBox, not measured in a browser |

Lint history, for the record: the first build gave 2 errors (the lid had no label in the open state, and 57 elements against the floor of 120). The lid label now has an anchor per state. Then 87, then 117 elements, with an L10 warning (the element's parts too close together). Terminal pins were made long and spread along the element. The final build has 0 errors and 0 warnings.

## 8. Checklist answers (references/checklist.md)

Answered yes unless marked otherwise. "Not run" items need a browser or a second reader.

- Intent 0 to 3: yes. The goal is restated; the size is Figure; one idea; a concrete kettle.
- Tokens 4 and 5: yes (lint L6; `tokensCss()` only; no per-figure overrides).
- Tokens 6: not run (light and dark were not viewed).
- Layout 7 to 11: page only, not applicable to a single Figure (answered "page only").
- Layout 12: yes (16px gutter in the page's `main` padding).
- Layout 13: not run (no horizontal scroll at 390px was not measured in a browser).
- Figure 14 to 18: yes (lint L1 to L5 pass).
- Figure 19: yes. The only dot is the power light, named in the Power base card.
- Figure 19u, 19v, 19w: yes (lint R31 and L20 pass; the round jug is a round box with `mouth` and a lid that lifts).
- Figure 19s, 19t, 19o, 19p, 19q, 19r: yes by construction and lint (cutaway with thick walls; controls on the base face; cords start on a face; contents inside the jug; four views; L19 floor met; hairline weight, with only `bold` for the handle grip and the cable, which the engine allows for real dark features).
- Figure 19k, 19l, 19f, 19g, 19h: yes (L17, L16, L13, L14, L15 pass).
- Figure 19m: yes by construction (steel jug, base, handle, spout, lid, feet, cord). Not checked by eye (see Not run).
- Figure 19n: yes (no hand-drawn shadow or highlight).
- Figure 19i: yes by construction (labels hidden at rest; the default `labelMode` is hover). Hover and focus were not tested in a browser.
- Figure 19j: yes (a card for each labelled part).
- Figure 19e, 19a, 19b, 19c, 19d: yes (lint L12, L11, L10 with no warnings, L9; the SVG is the engine's output, not edited).
- Figure 20a: yes (engine leaders, no markers).
- Figure 20b: yes by calculation (see section 7).
- Figure 20c: the page's theme button reads "Dark theme" when light shows and "Light theme" when dark shows, and sets `aria-pressed`. The script was not run in a browser.
- Motion 21 and 22: yes (one loop; a single vertical move, L8).
- Motion 23: yes (L7 passes; the engine stops the motion under reduced motion). Not viewed.
- Motion 24: yes in the author's reading (the still frame shows the parts and the water; the bubble is the one cue that heat moves up). A second reader has not confirmed this.
- Copy 25 to 28: yes (one idea per sentence; no claims about tests, counts or versions; a single language, so 28 is not applicable).
- Verification 29: yes (build and lint, zero errors).
- Verification 30: yes (lint on the rendered model).
- Verification 31: not run (no browser screenshots in light, dark, 390px or a second language).
- Verification 32: not run (console not checked).
- Verification 33: not run (reduced motion not viewed; L7 only).
- Verification 33a: not applicable (demo files only).
- Review 34: not run (no second reader).
- Review 35: yes (no lint warnings remain).

## 9. Not run

- Browser checks: not opened in a browser: no permission. Light and dark, 390px width, reduced motion, the console, hover and Tab reveal, and screenshots were not done. The look of the figure has not been checked by eye. The lint and the build stand; the browser checks have not passed or failed.
- Second reader: not done.

## 10. Open items

1. Look at the figure. Nothing here has been viewed as an image. Open `electric-kettle.html` in a browser, or `electric-kettle.svg`, and confirm that the lid, spout and handle read as they should, and that the open jug shows the water and the element.
2. Water is drawn as clear glass, not blue. The engine's solid contents would hide the labelled element behind them (lint L16), so a tinted water would break the element's visibility rule. This is a known trade-off.
3. The model is not specified. If the user has a particular kettle, the parts' positions and the features on the cards should be checked against it. The element's position is marked "Assumed" in its card.
4. `renderStates` is not used. The lid moves between states, so the lid's label anchor differs by state. The build calls `renderViews` for each state with its own labels, and `lintStates` checks both states. The engine's `renderStates` would have needed one label anchor for both.
5. The bubble is drawn larger than to scale so it can be read.
6. The 120-element floor (L19) is met partly with small real features that are typical of kettles (feet, nut, thermostat, terminal pins, screws, rating plate, cord plug). Their exact form is drawn, not measured, and the report says so.
7. The build script depends on the figure-craft engine at its skill path, not on a copy in this folder. Copying the engine was not approved in this session, so the engine is read from `../../../../src/skills/figure-craft/engine/`. If that folder moves, set `FIGURE_CRAFT_ENGINE`.
8. The front view in `electric-kettle.svg` shows the open state, with the lid lifted. The closed state is in the page, behind the button.
