# Changelog

## 1.0.0 - 2026-11-15

- First version: one design-token set from a hex colour (path a), a style description (path b) or an existing design system (path c, gaps only, never overwriting), with rules R-design-system-1 to R-design-system-18.
- Engine `engine/tokens.mjs` (Node.js, no dependencies) builds the scales, roles and files, and checks every text pair in light and dark mode, so the numbers come from the skill, not from the agent.
- Five style archetypes as numbers (type sizes, radius, control heights, density, shadow, motion, brand share): precise-fintech, calm-workspace, bold-consumer, editorial, dense-data-tool.
- Writes design-tokens.json (W3C design tokens format), tokens.css (light, dark by system setting and by data-theme, density and reduced motion) and a report with every ratio.
- Exact sentences for nothing to build from, a brand colour named only in words, and a request to design a screen.
