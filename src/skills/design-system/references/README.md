# References

Everything the engine (`engine/tokens.mjs`) does is written here, so the set can also be built by hand.

## Colour scales

Every scale keeps the hue (HSL) of its input colour. Lightness follows the table below; saturation eases toward the ends.
The input hex sits unchanged at the step whose lightness is nearest to its own, and the primary input is also `--color-brand` (`color.brand`).

| Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|------|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| HSL lightness % | 97 | 93 | 85 | 75 | 64 | 53 | 43 | 34 | 24 | 15 | 8 (neutral only) |

- Saturation of a step = input saturation × the taper: 50: 0.80, 100: 0.85, 200: 0.90, 300: 0.95, 400 to 700: 1, 800: 0.95, 900: 0.88, 950: 0.80.
- Steps 400 to 700 are also capped so they are never more colourful than the input. Colourfulness is HSL chroma, C = (1 − |2L − 1|) × S. The cap is C(step) ≤ k × C(input), with k = 0.85 at 400, 0.90 at 500, 0.95 at 600 and 1 at 700, so S(step) ≤ k × C(input) / (1 − |2L(step) − 1|). A capped step keeps at least 0.6 × the input saturation, so hex can still hold the hue. Example: #0d9488 (a teal at 700) gives 400 #6bddd3 and 500 #4dc6bb, not a bright cyan.
- When rounding a step to hex, try the nearby 8-bit values of each channel (keeping lightness within 1 percent, 2 percent at the palest and darkest steps) and pick the one whose hue is nearest the input hue. For inputs with 25% saturation or more the drift stays at or under 1 degree at steps 300 to 800 and 4 degrees at 50, 100, 200 and 900: 8-bit hex cannot hold a hue more exactly in very pale or very dark colours. Greyish inputs (under 25%) drift more at those steps; the report shows the drift.
- **Neutral**: the primary hue at the archetype's neutral saturation (references/archetypes.md), steps 50 to 950. A neutral hex the user gives replaces this.
- **Status** defaults when the user gives none: success #16a34a, warning #d97706, danger #dc2626, info #2563eb.
- Scale tokens: `--color-<scale>-<step>` in CSS, `color.<scale>.<step>` in JSON. Scales: primary, accent (only when given), neutral, success, warning, danger, info.

## Roles

Each role has a light and a dark value. "First of" means the first step, in that order, that passes on every surface of the mode.

| Role | Light | Dark |
|------|-------|------|
| surface-default | #ffffff | neutral-950 |
| surface-subtle | neutral-50 | neutral-900 |
| surface-raised | #ffffff | neutral-800 |
| surface-sunken | neutral-100 | neutral-950 |
| surface-inverse | neutral-900 | neutral-50 |
| text-default | neutral-900 | neutral-50 |
| text-muted | first of 600, 700, 800 at 4.5:1 | first of 400, 300, 200, 100 at 4.5:1 |
| text-disabled | neutral-400 (exempt from contrast) | neutral-600 (exempt) |
| text-inverse | neutral-50 | neutral-900 |
| text-link | primary: first at 4.5:1 from the given step (500 if the given step is lighter) toward 900 | primary: first at 4.5:1 from 400 (or the given step if it is lighter) toward 50 |
| text-link-hover | one step darker than text-link | one step lighter |
| border-default | neutral-200 | neutral-800 |
| border-strong | first of neutral 400 to 700 at 3:1 | first of neutral 500, 400, 300 at 3:1 |
| border-focus | primary, as text-link but at 3:1 | as text-link but at 3:1 |
| action-primary-bg | the given primary hex when #ffffff or neutral-900 reaches 4.5:1 on it; for a mid-tone (neither reaches it), the nearest darker step of the primary scale where #ffffff reaches 4.5:1 | the same |
| action-primary-text | #ffffff or neutral-900, whichever has the higher ratio; #ffffff on a mid-tone's darker step; #000000 on the given hex only when no darker step reaches 4.5:1 with #ffffff | the same |
| action-primary-bg-hover, -pressed | the next steps that keep action-primary-text at 4.5:1 (darker under white text, lighter under dark text) | the same |
| action-secondary-text, -border | text-link, border-focus | the same |
| selected-bg, selected-text | primary-50, primary text at 4.5:1 on it | primary-900, primary text at 4.5:1 on it |
| <status>-bg-subtle, -border | status 50, 200 | status 900, 700 |
| <status>-text | first of 600, 700, 800, 900 at 4.5:1 on surfaces and on its subtle bg | first of 400, 300, 200, 100 |
| <status>-bg, -text-on | the status input step, with #ffffff or neutral-900 at 4.5:1 | the same |
| accent-bg, accent-text-on, accent-text | as action-primary and text-link, for the accent | the same |
| surface-brand, text-on-brand | bold-consumer only: action-primary-bg and its text | the same |

The given hex is never changed: it stays at its step and as `--color-brand`. Only the filled button of a mid-tone moves, to a darker step of the same hue, and the report shows both ratios (white on the given hex, white on the fill). A light colour such as a yellow keeps its hex as the fill with dark text. Because #000000 or #ffffff always reaches 4.5:1 on any colour, a fill is always found.

## Contrast

Ratio = (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter colour and L2 of the darker.
For each sRGB channel c from 0 to 1: c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4; L = 0.2126 R + 0.7152 G + 0.0722 B.
Write ratios rounded to two decimals with ":1"; a ratio below its minimum is never rounded up to it (4.497 is written 4.49:1).

- Text: 4.5:1 for normal text, 3:1 for large text (24 px, or bold 19 px, and up). Every text role here is checked at 4.5:1, so it is safe at any size.
- Borders of controls and focus rings: 3:1 against the surfaces they sit on.
- The report gives one row per role with the lowest ratio over the surfaces it sits on; a passing row means every pair in it passes.
- Text pairs checked: text-default, text-muted, text-link, selected-text and accent-text on all four surfaces; text-inverse on surface-inverse; action-primary-text on the action fill, hover and pressed; selected-text on selected-bg; each status text on surface-default and on its subtle bg; each status text-on on its fill.

| Colour | On #ffffff | On #111827 |
|--------|-----------|-----------|
| #aaaaaa | 2.32:1 | 7.64:1 |
| #999999 | 2.85:1 | 6.23:1 |
| #767676 | 4.54:1 | 3.91:1 |
| #6b7280 | 4.83:1 | 3.67:1 |
| #2563eb | 5.17:1 | 3.43:1 |
| #1d4ed8 | 6.70:1 | 2.65:1 |
| #0f766e | 5.47:1 | 3.24:1 |
| #16a34a | 3.30:1 | 5.38:1 |
| #dc2626 | 4.83:1 | 3.67:1 |
| #facc15 | 1.53:1 | 11.58:1 |
| #ff8a00 | 2.36:1 | 7.51:1 |

## Groups and fixed scales

| Group | Tokens (CSS names) | Values |
|-------|--------------------|--------|
| color-primary, color-neutral, color-status | `--color-<scale>-<step>` | scales above |
| color-roles | `--color-<role>` | roles above, light and dark |
| dark-mode | dark roles under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }` and `:root[data-theme="dark"]` | roles above |
| typography | `--font-family-sans`, `-heading`, `-mono`; `--font-size-xs` to `-3xl`; `--line-height-body` 1.5, `-heading` 1.25, `-display` 1.2; `--font-weight-regular`, `-strong`; `--measure` 65ch | sizes only from 12, 14, 16, 18, 20, 24, 30, 36, 48 px; body (md) 16 px or more; two weights |
| spacing | `--space-0` to `--space-64` | 0, 4, 8, 12, 16, 24, 32, 48, 64 px |
| control | `--control-height-sm`, `-md`, `-lg`; `--size-target-min` | archetype heights; target 44 px always |
| radius | `--radius-sm`, `-md`, `-lg`, `-full` (9999px), `-control` | archetype |
| shadow | `--shadow-1` to `-3` | archetype; dark mode uses black at three times the opacity, at most 0.6 |
| border-width | `--border-width-hairline` 1px, `-thick` 2px, `-focus` 2px | fixed |
| motion | `--duration-fast`, `-base`, `-slow`; `--ease-standard` cubic-bezier(0.2, 0, 0, 1), `-enter` (0, 0, 0.2, 1), `-exit` (0.4, 0, 1, 1) | archetype durations; every duration 0ms under prefers-reduced-motion: reduce |
| breakpoint | `--breakpoint-sm` 640px, `-md` 768px, `-lg` 1024px, `-xl` 1280px | fixed; custom properties do not work in media queries, so copy the numbers there |
| density | `--density-control-x`, `-control-y`, `-row`, `-stack`, `-section`; `[data-density="compact" / "comfortable" / "spacious"]` | compact 8, 4, 32, 8, 24; comfortable 12, 8, 40, 12, 32; spacious 16, 12, 48, 16, 48 px |

System font stacks (no files, no links):

- Sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
- Serif (editorial headings): ui-serif, Georgia, Cambria, "Times New Roman", serif
- Mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace

## W3C design tokens format

- Every token is an object with `$type` and `$value`; groups are plain objects; a group or token may have `$description`.
- Types used: color (hex string), dimension ("16px"), number, fontFamily (array), fontWeight (number), duration ("150ms"), cubicBezier (array of four numbers), shadow (object with color, offsetX, offsetY, blur, spread).
- Roles are aliases: `"$value": "{color.neutral.900}"`. Light roles are under `color.role.light`, dark roles under `color.role.dark`.

## Existing systems (path c)

A group counts as present when a token name matches its words (case-insensitive):
color-primary: primary, brand, accent; color-neutral: neutral, gray, grey, slate, zinc, stone; color-status: success, warning, danger, error, info;
color-roles: surface, background, bg, text, fg, foreground, border (with a hex value); typography: font, leading, line-height, weight;
spacing: space, spacing, gap, gutter; control: control, input-height, button-height, target; radius: radius, rounded; shadow: shadow, elevation;
border-width: border-width; motion: duration, ease, easing, motion, transition; breakpoint: breakpoint, screen; density: density;
dark-mode: a prefers-color-scheme: dark block or a data-theme selector.
Missing groups are written to the gap files. Existing names are never written again. When dark mode is missing,
existing background, text and border tokens get dark values under the same names, in the dark blocks only.

## Reviewer checklist

Answer each line yes or no. Any "no" blocks the reply until it is fixed.

- [ ] Each given hex appears unchanged, and its scale keeps its hue (report: at most 1 degree at 300 to 800, 4 elsewhere).
- [ ] A mid-tone primary has its filled button on a darker step of the same hue, and the report shows white on the given hex and white on the fill.
- [ ] Every text pair is 4.5:1 or more in light and dark, and each ratio is written with ":1".
- [ ] tokens.css has prefers-color-scheme: dark, [data-theme="dark"] and prefers-reduced-motion blocks.
- [ ] design-tokens.json uses $type and $value, with roles as aliases.
- [ ] Every group of the table above is present (or, on path c, kept or added).
- [ ] No external font, import, link, script or url() is in the output.
- [ ] The archetype is named with a reason, and no compared brand name appears.
- [ ] On path c, no existing token or file was changed.
- [ ] The reply is the report in the layer 08 format.
