# Changelog

## 1.1.0 - 2026-11-14

- Require the report to name the engine functions used, so a reader can verify the figure came from the engine.
- Mark page-only checklist items so a single Figure is not blocked by them.

## 1.0.0 - 2026-11-13

- First release: tokens, isometric engine with label layout, lint rules L1 to L8.
- Eight-step procedure from sizing to report, references for tokens, layout, figures, motion and copy.
- CDN edge cache demo page and engine-generated cover.
- Review fixes: leaders drawn as bare `line.leader` with no anchor dots; `fontSize` option so demo labels stay at 11 CSS px or more at 390px; theme button names its target theme; `examples/build-demo.mjs` regenerates demo, example and cover byte for byte.
