# Layer 01: Intent

Defined terms, used by every layer:

- **Token**: one named design value, for example `--space-16: 16px` or `color.primary.500`.
- **Token set**: every token this skill writes, in design-tokens.json and tokens.css.
- **Scale**: the steps 50 to 900 of one colour (neutral also has 950), from lightest to darkest.
- **Given colour**: a hex code the user types in the request. It is never changed (R-design-system-1).
- **Role**: a token named for its job, not its colour, for example `--color-text-muted` or `--color-surface-default`. Roles have a light and a dark value.
- **Text pair**: a text role on a surface role it can sit on. Every text pair has a contrast ratio.
- **Archetype**: one of the five style presets in references/archetypes.md, each a set of numbers.
- **Existing system**: tokens the user's project already has (CSS custom properties, a tokens JSON file) or that the user pastes.
- **Gap**: a token group (references/README.md, "Groups") that the existing system does not have.
- **Engine**: `engine/tokens.mjs` in this skill folder.

Steps:

1. Read the request and find the goal in the user's words, for example "design system", "design tokens", "palette from this hex", "theme" or "dark mode".
2. Decide the path:
   - **Path a**: the request gives one or more hex colours.
   - **Path b**: the request gives no hex but describes a mood, a style, a kind of product or "like <brand>".
   - **Path c**: the project has an existing system (layer 02) or the user pastes one. Path c wins over a and b; a given hex or style then only shapes the gaps.
3. If the request asks for a screen, page, mockup or flow, go to layer 06, step 2.
4. If no path applies, go to layer 03, step 5.
5. State the intent in one sentence: one consistent token set that keeps the given colours, passes every contrast minimum and covers every group.
6. Hand the path and the defined terms to layer 02.
