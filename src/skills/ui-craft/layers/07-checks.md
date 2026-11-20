# Layer 07: Checks

Run machine checks first whenever Node.js or a browser runner is available, then review every human checklist item:

1. **CSS & Token Completeness Check**: Confirm `:root`, `[data-theme="dark"]`, `@media (prefers-color-scheme: dark)`, `--z-*` tokens, `1px` hairline borders, `44px` minimum interactive targets, and `@media (prefers-reduced-motion: reduce)` exist in the output CSS.
2. **Contrast Ratio Check**: Verify normal text >= `4.5:1`, muted text >= `4.5:1`, large display text >= `3:1`, and borders/focus outlines >= `3:1` against both light and dark surface tokens (especially inside `--glass-bg` translucent headers over scrolling content).
3. **Browser Visual & Overflow Check (when Playwright or a browser runner exists)**:
   - Render at `1440x900` and `390x844` in both `light` and `dark` color schemes with `reducedMotion: true`.
   - Assert zero `console.error` / uncaught `pageerror`, zero sideways overflow (`document.documentElement.scrollWidth <= document.documentElement.clientWidth`), and all `<svg>` `<text>` inside `viewBox`.
4. **Keyboard & Interactive State Review**:
   - Confirm Tab order reaches all nav links, `⌘K` button, dialog results, and AI bar actions with visible `:focus-visible` ring.
   - Confirm interactive DOM/CSS handles default, hover, active, disabled, loading skeleton, empty search/filter reset, and inline error retry states.
5. **Foundation Check**: with `design/tokens.css`, every `var(--...)` in the output exists in it (or in the declared additive block), and no raw hex, rgb() colour or radius px value sits where a variable holds it.
6. **Reviewer Checklist (all must be YES)**:
   - Does the output match the detected stack without adding unrequested external libraries or font CDNs?
   - Is there at most ONE filled primary action per view?
   - Do decorative SVGs carry `aria-hidden="true"` and use `currentColor` / `var(--...)` only?
   - Did CSS-only role output include a complete `Markup Handoff Contract`?
   - Did the output keep placeholder data honest (no fabricated customer quotes/stats)?
