# Materials and light

The style is quiet and modern: near-white surfaces, low contrast between faces, one hairline grey
outline weight for every edge, soft shadows. The engine lights every figure the same way, so any object a user describes comes out in the same
style: light from the upper left, a lit left-facing side with a soft shine band, a shaded
right-facing side, a soft cast shadow plus a tight contact shadow under each solid so it sits firmly, and an edge highlight.
You choose what each solid is made of; the engine does the rest. NEVER draw shadows or highlights yourself.

- MUST give every solid the material of the real thing with `material`:

| Material | Use for |
|----------|---------|
| `steel` | appliance bodies and doors, machine housings, metal panels |
| `white` | enamel, painted or plastic casings, interior liners |
| `dark` | rubber, black plastic, motors, compressors, screens that are off |
| `glass` | windows, shelves, covers you must see through; shapes drawn before it stay visible |
| `plain` | paper, wood, stone, neutral bases and ground plates |
| `ink` | the one part the story is about, when it needs emphasis |
| `blue`, `red`, `green`, `amber` | contents and small objects: bottles, cartons, food, cans, tools |

- MUST use at least two materials in a figure with three or more solids (lint `L17-one-material`).
- MUST draw round things round: `box({ ..., round: true })` is an upright cylinder (equal width and depth); `round: 'x'` or `'y'` is one lying along that axis, for drums, rollers, motors, bottles on their side.
- Top edges carry a thin highlight just inside the rim, drawn by the engine, so a solid reads as softly rounded over.
- Upright edges are rounded by the engine (`r`, default 1.5; `r: 0` for a sharp edge such as a sheet of glass or a cut plate). NEVER fake a rounded corner with extra shapes.
- MUST use `disc(at, { on, face, r, material })` for a round feature on a face: a dial, a knob, a button, a porthole, a lid, a screw head.
- MAY add `glow(at, { r, inside })` where the real object has a light: a lamp inside a cabinet, a lit display.
- MUST use `panel(corners, { on, face, material })` for a filled area on a face: a door front, a display, a window, a drawer, a vent plate. A panel counts as a face detail.
- MUST colour pipes and flows with `line(points, { tone })`: `copper` for tubing, `cold` for cold flow, `warm` for heat.
- MUST show the inside through `glass` or one open side when a part would otherwise be hidden (lint `L16-hidden-part`); a labelled part stays at least 40% visible.
- NEVER set a stroke width or draw a heavier outline; the engine uses one hairline weight. Use `bold` only for a real dark feature such as a handle or a cable.
- NEVER write a colour; materials and tones are tokens, and the SVG carries its own token values so it also works as a standalone file.

Example: a steel cabinet with a glass door, a round dark compressor and a copper pipe.

```js
box({ at: [10, 10, 4], size: [50, 44, 120], material: 'steel', id: 'cabinet', rests: 'ground' }),
panel([[60, 14, 30], [60, 50, 120]], { on: 'cabinet', face: 'x', material: 'glass', id: 'door-window' }),
box({ at: [66, 20, 4], size: [18, 18, 22], round: true, material: 'dark', id: 'compressor', rests: 'ground' }),
line([[75, 29, 26], [75, 29, 60], [60, 29, 60]], { tone: 'copper', id: 'suction-pipe' }),
```
