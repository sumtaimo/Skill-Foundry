<!-- skill: a11y-audit | input: skill-copy-tight | turns: 4 | cost_usd: 0.144 | permission_denials: 0 | is_error: False -->

## Accessibility audit: Copy Tight skill page

Input: HTML, 242 elements. The script ran 38 checks and found 1 (0 failure, 1 advisory). Not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has several navigation landmarks and this one has no name, so a screen reader lists them all as "navigation". The other one (line 39) is already named "Questions".
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

### Open questions
- Two `<svg>` illustrations (lines 31 and 72) were removed from the file for size, so they were not audited. Each should be hidden with `aria-hidden="true"` if decorative, or given a name if informative.
- The text is swapped at run time (`data-i18n`) by a script that is not in the input (`site.js`, line 12), so the names users actually hear may differ from the markup. The screen reader and voice control tests above should be run on the live page.
