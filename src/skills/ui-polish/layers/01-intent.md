# Layer 01: Intent

Defined terms, used by every layer:

- **Input code**: the HTML, CSS, JSX or utility-class markup the user pastes in the message. Nothing else is a source.
- **Finished UI**: input code for a screen that already has its content and structure. Polishing changes how it looks, never what it says or contains.
- **Visible text**: every word a user of the screen can read: headings, labels, buttons, placeholders, alt text, aria-labels and titles.
- **Scale**: the fixed lists of allowed numbers in references/README.md (spacing, type, line-height, weight).
- **Primary action**: the one button or link the screen most wants the user to press.
- **Brand colour**: any colour the input uses for buttons, links, accents or a logo.
- **Fix**: one change to the input code, tied to one rule id, with the value before and after.

Steps:

1. Read the user's message and find the goal in their words, for example "final polish", "pixel pass" or "make this look cleaner".
2. Find the input code in the message. If there is none, go to layer 03 and ask for it.
3. State the intent in one sentence: make the finished UI meet every rule in RULES.json without changing its text, content or brand hue.
4. State the outcome that proves success: every fix cites a rule, every number is on its scale, every text ratio meets rule 4, and the text is identical.
5. Hand the intent and the defined terms to layer 02.
