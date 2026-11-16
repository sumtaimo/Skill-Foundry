## Design system: Your product

Path c, filling the gaps of your existing design system. Archetype: calm-workspace. No style words or product type were given, so calm-workspace is the default.

This report is the whole reply: the files written, the checks run with every result, and the open questions.

### Files
- design-tokens.gaps.json: W3C design tokens, missing groups only
- tokens.gaps.css: CSS custom properties, missing groups only
- design-system-report.md: this report

### Colours kept
| Input | Hex | Hue | Placed at |
|-------|-----|-----|-----------|
| primary | #0d9488 | 175° | primary-700 |

Status colours not given, defaults used: success #16a34a (success-700), warning #d97706 (warning-600), danger #dc2626 (danger-500), info #2563eb (info-500).

Primary button: white text on your #0d9488 is 3.74:1 (below 4.5:1), so the fill uses primary-800 #0b7067, the nearest darker step of the same hue, where white text is 5.95:1. Your #0d9488 stays unchanged at primary-700 and as --color-brand.

Neutral scale: built from your own greys, kept at their value: #f5f7fa (--paper) at neutral-50, #cbd2d9 (--line) at neutral-200, #1f2933 (--ink) at neutral-900. The other steps are interpolated between them (100, 300, 400, 500, 600, 700, 800); the palest and darkest steps come from a tint of your greys' hue. Every pair below is checked on this scale.

Hue check: each input hex is unchanged and every step aims at its exact hue; lightness follows the fixed steps and saturation eases toward the palest and darkest steps, and steps 400 to 700 are never more colourful than your colour. Rounding to hex moves the hue at most 0.1° at steps 300 to 800 and 0.3° at the palest and darkest steps.

### Contrast
Text needs 4.5:1; borders of controls and focus rings need 3:1; border-default is for dividers and is not checked. Every text role meets 4.5:1, so it is safe at any size.

| Text | On | Light | Dark | Needs | Result |
|------|----|-------|------|-------|--------|
| text-default | all 4 surfaces | 12.32:1 | 10.00:1 | 4.5:1 | pass |
| text-muted | all 4 surfaces | 6.14:1 | 5.46:1 | 4.5:1 | pass |
| text-link | all 4 surfaces | 4.97:1 | 6.60:1 | 4.5:1 | pass |
| selected-text | all 4 surfaces, selected-bg | 4.97:1 | 6.60:1 | 4.5:1 | pass |
| text-inverse | surface-inverse | 13.75:1 | 13.75:1 | 4.5:1 | pass |
| action-primary-text | action-primary-bg, action-primary-bg-hover, action-primary-bg-pressed | 5.95:1 | 5.95:1 | 4.5:1 | pass |
| success-text | surface-default, success-bg-subtle | 6.50:1 | 7.36:1 | 4.5:1 | pass |
| success-text-on | success-bg | 6.37:1 | 6.37:1 | 4.5:1 | pass |
| warning-text | surface-default, warning-bg-subtle | 7.89:1 | 6.77:1 | 4.5:1 | pass |
| warning-text-on | warning-bg | 4.63:1 | 4.63:1 | 4.5:1 | pass |
| danger-text | surface-default, danger-bg-subtle | 5.59:1 | 7.18:1 | 4.5:1 | pass |
| danger-text-on | danger-bg | 4.83:1 | 4.83:1 | 4.5:1 | pass |
| info-text | surface-default, info-bg-subtle | 6.65:1 | 7.50:1 | 4.5:1 | pass |
| info-text-on | info-bg | 5.17:1 | 5.17:1 | 4.5:1 | pass |
| border-strong | surface-default, surface-subtle | 3.50:1 | 5.50:1 | 3:1 | pass |
| border-focus | surface-default, surface-subtle | 3.49:1 | 9.07:1 | 3:1 | pass |

Light and Dark give the lowest ratio of each role over the surfaces listed; 37 pairs checked in each mode.

### Kept from your system
- 5 tokens in existing-tokens.css, unchanged. Groups found: none.
- A family counts as present when 3 or more of your tokens match it; with fewer it is partly present and its missing tokens are added.

### Added
- Groups added: color-primary, color-neutral, color-status, color-roles, dark-mode, typography, spacing, control, radius, shadow, border-width, motion, breakpoint, density.
- spacing is only partly present (--gutter): added --space-0, --space-4, --space-8, --space-12, --space-16, --space-24, and 3 more; your tokens are untouched.
- color-primary is only partly present (--brand): added --color-brand, --color-primary-50, --color-primary-100, --color-primary-200, --color-primary-300, --color-primary-400, and 5 more; your tokens are untouched.

### Existing pairs below the minimum (kept, not changed)
- None.

### How to use
- Load tokens.gaps.css after your existing token files and before your own styles; it only adds tokens and dark values.
- Without a data-theme attribute the page follows the system setting; set data-theme="light" or data-theme="dark" on the html element to force one.
- Spacing: 0, 4, 8, 12, 16, 24, 32, 48, 64 px. Type sizes: 12, 14, 16, 20, 24, 30, 36 px, body 16 px, line-height 1.5. Weights: 400 and 600.
- Controls: 36, 44, 52 px high; every click or tap area at least 44 px. Breakpoints: 640, 768, 1024, 1280 px (copy the numbers into media queries).
- Brand colour on at most 5% of a screen: primary action, focus ring, selected item background.
- Font: the system font stack. No font files, imports or links.

### Open questions
- Hover and pressed share primary-900, because the filled button sits near the end of its scale; give pressed its own colour if they must differ.
