# Layer 05: Rules

Machine-checked by `engine/lint.mjs`:

1. R-figure-craft-1: Supports MUST be drawn before what rests on them, and a part sitting on another MUST declare `rests` (`L1-painter-order`).
2. R-figure-craft-2: Face details MUST lie in their face plane and inside the face; dots stay away from rounded corners (`L2-face-detail`).
3. R-figure-craft-3: Labels MUST sit in side columns at least 13 apart, NEVER overlap, and number at most 9 on hover or 5 when always shown (`L3-label-overlap`).
4. R-figure-craft-4: Leader lines NEVER cross another solid without a written justification (`L4-leader-crosses-solid`, warning).
5. R-figure-craft-5: Shapes and label text MUST stay inside the viewBox (`L5-outside-viewbox`).
6. R-figure-craft-6: Every fill and stroke MUST be `var(--...)`, `none` or `url(#...)`; NEVER a raw colour (`L6-raw-colour`).
7. R-figure-craft-7: Every animation MUST stop under `prefers-reduced-motion: reduce` (`L7-motion-no-reduced`).
8. R-figure-craft-8: Motion MUST move along one iso axis and NEVER lift in z while resting (`L8-motion-off-axis`).
9. R-figure-craft-14: The moving part MUST be labelled (`L9-moving-unlabelled`).
10. R-figure-craft-15: Parts on one base MUST either touch (one joined structure) or be at least 4 apart, and span at least 30% of the base (`L10-crowded`, warning).
11. R-figure-craft-16: Every labelled part MUST carry face details that identify it: one, plus one per 8% of the drawing it covers, up to three (`L11-no-detail`).
11a. R-figure-craft-19: Every labelled part MUST cover at least 3% of the drawing (`L12-part-too-small`).
11b. R-figure-craft-20: The object MUST be drawn as full solid volumes; thin slabs alone NEVER stand for the object (`L13-no-solid-body`).
11c. R-figure-craft-21: The parts the idea needs MUST be declared in `requiredParts`, drawn and labelled; a needed part is NEVER dropped to pass another check (`L14-missing-part`).
11e. R-figure-craft-24: A labelled part MUST stay at least 40% visible; glass or one open side shows the inside (`L16-hidden-part`).
11f. R-figure-craft-25: Solids MUST have the material of the real thing, at least two in a figure of three or more solids (`L17-one-material`).
11g. R-figure-craft-27: Inside parts and contents MUST be drawn inside the body and marked `inside`; NEVER beside it (`L18-outside-container`).
11h. R-figure-craft-28: The figure MUST carry at least twelve face details, three per labelled part and one per solid on average, and no large solid may be bare (`L19-sparse`).
11d. R-figure-craft-22: A part above the ground MUST rest on or touch another part; NEVER float (`L15-floating`).

Checked by the reviewer with the checklist:

12. R-figure-craft-9: A figure MUST explain exactly one idea with one concrete object.
13. R-figure-craft-10: Motion MUST tell one story and the still frame MUST explain the idea alone.
14. R-figure-craft-11: Copy MUST be one idea per sentence and NEVER claim facts the page does not keep true.
15. R-figure-craft-12: The page MUST work in light and dark, at 390px with no horizontal scroll, with no console errors.
16. R-figure-craft-13: Dots MUST carry meaning and be named in a label or the copy; NEVER decorate solids.
17. R-figure-craft-17: Every detail MUST be a real feature of the real part, and the SVG is NEVER edited by hand after the engine rendered it.
18. R-figure-craft-18: The figure MUST start from the goal the user stated; a missing goal is asked for, NEVER invented.
19. R-figure-craft-23: Labels and leaders MUST stay hidden until their part is hovered, focused or tapped, then appear with motion; the page MUST name every part in a card so nothing depends on hover.
20. R-figure-craft-26: The object MUST look like the real thing from outside, in its real materials, with light and shadow from the engine only; NEVER show only the machinery, and NEVER draw a shadow or highlight by hand.
21. R-figure-craft-29: The reader MUST be able to turn the object (four views from `renderViews` in `orbitHtml`), and the back sides MUST carry their real features.
22. R-figure-craft-30: Outlines MUST be the engine's one hairline weight; NEVER a heavier stroke.
23. R-figure-craft-31: Every part MUST sit where it sits in the real object, with the source of that fact recorded; an unsure location is asked about or marked as an assumption, NEVER guessed silently.
