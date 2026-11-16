<!-- skill: a11y-audit | input: skill-design-system | turns: 7 | cost_usd: 0.151 | permission_denials: 0 | is_error: False -->

I ran the audit script and I'm now writing up the result.

## Accessibility audit: design-system

Input: HTML, 262 elements. The script ran 38 checks and found 1 (0 failure, 1 advisory). Not a conformance claim: only the checks listed here ran.

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
   The other nav (line 39) is already named "Questions", so "Main" is distinct.

### Needs a manual test
- Keyboard only: press Tab through the whole input. Every control is reachable, the order follows the reading order and focus is never trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px). No content is lost and nothing needs two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists. A person must check that it says what each image is for (SC 1.1.1).
- Also check the three illustration SVGs (lines 31, 72, 77). They were removed from the file for size, so the script could not see them.

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- None.
