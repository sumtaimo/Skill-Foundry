## Design system: Brand design system

Path a, one brand hex given (#7c3aed). Archetype: calm-workspace. You said "calm", which maps to calm-workspace; "trustworthy" also fits precise-fintech, so the word you gave first decided.

This report is the whole reply: the files, the checks (the contrast table) and the open questions are all below.

### Files

- `design-tokens.json`: W3C design tokens (`$type`, `$value`, roles as aliases such as `{color.neutral.900}`), light roles under `color.role.light`, dark roles under `color.role.dark`.
- `tokens.css`: custom properties for every group, light on `:root`, dark under the system setting and under the `data-theme` attribute, reduced motion and density.
- `design-system-report.md`: this report.

### Colours kept

| Input | Hex | Hue | Placed at |
|-------|-----|-----|-----------|
| Primary (brand) | #7c3aed | 262.1° | `color.primary.500` and `--color-brand`, unchanged |
| Neutral (built) | none given | 262.1° tint at 6% saturation | `color.neutral.50` to `950` |
| Success, warning, danger, info | none given, defaults #16a34a, #d97706, #dc2626, #2563eb | 142.1°, 32.1°, 0°, 221.2° | success 700, warning 600, danger 500, info 500 |

#7c3aed is not a mid-tone: white text on it reaches 5.70:1, so it is the primary button fill itself and no darker fill step is needed. Its hover and pressed fills are primary 600 and 700.

Hue check: the primary scale is within 0.5° of 262.1° at every step. The status scales are within 0.8° at steps 300 to 800 and within 2.2° at the palest and darkest steps. The neutral scale, a very low saturation tint, is within 1.0° at steps 300 to 800 and within 2.1° at 50, 100, 200, 900 and 950, because 8-bit hex cannot hold the hue more exactly in such greyish colours.

### Contrast

Each row is one role, with its lowest ratio over the surfaces listed. "All surfaces" means surface-default, surface-subtle, surface-raised and surface-sunken. Disabled text is exempt from contrast and is not listed.

| Text | On | Light | Dark | Needs | Result |
|------|----|-------|------|-------|--------|
| text-default | all surfaces | 13.06:1 | 10.52:1 | 4.5:1 | pass |
| text-muted | all surfaces | 4.66:1 | 5.98:1 | 4.5:1 | pass |
| text-link | all surfaces | 4.84:1 | 6.59:1 | 4.5:1 | pass |
| selected-text | all surfaces and selected-bg | 4.84:1 | 6.59:1 | 4.5:1 | pass |
| text-inverse | surface-inverse | 14.27:1 | 14.27:1 | 4.5:1 | pass |
| action-primary-text | primary fill, hover, pressed | 5.70:1 | 5.70:1 | 4.5:1 | pass |
| success-text | surfaces and success-bg-subtle | 5.70:1 | 6.78:1 | 4.5:1 | pass |
| warning-text | surfaces and warning-bg-subtle | 7.13:1 | 5.85:1 | 4.5:1 | pass |
| danger-text | surfaces and danger-bg-subtle | 5.30:1 | 4.92:1 | 4.5:1 | pass |
| info-text | surfaces and info-bg-subtle | 6.15:1 | 5.03:1 | 4.5:1 | pass |
| success-text-on | success-bg | 4.66:1 | 4.66:1 | 4.5:1 | pass |
| warning-text-on | warning-bg | 4.82:1 | 4.82:1 | 4.5:1 | pass |
| danger-text-on | danger-bg | 4.83:1 | 4.83:1 | 4.5:1 | pass |
| info-text-on | info-bg | 5.17:1 | 5.17:1 | 4.5:1 | pass |
| border-strong | all surfaces | 3.26:1 | 4.31:1 | 3:1 | pass |
| border-focus | all surfaces | 4.84:1 | 4.31:1 | 3:1 | pass |

Role choices that follow from these numbers: muted text is neutral 600 in light and neutral 300 in dark; links are primary 500 in light and primary 200 in dark (primary 300 reaches only 4.31:1 on the raised dark surface); the dark focus ring is primary 300; success and warning text use step 800 in light, danger and info text use step 600; danger and info text use step 300 in dark. The default border is decorative and is not held to 3:1.

### How to use

1. Load `tokens.css` before your own styles. Use the role names (`--color-text-default`, `--color-surface-default`, `--color-action-primary-bg`) in components, not the scale steps, so light and dark switch on their own.
2. Dark mode follows the system setting. Set `data-theme="dark"` or `data-theme="light"` on the html element to force a mode.
3. Set `data-density="compact"`, `"comfortable"` or `"spacious"` on any element to change spacing; spacious is the default.
4. Durations drop to 0ms when the user asks for reduced motion.
5. The brand colour is meant to stay under about 5% of a screen: the primary action, the focus ring and the selected item background.
6. For finished screens built with these tokens, the next step is a polish pass with a UI-polish skill; this set does not contain screens.

### Open questions

- The engine could not run (this session did not allow running commands), so the tokens were built by hand; run the engine to confirm the numbers. The scales and ratios were calculated by hand from the reference formulas and may differ from the engine's by a hex digit or by 0.01 in a ratio.
- Before that limit was applied, one directory listing of the skill folder was run; no other command was run.
- You said "calm" and "trustworthy". I used calm-workspace (rounder corners, slower motion, roomier spacing). Do you want precise-fintech instead (tighter corners, firmer feel)?
- You gave no neutral or status colours, so the neutral is a tint of your violet and the status colours are the defaults. Do you have colours for success, warning, danger and info?
- No product name was given, so the heading is generic. What is the product called?
