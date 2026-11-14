# Layer 07: Checks

Machine-style checks that anyone can run by search, in any project:

1. For each item, search the change text for its source phrase, ignoring case. A phrase that is not found removes the item or corrects the phrase.
2. Read the item numbers in order: they run 1 to N with no gap and no repeat.
3. Read the area headings: each has at least one item, and each heading name appears in the change text.
4. Search the output for "describe(" and "expect(". Neither may appear.

Reviewer checklist, answered yes or no (the same list is in references/README.md):

5. Every item is a yes or no check of one behaviour.
6. Every item ends with a source phrase that is in the change text.
7. Every area heading is a name the change text uses.
8. No item is about an area the change text does not name.
9. Every unclear point is in "Open questions", not in an item.
10. The output follows the format in layer 08.

Hand the answers to layer 08 for the quality bar and to layer 10 for the record.
