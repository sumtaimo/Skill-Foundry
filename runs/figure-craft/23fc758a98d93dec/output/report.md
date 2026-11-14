# Electric kettle figure: report

## Input

User request, word for word:

> Show how an electric kettle boils water. I want to see the real parts of the kettle in detail, open, with the water inside.

Idea sentence (derived from the request):

> An electric kettle boils water by passing current through a heating element on the floor of its body, which heats the water until the thermostat switches the power off.

Reader: someone who has used a kettle and wants to see what is inside it. Size: Figure (one object, inline).

## Files

Output folder: `/home/user/Skill-Foundry/runs/figure-craft/23fc758a98d93dec/output`

| File | Full path |
|------|-----------|
| Page (orbit, cards, theme and motion buttons, no external scripts) | `/home/user/Skill-Foundry/runs/figure-craft/23fc758a98d93dec/output/electric-kettle.html` |
| Front view as a standalone SVG (tokens inlined) | `/home/user/Skill-Foundry/runs/figure-craft/23fc758a98d93dec/output/electric-kettle.svg` |
| Build script (regenerates both files and the lint report) | `/home/user/Skill-Foundry/runs/figure-craft/23fc758a98d93dec/output/build-figure.mjs` |
| Lint result | `/home/user/Skill-Foundry/runs/figure-craft/23fc758a98d93dec/output/lint-report.json` |
| This report | `/home/user/Skill-Foundry/runs/figure-craft/23fc758a98d93dec/output/report.md` |

Regenerate: `node build-figure.mjs` in the output folder. The build script imports the engine from `/home/user/Skill-Foundry/src/skills/figure-craft/engine/`, so it needs the skill folder in place. Two consecutive runs produced byte-identical files (SHA-256 checked).

## Parts, where each sits, and the source

Source for every location: general knowledge of a common cordless electric kettle. No model was checked and no web source was consulted (web search was not permitted in this session). Locations marked **assumed** are guesses.

| Part (id) | What it does | Where it sits in the real object | Source / status |
|-----------|--------------|----------------------------------|-----------------|
| Kettle body (`body`) | Holds the water; round steel jug, lid on its open top | The whole round vessel, standing on the power base | General layout |
| Water (`water`) | The water to boil; drawn clear so the parts under it show | Inside the body, resting on the heating plate; level seen through the wall window | General layout |
| Heating element (`element-plate`) | Heats the water from the bottom through its coil | On the floor of the body, under the water; coil rings on its top | **Assumed**: drawn exposed on the floor. Many kettles hide the element under the floor. |
| Thermostat (`thermostat`) | Senses water temperature; switches the element off at the boil | On the heating plate, centre of the floor, in the water | **Assumed**: kettles put the boil cut-out in different places (plate underside, steam path near the spout) |
| Lid (`lid`) | Closes the top, keeps steam in | Sits on the open top when closed; **drawn lifted straight up** here | A real kettle lid is hinged at the back. The engine can lift a lid but cannot rotate it (see open items). |
| Handle (`handle`) | Grip to lift and pour | Fixed to the outside on one side (x), from near the top to the middle | General layout |
| Spout (`spout`) | Pours the water out | Fixed to the outside near the top, on the side opposite the handle (-x) | General layout |
| Power base (`base`) | Carries current from the cable to the body | Round base under the body, on three feet; cable leaves from its back socket | General layout |
| On/off switch (`switch`) | Starts and stops heating | A box fixed to the outside of the base, on its right-hand side | **Assumed**: many cordless kettles put the switch on the base, some on the handle |

Other drawn features, all from general kettle construction: lid steam vent (five slots, both states), lid hinge at the back (`lid-hinge`), water-level window with end caps and marks, body seams and rim, terminal blocks on the plate, element tabs, feet, cable socket and cable grip, rating plate on the back of the base. Several of these sit on the back or inside and are seen only after turning or through the open side.

## Motion

No motion story was added. The nine labels already fill the hover limit, and the user did not ask for motion. The still figure carries the idea. This departs from the skill's default of one motion story; see open items.

## Engine functions used

- `box` (with `round`, `mouth`, `open: 'y'`, `wall`, `inside`, `rests`, `when`), `line` (with `tone: 'warm'`, `bold`), `disc`
- `renderStates` (states `open` and `closed`), `orbitHtml` (state buttons "Open it" / "Close it"), `lintStates`
- Kit: `ring`, `band`, `topRing`, `lid` (open and closed states), `handle`, `spout`, `attach` (switch, cable socket, cable grip, hinge), `slots` (lid vent)
- Page: `cardsHtml`, `lintCards`; tokens: `tokensCss`

Design choices: the body is opened as a quarter window on its `y` side (`open: 'y'`), so the handle (x side) and spout (-x side) stand on closed walls, the usual kettle arrangement with a window between them. The water is drawn as `glass` so the heating plate and thermostat stay visible through it. The thermostat is `steel`.

## Checks run and results

| Check | Result |
|-------|--------|
| `lintStates` (every rule L1 to L20, both states, all four views) | **0 errors, 0 warnings** |
| `lintCards` (every labelled part has a card with what it does, where it sits, and its source or an "assumed" mark) | **0 errors** |
| Build run twice, output compared by SHA-256 | Identical: html `5977eecb…`, svg `dc092705…`, lint-report `e0c29240…` |
| Page has no external scripts or stylesheets | Confirmed (0 `<script src>`, 0 `<link>`) |
| Every SVG fill and stroke is `var(--…)`, `none` or `url(#…)` | Confirmed (0 raw colours) |
| Stroke width | Set by the engine only (0.3 hairline); the build script sets none |
| Lint `L19-sparse` floor (40 face details, 120 elements) | Met by lint; the figure has 120 elements after the final edits |

Checklist answers (`references/checklist.md`), summarised. Items not listed were not answered:
- Yes: one idea in one sentence (2); concrete object (3); token colours only (4, 20); object drawn as full solid volumes with real materials (19f, 19k, 19m); parts declared, drawn and labelled (19g); no floating parts (19h); round body drawn round with a separate lid that lifts (19v); handle and spout fixed to the outside (19w); parts sit where they really sit with sources (19u); card lists every labelled part (19j); hairline outlines (19r); no hand-drawn shadows (19n); SVG is engine output, not edited (19d, 17).
- Yes, by construction: theme button text names the theme it switches to, with `aria-pressed` (20c).
- **Not run**: browser checks in light, dark, 390px and reduced motion; console check; screenshots (checklist 6, 31, 32, 33). No browser permission was given. Nothing was rendered to an image either: no SVG rasteriser is installed here.
- **Not run**: second-reader check (checklist 34). The idea was not read back by anyone else.
- **No**: motion story (21, 24). The figure has no motion; see open items.
- Lint warnings left in place: none.

## Open items

1. **Lid is lifted straight up, not hinged.** A real kettle lid pivots at the back. The engine lifts and cannot rotate, so the open state shows the lid floating above the top. The card says so.
2. **Assumed placements** (marked in the cards): the element is drawn exposed on the floor; the thermostat sits on the plate in the water; the on/off switch sits on the base's right side. These need checking against a real model or a designer's drawings.
3. **General layout, not one model.** Nothing was checked against a specific kettle. Every feature is generic (see the card source lines).
4. **No motion story.** The skill asks for one. A natural story would be the heating: bubbles rising from the plate. That needs a labelled moving part, and the nine-label hover limit is already reached. Decide whether to drop a label or accept a still figure.
5. **Browser and visual checks not run** (no permission; no rasteriser). The figure is unseen: the layout passes lint but has not been looked at.
6. **Second-reader check** not done.
7. **Labels on hover only.** Parts are also named in the cards, so nothing depends on hover.
