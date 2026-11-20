# Layer 01: Intent

Defined terms used across every layer:

- **Target surface**: the page, shell, navigation system, component, or AI action bar the user asks to design and build.
- **Stack mode**: the detected or requested delivery format — `vanilla` (semantic HTML + modular CSS custom properties + minimal progressive JS, default when no framework exists), `tailwind` (HTML/JSX using semantic CSS vars), `react` (JSX/TSX components with project dependencies only), or `css-handoff` (CSS/tokens only + a structured DOM contract when the agent role cannot edit HTML/JSX).
- **Token source**: the project's foundation if present (`design/tokens.css` from `design-system` first, then other `tokens.css`, `design-tokens.json`, `globals.css`); only when none exists AND the user chose defaults (Layer 03, step 3), this skill's neutral-first default block in `references/surfaces-and-tokens.md`, which uses the same names as `design-system`.
- **Whole product screen**: a full page or app screen (landing page, dashboard, login, pricing, settings, onboarding) that sets the look of the product. A single component (button, card, navbar, palette, AI bar, state set) is not one.
- **Lifecycle states**: default, hover, `:focus-visible`, active/selected, disabled, loading skeleton, empty/filtered with reset, and inline error with retry.
- **Role mode**: whether the caller is a full-stack `DEV_ENGINEER` / standalone user (writes complete markup, styles, and interaction logic) or a stylesheet-scoped `UX_DESIGNER` worker (writes CSS/tokens and hands a `Markup Handoff Contract` to `DEV_ENGINEER`).

Steps:

1. Read the user's request carefully and identify the **target surface**, **product domain**, **audience**, and **goal** in their own words.
2. Check whether the request actually belongs to a sibling skill:
   - Polishing pasted finished code without redesign (a pixel pass, drift fix or token swap on finished code) -> stop with: `"This skill designs and builds new UI screens and components; for a pixel pass on finished code, use ui-polish."`
   - Building tokens, variables, a palette or a brand foundation (also changing one variable everywhere) -> stop with: `"This skill builds UI components and screens; to build or change tokens and variables (tokens.css / design-tokens.json), use design-system."`
   - WCAG markup audit only -> stop with: `"For a markup-only accessibility audit, use a11y-audit."`
   - Copy shortening only -> stop with: `"For rewriting UI copy without changing structure, use copy-tight."`
   - Isometric object diagram -> stop with: `"For isometric technical object diagrams, use figure-craft."`
3. If the request has no target surface or goal at all (for example only `"make something cool"`), proceed to Layer 03 and ask focused clarifying questions instead of guessing features.
4. State the concrete success outcome: responsive light/dark modern UI matching modern spatial, contrast, motion, keyboard and lifecycle standards in the project's stack.
5. Hand the intent and defined terms to Layer 02.
