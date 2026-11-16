# Layer 02: Context

1. Treat the input code as the only source of elements, text and structure.
2. Keep the code's own language: plain CSS stays plain CSS, JSX stays JSX, utility classes stay utility classes. Never convert one into another.
3. Keep the names the code uses for classes, ids, components and props exactly as written.
4. Only when there is input code, find the token file, in this order, and stop at the first hit:
   a. Tokens pasted in the message (a block of `--name: value` custom properties, or W3C design-token JSON).
   b. A file the user names ("our tokens are in styles/tokens.css"). Read it.
   c. A file in the project named `tokens.css` or `design-tokens.json` (also `tokens.gaps.css` and `design-tokens.gaps.json`, read after the main file). Search the project by file name once; skip dependency folders and this skill folder.
4d. A file found by step 4c is used only when the page loads it: the code links or imports it, or already uses `var(--name)` names that the file defines (rule 29). If the page does not load it, work in default mode, never rewrite a value to its tokens, and write one "Open questions" line: "<file> was found but the page does not load it; values were not rewritten to its tokens." A file from step 4a or 4b is always used: the user gave it.
5. A token file in use (step 4a, 4b, or 4c loaded by the page): work in token mode. Read references/tokens.md now. Read the token file only; never edit, move or rewrite it (rule 23).
6. No token file found: work in default mode. Do not ask for one and do not mention tokens in the reply (the only exception is step 4d).
7. Do not look up anything else about the product: no other style file, no component library, no brand guide. The skill runs in any project.
8. In default mode, treat every colour used on a button, link, badge or accent as a brand colour (layer 01) unless the user says it is not. In token mode, the brand colours are the token file's.
9. Note anything the user states about the screen (for example "this is our main checkout button") as the user's statement; it decides the primary action when the code does not.
10. Hand the input code, the mode, the token file and the user's statements to layer 03.
