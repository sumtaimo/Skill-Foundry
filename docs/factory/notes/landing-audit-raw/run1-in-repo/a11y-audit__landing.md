<!-- skill: a11y-audit | input: landing | turns: 10 | cost_usd: 0.518 | permission_denials: 1 | is_error: False -->

## Accessibility audit: Skill Foundry landing page

Input: HTML, 585 elements, full page. The script ran 38 checks and found 0 (0 failure, 0 advisory). Not a conformance claim: only the checks listed here ran.

### Findings
None.

### Needs a manual test
- Keyboard only: press Tab through the whole input; every control is reachable, the order follows the reading order and focus is never trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px); no content is lost and nothing needs two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists, a person must check that it says what each image is for (SC 1.1.1).
- Forms: submit with errors and check the screen reader announces each error and moves to the first one (SC 3.3.1, 4.1.3).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them. For that reason `site.css` was not read.
- Whether the flow makes sense and whether the words are clear: not part of this audit.
- The script can't see run-time behaviour. Both `<script><!-- see site.js --></script>` tags (lines 12 and 803) are stubs, so the theme, language, filter, chip and copy handlers were not checked.

### Open questions
- **Removed SVGs:** the illustrations were removed, so every `<svg>` placeholder has no attributes. That covers line 48, lines 61–70 in `<template>`, and each `.cover` such as lines 77 and 225. The script couldn't check whether the real ones carry `aria-hidden="true"` (if decorative) or `role="img"` with a name (if they carry meaning). Please re-run the script on the full file.
- **Khmer button label (not a script finding):** `<button type="button" class="btn ghost" data-action="lang">` (line 24) has Khmer text, "អានជាភាសាខ្មែរ", but no `lang` attribute, inside `<html lang="en">`. A screen reader may read it with an English voice. The script has no check for language of parts, so this is not reported as a finding. Should the span get `lang="km"`?
- **Language switch:** when the page switches to Khmer, does `site.js` update `<html lang>`? This can't be seen from the markup.
- **State changes in scripts:** when the theme button (line 23), the role filter chips (lines 37–41) and the skill chips (lines 50–59) are pressed, do the scripts update `aria-pressed`? Do the "Copy" buttons announce that the copy worked? A screen reader test needs to confirm both.

---

I ran the skill's script on `page.html` and checked its output against the markup. The markup itself is clean: one `main`, skip link, headings in order (h1 → h2 → h3), a labelled search field, a polite live region for the result count, and a table with `th` cells using `scope`. The remaining risk is in what was removed or lives in `site.js`, which the open questions above cover. I didn't treat `flows.md` and `ui-strings.txt` in the same folder as part of the input.
