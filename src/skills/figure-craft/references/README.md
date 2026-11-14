# figure-craft references

Detail moved out of `SKILL.md`. Each file lists MUST / NEVER rules with a tiny example.

| File | Covers |
|------|--------|
| [tokens.md](tokens.md) | Colour tokens, light and dark |
| [layout.md](layout.md) | Page layout, label columns, viewBox |
| [figures.md](figures.md) | Objects, shapes, draw order, face details |
| [detail.md](detail.md) | Identifying details for every labelled part |
| [materials.md](materials.md) | Materials, light, shadows, round shapes, panels, pipes |
| [orbit.md](orbit.md) | Opening an object, its contents, back sides and the four-view orbit |
| [checklist.md](checklist.md) | The review checklist |
| [motion.md](motion.md) | The one motion story and reduced motion |
| [copy.md](copy.md) | Labels, captions and claims |

## Engine API (summary)

- `engine/tokens.mjs`: `TOKENS = { light, dark }`, `tokensCss()`.
- `engine/iso.mjs`: `C = 0.866`, `project([x,y,z])`, `box({ at, size, material, round, rests, move })`, `panel(corners, { on, face, material })`, `disc(at, { on, face, r, material })`, `glow(at, { r, inside })`, `line(points, { bold, on, face, tone })`, `dot(at, opts)`, `renderSvg(shapes, { labels, labelMode, requiredParts, padding, flat, fontSize })`, `layoutLabels(labels, bounds, fontSize)`.
- `engine/lint.mjs`: `lint(model)` returns `{ errors, warnings }` for rules L1 to L19; `lintViews(views)` and `lintStates(states)` for an orbit.

- `engine/orbit.mjs`: `renderStates(shapes, opts)`, `renderViews(shapes, opts)`, `orbitHtml(viewsOrStates, { label })`, `turnShapes`, `sortShapes`.
- `engine/kit.mjs`: `slots`, `screws`, `repeat`.

Axes: x runs down-right, y runs down-left, z runs up. Higher x + y is nearer the reader.
Use `flat: true` for preview covers: it drops gradients, shadows and the embedded tokens and uses only shared site tokens.
Labels are chips that appear beside a part on hover, focus or tap; no room is reserved for them, so the object fills the frame.
