# Checkbox

## Purpose
A checkbox lets the user turn one option on or off, or choose several from a group, such as "Send me a copy" or the invoices to mark as paid.

## When not to use
- Exactly one choice from a list: use select or radio buttons.
- An action that takes effect at once: use a button (or a switch).
- Showing status: use badge.

## Anatomy
1. Root: `<label>` that wraps or points to the input.
2. Control: native `<input type="checkbox">`.
3. Box: a drawn square that follows the input's state.
4. Mark: a check or dash `<svg aria-hidden="true">`.
5. Label text: the visible words, for example "Send me a copy".
6. Group (optional): `<fieldset>` with a `<legend>` and a message.

## Variants and sizes
| Variant | Use |
|---------|-----|
| single | one on or off option |
| indeterminate | a "select all" row when only some rows are chosen |
| group | several related options under one legend |

| Size | Box | Hit area |
|------|-----|----------|
| md (default) | `--space-16` | at least `--size-target-min` |
| lg | `--space-24` | at least `--size-target-min` |

Box corners use `--radius-sm`; the gap to the label is `--space-8`.

## States
### Default
Unchecked: border `--input-border` at `--border-width-hairline`, background `--input-bg`. Label in `--color-text-default` with `--font-size-md`.

### Hover
Box border becomes `--color-border-strong`. The whole label is clickable.

### Focus-visible
A ring of `--border-width-focus` in `--color-border-focus` around the box, never removed.

### Active
Checked or indeterminate: background `--color-action-primary-bg`, mark `--color-action-primary-text`, with `--color-action-primary-bg-hover` on hover. Pressed shows `--color-action-primary-bg-pressed`.

### Disabled
Box and label in `--color-text-disabled`, background `--color-surface-sunken`; the `disabled` attribute. Say why in nearby text when it is not obvious.

### Loading
When the change is saved on the server, the box sets `aria-busy="true"` and shows a small indicator in the box's place. The dimensions are locked: the box and label keep the same size, so the row does not shift.

### Empty
Not applicable: a checkbox always has a value. A group with no options shows the text "No options yet" in `--color-text-muted`.

### Error
Border `--color-danger-border` and a message in `--color-danger-text` ("Accept the terms to continue"), with `aria-invalid="true"`. The user retries by choosing the box again; when saving failed, a Retry button beside the message repeats the save.

## Variables used
- `--input-border`
- `--input-bg`
- `--color-action-primary-bg`
- `--color-action-primary-bg-hover`
- `--color-action-primary-bg-pressed`
- `--color-action-primary-text`
- `--color-text-default`
- `--color-text-muted`
- `--color-text-disabled`
- `--color-surface-sunken`
- `--color-border-strong`
- `--color-border-focus`
- `--color-danger-border`
- `--color-danger-text`
- `--border-width-hairline`
- `--border-width-focus`
- `--radius-sm`
- `--space-8`
- `--space-16`
- `--space-24`
- `--size-target-min`
- `--font-size-md`
- `--duration-fast`
- `--ease-standard`
- `--line-height-khmer`

## Keyboard and ARIA
- Native `<input type="checkbox">` with a label.
- Space toggles it; Tab moves between boxes.
- Mixed state through the `indeterminate` property (not an attribute).
- A group is a `<fieldset>` with a `<legend>`. Custom boxes use `role="checkbox"` and `aria-checked` (`mixed` allowed).
- Errors: `aria-invalid="true"` with `aria-describedby`.

## Khmer text
- Under `:lang(km)` the label uses `--line-height-khmer` and `letter-spacing: 0`.
- The row grows with its text; no fixed height. Labels wrap, and the box stays aligned to the first line.
- The focus ring is not clipped by `overflow`.

## Do and don't
- Do word the label so that checked means yes ("Send me a copy").
- Do make the whole label the click target.
- Don't use a checkbox for an action that happens at once.
- Don't show the checked state by colour alone; the mark is always drawn.

## Variables to add
- --checkbox-bg-checked: nearest --color-action-primary-bg (checked box background)
- --checkbox-border: nearest --input-border (box border)
