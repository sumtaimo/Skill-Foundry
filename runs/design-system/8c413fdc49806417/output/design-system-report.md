## Design system: Kids learning app

Path a, from your colour. Archetype: bold-consumer. Your words fun and energetic, and a learning app for kids, call for bold, playful tokens.

This report is the whole reply: the files written, the checks run with every result, and the open questions.

### Files
- design-tokens.json: W3C design tokens
- tokens.css: CSS custom properties, light and dark
- design-system-report.md: this report

### Colours kept
| Input | Hex | Hue | Placed at |
|-------|-----|-----|-----------|
| primary | #7c3aed | 262° | primary-500 |
| accent | #f59e0b | 38° | accent-500 |

Status colours not given, defaults used: success #16a34a (success-700), warning #d97706 (warning-600), danger #dc2626 (danger-500), info #2563eb (info-500).

Hue check: each input hex is unchanged and every step aims at its exact hue; only lightness changes. Rounding to hex moves the hue at most 0.1° at steps 300 to 800 and 0.3° at the palest and darkest steps.

### Contrast
Text needs 4.5:1; borders of controls and focus rings need 3:1; border-default is for dividers and is not checked. Every text role meets 4.5:1, so it is safe at any size.

| Text | On | Light | Dark | Needs | Result |
|------|----|-------|------|-------|--------|
| text-default | all 4 surfaces | 13.11:1 | 10.46:1 | 4.5:1 | pass |
| text-muted | all 4 surfaces | 4.55:1 | 5.98:1 | 4.5:1 | pass |
| text-link | all 4 surfaces | 4.77:1 | 6.42:1 | 4.5:1 | pass |
| selected-text | all 4 surfaces, selected-bg | 4.77:1 | 6.42:1 | 4.5:1 | pass |
| accent-text | all 4 surfaces | 6.27:1 | 6.50:1 | 4.5:1 | pass |
| text-inverse | surface-inverse | 14.46:1 | 14.46:1 | 4.5:1 | pass |
| action-primary-text | action-primary-bg, action-primary-bg-hover, action-primary-bg-pressed | 5.70:1 | 5.70:1 | 4.5:1 | pass |
| accent-text-on | accent-bg | 7.29:1 | 7.29:1 | 4.5:1 | pass |
| success-text | surface-default, success-bg-subtle | 6.11:1 | 7.47:1 | 4.5:1 | pass |
| success-text-on | success-bg | 4.75:1 | 4.75:1 | 4.5:1 | pass |
| warning-text | surface-default, warning-bg-subtle | 7.84:1 | 6.83:1 | 4.5:1 | pass |
| warning-text-on | warning-bg | 4.92:1 | 4.92:1 | 4.5:1 | pass |
| danger-text | surface-default, danger-bg-subtle | 5.73:1 | 6.93:1 | 4.5:1 | pass |
| danger-text-on | danger-bg | 4.83:1 | 4.83:1 | 4.5:1 | pass |
| info-text | surface-default, info-bg-subtle | 6.59:1 | 7.57:1 | 4.5:1 | pass |
| info-text-on | info-bg | 5.17:1 | 5.17:1 | 4.5:1 | pass |
| border-strong | surface-default, surface-subtle | 3.47:1 | 4.17:1 | 3:1 | pass |
| border-focus | surface-default, surface-subtle | 5.26:1 | 5.83:1 | 3:1 | pass |

Light and Dark give the lowest ratio of each role over the surfaces listed; 42 pairs checked in each mode.

### How to use
- Load tokens.css before your own styles. 
- Without a data-theme attribute the page follows the system setting; set data-theme="light" or data-theme="dark" on the html element to force one.
- Spacing: 0, 4, 8, 12, 16, 24, 32, 48, 64 px. Type sizes: 12, 14, 16, 20, 24, 36, 48 px, body 16 px, line-height 1.5. Weights: 400 and 700.
- Controls: 40, 48, 56 px high; every click or tap area at least 44 px. Breakpoints: 640, 768, 1024, 1280 px (copy the numbers into media queries).
- Brand colour on at most 30% of a screen: primary action, brand surfaces (hero, banners), badges, focus ring.
- Font: the system font stack. No font files, imports or links.

### Open questions
- None.
