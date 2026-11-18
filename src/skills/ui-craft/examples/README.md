# Examples

## Example 1: Modern Workspace Header, Command Palette (`⌘K`) & Lifecycle States

**Input:**
> Build a minimal workspace dashboard header with a frosted glass sticky bar, a `Ctrl+K` command search button, bento overview cards, and complete loading skeleton, empty filter, and inline error retry states in vanilla HTML and CSS.

**Output shape (excerpt):**
```markdown
## UI Craft: Workspace Shell & Command Bar

Stack: vanilla · Theme: light + dark · States: complete

### Architecture & Tokens
- Light/dark semantic tokens (`--bg`, `--surface`, `--surface-2`, `--glass-bg`, `--fg`, `--muted`, `--line`, `--r-*`, `--z-*`).
- Floating glass header (`z-index: var(--z-sticky)`) using `backdrop-filter: blur(20px) saturate(1.4)` with opaque fallback.
- Full 8 lifecycle states (`data-state="ready | loading | empty | error"`) + native `<dialog>` command palette (`z-index: var(--z-command)`).

### Code
...complete HTML, CSS, and keyboard JS...
```

## Example 2: Inline AI Prompt Bar (`React / Tailwind`)

**Input:**
> We use React + Tailwind with CSS variables. Build a compact floating AI action bar with quick-action chips, live streaming state + stop button, and undo after applying.

**Output shape:**
- Uses existing Tailwind classes (`bg-[var(--glass-bg)]`, `rounded-[var(--r-lg)]`, `min-h-[44px]`, `focus-visible:outline-2`) without importing unrequested animation/icon packages.
- Includes quick chips (`Summarize`, `Shorten`, `Fix tone`), `role="status"` streaming banner + `Stop`, and `Apply` / `Undo` bar.

## Example 3: CSS-Only `UX_DESIGNER` Role Mode

**Input:**
> [Role: UX_DESIGNER — stylesheet access only] Style a floating sub-navigation bar with sliding active pill and reduced-motion support.

**Output shape:**
- Full CSS tokens + `.subnav`, `.subnav-pill`, `.subnav-link[aria-current="page"]`, and `@media (prefers-reduced-motion: reduce)` rules.
- Followed by a crisp **Markup Handoff Contract** specifying exact HTML tags (`<nav aria-label="...">`, `<button aria-current="page">`, `.subnav-pill[aria-hidden="true"]`) for `DEV_ENGINEER`.

## Example 4: Out-of-Scope Redirect (`ui-polish` / `design-system`)

**Input:**
> Fix the uneven 13px padding and weak contrast on this finished settings HTML card; do not change the layout or words.

**Output:**
```text
This skill designs and builds new UI screens and components; for a pixel pass on finished code, use ui-polish.
```
