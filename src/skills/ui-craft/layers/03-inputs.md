# Layer 03: Inputs

Required inputs:

- At least one **target surface** or product goal (for example `"SaaS floating glass header with ⌘K search"`, `"billing dashboard with bento metrics and loading/empty states"`, or `"inline AI assistant bar"`).

Optional inputs (use sensible 2026 defaults if omitted, and list assumptions in Layer 08/10):

- Existing design tokens (`tokens.css`, `design-tokens.json`, brand hex). Default when omitted: neutral light-first palette (`#ffffff` / `#f8fafc` / `#09090b`) with balanced dark mode (`#09090b` / `#18181b` / `#fafafa`) and high-contrast slate accent.
- Preferred tech stack (`vanilla`, `tailwind`, `react`). Default when omitted and no `package.json` exists: zero-dependency semantic HTML + modular CSS + minimal progressive JS.
- Target breakpoints or layout density. Default: mobile `390px` through desktop `1440px+`, container `max-width: 1120px` (marketing/showcase) or fluid `1440px` (app workspace).
- Real domain text, labels, and state copy. Never fabricate fake testimonials, fake dollar metrics, or fake user ratings; use clearly marked structural placeholders if domain copy is not supplied.

Steps:

1. Verify whether the request names a concrete UI surface or goal.
2. If neither a surface nor actionable context is given, reply briefly asking:
   - What screen, component, or flow are we building and who uses it?
   - Which stack should it output (`HTML/CSS`, `Tailwind`, or `React/JSX`), and do you have brand colours or `tokens.css`?
   Stop and wait for answers without generating speculative mock screens.
   Keep this reply under 10 lines in total: one short opening sentence, then the two questions (one example list at most). Do not explain the skill, its layers, or why you are asking; no headings, no separators (`---`), no sub-bullets.
3. Otherwise map every provided input into **Required tokens**, **Components needed**, and **Interactive states needed**, then pass them to Layer 04.
