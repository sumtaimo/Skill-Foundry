# Tabs

## Purpose
Lets a person switch between sibling views of one record, for example Details, Payments and History of an invoice, without leaving the page.

## When not to use
- Moving between pages of the app: use nav.
- Steps that must be done in order: use a stepper in the screen, not tabs.
- Views that must be compared side by side: use card sections.
- A list of actions: use menu.

## Anatomy
1. Tablist: `<div role="tablist">` with an `aria-label`, holding the tabs, with a baseline underneath.
2. Tab: `<button role="tab" type="button">`, one per view; the label is text, with an optional count.
3. Current-tab indicator: a bottom border on the selected tab.
4. Tabpanel: `<div role="tabpanel">` for each tab, labelled by its tab.

## Variants and sizes
| Variant | Use |
|---------|-----|
| Underline (default) | views of one record, current tab marked by a bottom border |
| Contained | dense toolbars, current tab marked with `--color-selected-bg` |

| Size | Height | Padding |
|------|--------|---------|
| md (default) | `--control-height-md` minimum | `--space-12` block, `--space-16` inline |
| sm | `--control-height-sm` minimum | `--space-8` block, `--space-12` inline |

## States
### Default
Tab text is `--color-text-muted` on `--color-surface-default`; the baseline is `--color-border-default` at `--border-width-hairline`. The selected tab uses `--color-text-default`, `--font-weight-strong` and a `--border-width-thick` bottom border in `--color-border-focus`.
### Hover
Tab text changes to `--color-text-default` and the background to `--color-surface-subtle`, with `--duration-fast` and `--ease-standard`. Hover is never the only way to see which tab is selected.
### Focus-visible
A ring of `--border-width-focus` in `--color-border-focus`, drawn inside the tab so `overflow` on the tablist cannot clip it.
### Active
Pressed tab: background `--color-surface-sunken`. The selected tab (`aria-selected="true"`) keeps `--color-selected-text` and the indicator.
### Disabled
Tab text `--color-text-disabled`, no hover, `aria-disabled="true"`, not selectable; say why nearby when it is not obvious (for example "Payments: available after the invoice is sent").
### Loading
While a panel loads, the tablist and the panel keep their dimensions (locked: the panel has a minimum height set by the screen, so nothing shifts); the panel gets `aria-busy="true"` and shows a line "Loading payments" in `--color-text-muted`.
### Empty
A panel with no content says what goes here and the next action, in `--color-text-muted` at `--font-size-md`, for example "No payments yet. Record a payment to see it here." followed by a button.
### Error
If a panel fails to load, it shows the message in `--color-danger-text` inside `--color-danger-bg-subtle` with `--color-danger-border`, and a "Try again" button; the user can retry by pressing it, which reloads that panel only; focus stays on the tab.

## Variables used
- `--color-surface-default`
- `--color-surface-subtle`
- `--color-surface-sunken`
- `--color-text-default`
- `--color-text-muted`
- `--color-text-disabled`
- `--color-selected-bg`
- `--color-selected-text`
- `--color-border-default`
- `--color-border-focus`
- `--color-danger-text`
- `--color-danger-bg-subtle`
- `--color-danger-border`
- `--border-width-hairline`
- `--border-width-thick`
- `--border-width-focus`
- `--control-height-sm`
- `--control-height-md`
- `--size-target-min`
- `--space-8`
- `--space-12`
- `--space-16`
- `--radius-sm`
- `--font-family-sans`
- `--font-size-sm`
- `--font-size-md`
- `--font-weight-regular`
- `--font-weight-strong`
- `--line-height-body`
- `--line-height-khmer`
- `--duration-fast`
- `--ease-standard`

## Keyboard and ARIA
- Container `role="tablist"` with `aria-label`; each tab `role="tab"` with `aria-selected` and `aria-controls` naming its panel; each panel `role="tabpanel"` with `aria-labelledby` naming its tab.
- One tab stop (roving `tabindex`): the selected tab has `tabindex="0"`, the others `-1`.
- Left and Right move between tabs and wrap; Home and End go to the first and last tab; Tab moves from the tablist into the panel.
- Each tab is at least `--size-target-min` tall and wide.

## Khmer text
- Under `:lang(km)` set `line-height: var(--line-height-khmer)` and `letter-spacing: 0`.
- Tabs grow from their minimum height and never have a fixed height; labels wrap onto two lines instead of truncating.
- The tablist scrolls sideways when tabs do not fit, and the focus ring is drawn inside the tab so it is not clipped.

## Do and don't
- Do keep tab labels to one or two words in the product's own terms (Details, Payments, History).
- Do mark the current tab with weight and an indicator as well as colour.
- Don't nest tabs inside tabs.
- Don't put a link to another page in a tab; use nav.

## Variables to add
- --tabs-indicator-bg: nearest --color-border-focus (underline of the current tab)
