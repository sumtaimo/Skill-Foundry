---
name: ui-craft
description: Designs and builds modern 2026 product UI screens, adaptive navigation, command palettes, bento layouts, micro-interactions, complete lifecycle states and inline AI bars in HTML/CSS, Tailwind or React/JSX. Use when asked to "design a screen", "build a UI component", "make a navbar or sidebar", "build a command palette", "create a landing page or dashboard", or "add AI prompt bars and loading/empty/error states". Do not use to polish pasted finished code (use ui-polish), create standalone design-token files (use design-system), draw isometric technical objects (use figure-craft), audit accessibility only (use a11y-audit) or rewrite copy only (use copy-tight).
version: 1.0.0
---

# UI Craft

Build modern, calm, tactile product interfaces (floating glass headers, command-first navigation, crisp gradients, responsive bento grids, GPU-friendly motion and complete lifecycle states) tailored to the project's stack and design tokens.

## Delivery rule (read first)

Your reply MUST contain the complete, runnable code as fenced code blocks: every file, start to end, never an excerpt. A file path, a summary or a published page is not a delivery. Do not call any publish, artifact, page-hosting or upload tool unless the user asked for one, even if your environment suggests it; if you also write files, paste their full contents in the reply.

## When to use

- Use when: designing or building a new screen, page, dashboard, navigation bar, sidebar rail, floating dock, command palette (`Ctrl+K` / `Cmd+K`), button system, bento grid, interactive component state set, or inline AI action bar.
- Do not use when: polishing pasted finished code without structural changes (use `ui-polish`), generating a standalone `tokens.css` / `design-tokens.json` system (use `design-system`), drawing an isometric object illustration (use `figure-craft`), running a markup-only WCAG audit (use `a11y-audit`), or tightening copy only (use `copy-tight`).

## Procedure

Follow the layers in order. Each layer holds the detailed steps for that phase.

1. Intent: [layers/01-intent.md](layers/01-intent.md)
2. Context: [layers/02-context.md](layers/02-context.md)
3. Inputs: [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: [layers/04-flow.md](layers/04-flow.md)
5. Rules: [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: [layers/06-states.md](layers/06-states.md)
7. Checks: [layers/07-checks.md](layers/07-checks.md)
8. Output: [layers/08-output.md](layers/08-output.md)
9. Handoff: [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: [layers/10-evidence.md](layers/10-evidence.md)

References (read as needed for copy-ready 2026 patterns):
- Overview and token map: [references/README.md](references/README.md)
- Surfaces, glass, gradients, typography and z-index: [references/surfaces-and-tokens.md](references/surfaces-and-tokens.md)
- Navigation, command palettes and lifecycle states: [references/navigation-and-states.md](references/navigation-and-states.md)
- Motion physics and inline AI bars: [references/motion-and-ai.md](references/motion-and-ai.md)
- Worked examples: [examples/README.md](examples/README.md)

## Rules

- `R-ui-craft-1`: Detect the project's stack and existing token files (`tokens.css`, `design-tokens.json`, Tailwind, React/JSX, or vanilla HTML/CSS) before writing code; NEVER import unrequested external libraries or fonts unless already present or requested, defaulting to zero-dependency HTML/CSS + CSS custom properties.
- `R-ui-craft-2`: Define semantic light and dark tokens (`--bg`, `--surface`, `--surface-2`, `--glass-bg`, `--line`, `--line-strong`, `--fg`, `--muted`, `--accent`) and pair translucent glass surfaces (`backdrop-filter`) with opaque contrast fallbacks so text stays legible across scroll positions.
- `R-ui-craft-3`: Body/normal text pairs MUST reach at least `4.5:1` contrast and large headings (>= 24 px or bold >= 19 px), borders and focus rings MUST reach at least `3:1` in both light and dark modes.
- `R-ui-craft-4`: Typography MUST keep body text >= `16px` (`line-height: 1.5`, prose `<= 65ch`), purposeful weights (`400, 500, 600, 700`), `-0.02em` heading tracking, and `font-variant-numeric: tabular-nums` on counters, shortcuts, prices and timestamps.
- `R-ui-craft-5`: Spacing MUST follow a `4px` base grid with consistent radius tokens (`4 / 6 / 10 / 14 / 16 px` or project `--r-*` tokens), `1px` hairline borders, and an explicit `--z-*` layering scale with these exact names: `--z-sticky`, `--z-dropdown`, `--z-command`, `--z-modal`, `--z-toast` (no shortened names like `--z-cmd` or `--z-nav`).
- `R-ui-craft-6`: Interactive controls MUST provide >= `44x44px` click/tap targets, tactile hover/active press feedback, restrained top-edge highlights/gradients, and at most ONE primary filled action per view.
- `R-ui-craft-7`: Multi-view or searchable interfaces MUST support command-first navigation (`Ctrl+K`/`Cmd+K` palette built on the native `<dialog>` element with `showModal()`, not a `div role="dialog"`, arrow-key/Enter/Escape handling, visible `<kbd>` badges) when command navigation fits the screen.
- `R-ui-craft-8`: Navigation rails, floating glass bars, sticky section bars (with active sliding pill indicators) and mobile drawers MUST NEVER collide with content or cause horizontal overflow at `390px` or `1440px`.
- `R-ui-craft-9`: Micro-interactions MUST animate GPU-friendly properties (`transform`, `opacity`) with fast crisp curves (`120ms`–`240ms`) and honor `@media (prefers-reduced-motion: reduce)` by disabling spatial motion while keeping clear state changes.
- `R-ui-craft-10`: Interactive and data-backed views MUST implement all applicable lifecycle states: default, hover, `:focus-visible`, active/selected, disabled, dimension-locked loading skeleton, empty search/filter with reset, and inline error with retry.
- `R-ui-craft-11`: AI prompt or assistant surfaces MUST provide quick-action chips, live streaming/thinking feedback, a stop/cancel trigger, and undo/revert or diff-review controls.
- `R-ui-craft-12`: Inline SVG icons and UI accents MUST bind colours strictly to `currentColor` or `var(--...)` with `aria-hidden="true"` on decorative icons, never raw hardcoded hex colours inside SVG elements.
- `R-ui-craft-13`: Responsive layouts MUST prevent clipped headings, overflowing tables or sideways scroll from `390px` mobile to `1440px+` desktop, preserving legible script metrics for non-Latin text such as Khmer.
- `R-ui-craft-14`: Interactive UI MUST use native semantic HTML (`button`, `a href`, `dialog`, `nav`, `main`, `label`) with high-contrast `:focus-visible` outlines (>= `2px`), NEVER stripping focus indicators without replacement.
- `R-ui-craft-15`: When running in a CSS-only role (`UX_DESIGNER` without HTML/JSX write access), write complete modular CSS/tokens and output an explicit `Markup Handoff Contract` (`selector`, `role/aria-*`, `data-state`, DOM structure) for engineering; otherwise ship complete working UI code.
- `R-ui-craft-16`: NEVER invent fake user metrics, fabricated testimonials or unrequested features; clearly label placeholder slots or ask for missing product copy.
- `R-ui-craft-17`: Refuse requests meant purely for `ui-polish`, `design-system`, `a11y-audit`, `copy-tight` or `figure-craft` with a single concise redirect sentence.
- `R-ui-craft-18`: When a browser runner is available, verify rendered output at `1440px` and `390px` in light and dark modes under reduced motion with zero console errors and zero horizontal scroll.

## Checks

- Machine checks: verify `1440px` and `390px` viewports in light and dark modes (`scrollWidth <= clientWidth`, zero console/page errors), confirm `:root` and `[data-theme="dark"]` / `prefers-color-scheme: dark` tokens, confirm `--z-*` scale and `@media (prefers-reduced-motion: reduce)` exist, and check contrast pairs >= `4.5:1` (text) / `3:1` (large/UI).
- Reviewer checklist: verify one primary CTA per view, keyboard navigation and `:focus-visible`, full lifecycle states (loading skeleton, empty reset, error retry), zero invented product data, and `Markup Handoff Contract` if CSS-scoped.

## Review

Compare the produced UI code against `RULES.json` and [references/README.md](references/README.md). Verify every requirement in the user's request is present, contrast and reduced-motion safeguards hold, and no unrequested dependencies were added. Keep every reference relative inside this skill folder.

## Output

Produce the **UI Craft summary**, **Architecture & Tokens applied**, complete runnable **Code** (HTML/CSS, Tailwind, JSX, or CSS + `Markup Handoff Contract`), **States & Keyboard behavior**, **Accessibility & Visual check results**, and **Open questions / Next skill handoff**. See [layers/08-output.md](layers/08-output.md).
