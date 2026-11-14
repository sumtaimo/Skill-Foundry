# Changelog

## 1.0.0 - 2026-11-14

The version stays 1.0.0 until the owner calls it final. Changes are listed here as they land.

- Engine: isometric solids with materials (`steel`, `white`, `dark`, `glass`, `plain`, `ink`, `blue`, `red`, `green`, `amber`), upright and lying cylinders, panels, discs, lines with pipe tones, lamp glow.
- Style: near-white palette, one hairline outline weight, one light direction, soft cast shadows; the SVG carries its own tokens.
- Rounded upright edges (`r`). Open bodies (`open: 'x' | 'y' | 'xy'`, back sides `'-x'`, `'-y'`) with contents (`inside`); states (`when`) such as doors open and closed.
- Orbit: four views a quarter turn apart with turn buttons, drag and arrow keys; back-side details (`face: '-x'`, `'-y'`).
- Labels: chips that appear on hover, focus or tap; no space reserved for them.
- Solids read as solid: clearer difference between lit and shaded sides, contact shadows, firmer outlines. Moving parts have a hit area along their path.
- Cutaways read as solid hollows: the cut through the walls is a section band, the inside is lined like the body and shaded.
- Top edges carry a rim highlight; views fade into each other. Parts sit where they really are, with the source recorded.
- Kit: `slots`, `screws`, `repeat` for micro detail in one call.
- Lint L1 to L19, `lintViews` and `lintStates`.
- Ten layer files; self-contained; starts from the goal the user states.
- Reference figure: one refrigerator, drawn whole, that opens, turns and shows its food (`examples/build-demo.mjs`).
- Round bodies: an upright cylinder can be cut open (`open` removes a quarter of the wall per face, the cut is drawn as a section band, the inside is lined and shaded, contents are clipped to the opening) and can have an open top (`mouth`). Lids sit on the mouth and lift clear (`lid` in the kit); details wrap round the wall (`face: 'wrap'`, `ring`, `band`, `studs`, `topRing`).
- Outside parts: `attach`, `handle`, `spout` in the kit; lint `L20-attach-outside` (touching, outside the body and its opening, on a side with wall, drawn on the correct side, in every view); `sortShapes` orders attached parts and contents correctly from every side.
- Rounded top edges: a lit ring and a lit strip under the rim on boxes and cylinders (`edge`); round parts cast round shadows and a lifted part casts none; cylinders outline as cylinders.
- Orbit: dragging scrubs between the four true views by cross-fade; continuous rotation is not offered and `references/orbit.md` says exactly why.
- Fullness: lint `L19-sparse` now needs 40 face details, four per labelled part, one and a half per solid and 120 elements, and rejects copied details, so a real object always reaches a high detail level; the reference refrigerator is unchanged at 0 errors and 0 warnings.
- Page: `cardsHtml` and `lintCards` (`engine/page.mjs`) put what each part does, where it sits and the source of that fact in the cards (R-figure-craft-31, `R31-card-location`).
- Layers: output goes to the current working folder with its path named; the browser check is optional and the report says honestly when it was not run; the report names the engine functions used; page-only checklist items are marked.
