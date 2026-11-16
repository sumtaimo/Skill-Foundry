<!-- skill: ux-review | input: skill-changelog-writer | turns: 5 | cost_usd: 0.965 | permission_denials: 0 | is_error: False -->

## UX review: Flow A, "Decide if this skill is the one I need"

Reviewed: Code (page.html, site.css) and the flow description in flows.md, covering the changelog-writer detail page sections "What it does", "What you type" and "What you get".
Main goal: Decide if this skill is the one I need
Steps to main goal: 1 (skill detail page: What it does, What you type, What you get)
Findings: 2 (S1: 0, S2: 1, S3: 0, S4: 1)

### Findings

1. **What you type, the line to paste and its Copy button** | S2 Major | R-ux-review-5
   - Evidence: "Paste this one line after you install the skill."
   - Shown absent: Nothing near the line says that its version, date and changes are an example the user must replace with their own.
   - User experiences: The user copies the line, pastes it unchanged into their project, and the agent writes an entry for version 2.4.0 with dark mode and a login fix they never made.
   - Recommendation: Before the user copies, the section must say which parts of the line are example values to replace with their own version, date and changes.

2. **Questions bar, the four tabs (What it does, What you type, What you get, How you know)** | S4 Note | R-ux-review-9
   - Evidence: ".qbar-tabs { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }"
   - User experiences: The user taps a tab on a phone and can land on the tab next to it, because the tabs are almost touching.
   - Recommendation: Keep at least 8 px between neighbouring tabs in the Questions bar.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Questions bar: does the highlighted tab and the progress line follow the scroll? The markup always marks "What it does" as current, the progress line starts at "width: 0", and site.js is not in the input.
- What you type, Copy button: what does the user see after pressing it? site.js is not shown, and the only "done" style shown, ".btn.done { border-color: var(--line-strong); }", is the same border every button already has.
- Device and visitors: is the page used mainly on a phone or on a desktop? The answer could raise the severity of finding 2.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B, "Check it is real"

Reviewed: Code (page.html, site.css) and the flow description in flows.md, covering the real agent answer, the test claim and the rules counts in "How you know".
Main goal: Check it is real
Steps to main goal: 1 (skill detail page: What a real agent produced, How you know)
Findings: 2 (S1: 0, S2: 0, S3: 2, S4: 0)

### Findings

1. **Skill header and How you know, "Tested by a real agent" line** | S3 Minor | R-ux-review-10
   - Evidence: "Tested by a real agent: 8 of 8 cases pass"
   - Shown absent: The page names none of the cases and links to no result; the cases appear only as file names such as "evals/live/breaking-major.json" in the package list.
   - User experiences: The user wants to see what the eight passing cases tested, finds only file names, and has to download and unzip the package to read them.
   - Recommendation: Show next to the pass count what each of the eight cases checks and its result.

2. **What it does, item "Rules", compared with How you know, "Rules in total"** | S3 Minor | R-ux-review-10
   - Evidence: "Rules: R-changelog-writer-1 to 6, 10 and 11."
   - Shown absent: The text of the rules appears nowhere on the page, and How you know shows "Rules in total" as 11.
   - User experiences: The user reads eight rule ids under What it does, then a total of 11 under How you know, and finds no rule list to explain the difference.
   - Recommendation: Show the rules, or their list, where the counts appear, so the ids and the totals can be checked against each other on the page.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Cover images tagged "Real output from an agent": the picture itself is not in the input ("decorative/illustration svg removed for size"). Does it show the real answer, or an illustration under a "real output" tag?
- How you know: which eleven rules do "Rules in total", "Machine-checked" and "Reviewer checklist" count, given that What it does names eight ids?
- "Copy the answer" button: what does the user see after pressing it? site.js is not shown.
- Questions bar, "How you know" tab: does it become the highlighted tab when the user reaches that section?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C, "Install it"

Reviewed: Code (page.html, site.css) and the flow description in flows.md, covering the header "Copy install command" button and the Download and Install sections.
Main goal: Install it
Steps to main goal: 3 (Download the skill .zip and check its SHA-256; Unzip it into .claude/skills/; Restart Claude Code)
Findings: 5 (S1: 0, S2: 2, S3: 2, S4: 1)

### Findings

1. **Skill header, "Copy install command" button** | S2 Major | R-ux-review-9
   - Evidence: "unzip changelog-writer-1.0.0.zip -d .claude/skills/"
   - User experiences: The user copies the command at the top of the page and runs it before downloading anything, and the unzip fails because the zip is not there yet.
   - Recommendation: The top "Copy install command" button must sit in one group with the Download link, so the zip is fetched before the copied command runs.

2. **Header nav, "Install" link** | S2 Major | R-ux-review-11
   - Evidence: "<a href="../../index.html#install"><span data-i18n="nav.install">Install</span></a>"
   - User experiences: The user clicks Install in the header to install this skill and lands on the landing page instead of this page's Install section.
   - Recommendation: On a skill page, the header "Install" link must lead to that skill's Install section, which is the place its label names.

3. **Install section, step 1** | S3 Minor | R-ux-review-13
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - User experiences: The user opens checksums.json to find a hash that is already printed under the Download link, which adds a step that shows nothing new.
   - Recommendation: The check step must point to the SHA-256 already shown under the Download link, so that no extra file has to be opened.

4. **Install section, after step 3** | S3 Minor | R-ux-review-10
   - Evidence: "Restart Claude Code so it loads the skill."
   - Shown absent: The Install section ends here, and the line to paste next appears only far above, in "What you type".
   - User experiences: The user finishes installing, needs the line to type next, and has to scroll back up past three sections to find and copy it.
   - Recommendation: Show the line to paste, or a direct way to reach it, right after the last Install step.

5. **Copy buttons and Download link (about 37 px tall) and checksums.json link (about 22 px tall)** | S4 Note | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user on a phone taps buttons and a link that are shorter than a fingertip, and a tap can miss.
   - Recommendation: Make every copy button, the Download link and the checksums.json link at least 44 by 44 px.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "Copy install command" buttons: does site.js change the copied text into a command that downloads and checks the zip? The buttons carry "data-install-zip" and "data-sha256-install", and the text says "It downloads the zip, checks its SHA-256 and unzips it", but the command shown is only the unzip line. If site.js does this, finding 1 goes away.
- Copy buttons: what does the user see after a successful copy and after a failed one? site.js is not shown, and the only "done" style shown is the border every button already has.
- Device: is the page used mainly on a phone or on a desktop? The answer could raise the severity of finding 5.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D, "Go back and compare with another skill"

Reviewed: Code (page.html, site.css) and the flow description in flows.md, covering the "All skills" back link, the header nav and the skill header on this page. The landing page and the other skill's page are not in the input.
Main goal: Go back and compare with another skill
Steps to main goal: not countable from the input (this page, then the landing page and another skill page, which are not shown)
Findings: 4 (S1: 0, S2: 0, S3: 3, S4: 1)

### Findings

1. **"All skills" back link** | S3 Minor | R-ux-review-12
   - Evidence: "<p class="back"><a href="../../index.html"><span data-i18n="back">All skills</span></a></p>"
   - User experiences: The user clicks All skills and lands at the top of the landing page, not at the collection or the card they came from, and has to scroll back down.
   - Recommendation: The back link must return the visitor to the collection where they left it, with any search or role filter they had set still applied.

2. **Whole page, comparing with another skill** | S3 Minor | R-ux-review-10
   - Evidence: "Go back and compare with another skill"
   - Shown absent: The page shows no other skill and no side-by-side view, and nothing keeps this skill's facts once the visitor leaves.
   - User experiences: The user opens another skill and has to remember this one's version, test result and outputs in order to compare the two.
   - Recommendation: Let the visitor see this skill's key facts next to another skill's, so nothing has to be remembered from one page to the next.

3. **Skill header, tags (changelog, semver, release) and roles (Developer, QA auditor)** | S3 Minor | R-ux-review-1
   - Evidence: ".role { padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg); }"
   - User experiences: The user clicks the Developer or semver pill to find similar skills, because it looks like the clickable pills of the role filter, and nothing happens.
   - Recommendation: Tags and roles that cannot be clicked must not look like the bordered, clickable pills of the role filter.

4. **Header nav "Collection" link (about 23 px tall) and "All skills" link (about 26 px tall)** | S4 Note | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - User experiences: The user on a phone taps a thin text link to go back, and a tap can miss.
   - Recommendation: Make the "All skills" and "Collection" links targets of at least 44 by 44 px.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Landing page: when the visitor comes back through "All skills" or the browser's back button, are the search text, the role filter and the scroll position kept? The answer could change the severity of finding 1.
- Landing page and the other skill's page: what does the visitor do on each? These pages are needed to count the steps for this flow.
- Device: is the page used mainly on a phone or on a desktop? The answer could raise the severity of finding 4.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
