# Layer 04: Flow

1. Choose the object: one concrete thing a reader can picture. For a real appliance, machine or device, draw that thing itself, not a metaphor. See [figures](../references/figures.md).
2. Draw the whole object as it stands in real life, outside first: a full body the reader recognises at a glance (lint `L13-no-solid-body`), with its door or cover, handle, feet and controls. Then show the working parts inside through `glass` or one open side, so each labelled part stays at least 40% visible (lint `L16-hidden-part`). Never reduce the object to thin walls and plates, and never show only the machinery.
3. Give every solid its real material and shape: `material` for the surface, `round: true` for round parts, `panel` for doors, displays and windows, `tone` for pipes and flows. The engine adds the light and the shadows. See [materials](../references/materials.md).
4. Name its parts: every part in the required parts list from layer 02, each a few words. Up to nine labels, because they appear one at a time on hover. Put each label's anchor (`at`) inside its part; the label appears there as a chip. See [copy](../references/copy.md).
5. Size the labelled parts: each covers at least 3% of the drawing (`L12-part-too-small`). A small real part (a compressor beside a cabinet) is drawn larger than to scale, and the report says so.
6. Give every labelled part its identifying details: fill in the parts table from [detail](../references/detail.md); a part needs one detail, plus one for every 8% of the drawing it covers, up to three, each a `line` or `dot` with `on: '<part id>'` and a `face`.
7. Lay the parts out: a base first, then parts with `rests: '<base id>'`, at least 4 apart, spanning at least 30% of the base. Every part above the ground rests on or touches another part (lint `L15-floating`). Keep the part the story ends at near the reader. See [layout](../references/layout.md).
8. Plan the one motion story: one labelled shape moves along one iso axis of the surface it rests on. Write what the still frame shows. See [motion](../references/motion.md).
9. Write the build script: import `box`, `panel`, `line`, `dot`, `renderSvg` from `engine/iso.mjs` and `tokensCss` from `engine/tokens.mjs`; list supports before what rests on them and farther shapes before nearer ones; call `renderSvg(shapes, { labels, requiredParts, title, fontSize })`. Labels are revealed on hover by default; do not pass `labelMode: 'always'` unless the user asks for a printed, static figure.
10. Run `lint(model)` from `engine/lint.mjs` in the same script and write the result to `lint-report.json`.
11. Fix the shapes and run again until there are no errors. Fix each warning, or write why it stays.
12. Build the page: `tokensCss()` in one `<style>`, the SVG inline, a caption, one card per labelled part with its name and what it does, the hint "Hover or tap a part to see its name.", a theme button. See [tokens](../references/tokens.md).

Hand to layer 07: the build script, the rendered files, the lint result.
