# Layer 04: Flow

1. Choose the object: one concrete thing a reader can picture. For a real appliance, machine or device, draw that thing itself, not a metaphor. See [figures](../references/figures.md).
2. Name its parts: at most five labelled parts, each a few words, each a real part that matters to the idea. Decide the side column (`l` or `r`) of each label. See [copy](../references/copy.md).
3. Size the labelled parts: each covers at least 3% of the drawing (`L12-part-too-small`). A small real part (a compressor beside a cabinet) is drawn larger than to scale, and the report says so.
4. Give every labelled part its identifying details: fill in the parts table from [detail](../references/detail.md); a part needs one detail, plus one for every 8% of the drawing it covers, up to three, each a `line` or `dot` with `on: '<part id>'` and a `face`.
5. Lay the parts out: a base first, then parts with `rests: '<base id>'`, at least 4 apart, spanning at least 30% of the base. Keep the part the story ends at near the reader. See [layout](../references/layout.md).
6. Plan the one motion story: one labelled shape moves along one iso axis of the surface it rests on. Write what the still frame shows. See [motion](../references/motion.md).
7. Write the build script: import `box`, `line`, `dot`, `renderSvg` from `engine/iso.mjs` and `tokensCss` from `engine/tokens.mjs`; list supports before what rests on them and farther shapes before nearer ones; call `renderSvg(shapes, { labels, title, fontSize })`.
8. Run `lint(model)` from `engine/lint.mjs` in the same script and write the result to `lint-report.json`.
9. Fix the shapes and run again until there are no errors. Fix each warning, or write why it stays.
10. Build the page: `tokensCss()` in one `<style>`, the SVG inline, a caption, label/value cards for the facts, a theme button. See [tokens](../references/tokens.md).

Hand to layer 07: the build script, the rendered files, the lint result.
