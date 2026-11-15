# Examples

These examples are written by hand to show the format. They are not proof that the skill works; the proof is the recorded answers of real agents.

## Example: a two-step flow, described

Input:

> Do a UX review of this flow. The user wants to pay. 1. Cart: a Delete link removes the item at once, with no undo. 2. Payment: after Pay the page stays the same for about 5 seconds, then the receipt appears.

Output:

    ## UX review: Cart and Payment flow

    Reviewed: A two-step description of the flow from Cart to Payment.
    Main goal: pay
    Steps to main goal: 2 (Cart, Payment)
    Findings: 2 (S1: 1, S2: 1, S3: 0, S4: 0)

    ### Findings

    1. **Cart, Delete link** | S1 Blocker | R-ux-review-5
       - Evidence: "a Delete link removes the item at once, with no undo"
       - User experiences: The user clicks Delete by mistake and the item is gone, with no way to get it back.
       - Recommendation: Ask for confirmation before the item is removed, or offer an undo right after.
    2. **Payment, Pay** | S2 Major | R-ux-review-2
       - Evidence: "after Pay the page stays the same for about 5 seconds"
       - User experiences: The user clicks Pay, sees nothing happen and clicks again or leaves.
       - Recommendation: Show a loading state on the Pay control from the click until the receipt appears.

    ### Not reviewed

    - Contrast, focus styles, spacing and type scales: a visual polish pass.
    - Semantics, ARIA and screen-reader output: an accessibility audit.
    - Wording of labels and messages: a copy edit.

    ### Open questions

    - Payment: what does the user see when the payment fails? The input does not show it.
    - Cart and Payment: no sizes or gaps are given, so target size and distance were not checked.

    ### Severity scale

    - S1 Blocker: the user cannot complete the main goal, or loses data or money.
    - S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
    - S3 Minor: the user completes the main goal at the first attempt, but more slowly.
    - S4 Note: the result and the speed do not change; the place departs from the rule.

Why this follows the rules: each evidence line is a copy from the input (R-ux-review-14); losing an item with no way back is lost data, so the first question of the scale answers yes (S1); the failed-payment path and the sizes are not shown, so they are open questions, not findings.

## Example: a request to fix the code

Input:

> Fix this: `<span onclick="buy()">Buy now</span>`

Output starts with the fixed sentence, then the review, and contains no code:

    This skill reviews usability; it does not change code.

    ## UX review: Buy now control

    Reviewed: One line of code with one control.
    Main goal: not stated
    Steps to main goal: 1 (Buy now control)
    Findings: 1 (S1: 0, S2: 1, S3: 0, S4: 0)

    ### Findings

    1. **Buy now** | S2 Major | R-ux-review-1
       - Evidence: "<span onclick="buy()">Buy now</span>"
       - Shown absent: The element has no border, fill or underline.
       - User experiences: The user sees plain text, does not take it for something to click, and looks elsewhere for the way to buy.
       - Recommendation: Give the control the look of a button, with a border or a fill.

The remaining sections (Not reviewed, Open questions, Severity scale) follow as in the first example.

## Example: nothing to review

Input:

> Can you review the UX of our app?

Output, the whole reply:

    Paste the screen's code or describe the flow step by step.

## Example: a request for a new screen

Input:

> Design a settings screen for us.

Output, the whole reply:

    This skill reviews an existing screen or flow; it does not design new screens.
