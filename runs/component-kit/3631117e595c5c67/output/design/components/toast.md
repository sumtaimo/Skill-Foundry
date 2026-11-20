# Toast

## Purpose
Tells the person that something just happened without interrupting them, for example "Invoice 0042 sent" or "Payment could not be saved", with an optional single action such as Undo or Try again.

## When not to use
- A message that must be answered before going on: use dialog.
- A message tied to one field: use the input's error text.
- Permanent status of a record (Paid, Overdue): use badge.
- A long or important explanation: put it in the page, not in something that disappears.

## Anatomy
1. Region: `<div>` fixed to a screen corner holding the toasts, present in the page from the start.
2. Toast: `<div role="status">` (or `role="alert"` for errors) with the status colours.
3. Message: a `<p>` of one or two short sentences.
4. Action (optional): a `<button type="button">` such as Undo or Try again.
5. Dismiss: a `<button type="button" aria-label="Dismiss">` with a close icon.

## Variants and sizes
| Variant | Use |
|---------|-----|
| info (default) | neutral news: "Draft saved" |
| success | something finished: "Invoice sent" |
| warning | needs attention soon: "Invoice is 7 days overdue" |
| danger | a failure: "Payment could not be saved" |

| Size | Height | Padding |
|------|--------|---------|
| one size | grows from `--control-height-md` | `--space-12` block, `--space-16` inline |

## States
### Default
Background `--color-info-bg-subtle` (or the success, warning, danger set), border `--border-width-hairline` in `--color-info-border`, text `--color-info-text`, radius `--radius-md`, shadow `--shadow-3`; enters with `--duration-base` and `--ease-enter`, leaves with `--duration-fast` and `--ease-exit`.
### Hover
The dismiss and action buttons show `--color-surface-subtle` behind them. Hovering the toast pauses its timer.
### Focus-visible
A ring of `--border-width-focus` in `--color-border-focus` on the action and dismiss buttons. The toast itself never takes focus. Focus on a button inside it pauses the timer.
### Active
The action or dismiss button pressed: background `--color-surface-sunken`.
### Disabled
Not applicable: a toast is a message and is not disabled. An action already used becomes `disabled` with `--color-text-disabled` while its request runs.
### Loading
For a task in progress ("Sending invoice") the toast keeps its width and height, locked, and shows a line in `--color-text-muted` with `aria-busy="true"`; when it ends the text is replaced in the same box, so nothing shifts.
### Empty
Not applicable: a toast without a message is never shown. The region with no toasts renders nothing and takes no space.
### Error
A failure uses the danger set: `--color-danger-bg-subtle`, `--color-danger-border`, `--color-danger-text`, `role="alert"`, and it stays until dismissed. It carries a "Try again" button that repeats the failed action (retry); the message says what failed in plain words.

## Variables used
- `--color-info-bg-subtle`
- `--color-info-border`
- `--color-info-text`
- `--color-success-bg-subtle`
- `--color-success-border`
- `--color-success-text`
- `--color-warning-bg-subtle`
- `--color-warning-border`
- `--color-warning-text`
- `--color-danger-bg-subtle`
- `--color-danger-border`
- `--color-danger-text`
- `--color-surface-subtle`
- `--color-surface-sunken`
- `--color-text-muted`
- `--color-text-disabled`
- `--color-border-focus`
- `--border-width-hairline`
- `--border-width-focus`
- `--shadow-3`
- `--radius-md`
- `--radius-sm`
- `--control-height-md`
- `--size-target-min`
- `--space-8`
- `--space-12`
- `--space-16`
- `--space-24`
- `--font-family-sans`
- `--font-size-sm`
- `--font-weight-strong`
- `--line-height-body`
- `--line-height-khmer`
- `--duration-fast`
- `--duration-base`
- `--ease-enter`
- `--ease-exit`

## Keyboard and ARIA
- `role="status"` (polite) for info, success and warning; `role="alert"` for danger. The region exists in the page before any toast is added so screen readers announce it.
- A toast never takes focus. A toast with an action stays until dismissed; others last long enough to read (at least 6 seconds, longer for longer text) and pause while hovered or focused.
- Dismiss is a real `<button>` with `aria-label="Dismiss"`; Escape dismisses the toast whose button holds focus.
- Action and dismiss buttons are at least `--size-target-min` in size.
- Under `prefers-reduced-motion: reduce` the toast appears without sliding.

## Khmer text
- Under `:lang(km)` set `line-height: var(--line-height-khmer)` and `letter-spacing: 0`.
- The toast grows in height with the message; no fixed height, no truncation, the message wraps.
- The focus ring on the buttons is not clipped by the toast's `overflow`.

## Do and don't
- Do say what happened in the product's words ("Invoice 0042 sent to Sokha Trading").
- Do keep one action at most.
- Don't use a toast for an error the person must fix; keep it where they can find it again.
- Don't stack more than three toasts; queue the rest.

## Variables to add
- --toast-bg: nearest --color-info-bg-subtle (resting toast background)
- --z-toast: nearest --shadow-3 (stacking above the page; tokens.css has no z-index layers)
