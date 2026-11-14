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
- MUST reach the micro-detail floor (lint `L19-sparse`), so a real object is always full, whatever size it is: at least 40 face details, four per labelled part on average, one and a half per solid on average, and 120 drawn elements (two and a half per solid for a big object). No solid that covers 4% of the drawing or more may be bare, except glass, and a detail drawn twice is an error: padding is not detail. The reference refrigerator has about 150 elements and 95 face details; aim there. Reach the floor with the real small features of each part (the catalogue below), each its own small solid, `panel`, `disc`, `line` or `dot`, never with copies.
- MUST use the kit from `engine/kit.mjs` for repeated small features: `slots(first, last, count, opts)` for vents, grilles and fins; `screws(corners, opts)` for the four screws of a plate; `repeat(count, make)` for rows of items.
- MUST read `examples/build-demo.mjs` first: the reference figure shows the detail level to reach.
- MUST draw a control panel, a display or a keypad as `panel` and `disc` details on the face of the body it belongs to, NEVER as a separate slab standing in front of the body.
- MUST start a cable or an outside pipe on a face of the body (a back or side face) and run it outside; NEVER let a free line start inside a body or cross through it.
- MUST detail the back sides too (`face: '-x'` or `'-y'`), because the reader can turn the object. See [orbit](orbit.md). On a round body use face `wrap` (`ring`, `band`, `studs`), which follows the curved wall.

## Catalogue of real small features

Ask of every part: what small things does the real one have? Draw the ones that apply, each as its own solid or detail.

| Part | Real features |
|------|---------------|
| Body, housing | seams where shells meet, a rating plate with screws, vent slots in rows, feet, a rubber foot, a hinge, a latch, bolts or screws at the corners, a rim ring, a weld line, a logo badge |
| Round body (jug, drum, tank) | rim and base rings, a weld seam, a label band, a gauge or water-level window, rivets, a drain cap, a pouring lip |
| Lid or cover | rim rings, a seam, a knob with a cap, a vent hole, a hinge, a latch, a seal ring |
| Handle, grip | grooves across the grip, two fixing bars, a seam down the edge, a thumb rest on top |
| Spout, nozzle, pipe | a neck and a lip, a dark mouth, a seam, a clamp, a flange with screws |
| Heating element, coil | concentric or zigzag tubes, a terminal block with screws, a sheath, a thermostat disc |
| Base, stand, dock | a ring step, a connector with its pins, non-slip feet, a cable guide, indicator light |
| Controls | a switch with its rocker, a dial with a mark, buttons in a row, a lit indicator, a display with its frame |
| Door, window | a gasket, a hinge pair, a handle, a glass panel with its frame, a seal line, a lock |
| Cable, hose | a strain relief where it leaves the body, a plug with pins, a clip, a label tag |
| Contents (liquid, food, parts) | a surface line or level mark, a label on a pack, a cap on a bottle, steam or bubbles as one named dot or line |

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
