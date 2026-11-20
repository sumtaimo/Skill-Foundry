# Input

## Purpose
A text input lets the user type one value into a form, such as a customer name, an amount or an invoice number.

## When not to use
- Choosing from a fixed list: use select.
- A yes or no choice: use checkbox.
- Long free text of several lines: use a textarea built with the same variables.

## Anatomy
1. Label: `<label for>`, always visible above the field, for example "Customer name".
2. Field: `<input>` with the right `type` and `autocomplete`.
3. Hint (optional): a `<p>` under the field, for example "As on the invoice".
4. Message: a `<p>` under the field for the error, named by `aria-describedby`.
5. Retry button (async checks only): a `<button type="button">` next to the message.

## Variants and sizes
| Variant | Use |
|---------|-----|
| text | names, titles, invoice numbers |
| number / amount | amounts, with `inputmode="decimal"` |
| email, tel, search | with the matching `type` |

| Size | Height | Padding |
|------|--------|---------|
| sm | `--control-height-sm` | `--space-8` |
| md (default) | `--input-height` | `--density-control-x` |
| lg | `--control-height-lg` | `--space-16` |

Corners use `--input-radius`. The hit area is at least `--size-target-min`.

## States
### Default
Background `--input-bg`, text `--input-text`, border `--input-border` at `--border-width-hairline`, label in `--color-text-default` with `--font-size-sm`, hint in `--color-text-muted`. Placeholder text is not the label.

### Hover
Border becomes `--color-border-strong`. Nothing else changes.

### Focus-visible
Border becomes `--input-border-focus` and a ring of `--border-width-focus` in `--color-border-focus` is drawn outside it, never removed.

### Active
The field is being typed in: it keeps the focus look. A filled field shows its value in `--input-text`.

### Disabled
Text `--color-text-disabled`, background `--color-surface-sunken`, border `--color-border-default`. Use the `disabled` attribute, and say why in the hint when it is not obvious.

### Loading
While a value is checked (for example a tax number lookup) the field sets `aria-busy="true"` and shows a small indicator at the end. The dimensions are locked: height and width do not change, and the message line keeps its space.

### Empty
No value yet: the placeholder shows an example in `--color-text-muted`, for example "e.g. Sokha Trading". The label and hint still tell the user what goes here.

### Error
Border `--color-danger-border`, message in `--color-danger-text` ("Enter an amount greater than zero"), `aria-invalid="true"`, and the message is joined with `aria-describedby`. The user retries by fixing the value and leaving the field, or by pressing the Retry button when a check failed because of the network.

## Variables used
- `--input-bg`
- `--input-text`
- `--input-border`
- `--input-border-focus`
- `--input-radius`
- `--input-height`
- `--color-text-default`
- `--color-text-muted`
- `--color-text-disabled`
- `--color-surface-sunken`
- `--color-border-default`
- `--color-border-strong`
- `--color-border-focus`
- `--color-danger-border`
- `--color-danger-text`
- `--border-width-hairline`
- `--border-width-focus`
- `--control-height-sm`
- `--control-height-lg`
- `--density-control-x`
- `--space-4`
- `--space-8`
- `--space-16`
- `--size-target-min`
- `--font-family-sans`
- `--font-size-sm`
- `--font-size-md`
- `--duration-fast`
- `--ease-standard`
- `--line-height-khmer`

## Keyboard and ARIA
- Element: `<input>` with a visible `<label for>`; never a placeholder as the only label.
- Errors: `aria-invalid="true"` and the message in an element named by `aria-describedby`.
- Required: `required` or `aria-required="true"`, also said in the label text.
- Use the right `type` and `autocomplete` (`email`, `tel`, `name`).
- Retry for async checks is a real `<button>`. Tab order follows the page.

## Khmer text
- Under `:lang(km)` the field and label use `--line-height-khmer` and `letter-spacing: 0`.
- The height is a minimum (`--input-height`), never fixed, so Khmer marks are not clipped.
- Hints and messages wrap; the focus ring is not clipped by a parent's overflow.

## Do and don't
- Do keep the label visible and put the error next to the field.
- Do keep the message line's space so the form does not jump.
- Don't use colour alone for an error; the message says what to fix.
- Don't disable paste or hide the label inside the field.

## Variables to add
- --input-border-error: nearest --color-danger-border (error border)
- --input-placeholder: nearest --color-text-muted (placeholder text)
