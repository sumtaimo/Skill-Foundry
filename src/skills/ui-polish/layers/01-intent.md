# Layer 01: Intent

Defined terms, used by every layer:

- **Input code**: the HTML, CSS, JSX or utility-class markup the user pastes in the message. It is the only source of elements and text.
- **Finished UI**: input code for a screen that already has its content and structure. Polishing changes how it looks, never what it says or contains.
- **Visible text**: every word a user of the screen can read: headings, labels, buttons, placeholders, alt text, aria-labels and titles.
- **Token file**: a file of design tokens the project already has: CSS custom properties (usually `tokens.css`) or W3C design tokens (usually `design-tokens.json`), pasted in the message or found in the project. This skill reads it and never edits it.
- **Token mode**: the way the skill works when there is a token file: fixes are written with the file's tokens. Without one the skill works in **default mode**, with its own scales.
- **Scale**: the fixed lists of allowed numbers. In default mode they are in references/README.md (spacing, type, line-height, weight); in token mode they are the values of the token file.
- **Matching token**: the token references/tokens.md gives for a value. A value with none is a **value with no matching token**.
- **Primary action**: the one button or link the screen most wants the user to press.
- **Brand colour**: any colour the input uses for buttons, links, accents or a logo. In token mode, the brand colours are the ones the token file gives.
- **Fix**: one change to the input code, tied to one rule id, with the value before and after.
- **Contrast script**: `engine/contrast.mjs` in this skill folder. It computes every ratio.

Steps:

1. Read the user's message and find the goal in their words, for example "final polish", "pixel pass" or "make this look cleaner".
2. Find the input code in the message. If there is none, go to layer 03 and ask for it.
3. State the intent in one sentence: make the finished UI meet every rule in RULES.json without changing its text, content or brand hue, using the project's tokens when it has them.
4. State the outcome that proves success: every fix cites a rule, every number is on its scale or is a token, every text ratio meets rule 4 and comes from the script or the table, and the text is identical.
5. Hand the intent and the defined terms to layer 02.
