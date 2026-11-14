# Open, inside and orbit

Real objects have an inside and a back. The engine can open an object and let the reader turn it.

## Open and inside

- MUST draw working parts and contents where they are in the real object. A part that is inside the real object is drawn inside the body, NEVER beside it.
- MUST open the body to show them: `box({ ..., open: 'x' | 'y', wall })` removes that visible side and draws the inner floor and walls.
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

## Orbit

- MUST render with `renderViews(shapes, opts)` from `engine/orbit.mjs` and place `orbitHtml(views, { label })` in the page. The reader turns the object a quarter turn at a time with the buttons, a drag, or the arrow keys.
- MUST give the back sides their real features with `face: '-x'` or `face: '-y'` on `line`, `panel` and `dot`: a rear grille, coils, a power cable, a rating plate, hinges. They show after a turn.
- MUST check all four views with `lintViews(views)` from `engine/lint.mjs`: every rule on the front view, the geometry rules on the others.
- The front view (view 1) keeps your draw order; the engine orders the other views.
- NEVER write your own orbit script or hide and show views by hand.

```js
import { renderViews, orbitHtml } from './engine/orbit.mjs';
import { lintViews } from './engine/lint.mjs';
const views = renderViews(shapes, { labels, requiredParts, title });
const report = lintViews(views);
const figure = orbitHtml(views, { label: 'Refrigerator' });
```
