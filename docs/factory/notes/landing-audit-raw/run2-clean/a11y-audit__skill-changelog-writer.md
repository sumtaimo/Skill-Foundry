<!-- skill: a11y-audit | input: skill-changelog-writer | turns: 4 | cost_usd: 0.147 | permission_denials: 0 | is_error: False -->

## Accessibility audit: changelog-writer skill page

Input: HTML, 241 elements. The script ran 38 checks and found 1 (0 failure, 1 advisory). This is not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has several navigation landmarks and this one has no name, so a screen reader lists them all as "navigation". The other one, `qbar`, is already named "Questions".
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Main">
   ```
   Note: the page's visible text is translated at run time through `data-i18n`. If the label should follow the language switch, give it a `data-i18n` hook like the other strings. I did not add one.

### Needs a manual test
- Keyboard only: press Tab through the whole page. Every control should be reachable, the order should follow the reading order, and focus should never be trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px). No content should be lost and nothing should need two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists. A person must check that it says what each image is for (SC 1.1.1).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- The illustration SVGs (lines 31 and 72) were removed from the file. Their accessible names and whether they are hidden from assistive technology could not be audited. If they are decorative, they need `aria-hidden="true"`. If they carry meaning, they need `role="img"` and a name.
- `site.js` was not in the input. State set at run time, such as the `aria-pressed` toggle on the theme button, the language switch, the copy buttons' feedback and the `aria-current` on the question tabs, is covered only by the manual tests above.
- `banner.svg` (line 167) is referenced but was not supplied. Only the `<img>` tag was audited, and its alt text is present.
