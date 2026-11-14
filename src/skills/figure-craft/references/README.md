# figure-craft references

Detail moved out of `SKILL.md`. Each file lists MUST / NEVER rules with a tiny example.

| File | Covers |
|------|--------|
| [tokens.md](tokens.md) | Colour tokens, light and dark |
| [layout.md](layout.md) | Page layout, label columns, viewBox |
| [figures.md](figures.md) | Objects, shapes, draw order, face details |
| [detail.md](detail.md) | Identifying details for every labelled part |
| [checklist.md](checklist.md) | The review checklist |
| [motion.md](motion.md) | The one motion story and reduced motion |
| [copy.md](copy.md) | Labels, captions and claims |

## Engine API (summary)

- `engine/tokens.mjs`: `TOKENS = { light, dark }`, `tokensCss()`.
- `engine/iso.mjs`: `C = 0.866`, `project([x,y,z])`, `box(...)`, `line(points, { bold, on, face })`, `dot(at, opts)`, `renderSvg(shapes, { labels, padding, flat, fontSize })`, `layoutLabels(labels, bounds, fontSize)`.
- `engine/lint.mjs`: `lint(model)` returns `{ errors, warnings }` for rules L1 to L12.

Axes: x runs down-right, y runs down-left, z runs up. Higher x + y is nearer the reader.
Use `flat: true` for preview covers: it drops gradients and uses only shared site tokens.
