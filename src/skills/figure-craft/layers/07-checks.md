# Layer 07: Checks

1. Run `lintStates(states)`. The result must have zero errors.
2. For each warning, change the shapes until it is gone, or write one sentence in the report saying why it stays.
3. Compare `requiredParts` with the list from layer 02: same ids, none removed.
4. Count the details: every labelled part has one to three, and each is listed in the parts table with the real feature it shows.
5. Answer every item in the [checklist](../references/checklist.md) yes or no. Any no blocks release.
5a. Run `lintCards(cards, labels)`: every labelled part has a card that says what it does, where it sits in the real object and the source of that fact. Zero errors.
6. A browser check is OPTIONAL: it needs permission to start a browser, and many agents do not have it. If a browser is allowed, open the page and check: light, dark, 390px wide, reduced motion, and a console with no errors. Check that no label shows at rest, that hovering and Tab-focusing each part reveals its label, that the turn buttons show all four views, and that the state button opens and closes the object, open and closed. Save a screenshot of each and LOOK at them: a round thing must look round, a handle must be on the outside of its body, the lid must be a lid.
7. If no browser is allowed (the normal case for a user who has not granted it), say so honestly in the report: "not opened in a browser: no permission". The lint result and the build still stand; never write that the browser checks passed, and never stop the work because the browser is missing.
8. Give the figure to a second reader and ask for the idea in one sentence. If it differs from the idea sentence, go back to layer 04.
