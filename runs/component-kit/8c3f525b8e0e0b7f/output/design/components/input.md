# Input

## Purpose
Lets the user type one line of text, a number or a date into a form: a customer name, an invoice amount, a due date, an email for sending the invoice.

## When not to use
- A choice from a fixed list (currency, tax rate): use select.
- A yes or no choice: use checkbox.
- Several lines of text (invoice notes): use a textarea with the same variables.
- A search that filters a table: use a search field with a visible button, not a bare input.

## Anatomy
1. Label (`<label for>`, always visible, never only a placeholder).
2. Field (a native `<input>`).
3. Hint (optional, `<p>` below the field, linked by `aria-describedby`).
4. Error message (`<p>` below the field, linked by `aria-describedby`, shown in the error state).
5. Prefix or suffix (optional, such as "៛" or "USD", inside the field border).
6. Retry button (error state of an async check only).

## Variants and sizes
| Variant | Use |
|---------|-----|
| text | names, emails, references |
| number | amounts and quantities, with `inputmode="decimal"` |
| date | invoice and due dates |

| Size | Height | Horizontal padding |
|------|--------|--------------------|
| sm | `--control-height-sm` | `--space-8` |
| md (default) | `--input-height` | `--density-control-x` |
| lg | `--control-height-lg` | `--space-16` |

## States
### Default
Fill `--input-bg`, text `--input-text`, border `--input-border` at `--border-width-hairline`, radius `--input-radius`, font size `--font-size-md`. Label in `--color-text-default`, hint in `--color-text-muted`. Placeholder text uses `--color-text-muted` and is only an example, never the label.
### Hover
Border becomes `--color-border-strong` at `--border-width-thick`. Transition `--duration-fast` with `--ease-standard`.
### Focus-visible
Border `--input-border-focus` and an outer ring of `--border-width-focus` in `--color-border-focus`. Never removed.
### Active
While the user types the focus styling stays. A filled value keeps `--input-text`; the border does not change again.
### Disabled
Fill `--color-surface-sunken`, text `--color-text-disabled`, border `--color-border-default`, cursor not-allowed. Use `readonly` instead when the value must still be selectable and copied (an invoice number).
### Loading
Dimensions are locked: the field keeps its height and width while an async check runs (for example checking that an invoice number is unused). A small spinner replaces the suffix, `aria-busy="true"` is set on the field, and typing stays possible.
### Empty
The field is empty and shows the placeholder example and the hint ("For example 2026-0042"). Required fields are marked in the label text, "(required)", not by colour alone.
### Error
Border `--color-danger-border` at `--border-width-thick`, message in `--color-danger-text` with an icon, `aria-invalid="true"` and the message linked by `aria-describedby`. The message says what to do ("Enter an amount greater than 0"). When the failure came from a network check, a "Try again" button sits beside the message and lets the user retry the check; otherwise the user fixes the value and the error clears on the next input.

## Variables used
- `--input-bg`, `--input-text`, `--input-border`, `--input-border-focus`, `--input-radius`, `--input-height`
- `--color-text-default`, `--color-text-muted`, `--color-text-disabled`, `--color-surface-sunken`
- `--color-border-default`, `--color-border-strong`, `--color-border-focus`
- `--color-danger-border`, `--color-danger-text`
- `--control-height-sm`, `--control-height-lg`, `--density-control-x`
- `--space-4`, `--space-8`, `--space-16`
- `--border-width-hairline`, `--border-width-thick`, `--border-width-focus`
- `--font-size-md`, `--font-size-sm`, `--duration-fast`, `--ease-standard`

## Keyboard and ARIA
- Native `<input>` with a visible `<label for>`; the right `type`, `inputmode` and `autocomplete` ("email", "name").
- Required: `required` (or `aria-required="true"`). Invalid: `aria-invalid="true"` and `aria-describedby` naming the error and hint elements.
- Tab enters and leaves the field; no custom key handling. Escape does not clear it.
- The retry for an async check is a real `<button>`, reached with Tab, activated by Enter and Space.
- Loading: `aria-busy="true"`.

## Khmer text
Khmer labels, hints and typed values stack marks above and below the line. Under `:lang(km)` set `line-height` to `--line-height-khmer` and `letter-spacing: 0` on the label, the hint and the field. The field grows from `--input-height` as a minimum (no fixed height), labels and error messages wrap instead of truncating, and the focus ring is not clipped by `overflow`.

## Do and don't
- Do keep the label visible above the field and the hint short.
- Do say in the error message what the user should enter, not only that it is wrong.
- Do keep the value on error; never clear what the user typed.
- Don't use the placeholder as the label.
- Don't signal an error by colour alone: keep the icon and the message.
- Don't remove the focus ring.

## Variables to add
None.
