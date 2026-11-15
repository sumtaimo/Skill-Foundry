# Layer 04: Flow

1. List the steps of the flow in order, with the input's own names. A single screen is one step. Count them; this is the number for the "Steps to main goal:" line. When the input does not let the steps be counted, write "not countable from the input".
2. For each step, list its controls, its choices, and for each action what the input says the user sees next.
3. Check every usability rule, R-ux-review-1 to R-ux-review-13, in number order, against every step. Use the "how to check" entry of that rule in the references. Do not skip a rule because another rule already produced a finding.
4. For each place that breaks a rule, decide between two cases. Shown: the input shows the break, or the thing is shown absent (layer 01). Write a finding. Not shown: write an open question. Never write a finding from something that is not shown.
5. Write one finding per place and rule. A place that breaks two rules gives two findings. Several places that break the same rule in the same way on the same step may share one finding that names each place.
6. For each finding, copy the evidence from the input, word for word, in double quotes. Evidence is at most 15 words or one line of code; code is written as plain text between the double quotes, with no backticks and never in a code block. For a thing shown absent, quote the place where it would be and add the line "Shown absent:" that says in one sentence what is missing there.
7. Write "User experiences": one sentence, present tense, from the user's side, saying what happens to the user at this place (for example "The user clicks Pay, sees nothing change and clicks again."). No rule names and no design terms in this sentence.
8. Write "Recommendation": exactly one sentence that says what the screen must do or show, in words. Never write code, a selector, a replacement label or message, or a new layout. To recommend a change of wording, say what the wording must state, not the words.
9. Set the severity by asking these questions in order and stopping at the first "yes":
   - S1 Blocker: can this stop the user from completing the main goal, or make the user lose entered data, saved data or money?
   - S2 Major: will the user probably take a wrong action, meet an error, or need more than one attempt, and still complete the main goal?
   - S3 Minor: does the user complete the main goal at the first attempt, but more slowly: an extra step, extra reading, or something to remember?
   - S4 Note: none of the above; the place departs from the rule without changing the result or the speed.
10. Order the findings by severity, S1 first; inside one severity, in the order of the steps. Number them 1 to N in one run.
11. Count the findings per severity for the "Findings:" line.
12. Write the open questions, each naming the control or step and the missing fact. Keep only facts a usability rule needs; never ask whether the code is correct, safe or free of bugs. Write at most 8, those that could change a finding or its severity first; join questions about the same missing fact (for example all sizes and gaps) into one.
13. Hand the findings, the counts, the step count and the open questions to layer 05.
