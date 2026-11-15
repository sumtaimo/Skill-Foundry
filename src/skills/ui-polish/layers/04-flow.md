# Layer 04: Flow

1. List every visible text string in the input code, in order. This list is used again in layer 07, step 1.
2. List every spacing value (margin, padding, gap, top, right, bottom, left) and every font size, line-height, font weight, radius and colour pair (text on its background).
3. Find the primary action: the action the user names; else the action whose label best matches the screen's main heading; else the first submit button. Every other action becomes secondary.
4. Check each rule of RULES.json, in order R-ui-polish-1 to R-ui-polish-12, against the lists. Each value that breaks a rule becomes one fix.
5. For spacing and font sizes, replace each value with the nearest value on its scale; when two are equally near, use the larger. For utility classes, use the class of that scale value (for example 12 px padding is p-3, 16 px text is text-base).
6. Token mode only (rules 20 to 23), with references/tokens.md open:
   a. The scales of step 5 are the token values. Write the result as the token: `padding: 13px` becomes `padding: var(--space-12)`.
   b. Give every colour the token of its role (surface, text, muted text, link, border, focus, status). Give the primary action the primary-fill tokens and every other action the secondary tokens.
   c. Replace every other raw value that has a matching token, even when the number stays the same (`16px` becomes `var(--space-16)`). List these swaps as **Tokens** fixes, one fix per kind of value.
   d. A value with no matching token stays a plain value. Never invent a token name for it. Write one "Open questions" line that names the value and where it is used.
   e. A group the token file does not have (for example no radius tokens): use the default scale for that group and write one "Open questions" line that names the group.
   f. In utility-class code, write tokens as arbitrary values of the same library (references/tokens.md, "Utility classes").
7. For contrast, get every ratio from the contrast script (references/README.md, "Contrast script"): one run can take every pair. Run it for each pair before the fix and after the fix.
   - Default mode: keep the hue. Run the script with `--suggest` to get the nearest shade of the same hue that passes, or change the text colour on it. Write the before and after ratio.
   - Token mode: pass `--tokens <file>` and the token names. A token pair that passes needs no change. For a token pair that fails, follow references/tokens.md, "A token pair that fails"; never change the token.
   - When commands cannot run (no Node.js, or running commands is not allowed): use the table in references/README.md. For a pair that is not in the table, compute it with the formula there. Never guess a ratio.
   - Remember which of the three sources you used; layer 08, step 6 writes it in the reply.
8. For hierarchy, keep the primary action filled and turn every other action into an outline or text style in the same hue.
9. For target size (rule 7), write `min-height: 44px; min-width: 44px` on every button and link (token mode: `var(--size-target-min)`), even when its padding already makes it taller, so the rule can be checked by search.
10. For states, add hover, :focus-visible (outline of at least 2 px, offset 2 px) and, where the element can be disabled, a disabled style. In utility classes use hover:, focus-visible: and disabled: prefixes.
11. Add a prefers-reduced-motion: reduce block that turns off every transition or animation the code has or that a fix adds.
12. Number the fixes 1 to N across all areas. Each fix names its area, the value before, the value after, and its rule id.
13. Rebuild the full polished code with every fix applied. Copy every visible text string from step 1 unchanged. The token file is not part of the polished code: never paste, repeat or redefine it there.
14. Hand the fixes, the contrast pairs, the ratio source and the polished code to layer 05.
