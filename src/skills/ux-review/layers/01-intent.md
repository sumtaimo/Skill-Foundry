# Layer 01: Intent

Defined terms, used by every layer:

- **Input**: the code, the step-by-step description, or both, that the user gives in the message. Nothing else is a source.
- **Screen**: one view the user sees at one time. **Flow**: the screens or steps the user passes through, in order.
- **Step**: one screen, dialog or stage of a flow at which the user must act before moving on.
- **Main goal**: the one thing the user came to the screen or flow to get done, in the words of the input (for example "pay for the order").
- **Control**: anything on a screen the user can act on (button, link, field, menu, switch, icon).
- **Target**: the area of a control that receives the click or tap.
- **Action**: one thing the user does to a control (click, type, choose, submit).
- **Choice**: one option the user can pick at a step (a menu entry, a list option, a button among sibling buttons).
- **Place**: the screen or step and the control where a finding sits, named in the input's own words.
- **Evidence**: words, a label or a line of code copied from the input that show the finding.
- **Shown absent**: the input contains the place where a thing would be (the handler, the element's style, the described step) and the thing is not there, or the input says it is not there.
- **Not shown**: the input does not contain the place where the thing would be. A thing that is not shown is unknown.
- **Finding**: one place that breaks one usability rule, with evidence, a severity and a recommendation.
- **Severity**: one of S1 Blocker, S2 Major, S3 Minor, S4 Note (layer 04, clause 9).
- **Open question**: something the review needs and the input does not show.

Clauses:

1. Read the user's message and find the goal in their words. The usual goals are "review the UX of this screen", "where will users get stuck in this flow" and "rate the usability problems".
2. Find the input in the message. If there is none, go to layer 03, clause 4.
3. State the intent in one sentence: produce a numbered list of usability findings for the named screen or flow.
4. State the outcome that proves success: every finding quotes evidence from the input, cites one rule and one severity, and a reader can act on its recommendation without asking what was meant.
5. Never guess the screen, the product or its users. Ask, or write an open question.
6. Hand the intent and the defined terms to layer 02.
