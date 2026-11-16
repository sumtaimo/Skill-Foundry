---
name: ui-polish
description: Runs a final polish pass on the HTML and CSS (or JSX) of a finished UI, fixing spacing, type, contrast, visual hierarchy, interactive states and layout against fixed numeric rules, and returns the numbered fixes plus the polished code with every word of text kept. When the project has a design-token file (tokens.css or design-tokens.json), the fixes use its tokens instead of raw values. Use when asked for a "final polish", a "pixel pass", or to "make this screen look cleaner" on code the user pastes. Do not use to design a new screen from scratch, to rewrite UI copy (use copy-tight), to create or change design tokens (use design-system), or for a full accessibility audit.
version: 1.0.0
---

# ui-polish

Takes the code of a finished screen and makes it look finished: on-scale spacing, a clear type scale,
readable contrast, one primary action, and visible hover, focus and disabled states.
Every fix cites a numbered rule, and the polished code keeps the same text, the same elements and the same brand hue.
When the project has a design-token file, every fix is written with its tokens, and the file itself is never edited.
Contrast ratios come from the script in this folder, not from hand arithmetic.

## When to use

- Use when someone pastes HTML, CSS, JSX or Tailwind markup of a finished screen and asks for a final polish or pixel pass.
- Use when someone says a screen "looks off", "looks cluttered" or "needs a clean-up" and gives the code.
- Use it the same way when the project has design tokens: say where the token file is, or paste it; the skill also looks for one.
- Do not use to design a new screen, page or flow; reply with the fixed sentence in layer 06, step 2.
- Do not use to rewrite or shorten text; say so with the fixed sentence in layer 06, step 3, then polish the code with the text unchanged.
- Do not use to create, complete or correct design tokens; this skill only reads a token file.
- Do not use without code; ask for it with the exact sentence in layer 03, step 3.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: confirm the goal and the defined terms. [layers/01-intent.md](layers/01-intent.md)
2. Context: the pasted code is the source; find the token file, if there is one. [layers/02-context.md](layers/02-context.md)
3. Inputs: code is required; ask when it is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: inventory, check each rule, fix with tokens or default scales, run the contrast script, rebuild the code. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: no code, new design, text rewrite, already polished, frameworks, token edge cases. [layers/06-states.md](layers/06-states.md)
7. Checks: text kept, numbers on scale, contrast, states, token names, format. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact reply format and its quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the reader receives. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

The default scales, the contrast table and the reviewer checklist are in [references/README.md](references/README.md).
How a token file is read and which token each value gets is in [references/tokens.md](references/tokens.md).
The contrast script is `engine/contrast.mjs` in this folder (Node.js, no dependencies, read-only). Run it exactly as in references/README.md, "Contrast script".

## Rules

- R-ui-polish-1: Every spacing value (margin, padding, gap) MUST be on the spacing scale 4, 8, 12, 16, 24, 32, 48, 64 px.
- R-ui-polish-2: Every font size MUST be on the type scale 12, 14, 16, 18, 20, 24, 30, 36, 48 px; body text MUST be at least 16 px.
- R-ui-polish-3: Body text MUST have line-height 1.5; headings MUST have line-height 1.2 to 1.3; paragraphs MUST have max-width 65ch or less.
- R-ui-polish-4: Normal text MUST reach a contrast of 4.5:1 against its background; text of 24 px or more, or bold of 19 px or more, MUST reach 3:1; every reported ratio MUST be written as a number with ":1".
- R-ui-polish-5: A view MUST have exactly one primary action; other actions MUST use a secondary or quiet style.
- R-ui-polish-6: Every interactive element MUST have a hover style, a :focus-visible outline of at least 2 px, and, when it can be disabled, a disabled style.
- R-ui-polish-7: Every click or tap target MUST be at least 44 by 44 px.
- R-ui-polish-8: A page MUST use at most two font weights; emphasis MUST come from weight or colour before size.
- R-ui-polish-9: Every transition or animation MUST be turned off under prefers-reduced-motion: reduce.
- R-ui-polish-10: NEVER change, add or remove any visible text, and NEVER add or remove elements, features or content.
- R-ui-polish-11: NEVER change a brand colour's hue; to fix contrast, change only its lightness or the text colour on it. With a token file, the brand colours are the ones the token file gives.
- R-ui-polish-12: NEVER add external fonts, scripts, stylesheets, images or links.
- R-ui-polish-13: The reply MUST follow the format in layer 08: Fixes, Polished code, Not changed, Open questions.
- R-ui-polish-14: With no code, the skill MUST ask for it with the exact sentence and NEVER produce fixes.
- R-ui-polish-15: A request to design a new screen MUST get the exact decline sentence and no code.
- R-ui-polish-16: The skill MUST have the ten core layers, each linked from SKILL.md.
- R-ui-polish-17: The skill MUST be self-contained; NEVER name a repository path in SKILL.md, layers or references.
- R-ui-polish-18: SKILL.md MUST stay within 150 lines, with frontmatter name, description and semver version.
- R-ui-polish-19: Every relative link MUST point to a file inside the skill folder.
- R-ui-polish-20: With a token file, every colour, spacing, font size, line-height, font weight, radius, control size, focus width and duration in the polished code that has a matching token MUST be written as var(--name) of that token, chosen by references/tokens.md; the token scales replace the default scales of rules 1 to 3.
- R-ui-polish-21: With a token file, the one primary action MUST use the file's primary-fill tokens (in a design-system file: --color-action-primary-bg with --color-action-primary-text), unless its own pair already passes with a different value (rule 28).
- R-ui-polish-22: NEVER write a token name that is not in the token file; a value with no matching token MUST stay a plain value and MUST be listed under Open questions.
- R-ui-polish-23: NEVER edit, rewrite or redefine the token file or a token; a token pair below its ratio MUST be reported with its ratio under Contrast and under Open questions.
- R-ui-polish-24: Every ratio MUST come from the contrast script when commands can be run, else from the reference table; the reply MUST say which with the fixed sentence of layer 08, step 6.
- R-ui-polish-25: The contrast script MUST use only the Node.js standard library, MUST never write a file, and MUST agree with the reference table.

- R-ui-polish-26: The contrast script MUST be run as ONE plain command with the full path to the script (`node <skill folder>/engine/contrast.mjs ...`), with no `cd`, no shell variable, no pipe and no `;` or `&&`; when it cannot run, the reply MUST say so plainly with the fixed sentence of layer 08, step 6.
- R-ui-polish-27: NEVER lower the contrast of a pair that already passes rule 4: the ratio after a change MUST be equal to or higher than before; a passing pair is kept as written.
- R-ui-polish-28: NEVER replace an existing value that passes with a different token value; keep it and list it under Open questions with both values, so the owner decides. A general request such as "use tokens, not raw values" is not that decision; only an answer that names the value is.
- R-ui-polish-29: Token mode starts only when the user gives the token file or the page loads it; when a token file is found but the page does not load it, the skill MUST say so under Open questions and NEVER rewrite values to its tokens.
- R-ui-polish-30: When a screenshot or measurement sheet is given, text that overflows or overlaps its box MUST be fixed (layer 04, step 12a) and each fix MUST cite the measurement; without one, the skill NEVER claims to have checked order, page length, overflow or overlap.
- R-ui-polish-31: When several pages share one stylesheet, the reply MUST give one patch for the stylesheet plus a short delta per page, NEVER one full patch per page.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Every visible text string in the input appears unchanged in the polished code.
- Every spacing and font-size number in the polished code is on its scale, or is a token of the token file.
- Every var(--name) in the polished code is in the token file or was in the input code.
- Run `node <skill folder>/engine/contrast.mjs <text> <background> ...` (one plain command, no `cd`, no variables, no pipe) for every colour pair; use the table only when commands cannot run, and say so.
- No pair that passed before has a lower ratio after; no passing value was replaced by a different token value.
- Every changed colour pair has its ratio written, and it meets rule 4.
- Answer the reviewer items in [references/README.md](references/README.md); any "no" blocks the reply.

## Review

A designer or front-end developer opens the polished code next to the original and confirms each numbered fix, that no text changed, and that the brand still looks like the brand.

## Output

One Markdown reply: a heading, a one-line summary, numbered fixes grouped by area, a contrast table with the line that says where the ratios come from, the full polished code in one code block, "Not changed" and "Open questions". The exact shape is in [layers/08-output.md](layers/08-output.md).
