# figure-craft report: How a refrigerator keeps food cold

## Input (layer 10, item 1)

Request, word for word:

> Show my customers how a refrigerator keeps food cold. I want them to see the real parts of the fridge in detail.

Idea sentence it became:

> A refrigerator keeps food cold by moving heat out of the cabinet; cold air made at the evaporator passes over the food.

Size: **Figure** (one object, one idea). The request asks for detail on the real parts. A Figure carries at most five labels (rule L-layout), so the five labelled parts are compressor, evaporator, cold air, food shelf and door. Parts that could not be labelled within that limit (condenser, fan) are listed under open items. If the customers need every part of the fridge, the split into several figures (a Page) should be confirmed with the user first.

Reader: customers with no engineering background.

## Facts drawn and their source (layer 10, item 2)

No project file in this repository contains refrigerator content (a search of the repo found only earlier runs of this same request and the skill's own eval case). The facts below come from general knowledge of household refrigerators and were not checked against a manufacturer's document.

| Fact drawn | Source |
|------------|--------|
| The compressor pumps refrigerant around a closed loop. | General knowledge (vapour-compression refrigeration) |
| The evaporator is a cold coil where refrigerant boils and absorbs heat from the air. | General knowledge |
| The condenser coils release that heat; they are usually at the back or underneath. | General knowledge. **Not drawn** (hidden at the back in this view). |
| The compressor sits at the back-bottom, in the machine well. | General knowledge. Position is schematic. |
| Door seam, handle and hinge edge are on the door. | General knowledge (appliance construction) |

## Assumptions (marked, not facts)

- **Scale.** The drawing is schematic. The compressor is drawn larger than to scale so that its details read (a real compressor is small beside a 170-unit cabinet). The evaporator is placed high on the back wall for clarity; in real fridges its position varies by model.
- **Cutaway.** Only the back wall is kept. The top, side and front are open so the parts show. The door is drawn swung open on the left.
- **Cold air.** The moving puff stands for airflow from the evaporator. Real airflow is driven by a fan, which is not drawn (see open items).
- **Coil.** The evaporator coil is drawn as a serpentine line on its face, a symbol for the tube run.

## Parts table with details (layer 04, item 4)

| Part (id) | Label | Real feature | Shape | Face |
|-----------|-------|--------------|-------|------|
| compressor | Compressor | suction pipe (low-pressure side) | line | x |
| compressor | Compressor | discharge pipe (high-pressure side), bold | line (bold) | y |
| evaporator | Evaporator | cold coil tube run | line (serpentine) | x |
| evaporator | Evaporator | inlet pipe along the top, bold | line (bold) | x |
| shelf | Food shelf | shelf edge | line | x |
| cold-air | Cold air | moving puff, no detail (moving parts are exempt from L11) | box | — |
| door | Door | seam between sections | line | x |
| door | Door | handle, bold | line (bold) | x |
| door | Door | hinge edge | line | x |

Each labelled part has its required detail count (`L11-no-detail`); the door (largest part) carries the maximum of three.

## Motion story (layer 04, item 6; motion.md)

One shape moves: the **cold-air** puff slides along the x axis (one iso axis) across the food shelf, then loops. It rests on the shelf (z stays 0), so there is no lift in z. Under `prefers-reduced-motion: reduce` the animation stops and the still frame shows the parts and the labels, which explain the idea without motion.

## Build

- Script: `build-figure.mjs` builds `refrigerator.svg`, `refrigerator.html` and `lint-report.json` from the figure-craft engine, then runs `lint(model)`.
- Engine import: `build-figure.mjs` imports `engine/iso.mjs`, `engine/lint.mjs` and `engine/tokens.mjs` from the figure-craft skill folder by relative path (`../../../../src/skills/figure-craft/engine/`). Copying the engine into this output folder was not possible in this session, so the output is **not self-contained**: it regenerates only where that skill folder is present at that path. The build runs under Node 22 (the skill targets Node 24; the engine uses only the standard library).
- Regenerate: `node build-figure.mjs` in this folder. Output is deterministic (the same bytes on each run).

## Lint result (layer 07, item 1; engine/lint.mjs L1-L12)

- **Errors: 0. Warnings: 0.**
- Label text: 14 viewBox units, which renders at about 14 CSS px on a 390px phone (checked in the build: 342 CSS px of figure width). The minimum is 11.

The first build found 3 errors and 3 warnings. All were fixed by changing the shapes, not by hand-editing the SVG:

- `L2-face-detail`: the coil ran outside the evaporator face. The coil was moved inside the face.
- `L11-no-detail`: the food shelf had no detail. A shelf-edge line was added.
- `L12-part-too-small`: the compressor covered 2.3% of the drawing. It was enlarged to 26×30×16 (note: drawn larger than to scale).
- `L4-leader-crosses-solid` (3 warnings): leaders crossed the far side wall. The side wall was removed to make a cutaway, which cleared the warnings.

## Checklist answers (references/checklist.md)

Answers are by reading the code and the build output. Items marked **not run** could not be checked in this session.

| # | Item | Answer |
|---|------|--------|
| 0 | Starts from the stated goal | yes |
| 1 | Size chosen and stated | yes (Figure) |
| 2 | One idea, stated before drawing | yes |
| 3 | Concrete object | yes |
| 4 | Every fill and stroke a token | yes (grep: no raw `#` colour; only `var(--...)`, `none`, `url(#...)`) |
| 5 | Light and dark from `tokensCss()` | yes (no per-figure overrides) |
| 6 | Reads correctly in light and dark | **not run** (no browser) |
| 7 | Contents rail with numbered sections | **no** — this single-figure page has no rail. Its rule was written for a multi-section page; decide whether it applies here. |
| 8 | One rail marker | **no** (same as 7) |
| 9 | One reading column | yes |
| 10 | Margin notes below text on phones | n/a (no margin notes) |
| 11 | Facts as label/value cards | yes |
| 12 | 16px phone gutter | yes (CSS: `main` padding 16px) |
| 13 | No horizontal scroll at 390px | **not run** (no browser) |
| 14 | Painter order (L1) | yes (lint 0 errors) |
| 15 | Face details in face (L2) | yes |
| 16 | Labels in side columns, ≥13 apart (L3) | yes |
| 17 | Leaders avoid solids (L4) | yes (0 warnings) |
| 18 | Shapes inside viewBox (L5) | yes |
| 19 | No decorative dots | yes (no dots drawn) |
| 20 | Shared projection | yes (`project` from the engine) |
| 19e | Each labelled part ≥3% (L12) | yes |
| 19a | Required details per labelled part (L11) | yes |
| 19b | Parts on one base spaced / span (L10) | yes (0 warnings) |
| 19c | Moving part labelled (L9) | yes (cold air) |
| 19d | SVG is engine output, nothing edited by hand | yes |
| 20a | Leaders have no dot or marker | yes (engine output) |
| 20b | Label text ≥11 CSS px at 390px | yes (about 14 px, computed) |
| 20c | Theme button names the theme it switches to; `aria-pressed` | yes by code; **not run** in a browser |
| 21 | One story, loops | yes |
| 22 | Motion on one iso axis, z 0 while resting (L8) | yes |
| 23 | Still under reduced motion | yes by code (engine emits the block); **not run** |
| 24 | Still frame explains the idea alone | yes by reading (labels and caption); not seen rendered |
| 25 | One idea per sentence | yes |
| 26 | Short copy | yes |
| 27 | Only true, self-maintained claims | yes ("usually at the back" is hedged) |
| 28 | Same keys in every language | yes (one language, English) |
| 29 | Build and lint pass, zero errors | yes |
| 30 | Geometry checks run on the rendered model | yes |
| 31 | Screenshots: light, dark, 390px, second language | **not run** (no browser) |
| 32 | Browser console clean | **not run** |
| 33 | Reduced motion checked to show still | **not run** |
| 33a | Demo files match `buildDemo()` | n/a (applies only to the skill's own demo) |
| 34 | A second reader states the idea back | **not run** |
| 35 | Warnings fixed or justified | yes (0 warnings) |

Items marked **no** or **not run** block release until resolved (see open items).

## Checks run and their results

1. `node build-figure.mjs` — exit 0; `errors: 0, warnings: 0`.
2. Grep of `refrigerator.html` and `refrigerator.svg` for raw colours (`fill="#"`, `stroke="#"`, `stop-color="#"`): none found.
3. Grep for external resources: the only `http` string is the SVG namespace; the HTML has no `<script src>`.
4. Reduced-motion block present in the SVG and in the page script (engine output).

## Checks not run

- **Browser checks** (light, dark, 390px, reduced motion, console): no browser is installed in this session (`chromium` and `firefox` not found), so none of these were run. Do not treat the page as checked at phone width until these are run.
- **Second reader** (checklist 34): not done.

## Open items

1. **Browser checks not run** (see above). Run light, dark, 390px and reduced-motion screenshots and a console check before release.
2. **Second reader not done.** Give the figure to someone else and ask for the idea in one sentence.
3. **Checklist items 7 and 8** (contents rail, one marker) answered "no". The page is a single figure and has no rail; decide whether those items apply.
4. **Parts not drawn:** the condenser coils (usually at the back, hidden in this view) and the evaporator fan (not drawn to stay within five labels). The copy states that the condenser is not shown.
5. **Compressor drawn larger than to scale** so its details read. Stated in the assumptions.
6. **Self-containment:** `build-figure.mjs` imports the engine from the skill folder by relative path. Copy the engine into this folder if this output needs to move.
7. **Facts unverified:** the parts and functions come from general knowledge, not from a manufacturer's specification. Have a domain reader confirm them before customers see the page.
8. **Earlier run:** `runs/figure-craft/479fdc682d83191e/` holds another output for the same request. It was not read or reused here.
