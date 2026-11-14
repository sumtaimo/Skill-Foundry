# Open, inside and orbit

Real objects have an inside and a back. The engine can open an object and let the reader turn it.

## Open and inside

- MUST draw working parts and contents where they are in the real object. A part that is inside the real object is drawn inside the body, NEVER beside it.
- MUST open the body to show them: `box({ ..., open: 'xy', wall })` is a cutaway that removes both visible sides and shows the whole inside. `open: 'x'` or `'y'` removes one side only; through one side of a deep body the reader sees the floor and one wall but little else, so use it for shallow bodies.
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
- The front view (view 1) keeps your draw order; the engine orders the other views.
- NEVER write your own orbit script or hide and show views by hand.

```js
import { renderStates, orbitHtml } from './engine/orbit.mjs';
import { lintStates } from './engine/lint.mjs';
const states = renderStates(shapes, { labels, requiredParts, title, states: ['open', 'closed'] });
const report = lintStates(states);
const figure = orbitHtml(states, { label: 'Refrigerator' });
```
