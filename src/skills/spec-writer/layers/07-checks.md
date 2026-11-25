# Layer 07: Checks

Checks anyone can run by search, in any project:

1. For each clause and each out-of-scope line, search the requirement text for its source phrase, ignoring case. A phrase that is not found is corrected to the text's words, or the clause is removed and becomes an open question.
2. Read the ids in order: AC-1 to AC-N with no gap, no repeat and no restart.
3. Search each clause for "Given", "when" and "then": each appears once. Search the result part for " and ": two results mean two clauses.
4. Read the headings above "Open questions": each is one of the six fixed headings, in the fixed order, and has at least one clause.
5. Search the clauses for every number and every quoted message: each one is in the requirement text.
6. Search "Open questions" for "for example", "such as", "e.g." and for digits that are not quoted from the text or part of an id "AC-n". None may appear.
   Then read "Open questions" again: every line starts with `[blocking]` or `[minor]`; all `[blocking]` lines come before the `[minor]` lines; every `[blocking]` line ends with `Blocks:` and either an id that exists in the document or a quoted source phrase found in the requirement text, searched ignoring case; there are at most three `[minor]` lines with at most two questions each. A `[blocking]` line that names nothing it blocks is a minor question or is dropped. Never cut a `[blocking]` question to reach a number: there is no cap on them.
7. Search the output for a code fence and for "[ ]". Neither may appear.
8. Search the clauses for every vague word of layer 01. None may appear in a clause.

Reviewer checklist, answered yes or no (the same list is in references/README.md):

9. Every clause states only what the requirement text states.
10. Every clause is one line with one action and one observable result.
11. Every clause ends with a source phrase that is in the requirement text.
12. Every blocking gap, vague word and conflict is a `[blocking]` question that starts with a heading name or "Conflict:" and names what it blocks; the rest is merged into at most three `[minor]` lines.
13. No open question suggests an answer, an example or a value, and no minor question only restates a default.
14. "Out of scope" lists only what the text excludes.
15. A request outside the boundary got its exact sentence and none of the refused work.
16. The output follows the format in layer 08 (including `### Flow & State Table` + `Entry point:`, `Exit:`, `Reload:`, `Permissions:` for multi-screen/multi-step features, and treating any `(fill me)` line in `docs/foundation/product.md` or `docs/foundation/domain.md` as unknown under `Open questions`).

Hand the answers to layer 08 for the quality bar and to layer 10 for the record.
