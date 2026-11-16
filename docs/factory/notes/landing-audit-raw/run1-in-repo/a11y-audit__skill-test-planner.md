<!-- skill: a11y-audit | input: skill-test-planner | turns: 8 | cost_usd: 0.177 | permission_denials: 1 | is_error: False -->

## Accessibility audit: test-planner skill page

Input: HTML, full page, about 200 lines. The script did not run: running commands was denied in this session. I made the 38 checks of the references by reading the markup instead. This is not a conformance claim; only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has two `nav` landmarks. The second one has `aria-label="Questions"`, but this one has no name. A screen reader lists both as just "navigation".
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Site">
   ```
   The input does not say what to call this nav, so "Site" is my choice. Change it if you prefer another word.

The other checks found nothing in the markup I could see:
- `html-lang`, `page-title`, `viewport-zoom` and `main-landmark` are fine.
- Heading order is h1, h2, h3, h4 with no jumps.
- The one `img` has alt text, and every button and link has text.
- Every `aria-labelledby` id and every in-page `#` link resolves.
- No id is duplicated, no `tabindex` is above 0, and there are no nested controls.

### Needs a manual test
- Keyboard only through the whole page: reachable, readable order, no trap (SC 2.1.1, 2.1.2, 2.4.3). Check that the skip link reaches `main`, and that the theme, language and Copy buttons work with Enter and Space. Their behaviour comes from `site.js`, which I did not see.
- A screen reader in a real browser: names, roles, states and headings (SC 4.1.2, 1.3.1). In particular:
  - The theme button changes its text and also uses `aria-pressed`. Check that it does not announce twice or contradict itself.
  - `aria-current="true"` on the first "What it does" tab is fixed in the markup. Check whether `site.js` updates it as the reader scrolls.
- Voice control: say each visible label (SC 2.5.3).
- Zoom to 200% and reflow at 400%, about 320 CSS px wide (SC 1.4.4, 1.4.10).
- Alt text quality for the banner image, and the two illustration SVGs that were removed from the file (SC 1.1.1).
- Whether the Copy buttons announce that they worked. The markup has no live region, but `site.js` may add one (SC 4.1.3).
- Whether the long `pre` blocks, the proof answer and the code boxes, scroll sideways. If they do, they must be reachable by keyboard (SC 2.1.1). I can't tell without the CSS.

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them. The stylesheet was not read for this reason.
- Whether the flow makes sense and whether the words are clear: not part of this audit.
- `site.js` and the Khmer translation swap: not provided.

### Open questions
- The script did not run; these checks were made by reading, so run it to confirm.
- The "អានជាភាសាខ្មែរ" button (line 24) holds Khmer text inside an English page and has no `lang="km"`. That would be SC 3.1.2 Language of Parts (AA), but it is not one of the 38 checks. I could not confirm it from the script, so please confirm it. If it is real, the fix is `<span data-i18n="lang.toKh" lang="km">`.
- Which name should the first nav get (finding 1)?
