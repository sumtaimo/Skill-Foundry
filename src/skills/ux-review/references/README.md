# References

## How to check each usability rule

For every rule: what to look at, when it is broken, and when the fact is not shown (then write an open question, never a finding).

| Rule | Look at | Broken when | Not shown when |
|------|---------|-------------|----------------|
| R-ux-review-1 Affordance | Each control and how it looks | A clickable element is plain text or a plain box with no border, fill or underline; or a non-clickable element is styled as a button or link | Neither the code's styles nor the description say how the control looks |
| R-ux-review-2 Feedback | Each action and what the user sees next | The handler or the description shows nothing visible after the action; a request to a server has no loading state; a save, send, payment or delete ends with no confirmation | The input stops at the action and does not show the handler or the next step |
| R-ux-review-3 System status | Flows of 3 or more steps; selections, filters, modes, saved state | No step indicator ("step 2 of 4"); the selected item, active filter or mode looks the same as the others; unsaved changes are not marked | The input does not show the header or state area of the step |
| R-ux-review-4 Mapping | Where each control sits compared with what it changes | The control is in another group, another screen region or another step than the thing it changes; controls are in a different order than the things they control | The input gives no order or position |
| R-ux-review-5 Error prevention | Actions that delete, pay, send or overwrite; fields with a format or limit | The action runs at once with no confirmation and no undo; the format or limit appears only after a failed submit | The handler or next step of the action is not in the input |
| R-ux-review-6 Error recovery | Each error message and what happens to the entered data | The message is far from its cause (page top, alert box, another step); it does not say what to do next; fields are cleared or the user is sent back to the start | The input shows no error path |
| R-ux-review-7 Choices | The number of choices at one level in each step | 8 or more choices with no groups, no search and no preselected default | The input does not list or count the choices |
| R-ux-review-8 Target size | Width and height of each target, in px | Either side is under 44 px (include padding; a 16 px icon with 4 px padding is 24 px) | No size is stated or computable; a token has no shown value |
| R-ux-review-9 Target distance | Gap between neighbouring targets; where targets used in sequence sit | The gap is under 8 px; a field and the button that submits it, or two controls used in sequence, are in different groups or separated by unrelated content | No gap or position is stated |
| R-ux-review-10 Memory load | Every value the user needs at a later step | The user must carry a code, a number, a choice or a name from one step to another; a step asks again for something already entered | The later step is not in the input |
| R-ux-review-11 Consistency | Labels and positions of the same action across the screens of the input | The same action has two labels or two positions; one label names two different actions | Only one screen is in the input and the action appears once |
| R-ux-review-12 Familiar patterns | Each control against the table below | The control behaves differently from its row | The behaviour of the control is not in the input |
| R-ux-review-13 Steps | The count of steps to the main goal and the purpose of each step | More than 5 steps; or a step that collects nothing and shows nothing the main goal needs | The main goal is not stated or the steps cannot be counted |

Counting rules: a step is a screen, dialog or stage at which the user must act before moving on. A confirmation dialog for a destructive action is required by R-ux-review-5 and is not counted as a step for R-ux-review-13.

## Familiar-pattern table (R-ux-review-12)

| Id | Pattern |
|----|---------|
| P1 | Underlined or link-styled text navigates; it never submits, pays or deletes. |
| P2 | A checkbox allows any number of options; a radio button allows exactly one; a switch applies at once, with no separate save. |
| P3 | The main action of a form comes after its last field. |
| P4 | A "Back" control returns to the previous step and keeps what was entered. |
| P5 | The label of a field stays visible while the user types; placeholder text is not the only label. |
| P6 | A dialog has a visible way to leave it without acting. |
| P7 | A required field is marked before the user submits. |

A finding under R-ux-review-12 names the pattern id in its "User experiences" or "Recommendation" line only as plain words; the rule id stays R-ux-review-12.

## Severity scale

Ask in order and stop at the first "yes".

| Severity | Definition | Question |
|----------|------------|----------|
| S1 Blocker | The user cannot complete the main goal, or loses data or money. | Can this stop the main goal, or lose entered data, saved data or money? |
| S2 Major | The user completes the main goal only after a wrong action, an error or a second attempt. | Will the user probably act wrongly, meet an error or need more than one attempt? |
| S3 Minor | The user completes the main goal at the first attempt, but more slowly. | Is there an extra step, extra reading or something to remember? |
| S4 Note | The result and the speed do not change; the place departs from the rule. | None of the above. |

The severity describes the effect on the user, never the effort of the fix.

## Writing one finding

- Place: the step and control in the input's words, for example "Payment step, Pay button".
- Evidence: copied, in double quotes, as plain text with no backticks. For something shown absent, quote the place where it would be and add a "Shown absent:" line.
- User experiences: what happens to the user. Good: "The user types a 6-character password, submits, and only then learns it needs 8." Weak: "Violates error prevention."
- Recommendation: what must be true afterwards. Good: "State the password length rule beside the field before the user submits." Not allowed: code, a selector, the new words of a label or message, a new layout.

## What this review never contains

- Corrected or new code, in any form.
- Contrast ratios, colour judgements, focus styles, spacing scales, type scales.
- Semantic elements, ARIA attributes, keyboard order, screen-reader output.
- Rewritten labels, messages or other text.
- A design for a new screen, or a list of what a new screen should contain.

## Reviewer checklist

Answer each line yes or no. Any "no" blocks the reply until it is fixed.

- [ ] Every finding quotes evidence that appears in the input.
- [ ] Every finding names one place, one rule id from 1 to 13 and one severity.
- [ ] Every "User experiences" line says what happens to the user.
- [ ] Every recommendation is one sentence in words, with no code and no replacement wording.
- [ ] Every severity follows the ordered questions.
- [ ] Nothing that is not shown is reported as a finding; it is an open question.
- [ ] There are at most 8 open questions, and none is about code correctness.
- [ ] The findings are numbered 1 to N, most severe first, and the counts add up.
- [ ] The reply reports no contrast, focus style, spacing scale, semantics, ARIA or screen-reader output.
- [ ] The "Not reviewed" and "Severity scale" sections are the fixed lines.
- [ ] A request to fix code, design a screen, rewrite text or check out-of-scope items got its exact sentence.
- [ ] The reply follows the format in layer 08.
