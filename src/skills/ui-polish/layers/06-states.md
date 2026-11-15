# Layer 06: States and edge cases

1. No code, or a description only: reply with the exact sentence of layer 03, step 4. Produce nothing else.
2. A request to design a new screen, page or flow (for example "design a pricing page from scratch"): reply exactly "This skill polishes a finished UI; it does not design new screens." Produce no code and no fixes. If the user also pasted code of a finished screen, polish that code after the sentence.
3. A request to rewrite, shorten or translate text, together with code: write the exact sentence "This skill does not rewrite text; every word is kept as written." as the first line, then polish the code as usual with every word unchanged.
4. Code that already meets every rule: write "No fixes needed." as the summary line, write "None." under Fixes, and write "Unchanged." under Polished code instead of the code.
5. Utility-class markup (for example Tailwind): fix it with classes of the same library and keep the markup in the same syntax (layer 02, step 2).
6. JSX or a component: keep props, handlers and component names exactly as written; change only styles and class names.
7. A colour that cannot reach the ratio without changing hue (for example white text on a light yellow button): keep the button colour and change the text colour to a dark shade of the same hue, and say so in the fix.
8. A dark theme in the input: check ratios against the dark background, and use the dark column of the contrast table.
9. More than one screen in the input: polish each, with one Fixes section per screen, numbered 1 to N across all screens.
10. A section with nothing in it: write "None." under its heading. Never drop a heading.
11. Reply in a short, direct tone; do not apologise or explain the fixed sentences further.
