# Layer 09 — Handoff

Coordinate cleanly with neighboring design and engineering skills without crossing boundaries.

1. **From `design-system`:** Consume existing `--color-*`, `--radius-*`, `--space-*`, and `--font-*` variables from `design/tokens.css` directly; never overwrite or regenerate token files.
2. **To `ui-craft`:** If the user wants the finished mechanism SVG embedded inside a larger product landing page, docs shell, sidebar, or bento grid, hand off the self-contained `<figure>` or React component cleanly to `ui-craft`.
3. **To `browser-check`:** For interactive verification of Play/Pause toggles, theme switching, and stage inspection in a live app, hand off the rendered URL/file path to `browser-check`.
4. **Boundary Handoffs (never absorb):**
   - Physical 3D isometric cutaway objects -> `figure-craft`
   - Full-page scroll choreography / GSAP ScrollTrigger / Lenis / WebGL backdrops -> `motion-craft`
   - UI polish on existing screens -> `ui-polish`
   - Standalone markup accessibility audits -> `a11y-audit`
