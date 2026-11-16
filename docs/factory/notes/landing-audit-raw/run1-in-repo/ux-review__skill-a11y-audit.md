<!-- skill: ux-review | input: skill-a11y-audit | turns: 7 | cost_usd: 1.007 | permission_denials: 0 | is_error: False -->

## UX review: Flow A "Decide if this skill is the one I need" (a11y-audit skill detail page)

Reviewed: Code (page.html, site.css, ui-strings.txt) and a description (flows.md) of the a11y-audit skill detail page; this block covers the page head, the "Questions" bar and the first three sections.
Main goal: Decide if this skill is the one I need
Steps to main goal: 3 (What it does, What you type, What you get)
Findings: 4 (S1: 0, S2: 0, S3: 3, S4: 1)

### Findings

1. **Page head, "For: QA auditor / Developer" role labels and the tags "accessibility", "a11y", "wcag", "aria", "qa"** | S3 Minor | R-ux-review-1
   - Evidence: ".role { padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg); }"
   - Shown absent: The markup makes these spans and list items with no link or button, yet they have the same bordered pill shape as the stylesheet's clickable chips.
   - User experiences: The visitor clicks "QA auditor" expecting a list of QA skills, and nothing happens.
   - Recommendation: Make labels that cannot be clicked look clearly different from the clickable chips and buttons, or make them work as links.

2. **"Questions" bar, the links "What you type", "What you get", "How you know"** | S3 Minor | R-ux-review-1
   - Evidence: "flex: none; padding: 12px 10px; font-size: .875rem; color: var(--muted); text-decoration: none;"
   - Shown absent: Only the current link gets an underline; the other three are grey text with no underline, border or fill.
   - User experiences: The visitor sees a row of grey words, doesn't realise they are links, and scrolls the whole page to find each answer.
   - Recommendation: Make every link in the "Questions" bar look clickable, not just the one that is currently marked.

3. **"What it does" section, the list of ten layers** | S3 Minor | R-ux-review-13
   - Evidence: "<li>Intent: confirm the goal and the defined terms.</li>"
   - User experiences: The visitor reads ten lines about the skill's internal parts, like "Intent" and "Handoff", and still can't tell what the skill will do for their own page.
   - Recommendation: Make the "What it does" step show what the skill does for the visitor, and keep the internal layer list out of this step.

4. **"Questions" bar, the gap between neighbouring links** | S4 Note | R-ux-review-9
   - Evidence: ".qbar-tabs { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }" (4 px between targets)
   - User experiences: On a phone, the visitor taps near the edge of "What you get" and sometimes lands on "What you type" instead.
   - Recommendation: Keep at least 8 px between neighbouring links in the "Questions" bar.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "Questions" bar: site.js is not in the input. As the visitor scrolls, does the marked link move to the section in view and does the progress line fill, or does "What it does" stay marked the whole time?
- "What you type" section, "Copy" button: what does the visitor see after clicking it, and what do they see if copying fails?
- Header, "Switch to dark theme" button: does its label change after switching? And when the system setting is already dark, does the page show the dark theme while the button still says "Switch to dark theme"?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B "Check it is real" (a11y-audit skill detail page)

Reviewed: Code (page.html, site.css, ui-strings.txt) and a description (flows.md) of the a11y-audit skill detail page; this block covers "What a real agent produced", the test line and "How you know".
Main goal: Check it is real
Steps to main goal: 3 (What a real agent produced, Tested by a real agent: 13 of 13 cases pass, How you know)
Findings: 0 (S1: 0, S2: 0, S3: 0, S4: 0)

### Findings

No findings.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "Copy the answer" button: the stylesheet has a done state and a fail state for buttons, but the handler is in site.js, which is not in the input. What does the visitor see after a successful copy, and after a failed one?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C "Install it" (a11y-audit skill detail page)

Reviewed: Code (page.html, site.css, ui-strings.txt) and a description (flows.md) of the a11y-audit skill detail page; this block covers the header "Install" link, the top "Copy install command" button, and the "Download" and "Install" sections.
Main goal: Install it
Steps to main goal: 4 (Download a11y-audit 1.0.0 (.zip, 34 KB), check its SHA-256 against checksums.json, unzip it into .claude/skills/, Restart Claude Code)
Findings: 5 (S1: 0, S2: 2, S3: 3, S4: 0)

### Findings

1. **Header, "Install" link** | S2 Major | R-ux-review-11
   - Evidence: "<a href="../../index.html#install"><span data-i18n="nav.install">Install</span></a>"
   - User experiences: The visitor is ready to install, clicks "Install" in the header, and leaves this skill's page for the front page of the site.
   - Recommendation: Make the header "Install" link on a skill page lead to that page's own "Install" section.

2. **Page head, "Copy install command" button** | S2 Major | R-ux-review-9
   - Evidence: "data-copy="unzip a11y-audit-1.0.0.zip -d .claude/skills/""
   - Shown absent: The zip this command unzips can only be downloaded from the "Download" section, five sections further down.
   - User experiences: The visitor copies the command at the top, runs it, and gets an error because the zip it unzips was never downloaded.
   - Recommendation: Put the download and the command that unzips it in one group, so the visitor reaches the download before or beside the command.

3. **"Download" and "Install" sections, the "Download a11y-audit 1.0.0" and "Copy install command" buttons** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;" (with ".875rem/1.2" text and 1 px borders, about 37 px tall)
   - User experiences: On a phone, the visitor has to aim carefully at the download and copy buttons and sometimes taps twice.
   - Recommendation: Make every button at least 44 by 44 px.

4. **"Install" section, step 1 "Download the skill .zip and check its SHA-256 against checksums.json."** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - Shown absent: This step shows neither the SHA-256 value nor a link to checksums.json; both appear only in the "Download" section above.
   - User experiences: The visitor reads the step, scrolls back up to find the hash and the checksums file, then comes back down to continue.
   - Recommendation: Show the SHA-256 value and the checksums.json link inside the step that asks the visitor to check them.

5. **"Install" section, step 3 "Restart Claude Code so it loads the skill."** | S3 Minor | R-ux-review-10
   - Evidence: "Restart Claude Code so it loads the skill."
   - Shown absent: The steps end at the restart and don't show the line to paste next; it appears only under "What you type", three sections above.
   - User experiences: The visitor restarts Claude Code and then has to remember that the line to try is far back up the page.
   - Recommendation: Show what to type first, or a way to reach it, right after the last install step.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Both "Copy install command" buttons: site.js is not in the input. Do they copy the unzip line that is shown, or a longer command that "downloads the zip, checks its SHA-256 and unzips it", as the paragraph says? The answer could remove finding 2.
- Conflict: page.html has the paragraph "Fastest: run one command in your project…" and the npx command with its "Copy" button, but ui-strings.txt (the visible strings) does not list that paragraph. Does the visitor see the npx route?
- "Copy" and "Copy install command" buttons: what does the visitor see after a successful copy, and after a failed one?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D "Go back and compare with another skill" (a11y-audit skill detail page)

Reviewed: Code (page.html, site.css, ui-strings.txt) and a description (flows.md) of the a11y-audit skill detail page; this block covers the "All skills" link and the header "Collection" link.
Main goal: Go back and compare with another skill
Steps to main goal: not countable from the input
Findings: 2 (S1: 0, S2: 0, S3: 2, S4: 0)

### Findings

1. **"All skills" link and header "Collection" link** | S3 Minor | R-ux-review-11
   - Evidence: "<p class="back"><a href="../../index.html"><span data-i18n="back">All skills</span></a></p>" and "<a href="../../index.html#collection">"
   - User experiences: The visitor clicks "All skills" to go back to the list, lands at the top of the front page, and scrolls down to find the skills again.
   - Recommendation: Give the action of returning to the skill list one label and one destination, the list itself.

2. **"All skills" link and header links "Collection", "Install", "For agents", "Proof"** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }" (no padding, so each target is one line of text, about 23 px tall; "All skills" is about 26 px)
   - User experiences: On a phone, the visitor tries to tap the small "All skills" text and misses, or hits a neighbouring header link.
   - Recommendation: Make the "All skills" link and every header link a target at least 44 by 44 px.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Landing page (not in the input): after "All skills", is the visitor's search and role filter kept? And do the cards show what is needed to compare skills (version, "13 of 13 cases pass", rules checked), or must the visitor remember these from this page?
- A visitor who arrived from a search result: where should "All skills" take them, and how many steps does it take to reach a second skill's page?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
