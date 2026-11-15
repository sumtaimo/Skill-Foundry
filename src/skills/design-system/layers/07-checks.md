# Layer 07: Checks

Checks anyone can run by search, in any project:

1. The engine exited 0. If it did not, the output is not finished.
2. Search design-tokens.json and tokens.css for each given hex, in lowercase six-digit form. Each appears unchanged (path c: in your existing file, unchanged).
3. Search tokens.css (or tokens.gaps.css) for "prefers-color-scheme: dark", `[data-theme="dark"]` and "prefers-reduced-motion". Each appears once or more when the set includes colour roles, dark mode and motion.
4. Search every output file for "@import", "http", "url(" and "<link". None may appear.
5. Read every ratio in the report: each is a number with ":1", each text row says pass, and the Needs column is 4.5:1 for text and 3:1 for borders and focus rings.
6. Search every output file and the reply for the name of any brand the user compared to. It must not appear.
7. On path c, compare each existing file with how it was before: it must be byte for byte the same.

Reviewer checklist, answered yes or no (the same list is in references/README.md):

8. The archetype fits the user's words, and the why line says which words.
9. The brand colour looks like the brand: same hue; it is the primary action fill, or, for a mid-tone, the fill is the nearest darker step of the same hue and the report says so with both ratios.
10. The reply is the report in the layer 08 format.

Hand the answers to layer 08 for the quality bar and to layer 10 for the record.
