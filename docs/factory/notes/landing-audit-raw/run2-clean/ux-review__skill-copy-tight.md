<!-- skill: ux-review | input: skill-copy-tight | turns: 6 | cost_usd: 0.295 | permission_denials: 0 | is_error: False -->

## UX review: Skill Foundry skill detail page, Copy Tight

Reviewed: Code (page.html and site.css) plus the four visitor flows in flows.md. The page script (site.js) is not in the input.
Main goal: Decide whether Copy Tight is the right skill, then install it
Steps to main goal: 4 (Download the zip, Check the SHA-256, Unzip into .claude/skills/, Restart Claude Code)
Findings: 8 (S1: 0, S2: 2, S3: 5, S4: 1)

### Findings

1. **Header nav, Install link** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install"
   - Shown absent: This page has its own section named Install, but the header link with the same label leaves the page.
   - User experiences: The user clicks Install in the header to install this skill and lands on the landing page's install section, away from this skill.
   - Recommendation: Make one label lead to one place, so the header entry and this page's Install section are not confused.

2. **Skill head, "Copy install command" button** | S2 Major | R-ux-review-10
   - Evidence: "unzip copy-tight-0.2.0.zip -d .claude/skills/"
   - User experiences: The user clicks the top button, pastes a command they never saw, and it fails because the zip was not downloaded first.
   - Recommendation: Show the command next to the button and make clear that the download must come first, or copy a command that needs no earlier download.

3. **Header and page buttons and links (Copy, theme, language, nav links, All skills)** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps small buttons, about 37 px high, and header or back links, about 23 px high, and sometimes misses them.
   - Recommendation: Make every button and text link at least 44 px high including padding.

4. **"All skills" back link** | S3 Minor | R-ux-review-12
   - Evidence: "All skills"
   - Shown absent: Its address stops at the landing page top, while the header Collection link points to the collection section.
   - User experiences: The user clicks All skills to compare with another skill and lands on the landing page hero, then scrolls to find the list.
   - Recommendation: Return the user to the list of skills, at the card they came from, as a Back control does.

5. **Skill head, role labels and tags (Business analyst, Developer, ux-writing)** | S3 Minor | R-ux-review-1
   - Evidence: "padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px"
   - User experiences: The user sees bordered pills that look like the clickable role filter chips, clicks one, and nothing happens.
   - Recommendation: Make information-only labels look clearly different from clickable chips and buttons.

6. **Install step 1, SHA-256 check** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - User experiences: The user reads the hash in the Download section, opens checksums.json, and has to remember the 64-character value to compare it.
   - Recommendation: Show the hash to compare against, and how to compute it, inside the Install step that asks for the check.

7. **Install section, two copy buttons** | S3 Minor | R-ux-review-11
   - Evidence: "Fastest: run one command in your project (needs Node.js and git)."
   - User experiences: The user sees one install command labelled just Copy and another labelled as the install command, and the top button copies the slower one.
   - Recommendation: Give both install commands the same kind of label, and make the top button copy the one the page calls fastest.

8. **"Questions" tab bar** | S4 Note | R-ux-review-1
   - Evidence: "flex: none; padding: 12px 10px; font-size: .875rem; color: var(--muted); text-decoration: none;"
   - User experiences: The user sees grey text with no underline, border or fill on the three tabs that are not current, and may not notice they are links.
   - Recommendation: Give the inactive tabs a visible sign that they can be clicked.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Copy install command, Copy, Copy the answer and the Download link: the markup says only "see site.js". What does the user see after each click, a loading state, a confirmation or an error? Classes `.done` and `.fail` exist in the stylesheet, but their use is not shown.
- Conflict: The text says the command "downloads the zip, checks its SHA-256 and unzips it", but the visible command is only "unzip copy-tight-0.2.0.zip -d .claude/skills/". Does the script change what is copied?
- Tab bar: "aria-current" is fixed on What it does. Does it follow the scroll, and what shows for Download, Install and Banner, which have no tab?
- Theme and language buttons: after a click, does the label show the current theme and language?
- All skills link: does the landing page keep the search and role filter when the user returns?
- Landing page #install: does it cover this skill or all skills?
- Flow D: what does the landing card show for comparing (what it does, what you type, test result)?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
