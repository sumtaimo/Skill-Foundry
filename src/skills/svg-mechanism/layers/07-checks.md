# Layer 07 — Checks

Verify the SVG mechanically and visually before reporting completion.

1. **Static SVG Mechanism Lint (`M1`–`M8`):** When Node.js is available, run `node engine/lint-svg.mjs <path-to-file>` (or inspect manually against the exact same 8 checks when Node is unavailable):
   - `M1`: Valid 4-number `viewBox="x y w h"` with `w > 0`, `h > 0`, `width="100%"`, and `preserveAspectRatio`.
   - `M2`: `<defs>` contains at least one gradient (`linearGradient`/`radialGradient`) or directional `<marker>`.
   - `M3`: `<svg>` has `role="img"`, `aria-labelledby`, `<title>`, and `<desc>`.
   - `M4`: Play/Pause `<button>` with `aria-pressed` and `data-paused` / `animation-play-state: paused` wiring.
   - `M5`: `@media (prefers-reduced-motion: reduce)` rule disabling continuous motion.
   - `M6`: Zero raw `#hex` or `rgb(...)` literals inside SVG element `fill`, `stroke`, or `stop-color` attributes.
   - `M7`: All `<text>` anchor coordinates stay inside the `viewBox` safe margin (`>= 24px` inset from edges) so labels cannot clip.
   - `M8`: Both light (`:root`) and dark (`[data-theme="dark"]` / `@media (prefers-color-scheme: dark)`) CSS token definitions present.
2. **Coordinate & Overlap Audit:** Confirm no `<path>` crosses directly through `<text>`, no label exceeds its node rectangle width, and every arrowhead touches its target node cleanly.
3. **Browser Visual Check (when Playwright/browser is available):** Render at `1440px` and `390px` in light, dark, and `prefers-reduced-motion: reduce` modes; verify `scrollWidth <= clientWidth`, zero console/page errors, and zero clipped SVG bounding boxes.
4. **Honesty Check:** Never claim `M1`–`M8` or browser checks passed unless you actually ran them; if running read-only without execution tools, mark browser/CLI checks as `not run (read-only)`.
