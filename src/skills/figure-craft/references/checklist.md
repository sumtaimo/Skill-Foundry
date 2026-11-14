# figure-craft checklist

Answer every item yes or no. Any "no" blocks release. Items marked with a lint id are also enforced by `engine/lint.mjs`.
Item 33a applies only to the skill's own demo.

## 1. Intent
0. Does the figure start from the goal the user stated, restated in one sentence?
1. Is the size chosen and stated: Figure, Hero or Page?
2. Does the figure explain exactly one idea, stated in one sentence before drawing?
3. Is the object a concrete thing a reader can picture (stack, lever, ledger, cell, device, pipeline)?

## 2. Tokens
4. Is every fill and stroke a `var(--...)` token, `none` or `url(#...)`? (L6-raw-colour)
5. Do light and dark both come from `TOKENS` via `tokensCss()`, with no per-figure overrides?
6. Does the figure read correctly in both light and dark themes?

## 3. Layout
7. Is there a contents rail with numbered sections (01 / 09 style)?
8. Is there exactly one rail marker for the current state, never zero, never two?
9. Is there one reading column for body text?
10. Do margin notes fall below the text they annotate on phones?
11. Are facts shown as label/value cards, not prose lists?
12. Is the phone gutter 16px?
13. Is there no horizontal scroll at 390px wide?

## 4. Figure (isometric)
14. Is every support drawn before what rests on it? (L1-painter-order)
15. Does each face detail lie in the face plane, inside the face, centred, and away from rounded corners? (L2-face-detail)
16. Are labels placed in side columns with a minimum vertical gap of 13? (L3-label-overlap)
17. Do leader lines avoid crossing other solids? (L4-leader-crosses-solid)
18. Do all shapes and label text sit inside the viewBox? (L5-outside-viewbox)
19. Are there no decorative dots on solids (every dot carries meaning and is named in a label or the copy)?
20. Is the projection the shared one (`project`, C = 0.866), with no hand-drawn skew?
19o. Are inside parts and contents drawn inside the body, seen through an open side, and is the opened body filled as it is really used? (L18-outside-container)
19p. Can the reader turn the object (orbit), and do the back sides carry their real features?
19q. Does the figure have at least twelve face details, three per labelled part and one per solid on average, with no large bare solid? (L19-sparse)
19r. Are all outlines the engine's one hairline weight?
19k. Does every solid have the material of the real thing, with at least two materials in the figure? (L17-one-material)
19l. Is every labelled part at least 40% visible, with the inside shown through glass or one open side? (L16-hidden-part)
19m. Does the object look like the real thing from outside (body, door or cover, handle, feet, controls), not only its machinery?
19n. Are light and shadow only the engine's, with nothing drawn by hand?
19f. Is the object drawn as full solid volumes, not only thin slabs? (L13-no-solid-body)
19g. Is every part the idea needs declared in `requiredParts`, drawn and labelled, with none dropped? (L14-missing-part)
19h. Does every part above the ground rest on or touch another part? (L15-floating)
19i. At rest, are all labels and leaders hidden, and does hovering, focusing or tapping each part reveal its label with motion?
19j. Does a card under the figure name every labelled part?
19e. Does every labelled part cover at least 3% of the drawing? (L12-part-too-small)
19a. Does every labelled part carry its required number of face details (one, plus one per 8% of the drawing, up to three), each a real feature of the real part? (L11-no-detail)
19b. Are parts on one base at least 4 apart and spread over at least 30% of the base? (L10-crowded)
19c. Is the moving part labelled? (L9-moving-unlabelled)
19d. Is the SVG exactly what the engine rendered, with nothing edited by hand?
20a. Do label leader lines end with no dot, circle or marker at either end?
20b. Is rendered label text at least 11 CSS px at a 390px wide viewport?
20c. Does the theme toggle's visible text name the theme it switches to (Dark theme when light shows, Light theme when dark shows, including dark from `prefers-color-scheme`), with `aria-pressed` reflecting the dark state?

## 5. Motion
21. Does motion tell one story and loop?
22. Does every animation move only along an iso axis of the surface it rests on (one non-zero component, z = 0 when resting)? (L8-motion-off-axis)
23. Is the figure still under `prefers-reduced-motion: reduce`? (L7-motion-no-reduced)
24. Does the still frame still explain the idea without motion?

## 6. Copy
25. Is each sentence one idea, in plain words?
26. Is the copy short (labels a few words, captions one or two sentences)?
27. Does the page state only facts it keeps true itself (no "tests passing" badges, no live counts, no version claims it does not update)?
28. Does every language use the same set of keys, with none missing or extra?

## 7. Verification
29. Do build and lint pass with zero errors?
30. Are geometry checks (lint L1-L19, and `lintViews` for the orbit) run on the rendered model?
31. Were screenshots taken in light, dark, 390px width and a second language?
32. Is the browser console free of errors?
33. Was reduced motion checked to show a still figure?
33a. Do `examples/demo.html`, `preview/example.html` and `preview/cover.svg` equal, byte for byte, what `buildDemo()` in `examples/build-demo.mjs` returns?

## 8. Review
34. Has someone other than the author read the figure and stated the idea back correctly?
35. Are all lint warnings either fixed or justified in writing?
