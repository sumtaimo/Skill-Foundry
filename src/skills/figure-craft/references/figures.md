# Figures

- MUST show one concrete object a reader can picture (server, stack, lever, pipeline).
- MUST use the shared projection `project` with `C = 0.866`; NEVER hand-skew shapes.
- MUST list supports before what rests on them and set `rests` (lint `L1-painter-order`).
- MUST draw a real appliance, machine or device as itself, with its real parts; a metaphor is only for abstract ideas.
- MUST give every labelled part an identifying detail (lint `L11-no-detail`); see [detail](detail.md).
- MUST put a face detail (`dot` with `on`) in the face plane, inside the face and away from rounded corners (lint `L2-face-detail`).
- MUST list farther shapes (lower x + y) before nearer ones.
- NEVER add decorative dots; every dot is named in a label or the copy.

Example:

```js
const shapes = [
  box({ at: [0, 0, 0], size: [160, 60, 4], id: 'ground' }),
  box({ at: [64, 14, 4], size: [32, 32, 36], id: 'edge', rests: 'ground', tone: 'ink' }),
  dot([80, 30, 40], { face: 'top', on: 'edge', tone: 'ok' }), // top face is z = 4 + 36
];
```
