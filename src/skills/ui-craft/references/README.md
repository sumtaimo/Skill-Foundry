# UI Craft References

Use these modules to assemble modern 2026 interfaces without repeating boilerplate across projects:

- [Surfaces, Glass, Gradients, Typography & Z-Index](surfaces-and-tokens.md): semantic light/dark tokens, frosted glass headers, specular top-edge button highlights, ambient dot/glow textures, fluid typography, and `z-index` layering.
- [Navigation, Command Palettes & Lifecycle States](navigation-and-states.md): floating glass navbar, sliding active pill indicator, collapsible sidebar icon-rail, `⌘K` command dialog, mobile drawers, and complete default/hover/focus/disabled/skeleton/empty/error UI templates.
- [Motion Physics & Inline AI Bars](motion-and-ai.md): GPU-only `transform`/`opacity` micro-interactions, CSS `linear()` springs, `prefers-reduced-motion: reduce` state fallbacks, and compact AI prompt/chip/stream/undo bars.

## Role Collaboration (`controller -> lead -> workers`)

| Executing Role | Output Mode | What You Write |
|---|---|---|
| Standalone / `DEV_ENGINEER` | Full component (`vanilla`, `tailwind`, or `react`) | Semantic markup + CSS/Tailwind + progressive keyboard/state JS/TS |
| CSS-only `UX_DESIGNER` | `css-handoff` | Complete `.css` stylesheet (tokens, glass, grid, states, reduced-motion) + exact `Markup Handoff Contract` (`selector`, `role/aria-*`, `data-state`, DOM outline) |

## Neighbor Skill Boundaries

| Need | Skill |
|---|---|
| Pixel cleanup on existing pasted UI without redesign | `ui-polish` |
| Standalone `tokens.css` & `design-tokens.json` generator | `design-system` |
| Markup-only WCAG audit (`aria-*`, landmarks, `lang`) | `a11y-audit` |
| Flow/usability review without code changes | `ux-review` |
| Shorten button/toast microcopy only | `copy-tight` |
| Isometric technical hardware SVG object | `figure-craft` |
