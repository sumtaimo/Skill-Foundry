# Layer 06: States and edge cases

1. No code, or a description only: reply with the exact sentence of layer 03, step 5. Produce nothing else.
2. A request to design a new screen, page or flow (for example "design a pricing page from scratch"): reply exactly "This skill polishes a finished UI; it does not design new screens." Produce no code and no fixes. If the user also pasted code of a finished screen, polish that code after the sentence.
3. A request to rewrite, shorten or translate text, together with code: write the exact sentence "This skill does not rewrite text; every word is kept as written." as the first line, then polish the code as usual with every word unchanged.
4. Code that already meets every rule: write "No fixes needed." as the summary line, write "None." under Fixes, and write "Unchanged." under Polished code instead of the code.
5. Utility-class markup (for example Tailwind): fix it with classes of the same library and keep the markup in the same syntax (layer 02, step 2).
6. JSX or a component: keep props, handlers and component names exactly as written; change only styles and class names.
7. A colour that cannot reach the ratio without changing hue (for example white text on a light yellow button; the script's `--suggest` says no shade reaches it): keep the button colour and change the text colour to a dark shade of the same hue, and say so in the fix.
8. A dark theme in the input: check ratios against the dark background, and use the dark column of the contrast table.
9. More than one screen in the input: polish each, with one Fixes section per screen, numbered 1 to N across all screens. When the screens share one stylesheet, follow layer 04, step 12b: one stylesheet patch plus a delta per page.
10. A section with nothing in it: write "None." under its heading. Never drop a heading.
11. Reply in a short, direct tone; do not apologise or explain the fixed sentences further.

Token mode:

12. A token pair that fails its ratio (for example muted text at 2.54:1): follow references/tokens.md, "A token pair that fails". Report it in the contrast table and in "Open questions"; never edit the token file, and never redefine the token in the polished code.
13. A value with no matching token (for example a purple badge when the file has no purple): keep the plain value, fix it by the default rules only if it breaks rule 4, and list it under "Open questions". Never write a token name the file does not have.
14. The code's primary button has a colour of another value than the token file's primary fill: if its own text and background pair already passes rule 4, keep it as written and write the Open questions line of layer 04, step 6g with both values and both ratios (rules 27 and 28); the primary-fill tokens are used only when the button's own colours fail, or are the same values. Never turn a passing near-black button into a brand-coloured one with a lower ratio.
15. A request to change, add or fix tokens ("also darken our muted token"): do not do it. Polish the code, and write in "Open questions": "This skill does not edit tokens; change the token file with a design-token skill or by hand."
16. Only a JSON token file and no CSS file: use the CSS names references/tokens.md gives for the JSON paths, and write in "Open questions" that the page must load those custom properties.
17. Code that already uses the tokens everywhere and meets every rule: reply as in step 4, "No fixes needed."
18. The token file has dark values: when the script can run, run each pair again with `--theme dark`. A pair that fails only in dark goes to "Open questions" with its ratio; the code is not changed for it.
19. The contrast script cannot run: follow layer 04, step 7, third point, and write the matching sentence of layer 08, step 6. Never stop or ask because the script cannot run.
20. A screenshot or measurement sheet is given with no code that explains it, or it shows a problem the code cannot fix (for example a font that is not loaded): fix what the code can, and write the rest under Open questions with the measurement.

