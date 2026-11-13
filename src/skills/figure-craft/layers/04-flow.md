# Layer 04: Flow

1. Choose the object: one concrete thing a reader can picture. For a real appliance, machine or device, draw that thing itself, not a metaphor. See [figures](../references/figures.md).
2. Name its parts: at most five labelled parts, each a few words, each a real part that matters to the idea. Decide the side column (`l` or `r`) of each label. See [copy](../references/copy.md).
3. Give every labelled part its identifying details: fill in the parts table from [detail](../references/detail.md), with one to three details per part, each a `line` or `dot` with `on: '<part id>'` and a `face`.
4. Lay the parts out: a base first, then parts with `rests: '<base id>'`, at least 4 apart, spanning at least 30% of the base. Keep the part the story ends at near the reader. See [layout](../references/layout.md).
5. Plan the one motion story: one labelled shape moves along one iso axis of the surface it rests on. Write what the still frame shows. See [motion](../references/motion.md).
6. Write the build script: import `box`, `line`, `dot`, `renderSvg` from `engine/iso.mjs` and `tokensCss` from `engine/tokens.mjs`; list supports before what rests on them and farther shapes before nearer ones; call `renderSvg(shapes, { labels, title, fontSize })`.
7. Run `lint(model)` from `engine/lint.mjs` in the same script and write the result to `lint-report.json`.
8. Fix the shapes and run again until there are no errors. Fix each warning, or write why it stays.
9. Build the page: `tokensCss()` in one `<style>`, the SVG inline, a caption, label/value cards for the facts, a theme button. See [tokens](../references/tokens.md).

Hand to layer 07: the build script, the rendered files, the lint result.
