# Detail

A part is recognisable when it carries the features people know it by. Details are `line` and `dot`
shapes that lie on a visible face of the part. They are planned here, before building, so the
detail comes from the skill and not from touching up the picture afterwards.

- MUST give every labelled part one detail, plus one for every 8% of the drawing it covers, up to three (lint `L11-no-detail`). Large parts such as a door or cabinet need more than one.
- MUST make each detail a real feature of the real part: a seam, door edge, handle, hinge line, vent slot, shelf edge, pipe, coil, dial, screen edge, indicator light.
- MUST attach each detail to its part with `on: '<part id>'` and a visible `face`: `top`, `x` (the right-facing side) or `y` (the left-facing side).
- MUST keep every point of a detail inside that face (lint `L2-face-detail`).
- MUST use a `panel` for an area feature (a door front, a display, a window, a drawer front, a vent plate) and a `line` for an edge feature.
- MUST add the small real features that make the object look real even where no label points: feet, hinges, a kick plate, a control strip, shelf edges, a power cable. These belong to the part they sit on (`on`).
- MUST use a `dot` only for a point feature that is named in a label or the copy (a light, a sensor, a knob).
- NEVER add a detail that the real part does not have, and NEVER add lines only to fill space.
- The lint minimum is one to three details per labelled part; a real appliance or machine usually needs twelve or more details and panels in total to look real.

## Parts table

Fill this in before writing the build script, and copy it into the report.

| Part (id) | Real feature | Shape | Face |
|-----------|--------------|-------|------|
| door | edge where the door meets the cabinet | line | x |
| door | handle | line (bold) | x |

## Face coordinates

For a box at `[x, y, z]` with size `[w, d, h]`:

- `top` face: every point has `z + h`; x runs `x..x+w`, y runs `y..y+d`.
- `x` face: every point has `x + w`; y runs `y..y+d`, z runs `z..z+h`.
- `y` face: every point has `y + d`; x runs `x..x+w`, z runs `z..z+h`.

Example: a horizontal seam across the `x` face of a cabinet at `[0, 0, 0]`, size `[30, 30, 70]`, at height 48:

```js
line([[30, 0, 48], [30, 30, 48]], { on: 'cabinet', face: 'x', id: 'door-seam' });
line([[30, 26, 30], [30, 26, 42]], { on: 'cabinet', face: 'x', bold: true, id: 'handle' });
```

A coil is one `line` with several points that zigzags inside one face.
