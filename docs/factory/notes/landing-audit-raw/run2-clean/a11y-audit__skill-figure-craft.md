<!-- skill: a11y-audit | input: skill-figure-craft | turns: 7 | cost_usd: 0.142 | permission_denials: 0 | is_error: False -->

## Accessibility audit: figure-craft skill detail page

Input: HTML, 290 elements. The script ran 38 of 38 checks and found 1 (0 failure, 1 advisory). Not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has several navigation landmarks and this one has no name, so a screen reader lists them all as "navigation". The other one, `<nav class="qbar" aria-label="Questions">` (line 39), is already named.
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Main">
   ```

### Needs a manual test
- Keyboard only: press Tab through the whole page. Every control should be reachable, the order should follow the reading order, and focus should never be trapped (SC 2.1.1, 2.1.2, 2.4.3). Include the theme and language buttons, the copy buttons and the sandboxed iframe.
- Screen reader pass (for example NVDA with Firefox, or VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1). Check that the theme button's `aria-pressed` state and its changing label ("Switch to dark theme") are announced sensibly.
- Voice control pass: say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: test at 200% and at 400% (about 320 CSS px wide). No content should be lost and nothing should need two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists. A person must check that it says what each image is for (SC 1.1.1). This applies to the banner image.
- The large illustration SVGs were removed from the file, so they were not audited. Re-run the audit on the full file to cover their `title`, `role`, `aria-label` and any hover or focus labels.

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- None.

The script found only one issue. That does not mean the page is accessible, because the manual tests above still need to be done. I confirmed the flagged `<nav class="tools">` is on line 18 of `page.html`. I didn't open `site.css`, since the skill covers markup only.
