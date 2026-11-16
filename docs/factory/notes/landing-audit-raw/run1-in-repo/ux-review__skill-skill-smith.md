<!-- skill: ux-review | input: skill-skill-smith | turns: 7 | cost_usd: 0.343 | permission_denials: 0 | is_error: False -->

## UX review: Skill detail page of "Skill Foundry" (skill-smith)

Reviewed: Code (page.html, site.css) and the visitor flows A to D in flows.md, covering the whole skill detail page as one screen.
Main goal: not stated
Steps to main goal: 1 (skill detail page)
Findings: 6 (S1: 0, S2: 2, S3: 3, S4: 1)

### Findings

1. **Header nav, Install and Proof links** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install" and "../../index.html#proof"
   - User experiences: The user clicks Install in the header to install this skill and is taken to the landing page, away from this page's Install section.
   - Recommendation: Make each header label lead to the same-named section of the page the user is on, or show clearly that it leaves the page.

2. **Skill head, Copy install command button** | S2 Major | R-ux-review-10
   - Evidence: "unzip skill-smith-1.0.0.zip -d .claude/skills/"
   - User experiences: The user pastes the command before downloading the zip, or in a folder that does not hold it, and gets an error.
   - Recommendation: Show next to the button what the copied command needs, so the user does not have to remember to download the zip and where it was saved.

3. **Header and page buttons, Copy and Copy install command** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px;" and ".tools a { color: var(--muted); font-size: .9rem; }"
   - User experiences: The user taps small buttons and header links with a finger and sometimes misses them or hits a neighbour.
   - Recommendation: Make every button and header link at least 44 by 44 px, padding included.

4. **All skills back link** | S3 Minor | R-ux-review-12
   - Evidence: "../../index.html" and "All skills"
   - Shown absent: The link carries no place in the collection and no search or filter the visitor came from.
   - User experiences: The user clicks All skills after reading, lands at the top of the landing page, and scrolls to find the skills again.
   - Recommendation: Return the user to the place in the collection they came from, with their search and filter kept, and keep the way back reachable from anywhere on the page.

5. **What you type, one-line box** | S3 Minor | R-ux-review-10
   - Evidence: "Paste this one line after you install the skill."
   - User experiences: The user pastes the line as it is and asks for a skill named test-planner, not for a skill they need.
   - Recommendation: Mark which parts of the line are the user's own values to replace, and say that the line is an example.

6. **Skill head, roles and tags** | S4 Note | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px; color: var(--fg);"
   - User experiences: The user sees role and tag pills that look like buttons, clicks one and nothing happens.
   - Recommendation: Make the role and tag labels look different from clickable controls, or make them lead somewhere.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the Install text says "It downloads the zip, checks its SHA-256 and unzips it", but both copy buttons carry only "unzip skill-smith-1.0.0.zip -d .claude/skills/". What does site.js put on the clipboard?
- Copy, Copy the answer and Copy install command: what does the user see after a click, and after a failed copy? site.css has done and fail button classes, but site.js is not in the input.
- Sticky "Questions" bar: which tab is current in the Download, Install and Banner sections? They have no tab, and the current state is set by site.js.
- Flow D: does the landing page keep the visitor's search and role filter on return, and does anything on this page help compare skills (previous, next or related)?
- Flow B: where can the visitor open the 3 recorded cases behind "Tested by a real agent: 3 of 3 cases pass"? The files under evals/live are plain text, not links.
- Header Install and Proof links: what do the landing page sections show, and do they explain this skill?
- Main goal: which of flows A to D is the one the page is built for?
- Sizes and gaps of the sticky bar tabs, the back link and the checksums.json and Download SVG links on a phone: are they shown anywhere?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
