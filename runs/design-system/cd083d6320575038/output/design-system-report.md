## Design system: Brand design tokens

The engine could not run (running commands is not allowed in this session), so the tokens were built by hand; run the engine to confirm the numbers.

Path a, one given hex colour. Archetype: calm-workspace. You asked for a "calm" feel, which matches the calm-workspace style words (calm, quiet, soft); "trustworthy" alone would point to precise-fintech, but calm came first and no product type was given.

This report is the whole reply: it lists the files, the contrast checks and the open questions, in that order.

### Files

- `design-tokens.json`: W3C design tokens (`$type`, `$value`, roles as aliases; light roles under `color.role.light`, dark roles under `color.role.dark`).
- `tokens.css`: custom properties on `:root` (light), dark values under the system dark setting and under `data-theme="dark"`, `data-theme="light"` forces light, density sets, and a reduced-motion block.
- `design-system-report.md`: this report.

Groups covered: colour scales (primary, neutral, success, warning, danger, info), colour roles for light and dark, typography (system font stack, two weights 400 and 600, sizes 12 to 36 px, body 16 px at line-height 1.5), spacing (0, 4, 8, 12, 16, 24, 32, 48, 64 px), control heights (36, 44, 52 px) with a 44 px minimum target, radius (6, 10, 16 px, full), shadow (three levels, stronger in dark), border widths, motion (150, 200, 300 ms, zero under reduced motion), breakpoints (640, 768, 1024, 1280 px) and density (compact, comfortable, spacious; default spacious). No font files, imports, links or scripts are added.

### Colours kept

| Input | Hex | Hue | Placed at |
|-------|-----|-----|-----------|
| Primary (brand colour) | #7c3aed | 262.1° | `--color-primary-500` and `--color-brand`, unchanged |

Primary button: the given hex is the fill. White on #7c3aed is 5.70:1 (dark ink on it is 2.70:1), so no darker step is needed. Hover uses primary-600 (white 9.00:1) and pressed uses primary-700 (white 11.57:1).

Hue check: every primary step keeps the hue of #7c3aed; the largest drift is 0.5° (steps 100 and 800), under the 1° allowed at 300 to 800 and the 4° allowed elsewhere. Steps 400 to 700 are no more colourful than the input (HSL chroma 0.596 at 400, 0.667 at 600, 0.565 at 700, against 0.702 for the input). The neutral scale uses the same hue at 6% saturation (the calm-workspace value); it is a tinted grey, so at its palest and darkest steps 8-bit hex drifts a little more than 1° (at most 8° from the primary hue, at steps with a channel spread under 5). Status scales use the default colours #16a34a (success), #d97706 (warning), #dc2626 (danger) and #2563eb (info) at steps 700, 600, 500 and 500.

### Contrast

Ratios were computed by hand with the formula in the references and are rounded down to two decimals.

| Text | On | Light | Dark | Needs | Result |
|------|----|-------|------|-------|--------|
| text-default | all four surfaces | 12.93:1 | 10.43:1 | 4.5:1 | pass |
| text-muted | all four surfaces | 4.62:1 | 5.98:1 | 4.5:1 | pass |
| text-link, action-secondary-text | all four surfaces | 4.79:1 | 6.59:1 | 4.5:1 | pass |
| text-link-hover | all four surfaces | 7.58:1 | 8.98:1 | 4.5:1 | pass |
| selected-text | all four surfaces and selected-bg | 4.79:1 | 6.59:1 | 4.5:1 | pass |
| text-inverse | surface-inverse | 14.14:1 | 14.14:1 | 4.5:1 | pass |
| action-primary-text | action fill, hover, pressed | 5.70:1 | 5.70:1 | 4.5:1 | pass |
| success-text | surfaces and success-bg-subtle | 5.72:1 | 6.77:1 | 4.5:1 | pass |
| warning-text | surfaces and warning-bg-subtle | 7.07:1 | 5.85:1 | 4.5:1 | pass |
| danger-text | surfaces and danger-bg-subtle | 5.24:1 | 4.92:1 | 4.5:1 | pass |
| info-text | surfaces and info-bg-subtle | 6.09:1 | 5.02:1 | 4.5:1 | pass |
| success-text-on | success-bg | 4.66:1 | 4.66:1 | 4.5:1 | pass |
| warning-text-on | warning-bg | 4.82:1 | 4.82:1 | 4.5:1 | pass |
| danger-text-on | danger-bg | 4.83:1 | 4.83:1 | 4.5:1 | pass |
| info-text-on | info-bg | 5.17:1 | 5.17:1 | 4.5:1 | pass |
| border-strong | all four surfaces | 3.22:1 | 4.31:1 | 3:1 | pass |
| border-focus, action-secondary-border | all four surfaces | 4.79:1 | 4.30:1 | 3:1 | pass |

Each row is the lowest ratio over the surfaces listed. text-disabled is exempt from contrast by design (neutral-400 in light, neutral-600 in dark). border-default is a quiet divider, not a control border, so it is not held to 3:1; use border-strong for inputs and controls. 17 text rows are listed, 0 failing.

Surfaces: light #ffffff, neutral-50, neutral-100, #ffffff (raised); dark neutral-950, neutral-900, neutral-800, neutral-950 (sunken).

### How to use

1. Load `tokens.css` before your own styles. It is the only file a page needs for a working light and dark theme.
2. Use roles, not scales, in components: `var(--color-surface-default)`, `var(--color-text-default)`, `var(--color-action-primary-bg)` and so on.
3. The theme follows the system. Set `data-theme="dark"` or `data-theme="light"` on the html element to force a mode.
4. Set `data-density="compact"`, `"comfortable"` or `"spacious"` on any element to change spacing around controls and rows.
5. Calm-workspace keeps the brand colour to about 5% of a screen: the primary action, the focus ring and the selected item background.
6. Use `design-tokens.json` with any token tool that reads the W3C format. Shadow colours there are 8-digit hex with alpha.
7. For a finished screen built with these tokens, the next step is a polish pass with a UI-polish skill; this skill does not write screens.

### Open questions

- The engine could not run (running commands is not allowed in this session), so the tokens were built by hand; run the engine to confirm the numbers.
- Before commands were ruled out, one directory listing of the skill folder was run by mistake; it read names only and changed nothing.
- You said "calm, trustworthy". Calm-workspace was chosen because calm came first; should it be precise-fintech (sharper radius, denser, tighter motion) instead?
- No product type was given; what kind of product is this?
- No status colours were given, so the defaults are used. Your primary is violet and none of them looks like it.
- The hand-built hex values for the scales were rounded to 8-bit with the hue rule from the references; the engine may pick a neighbouring hex at some steps, which would change a ratio by a few hundredths.
