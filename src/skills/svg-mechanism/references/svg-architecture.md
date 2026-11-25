# 2D SVG Architecture & Safe Geometry

## 1. Safe `viewBox` & Responsive Wrapper

Always give `<svg>` an explicit integer `viewBox` with `width="100%"`, `height="auto"`, and `preserveAspectRatio="xMidYMid meet"`. Keep every node, badge, and `<text>` anchor at least `24px` inside the `viewBox` boundary so nothing clips on `390px` mobile or `1440px` desktop.

Recommended coordinate canvases:
- **Linear / Branched Pipeline (3–5 stages):** `viewBox="0 0 920 400"` (safe inner box: `x: 24..896`, `y: 24..376`)
- **Protocol Handshake / Two-Column Exchange:** `viewBox="0 0 840 480"` (safe inner box: `x: 24..816`, `y: 24..456`)
- **Layered Stack / Cache Hierarchy:** `viewBox="0 0 860 440"` (safe inner box: `x: 24..836`, `y: 24..416`)

## 2. Exact Paint Order (6 Structural Blocks)

```xml
<svg class="mech-svg" viewBox="0 0 920 400" width="100%" preserveAspectRatio="xMidYMid meet"
     role="img" aria-labelledby="mech-title mech-desc">
  <title id="mech-title">Webhook Delivery Pipeline</title>
  <desc id="mech-desc">Events flow from Producer to Queue to Worker; failed deliveries route to Retry DLQ.</desc>

  <defs>
    <linearGradient id="mech-node-fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--mech-node-top)" />
      <stop offset="100%" stop-color="var(--mech-node-bottom)" />
    </linearGradient>
    <linearGradient id="mech-signal-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="var(--mech-accent)" stop-opacity="0.25" />
      <stop offset="100%" stop-color="var(--mech-accent)" stop-opacity="1" />
    </linearGradient>
    <pattern id="mech-grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="var(--mech-grid-dot)" />
    </pattern>
    <marker id="mech-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 1 2 L 8 5 L 1 8 Z" fill="var(--mech-accent)" />
    </marker>
    <marker id="mech-arrow-warn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 1 2 L 8 5 L 1 8 Z" fill="var(--mech-warn)" />
    </marker>
  </defs>

  <g class="layer-backdrop">
    <rect x="0" y="0" width="920" height="400" rx="16" fill="var(--mech-canvas)" />
    <rect x="0" y="0" width="920" height="400" rx="16" fill="url(#mech-grid)" />
  </g>

  <g class="layer-tracks" fill="none">...</g>
  <g class="layer-signals" fill="none">...</g>
  <g class="layer-nodes">...</g>
  <g class="layer-labels">...</g>
</svg>
```

## 3. Clean Labels & Khmer Typography

- Use `text-anchor="middle"` for centered node headings and `>= 13px` titles / `>= 12px` subtitles.
- Keep `>= 14px` horizontal padding inside node boxes (`rect.width >= estimatedTextWidth + 28`).
- Put edge labels inside small pill `<rect>` badges or `>= 12px` clear of the track line so paths never strike through characters.
- For **Khmer labels**:
  - Set `letter-spacing: 0` on Khmer `<text>` elements (negative tracking breaks coeng/subscripts).
  - Increase node height to at least `96px` and separate lines by `dy="22"` so stacked Khmer vowels and subscripts stay crisp and unclipped.
