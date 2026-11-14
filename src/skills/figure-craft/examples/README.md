# Examples

## The reference figure: a refrigerator

Prompt: "Show my customers how a refrigerator keeps food cold. I want them to see the real fridge in detail, open, with the food and drinks inside."

Result: [demo.html](demo.html), one self-contained page, built by [build-demo.mjs](build-demo.mjs).

This is the detail level every figure aims for, whatever the object is.

- Idea: a refrigerator keeps food cold by moving heat from inside the cabinet to the coil on its back.
- The whole object, outside first: steel cabinet and freezer, kick plate with vents, feet, hinge cover, rating plate with screws.
- A cutaway (`open: 'xy'`) shows the inside where it really is: three glass shelves, a crisper drawer, a cold-air vent with its dial, a lamp glow, the evaporator in the freezer.
- Filled as it is used: milk, juice, bottles, jars, eggs, cheese, yogurt, vegetables, an ice tray, frozen food; bottles in the door bins.
- Two states: doors open and doors closed (`when`), switched with one button.
- Orbit: four views. From the back the reader sees the condenser rack with its copper tube and, in the machine bay inside the base (`open: ['-x', '-y']`), the compressor, the drain pan, the pipes and the power cable.
- Labels are hidden at rest and appear as a chip when a part is hovered, focused or tapped; cards under the figure name every part.
- Motion story: the cold-air block falls from the vent past the shelves; it stops under reduced motion.
- About 150 elements in the front view and 95 face details (the floor the lint asks of every figure). `lintStates` reports 0 errors and 0 warnings; the cards name each part, what it does, where it sits and the source of that fact.
- Regenerate: `node examples/build-demo.mjs` (from the skill folder) writes `demo.html`, `../preview/example.html` and `../preview/cover.svg`; the committed files must match it byte for byte.

Read `build-demo.mjs` before building your own figure: it shows how the layers of a real object are stacked, from the feet up, and how `slots`, `screws` and `repeat` add the small features.
