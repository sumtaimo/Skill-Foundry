# Layer 04: Flow

1. List every visible text string in the input code, in order. This list is used again in layer 07, step 1.
2. List every spacing value (margin, padding, gap, top, right, bottom, left) and every font size, line-height, font weight and colour pair (text on its background).
3. Find the primary action: the action the user names; else the action whose label best matches the screen's main heading; else the first submit button. Every other action becomes secondary.
4. Check each rule of RULES.json, in order R-ui-polish-1 to R-ui-polish-12, against the lists. Each value that breaks a rule becomes one fix.
5. For spacing and font sizes, replace each value with the nearest value on its scale; when two are equally near, use the larger. For utility classes, use the class of that scale value (for example 12 px padding is p-3, 16 px text is text-base).
6. For contrast, look up or compute the ratio (formula and table in references/README.md). Keep the hue: darken or lighten the colour, or change the text colour on it, until the ratio meets rule 4. Write the before and after ratio.
7. For hierarchy, keep the primary action filled and turn every other action into an outline or text style in the same hue.
8. For states, add hover, :focus-visible (outline of at least 2 px, offset 2 px) and, where the element can be disabled, a disabled style. In utility classes use hover:, focus-visible: and disabled: prefixes.
9. Add a prefers-reduced-motion: reduce block that turns off every transition or animation the code has or that a fix adds.
10. Number the fixes 1 to N across all areas. Each fix names its area, the value before, the value after, and its rule id.
11. Rebuild the full polished code with every fix applied. Copy every visible text string from step 1 unchanged.
12. Hand the fixes, the contrast pairs and the polished code to layer 05.
