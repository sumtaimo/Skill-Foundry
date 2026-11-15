# Layer 08: Output

1. The reply is the report and nothing else: its first characters are `## UI polish:` and its last line ends the Open questions list. No sentence before it and none after it, not even to say you ran the script (that goes in the ratio-source sentence, step 6). Write it in exactly this shape, with these headings in this order:

```
## UI polish: <screen name>

<n> fixes across <areas>. Text and brand hue kept.

### Fixes
1. **Spacing**: `padding: 13px` is off the scale. Now `padding: 12px`. (R-ui-polish-1)
2. **Contrast**: `#aaaaaa` on `#ffffff` is 2.32:1. Now `#6b7280`, 4.83:1. (R-ui-polish-4)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Card description | #aaaaaa on #ffffff, 2.32:1 | #6b7280 on #ffffff, 4.83:1 |

Ratios computed with the contrast script.

### Polished code
<one code block with the full polished code>

### Not changed
- All visible text, word for word.
- Brand hue kept: <each brand colour>.

### Open questions
- None.
```

2. Each fix starts with its bold area name, one of: **Spacing**, **Typography**, **Contrast**, **Hierarchy**, **States**, **Layout**, **Motion**, and in token mode also **Tokens**.
3. Number fixes 1 to N with no gap or restart. Every area of change is a numbered fix with a bold area name, including **Motion** and **Tokens**: nothing is written between or after the fixes as a loose line. Every fix changes something: never write a fix that only says a value was already right or already a token, and never count one in the summary.
4. Write the full polished code, not a diff and not "the rest is unchanged".
5. List in "Open questions" only what the code and the token file cannot answer, for example which action is primary when two are equal, or a value with no matching token.
6. Under the contrast table write exactly one of these sentences, the one that is true:
   - "Ratios computed with the contrast script."
   - "Ratios from the reference table."
   - "Ratios computed by hand with the formula; run the contrast script to confirm them." (when any ratio was worked out by hand)
7. Token mode changes four things in the shape, and nothing else:
   - The summary line ends with one more sentence, exactly "Tokens from <file name>." with the file name the user gave or the project file's name (for example "Tokens from tokens.css."). Pasted tokens with no name: "Tokens from the pasted tokens." Never add other words to it.
   - Fixes and the polished code name tokens: "`padding: 13px` is off the scale. Now `padding: var(--space-12)`. (R-ui-polish-1, R-ui-polish-20)".
   - Each contrast cell names the token and its value: "`--color-text-muted` (#4a6462) on `--color-surface-default` (#ffffff), 6.38:1". A pair that still fails ends with "fails".
   - "Not changed" has one more line: "- Token file: not edited."
8. Quality bar: a front-end developer can paste the polished code and ship it; a designer reads each fix and sees the rule behind it; nobody can find a changed word, an invented token name or a ratio that a calculator disagrees with.
9. Hand the reply to layer 09.
