# Changelog

## 1.0.0 - 2026-11-15

- First version: a numbered list of usability findings for an existing screen or flow, from its code, a step-by-step description, or both.
- Thirteen checkable usability rules (R-ux-review-1 to R-ux-review-13): affordance, feedback, system status, mapping, error prevention, error recovery, choices per step, target size, target distance, memory load, consistency, familiar patterns, steps to the main goal.
- Fixed four-level severity scale (S1 Blocker, S2 Major, S3 Minor, S4 Note) set by ordered yes or no questions.
- Every finding quotes evidence from the input; what the input does not show becomes an open question.
- Fixed sentences for: nothing to review, a request to fix code, a request to design a new screen, a request to rewrite text, a request for contrast or ARIA checks.
- After reading the first recorded answers: evidence is plain text with no backticks; a missing thing gets its own "Shown absent:" line; at most 8 open questions, none about code correctness. Every case was recorded again with fresh agents.
- Ten core layers written as numbered clauses with defined terms; conduct rules R-ux-review-14 to R-ux-review-25 in RULES.json.
