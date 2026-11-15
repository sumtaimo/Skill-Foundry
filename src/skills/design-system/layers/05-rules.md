# Layer 05: Rules

1. Apply every rule in RULES.json (R-design-system-1 to R-design-system-14) to the token set and the reply.
2. R-design-system-1 and R-design-system-2: each given hex sits unchanged at the step nearest its lightness; the other steps keep its hue, with saturation easing toward the ends and steps 400 to 700 never more colourful than the given hex; the hex is also `--color-brand`; scales run 50 to 900, neutral to 950.
3. R-design-system-3: every text pair in the report is 4.5:1 or more in light and in dark mode; borders and focus rings 3:1 or more; ratios written as numbers with ":1".
4. R-design-system-4 and R-design-system-5: design-tokens.json uses $type and $value with aliases like `{color.neutral.900}`; tokens.css has the light roles on `:root`, the dark roles under `prefers-color-scheme: dark` (unless `data-theme="light"`) and under `[data-theme="dark"]`.
5. R-design-system-6 and R-design-system-7: every group of references/README.md is present, on the fixed scales, with two font weights.
6. R-design-system-8: no external font, import, link, script or url().
7. R-design-system-9: on path c, the existing files are untouched and only the gap files are written.
8. R-design-system-10 and R-design-system-11: one archetype, named with its reason; no compared brand name anywhere.
9. R-design-system-12 to R-design-system-14: the exact sentences of layers 03 and 06, or the report of layer 08.
10. R-design-system-15 to R-design-system-18 apply to the skill folder itself; a run of the skill does not change them.
