# Layer 05: Rules

1. Apply every rule in RULES.json (R-spec-writer-1 to R-spec-writer-14).
2. R-spec-writer-1: read each clause and remove every behaviour, value, role, message, state or limit the requirement text does not state. What is removed becomes an open question.
3. R-spec-writer-2: each clause is one line with "Given", "when" and "then" once each, one action and one observable result.
4. R-spec-writer-3: each clause ends with an italic source phrase copied word for word from the requirement text.
5. R-spec-writer-4: the ids run AC-1 to AC-N in one run across all headings.
6. R-spec-writer-5: a heading appears only when it has at least one clause.
7. R-spec-writer-6: each gap is an open question that starts with its heading name and suggests no answer, example or value.
8. R-spec-writer-7: each vague word has the question of layer 04, clause 10; no clause uses the vague word, and no number or unit is made up.
9. R-spec-writer-8: "Out of scope" holds only exclusions the text states, each with its source phrase, or reads "None stated."
10. R-spec-writer-9: with no requirement text or a title only, the reply is the exact sentence of layer 03, clause 4 or 5.
11. R-spec-writer-10: a request outside the boundary gets the exact sentence of layer 06, clause 4, 5 or 6.
12. R-spec-writer-11 to R-spec-writer-14 apply to the skill folder itself; a run of the skill does not change them.
