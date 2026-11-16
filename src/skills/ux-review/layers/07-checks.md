# Layer 07: Checks

Checks anyone can run by search, in any project:

1. For each finding, search the input for its evidence quote, ignoring case. A quote that is not found removes the finding or moves it to Open questions.
2. Read the finding numbers in order: they run 1 to N with no gap and no repeat.
3. Add the four counts in the "Findings:" line: the sum equals N.
4. Read the severities down the list: S1 first, then S2, S3, S4; none rises further down.
5. Search each finding for "R-ux-review-": exactly one id, from 1 to 13 or from 26 to 30.
6. Search the reply for a code fence. None may appear.
7. Search the findings and open questions for a number followed by ":1", and for "aria-", "role=", "outline", "line-height" and "font-size". None may appear outside a quoted evidence line.
7a. Search the "Reviewed:" line for "Layout input:": it names a measurement sheet, a screenshot description or none.
7b. A finding ranked S1 or S2 does not rest on a script the input does not contain. A finding from a template lists its pages and is not repeated per page.
8. Compare the three lines under "### Not reviewed" with layer 08: they are word for word the same.

Reviewer checklist, answered yes or no (the same list is in the references):

9. Every finding names a place in the input's own words.
10. Every "User experiences" line says what happens to the user, not which rule is broken.
11. Every recommendation is one sentence in words, with no code and no replacement wording.
12. Every severity follows the ordered questions of layer 04, clause 9.
13. Nothing that is not shown is reported as a finding; there are at most 8 open questions and none is about code correctness.
14. A request to fix code, design a screen, rewrite text or check out-of-scope items got its exact sentence.
15. The reply follows the format in layer 08.

Hand the answers to layer 08 for the quality bar and to layer 10 for the record.
