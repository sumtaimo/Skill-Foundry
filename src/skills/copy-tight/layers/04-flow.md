# Layer 04: Flow

1. Copy each number, name and product term from layer 02 exactly, keeping its spelling and capital letters.
2. If the copy is legal text, return it unchanged with the fixed note (layer 06 step 1) and stop.
3. Cut filler words ("in order to", "at this time", "please note that", "click here"), passive voice and repeats.
4. Prefer common words and active verbs ("We were unable to process" becomes "We couldn't process" or "Payment failed").
5. Fit each string to its UI job: a button starts with a verb; an error says what happened and what to do; an empty state says what is missing and the next step.
6. Compare the rewrite with the original: same meaning, same numbers, same names with the same capitals.
7. If a cut would change meaning, put the original wording back for that part.
8. Write the change list: name the kind of change only, and never quote the words you removed.
9. Return the rewritten copy, then the change list, in the format of layer 08.
