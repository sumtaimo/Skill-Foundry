# Figures

- MUST show one concrete object a reader can picture (server, stack, lever, pipeline).
- MUST use the shared projection `project` with `C = 0.866`; NEVER hand-skew shapes.
- MUST list supports before what rests on them and set `rests` (lint `L1-painter-order`).
- MUST draw a real appliance, machine or device as itself, with its real parts; a metaphor is only for abstract ideas.
- MUST draw the object as full solid volumes (lint `L13-no-solid-body`): boxes whose thinnest side is at least 30% of the longest cover at least 20% of the drawing. Open one side to show the inside; NEVER reduce the object to walls and plates.
- MUST pass `requiredParts` to `renderSvg` with the id of every part the idea needs (lint `L14-missing-part`); NEVER drop one to pass another check.
- MUST let every part above the ground rest on or touch another part (lint `L15-floating`).
- MUST draw the whole object as it stands in real life, outside first: body, door or cover, handle, feet, vents, controls, in their real materials. Then reveal the working parts and the contents inside through glass or one open side (`open`, `inside`), where they really are. See [orbit](orbit.md). NEVER show only the machinery. See [materials](materials.md).
- MUST keep every labelled part at least 40% visible (lint `L16-hidden-part`).
- MUST give every labelled part an identifying detail (lint `L11-no-detail`); see [detail](detail.md).
- MUST put a face detail (`dot` with `on`) in the face plane, inside the face and away from rounded corners (lint `L2-face-detail`).
- MUST list farther shapes (lower x + y) before nearer ones.
- MUST draw a round object round and open it as a round cutaway, never as a box (see [orbit](orbit.md)); MUST fix handles, spouts, hinges and knobs to the OUTSIDE of their body with the kit's `handle`, `spout` and `attach` (lint `L20-attach-outside`).
- NEVER add decorative dots; every dot is named in a label or the copy.

Example:

```js
const shapes = [
  box({ at: [0, 0, 0], size: [160, 60, 4], id: 'ground' }),
  box({ at: [64, 14, 4], size: [32, 32, 36], id: 'edge', rests: 'ground', tone: 'ink' }),
  dot([80, 30, 40], { face: 'top', on: 'edge', tone: 'ok' }), // top face is z = 4 + 36
];
```
