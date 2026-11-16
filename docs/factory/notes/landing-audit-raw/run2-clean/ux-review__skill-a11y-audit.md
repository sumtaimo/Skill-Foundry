<!-- skill: ux-review | input: skill-a11y-audit | turns: 7 | cost_usd: 0.504 | permission_denials: 0 | is_error: False -->

I read the skill's rules, checked all ten quotes against the page files, and the review is below.

## UX review: a11y-audit skill detail page

Reviewed: Code (page.html and site.css) plus the four flows A to D in flows.md; the script site.js is not in the input, so what the buttons do on click is not covered.
Main goal: not stated
Steps to main goal: 1 (a11y-audit skill detail page)
Findings: 10 (S1: 0, S2: 1, S3: 6, S4: 3)

### Findings

1. **Install section, "Or copy one command" block** | S2 Major | R-ux-review-10
   - Evidence: "unzip a11y-audit-1.0.0.zip -d .claude/skills/"
   - Shown absent: The command has no download step and no SHA-256 check, although the text above it says it downloads the zip and checks its SHA-256.
   - User experiences: The user pastes the copied command into a terminal, finds no zip file there, and has to go back to the Download section first.
   - Recommendation: Make the command shown next to the button match what its introduction promises, so the user needs nothing beyond pasting it.

2. **Header nav, Install and Proof links** | S3 Minor | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user clicks Install on this skill's page, lands on the home page's install section instead, and has to come back to find this skill's Install section.
   - Recommendation: Make each header link either stay on this page at the matching section or state plainly that it leads to the site-wide section.

3. **Header nav links and "All skills" back link** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - Shown absent: The rule has no padding, so the link's tap area is only the height of its text line.
   - User experiences: The user taps the small text links at the top and can hit the wrong one or miss.
   - Recommendation: Give each header link and the back link a tap area of at least 44 by 44 px.

4. **Skill head, "Copy install command" button** | S3 Minor | R-ux-review-4
   - Evidence: "Copy install command"
   - Shown absent: The command text is not displayed near the button; it appears only in the Install section far below.
   - User experiences: The user clicks the button at the top without seeing what is copied or what it will do.
   - Recommendation: Show the command, or what it does, next to the button that copies it.

5. **Buttons: Copy, theme button, language button** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps buttons that are shorter than 44 px and can miss them, most likely on a phone.
   - Recommendation: Make every button at least 44 px high and at least 44 px wide.

6. **What it does section, ten-item list** | S3 Minor | R-ux-review-13
   - Evidence: "Intent: confirm the goal and the defined terms."
   - User experiences: The user, deciding whether the skill fits, reads ten lines about its internal working and still has to guess what it does for them.
   - Recommendation: Show in this stage what the skill does for the visitor, and keep the internal layer list out of the path to the decision.

7. **Page end, footer (Flow D: compare with another skill)** | S3 Minor | R-ux-review-10
   - Evidence: "Static site generated from the skill registry."
   - Shown absent: No link to the collection, to another skill or to a side-by-side view is at the end of the page; the back link is only at the top.
   - User experiences: The user scrolls to the end, goes back up or leaves, and must remember this skill's numbers while reading the next skill.
   - Recommendation: Show the facts a visitor compares in a form that can sit beside another skill's, reachable from the end of the page.

8. **Skill head, tags list** | S4 Note | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px;"
   - User experiences: The user sees the tags drawn as pills like filter chips, clicks one, and nothing happens.
   - Recommendation: Draw tags so they cannot be mistaken for the clickable filter chips of the collection.

9. **Questions bar, four tab links** | S4 Note | R-ux-review-1
   - Evidence: "flex: none; padding: 12px 10px; font-size: .875rem; color: var(--muted); text-decoration: none;"
   - User experiences: The user sees four grey words with no underline or border and may not realise they jump to sections.
   - Recommendation: Make all four Questions links look clickable at rest, not only the current one.

10. **Questions bar, spacing between tabs** | S4 Note | R-ux-review-9
    - Evidence: "display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none;"
    - User experiences: The user taps one tab and can hit the next one, because the tabs are only 4 px apart.
    - Recommendation: Keep at least 8 px between neighbouring tabs.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Main goal: flows.md gives four flows (A to D); which one is the main goal of this page?
- Copy buttons (Copy install command, Copy, Copy the answer): what does the user see after clicking, on success and on failure? The styles have done and fail states, but the script is not in the input.
- Skill head, Copy install command: what text lands on the clipboard? The button's data names a zip and a checksum, while the visible command only unzips; the answer could change finding 1.
- Questions bar: at phone width, are all four tabs visible, given the bar scrolls sideways with no scrollbar shown? Which device is expected?
- Questions bar: the first tab is marked current in the markup; does the mark follow the visitor's scrolling?
- All skills link (Flow D): does the collection page come back with the search and role filter the visitor had set?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
