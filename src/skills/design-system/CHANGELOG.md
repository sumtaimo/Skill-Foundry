# Changelog

## 1.0.0 - 2026-11-15

- First version: one design-token set from a hex colour (path a), a style description (path b) or an existing design system (path c, gaps only, never overwriting), with rules R-design-system-1 to R-design-system-18.
- Engine `engine/tokens.mjs` (Node.js, no dependencies) builds the scales, roles and files, and checks every text pair in light and dark mode, so the numbers come from the skill, not from the agent.
- Five style archetypes as numbers (type sizes, radius, control heights, density, shadow, motion, brand share): precise-fintech, calm-workspace, bold-consumer, editorial, dense-data-tool.
- Writes design-tokens.json (W3C design tokens format), tokens.css (light, dark by system setting and by data-theme, density and reduced motion) and a report with every ratio.
- Exact sentences for nothing to build from, a brand colour named only in words, and a request to design a screen.
- Mid-tone brand colours (approved by the owner): when neither white nor the dark ink reaches 4.5:1 on the given hex (for example #0d9488), the filled primary button uses the nearest darker step of the same hue where white text reaches 4.5:1; black text on the given hex is used only when no darker step can carry white. The same applies to a given accent. The given hex stays unchanged at its step and as the new `--color-brand` token (`color.brand`), and the report shows both ratios (white on the given hex and white on the fill). Light colours such as a yellow keep their hex as the fill with dark text.
- Scales no longer turn bright in the middle: saturation eases toward the palest and darkest steps, and steps 400 to 700 are never more colourful (HSL chroma) than the input, so a teal like #0d9488 gives 400 #6bddd3 and 500 #4dc6bb instead of a bright cyan. The hue is kept exactly as before (same drift limits); R-design-system-1 now says this.
- New live eval case `midtone-teal` (11 cases).
