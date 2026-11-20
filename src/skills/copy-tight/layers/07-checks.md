# Layer 07: Checks

1. Every number from layer 02 appears in the output, character for character.
2. Every name and product term from layer 02 appears with the same capital letters.
3. Filler phrases from the original ("at this time", "click here", "in order to") are gone from the rewritten copy.
4. Legal text, if any, is identical to the input and followed by the fixed note.
5. The change list has at most 5 bullets (format B: at most 3). Search each bullet and each reason for every word you removed, inside double quotes, single quotes, backticks or bare; if one is there in any form, rewrite it without it.
6. Compare the actions, promises and facts in the rewrite with the original: every one must already be in the original (an added "Try again", "Contact support", "We'll fix it" or a cause fails R-copy-tight-8); if one is new, delete it.
7. Read the rewrite aloud next to the original: if a user would act differently, the meaning changed; go back to layer 04 step 10.
8. Read the first and last line of your answer: the first is Rewritten copy: and the last is the last change bullet (or the legal note). Delete anything before or after, such as a note about searching files or an offer to apply the copy (R-copy-tight-9).
9. For two or more strings: count the input strings and the table rows; the two numbers MUST be equal, and every input id or line number appears once, in the original order (R-copy-tight-10). Add a missing row before you answer.
10. For two or more strings: every unchanged string is a row whose reason starts `Kept`; every row has a Saved number that equals characters of Before minus characters of After, recounted for at least the rows you are least sure of.
11. Every reason names the concrete change for its string; a reason that is only "cut filler", "plainer words" or "shortened" is rewritten (R-copy-tight-11).
12. Every string the user marked to keep as is, and every claim label, is character for character the same as the input (R-copy-tight-12).
13. Every string over about 25 words is split into sentences, or its reason says why it was not (R-copy-tight-13).
14. Answer every item in [references/checklist.md](../references/checklist.md) yes or no; any no blocks the answer.
