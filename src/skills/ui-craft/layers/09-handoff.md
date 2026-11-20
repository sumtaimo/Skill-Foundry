# Layer 09: Handoff

1. Deliver the Layer 08 output directly (or write strictly to the scoped target files when executing inside a workspace task).
2. **Handoff inside multi-agent teams (`controller -> lead -> workers`)**:
   - If running as CSS-only `UX_DESIGNER`: hand the `Markup Handoff Contract` cleanly to `DEV_ENGINEER` with exact CSS class names, `data-state` attributes, ARIA roles, and target IDs so markup matches styles 1:1.
   - Hand completed UI code to `a11y-audit` when deep WCAG HTML attribute audit is requested, `copy-tight` when microcopy needs tightening, or `QA_AUDITOR` / `test-planner` for responsive + keyboard regression checks.
3. Never edit `design/` files or standalone token source files; note any missing or additive UI-layer token in Open Questions (`design-system` owns tokens and variables, including changing one everywhere).
4. Hand final recorded evidence summary to Layer 10.
