## Design system: Note-taking app

Path b, from your description of the style. Archetype: calm-workspace. You asked for a quiet note-taking app that feels calm, soft and friendly.

This report is the whole reply: the files written, the checks run with every result, and the open questions.

### Files
- design-tokens.json: W3C design tokens
- tokens.css: CSS custom properties, light and dark
- design-system-report.md: this report

### Colours kept
| Input | Hex | Hue | Placed at |
|-------|-----|-----|-----------|
| primary (archetype default) | #0f766e | 175° | primary-800 |

Status colours not given, defaults used: success #16a34a (success-700), warning #d97706 (warning-600), danger #dc2626 (danger-500), info #2563eb (info-500).

Hue check: each input hex is unchanged and every step aims at its exact hue; lightness follows the fixed steps and saturation eases toward the palest and darkest steps, and steps 400 to 700 are never more colourful than your colour. Rounding to hex moves the hue at most 0.2° at steps 300 to 800 and 0.3° at the palest and darkest steps.

### Contrast
Text needs 4.5:1; borders of controls and focus rings need 3:1; border-default is for dividers and is not checked. Every text role meets 4.5:1, so it is safe at any size.

| Text | On | Light | Dark | Needs | Result |
|------|----|-------|------|-------|--------|
| text-default | all 4 surfaces | 12.70:1 | 9.57:1 | 4.5:1 | pass |
| text-muted | all 4 surfaces | 5.99:1 | 5.84:1 | 4.5:1 | pass |
| text-link | all 4 surfaces | 4.78:1 | 5.63:1 | 4.5:1 | pass |
| selected-text | all 4 surfaces, selected-bg | 4.78:1 | 5.63:1 | 4.5:1 | pass |
| text-inverse | surface-inverse | 13.55:1 | 13.55:1 | 4.5:1 | pass |
| action-primary-text | action-primary-bg, action-primary-bg-hover, action-primary-bg-pressed | 5.47:1 | 5.47:1 | 4.5:1 | pass |
| success-text | surface-default, success-bg-subtle | 6.50:1 | 7.36:1 | 4.5:1 | pass |
| success-text-on | success-bg | 6.37:1 | 6.37:1 | 4.5:1 | pass |
| warning-text | surface-default, warning-bg-subtle | 7.89:1 | 6.77:1 | 4.5:1 | pass |
| warning-text-on | warning-bg | 4.57:1 | 4.57:1 | 4.5:1 | pass |
| danger-text | surface-default, danger-bg-subtle | 5.59:1 | 10.36:1 | 4.5:1 | pass |
| danger-text-on | danger-bg | 4.83:1 | 4.83:1 | 4.5:1 | pass |
| info-text | surface-default, info-bg-subtle | 6.65:1 | 7.50:1 | 4.5:1 | pass |
| info-text-on | info-bg | 5.17:1 | 5.17:1 | 4.5:1 | pass |
| border-strong | surface-default, surface-subtle | 4.53:1 | 4.29:1 | 3:1 | pass |
| border-focus | surface-default, surface-subtle | 5.10:1 | 7.98:1 | 3:1 | pass |

Light and Dark give the lowest ratio of each role over the surfaces listed; 37 pairs checked in each mode.

### How to use
- Load tokens.css before your own styles. 
- Without a data-theme attribute the page follows the system setting; set data-theme="light" or data-theme="dark" on the html element to force one.
- Spacing: 0, 4, 8, 12, 16, 24, 32, 48, 64 px. Type sizes: 12, 14, 16, 20, 24, 30, 36 px, body 16 px, line-height 1.5. Weights: 400 and 600.
- Controls: 36, 44, 52 px high; every click or tap area at least 44 px. Breakpoints: 640, 768, 1024, 1280 px (copy the numbers into media queries).
- Brand colour on at most 5% of a screen: primary action, focus ring, selected item background.
- Font: the system font stack. No font files, imports or links.

### Open questions
- Hover and pressed share primary-900, because the filled button sits near the end of its scale; give pressed its own colour if they must differ.
- No brand colour was given, so the archetype default #0f766e is the primary; send a hex to rebuild the scale around your own colour.
