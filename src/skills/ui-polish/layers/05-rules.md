# Layer 05: Rules

1. Apply every rule in RULES.json (R-ui-polish-1 to R-ui-polish-15, R-ui-polish-20 to R-ui-polish-24, and R-ui-polish-26 to R-ui-polish-31) to the polished code.
2. R-ui-polish-1 and R-ui-polish-2: every spacing and font-size number is on its scale; body text is 16 px or more. In token mode the number is written as its token.
3. R-ui-polish-3: body line-height 1.5, heading line-height 1.2 to 1.3, paragraph max-width 65ch or less.
4. R-ui-polish-4: every text colour pair meets 4.5:1 (or 3:1 for large text), and every ratio in the reply is a number with ":1".
5. R-ui-polish-5: exactly one primary action.
6. R-ui-polish-6 and R-ui-polish-7: every interactive element has hover, :focus-visible and, if it can be disabled, disabled styles, and is at least 44 by 44 px.
7. R-ui-polish-8: at most two font weights.
8. R-ui-polish-9: every transition is off under prefers-reduced-motion: reduce.
9. R-ui-polish-10: the visible text list of layer 04, step 1 is identical in the polished code; no element is added or removed, except one style block when the input had none (layer 03, step 6).
10. R-ui-polish-11: each brand colour keeps its hue. In token mode the brand colours are the token file's, so a raw colour replaced by its role token is not a hue change.
11. R-ui-polish-12: no external font, script, stylesheet, image or link is added. A link to the token file is added only when the input already had one.
12. R-ui-polish-13 to R-ui-polish-15: the reply follows layer 08, or the exact sentences of layers 03 and 06.
13. R-ui-polish-20: in token mode, no raw value is left where the token file has a matching token.
14. R-ui-polish-21: in token mode, the primary action uses the primary-fill tokens.
15. R-ui-polish-22: every `var(--name)` in the polished code is a name from the token file or from the input code; each value with no matching token is a plain value and has its "Open questions" line.
16. R-ui-polish-23: the token file is not edited and no token is redefined in the polished code; each failing token pair is in the contrast table and in "Open questions" with its ratio.
17. R-ui-polish-24: every ratio came from the script, or from the table when commands cannot run, and the reply says which.
18. R-ui-polish-26: the script ran as one plain command with its full path, or the reply plainly says it could not run.
19. R-ui-polish-27 and R-ui-polish-28: no passing pair has a lower ratio after; no passing value was swapped for a different token value; each such case is an Open questions line with both values.
20. R-ui-polish-29: a token file found but not loaded by the page was reported, not used.
21. R-ui-polish-30 and R-ui-polish-31: overflow fixes quote their measurement and exist only when a screenshot or sheet was given; pages with one shared stylesheet got one stylesheet patch plus deltas.
22. R-ui-polish-16 to R-ui-polish-19 and R-ui-polish-25 apply to the skill folder itself; a run of the skill does not change them.
