<!-- skill: a11y-audit | input: skill-figure-craft | turns: 12 | cost_usd: 0.213 | permission_denials: 1 | is_error: False -->

## Accessibility audit: figure-craft detail page (Skill Foundry)

Input: HTML, full page. **The script did not run** (running commands was denied in this session), so I made the checks of the references by reading `page.html` and report only what I can quote. 1 finding (0 failure, 1 advisory). Not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has two `nav` landmarks. The in-page one (line 39) is named "Questions", but this one has no name. Both are announced as "navigation" in the landmark list.
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Main">
   ```

Checks I read and found nothing for: `html-lang`, `page-title`, `viewport-zoom`, `main-landmark` (one `main`), `heading-order` (h1, h2, h3, h4 with no jump), `heading-empty`, `img-alt` and `img-alt-bad` (the banner `img` has a real alt), `control-name` (every button and link has text), `link-purpose`, `iframe-title` (has a title), `aria-ref-missing` (all `h-*` targets exist), `duplicate-id`, `aria-hidden-focusable`, `link-no-href`, `table-header`, `label-in-name`.

### Needs a manual test
- Keyboard only through the whole page: reachable, readable order, no trap (SC 2.1.1, 2.1.2, 2.4.3). Include the skip link and the `main` with `tabindex="-1"`.
- A screen reader in a real browser: names, roles, states and headings (SC 4.1.2, 1.3.1).
- Voice control: say each visible label (SC 2.5.3).
- Zoom to 200% and reflow at 400% (SC 1.4.4, 1.4.10).
- Alt text quality of the banner image (SC 1.1.1).
- Run-time behaviour in `site.js`, which I could not see. Check that the Copy buttons announce their result (SC 4.1.3) and that the theme and language buttons update their names and states.
- The cover `<svg>` on line 31 was removed from the file. Check it has `role="img"` with a name, or that it is hidden if decorative (SC 1.1.1).
- The iframe content `example.html` is a separate page and needs its own audit.

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- The script did not run; these checks were made by reading, so run it to confirm.
- "Main" is my choice of name for the first `nav`. The page translates its strings at run time, so the label should go through the same `data-i18n` mechanism, or it will stay English when the page is read in Khmer.
