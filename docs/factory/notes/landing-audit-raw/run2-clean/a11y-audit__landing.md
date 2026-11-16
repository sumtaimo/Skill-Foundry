<!-- skill: a11y-audit | input: landing | turns: 6 | cost_usd: 0.222 | permission_denials: 0 | is_error: False -->

## Accessibility audit: Skill Foundry landing page

Input: HTML, 585 elements, 0 components, full page. The script ran 38 checks and found 0 (0 failure, 0 advisory). Not a conformance claim: only the checks listed here ran.

### Findings
None.

"None." means the script found no structural problems. It does not mean the page is accessible. I also read the markup to check the script's result. The structure it covers looks sound:
- `lang="en"` and a `<title>`.
- A skip link to `#main`, and `<header>`, `<nav>`, `<main>` and `<footer>` landmarks.
- Headings run h1, then h2, then h3.
- The search box has a `<label for="find">`.
- Toggle buttons use `aria-pressed`, and the two button groups have `aria-label`s.
- The proof table uses `scope` on its header cells.
- The decorative arrows and the rules-meter bar are `aria-hidden`.

### Needs a manual test
- Keyboard only: press Tab through the whole input; every control is reachable, the order follows the reading order and focus is never trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass (for example NVDA with Firefox, VoiceOver with Safari): names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass (for example Voice Control or Dragon): say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow: set the browser to 200% and to 400% at 1280 CSS px wide (about 320 CSS px); no content is lost and nothing needs two-way scrolling (SC 1.4.4, 1.4.10).
- Alt text quality: the script checks that alt text exists, a person must check that it says what each image is for (SC 1.1.1).
- Forms: submit with errors and check the screen reader announces each error and moves to the first one (SC 3.3.1, 4.1.3).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.
- The illustration SVGs were removed from the file, so their text alternatives, `role` and `aria-hidden` were not audited.
- Behaviour that lives in `site.js` (`<script>` holds only a comment) was not audited. That covers filtering, the language switch, the typing animation, the copy buttons and the theme toggle.

### Open questions
These come from reading the markup, not from the script. They are things to verify, not findings.
- The `<svg>` elements in the hero, the ten `.cover` blocks and the recipe covers sit beside a visible "Real output from an agent" label. Does each SVG have `aria-hidden="true"` (if decorative) or a `<title>`? I could not see this because the SVGs were removed from the file.
- The hero panel types text in with an animation (`data-full` on `<code>`). Can a user pause or stop it, and does it avoid re-announcing every keystroke to screen readers (SC 2.2.2, 4.1.3)?
- The "Copy install command", "Copy" and "Copy the answer" buttons are shown ten or more times with the same visible text. Is the result of a click ("Copied") announced through a status region (SC 4.1.3)? Is each button's accessible name tied to its skill, for example through a hidden suffix that begins with the visible text?
- Switching to Khmer is done by `data-i18n` in script. Does the script update `lang` on `<html>` or on the translated elements (SC 3.1.1, 3.1.2)? The English skill names already carry `lang="en"`.
- `aria-live="polite"` on "10 of 10 skills shown" depends on script updates. Confirm that a screen reader announces the new count when the search or role filter changes.
