<!-- skill: a11y-audit | input: skill-ui-polish | turns: 10 | cost_usd: 0.189 | permission_denials: 1 | is_error: False -->

## Accessibility audit: ui-polish skill page

Input: HTML, 108 elements. The script ran 38 checks and found 1 (0 failure, 1 advisory). Not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has several navigation landmarks and this one has no name, so a screen reader lists them all as "navigation".
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Main">
   ```
   The other navigation (line 39) is already named "Questions", so "Main" keeps the two distinct.

### Needs a manual test
- Keyboard only: press Tab through the whole input; every control is reachable, the order follows the reading order and focus is never trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px); no content is lost and nothing needs two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists, a person must check that it says what each image is for (SC 1.1.1).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- The two illustration SVGs (lines 31 and 72) were removed from the file, so the script saw empty `<svg>` elements. Their accessible treatment (hidden from screen readers or named) was not audited. Re-run on the full file to confirm.
- `site.css` and the page's script were not part of the input, so behaviour added at run time (for example the theme and language buttons updating their state) is covered only by the manual tests above.
