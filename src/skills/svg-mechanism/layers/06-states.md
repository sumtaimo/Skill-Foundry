# Layer 06 — States and Edge Cases

Every mechanism SVG must stay clear and usable across all viewing states.

1. **Playing (default):** Signal streams flow smoothly along primary tracks (and gently pulse on secondary/retry paths); Play/Pause button shows `aria-pressed="false"` with clear action label (`Pause`).
2. **Paused (user-toggled):** Container gets `data-paused="true"`, button shows `aria-pressed="true"` (`Play`), every animated dash/pulse stops in place without disappearing, and static directional arrows remain crisp.
3. **Reduced Motion (`prefers-reduced-motion: reduce`):** Continuous flow animations are disabled automatically on load; if JS initializes state, reflect the static state cleanly while keeping directional arrows, step numbers (`1`, `2`, `3`), and branch legend fully legible.
4. **Stage Focus / Inspection:** Hovering or focusing a stage button or node (`:focus-visible` ring >= `2px`) highlights the active node and its outgoing track while keeping non-active nodes readable (`opacity >= 0.55`, never invisible) and updates the `aria-live="polite"` status caption.
5. **Light and Dark Themes:** Switching `data-theme="dark"` or OS `prefers-color-scheme: dark` updates backdrop, grid dots, node gradients, strokes, markers, and `<text>` fills automatically because every SVG color is driven by CSS custom properties.
6. **Narrow Mobile (`390px`) & Zoom:** The `<svg>` scales proportionally via `viewBox` (`width="100%"`, `height="auto"`), control buttons wrap cleanly (`flex-wrap: wrap`, >= `44x44px` hit targets), and the page maintains `0px` horizontal overflow.
7. **Khmer & Long Labels:** Split long titles across two short `<tspan>` lines rather than shrinking font size below `12px` or letting text collide with box borders; keep `letter-spacing: 0` on Khmer strings.
8. **Missing Tokens Fallback:** When an external host page does not load `design/tokens.css`, internal `var(--color-..., <safe-fallback>)` defaults ensure the SVG still renders with high contrast in both light and dark modes.
