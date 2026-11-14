# Motion

- MUST tell one story per figure, as a loop; one shape moves.
- Label reveal on hover is separate from the story: the engine adds it, with its own reduced-motion fallback. Do not write your own hover animation.
- MUST move along one iso axis: `move` has one non-zero component, and z is 0 when the shape `rests` on another (lint `L8-motion-off-axis`).
- MUST stop under `prefers-reduced-motion: reduce`; `renderSvg` emits that block (lint `L7-motion-no-reduced`).
- MUST let the still frame explain the idea without motion.
- NEVER animate colour flashes, spins or several shapes at once.

Example:

```js
box({ at: [30, 26, 4], size: [8, 8, 8], id: 'request', rests: 'ground', anim: 'travel', move: [26, 0, 0] });
```

Bad: `move: [20, 20, 0]` (diagonal) or `move: [0, 0, 10]` while resting.
