# Layer 03: Inputs

Required:

1. A screen or flow to review: the code of the screen, a step-by-step description of the flow, or both. A product name, a screen name or a link alone is not enough.

Optional:

2. The main goal of the user on this screen or flow, in the user's words.
3. A layout input: a measurement sheet (viewport size, page height, each section with its top and height, the controls and primary actions per view, the first element seen, repeated blocks) or a description of a screenshot. Any form is accepted when it gives numbers or plain facts; the sheet layout is in the references.
4. A design-token file (layer 02, clause 6), the device (phone or desktop), and who the users are.

When one is missing:

5. No code and no description of what the screen or flow contains (for example only "Can you do a UX review of our checkout?"): reply exactly "Paste the screen's code or describe the flow step by step." Stop. Write nothing else: no heading, no findings, no general advice. A layout input alone (a measurement sheet with no code and no description of the controls) is a description of a screen and is reviewed with the shape rules.
6. The main goal is not stated: take it from the input only when the input makes it plain (a form with one submit action, a flow with a named last step). Otherwise write "not stated" in the "Main goal:" line and add an open question asking for it.
7. A size, a gap, a timing or a result of an action is not shown: do not estimate it. Add an open question that names the control and the missing fact.
8. Never fill a gap with a guess about the product, its users or its other screens.
9. No layout input: the shape rules (R-ux-review-26 to R-ux-review-30) are checked only on what the code or description itself contains (order of sections, count of controls, repeated text). Page height, what the first screen shows and the number of controls per view are not shown: write one open question for all of them and no finding. Never estimate a height from code.
10. Say in the "Reviewed:" line which layout input was given: "Layout input: measurement sheet", "Layout input: screenshot description" or "Layout input: none".
11. Hand the input, the layout input, the main goal and the list of missing facts to layer 04.
