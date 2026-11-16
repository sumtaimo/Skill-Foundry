# References

## Scales (default mode)

These are the scales of default mode, used when the project has no token file. With a token file the scales are its tokens: see [tokens.md](tokens.md).

| Scale | Allowed values |
|-------|----------------|
| Spacing (margin, padding, gap) | 4, 8, 12, 16, 24, 32, 48, 64 px (0 is allowed) |
| Font size | 12, 14, 16, 18, 20, 24, 30, 36, 48 px; body text 16 px or more |
| Line-height | body 1.5; headings 1.2 to 1.3 |
| Font weight | at most two per page, for example 400 and 600 |
| Paragraph width | max-width 65ch or less |
| Target size | 44 by 44 px or more |

Utility-class equivalents (Tailwind): spacing 4 = 1, 8 = 2, 12 = 3, 16 = 4, 24 = 6, 32 = 8, 48 = 12, 64 = 16; text-xs 12, text-sm 14, text-base 16, text-lg 18, text-xl 20, text-2xl 24, text-3xl 30, text-4xl 36, text-5xl 48.

## Contrast

Ratio = (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter colour and L2 of the darker.
For each sRGB channel c from 0 to 1: c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4; L = 0.2126 R + 0.7152 G + 0.0722 B.
Run the contrast script for every ratio (next section). Use this table only when commands cannot run, and then say so in the reply. The table was made with the script, so the two agree.

| Colour | On #ffffff | On #f9fafb | On #f3f4f6 | On #111827 |
|--------|-----------|-----------|-----------|-----------|
| #aaaaaa | 2.32:1 | 2.22:1 | 2.11:1 | 7.64:1 |
| #999999 | 2.85:1 | 2.73:1 | 2.59:1 | 6.23:1 |
| #9ca3af | 2.54:1 | 2.43:1 | 2.31:1 | 6.99:1 |
| #888888 | 3.54:1 | 3.39:1 | 3.22:1 | 5.00:1 |
| #767676 | 4.54:1 | 4.35:1 | 4.13:1 | 3.91:1 |
| #6b7280 | 4.83:1 | 4.63:1 | 4.39:1 | 3.67:1 |
| #666666 | 5.74:1 | 5.49:1 | 5.22:1 | 3.09:1 |
| #595959 | 7.00:1 | 6.70:1 | 6.36:1 | 2.53:1 |
| #4b5563 | 7.56:1 | 7.23:1 | 6.87:1 | 2.35:1 |
| #374151 | 10.31:1 | 9.86:1 | 9.37:1 | 1.72:1 |
| #ff8a00 | 2.36:1 | 2.26:1 | 2.15:1 | 7.51:1 |
| #c2410c | 5.18:1 | 4.96:1 | 4.71:1 | 3.43:1 |
| #b45309 | 5.02:1 | 4.81:1 | 4.56:1 | 3.53:1 |
| #3b82f6 | 3.68:1 | 3.52:1 | 3.34:1 | 4.82:1 |
| #2563eb | 5.17:1 | 4.95:1 | 4.70:1 | 3.43:1 |
| #1d4ed8 | 6.70:1 | 6.41:1 | 6.09:1 | 2.65:1 |
| #16a34a | 3.30:1 | 3.15:1 | 2.99:1 | 5.38:1 |
| #15803d | 5.02:1 | 4.80:1 | 4.56:1 | 3.54:1 |
| #dc2626 | 4.83:1 | 4.62:1 | 4.39:1 | 3.67:1 |
| #b91c1c | 6.47:1 | 6.19:1 | 5.88:1 | 2.74:1 |

White text on a colour has the same ratio as that colour on #ffffff.

## Contrast script

`engine/contrast.mjs` in this skill folder computes exact ratios. Node.js only, no installs, read-only. Run it with `node` and the full path to the script (the folder that holds SKILL.md plus `engine/contrast.mjs`). Write it as ONE plain command: no `cd`, no shell variable, no pipe, no `;`, no `&&`. The examples below use the short form `engine/contrast.mjs`; put the full path in front of it.

| What | Command |
|------|---------|
| Ratio of one or more pairs (text first, background second) | `node engine/contrast.mjs "#aaaaaa" "#ffffff" "#ffffff" "#16a34a"` |
| Nearest shade of the same hue that reaches 4.5:1 | `node engine/contrast.mjs --suggest "#16a34a" --on "#ffffff"` (add `--min 3` for large text) |
| Token pairs, by token name | `node engine/contrast.mjs --tokens tokens.css --color-text-muted --color-surface-default` |
| Same, dark theme | add `--theme dark` |
| A whole scale against one background | `node engine/contrast.mjs --tokens tokens.css --scale --color-neutral- --on --color-surface-default` |
| List every token of the file | `node engine/contrast.mjs --tokens tokens.css --list` |

It prints each ratio with two decimals and ":1" and whether it passes 4.5:1 and 3:1. Copy the printed ratio; never round it again and never recompute it by hand. A ratio just under 4.5 or 3 is never rounded up. `--tokens` takes `tokens.css` or `design-tokens.json`, and `.gaps` files after the main file.

If the script cannot run (no Node.js, or commands are not allowed), use the table above and write "Ratios from the reference table." in the reply. A pair that is not in the table is computed with the formula, and the reply then says "Ratios computed by hand with the formula; run the contrast script to confirm them."

## Hierarchy

- One primary action: filled, brand colour. Secondary: outline or text style in the same hue. Destructive actions use red only when they delete or remove.
- De-emphasise with a lighter text colour (still meeting 4.5:1) before making text smaller.
- Group related items with smaller gaps inside a group than between groups (for example 8 px inside, 24 px between).

## States

- Hover: a darker or lighter shade of the same colour, or an underline for text links.
- Focus: `outline: 2px solid <brand colour>; outline-offset: 2px;` on :focus-visible. Never remove an outline without a replacement.
- Disabled: lower opacity (0.5) and `cursor: not-allowed`.

## Reviewer checklist

Answer each line yes or no. Any "no" blocks the reply until it is fixed.

- [ ] Every fix cites one rule id and gives the value before and after.
- [ ] Every spacing and font-size number in the polished code is on its scale, or is a token of the token file.
- [ ] Every text colour pair meets 4.5:1, or 3:1 for large text, and each ratio is written with ":1".
- [ ] The polished code has exactly one primary action.
- [ ] Every interactive element has hover, :focus-visible and, if it can be disabled, disabled styles.
- [ ] No visible text changed, and no element was added or removed.
- [ ] Every brand colour kept its hue.
- [ ] No external font, script, stylesheet, image or link was added.
- [ ] No pair that passed before has a lower ratio after, no passing value was swapped for a different token value (each is an Open question with both values), and the script was run as one plain command or the reply says it could not run.
- [ ] The reply follows the format in layer 08, with one true ratio-source sentence under the contrast table.
- [ ] With a token file: no raw value is left where a token matches, every var(--name) is in the token file or the input, the primary action uses the primary-fill tokens, and the token file was not edited.
