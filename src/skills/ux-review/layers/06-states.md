# Layer 06: States and edge cases

1. Nothing to review (no code, no description of the screen or flow): reply exactly "Paste the screen's code or describe the flow step by step." Write nothing else.
2. A request to fix, correct, refactor or rewrite the code: write the exact sentence "This skill reviews usability; it does not change code." as the first line. Then, if an input is present, give the review as usual, with recommendations in words and no code. If no input is present, add the sentence of clause 1 as the second line and stop.
3. A request to design, sketch, wireframe or build a new screen, page or flow: reply exactly "This skill reviews an existing screen or flow; it does not design new screens." Produce no design, no layout and no list of what the screen should contain. Only if the user also gave an existing screen or flow, review that after the sentence.
4. A request to rewrite, shorten or improve text (labels, messages, errors): write the exact sentence "This skill does not rewrite text; wording is quoted as written." as the first line, then give the review. A finding may say what a message must state (R-ux-review-6); it never gives the new words.
5. A request to check contrast, colours, focus styles, spacing, type sizes, semantic HTML, ARIA, keyboard order or screen-reader output: write the exact sentence "Contrast, focus styles, spacing scales, semantics, ARIA and screen-reader output are not part of this review." as the first line, then give the review. Report none of those, even when the input plainly breaks them.
6. When two or more of clauses 2, 4 and 5 apply, write each sentence on its own line, in clause order, before the heading.
7. No rule is broken by anything shown: write "Findings: 0" in the summary and "No findings." under "### Findings". Still write the open questions. Do not lower the bar to find something.
8. A description only, with no sizes: R-ux-review-8 and R-ux-review-9 cannot be checked. Write one open question for sizes and gaps; write no size finding.
9. Code only, with no flow: review the one screen as one step; write an open question for what happens after its main action when the code does not show it.
10. Code and description disagree: write an open question starting with "Conflict:" (layer 02, clause 4). Write "Conflict:" only when a real conflict exists.
11. More than one screen or flow in the input: review each under its own "## UX review:" heading, with its own numbering. Pages that share one template are one review with one finding per template break (layer 04, clause 9b), not one review per page.
12. More than 20 findings: keep every finding, and add one sentence after the summary lines suggesting the S1 and S2 findings be handled first.
13. Input in another language: write the review in that language; keep the rule ids, the severity names and every quoted word exactly as written.
14. A section with nothing in it: write "None." under its heading. Never drop a heading.
15. Reply in a short, direct tone; do not apologise or explain the fixed sentences further.
16. No layout input and the user asks about the first screen, page length or the number of calls to action: review what the code or description shows and write the layout open question of layer 03, clause 9. Do not estimate.
17. A screenshot description that gives no sizes: take the plain facts it states (what is first, what is repeated, what is cut off) and write an open question for the sizes it lacks.
