## Design system: Your project

Path c, filling the gaps of your existing design system. Archetype: calm-workspace. No style words or product type were given, so calm-workspace, the default, shapes the missing groups.

This report is the whole reply: the files written, the checks run with every result, and the open questions.

### Files
- design-tokens.gaps.json: W3C design tokens, missing groups only
- tokens.gaps.css: CSS custom properties, missing groups only
- design-system-report.md: this report

### Colours kept
| Input | Hex | Hue | Placed at |
|-------|-----|-----|-----------|
| primary | #7c3aed | 262° | your token, unchanged |

Status colours not given, defaults used: success #16a34a (success-700), warning #d97706 (warning-600), danger #dc2626 (danger-500), info #2563eb (info-500).

Hue check: each input hex is unchanged and every step aims at its exact hue; only lightness changes. Rounding to hex moves the hue at most 0.1° at steps 300 to 800 and 0.3° at the palest and darkest steps.

### Contrast
Text needs 4.5:1; borders of controls and focus rings need 3:1; border-default is for dividers and is not checked. Pairs of your own tokens below 4.5:1 are marked "yours, kept": this skill never changes your tokens.

| Text | On | Light | Dark | Needs | Result |
|------|----|-------|------|-------|--------|
| --text | --bg | 17.74:1 | 16.89:1 | 4.5:1 | pass |
| --text-muted | --bg | 2.54:1 (yours, kept) | 9.68:1 | 4.5:1 | FAIL |

### Kept from your system
- 11 tokens in existing-tokens.css, unchanged. Groups found: color-primary, color-roles, spacing, radius, typography.

### Added
- Groups added: color-neutral, color-status, dark-mode, control, shadow, border-width, motion, breakpoint, density.
- Dark values for your existing role tokens: --bg, --text, --text-muted, --border.

### Existing pairs below the minimum (kept, not changed)
- --text-muted on --bg: #9ca3af on #ffffff, 2.54:1; needs 4.5:1.

### How to use
- Load tokens.gaps.css after your existing token files and before your own styles; it only adds tokens and dark values.
- Without a data-theme attribute the page follows the system setting; set data-theme="light" or data-theme="dark" on the html element to force one.
- Spacing: 0, 4, 8, 12, 16, 24, 32, 48, 64 px. Type sizes: 12, 14, 16, 20, 24, 30, 36 px, body 16 px, line-height 1.5. Weights: 400 and 600.
- Controls: 36, 44, 52 px high; every click or tap area at least 44 px. Breakpoints: 640, 768, 1024, 1280 px (copy the numbers into media queries).
- Brand colour on at most 5% of a screen: primary action, focus ring, selected item background.
- Font: the system font stack. No font files, imports or links.

### Open questions
- styles/brand.css was not in the project folder I could read, so I saved the tokens you pasted, word for word, to existing-tokens.css and built the gaps from that; check it matches your file.
- Your --text-muted (#9ca3af) is 2.54:1 on --bg and fails 4.5:1 in light mode; it is kept unchanged. Should it point to --color-neutral-600 (#6c6873, 5.43:1 on white) instead?
