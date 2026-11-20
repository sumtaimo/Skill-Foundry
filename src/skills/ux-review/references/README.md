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
| R-ux-review-8 Reach | A control the main goal needs, and what the input shows about its hit area | The input shows a target so small that the user probably misses it or hits its neighbour in the main goal; the finding says what the user does wrong, quotes the size as evidence only, states no threshold, and its recommendation ends with "; the sizes are for ui-polish." | No size is stated or computable; a token has no shown value; the size only departs from a scale (not reported) |
| R-ux-review-9 Grouping | Where targets used in sequence sit; neighbours with opposite effects | A field and the button that submits it, or two controls used in sequence, are in different groups or separated by unrelated content; Save and Delete (opposite effects) sit together with nothing to tell them apart; when the cause is a gap or a size, the recommendation ends with "; the sizes are for ui-polish." | No gap or position is stated |
| R-ux-review-10 Memory load | Every value the user needs at a later step | The user must carry a code, a number, a choice or a name from one step to another; a step asks again for something already entered | The later step is not in the input |
| R-ux-review-11 Consistency | Labels and positions of the same action across the screens of the input | The same action has two labels or two positions; one label names two different actions | Only one screen is in the input and the action appears once |
| R-ux-review-12 Familiar patterns | Each control against the table below | The control behaves differently from its row | The behaviour of the control is not in the input |
| R-ux-review-13 Steps | The count of steps to the main goal and the purpose of each step | More than 5 steps; or a step that collects nothing and shows nothing the main goal needs | The main goal is not stated or the steps cannot be counted |

| R-ux-review-26 First screen | The heading and first sentence of the first screen; the first element seen (layout input) or the first heading in the code | The first screen does not say what the product or screen is and who it is for; a cover, picture or sample output comes before the heading, or the heading starts below the first screen (top at or beyond the screen height) | No layout input and the code does not show the order of the content |
| R-ux-review-27 Section order | The order and tops of the sections; the section that holds the main action; each lead-in sentence and its heading | The main action section starts after 3 screens; details come before the action; a lead-in sentence sits above its heading | No layout input and the code gives no section order |
| R-ux-review-28 Page length | Page height and section heights, divided by the screen height | Page above 6 screens; a section above 2 screens with its extra part not behind a control | No height is given; never estimate it from code |
| R-ux-review-29 Duplicated blocks | Text, answers, lists and pictures of the whole page | The same content of 20 words or more, or the same picture or answer, appears twice on the page and the second is not a short link to the first | Only part of the page is given |
| R-ux-review-30 Calls to action | Primary actions per view; hero actions and cards in the first screen, counted apart from persistent navigation | More than 1 primary action in one view (a repeated card button counts once per card in view); more than 7 content controls in the first screen. Persistent navigation is judged by R-ux-review-7 and never added to the 7 | The code or sheet gives no count and no view, or does not say which controls are persistent navigation |

Counting rules: a step is a screen, dialog or stage at which the user must act before moving on. A confirmation dialog for a destructive action is required by R-ux-review-5 and is not counted as a step for R-ux-review-13.

## Measurement sheet (optional layout input)

Any form works when it gives facts and numbers. A useful one:

| Item | Example |
|------|---------|
| Viewport | 1440 by 900 px (and 390 by 844 px) |
| Page height | 9822 px |
| Sections | name, top px, height px, in page order |
| First element seen | what is largest or first in the first screen |
| Controls | clickable controls in the first screen; primary actions per view |
| Repeated blocks | the same content shown twice, and where |

A screenshot description is plain words about what is seen (what is first, what is repeated, what is cut off); sizes it does not give are not shown.

## Script or run-time content not given (R-ux-review-31)

The input refers to it but does not contain it: a script source, an imported module, a function that is called but not defined, a value filled in at run time. A break that depends on what it does is S3 at most, or an open question For example, a page that loads a script not given: a placeholder in a command, what a copy button copies and a hidden "Copied" message may all be set by that script, so findings about them are S3 at most or open questions, never S2.

## Pages from one template (R-ux-review-32)

Pages with the same sections in the same order and the same markup, only the content differing. A template break is one finding; "Place" names the template and lists the pages ("on 10 pages: a, b, c"). A break on one page only is its own finding.

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
- Contrast ratios, colour judgements, focus styles, spacing scales, type scales, pixel sizes or gaps measured against a threshold, and token names or values.
- Semantic elements, ARIA attributes, keyboard order, screen-reader output.
- Rewritten labels, messages or other text.
- A design for a new screen, or a list of what a new screen should contain.

## Reviewer checklist

Answer each line yes or no. Any "no" blocks the reply until it is fixed.

- [ ] Every finding quotes evidence that appears in the input.
- [ ] Every finding names one place, one rule id (1 to 13 or 26 to 30) and one severity.
- [ ] Every "User experiences" line says what happens to the user.
- [ ] Every recommendation is one sentence in words, with no code and no replacement wording.
- [ ] Every severity follows the ordered questions; no S1 or S2 rests on a script the input does not contain.
- [ ] The "Reviewed:" line names the layout input (measurement sheet, screenshot description or none); with none, page height and first-screen facts are one open question, not findings.
- [ ] Pages from one template give one finding that lists the pages.
- [ ] Nothing that is not shown is reported as a finding; it is an open question.
- [ ] There are at most 8 open questions, and none is about code correctness.
- [ ] A size, gap or hit finding is about what the user does wrong, quotes no px threshold and names ui-polish; no finding is about a token; persistent navigation is not added to the count of content controls.
- [ ] The findings are numbered 1 to N, most severe first, and the counts add up.
- [ ] The reply reports no contrast, focus style, spacing scale, semantics, ARIA or screen-reader output.
- [ ] The "Not reviewed" and "Severity scale" sections are the fixed lines.
- [ ] A request to fix code, design a screen, rewrite text or check out-of-scope items got its exact sentence.
- [ ] The reply follows the format in layer 08.
