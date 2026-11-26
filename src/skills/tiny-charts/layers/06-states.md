# Layer 06 — States and Edge Cases

Ensure every interactive, visual, and accessibility state works cleanly.

1. **Initial & terminal states:** Highlight `initialState` on load, disable invalid event buttons for the current state, and allow `Reset` (or `Step` at a terminal state) to restart cleanly.
2. **Logic drawer closed & open:** Keep `#tc-logic-drawer` hidden by default (`aria-expanded="false"`); when opened, display active rules highlighted for the current state/transition and keep the Logic Flowchart synced live.
3. **Light & Dark themes:** Respect system `prefers-color-scheme: dark` automatically while allowing manual override via `[data-theme="dark"]` / `[data-theme="light"]` with readable contrast on all text, borders, and active highlights.
4. **Reduced motion:** Under `@media (prefers-reduced-motion: reduce)`, keep state changes immediate and clear without distracting continuous motion.
5. **Narrow mobile (`390px`) & desktop (`1440px`):** Wrap control buttons cleanly and scale `<svg>` via `viewBox` + `width="100%"` so `scrollWidth <= clientWidth` at both widths.
6. **Non-Latin / Khmer labels:** When labels include Khmer script, set `letter-spacing: 0` and provide generous vertical node height so subscripts never clip.
