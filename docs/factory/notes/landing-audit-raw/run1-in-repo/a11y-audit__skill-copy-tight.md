<!-- skill: a11y-audit | input: skill-copy-tight | turns: 6 | cost_usd: 0.384 | permission_denials: 0 | is_error: False -->

## Accessibility audit: Copy Tight skill page

Input: HTML, full page, 242 elements. The script ran 38 of 38 checks and found 1 (0 failure, 1 advisory). This is not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has more than one navigation landmark, and this one has no name. A screen reader lists every unnamed one as just "navigation". The other one is already named `aria-label="Questions"` (line 39).
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Main">
   ```

### Needs a manual test
- **Keyboard only:** press Tab through the whole page. Every control should be reachable, the order should follow the reading order, and focus should never get stuck (SC 2.1.1, 2.1.2, 2.4.3).
- **Screen reader** (for example NVDA with Firefox, or VoiceOver with Safari): check that names, roles, states and headings are read out as expected (SC 4.1.2, 1.3.1).
- **Voice control** (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- **Zoom and reflow:** set the browser to 200%, then to 400% at 1280 CSS px wide (about 320 CSS px). No content should be lost and nothing should need scrolling in two directions (SC 1.4.4, 1.4.10).
- **Alt text quality:** the script only checks that alt text exists. A person must check that it says what each image is for (SC 1.1.1). Here that is the `banner.svg` image on line 154.

### Not checked here
- **Contrast, focus-ring style, spacing and target size:** not checked; ui-polish owns them. That includes `site.css`, because the script reads only markup.
- **The flow and the wording:** whether the flow makes sense and the words are clear is not part of this audit.
- **The removed illustrations:** the SVGs on lines 31 and 72 were taken out of the file, so the script only saw empty `<svg>` tags.
- **`site.js`:** the script never ran it, so it can't see text swapped in through `data-i18n`, or the `aria-pressed` and `aria-current` updates.

### Open questions
- **Nav name:** is "Main" the right name for the header nav? It holds both the site links and the theme and language buttons.
- **Decorative SVGs:** were the removed illustration SVGs (lines 31 and 72) decorative? If they were, each one needs `aria-hidden="true"`. If they carry meaning, each needs a name. Check the full file.
- **Khmer button text:** the language button text `អានជាភាសាខ្មែរ` (line 24) is Khmer on a page marked `lang="en"`. None of the script's checks covers this, so it isn't a finding. Please check whether the button should have `lang="km"`.
