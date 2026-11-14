# Open, inside and orbit

Real objects have an inside and a back. The engine can open an object and let the reader turn it.

## Open and inside

- MUST draw working parts and contents where they are in the real object. A part that is inside the real object is drawn inside the body, NEVER beside it.
- MUST open the body to show them: `box({ ..., open: 'xy', wall })` is a cutaway that removes both visible sides and shows the whole inside. `open: 'x'` or `'y'` removes one side only; through one side of a deep body the reader sees the floor and one wall but little else, so use it for shallow bodies.
- MUST put a part that sits in a bay at the back or underneath (a compressor, a motor, a pump) inside the body too, and open that bay on its back sides: `open: ['-x', '-y']`. It is shut from the front and shows when the reader turns the object.
- A cutaway never looks like glass: the engine draws the cut through the walls as a solid band, lines the inside like the body and puts it in shade. Give the walls real thickness with `wall` (3 to 4 for an appliance), and NEVER use `glass` for a wall that is solid in the real object.
- MUST mark everything in the body with `inside: '<body id>'`; it is then seen only through the opening (lint `L18-outside-container`, `L16-hidden-part`).
- MUST draw a hinged door that belongs to the open side as a thin box swung out at a right angle from the hinge edge, with its handle and seal.
- MUST fill a container the way it is really used: shelves, drawers and the things kept in it (bottles as round boxes, cartons and boxes, produce), in `blue`, `red`, `green`, `amber` or `glass`. Contents are what make it look lived in.
- NEVER leave an opened body empty.

```js
box({ at: [20, 20, 3], size: [50, 50, 120], material: 'steel', id: 'cabinet', rests: 'ground', open: 'x', wall: 3 }),
box({ at: [23, 23, 60], size: [47, 44, 2], material: 'glass', inside: 'cabinet', id: 'shelf' }),
box({ at: [50, 30, 62], size: [8, 8, 18], round: true, material: 'green', inside: 'cabinet', rests: 'shelf', id: 'bottle' }),
box({ at: [70, 20, 3], size: [46, 3, 120], material: 'steel', id: 'door', rests: 'ground' }), // swung open
```

## Round bodies: kettle, jug, drum, tank, pot

A round object is a round box, never a box: `box({ at, size: [d, d, h], round: true, material, wall, id })` (width and depth equal).

- MUST open it as a round cutaway with `open`: each open face removes the quarter of the wall on that side. `open: 'xy'` is a half-section (the whole front half; the inside shows fully), `open: 'y'` or `'x'` is a quarter window (the rest of the wall stays, so a handle or spout can stand on a closed side). The engine draws the cut through the wall as a section band, lines the inside like the body, darkens it toward the floor and clips the contents (`inside`) to the opening, exactly as for a box. A side that is open but turned away from the reader is drawn closed, as for a box.
- MUST give a vessel with an open top `mouth: true`: the top ring is the rim and the contents show through the mouth. The lid is a separate part: `lid(body, { id: 'lid' })` returns the lid for two states, sitting on the mouth when closed and floating `lift` above it on a dashed axis when open, with its rim rings, seam and knob. NEVER draw a lid as a solid cap on a body that must show its inside.
- MUST put contents inside the circle: a round part (`round: true`) of radius up to the inner wall, or a box that fits the circle (lint `L18-outside-container`).
- MUST put a detail on the curved wall with face `wrap`, which follows the wall and shows only on the near half: `ring(body, z, { from, to })` for a seam, rim or weld; `band(body, z0, z1, { from, to, material })` for a label, a gauge window, a control strip; `studs(body, z, count)` for rivets or buttons (a `dot`, so name it in a label or the copy); `topRing(body, radius)` for a circle on a top (a heating element, a lid groove). Angles are degrees: 0 is the +x side, 90 the +y side; the reader sees -45 to 135 and the rest after a turn. `surfacePoint(body, angle, z)` gives a point on the wall for a hand-made line (lint `L2-face-detail` checks it is on the wall).
- MUST fix everything that belongs on the outside to the outside, with the kit: `handle(body, side, { id, z0, z1 })` (two bars into the wall and a grip with grooves), `spout(body, side, { id, z })` (a neck and a lip with a dark mouth), `attach(body, side, { reach, width, z, height, id })` (a hinge, a knob, a foot, a button). `side` is the side of the body: `x`, `y`, `-x`, `-y`. Each part carries `attach`; lint `L20-attach-outside` checks, in every view, that it touches the wall, does not enter the body or the opening, is not on a cut-away side and is drawn on the right side of the body. Parts on `-x` and `-y` are behind the body: list them BEFORE the body. Parts on `x` and `y` come after it. A spout opposite the handle with a quarter window between them is the usual kettle arrangement.
- Draw the bottom as it is: a base ring or foot plate is a second round box under the body (`rests`), the power cord a line that starts on a face.

```js
const body = box({ at: [10, 10, 10], size: [44, 44, 60], round: true, mouth: true, open: 'y', wall: 2.5, material: 'steel', id: 'jug', rests: 'base', when: 'open' });
// the same body closed, for the closed state
const shut = { ...body, open: undefined, when: 'closed' };
[ ...spout(body, '-x', { id: 'spout', z: 45 }), body, shut, ...handle(body, 'x', { id: 'handle', z0: 24, z1: 62 }),
  ring(body, 30, { id: 'weld' }), ...lid(body, { id: 'lid' }) ];
```

## The orbit: four true views, scrubbed by dragging

The reader turns the object a quarter turn at a time (buttons, arrow keys, swipe). While dragging, the next view fades in over the current one in proportion to the drag, and lets go to snap to it, so the turn feels smooth. It is a cross-fade between four true views, not a continuous rotation.

Why there is no continuous rotation: every view is drawn by the same engine and checked by the same lint (painter order, face details in their face, parts at least 40% visible, hit areas for hover). The engine is built on axis-aligned solids, so a view at 45 degrees would need rotated solids, a new visibility and depth sort, and lint for every angle; a half-correct sort would draw parts in front of what hides them, which the lint could not catch. Four views keep every rule enforced, so the engine does not offer in-between angles.

## States

- MUST give a part that moves between two positions both of them, with `when`: a door `when: 'open'` swung out and the same door `when: 'closed'` in place. Render with `renderStates(shapes, { states: ['open', 'closed'], ... })`; `orbitHtml` then adds one button that switches them.
- MUST make the first state the one that explains the idea (usually open); it is what shows without JavaScript.
- MUST check every state with `lintStates(states)`.
- MUST draw the body itself in both states when it is cut open: the body with `open: 'xy'` and `when: 'open'`, and the same body without `open` and `when: 'closed'`. Contents of a closed body are not drawn.
- MUST name the state button by what it does with `orbitHtml(states, { stateLabels: { open: 'Open it', closed: 'Close it' } })`.

## Orbit

- MUST render with `renderViews(shapes, opts)` from `engine/orbit.mjs` and place `orbitHtml(views, { label })` in the page. The reader turns the object a quarter turn at a time with the buttons, a drag, or the arrow keys.
- MUST give the back sides their real features with `face: '-x'` or `face: '-y'` on `line`, `panel` and `dot`: a rear grille, coils, a power cable, a rating plate, hinges. They show after a turn.
- MUST check all four views with `lintViews(views)` from `engine/lint.mjs` (or `lintStates`): every rule on the front view, the geometry rules on the others. A labelled part may be hidden from the front when another side shows it, as a compressor at the back is.
- The front view (view 1) keeps your draw order; the engine orders the other views and fades between them.
- MUST make a bay tall enough to see into: a part inside it must show at least 40% from the side the bay opens to (lint `L16-hidden-part` across views).
- NEVER write your own orbit script or hide and show views by hand.

```js
import { renderStates, orbitHtml } from './engine/orbit.mjs';
import { lintStates } from './engine/lint.mjs';
const states = renderStates(shapes, { labels, requiredParts, title, states: ['open', 'closed'] });
const report = lintStates(states);
const figure = orbitHtml(states, { label: 'Refrigerator' });
```
