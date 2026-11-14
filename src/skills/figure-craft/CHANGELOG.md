# Changelog

## 1.0.0 - unreleased

The version stays 1.0.0 until the owner calls it final. Changes are listed here as they land.

- Engine: isometric solids with materials (`steel`, `white`, `dark`, `glass`, `plain`, `ink`, `blue`, `red`, `green`, `amber`), upright and lying cylinders, panels, discs, lines with pipe tones, lamp glow.
- Style: near-white palette, one hairline outline weight, one light direction, soft cast shadows; the SVG carries its own tokens.
- Open bodies (`open: 'x' | 'y' | 'xy'`) with contents (`inside`); states (`when`) such as doors open and closed.
- Orbit: four views a quarter turn apart with turn buttons, drag and arrow keys; back-side details (`face: '-x'`, `'-y'`).
- Labels: chips that appear on hover, focus or tap; no space reserved for them.
- Kit: `slots`, `screws`, `repeat` for micro detail in one call.
- Lint L1 to L19, `lintViews` and `lintStates`.
- Ten layer files; self-contained; starts from the goal the user states.
- Reference figure: one refrigerator, drawn whole, that opens, turns and shows its food (`examples/build-demo.mjs`).
