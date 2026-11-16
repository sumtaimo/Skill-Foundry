# Layer 03: Inputs

Required:

1. The input code of the finished screen: markup and the styles it uses (inline, in a style block, or as utility classes).

Optional:

2. The name of the screen, used in the reply heading. Without it, name the screen after its main heading text.
3. Which action is the primary action, in the user's words.
4a. A screenshot or a measurement sheet of the screen (text boxes with their width and height, scrollWidth and clientWidth, page length, section order, overlaps). It is the only way this skill sees order, page length, overflow and overlap (rule 30). Without one, the skill works from the code alone and never says it checked those.
4. The token file: pasted, named by path, or found in the project (layer 02, step 4). The skill never needs another skill to be installed; it only reads the file.

When one is missing:

5. No code at all, or only a description or a screenshot description of the screen: reply exactly "Paste the HTML and CSS of the finished screen you want polished." Stop. Produce no fixes, no headings and no code. This holds even when a token file is given: tokens alone are not a screen.
6. Markup with no styles at all: polish it by adding one style block that applies the scales (the token scales in token mode), and say in "Open questions" that the original styles were not given.
7. Never fill a gap with a guess about colours, fonts, components or token names the code and the token file do not show.
8. A token file that cannot be read or has no tokens in it: work in default mode and say so in "Open questions".
9. Several pages that share one stylesheet (the same `<link>` or the same pasted CSS): polish the stylesheet once (layer 04, step 12b).
10. Hand the input code and the optional inputs to layer 04.
