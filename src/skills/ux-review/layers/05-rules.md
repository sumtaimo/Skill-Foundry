# Layer 05: Rules

1. Apply every rule in RULES.json (R-ux-review-1 to R-ux-review-30).
2. R-ux-review-1 to R-ux-review-13 and R-ux-review-26 to R-ux-review-30 are the usability rules (26 to 30 are the shape rules: first screen, section order, page length, duplicated blocks, calls to action). Each finding cites exactly one of them by its full id. Never cite a rule that is not in this list, and never invent a rule.
3. R-ux-review-14: search the input for each evidence quote. A finding whose quote is not in the input is removed or becomes an open question.
4. R-ux-review-15: each finding has one severity, written as "S1 Blocker", "S2 Major", "S3 Minor" or "S4 Note", set by layer 04, clause 9.
5. R-ux-review-16: each finding has one recommendation of one sentence, in words only.
6. R-ux-review-17: the reply contains no code block, no corrected code and no selector to paste. A request to fix code gets the sentence of layer 06, clause 2.
7. R-ux-review-18: the reply reports no contrast ratio, focus style, spacing scale, type scale, semantic element, ARIA attribute or screen-reader output, and rewrites no text. These appear only in the fixed "Not reviewed" lines.
8. R-ux-review-19: with nothing to review, the reply is the exact sentence of layer 03, clause 5.
9. R-ux-review-20: a request to design a new screen gets the exact sentence of layer 06, clause 3.
10. R-ux-review-21: the reply follows layer 08.
11. R-ux-review-31: a break that depends on a script or run-time content not in the input is capped at S3 (layer 04, clause 9a).
12. R-ux-review-32: one template on many pages gives one finding that lists the pages (layer 04, clause 9b).
13. R-ux-review-22 to R-ux-review-25 apply to the skill folder itself; a run of the skill does not change them.
