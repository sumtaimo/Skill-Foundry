# figure-craft report: How a refrigerator keeps food cold

## 1. Input and idea

**Request (word for word):** "Show my customers how a refrigerator keeps food cold. I want them to see the real parts of the fridge in detail."

**Idea sentence:** A refrigerator keeps food cold by pumping heat out of the cabinet: the compressor drives a refrigerant loop that takes heat in at the evaporator and gives it out at the condenser.

**Size:** Figure (one object, one idea).

**Reader:** customers, who know what a fridge is but not how it works. Languages: English only (the request's language).

## 2. Facts drawn and their source

The project was not searched for fridge facts: the search command was blocked by the approval prompt, so no project source was used. A web search was not run either: WebSearch was not permitted in this session. So the facts below come from the standard vapour-compression refrigeration cycle as I know it, **not from a checked source**. They are listed as facts, but treat them as needing a quick review by someone with refrigeration knowledge before customer release.

| Fact | Basis |
|------|-------|
| The compressor is a sealed motor-pump that compresses refrigerant gas | standard cycle description (assumed, not checked) |
| The condenser releases heat from the refrigerant to the room | standard cycle description (assumed) |
| The expansion device (often a capillary tube) drops pressure before the evaporator | standard cycle description (assumed) |
| The evaporator coil, inside the freezer, absorbs heat from the cabinet air | standard cycle description (assumed) |
| An evaporator fan blows air across the evaporator coil | standard cycle description (assumed) |
| The door gasket seals the door; the door has a handle and hinges | general appliance knowledge (assumed) |

## 3. Assumptions and simplifications (marked as such)

- **Condenser location.** Drawn in the base. On many fridges it sits at the back. The card says so.
- **Expansion device** is drawn as a block, larger than the real narrow tube or valve. The card says "Drawn larger than real."
- **Cold air** is a moving marker, not a part. Its card says so.
- **Cut-away.** The top and right side are removed to show the parts. The base and the compressor are drawn solid; the cabinet walls are thin.
- **Freezer floor and food shelf are not drawn.** A full-width shelf would have hidden the compressor from this viewpoint.
- **Refrigerant pipes are not drawn.** The loop is described in the caption and the cards, not shown as tubing. Drawing tubing without a browser to check it was judged too risky.
- **Fan** is drawn larger than real so it passes the minimum-size check (L12).

## 4. Parts table

| Part (id) | Label | Real feature | Shape | Face |
|-----------|-------|--------------|-------|------|
| door | Door and seal | gasket loop around the door edge | line | y |
| door | Door and seal | handle | bold line | y |
| door | Door and seal | hinge pin, top left (dark dot, named in card) | dot | y |
| evaporator | Evaporator coil | coil tubing, zigzag | line | x |
| evaporator | Evaporator coil | header tube at the bottom | line | x |
| evap-fan | Evaporator fan | grille slot 1 | line | x |
| evap-fan | Evaporator fan | grille slot 2 | line | x |
| compressor | Compressor | shell seam | line | x |
| compressor | Compressor | electrical terminals on top (dark dot, named in card) | dot | top |
| condenser | Condenser coil | coil tubing with fins | line | x |
| condenser | Condenser coil | top edge | line | x |
| valve | Expansion device | tube port on top (named in card) | bold line | top |
| cold-air | Cold air | moving marker, not a part (no details; exempt from L11, L12) | — | — |

## 5. Motion story

One story, one loop: the **Cold air** marker moves along the x axis (down and to the right on screen) across the floor of the food space, 30 units, then starts again. It stays on the base at all times (z = 0 movement). Under `prefers-reduced-motion: reduce` it stops, and the still frame shows all parts with the caption; the labels still appear on hover. Still-frame explanation: a reader saw the compressor, evaporator, condenser and loop from the still drawing (see section 8).

## 6. Lint result

`lint(model)`: **0 errors, 3 warnings.** Written to `lint-report.json`.

Warnings left in place (justified):

1. `L4-leader-crosses-solid`: leader of "Compressor" crosses back-wall.
2. `L4-leader-crosses-solid`: leader of "Condenser coil" crosses left-wall.
3. `L4-leader-crosses-solid`: leader of "Expansion device" crosses back-wall.

Justification: the labels sit in side columns. With a cut-away fridge, a leader from an interior part to either column must pass one of the two thin cabinet walls (the back wall on the right column, the left wall on the left column). I tried other anchors and sides. Every alternative crossed a part or a wall that was worse. No leader crosses a part. The walls are the cabinet shell, not labelled parts.

Also checked: `L10-crowded` was cleared by moving the compressor, condenser and valve so each is at least 4 from the walls and from each other. `L12` was cleared by enlarging the fan.

## 7. Checks run and results

**Lint (engine, rules L1 to L15):** 0 errors, 3 warnings (section 6). Run by `build-figure.mjs`.

**Node checks** (run on the built files; script kept in scratchpad, not in output):

| Check | Result |
|-------|--------|
| SVG fills and strokes are tokens (117 paints) | pass |
| SVG has no raw hex or rgb colour | pass |
| Page has no external script | pass |
| Page has no external stylesheet or image URL | pass |
| Page has no raw colours outside the token `<style>` | pass (crude regex, see open items) |
| Reduced-motion block present in SVG | pass |
| Page has reduced-motion handling (pause button hidden) | pass |
| Every label has a card (7 labels, 7 cards, none missing) | pass |
| Every hover label points at a drawn part | pass |
| Labels hidden at rest (opacity 0) | pass |
| Lint report has zero errors | pass |
| SVG file equals the SVG inside the page | pass |
| Rebuild gives the same bytes (sha256 `9dda25be…`, unchanged on rebuild) | pass |
| Label text at 390px: 12.6 CSS px (font 16 × 342 px ÷ viewBox width 433.93) | pass (calculated, not measured) |

**Browser checks: NOT RUN.** Chrome headless and ImageMagick were present (`/usr/bin/google-chrome`, `/usr/bin/convert`) but each command needed approval that could not be granted in this session. So there are no screenshots, no measured 390px layout, no console check, and no check of hover, focus or reduced-motion in a browser.

## 8. Checklist answers (references/checklist.md)

Answers are "yes", "no" or "not checked". Any "no" or "not checked" blocks release (per the skill).

| # | Item | Answer | Note |
|---|------|--------|------|
| 0 | Starts from the stated goal, restated | yes | section 1 |
| 1 | Size chosen and stated | yes | Figure |
| 2 | One idea, stated before drawing | yes | |
| 3 | Concrete object | yes | a refrigerator |
| 4 | Every fill/stroke is a token | yes | node check |
| 5 | Light and dark from TOKENS, no overrides | yes | by construction |
| 6 | Reads correctly in light and dark | **not checked** | no browser |
| 7 | Contents rail with numbered sections | **no** | single-figure page; no rail built |
| 8 | Exactly one rail marker | **no** | no rail |
| 9 | One reading column | yes | |
| 10 | Margin notes below text on phones | yes | none exist |
| 11 | Facts as label/value cards | yes | name and description cards |
| 12 | Phone gutter 16px | yes | CSS padding; not measured |
| 13 | No horizontal scroll at 390px | **not checked** | no browser |
| 14 | Supports drawn before what rests on them | yes | lint L1 |
| 15 | Face details in plane, inside face | yes | lint L2 |
| 16 | Labels in columns, gap ≥13 | yes | lint L3 |
| 17 | Leaders avoid crossing solids | **no (justified)** | 3 warnings, section 6 |
| 18 | Shapes and text inside viewBox | yes | lint L5 |
| 19 | No decorative dots; every dot named | yes | two dots, both named in cards |
| 20 | Projection is the shared one | yes | engine |
| 19f | Full solid volumes | yes | lint L13 |
| 19g | Every needed part in requiredParts, drawn, labelled | yes | lint L14 |
| 19h | Nothing floats | yes | lint L15 |
| 19i | Labels hidden at rest; hover/focus/tap reveals | **not checked in browser** | CSS present; not run |
| 19j | Card under the figure names every labelled part | yes | 7 cards |
| 19e | Every labelled part ≥3% of drawing | yes | lint L12 |
| 19a | Face details per part | yes | lint L11 |
| 19b | Parts on one base ≥4 apart, span ≥30% | yes | lint L10 |
| 19c | Moving part labelled | yes | lint L9 |
| 19d | SVG is the engine output, nothing edited by hand | yes | build script |
| 20a | No dots or markers on leader ends | yes | engine |
| 20b | Label text ≥11 CSS px at 390px | yes | calculated 12.6 px |
| 20c | Theme button names its target; aria-pressed | yes | by code; not clicked |
| 21 | Motion tells one story and loops | yes | cold-air marker |
| 22 | Motion along one iso axis, z = 0 at rest | yes | lint L8 |
| 23 | Still under reduced motion | **not checked in browser** | CSS present |
| 24 | Still frame explains the idea alone | **partly** | second reader got the idea, see below |
| 25 | One idea per sentence | yes | |
| 26 | Copy short | yes | |
| 27 | Only facts the page keeps true | yes | |
| 28 | Same keys in every language | yes | one language |
| 29 | Build and lint pass with zero errors | yes | |
| 30 | Geometry checks run on the rendered model | yes | |
| 31 | Screenshots in light, dark, 390px, second language | **not checked** | no browser; no second language |
| 32 | Console free of errors | **not checked** | no browser |
| 33 | Reduced motion shows a still figure | **not checked in browser** | CSS present |
| 33a | Demo and preview equal `buildDemo()` | n/a | applies only to the skill's own demo |
| 34 | Someone other than the author states the idea | **partly** | see below |
| 35 | Lint warnings fixed or justified | yes | section 6 |

**Second reader (item 34).** A fresh reader (a Haiku subagent) was given only the SVG file (not this report) and asked for the idea in one sentence. It was told to ignore the `<title>` element, which holds the idea sentence, but it was not checked whether it did. The reader recovered the idea: the compressor drives refrigerant through a loop that absorbs heat at the evaporator and releases it at the condenser, with a fan moving chilled air. It named all seven parts with plausible roles. It did **not** identify the cut-away. It said the walls look solid and the top is not clearly open. It also said the refrigerant pipes are never drawn, so the loop is not visible. Both are real gaps (see open items).

## 9. Files produced

All in `/home/user/Skill-Foundry/runs/figure-craft/48a3cbb85606646a/output/`:

- `refrigerator-cooling.html`: one self-contained page. Figure inline, tokens in one `<style>`, caption, hover hint, seven part cards, theme button, pause button. No external scripts.
- `refrigerator-cooling.svg`: the same figure as a standalone file.
- `build-figure.mjs`: builds both files and the lint report from the engine.
- `lint-report.json`: `{ errors: [], warnings: [3] }`.
- `report.md`: this file.

The build script imports the engine from the skill folder (`../../../../src/skills/figure-craft/engine/`), so the engine is not copied into the output. Regenerate with `node build-figure.mjs` from this folder. The output is byte-identical on rebuild.

## 10. Open items

1. **Browser checks not run.** Light and dark, 390px with no horizontal scroll, reduced motion, console, hover and Tab focus, and screenshots. Chrome needs approval in this session. This blocks release.
2. **Facts unverified.** The parts and their roles come from general knowledge, not a checked source. A refrigeration expert should review them before customer use. WebSearch was not permitted.
3. **Cut-away reads weakly.** The second reader did not see the top and right side as open. Options: a visible rim on the top edge of the walls, or a short caption that names the cut-away on the figure itself.
4. **Refrigerant loop not drawn.** The loop is in the caption, not in the drawing. Adding tubing is possible as free lines, but it needs a browser check to avoid drawing over parts.
5. **Expansion device and fan are enlarged** beyond real size. Both cards say "Drawn larger than real."
6. **Condenser location** is a simplification (drawn in the base, card says it is often at the back).
7. **Lint warnings:** three leader crossings of thin cabinet walls (section 6), justified but not ideal.
8. **Page checks:** the "no raw colour in page" check is a crude regex; a proper HTML parser would be stricter.
9. **Layout items 7, 8, 13** (contents rail, one rail marker, no horizontal scroll) are not built or not checked. Item 7 and 8 are written for multi-section pages; the reviewer should decide whether they apply to a single figure.
