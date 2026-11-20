# Button

## Purpose
Starts one action on the current page in the invoicing app: save an invoice, send it, record a payment, delete a draft. It carries the main action of a form or dialog and the secondary actions beside it.

## When not to use
- To open another page, such as the customer list: use a link (`<a>`), styled with `--color-text-link`.
- To switch between views of the same invoice (details, payments, history): use tabs.
- Two primary buttons in one view: only one action is the main one; make the other secondary.
- To show a status such as "Paid": use a badge, which is not interactive.

## Anatomy
1. Container: a native `<button type="button">` (`type="submit"` inside a form).
2. Label: required, one to three words starting with a verb ("Send invoice").
3. Leading icon: optional, decorative, `--space-16` square, `aria-hidden="true"`.
4. Spinner: loading state only, replaces the leading icon and keeps the label.

## Variants and sizes
| Variant | Use |
|---------|-----|
| primary | the one main action of the view |
| secondary | other actions, outlined |
| danger | a destructive action such as "Delete invoice", always followed by a confirm step |

| Size | Height | Horizontal padding |
|------|--------|--------------------|
| sm | `--control-height-sm` | `--space-12` |
| md (default) | `--button-height` | `--button-padding-x` |
| lg | `--control-height-lg` | `--space-24` |

Heights are minimums (`min-height`), never fixed. An icon-only button is at least `--size-target-min` wide and high and needs an `aria-label`.

## States
### Default
Primary: fill `--button-primary-bg`, text `--button-primary-text`, radius `--button-radius`, font weight `--font-weight-strong`, font size `--font-size-md`. Secondary: transparent fill, text `--button-secondary-text`, border `--button-secondary-border` at `--border-width-hairline`. Danger: fill `--color-danger-bg`, text `--color-danger-text-on`.
### Hover
Primary fill `--button-primary-bg-hover`. Secondary fill `--color-selected-bg`. Danger keeps `--color-danger-bg` and adds `--shadow-1`. The change is never the only cue: the cursor and the focus ring still tell the user what is active. Transition `--duration-fast` with `--ease-standard`.
### Focus-visible
A ring of `--border-width-focus` in `--color-border-focus`, drawn outside the container so it is not clipped. Shown for keyboard focus only and never removed.
### Active
Primary fill `--button-primary-bg-pressed`. Secondary fill `--color-selected-bg` with text `--color-selected-text`. Danger fill `--color-danger-text`. A toggle button uses the same pressed look with `aria-pressed="true"`.
### Disabled
Text `--color-text-disabled`, fill `--color-surface-sunken`, border `--color-border-default`; no hover or active change. Use the `disabled` attribute. When the reason is not obvious (for example "Send invoice" before a customer is chosen), write the reason in visible helper text next to the button, not in a tooltip alone.
### Loading
Work is in progress. The button keeps the exact width and height it had before loading (dimensions are locked: set `min-width` from the measured width, same `min-height`), the spinner replaces the icon, the label stays, `aria-busy="true"` is set and clicks are ignored. The spinner rotates over `--duration-slow` and stops under `prefers-reduced-motion`, leaving a static spinner mark.
### Empty
Not applicable: a button with no label is a defect. An icon-only button must carry an `aria-label` instead of text.
### Error
The action failed. The button returns to its default look, and a message in `--color-danger-text` (for example "Could not send. Check the connection.") appears beside or below it with `role="alert"`. The button label changes to "Retry" for the same action, and pressing it again repeats the request; focus stays on the button.

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
- `--color-danger-bg`
- `--color-danger-text`
- `--color-danger-text-on`
- `--color-selected-bg`
- `--color-selected-text`
- `--color-surface-sunken`
- `--color-border-default`
- `--color-border-focus`
- `--color-text-disabled`
- `--border-width-hairline`
- `--border-width-focus`
- `--control-height-sm`
- `--control-height-lg`
- `--size-target-min`
- `--space-12`
- `--space-16`
- `--space-24`
- `--space-8`
- `--font-size-md`
- `--font-weight-strong`
- `--line-height-khmer`
- `--shadow-1`
- `--duration-fast`
- `--duration-slow`
- `--ease-standard`

## Keyboard and ARIA
- Element: native `<button type="button">`; never a `<div>` or `<a>` with a click handler.
- Keys: Tab reaches it; Enter and Space activate it.
- Loading: `aria-busy="true"`, and the label stays so the name does not change.
- Toggle: `aria-pressed="true"` or `"false"`.
- Icon-only: `aria-label` names the action; the icon is `aria-hidden="true"`.
- Error message: `role="alert"`, linked with `aria-describedby` on the button.
- Disabled: the `disabled` attribute.

## Khmer text
- Under `:lang(km)` set `line-height: var(--line-height-khmer)` and `letter-spacing: 0`.
- The button grows from its minimum height, never a fixed `height`, so stacked marks are not clipped.
- Labels wrap instead of truncating; the focus ring is not clipped by `overflow`.
- The product serves Khmer readers in Phnom Penh, so labels are written in both languages with the same variant and size.

## Do and don't
- Do give one primary button per view and start labels with a verb.
- Do lock the size while loading so nothing around the button moves.
- Do offer "Retry" after a failure.
- Don't remove the focus ring or replace the native element.
- Don't use colour alone to tell danger from primary: the label says what will be deleted.
- Don't use a raw value or a palette step; use only the variables above.

## Variables to add
- --button-danger-bg: nearest --color-danger-bg (fill of the danger variant)
- --button-danger-text: nearest --color-danger-text-on (text of the danger variant)
- --button-disabled-bg: nearest --color-surface-sunken (fill of a disabled button)
