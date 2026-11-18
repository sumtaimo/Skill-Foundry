# Layer 04: Flow

1. Copy each number, name and product term from layer 02 exactly, keeping its spelling and capital letters.
2. If the copy is legal text, return it unchanged with the fixed note (layer 06 step 1) and stop for that string.
3. Strings the user marked to keep as is (layer 02 step 4) go back character for character; do not rewrite them, shorten them or fix them.
4. A claim label (layer 02 step 5) keeps its claim wording: do not swap, reorder or replace its words. Cut only words around the claim; if nothing can go without rewording the claim, keep it and say so.
5. Cut filler words ("in order to", "at this time", "please note that", "click here"), passive voice and repeats.
6. A string over about 25 words: split it into sentences where the meaning allows (one idea per sentence, 20 words or fewer when possible), using only the original meaning (R-copy-tight-8, R-copy-tight-13). If a split would change the meaning, or the text is legal text, do not split.
7. Prefer common words and active verbs ("We were unable to process" becomes "We couldn't process" or "Payment failed").
8. Fit each string to its UI job: a button starts with a verb; an error says what happened, and keeps the next step only if the original gave one; an empty state says what is missing, and keeps the next step only if the original gave one. Never add a new action, promise or fact (R-copy-tight-8): "An unexpected error occurred while saving." becomes "We couldn't save your changes.", never "Couldn't save. Try again."
9. Compare the rewrite with the original: same meaning, same numbers, same names with the same capitals. A rewrite that is longer than the original is not allowed; keep the original.
10. If a cut would change meaning, put the original wording back for that part.
11. Write the reason for each string (or each change bullet for one string): name the concrete change for that string in your own words, for example which part went (the lead-in, the time phrase, the polite closing), which verb replaced a passive, what was kept (the amount, the name). A generic phrase alone ("Cut filler", "Plainer words", "Shortened") is not a reason (R-copy-tight-11). It MUST NEVER contain a word you removed, in quotes or not (R-copy-tight-7). Wrong: `Cut filler ("currently", "for you")`. Wrong: `Cut filler`. Right: `Dropped the time phrase and the polite closing; amount kept`.
12. For two or more strings, count the characters of Before and After with spaces, row by row, and write the difference as Saved. Never guess a count.
13. Return the answer in the format of layer 08 (format A for one string, format B for two or more).
