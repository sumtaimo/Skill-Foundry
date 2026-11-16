## Accessibility audit: ux-review skill page

Input: HTML, 341 elements. The script ran 38 checks and found 1 (0 failure, 1 advisory). This is not a conformance claim: only the checks listed here ran.

### Findings
1. **heading-order** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<h4>` (line 112)
   Affects: screen reader
   Problem: The heading level jumps from h2 to h4. That leaves a gap in the outline a screen reader user moves through.
   Fix:
   ```diff
   - <h4>1.0.0 - 2026-11-15</h4>
   + <h3>1.0.0 - 2026-11-15</h3>
   ```
   Keep the current size by setting it in CSS (for example `.changelog h3`), not by using the heading level.

### Needs a manual test
- Keyboard only: press Tab through the whole input. Every control should be reachable, the order should follow the reading order, and focus should never get trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, or VoiceOver with Safari): names, roles, states and headings should be spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px). No content should be lost and nothing should need scrolling in two directions (SC 1.4.4, 1.4.10).
- Alt text quality: the script only checks that alt text exists. A person must check that it says what each image is for (SC 1.1.1).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- The large illustrations were removed from the HTML before the audit. Their alt text and roles were not checked, so audit the full page with them back in place.
- The page runs scripts from `site.js` and fills text through `data-i18n` attributes. The script only sees the static markup, so the screen reader pass should cover names and states that change at run time.