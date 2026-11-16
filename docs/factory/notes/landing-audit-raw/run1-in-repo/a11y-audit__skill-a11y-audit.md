<!-- skill: a11y-audit | input: skill-a11y-audit | turns: 9 | cost_usd: 0.615 | permission_denials: 1 | is_error: False -->

The audit script was blocked in this session (Bash isn't allowed), so I ran the skill's checks by reading: I went through the page against the script's rule logic in `engine/audit.mjs`.

## Accessibility audit: a11y-audit | Skill Foundry

Input: HTML full page (`page.html`, 325 lines). I couldn't get an exact element count because the script didn't run. I applied all 38 checks by reading and found 1 problem (0 failures, 1 advisory). This is not a conformance claim: only the checks listed here ran.

### Findings
1. **landmark-name** · SC 1.3.1 Info and Relationships (A) · advisory
   Element: `<nav class="tools">` (line 18)
   Affects: screen reader
   Problem: The page has two navigation landmarks and this one has no name. The other one, `<nav class="qbar" aria-label="Questions">` on line 39, does have a name. A screen reader lists this one only as "navigation".
   Fix:
   ```diff
   - <nav class="tools">
   + <nav class="tools" aria-label="Main">
   ```
   Give each navigation a different name.

### Needs a manual test
- **Keyboard only:** press Tab through the whole page. Every control should be reachable, the order should follow the reading order, and focus should never get stuck (SC 2.1.1, 2.1.2, 2.4.3).
- **Screen reader** (for example NVDA with Firefox, or VoiceOver with Safari): names, roles, states and headings should be spoken as expected (SC 4.1.2, 1.3.1).
- **Voice control** (for example Voice Control or Dragon): saying each visible label should activate its control (SC 2.5.3).
- **Zoom and reflow:** at 200%, and at 400% on a 1280 CSS px wide window (about 320 CSS px), no content should be lost and nothing should need scrolling in two directions (SC 1.4.4, 1.4.10).
- **Alt text quality:** the checks only confirm that alt text exists. A person needs to check that it says what each image is for (SC 1.1.1).

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked here. The ui-polish skill covers them, so `site.css` was not reviewed.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- The script did not run; these checks were made by reading, so run it to confirm: `node engine/audit.mjs --file page.html`.
- **Finding 1:** "Main" is my guess at a name. Use whatever name you call that header navigation.
- The illustration SVGs on lines 31 and 72 were cut from the file, and both arrive as a bare `<svg>`. The checks only look at SVGs that have `role="img"`. If they are decorative, add `aria-hidden="true"`. If they carry meaning, add `role="img"` and a name.

---

I also noticed two things that none of the skill's 38 checks cover. They're not part of the formal findings:
- **Khmer text inside an English page (SC 3.1.2 Language of Parts, AA):** the button text `អានជាភាសាខ្មែរ` on line 24 has no `lang="km"`, so a screen reader will try to read it with an English voice. Add `lang="km"` to its `<span>`.
- **Runtime behaviour I couldn't see:** `site.js` isn't included. Two things need testing in a browser:
  - Whether the "Copy" buttons announce that the copy worked (SC 4.1.3).
  - Whether `aria-pressed` on the theme button and `aria-current` on the question tabs update when they change.
