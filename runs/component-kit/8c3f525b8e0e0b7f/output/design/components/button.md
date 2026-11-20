# Button

## Purpose
Starts one action on the current page of the invoicing app: save an invoice, send it, record a payment, delete a draft. It carries the main action of a form or dialog and the secondary actions beside it.

## When not to use
- To go to another page (open an invoice, go to the customer list): use a link (`<a>`), styled with `--color-text-link`.
- To switch between views (Invoices, Payments, Customers): use tabs.
- Two primary buttons in one view: only one action is the main one.

## Anatomy
1. Container (a native `<button>`).
2. Label (required, one to three words, a verb such as "Send invoice").
3. Leading icon (optional, `--space-16`, decorative).
4. Spinner (loading state only, replaces the leading icon).

## Variants and sizes
| Variant | Use |
|---------|-----|
| primary | the one main action ("Send invoice") |
| secondary | other actions, outlined ("Save draft") |
| danger | a destructive action, always with a confirm step ("Delete invoice") |

| Size | Height | Horizontal padding |
|------|--------|--------------------|
| sm | `--control-height-sm` | `--space-12` |
| md (default) | `--button-height` | `--button-padding-x` |
| lg | `--control-height-lg` | `--space-24` |

Icon-only buttons are `--size-target-min` wide and high, and need an `aria-label`.

## States
### Default
Primary fill `--button-primary-bg`, text `--button-primary-text`, radius `--button-radius`, weight `--font-weight-strong`. Secondary: transparent fill, text `--button-secondary-text`, border `--button-secondary-border` at `--border-width-hairline`. Danger: fill `--color-danger-bg`, text `--color-danger-text-on`.
### Hover
Primary fill `--button-primary-bg-hover`. Secondary fill `--color-selected-bg`. Transition `--duration-fast` with `--ease-standard`. Hover is never the only cue: the pointer cursor stays too.
### Focus-visible
A ring of `--border-width-focus` in `--color-border-focus`, drawn outside the container. Never removed; shown for keyboard focus only.
### Active
Primary fill `--button-primary-bg-pressed`. Secondary fill `--color-selected-bg` with text `--color-selected-text`.
### Disabled
Fill `--color-surface-sunken`, text `--color-text-disabled`, no hover, cursor not-allowed. Use `disabled` only when the reason is obvious; otherwise keep it focusable with `aria-disabled="true"` and a reason ("Add a customer first") named by `aria-describedby`.
### Loading
Dimensions are locked: the button keeps its width and height, the label stays in place but is hidden behind the spinner, `aria-busy="true"` is set, and a second activation is ignored. The spinner uses `currentColor`.
### Empty
Not applicable: a button without a label is a defect. An icon-only button keeps its `aria-label`.
### Error
When the action fails (for example the invoice could not be sent) the button returns to its default state, an inline message beside it uses `--color-danger-text`, and the label becomes "Try again" so the user can retry with one press.

## Variables used
- `--button-primary-bg`, `--button-primary-bg-hover`, `--button-primary-bg-pressed`, `--button-primary-text`
- `--button-secondary-text`, `--button-secondary-border`
- `--button-radius`, `--button-height`, `--button-padding-x`
- `--color-selected-bg`, `--color-selected-text`, `--color-surface-sunken`, `--color-text-disabled`
- `--color-danger-bg`, `--color-danger-text-on`, `--color-danger-text`
- `--control-height-sm`, `--control-height-lg`, `--size-target-min`
- `--space-12`, `--space-16`, `--space-24`, `--border-width-hairline`, `--border-width-focus`, `--color-border-focus`
- `--font-weight-strong`, `--font-size-md`, `--duration-fast`, `--ease-standard`

## Keyboard and ARIA
- Native `<button type="button">`; Enter and Space activate it. Tab reaches it once.
- Loading: `aria-busy="true"`. Toggle button: `aria-pressed`.
- Icon-only: `aria-label` that names the action, not the icon.
- Disabled but explained: `aria-disabled="true"` and `aria-describedby` pointing to the reason.

## Khmer text
Khmer labels ("ផ្ញើវិក្កយបត្រ") need more height than Latin ones. Under `:lang(km)` set the label `line-height` to `--line-height-khmer` and `letter-spacing: 0`. Do not fix the label height; the control grows from `--button-height` as a minimum, and the label wraps instead of being cut.

## Do and don't
- Do keep labels short and start with a verb.
- Do give every state a change that is not colour alone (weight, border or icon).
- Don't set a colour value in the component; use the variables above.
- Don't remove the focus ring.
- Don't put a primary and a danger button side by side without a clear order.

## Variables to add
None.
