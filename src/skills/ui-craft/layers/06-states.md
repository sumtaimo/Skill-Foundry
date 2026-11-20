# Layer 06: States and edge cases

0. **Whole product screen, no foundation, no defaults requested**: ask the one fixed question of Layer 03, step 3, and write no code until it is answered.
1. **Missing target / vague prompt**: Ask concise questions per Layer 03 (`target surface`, `stack`, `brand tokens`) without guessing speculative pages.
2. **Sibling skill mismatch (`R-ui-craft-17`)**: Return the matching redirect sentence from Layer 01 without emitting unrequested code.
3. **Partial existing tokens**: Consume existing `--*` variables untouched and add only missing glass/gradient/z-index tokens in a small additive block rather than rewriting user tokens.
4. **Loading state**: Render dimension-matched skeletons (`min-height` / explicit grid tracks) so content reveal causes zero Cumulative Layout Shift (`CLS`), and pause shimmer animation under `@media (prefers-reduced-motion: reduce)`.
5. **Empty search / filtered state**: Render an explicit empty panel naming what matched nothing and provide a `Reset filters` / `Clear search` secondary button with `>= 44x44px` hit target.
6. **Error / offline state**: Render inline feedback beside the failing component (`role="alert"` or `role="status"`), keep entered user input intact, and include a clear `Retry` trigger.
7. **Command palette (`⌘K`) edge cases**: Trap/manage keyboard focus inside the open dialog, close cleanly on `Escape` or backdrop click, restore focus to the invoking button on close, and handle zero matches cleanly.
8. **Responsive collapse (`390px` phone)**: Stack multi-column bento grids cleanly to `1fr`, allow horizontal tables inside `.table-wrap { overflow-x: auto }`, and collapse desktop horizontal nav items into a `44x44px` mobile drawer button or bottom dock.
9. **Role-scoped CSS-only worker (`UX_DESIGNER`)**: Write all CSS rules, tokens, keyframes and `[data-state="loading|empty|error|active"]` selectors into the stylesheet, and place the exact required DOM attributes/classes in the Layer 08/09 `Markup Handoff Contract`.
10. **Non-Latin / Khmer text**: Apply ONE body `line-height: 1.6` (`var(--line-height-khmer)` when `design/` has it) and `letter-spacing: 0` under `:lang(km)`; never let the negative heading tracking reach Khmer. Use no other Khmer line-height value. For multi-line body copy, avoid fixed tiny heights (`overflow: hidden` with tight `px` height) so ascenders/diacritics never clip.
