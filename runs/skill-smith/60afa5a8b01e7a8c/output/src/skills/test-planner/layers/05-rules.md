# Layer 05: Rules

1. Apply every rule in RULES.json (R-test-planner-1 to R-test-planner-12).
2. R-test-planner-1: check each item against layer 04 step 8. An item whose source phrase is not in the change text is removed.
3. R-test-planner-2: each item ends with an italic source phrase.
4. R-test-planner-3: the output is one checklist with [ ] boxes, numbered 1 to N across all areas.
5. R-test-planner-4: each area heading is a name the change text uses.
6. R-test-planner-5: the output contains no code, no script and no test data.
7. R-test-planner-6: an adjacent area appears only under "Possible impact, not stated", as a question.
8. R-test-planner-7: with no change text, the reply asks for it (layer 03) and contains no checklist item.
9. R-test-planner-8 to R-test-planner-12 apply to the skill folder itself; the skill's lint checks them, and a run of the skill does not change them.
