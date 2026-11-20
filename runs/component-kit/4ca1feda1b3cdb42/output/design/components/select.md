# Select

## Purpose
A select lets the user pick one value from a short fixed list, such as an invoice status, a currency or a payment term.

## When not to use
- More than about fifteen options that need searching: use a combobox with an input.
- Choosing several values: use checkbox group.
- Free text: use input.
- A list of actions: use menu.

## Anatomy
1. Label: `<label for>`, always visible.
2. Field: native `<select>` (a custom one is a button with `role="combobox"`).
3. Chevron: a decorative `<svg aria-hidden="true">` at the end.
4. List (custom only): `<ul role="listbox">` with `<li role="option">` items.
5. Message: a `<p>` for the hint or the error, named by `aria-describedby`.

## Variants and sizes
| Variant | Use |
|---------|-----|
| native | default; best on phones and for accessibility |
| custom listbox | only when options need icons or rich content |

| Size | Height | Padding |
|------|--------|---------|
| sm | `--control-height-sm` | `--space-8` |
| md (default) | `--input-height` | `--density-control-x` |
| lg | `--control-height-lg` | `--space-16` |

Field corners use `--input-radius`; the list uses `--radius-md`.

## States
### Default
Field like input: background `--input-bg`, text `--input-text`, border `--input-border` at `--border-width-hairline`. The list, when open, has background `--color-surface-raised` and shadow `--shadow-2`.

### Hover
Field border becomes `--color-border-strong`. In the list, the option under the pointer gets `--color-surface-subtle`.

### Focus-visible
Field: border `--input-border-focus` and a ring of `--border-width-focus` in `--color-border-focus`. In a custom list the active option has the same ring, and it is never removed.

### Active
Open: `aria-expanded="true"`. The chosen option shows `--color-selected-bg` with text `--color-selected-text` and `aria-selected="true"`.

### Disabled
Text `--color-text-disabled`, background `--color-surface-sunken`; the `disabled` attribute. An option may be disabled too, with the reason in its text.

### Loading
While options load (for example customers from the server) the field sets `aria-busy="true"` and shows "Loading customers" as its only option. The dimensions are locked: the field keeps its height and width, and the list keeps its minimum height.

### Empty
No options: the list shows one disabled option, "No customers yet", and a hint on how to add one. No selection yet: the first option is the prompt "Choose a status" in `--color-text-muted`.

### Error
Border `--color-danger-border`, message in `--color-danger-text`, `aria-invalid="true"`. If loading the options failed, the message says so and a Retry button beside it reloads them; otherwise the user fixes the choice.

## Variables used
- `--input-bg`
- `--input-text`
- `--input-border`
- `--input-border-focus`
- `--input-radius`
- `--input-height`
- `--color-surface-raised`
- `--color-surface-subtle`
- `--color-surface-sunken`
- `--color-selected-bg`
- `--color-selected-text`
- `--color-text-muted`
- `--color-text-disabled`
- `--color-border-strong`
- `--color-border-focus`
- `--color-danger-border`
- `--color-danger-text`
- `--border-width-hairline`
- `--border-width-focus`
- `--shadow-2`
- `--radius-md`
- `--control-height-sm`
- `--control-height-lg`
- `--density-control-x`
- `--space-8`
- `--space-16`
- `--size-target-min`
- `--font-size-md`
- `--duration-fast`
- `--ease-standard`
- `--line-height-khmer`

## Keyboard and ARIA
- Native `<select>` first; it brings its own keys.
- Custom: the trigger has `role="combobox"`, `aria-expanded`, `aria-controls` and `aria-activedescendant`; the list is `role="listbox"` with `role="option"` and `aria-selected`.
- Keys: Up and Down move, Home and End jump, Enter chooses, Escape closes and returns focus to the trigger, typing jumps to a matching option.
- Errors: `aria-invalid="true"` with `aria-describedby`.

## Khmer text
- Under `:lang(km)` field and options use `--line-height-khmer` and `letter-spacing: 0`.
- Heights are minimums (`--input-height`), never fixed; options wrap instead of truncating.
- The focus ring and list are not clipped by `overflow`.

## Do and don't
- Do use the native select unless options need rich content.
- Do show the current value, never only a placeholder once chosen.
- Don't use a select for two or three options that fit as radio buttons.
- Don't hide the label or open the list on hover.

## Variables to add
- --select-list-bg: nearest --color-surface-raised (open list background)
- --select-option-bg-hover: nearest --color-surface-subtle (option hover)
