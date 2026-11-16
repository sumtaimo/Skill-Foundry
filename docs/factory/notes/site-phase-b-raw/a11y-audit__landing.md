## Accessibility audit: landing page

Input: HTML, 505 elements (774 lines, full page). The script ran 38 checks and found 1 issue (0 failures, 1 advisory). This is not a conformance claim: only the checks listed here ran.

### Findings
1. **heading-order** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<h4 lang="en">` (line 189)
   Affects: screen reader
   Problem: The heading level jumps from h2 to h4, so a screen reader user navigating by headings finds a gap in the page outline.
   Fix:
   ```diff
   - <h4 lang="en">Ship a change: retest, release note, error copy</h4>
   + <h3 lang="en">Ship a change: retest, release note, error copy</h3>
   ```
   Change the closing tag to `</h3>` too, and set the size with CSS.

### Needs a manual test
- Keyboard only: press Tab through the whole page. Every control should be reachable, the order should follow the reading order, and focus should never get trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, or VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200%, then to 400% at 1280 CSS px wide (about 320 CSS px). No content should be lost and nothing should need scrolling in two directions (SC 1.4.4, 1.4.10).
- Alt text quality: the script only checks that alt text exists. A person must check that it says what each image is for (SC 1.1.1).
- Forms: submit with errors and check that the screen reader announces each error and moves to the first one (SC 3.3.1, 4.1.3).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- The large illustrations were removed from the HTML before the audit (for example `<svg><!-- illustration svg removed for size --></svg>` at line 192). The script could not check their text alternatives or whether they are hidden from screen readers, so audit those SVGs on the full page.
- The other recipe titles, `<h4 lang="en">` at lines 321 and 598, sit in the same `#together` section as line 189. The script didn't flag them because each one follows an h4. If you apply finding 1, should they also become `<h3>` so the recipe titles stay at the same level?