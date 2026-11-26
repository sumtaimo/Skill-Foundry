# Worked Examples

Gold-standard and verified playable single-file HTML outputs:

## Example 1 — Checkout Payment & 3DS Retry (`assets/examples/checkout-statechart.html`)

- **File:** [checkout-statechart.html](../assets/examples/checkout-statechart.html)
- **Prompt:** Create an interactive playable diagram of our checkout payment flow (`Cart Ready -> Authorizing -> 3DS Challenge -> Confirmed`, with `Card Declined` allowing up to 2 retries or `Cancel`). Auto-pick the best chart type, explain why, and include Light/Dark mode plus a `"Show the logic"` toggle.
- **Auto-picked type:** `Statechart` (guarded statuses, 3DS branch, bounded retry counter).
- **Features:** Self-contained HTML5, clickable nodes + event trigger buttons (`Submit`, `Require 3DS`, `Capture`, `Card Declined`, `Retry`, `Cancel`), Play/Step/Reset, Light/Dark toggle, `"Show the logic"` drawer syncing **Rules** and **Logic Flowchart**, and `@media (prefers-reduced-motion: reduce)`.
