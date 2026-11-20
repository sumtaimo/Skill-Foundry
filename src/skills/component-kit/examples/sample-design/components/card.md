# Card

## Purpose
Groups related content about one thing (an invoice, a customer, a plan) on a raised surface, so it can be scanned and compared with its neighbours.

## When not to use
- For a whole page section: use a plain section with a heading.
- For a list of many rows to compare: use a table.
- To hold a single sentence: use plain text.

## Anatomy
1. Container (`<article>` or `<div>`).
2. Header: title (a heading), optional meta line.
3. Body: the content.
4. Footer: actions, at most two buttons.

## Variants and sizes
| Variant | Use |
|---------|-----|
| default | a static group of content |
| interactive | the whole card opens one thing; one link inside carries the action |
| selected | the card is chosen in a set |

| Size | Padding |
|------|---------|
| md (default) | `--card-padding` |
| lg | `--space-24` |

## States
### Default
Fill `--card-bg`, border `--card-border` at `--border-width-hairline`, radius `--card-radius`, shadow `--card-shadow`, padding `--card-padding`, gap between parts `--space-12`.
### Hover
Only for the interactive variant: shadow `--shadow-2`, transition `--duration-base` with `--ease-standard`. A static card does not react.
### Focus-visible
Interactive variant: the link inside shows a ring of `--border-width-focus` in `--color-border-focus`; the card outline follows it with `:focus-within`.
### Active
Selected or pressed: border `--color-border-focus`, fill `--color-selected-bg`, text `--color-selected-text`.
### Disabled
Fill `--color-surface-sunken`, text `--color-text-disabled`, no shadow, no hover.
### Loading
Dimensions are locked: the card keeps its size and shows skeleton blocks of `--color-surface-sunken` in place of the text, `aria-busy="true"` on the container, no layout shift when the content arrives.
### Empty
A short sentence in `--color-text-muted` that says what goes here and one next action, inside the same card size.
### Error
Border `--color-danger-border`, fill `--color-danger-bg-subtle`, message in `--color-danger-text` and a "Try again" button so the user can retry loading the content.

## Variables used
- `--card-bg`, `--card-border`, `--card-radius`, `--card-shadow`, `--card-padding`
- `--shadow-2`, `--border-width-hairline`, `--border-width-focus`, `--color-border-focus`
- `--color-selected-bg`, `--color-selected-text`, `--color-surface-sunken`, `--color-text-disabled`, `--color-text-muted`
- `--color-danger-border`, `--color-danger-bg-subtle`, `--color-danger-text`
- `--space-12`, `--space-24`, `--duration-base`, `--ease-standard`
- `--font-size-lg`, `--font-weight-strong`, `--line-height-heading`

## Keyboard and ARIA
- A static card has no role and no tab stop.
- Interactive: exactly one `<a>` or `<button>` inside, stretched over the card; no nested interactive elements.
- The title is a real heading (`h2` to `h4`, by the page outline).
- Loading: `aria-busy="true"`. Error message: `role="alert"` once, then plain text.

## Khmer text
Titles and body in Khmer need the taller line. Use `--line-height-khmer` under `:lang(km)` for the title and the body, with `letter-spacing: 0`, and let the card grow in height instead of clipping.

## Do and don't
- Do keep one idea per card and at most two actions in the footer.
- Do keep the same card height in a row only with grid alignment, not fixed heights.
- Don't nest cards inside cards.
- Don't write a colour, radius or shadow value in the card; use the variables above.

## Variables to add
None.
