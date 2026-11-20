# Layer 07: Checks

Run every check silently. Never write their results, a tick list, a "---" line or any sentence before the report: the report already holds the checks, and the first character of the reply is the "#" of its heading.

Checks anyone can run by search, in any project:

1. The engine exited 0. If it did not, the output is not finished.
2. Search design-tokens.json and tokens.css for each given hex, in lowercase six-digit form. Each appears unchanged (path c: in your existing file, unchanged).
3. Search tokens.css (or tokens.gaps.css) for "prefers-color-scheme: dark", `[data-theme="dark"]` and "prefers-reduced-motion". Each appears once or more when the set includes colour roles, dark mode and motion.
4. Search every output file for "@import", "http", "url(" and "<link". None may appear.
5. Read every ratio in the report: each is a number with ":1", each text row says pass, and the Needs column is 4.5:1 for text and 3:1 for borders and focus rings.
6. Search every output file and the reply for the name of any brand the user compared to. It must not appear.
7. On path c, compare each existing file with how it was before: it must be byte for byte the same, and no gap file may define a name the existing files define (also not in a dark, reduced-motion or density block).
7a. On path c, a family with 1 or 2 of the user's tokens is listed in the report as partly present, with the tokens that were added; the neutral scale lists the project's greys and their steps, or says why the default scale was used.
7c. With the modern ask, search tokens.css for `--glass-bg`, `--glass-blur`, `--r-xs`, `--r-xl: 16px`, `--z-sticky`, `--z-toast`, `--glow`, `--btn-gloss` and `--font-weight-medium: 500`; without it, none of them appears.
7b. The engine ran as one plain command; if it could not, the open question says so plainly.

7d. Path d: `check --dir <project>/design` exits 0 (CHECK PASSED), design/BRIEF.md exists, tokens.css has `:lang(km)` with `letter-spacing: 0`, and no variable is written by hand: variables.json, tokens.css and design-tokens.json are the engine's output.
7e. After a `set`, the printout names the variable, how many values follow and that every contrast pair passes; after a REFUSED, the files are the same as before.

Reviewer checklist, answered yes or no (the same list is in references/README.md):

8. The archetype fits the user's words, and the why line says which words.
9. The brand colour looks like the brand: same hue; it is the primary action fill, or, for a mid-tone, the fill is the nearest darker step of the same hue and the report says so with both ratios.
10. The reply is the report in the layer 08 format.

Hand the answers to layer 08 for the quality bar and to layer 10 for the record.
