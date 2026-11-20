# Changelog

## 1.0.1 - 2026-11-20

- Overlap with ui-polish removed: R-ux-review-8 (was target size 44 px) is now Reach and R-ux-review-9 (was gap 8 px) is now Grouping. The review no longer measures sizes or gaps or states a pixel threshold; a hit problem that stops the user in the main goal is a finding about the task and its recommendation ends with "; the sizes are for ui-polish." A plain request to measure sizes, gaps or tokens gets one fixed sentence that names ui-polish (layer 06, clause 18).
- R-ux-review-30: the first screen allows at most 7 controls that compete in its content (hero actions, cards). Persistent navigation (header, rail, sidebar repeated on every screen) is counted apart and judged by R-ux-review-7. New defined terms: persistent navigation and hero action.
- The fix-the-code sentence now ends with "To fix the code, use ui-polish." and the design sentence with "To design a screen, use ui-craft."
- New rule R-ux-review-33: a design token's name, value or absence is never a finding; tokens (design-system) and contrast (a11y-audit) are not reviewed.
- Cases changed or added; the reasons are in the checklist.

## 1.0.0 - 2026-11-15

- First version: a numbered list of usability findings for an existing screen or flow, from its code, a step-by-step description, or both.
- Thirteen checkable usability rules (R-ux-review-1 to R-ux-review-13): affordance, feedback, system status, mapping, error prevention, error recovery, choices per step, target size, target distance, memory load, consistency, familiar patterns, steps to the main goal.
- Fixed four-level severity scale (S1 Blocker, S2 Major, S3 Minor, S4 Note) set by ordered yes or no questions.
- Every finding quotes evidence from the input; what the input does not show becomes an open question.
- Fixed sentences for: nothing to review, a request to fix code, a request to design a new screen, a request to rewrite text, a request for contrast or ARIA checks.
- After reading the first recorded answers: evidence is plain text with no backticks; a missing thing gets its own "Shown absent:" line; at most 8 open questions, none about code correctness. Every case was recorded again with fresh agents.
- Ten core layers written as numbered clauses with defined terms; conduct rules R-ux-review-14 to R-ux-review-25 in RULES.json.
- Shape rules R-ux-review-26 to R-ux-review-30: first screen content, section order, page length in screens, duplicated blocks and calls to action per view (found when the skill reviewed a real site; none of the first thirteen rules could see these).
- Optional layout input (a measurement sheet or a screenshot description); the "Reviewed:" line now says which one was given, or "Layout input: none". Without one, the shape facts are a single open question.
- A break that depends on a script or run-time content the input does not contain is S3 at most, or an open question (R-ux-review-31).
- One template on many pages gives one finding that lists the pages (R-ux-review-32).
- Three eval cases added (shape rules from a measurement sheet, missing script capped at S3, repeated template reported once).
