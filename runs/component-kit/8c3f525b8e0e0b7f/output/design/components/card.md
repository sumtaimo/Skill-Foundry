# Card

## Purpose
Groups the facts about one thing in a raised surface: an invoice summary, a customer, an outstanding balance. It is a container that may lead to a detail page.

## When not to use
- A row in a long, comparable list (all invoices): use a table.
- A message to the user: use a toast, or an alert block with the status variables.
- A modal question: use a dialog.
- Page layout or sections of a page: that is a screen, not a card.

## Anatomy
1. Container (`<article>` or `<div>`, raised surface).
2. Heading (a real `<h2>` or `<h3>`, the invoice number or customer name).
3. Body (text, amounts, status badge).
4. Footer (optional, actions such as "Send invoice").
5. Stretched link or button (interactive card only, exactly one, on the heading).

## Variants and sizes
| Variant | Use |
|---------|-----|
| static | shows information only |
| interactive | the whole card opens the detail page, through one link |
| outlined | no shadow, for cards on a raised surface |

| Size | Padding |
|------|---------|
| sm | `--space-12` |
| md (default) | `--card-padding` |
| lg | `--space-24` |

Height follows the content; a card never has a fixed height.

## States
### Default
Fill `--card-bg`, border `--card-border` at `--border-width-hairline`, radius `--card-radius`, shadow `--card-shadow`, padding `--card-padding`. Heading in `--color-text-default` at `--font-weight-strong`, body in `--color-text-muted`.
### Hover
Interactive only: shadow `--shadow-2` and border `--color-border-strong`; the heading underlines so the cue is not shadow alone. Transition `--duration-base` with `--ease-standard`. A static card does not react.
### Focus-visible
Interactive only: a ring of `--border-width-focus` in `--color-border-focus` around the whole card (the stretched link's focus is drawn on the container). Never removed.
### Active
Interactive only: fill `--color-selected-bg`, shadow back to `--card-shadow`. A selected card (in a pick-one list) uses `--color-selected-bg` with a `--border-width-thick` border in `--color-border-focus` and `aria-current="true"`.
### Disabled
Fill `--color-surface-sunken`, text `--color-text-disabled`, no shadow, no hover. The link is removed or `aria-disabled="true"`, and the reason is written in the body.
### Loading
Dimensions are locked: the container keeps the size it will have, the text areas show placeholders in `--color-surface-sunken`, `aria-busy="true"` is set on the card, and the footer actions stay in place but inactive.
### Empty
The card shows what goes here and the next action: "No payments yet. Record the first payment." with a button in the footer. The heading stays.
### Error
When the data fails to load, the body shows the message in `--color-danger-text` with an icon and a "Try again" button so the user can retry loading the card. The border uses `--color-danger-border`; the heading stays so the user knows which card failed.

## Variables used
- `--card-bg`, `--card-border`, `--card-radius`, `--card-shadow`, `--card-padding`
- `--color-text-default`, `--color-text-muted`, `--color-text-disabled`
- `--color-surface-sunken`, `--color-selected-bg`
- `--color-border-strong`, `--color-border-focus`
- `--color-danger-border`, `--color-danger-text`
- `--shadow-2`
- `--space-12`, `--space-24`, `--border-width-hairline`, `--border-width-thick`, `--border-width-focus`
- `--font-weight-strong`, `--font-size-md`, `--duration-base`, `--ease-standard`

## Keyboard and ARIA
- A static card has no role; it is an `<article>` or `<div>` with a real heading.
- An interactive card has exactly one `<a>` or `<button>` (on the heading), stretched over the card; no nested links or buttons inside it. Enter activates a link, Enter and Space a button.
- Loading: `aria-busy="true"`. Selected: `aria-current="true"` (or `aria-selected` inside a listbox).
- The error's "Try again" is a real `<button>` in the card footer.

## Khmer text
Khmer headings and body text (customer names, "វិក្កយបត្រ") need taller lines. Under `:lang(km)` set `line-height` to `--line-height-khmer` and `letter-spacing: 0`. The card grows with its content (no fixed height), text wraps instead of truncating, and `overflow` is not hidden where it would clip the focus ring or stacked marks.

## Do and don't
- Do give every card a real heading so screen reader users can navigate by it.
- Do make the whole card one target, with one link.
- Don't nest buttons or links inside an interactive card.
- Don't show a shadow as the only sign of hover.
- Don't set a colour, radius or shadow value in the component; use the variables above.

## Variables to add
None.
