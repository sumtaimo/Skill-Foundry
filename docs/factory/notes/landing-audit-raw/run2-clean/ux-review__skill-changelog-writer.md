<!-- skill: ux-review | input: skill-changelog-writer | turns: 8 | cost_usd: 0.349 | permission_denials: 0 | is_error: False -->

## UX review: changelog-writer skill detail page (Skill Foundry)

Reviewed: Code (page.html, site.css) and the flows A to D in flows.md, covering the whole detail page as one screen; site.js and the landing page are not in the input.
Main goal: not stated (flows A to D name four goals: decide, check it is real, install, compare)
Steps to main goal: 1 (Skill detail page, changelog-writer)
Findings: 8 (S1: 0, S2: 2, S3: 5, S4: 1)

### Findings

1. **Header nav, Install and Proof links** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user clicks Install or Proof in the header to act on this skill and lands on the landing page instead of this page's Install or How you know section.
   - Recommendation: Make header links that share a name with a section of this page go to that section, or make clear they lead to the whole site.

2. **Copy install command button (skill head) and Install section, Or copy one command** | S2 Major | R-ux-review-10
   - Evidence: "unzip changelog-writer-1.0.0.zip -d .claude/skills/"
   - User experiences: The user pastes the command, which the page says downloads the zip, and gets a file-not-found error because it only unzips.
   - Recommendation: Make the copied command do what the text says it does, or state that the zip must first be downloaded into the current folder.

3. **Header buttons, Copy buttons and nav links** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps the small theme, language and Copy buttons and the plain-text nav links on a touch screen and sometimes misses or hits a neighbour.
   - Recommendation: Make every button and link target at least 44 by 44 px, including padding.

4. **Skill head, tags and roles (changelog, semver, release; Developer, QA auditor)** | S3 Minor | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px"
   - User experiences: The user sees rounded bordered pills, like the role filter chips on the landing page, clicks one to find similar skills and nothing happens.
   - Recommendation: Make tags and roles look different from clickable chips, or make them lead to the matching skills.

5. **What you type section, paste line** | S3 Minor | R-ux-review-10
   - Evidence: "Inputs: skill or project, current version"
   - User experiences: The user sees one sample line with a version and a date and must go back to the What it does list to learn which facts to give.
   - Recommendation: Show next to the paste line which facts the user must supply and that the line is a sample to adapt.

6. **Install section, step 1** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - User experiences: The user reads the SHA-256 in the Download section, then must carry it to Install step 1 and compare it with a separate checksums.json.
   - Recommendation: Show the expected checksum in the step that asks for the check, so the user compares without leaving it.

7. **Install section, npx command button** | S3 Minor | R-ux-review-11
   - Evidence: "Fastest: run one command in your project (needs Node.js and git)."
   - User experiences: The user copies the top Copy install command button, which gives the zip route, and never learns that the npx command below is the one the page calls fastest.
   - Recommendation: Give every button that copies an install command the same label, and make the top button copy the route the page calls fastest.

8. **Back link All skills and header nav Collection** | S4 Note | R-ux-review-11
   - Evidence: "All skills"
   - User experiences: The user wants to compare another skill, sees two differently named links to the skill list and cannot tell whether they differ.
   - Recommendation: Give the link to the skill list one name, or make the difference between the two links visible.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: Copy install command, the page text says the command "downloads the zip, checks its SHA-256 and unzips it", but data-copy holds only the unzip line, and the data-install-zip and data-sha256-install attributes suggest site.js builds another command. What exactly goes to the clipboard?
- Copy, Copy the answer and Copy install command buttons: what does the user see after a click (loading, confirmation, failure)? This is not in the input, because site.js is not shown.
- Back link All skills: when the visitor arrives from a search result or a filtered list, does the landing page restore the search term and role filter? The link is a plain page address.
- Flow D, landing page cards: do they show the same tags, roles and test result as this page, so the visitor can compare without remembering them? Nothing on this page links to related skills.
- Tested by a real agent: 8 of 8 cases pass: where can the visitor see the 8 cases or the run record? The files in the package are code text, not links, and the input shows no other route.
- Questions bar: Download, Install and Banner to share have no tab; which tab is highlighted while the visitor reads them? The state is set by site.js, which is not shown.
- Sizes and device: the real heights of the nav links and of the Back link, and whether visitors use touch screens, are not given.
- What you type: where is the line pasted (agent chat, terminal)? The page does not say.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
