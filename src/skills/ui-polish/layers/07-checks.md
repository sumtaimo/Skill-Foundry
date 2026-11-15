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

Reviewer checklist, answered yes or no (the same list is in references/README.md):

10. Every fix cites one rule id and gives the value before and after.
11. The polished code has exactly one primary action.
12. No visible text changed, and no element was added or removed.
13. Every brand colour kept its hue.
14. The reply follows the format in layer 08, with one ratio-source sentence.
15. Token mode: tokens are used wherever one matches, no token name was invented, and the token file was not edited.

Hand the answers to layer 08 for the quality bar and to layer 10 for the record.
