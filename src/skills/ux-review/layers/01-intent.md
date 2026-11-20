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
- **Layout input**: an optional measurement sheet or screenshot description that makes the shape of a screen visible (layer 03, clause 3). Without it the shape of a screen is not shown, except what the code itself contains.
- **First screen**: what the user sees without scrolling: 1440 by 900 px on desktop and 390 by 844 px on a phone, unless the layout input gives another size.
- **View**: one screen height of the page; a page of 3 screens has 3 views.
- **Primary action**: the one filled or most prominent action in a view that carries the main goal of that view; a call to action is any link or button that asks the user to start something.
- **Persistent navigation**: a header, rail, sidebar or footer menu that stays the same on every screen of the product. It is counted apart from the actions in the content of a screen.
- **Hero action**: a button or link in the content of the first screen that asks the user to start something. Hero actions, cards and other content controls are the controls that compete for attention in R-ux-review-30.
- **Template**: one page structure used for many pages: the same sections in the same order and the same markup, only the content differs.

Clauses:

1. Read the user's message and find the goal in their words. The usual goals are "review the UX of this screen", "where will users get stuck in this flow" and "rate the usability problems".
2. Find the input in the message. If there is none, go to layer 03, clause 5.
3. State the intent in one sentence: produce a numbered list of usability findings for the named screen or flow.
4. State the outcome that proves success: every finding quotes evidence from the input, cites one rule and one severity, and a reader can act on its recommendation without asking what was meant.
5. Never guess the screen, the product or its users. Ask, or write an open question.
6. Hand the intent and the defined terms to layer 02.
