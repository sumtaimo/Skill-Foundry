# Layer 03: Inputs

Required inputs:

- At least one **target surface** or product goal (for example `"SaaS floating glass header with ⌘K search"`, `"billing dashboard with bento metrics and loading/empty states"`, or `"inline AI assistant bar"`).

Optional inputs (use sensible modern defaults if omitted, and list assumptions in Layer 08/10):

- Existing design tokens (`design/tokens.css`, `tokens.css`, `design-tokens.json`, brand hex). Default when omitted AND the gate in step 3 allows it: the neutral default block in `references/surfaces-and-tokens.md` (same names as `design-system`).
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
3. **Cold-start gate.** It applies only when ALL of these are true: there is no `design/tokens.css`, the project has no other tokens (no `tokens.css`, `design-tokens.json`, theme file, `:root` variables or Tailwind theme), the request is for a **whole product screen** (Layer 01), and the user did not say "prototype", "just use defaults" or similar. Then do not write code and do not pick a palette. Reply with exactly this one question and nothing else (no headings, no code, under 6 lines in total):
   `This is a whole product screen and the project has no design foundation yet. Use defaults for a prototype, or build the foundation first with design-system? (defaults / foundation)`
   Answer "defaults" -> go on with the default block and record "assumed defaults, no foundation" in Layer 10. Answer "foundation" -> reply with one sentence that `design-system` builds it and that `design/STATUS.md` will name this skill as the next step; write no code. A single component, an explicit prototype or defaults request, an existing token file or brand hex in the request, or a `design/tokens.css` all skip the gate.
4. Otherwise map every provided input into **Required tokens**, **Components needed**, and **Interactive states needed**, then pass them to Layer 04.
