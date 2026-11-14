# Changelog

## 1.3.0 - 2026-11-14

- Labels and leaders are hidden at rest and appear with motion when a part is hovered, focused or tapped (`labelMode: 'hover'`, the default; `'always'` for static figures). Up to nine labels on hover.
- Lint `L13-no-solid-body`: the object is drawn as full solid volumes, not thin slabs.
- Lint `L14-missing-part`: `requiredParts` declared, drawn and labelled; a needed part is never dropped.
- Lint `L15-floating`: a part above the ground rests on or touches another part.
- Demo updated: hover labels, a vent on the edge cache, `requiredParts`.

## 1.2.0 - 2026-11-14

- Lint `L12-part-too-small`: every labelled part covers at least 3% of the drawing.
- Lint `L11-no-detail` asks for more details on bigger parts: one, plus one per 8% of the drawing, up to three.
- Lint `L10-crowded` no longer warns about parts that touch (one joined structure, such as cabinet walls).
- Layers 04 and 08 and the references describe sizing and full detail.

## 1.1.0 - 2026-11-13

- Detail comes from the skill: `line` face details (`on`, `face`), lint `L11-no-detail` for every labelled part, and `references/detail.md` with the parts table.
- Layout lint: `L9-moving-unlabelled`, `L10-crowded` (gap and spread on a base), and `L1` now requires `rests` for a part sitting on another.
- Ten layer files under `layers/`; the procedure starts from the goal the user states.
- Self-contained: the checklist moved into `references/checklist.md`; no paths outside the skill folder.
- Demo updated with details on the client and origin; new eval case `refrigerator-cooling`.

## 1.0.0 - 2026-11-13

- First release: tokens, isometric engine with label layout, lint rules L1 to L8.
- Eight-step procedure from sizing to report, references for tokens, layout, figures, motion and copy.
- CDN edge cache demo page and engine-generated cover.
- Review fixes: leaders drawn as bare `line.leader` with no anchor dots; `fontSize` option so demo labels stay at 11 CSS px or more at 390px; theme button names its target theme; `examples/build-demo.mjs` regenerates demo, example and cover byte for byte.
