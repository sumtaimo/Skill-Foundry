<!-- skill: a11y-audit | input: skill-spec-writer | turns: 4 | cost_usd: 0.155 | permission_denials: 0 | is_error: False -->

## Accessibility audit: spec-writer skill page

Input: HTML, 249 elements. The script ran 38 checks and found 1 (0 failure, 1 advisory). Not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has several navigation landmarks and this one has no name, so a screen reader lists them all as "navigation". The other one, `<nav class="qbar">` at line 39, is already named "Questions".
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Main">
   ```

### Needs a manual test
- Keyboard only: press Tab through the whole input. Every control is reachable, the order follows the reading order and focus is never trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px). No content is lost and nothing needs two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists. A person must check that it says what each image is for (SC 1.1.1). On this page that is the banner image at line 186.

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- The two illustration SVGs (lines 31 and 72) were removed from the input, so their markup, names and `aria-hidden` state were not audited.
- Behaviour that lives in scripts outside the input was not audited. That covers the theme and language toggles (`aria-pressed`, `data-i18n` text swaps), the copy buttons and the tab bar's `aria-current`. Test these with a screen reader to see whether changes are announced.
