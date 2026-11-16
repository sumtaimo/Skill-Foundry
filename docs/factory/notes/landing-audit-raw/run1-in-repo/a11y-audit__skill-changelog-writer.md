<!-- skill: a11y-audit | input: skill-changelog-writer | turns: 6 | cost_usd: 0.373 | permission_denials: 1 | is_error: False -->

## Accessibility audit: changelog-writer skill page

Input: HTML, 241 elements. The script ran 38 checks and found 1 (0 failure, 1 advisory). This is not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has two navigation landmarks and this one has no name, so a screen reader lists it only as "navigation". The other one, `<nav class="qbar" aria-label="Questions">` on line 39, is already named.
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Main">
   ```

### Needs a manual test
- Keyboard only: press Tab through the whole page. Every control should be reachable, the focus order should follow the reading order, and focus should never get stuck (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader (for example NVDA with Firefox, or VoiceOver with Safari): names, roles, states and headings should be read out as expected (SC 4.1.2, 1.3.1).
- Voice control (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200%, then to 400% on a 1280 CSS px window (about 320 CSS px wide). No content should be lost and nothing should need scrolling in two directions (SC 1.4.4, 1.4.10).
- Alt text quality: the script only checks that alt text exists. A person needs to check that it says what each image is for (SC 1.1.1).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked here; ui-polish covers them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- None.

---

A few things outside the audit itself:
- **CSS not reviewed:** the skill's rules say to audit the markup only, so I didn't open `site.css`.
- **Inline SVGs:** the two `<svg>` elements on lines 31 and 72 contain only a comment saying the content was removed. The audit couldn't check what the real SVGs contain.
- **Khmer button label:** the script didn't flag this, so it isn't in the findings, but it's worth a manual look. The language button on line 24 shows Khmer text ("អានជាភាសាខ្មែរ") on a page set to `lang="en"`. Adding `lang="km"` to its `<span>` would help screen readers pronounce it correctly (SC 3.1.2 Language of Parts, AA).
