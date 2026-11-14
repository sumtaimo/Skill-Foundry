# Report: front-loading washing machine

## Input

Request, word for word:

> Show how a front-loading washing machine washes clothes. I want to see the real machine and what is inside it.

Idea sentence (derived from the request):

> The motor turns the drum, and the laundry inside is lifted and falls back as the machine washes it.

Size: Figure (one object, one page). Reader: a customer with no technical background.

## Files

| File | What it is |
|------|------------|
| `front-loader-washing-machine.html` | The page: the four-view figure (turn buttons, drag, arrow keys), light/dark theme button, pause button, one card per labelled part. No external scripts. |
| `front-loader-washing-machine.svg` | The front view as a standalone file, tokens inlined. |
| `build-figure.mjs` | Builds the HTML, the SVG and the lint report from the figure-craft engine. Run with `node build-figure.mjs` from this folder. Set `FIGURE_CRAFT_ENGINE` if the engine is not at `/home/user/Skill-Foundry/src/skills/figure-craft/engine`. |
| `lint-report.json` | `{ errors, warnings }` from `lintViews` (front view with all rules, the other three views with the geometry rules). Both arrays are empty. |
| `report.md` | This report. |

Regenerating gives the same bytes (checked with sha256 on two consecutive runs).

## Facts drawn and their source

The request asked for the real machine and its contents. No source document was supplied and no project files were involved, so the parts come from general knowledge of front-loading washing machines. Facts below are drawn as stated; anything marked *assumption* is not verified.

- Outer cabinet, white enamel, door on the front. Control console (display, program dial, power light) and a detergent drawer on top, at the front. Feet at the base. Power cable, water hose and rating plate on the back. (Fact.)
- Drum: steel, horizontal, open toward the door, with rows of holes in its wall. Laundry sits inside it. (Fact; the drum is drawn as a box, not a cylinder: the engine has no horizontal cylinder.)
- Motor: drives the drum. (Fact.) **Assumption: placement.** Most front loaders mount the motor at the back, under the drum. It is drawn low at the front, under the drum, so that it can be seen through the open front. This is a deliberate simplification, listed under open items.
- Door: hinged, swung open in the figure. Glass porthole. (Fact; the porthole is drawn as a rectangle, because the engine draws no round panels.)
- Laundry: lifted and dropped by the drum's lifters. (Fact; the lifters are not drawn. The laundry's up-and-down move is the story.)
- Not drawn: water inlet valves and flow, detergent flow, heater, drain pump and filter, counterweight, suspension. The idea sentence does not need them.

Dimensions are illustrative (about 1 unit = 1 cm); the figure is not to scale.

## Parts and details

Labelled parts (six, as required by `requiredParts`):

| Part (id) | Shown on hover as | Real feature | Details drawn (front view / back) |
|-----------|-------------------|--------------|-----------------------------------|
| cabinet | Cabinet | The white outer body | Top seam, two side vents, base seam (front); rating plate, power cable, water hose (back); far-side vent |
| door | Door | The hinged door with the porthole | Porthole (glass), rim, two hinges, handle |
| console | Control panel | Display, program dial, power light, detergent drawer | Display panel, program dial, power light, detergent drawer |
| drum | Drum | Steel drum open toward the door | Three rows of holes, rim seam |
| laundry | Laundry | The clothes (moves) | None: see open items |
| motor | Motor | Drives the drum | Housing rib, fin |

Unlabelled contents and parts: four feet, ground plate. The laundry is the only moving part.

Detail count: 19 on the front view, 23 in all, against a minimum of 15 (`max(12, 3 × labelled parts)`).

## Motion story

The laundry rises 14 units and falls back in a 3.2 s loop. It is not resting on another part during the move, so the lift is allowed. The still frame (reduced motion) shows the laundry in the drum, which explains the idea without motion. The pause button stops the loop; reduced motion hides it.

## Checks run and results

1. `node build-figure.mjs` with `lintViews`: **0 errors, 0 warnings.** Front view checked against L1–L19; the three turned views checked against the geometry rules (L2, L5, L6, L7, L15, L18).
2. Two consecutive builds: `front-loader-washing-machine.html`, `front-loader-washing-machine.svg` and `lint-report.json` identical by sha256.
3. Static checks on the output:
   - no `fill="#"` or `stroke="#"` in the SVG or the HTML (no raw colours);
   - no `<script src`;
   - the reduced-motion rule is present;
   - four views in the page;
   - outline weight is the engine's hairline (0.5); the heavier 1.3 appears only on the handle and the power cable, which the materials rules allow for real dark features.
4. Label size: 7 units in the figure's viewBox (186.8 wide). At 326 CSS px of available width, that renders at about 12.2 px, which meets the 11 px minimum.

## Checks not run

- **Browser checks: not run.** Headless Chrome and ImageMagick were available, but each command needed approval in this session, so I did not run them. Not run: light and dark screenshots, 390 px width with no horizontal scroll, reduced motion, console errors, and hover/focus checks. The page has not been seen rendered.
- **Second-reader check (checklist item 34): not done.** Nobody other than the author has stated the idea back.
- **Visual review of the drawing:** not done for the same reason. The shape is confirmed by the lint geometry only.

## Checklist answers

Answered from the files and the build output.

- Items with a lint id (L1–L19): yes, all, with 0 errors and 0 warnings.
- Intent, size, one idea, concrete object: yes.
- Tokens only, one `tokensCss()` style, no per-figure overrides: yes.
- Full solid volumes, every required part present and labelled, nothing floating, two or more materials (white, steel, dark, blue, red, green, plain): yes.
- Labels and leaders hidden at rest in every view, shown on hover, focus or tap: **yes by design, not verified in a browser.** The labels are only passed to views where their part is drawn (see open items).
- A card under the figure for each labelled part: yes (six cards).
- Turn buttons give four views: yes by construction; not checked in a browser.
- Motion tells one loop; still frame explains the idea: yes by design.
- Copy: one idea per sentence; no claims about the page's own state: yes.
- Light and dark, 390 px, console clean: **no, not checked** (see above).
- Lines are the engine's hairline weight: yes.

## Open items

1. **Browser checks not run** (approval needed for the Chrome command). Run the checks listed above before release.
2. **Second reader.** Ask someone to state the idea back in one sentence.
3. **Motor placement.** Drawn under the drum at the front so it is visible. Real front loaders usually have it at the back. Moving it there would hide it behind the cabinet's side wall, so it would fail the visibility rule (L16) as drawn. Decide whether to keep the simplification and say so on the page, or to open the cabinet's side.
4. **Laundry has no face detail.** Details on a moving part do not move with it in the engine, so none are drawn. The lint exempts moving parts from L11, but the quality bar says every labelled part should be recognisable from its details. Options: draw a second, static part of the laundry (for example a towel pile) or accept the gap.
5. **Engine issue: labels show at rest in turned views.** `renderViews` passes every label to every view. In a view where the part is hidden, the label gets no target and no `data-for` attribute, and the CSS hides only labels that have one, so the label stays visible. `build-figure.mjs` works around it by replicating `renderViews` and dropping labels whose part is not drawn in that view. The engine should do this itself. Please pass this to the skill owner.
6. **Engine limits used in the drawing:** the drum is a box, not a horizontal cylinder; the porthole is a rectangle, not a circle; the perforation is drawn as lines, not individual holes. These are shown as they are, not as the real shapes.
7. **Scope:** water, detergent, heating and drainage are not drawn. If the customer wants the washing process rather than the parts only, that needs a separate figure.
8. **Lint warnings:** none to justify.
