<!-- skill: a11y-audit | input: skill-skill-smith | turns: 6 | cost_usd: 0.155 | permission_denials: 0 | is_error: False -->

## Accessibility audit: skill-smith detail page

Input: HTML, 218 elements. The script ran 38 checks and found 1 (0 failure, 1 advisory). Not a conformance claim: only the checks listed here ran.

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
- Keyboard only: press Tab through the whole page. Every control must be reachable, the order must follow the reading order and focus must never be trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px). No content may be lost and nothing may need two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists. A person must check that it says what each image is for (SC 1.1.1). This applies to `banner.svg` (line 171).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.
- `site.css` and the page's scripts (`site.js`, theme, language and copy buttons): the audit reads only the markup.

### Open questions
- The two cover illustrations (lines 31 and 72) were removed from the file for size, so the script ran on `<svg>` stubs. Check in the full file that each real SVG is hidden from screen readers (`aria-hidden="true"`) or has a name, and that its `<span class="cover-tag">` text is the only text announced.

"None." in the findings does not apply here. The single finding is not a clean bill of health, and the manual tests above still need to run on the full page.
