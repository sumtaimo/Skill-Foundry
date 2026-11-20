# Layer 05: Rules

Verify every rule below before accepting the design or code (all IDs match `RULES.json`):

1. **Stack & Portability (`R-ui-craft-1`)**: Detect the project's stack/tokens first; NEVER inject unrequested external libraries, icon packs or remote font CDNs when none exist in the project.
2. **Dual-Theme Glass & Surface Tokens (`R-ui-craft-2`)**: Define semantic light and dark surface variables (`--color-surface-default`, `--color-surface-raised`, `--color-surface-subtle`, `--glass-bg`, `--color-border-default`, `--color-border-strong`, `--color-text-default`, `--color-text-muted`, `--color-action-primary-bg`) and pair translucent glass surfaces (`backdrop-filter`) with contrast-safe fallbacks.
3. **Contrast Floor (`R-ui-craft-3`)**: Every normal text pair MUST achieve >= `4.5:1` and every large heading (>= 24 px or bold >= 19 px), border, and focus ring MUST achieve >= `3:1` in light and dark themes.
4. **Typography & Rhythm (`R-ui-craft-4`)**: Body text >= `16px` (`line-height: 1.5` for Latin, `max-width: 65ch` on prose), clean weight hierarchy (`400, 500, 600, 700`), negative heading letter-spacing (`-0.02em`, Latin only: never under `:lang(km)`), one Khmer body line-height of `1.6` (`var(--line-height-khmer)` when `design/` has it) with `letter-spacing: 0` under `:lang(km)`, and `tabular-nums` for numeric counters/shortcuts.
5. **Grid, Radii & Z-Index (`R-ui-craft-5`)**: Spacing on `4px` increments, nested radii (`--r-xs` .. `--r-xl`), `1px` hairlines, and explicit `--z-*` scale with exact names `--z-sticky`, `--z-dropdown`, `--z-command`, `--z-modal`, `--z-toast` (never shortened).
6. **Tactile Controls & Single Primary Action (`R-ui-craft-6`)**: Touch targets >= `44x44px`, restrained specular highlight/gradient depth, tactile hover/active feedback, and at most ONE primary filled CTA per view.
7. **Command-First Navigation (`R-ui-craft-7`)**: Multi-view/searchable UI includes `Ctrl+K` / `Cmd+K` dialog, `<kbd>` hints, arrow/Enter/Escape navigation.
8. **Adaptive Navigation & Zero Overflow (`R-ui-craft-8`)**: Sliding active indicator, responsive nav collapse (`< 768px`), and zero horizontal page overflow at `390px` and `1440px`.
9. **GPU Motion & Reduced-Motion (`R-ui-craft-9`)**: Animate `transform` / `opacity` only (`120ms`–`240ms`), disable spatial motion under `prefers-reduced-motion: reduce` while keeping clear active state feedback.
10. **Complete Lifecycle States (`R-ui-craft-10`)**: Cover default, hover, `:focus-visible`, active/selected, disabled, dimension-locked skeleton, empty search/filter with reset, and inline error with retry.
11. **Inline AI UX (`R-ui-craft-11`)**: Prompt input, quick-action chips, streaming/cancel controls, and undo/revert triggers for AI features.
12. **Tokenized SVG Accents (`R-ui-craft-12`)**: SVG colours use `currentColor` or `var(--...)` only, with `aria-hidden="true"` on decorative glyphs.
13. **Responsive & Script Legibility (`R-ui-craft-13`)**: No clipped titles or horizontal scroll across breakpoints; preserve script-safe metrics (Khmer body `line-height: 1.6`, one value, `letter-spacing: 0`).
14. **Semantic Accessibility (`R-ui-craft-14`)**: Native HTML controls and `>= 2px` high-contrast `:focus-visible` outlines preserved on every interactive element.
15. **Controller / Lead / Worker Adaptation (`R-ui-craft-15`)**: Full code for `DEV_ENGINEER`/standalone; modular CSS + `Markup Handoff Contract` when scoped to CSS-only `UX_DESIGNER`.
16. **Honest Content (`R-ui-craft-16`)**: Never fabricate metrics, testimonials or fake claims.
17. **Scope Boundaries (`R-ui-craft-17`)**: Redirect polish-only, token-building (`design-system`), WCAG-audit-only, copy-only, or isometric diagram requests cleanly.
18. **Visual Check (`R-ui-craft-18`)**: Verify `1440px` and `390px`, light and dark, reduced motion, zero console errors, zero overflow when browser tools exist.
19. **Foundation First (`R-ui-craft-19`)**: With `design/tokens.css`, read `design/STATUS.md`, `design/BRIEF.md`, `design/tokens.css` (and `design/components/*.md`) first; use only variables that exist there, component variables first; no raw hex, colour or radius where a variable holds it; never edit `design/` files.
20. **Cold-Start Gate (`R-ui-craft-20`)**: Whole product screen, no `design/tokens.css`, no other tokens, no "prototype / defaults" in the request -> ask the one fixed question of Layer 03 and stop; never invent a palette silently.
