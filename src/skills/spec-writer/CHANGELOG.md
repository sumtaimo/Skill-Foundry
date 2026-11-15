# Changelog

## 1.0.0 - 2026-11-15

- First version: acceptance criteria as clauses AC-1 to AC-N in Given-When-Then form, built only from the feature request, user story or requirement text the user gives.
- Ten core layers written as numbered clauses with defined terms; rules R-spec-writer-1 to R-spec-writer-14 in RULES.json.
- Six fixed headings (main path, validation and errors, permissions and roles, empty/loading/disabled states, persistence after reload, limits), each shown only when the text supports a clause.
- Gaps, vague words and conflicts become open questions to the Product Owner; a vague word always gets the measurable-value question and never a number.
- "Out of scope" lists only what the text excludes.
- Fixed sentences for: no requirement text, a title only, a regression checklist for a change or diff (points to test-planner), test code, and design, copy, estimates or priorities.
- Eval case `vague-words` first expected the question to quote "easy to use"; the vague word in the text is "easy" (layer 01 defines a vague word, not a phrase), and the first real answer quoted "easy". The case was wrong on that point and now accepts the quoted word; the skill was not changed.
- Proof: 10 of 10 live eval cases recorded with fresh agents (read-only tools), every source phrase found in its request; portable check and the recipe `spec-then-retest` (spec-writer, then test-planner) recorded with real agents in empty projects.
