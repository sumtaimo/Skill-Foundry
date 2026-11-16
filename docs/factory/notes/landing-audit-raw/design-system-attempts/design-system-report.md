## Design system: Skill Foundry showcase site

Path c, filling the gaps of your existing design system. Archetype: calm-workspace. No style words or product type were given, so the default calm-workspace is used.

This report is the whole reply: the files written, the checks run with every result, and the open questions.

### Files
- design-tokens.gaps.json: W3C design tokens, missing groups only
- tokens.gaps.css: CSS custom properties, missing groups only
- design-system-report.md: this report

### Colours kept
| Input | Hex | Hue | Placed at |
|-------|-----|-----|-----------|
| primary | #2f7a4b | 142° | primary-700 |

Status colours not given, defaults used: success #16a34a (success-700), warning #d97706 (warning-600), danger #dc2626 (danger-500), info #2563eb (info-500).

Hue check: each input hex is unchanged and every step aims at its exact hue; lightness follows the fixed steps and saturation eases toward the palest and darkest steps, and steps 400 to 700 are never more colourful than your colour. Rounding to hex moves the hue at most 0.1° at steps 300 to 800 and 0.3° at the palest and darkest steps.

### Contrast
Text needs 4.5:1; borders of controls and focus rings need 3:1; border-default is for dividers and is not checked. Pairs of your own tokens below 4.5:1 are marked "yours, kept": this skill never changes your tokens.

| Text | On | Light | Dark | Needs | Result |
|------|----|-------|------|-------|--------|
| --fg | --bg | 16.03:1 | none | 4.5:1 | pass |
| --fg | --surface | 16.88:1 | none | 4.5:1 | pass |
| --fg | --bg | 1.09:1 (yours, kept) | none | 4.5:1 | FAIL |
| --fg | --surface | 1.02:1 (yours, kept) | none | 4.5:1 | FAIL |
| --fg | --bg | 1.13:1 (yours, kept) | none | 4.5:1 | FAIL |
| --fg | --surface | 1.19:1 (yours, kept) | none | 4.5:1 | FAIL |
| --fg | --bg | 15.45:1 | none | 4.5:1 | pass |
| --fg | --surface | 14.45:1 | none | 4.5:1 | pass |

### Kept from your system
- 36 tokens in site.css, unchanged. Groups found: color-roles, radius, spacing, motion, dark-mode.

### Added
- Groups added: color-primary, color-neutral, color-status, typography, control, shadow, border-width, breakpoint, density.

### Existing pairs below the minimum (kept, not changed)
- --fg on --bg: #1d1d1b on #141413, 1.09:1; needs 4.5:1.
- --fg on --surface: #1d1d1b on #1b1b1a, 1.02:1; needs 4.5:1.
- --fg on --bg: #ecebe7 on #f9f9f8, 1.13:1; needs 4.5:1.
- --fg on --surface: #ecebe7 on #ffffff, 1.19:1; needs 4.5:1.

### How to use
- Load tokens.gaps.css after your existing token files and before your own styles; it only adds tokens and dark values.
- Without a data-theme attribute the page follows the system setting; set data-theme="light" or data-theme="dark" on the html element to force one.
- Spacing: 0, 4, 8, 12, 16, 24, 32, 48, 64 px. Type sizes: 12, 14, 16, 20, 24, 30, 36 px, body 16 px, line-height 1.5. Weights: 400 and 600.
- Controls: 36, 44, 52 px high; every click or tap area at least 44 px. Breakpoints: 640, 768, 1024, 1280 px (copy the numbers into media queries).
- Brand colour on at most 5% of a screen: primary action, focus ring, selected item background.
- Font: the system font stack. No font files, imports or links.

### Open questions
- Your primary colour is close to the success colour (#16a34a); should success use a different hue?
