---
name: ui-polish
description: Runs a final polish pass on the HTML and CSS (or JSX) of a finished UI, fixing spacing, type, contrast, visual hierarchy, interactive states and layout against fixed numeric rules, and returns the numbered fixes plus the polished code with every word of text kept. Use when asked for a "final polish", a "pixel pass", or to "make this screen look cleaner" on code the user pastes. Do not use to design a new screen from scratch, to rewrite UI copy (use copy-tight), or for a full accessibility audit.
version: 1.0.0
---

# ui-polish

Takes the code of a finished screen and makes it look finished: on-scale spacing, a clear type scale,
readable contrast, one primary action, and visible hover, focus and disabled states.
Every fix cites a numbered rule, and the polished code keeps the same text, the same elements and the same brand hue.

## When to use

- Use when someone pastes HTML, CSS, JSX or Tailwind markup of a finished screen and asks for a final polish or pixel pass.
- Use when someone says a screen "looks off", "looks cluttered" or "needs a clean-up" and gives the code.
- Do not use to design a new screen, page or flow; reply with the fixed sentence in layer 06, step 2.
- Do not use to rewrite or shorten text; say so with the fixed sentence in layer 06, step 3, then polish the code with the text unchanged.
- Do not use without code; ask for it with the exact sentence in layer 03, step 3.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: confirm the goal and the defined terms. [layers/01-intent.md](layers/01-intent.md)
2. Context: the pasted code is the only source. [layers/02-context.md](layers/02-context.md)
3. Inputs: code is required; ask when it is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: inventory, check each rule, fix, rebuild the code. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: no code, new design, text rewrite, already polished, frameworks. [layers/06-states.md](layers/06-states.md)
7. Checks: text kept, numbers on scale, contrast, states, format. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact reply format and its quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the reader receives. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

The numeric scales, the contrast table and the reviewer checklist are in [references/README.md](references/README.md).

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
- R-ui-polish-11: NEVER change a brand colour's hue; to fix contrast, change only its lightness or the text colour on it.
- R-ui-polish-12: NEVER add external fonts, scripts, stylesheets, images or links.
- R-ui-polish-13: The reply MUST follow the format in layer 08: Fixes, Polished code, Not changed, Open questions.
- R-ui-polish-14: With no code, the skill MUST ask for it with the exact sentence and NEVER produce fixes.
- R-ui-polish-15: A request to design a new screen MUST get the exact decline sentence and no code.
- R-ui-polish-16: The skill MUST have the ten core layers, each linked from SKILL.md.
- R-ui-polish-17: The skill MUST be self-contained; NEVER name a repository path in SKILL.md, layers or references.
- R-ui-polish-18: SKILL.md MUST stay within 150 lines, with frontmatter name, description and semver version.
- R-ui-polish-19: Every relative link MUST point to a file inside the skill folder.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Every visible text string in the input appears unchanged in the polished code.
- Every spacing and font-size number in the polished code is on its scale.
- Every changed colour pair has its ratio written, and it meets rule 4.
- Answer the reviewer items in [references/README.md](references/README.md); any "no" blocks the reply.

## Review

A designer or front-end developer opens the polished code next to the original and confirms each numbered fix, that no text changed, and that the brand still looks like the brand.

## Output

One Markdown reply: a heading, a one-line summary, numbered fixes grouped by area, a contrast table, the full polished code in one code block, "Not changed" and "Open questions". The exact shape is in [layers/08-output.md](layers/08-output.md).
