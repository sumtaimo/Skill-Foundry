<!-- skill: a11y-audit | input: skill-ui-polish | turns: 5 | cost_usd: 0.172 | permission_denials: 0 | is_error: False -->

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

### Needs a manual test
- Keyboard only: press Tab through the whole input; every control is reachable, the order follows the reading order and focus is never trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px); no content is lost and nothing needs two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists, a person must check that it says what each image is for (SC 1.1.1).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.
- The two `<svg>` illustrations (lines 31 and 72) were removed from the file, so the script could not check them. They need the same audit on the full file.

### Open questions
- The page swaps its visible text through `data-i18n` (for example the Khmer toggle on line 24). An `aria-label` is not part of that text, so the fixed `aria-label="Main"` would stay in English after a language switch. Does `site.js` also translate `aria-label` values? The input does not show it.
