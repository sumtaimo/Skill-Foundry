# Layer 07: Checks

Run these checks silently. Their results go nowhere in the reply except as the sections of layer 08: never announce a check, a file you read or a name you verified before the heading or after the last section.

Checks anyone can run by search, in any project:

1. Search the polished code for each visible text string from layer 04, step 1. Every one must appear exactly once per place it appeared in the input.
2. Search the polished code for every px number used for spacing or font size. Each must be on its scale in references/README.md. In token mode there should be none left where the token file has a spacing or font-size token.
3. Search the polished code for ":focus-visible" (or "focus-visible:" in utility classes). It must appear when the input has any button, link or input.
4. Search the polished code for "prefers-reduced-motion" when it has any transition or animation. Search it for "44px" (token mode: "--size-target-min") too: every button and link has it as min-height and min-width.
5. Search the polished code for "http", "@import" and script elements. None may appear unless it was in the input.
6. Read every ratio in the reply. Each is written as a number with ":1", meets rule 4 (or is reported as failing under rule 23), and is a number the contrast script printed or the table holds.
7. Token mode: search the polished code for "var(--". Every name found must be in the token file or in the input code.
8. Token mode: search the polished code for "#" colours. Each one left must be a value with no matching token, listed under "Open questions".
9. Token mode: the polished code has no ":root" block and no line that sets a token of the token file.
9a. Token mode: search the polished code for `--glass`, `backdrop-filter`, `--r-`, `--z-`, `--glow`, `--btn-gloss`, `--font-weight-medium`, `tabular-nums` and `clamp(` that the input had: each is still there as a variable or as written, none replaced by a plain value.
9b. Token mode: for each `--button-`, `--input-` and `--card-` name in the polished code, the name is in the token file (rule 32).
9c. Search the polished code for `letter-spacing` and `line-height` on Khmer text: 0 and 1.6 (or `--line-height-khmer`), never negative.

6a. For every colour pair that passed before (rule 4), compare its ratio before and after in the script output. The ratio after is equal or higher.
6b. Search the reply for every raw value that was replaced by a token: its value is equal to the token's value, or it broke a rule. A passing raw value with a different token value is still in the polished code and in "Open questions".
6c. Read how the script was run: one plain command with the full path. If it was not run, the reply says so plainly.
6d. With several pages on one stylesheet, the stylesheet appears once in the polished code.

Reviewer checklist, answered yes or no (the same list is in references/README.md):

10. Every fix cites one rule id and gives the value before and after.
11. The polished code has exactly one primary action.
12. No visible text changed, and no element was added or removed.
13. Every brand colour kept its hue.
14. The reply follows the format in layer 08, with one ratio-source sentence.
15. Token mode: variables are used wherever one matches (component, then role, then primitive), no name was invented, the modern group was kept, each drift is a fix or a "Drift:" line, and the token file was not edited.
15a. Khmer text has line-height 1.6 and letter-spacing 0.
16. No passing pair got a lower ratio, no passing value was replaced by a different token value, and the script was run as one plain command or the reply says it could not run.

Hand the answers to layer 08 for the quality bar and to layer 10 for the record.
