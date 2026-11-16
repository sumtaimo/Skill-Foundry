<!-- skill: a11y-audit | input: skill-ux-review | turns: 7 | cost_usd: 0.146 | permission_denials: 0 | is_error: False -->

Accessibility audit: skill detail page (ux-review)

Input: HTML, 242 elements. The script ran 38 of 38 checks and found 1 (0 failure, 1 advisory). Not a conformance claim: only the checks listed here ran.

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
   The other nav (line 39) is already named "Questions", so the two are now distinct.

### Needs a manual test
- Keyboard only: press Tab through the whole input; every control is reachable, the order follows the reading order and focus is never trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px); no content is lost and nothing needs two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists, a person must check that it says what each image is for (SC 1.1.1).

Part of this page is built or changed by script (theme and language buttons, copy buttons). Check those in a browser, since the script reads markup only.

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.
- The large illustration SVGs removed from the file: they were not in the input, so their titles and roles were not audited.

### Open questions
- The theme button (line 23) has `aria-pressed="false"` while its visible text changes ("Switch to dark theme"). The script did not flag it. Whether the label and pressed state are updated together when toggled depends on the page script, which is not in the input.
