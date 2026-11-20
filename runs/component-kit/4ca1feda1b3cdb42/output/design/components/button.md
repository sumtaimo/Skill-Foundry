# Button

## Purpose
A button starts one action in the invoicing app, such as "Send invoice" or "Save customer". It is the main way a small-team user commits a change.

## When not to use
- Going to another page or an invoice: use a link (`<a>`), styled with `--color-text-link`.
- Choosing one of several values in a form: use select or checkbox.
- Showing a status such as "Paid": use badge.

## Anatomy
1. Root: `<button type="button">` (or `type="submit"` in a form).
2. Leading icon (optional): `<svg aria-hidden="true">`.
3. Label: a `<span>` with the visible text, for example "Send invoice".
4. Loading indicator (optional): a `<span aria-hidden="true">` that replaces the leading icon.

## Variants and sizes
| Variant | Use |
|---------|-----|
| primary | the one main action of a view ("Send invoice") |
| secondary | other actions ("Save draft", "Cancel") |
| danger | destructive actions ("Delete invoice") |
| ghost | low-emphasis actions inside tables and toolbars |

| Size | Height | Padding |
|------|--------|---------|
| sm | `--control-height-sm` | `--space-12` |
| md (default) | `--button-height` | `--button-padding-x` |
| lg | `--control-height-lg` | `--space-24` |

Every size keeps at least `--size-target-min` as its hit area. Corners use `--button-radius`.

## States
### Default
Primary: background `--button-primary-bg`, text `--button-primary-text`. Secondary: transparent background, text `--button-secondary-text`, border `--button-secondary-border` at `--border-width-hairline`. Danger: background `--color-danger-bg`, text `--color-danger-text-on`. Ghost: no border, text `--color-action-secondary-text`. Label uses `--font-size-md` and `--font-weight-strong`.

### Hover
Primary background becomes `--button-primary-bg-hover`. Secondary and ghost get background `--color-surface-subtle`. Hover is never the only cue: every action stays reachable by keyboard.

### Focus-visible
A ring of `--border-width-focus` in `--color-border-focus`, drawn outside the button, never removed and never clipped by a parent's overflow.

### Active
Primary background becomes `--button-primary-bg-pressed`. Secondary and ghost get background `--color-surface-sunken`. A toggle button uses `aria-pressed="true"` with `--color-selected-bg` and `--color-selected-text`.

### Disabled
Text `--color-text-disabled`, background `--color-surface-sunken`, no hover. Use the `disabled` attribute. When the reason is not obvious, put it in text next to the button, for example "Add a customer first".

### Loading
Work is in progress ("Sending invoice"). The button sets `aria-busy="true"` and ignores clicks, and its dimensions are locked: height and width stay as in Default, the indicator takes the icon's place and the label keeps its space, so nothing shifts. The indicator spins with `--duration-slow` and `--ease-standard`, and is replaced by a static mark under `prefers-reduced-motion`.

### Empty
Not applicable: a button with no label is not allowed. An icon-only button always has an `aria-label`.

### Error
When the action fails the button returns to Default, and a message in `--color-danger-text` appears beside it, for example "Invoice was not sent. Check your connection." The user can retry by pressing the same button again, which stays enabled.

## Variables used
- `--button-primary-bg`
- `--button-primary-bg-hover`
- `--button-primary-bg-pressed`
- `--button-primary-text`
- `--button-secondary-text`
- `--button-secondary-border`
- `--button-radius`
- `--button-height`
- `--button-padding-x`
- `--color-action-secondary-text`
- `--color-danger-bg`
- `--color-danger-text`
- `--color-danger-text-on`
- `--color-surface-subtle`
- `--color-surface-sunken`
- `--color-selected-bg`
- `--color-selected-text`
- `--color-text-disabled`
- `--color-text-link`
- `--color-border-focus`
- `--border-width-hairline`
- `--border-width-focus`
- `--control-height-sm`
- `--control-height-lg`
- `--size-target-min`
- `--space-12`
- `--space-24`
- `--font-size-md`
- `--font-weight-strong`
- `--duration-fast`
- `--duration-slow`
- `--ease-standard`
- `--line-height-khmer`

## Keyboard and ARIA
- Element: native `<button type="button">`; never a `<div>` with a click handler.
- Keys: Enter and Space activate it. Tab reaches it in page order.
- Loading: `aria-busy="true"`; keep it focusable so the user does not lose their place.
- Toggle: `aria-pressed="true"` or `"false"`.
- Icon-only: `aria-label` with the action ("Delete invoice").
- Disabled: the `disabled` attribute.

## Khmer text
- Under `:lang(km)` the label uses `--line-height-khmer` and `letter-spacing: 0`.
- The height is a minimum (`--button-height`), never fixed, so tall Khmer marks are not clipped.
- Labels wrap onto a second line instead of truncating; the focus ring is not clipped.

## Do and don't
- Do give a page one primary button, labelled with a verb and an object ("Send invoice").
- Do keep the width the same while loading.
- Don't remove the focus ring or rely on colour alone to show danger; the label says "Delete".
- Don't put two primary buttons side by side.

## Variables to add
- --button-danger-bg: nearest --color-danger-bg (danger variant background)
- --button-ghost-bg-hover: nearest --color-surface-subtle (ghost hover background)
