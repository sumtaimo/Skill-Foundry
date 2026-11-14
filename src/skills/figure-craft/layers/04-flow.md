# Layer 04: Flow

1. Choose the object: one concrete thing a reader can picture. For a real appliance, machine or device, draw that thing itself, not a metaphor. See [figures](../references/figures.md).
2. Draw the object as full solid volumes: a body the reader recognises at a glance (lint `L13-no-solid-body`). Show inside parts by opening one side or lifting a cover, not by reducing the object to thin walls and plates.
3. Name its parts: every part in the required parts list from layer 02, each a few words. Up to nine labels, because they appear one at a time on hover. Decide the side column (`l` or `r`) of each label, and put each label's anchor inside its part. See [copy](../references/copy.md).
4. Size the labelled parts: each covers at least 3% of the drawing (`L12-part-too-small`). A small real part (a compressor beside a cabinet) is drawn larger than to scale, and the report says so.
5. Give every labelled part its identifying details: fill in the parts table from [detail](../references/detail.md); a part needs one detail, plus one for every 8% of the drawing it covers, up to three, each a `line` or `dot` with `on: '<part id>'` and a `face`.
6. Lay the parts out: a base first, then parts with `rests: '<base id>'`, at least 4 apart, spanning at least 30% of the base. Every part above the ground rests on or touches another part (lint `L15-floating`). Keep the part the story ends at near the reader. See [layout](../references/layout.md).
7. Plan the one motion story: one labelled shape moves along one iso axis of the surface it rests on. Write what the still frame shows. See [motion](../references/motion.md).
8. Write the build script: import `box`, `line`, `dot`, `renderSvg` from `engine/iso.mjs` and `tokensCss` from `engine/tokens.mjs`; list supports before what rests on them and farther shapes before nearer ones; call `renderSvg(shapes, { labels, requiredParts, title, fontSize })`. Labels are revealed on hover by default; do not pass `labelMode: 'always'` unless the user asks for a printed, static figure.
9. Run `lint(model)` from `engine/lint.mjs` in the same script and write the result to `lint-report.json`.
10. Fix the shapes and run again until there are no errors. Fix each warning, or write why it stays.
11. Build the page: `tokensCss()` in one `<style>`, the SVG inline, a caption, one card per labelled part with its name and what it does, the hint "Hover or tap a part to see its name.", a theme button. See [tokens](../references/tokens.md).

Hand to layer 07: the build script, the rendered files, the lint result.
