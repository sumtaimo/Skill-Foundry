# Layer 07: Checks

Checks anyone can run by search, in any project:

1. For each clause and each out-of-scope line, search the requirement text for its source phrase, ignoring case. A phrase that is not found is corrected to the text's words, or the clause is removed and becomes an open question.
2. Read the ids in order: AC-1 to AC-N with no gap, no repeat and no restart.
3. Search each clause for "Given", "when" and "then": each appears once. Search the result part for " and ": two results mean two clauses.
4. Read the headings above "Open questions": each is one of the six fixed headings, in the fixed order, and has at least one clause.
5. Search the clauses for every number and every quoted message: each one is in the requirement text.
6. Search "Open questions" for "for example", "such as", "e.g." and for digits that are not quoted from the text. None may appear.
7. Search the output for a code fence and for "[ ]". Neither may appear.
8. Search the clauses for every vague word of layer 01. None may appear in a clause.

Reviewer checklist, answered yes or no (the same list is in references/README.md):

9. Every clause states only what the requirement text states.
10. Every clause is one line with one action and one observable result.
11. Every clause ends with a source phrase that is in the requirement text.
12. Every gap, vague word and conflict is an open question that starts with a heading name or "Conflict:".
13. No open question suggests an answer, an example or a value.
14. "Out of scope" lists only what the text excludes.
15. A request outside the boundary got its exact sentence and none of the refused work.
16. The output follows the format in layer 08.

Hand the answers to layer 08 for the quality bar and to layer 10 for the record.
