# Layer 04 — Flow

Design the 2D geometry, coordinate budget, and motion choreography before writing markup.

1. Pick a clean integer `viewBox` (typical defaults: `0 0 920 420` for horizontal pipelines, `0 0 840 500` for handshakes or branched flows) and reserve a `>= 24px` outer safe margin on all four sides (`x` in `[24, W-24]`, `y` in `[24, H-24]`).
2. Place nodes on an explicit `8px` coordinate grid with generous horizontal gaps (`>= 64px` between boxes for arrows and directional badges) and clear vertical lanes for main flow vs. retry/fallback branches.
3. Route tracks (`<path>`) with crisp orthogonal segments or gentle rounded corners (`Q` curves) that terminate cleanly at node edges (`refX` tuned on `<marker>`) and NEVER pass underneath `<text>` labels.
4. Structure the `<svg>` into six explicit blocks in exact paint order:
   1. `<title>` and `<desc>` (linked via `aria-labelledby`)
   2. `<defs>` (token-bound `<linearGradient>`, `<radialGradient>`, `<pattern>`, `<marker>` arrowheads, subtle highlight `<filter>` if needed)
   3. `<g class="layer-backdrop">` (surface card + subtle grid pattern)
   4. `<g class="layer-tracks">` (static base tracks with directional markers)
   5. `<g class="layer-signals">` (animated dashed streams or glowing pulses traveling along tracks)
   6. `<g class="layer-nodes">` and `<g class="layer-labels">` (crisp component boxes, badges, and centered/aligned `<text>` labels)
5. Plan the motion rhythm: staggered cycle durations (`2.2s`–`3.6s`) so packets travel sequentially from stage 1 -> stage 2 -> stage N rather than flashing chaotically all at once.
6. Wire the control bar outside the `<svg>` (inside the semantic `<figure>` wrapper): Play/Pause button (`aria-pressed`), optional stage selector buttons or keyboard focusable `<g tabindex="0" role="button">` nodes, and an `aria-live="polite"` status line.
