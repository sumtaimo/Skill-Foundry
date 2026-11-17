# Layer 08: Output

The reply is one Markdown document with this shape. A fixed sentence from layer 06, when one applies, is the first line, before the heading.

````
## Accessibility audit: <screen name>

Input: <HTML or JSX>, <n> elements. The script ran <r> checks and found <f> (<x> failure, <y> advisory). Not a conformance claim: only the checks listed here ran.
Skipped by rule: contrast, focus-ring style, spacing and target size are not checked here (ui-polish owns them), so a count of findings, even 0, does not mean the page is clean.

### Findings
1. **img-alt** · SC 1.1.1 Non-text Content (A) · failure
   Element: `<img src="hero.png">` (line 9)
   Affects: screen reader
   Problem: The image has no alt attribute, so a screen reader reads the file name.
   Fix:
   ```diff
   - <img src="hero.png">
   + <img src="hero.png" alt="Spring sale banner">
   ```

2. **control-name** · SC 4.1.2 Name, Role, Value (A) · failure
   ...

### Needs a manual test
- <each manual test the script printed>

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- None.
````

Quality bar, applied to every finding:

1. The heading line has the rule id in bold, the criterion number and name, the level in brackets and the status, in that order.
2. The element is the script's copy of the opening tag in backticks, and the line number.
3. "Affects" names only the groups the script printed.
4. "Problem" is the script's sentence, shortened only when it repeats the element.
5. The fix is a diff block of the smallest change; one finding, one block.
6. Placeholders are filled from the input (layer 04, step 5); where they cannot be, an open question says which.
7. Findings keep the script's order and numbering.
8. An empty section reads "None."; "Not checked here" keeps the two template bullets word for word without adding hex colour values, contrast ratios or sizes from the input.
9. The two header lines are the script's own "reply header" lines, copied word for word; the second one is in every reply, also when there are 0 findings.
10. When the script ran on a fragment, "Needs a manual test" includes the page-level note.
