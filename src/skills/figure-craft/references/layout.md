# Layout

- MUST keep one reading column; the figure scales with `width:100%; height:auto`.
- MUST work at 390px wide with a 16px gutter and no horizontal scroll.
- MUST place labels in a left or right column (`side: 'l' | 'r'`), at least 13 apart (lint `L3-label-overlap`).
- MUST keep every shape and label inside the viewBox (lint `L5-outside-viewbox`); `renderSvg` sizes it for you.
- NEVER route a leader line across another solid (lint `L4-leader-crosses-solid`); move the label to the other side instead.
- Labels are hidden at rest and appear as a chip beside their part, with motion, when it is hovered, focused or tapped (`labelMode: 'hover'`, the default). No side columns are reserved, so the object fills the frame; `side` is ignored. Use `labelMode: 'always'` only for a static, printed figure.
- NEVER use more than nine labels on hover, or five when always shown (lint `L3-label-overlap`).
- MUST put each label's anchor (`at`) inside the part it names, so the engine can tie the label to the part.
- MUST name every labelled part in a card under the figure, so the page works without hover.
- MUST make every labelled part cover at least 1% of the drawing (lint `L12-part-too-small`) and aim for 3% so it reads on a phone; enlarge small real parts and say so in the report.
- MUST either join parts (touching, one structure) or leave at least 4 between parts on one base, and let the parts span at least 30% of the base (lint `L10-crowded`).
- MUST label the moving part (lint `L9-moving-unlabelled`).
- MUST keep labels readable at 390px: rendered label text at least 11 CSS px. Use the smallest `renderSvg(..., { fontSize })` for which `fontSize * availableWidth / viewBoxWidth >= 11`; a larger chip covers the drawing.
- Leaders are bare `<line class="leader">` strokes with no dot or marker at either end; the only circles in a figure are `dot()` shapes you placed.

Example:

```js
renderSvg(shapes, { labels: [
  { at: [17, 31, 20], text: 'Client', side: 'l' },
  { at: [70, 20, 40], text: 'Edge cache', side: 'r' },
] });
```
