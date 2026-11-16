<!-- skill: a11y-audit | input: skill-skill-smith | turns: 6 | cost_usd: 0.164 | permission_denials: 0 | is_error: False -->

## Accessibility audit: skill-smith detail page

Input: HTML, 218 elements (179 lines). The script ran 38 checks and found 1 (0 failure, 1 advisory). Not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has several navigation landmarks and this one has no name, so a screen reader lists them all as "navigation". The other nav (line 39) is already named "Questions".
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Main">
   ```

### Needs a manual test
- Keyboard only: press Tab through the whole input. Every control must be reachable, the order must follow the reading order and focus must never be trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px). No content may be lost and nothing may need two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists. A person must check that it says what each image is for (SC 1.1.1). This applies to the banner image on line 171.

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- Two illustration SVGs (lines 31 and 72) were removed from the file for size, so they were not audited. Check that each one is hidden from assistive technology (`aria-hidden="true"`) or has a name.
- Two things I noticed by reading, which the script did not report, so please confirm them rather than treat them as findings:
  - The language button on line 24 has Khmer text but no `lang="km"`, so a screen reader may read it in the wrong voice.
  - Line 41 uses `aria-current="true"` on a link in an in-page nav. `aria-current="location"` is the usual value, and it is worth confirming that the script updates it as the reader scrolls.
- The script did not read `site.css` or any script. Anything set by styles or scripts, such as the theme and language toggles, the copy-button feedback and the `data-i18n` text swap, needs the manual tests above.
