# References

## Scales

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
If you can run code, compute the ratio; otherwise use this table.

| Colour | On #ffffff | On #111827 |
|--------|-----------|-----------|
| #aaaaaa | 2.32:1 | 7.64:1 |
| #999999 | 2.85:1 | 6.23:1 |
| #9ca3af | 2.54:1 | 6.99:1 |
| #888888 | 3.54:1 | 5.00:1 |
| #767676 | 4.54:1 | 3.91:1 |
| #6b7280 | 4.83:1 | 3.67:1 |
| #666666 | 5.74:1 | 3.09:1 |
| #595959 | 7.00:1 | 2.53:1 |
| #4b5563 | 7.56:1 | 2.35:1 |
| #374151 | 10.31:1 | 1.72:1 |
| #ff8a00 | 2.36:1 | 7.51:1 |
| #c2410c | 5.18:1 | 3.43:1 |
| #b45309 | 5.02:1 | 3.53:1 |
| #3b82f6 | 3.68:1 | 4.82:1 |
| #2563eb | 5.17:1 | 3.43:1 |
| #1d4ed8 | 6.70:1 | 2.65:1 |
| #16a34a | 3.30:1 | 5.38:1 |
| #15803d | 5.02:1 | 3.54:1 |
| #dc2626 | 4.83:1 | 3.67:1 |
| #b91c1c | 6.47:1 | 2.74:1 |

White text on a colour has the same ratio as that colour on #ffffff.

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
- [ ] Every spacing and font-size number in the polished code is on its scale.
- [ ] Every text colour pair meets 4.5:1, or 3:1 for large text, and each ratio is written with ":1".
- [ ] The polished code has exactly one primary action.
- [ ] Every interactive element has hover, :focus-visible and, if it can be disabled, disabled styles.
- [ ] No visible text changed, and no element was added or removed.
- [ ] Every brand colour kept its hue.
- [ ] No external font, script, stylesheet, image or link was added.
- [ ] The reply follows the format in layer 08.
