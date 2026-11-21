---
name: design-system
description: Builds one complete, consistent design-token set from a brand hex colour, a description of the style, or the project's existing tokens (filling only the gaps, never overwriting), and writes design-tokens.json (W3C format), tokens.css with light and dark mode, and a report with every contrast ratio. Also sets up the design foundation of a product in a design folder as variables with three tiers (primitive, semantic, component), and changes one variable across the whole product with every contrast pair checked. Use when asked for a "design system", "design tokens", a "colour palette from this hex", a "theme", "dark mode tokens", a "design foundation" or "design variables", or to change a colour, radius or size everywhere. Do not use to design or build a screen or page, or to polish finished UI code (use ui-polish).
version: 1.2.1
---

# design-system

Your whole reply is the engine report (for a set, check or explain on its own, the command's printout; when the same request also needed `init`, the `init` report first, then a blank line and each printout): its first line is "## Design system: <name>". Write no sentence, tick list or "---" before it and nothing after "### Open questions", even when asked for a short report of files, checks and open items (the report is that report).

Turns the goal a user states into one token set any agent or developer can read: colour scales that keep
the user's hue, semantic roles for light and dark mode with every text pair checked for contrast, type,
spacing, control sizes, radius, shadow, border widths, motion, breakpoints and density.
The numbers come from the engine in this folder, so the same input always gives the same tokens.
For a whole product it keeps one source, `design/variables.json`: every value is one variable with a tier
(primitive value, semantic role, component use), so changing one value reaches everything that follows it, in light and dark.

## When to use

- Use when someone gives one or more hex colours and asks for a design system, tokens, a palette or a theme.
- Use when someone describes a mood or style ("calm", "bold and playful", "like a banking app") and wants tokens.
- Use when a project already has tokens and someone asks to complete them (dark mode, motion, missing scales).
- Use when someone wants the design foundation of a product, or asks to change, check or explain a variable (path d).
- Do not use to design a screen, page or flow; reply with only the fixed sentence in layer 06, step 2, and nothing else.
- Do not use to polish finished screen code; that is ui-polish.
- Without a colour, a style or an existing system, ask the brief of layer 03, step 7, once.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: find the path (colour, style, existing system or foundation) and the defined terms. [layers/01-intent.md](layers/01-intent.md)
2. Context: look for an existing design system in the project. [layers/02-context.md](layers/02-context.md)
3. Inputs: colours with roles, archetype, font, product name; the brief when nothing is given. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: run the engine, or build by hand from the references when it cannot run. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: no input, a screen request, "like a brand", many colours, existing files. [layers/06-states.md](layers/06-states.md)
7. Checks: hue kept, every pair's ratio, files, no external links. [layers/07-checks.md](layers/07-checks.md)
8. Output: the three files, the reply and the quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: how the user loads the tokens and what to use next. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

The fixed scales, the contrast formula and the token names are in [references/README.md](references/README.md).
The five style archetypes, each a set of numbers, are in [references/archetypes.md](references/archetypes.md).
The engines are `engine/tokens.mjs` (paths a to c) and `engine/variables.mjs` (path d) in this folder (Node.js, no dependencies). Run them exactly as in layer 04.

## Rules

- R-design-system-1: The user's hex colour MUST appear unchanged in its scale and as --color-brand, and every step MUST aim at its exact hue; saturation MUST ease toward the palest and darkest steps and steps 400 to 700 MUST NOT be more colourful (HSL chroma) than the input; rounding to hex MAY move the hue at most 1 degree at steps 300 to 800 and 4 degrees at the other steps (inputs with 25% saturation or more). NEVER change a given hue.
- R-design-system-2: Every colour scale MUST have the steps 50 to 900; the neutral scale MUST also have 950.
- R-design-system-3: Every text role MUST reach 4.5:1 on every surface it is meant for, in light and in dark mode; borders and focus rings MUST reach 3:1; every ratio MUST be written as a number with ":1".
- R-design-system-4: The output MUST be design-tokens.json in the W3C design tokens format ($type, $value, aliases in braces) and tokens.css with custom properties.
- R-design-system-5: tokens.css MUST give dark values both under prefers-color-scheme: dark and under a data-theme="dark" attribute, and MUST let data-theme="light" force light.
- R-design-system-6: The set MUST cover colour, typography, spacing, control heights with a 44 px minimum target, radius, shadow, border widths, motion with reduced motion, breakpoints and density.
- R-design-system-7: Spacing MUST use the scale 0, 4, 8, 12, 16, 24, 32, 48, 64 px; font sizes MUST come from 12, 14, 16, 18, 20, 24, 30, 36, 48 px; body text MUST be 16 px or more with line-height 1.5; a set MUST use exactly two font weights, plus `--font-weight-medium: 500` only in the optional modern group.
- R-design-system-8: NEVER add external fonts, imports, links or scripts; use the system font stack unless the user names a font (also a web font), and then put that name first in the stack; the user loads its files.
- R-design-system-9: With an existing design system of the user's, NEVER change, rename or delete an existing token or file (design/variables.json, which this skill owns, changes only through `set`, R-design-system-24); write only the missing groups to design-tokens.gaps.json and tokens.gaps.css, and report existing pairs below 4.5:1 as kept.
- R-design-system-10: A style MUST map to exactly one of the five archetypes in references/archetypes.md, and the report MUST name it and say why in one line.
- R-design-system-11: NEVER write the name of a brand or product the user compares to ("like <brand>") in any file or in the reply; map it to an archetype and call it "the product you named".
- R-design-system-12: With no colour, no style, no product words and no existing system, the skill MUST reply with the brief of layer 03, step 7, and NEVER write files; when design/BRIEF.md exists it MUST NOT ask the brief again.
- R-design-system-13: A request to design a screen, page or flow MUST get the exact decline sentence of layer 06, step 2, and no files and no markup.
- R-design-system-14: The reply MUST be the report in the layer 08 format, ending with Open questions.
- R-design-system-15: The skill MUST have the ten core layers, each linked from SKILL.md.
- R-design-system-16: The skill MUST be self-contained; NEVER name a repository path in SKILL.md, layers or references.
- R-design-system-17: SKILL.md MUST stay within 150 lines, with frontmatter name, description and semver version.
- R-design-system-18: Every relative link MUST point to a file inside the skill folder.
- R-design-system-19: The engine MUST be run as ONE plain command with the path of the script (`node <skill folder>/engine/tokens.mjs ...`): no `cd`, no shell variable, no pipe, no `;` or `&&`; when it cannot run, the reply MUST say so plainly, on the first line after the heading and in an open question, and the tokens are built by hand.
- R-design-system-20: On path c a family (colour scale, roles, type, spacing, control, radius, shadow, border width, motion, breakpoint, density) counts as present only when at least 3 of the user's tokens match it; with 1 or 2 matches it is partly present, and its missing tokens MUST be written to the gap files by name, NEVER over a user token, also not in the dark, reduced-motion or density blocks.
- R-design-system-21: On path c the neutral scale MUST keep the project's own greys (colour tokens of low chroma, found by value) at their value, fill the other steps by interpolation and be checked like any scale; when roles on them cannot reach the minimums, the default tinted scale is used and the report says why.

- R-design-system-22: Only when the user asks for modern effects (glass or frosted panels, glow, glossy buttons, z-index layers, the ui-craft tokens), the engine MUST be run with `--modern`, which adds the optional modern group with these exact names: `--glass-bg`, `--glass-blur`, `--r-xs` to `--r-xl` (4, 6, 10, 14, 16 px), `--z-sticky`, `--z-dropdown`, `--z-command`, `--z-modal`, `--z-toast`, `--glow`, `--btn-gloss` and `--font-weight-medium: 500`; every 1.0.0 token stays as it was, and without that ask NEVER add the group.

- R-design-system-23: A product foundation (path d) MUST be written by `engine/variables.mjs init` to design/variables.json, tokens.css, design-tokens.json, CHANGES.md, STATUS.md and the report, from design/BRIEF.md; every value MUST be one variable of tier primitive, semantic or component, and the agent NEVER writes these files by hand.
- R-design-system-24: A change to a foundation MUST go through `set`; it MUST check every contrast pair in light and dark first and write nothing when one fails, and a value the user set MUST be kept when the brand colour changes later.
- R-design-system-25: `check --code` MUST only report raw colours, raw sizes and a variable used for the wrong job in web files; it NEVER edits project code.
- R-design-system-26: Khmer text MUST get one line-height variable (1.6) and `letter-spacing: 0` under `:lang(km)`, written by `init`.
- R-design-system-27: After `init` the skill MUST stop: the reply is the report, and STATUS.md names the next step; it NEVER builds a screen in the same turn.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Run the engine as one plain command (`node <skill folder>/engine/tokens.mjs ...`, no `cd`, no shell variable, no pipe): it exits 0 only when every text pair meets its minimum, and prints every ratio.
- Search design-tokens.json and tokens.css for each hex the user gave; each appears unchanged.
- Search tokens.css for "prefers-color-scheme: dark", `[data-theme="dark"]` and "prefers-reduced-motion".
- Search the output for "@import", "http" and "url(": none may appear.
- Answer the reviewer items in [references/README.md](references/README.md); any "no" blocks the reply.

## Review

A designer reads the report and checks that the brand colour is untouched, the archetype fits the words the
user used, and every contrast ratio passes; a developer loads tokens.css in a page and switches data-theme.

## Output

Three files in the folder the user names (else the current folder): `design-tokens.json`, `tokens.css`,
`design-system-report.md` (with an existing system: `design-tokens.gaps.json`, `tokens.gaps.css` and the report).
A product foundation (path d) is written to a `design` folder: `BRIEF.md`, `variables.json`, `tokens.css`, `design-tokens.json`,
`CHANGES.md`, `STATUS.md` and the report.
The reply is the report, word for word, with nothing before or after it. Its first line is the "## Design system:" heading: never a line before it such as "All checks pass", "Engine exited 0" or "Here is the report". When a request asks for a short report of
the files, checks and open items, this report is that report: it lists them in that order.
The exact shape is in [layers/08-output.md](layers/08-output.md).
