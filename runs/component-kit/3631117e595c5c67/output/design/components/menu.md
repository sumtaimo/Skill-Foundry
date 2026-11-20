# Menu

## Purpose
Opens a short list of actions for one item from a button, for example "Send, Duplicate, Download PDF, Delete" on an invoice row.

## When not to use
- A list of links to pages: use nav (a menu is for actions, not page links).
- Choosing a value for a form field: use select.
- One or two actions: show them as buttons.
- Content or a form inside a popup: use dialog.

## Anatomy
1. Trigger: `<button type="button" aria-haspopup="menu" aria-expanded>` labelled "Actions", or with `aria-label` when icon-only.
2. Popup: `<div role="menu">` on a raised surface, placed below the trigger.
3. Item: `<button role="menuitem">` for each action.
4. Separator (optional): `<div role="separator">` between groups.
5. Destructive item: a menuitem in danger text, last in the list.

## Variants and sizes
| Variant | Use |
|---------|-----|
| default | actions of one row or card |
| with destructive item | Delete, last, after a separator |

| Size | Height | Padding |
|------|--------|---------|
| item | `--control-height-md` minimum | `--space-8` block, `--space-12` inline |
| popup | grows with items | `--space-8` |

## States
### Default
Popup: `--color-surface-raised`, `--border-width-hairline` in `--color-border-default`, `--radius-md`, `--shadow-2`. Items: `--color-text-default`, `--font-size-sm`.
### Hover
The item under the pointer gets `--color-surface-subtle` with `--duration-fast` and `--ease-standard`; hover and keyboard highlight look the same.
### Focus-visible
The trigger and the highlighted item show a ring of `--border-width-focus` in `--color-border-focus`, drawn inside the item so the popup's `overflow` does not clip it.
### Active
A pressed item uses `--color-selected-bg` with `--color-selected-text`. The trigger of an open menu keeps `--color-selected-bg`.
### Disabled
A disabled item uses `--color-text-disabled` and `aria-disabled="true"`, stays in the list and can be focused but not run; nearby text says why when it is not obvious ("Send is available once the invoice has a customer").
### Loading
An item whose action is running keeps its width and height (locked), shows "Sending..." in `--color-text-muted`, and the menu has `aria-busy="true"`, so nothing shifts under the pointer.
### Empty
A menu with no available actions shows one disabled item "No actions available" in `--color-text-muted`; better, the trigger is not shown.
### Error
When an action fails the menu closes and focus returns to the trigger; the failure is reported in a toast in `--color-danger-text` with a "Try again" button; the user can retry by pressing it, or by opening the menu and choosing the item again. A destructive item uses `--color-danger-text`.

## Variables used
- `--color-surface-raised`
- `--color-surface-subtle`
- `--color-text-default`
- `--color-text-muted`
- `--color-text-disabled`
- `--color-selected-bg`
- `--color-selected-text`
- `--color-border-default`
- `--color-border-focus`
- `--color-danger-text`
- `--border-width-hairline`
- `--border-width-focus`
- `--shadow-2`
- `--radius-md`
- `--radius-sm`
- `--control-height-md`
- `--size-target-min`
- `--space-4`
- `--space-8`
- `--space-12`
- `--font-family-sans`
- `--font-size-sm`
- `--font-weight-regular`
- `--line-height-body`
- `--line-height-khmer`
- `--duration-fast`
- `--duration-base`
- `--ease-standard`
- `--ease-enter`

## Keyboard and ARIA
- Trigger is a button with `aria-haspopup="menu"` and `aria-expanded`; `aria-controls` names the popup.
- Popup `role="menu"` with `aria-labelledby` the trigger; items `role="menuitem"` with `tabindex="-1"` and roving focus.
- Enter, Space or Down on the trigger opens and focuses the first item (Up focuses the last); Down and Up move and wrap; Home and End jump; type-ahead moves to the item starting with the typed letters.
- Enter or Space runs the item and closes the menu; Escape closes it and returns focus to the trigger; Tab closes it and moves on.
- Under `prefers-reduced-motion: reduce` the popup appears without animation.

## Khmer text
- Under `:lang(km)` set `line-height: var(--line-height-khmer)` and `letter-spacing: 0`.
- Items grow from their minimum height with no fixed height; labels wrap instead of truncating.
- The focus ring is inside each item so it is not clipped.

## Do and don't
- Do start labels with a verb ("Send invoice", "Download PDF").
- Do put the destructive item last, after a separator.
- Don't put page links in a menu; use nav.
- Don't open a menu on hover alone.

## Variables to add
- --menu-bg: nearest --color-surface-raised (popup background)
- --z-dropdown: nearest --shadow-2 (stacking above the page; tokens.css has no z-index layers)
