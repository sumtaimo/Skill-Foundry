# Navigation, Command Palettes & Complete Lifecycle States

## 1. Floating Glass Navbar & Sliding Active Pill

- Keep header `position: sticky` or `fixed` at `top: 16px` (`12px` mobile), `z-index: var(--z-sticky)`, `max-width: 1120px`, centered, `border-radius: var(--r-xl)`.
- Add subtle glass styling only after scrolling past `8px` (`[data-scrolled="true"]` or `.is-scrolled`). Never let sticky bars overlap anchor targets (`scroll-margin-top: 96px` on section headings).
- Active pill navigation: position a `.nav-indicator` pill (`background: var(--surface-2)`, `border-radius: var(--r-sm)`, `z-index: -1`) behind the active tab and animate `transform` + `width` cleanly when switching tabs.

## 2. Mobile Collapse (< 768px) & Sidebar Icon-Rail

- Collapse desktop horizontal nav links below `768px` into a `44x44px` menu toggle button opening an accessible drawer/popover (`aria-expanded`, `Escape` to close) OR a bottom floating dock keeping `<= 5` primary items.
- For workspace sidebars (`240px` expanded -> `64px` icon-rail), keep every icon link `>= 44x44px`, add visible `aria-label` + tooltip on focus/hover when collapsed, and prevent `100vw` horizontal overflow inside `.app-shell`.

## 3. Command-First Navigation (`Ctrl+K` / `Cmd+K`)

Include command palette markup, keyboard bindings, and empty search handling whenever building an app shell, search bar, or multi-view dashboard:

- Trigger button shows concise label + `<kbd>Ctrl K</kbd>` (`Cmd+K` indicator, `tabular-nums`, `min-height: 44px`).
- Native `<dialog>` (or `role="dialog" aria-modal="true" aria-label="Command menu"`) at `z-index: var(--z-command)` with `backdrop: rgba(0, 0, 0, 0.35)`.
- Keyboard contract: `Cmd/Ctrl + K` toggles open/focus on search input; `ArrowDown` / `ArrowUp` moves `[aria-selected="true"]` row cleanly; `Enter` activates the highlighted item; `Escape` closes and returns focus to trigger button.
- Zero results: show crisp empty state (`No matching commands for "..."`) with a `Clear search` button that resets the filter and restores full results.

## 4. Mandatory 8 Lifecycle States

Every interactive/data surface MUST cover:

1. **Default**: calm resting surface, clear `1px` `--line` border.
2. **Hover**: crisp `--line-strong` border / subtle `-1px` button lift (no layout shift).
3. **Focus-Visible**: `outline: 2px solid var(--focus); outline-offset: 2px;` on every interactive control (`button`, `a`, `input`, `summary`, `[role="option"]`).
4. **Active / Selected**: highlighted pill (`--surface-2`, `aria-current="page"` or `aria-selected="true"`, `font-weight: 500`) + tactile active press (`transform: translateY(0)`).
5. **Disabled**: `opacity: 0.5; cursor: not-allowed; pointer-events: none;` with clear `disabled` or `aria-disabled="true"`.
6. **Loading Skeleton**: fixed-height placeholder blocks (`min-height` matching loaded card/row so `CLS = 0`), `aria-busy="true"`, soft shimmer gradient disabled under `prefers-reduced-motion: reduce`.
7. **Empty Search / Filter State**: clear icon (`aria-hidden="true"`), honest summary sentence, and primary/secondary `Reset filters` button (`>= 44x44px`).
8. **Inline Error State**: `role="alert"`, `--danger` text on `--danger-bg`, concise recovery action (`Retry` button), preserving user input untouched.
