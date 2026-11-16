<!-- skill: ux-review | input: skill-design-system | turns: 7 | cost_usd: 0.504 | permission_denials: 0 | is_error: False -->

## UX review: Flow A, Decide if this skill is the one I need

Reviewed: Code (page.html, site.css) and the flow description (flows.md) for the skill detail page; the page script site.js is not in the input.
Main goal: Decide if this skill is the one I need
Steps to main goal: 1 (design-system page)
Findings: 3 (S1: 0, S2: 0, S3: 2, S4: 1)

### Findings

1. **Top of the page, h1 and Copy install command button** | S3 Minor | R-ux-review-13
   - Evidence: "<h1 lang="en">design-system</h1>"
   - Shown absent: No sentence saying what the skill does sits between the h1 and the question bar; the first one is in the takeaway below the bar.
   - User experiences: The user lands on a name, version, tags and an install button, and must scroll past the question bar to learn what the skill does.
   - Recommendation: Show a plain statement of what the skill does and who it is for before the install button, above the question bar.
2. **What it does, list of ten items** | S3 Minor | R-ux-review-13
   - Evidence: "Handoff: how the user loads the tokens and what to use next."
   - User experiences: The user reads ten numbered lines about the skill's own working stages, such as Intent and Handoff, and still cannot tell what it will do for them.
   - Recommendation: Describe what the skill does for the user in a few lines, and keep the ten internal stages out of the decision.
3. **For: roles line, Developer and Business analyst** | S4 Note | R-ux-review-1
   - Evidence: ".role { padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg); }"
   - User experiences: The user sees the roles drawn like the page's buttons, clicks one and nothing happens.
   - Recommendation: Draw the roles and tags so they are clearly different from the controls that can be clicked.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Question bar: does the highlighted tab and the progress line follow the scroll? The first tab is marked current in the markup and the script is not shown.
- Cover image labelled "Real output from an agent": what does it show? Its drawing is removed from the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B, Check it is real

Reviewed: Code (page.html, site.css) and the flow description (flows.md) for the skill detail page; the page script site.js is not in the input.
Main goal: Check it is real
Steps to main goal: 1 (design-system page)
Findings: 1 (S1: 0, S2: 0, S3: 1, S4: 0)

### Findings

1. **What you get, Colours from the real tokens.css figure and What a real agent produced** | S3 Minor | R-ux-review-10
   - Evidence: "Make design tokens for our plant-care app. Brand colour #0d9488"
   - User experiences: The user compares the colours with the answer below, which answers a budgeting-app request, and has to work out that the two come from different runs.
   - Recommendation: State beside each proof which request and recorded run produced it, so the colours and the answer are not read as one run.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "Tested by a real agent: 11 of 11 cases pass" and the run path in the figure caption: can the user open the recorded run or the 11 cases from the page? The path is plain text, not a link.
- Copy the answer: what does the user see after the click? The script is not shown; the stylesheet defines done and fail looks for buttons.
- Colours figure: does it label light and dark? Its drawing is removed from the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C, Install it

Reviewed: Code (page.html, site.css) and the flow description (flows.md) for the skill detail page; the page script site.js is not in the input.
Main goal: Install it
Steps to main goal: 3 (Download the skill .zip and check its SHA-256, Unzip it into .claude/skills/, Restart Claude Code)
Findings: 7 (S1: 0, S2: 2, S3: 5, S4: 0)

### Findings

1. **Header, Install link** | S2 Major | R-ux-review-11
   - Evidence: "<a href="../../index.html#install"><span data-i18n="nav.install">Install</span></a>"
   - User experiences: The user clicks Install in the header to install this skill and is taken to the landing page's install section, away from this skill's own Install section.
   - Recommendation: Make the header Install link lead to this skill's own Install section, or label it so it is clear it leads to the site-wide install help.
2. **Install section, Or copy one command, and the Copy install command button at the top** | S2 Major | R-ux-review-10
   - Evidence: "Or copy one command. It downloads the zip, checks its SHA-256 and unzips it"
   - Shown absent: The command displayed beside this sentence only unzips; it has no download step, no checksum check and no note that the zip must already be in the folder.
   - User experiences: The user pastes the command shown in an empty folder, gets a file-not-found message and has to find the Download link to fetch the zip first.
   - Recommendation: State beside every install command that the zip must be downloaded first, and make the sentence above the command match what the command does.
3. **Top of the page, Copy install command button** | S3 Minor | R-ux-review-9
   - Evidence: "Copy install command"
   - Shown absent: No Download link, checksum or install step sits in the same group as this button.
   - User experiences: The user copies the install command at the top, then scrolls past the answer, the file list and the changelog to reach Download.
   - Recommendation: Put the download, its checksum and the install steps in the same group as the first install button, or link the button to them.
4. **Copy install command, Copy and Copy the answer buttons** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps a button that is about 37 px tall on a touch screen and may miss it (height computed from the shown text height, padding and border).
   - Recommendation: Make every button's tap area at least 44 pixels high.
5. **Question bar, last tab How you know** | S3 Minor | R-ux-review-3
   - Evidence: "<a href="#how-you-know"><span data-i18n="q.know">How you know</span></a>"
   - Shown absent: The bar has no link to Download, Install or Banner to share, the three sections after it.
   - User experiences: The user looking for the install steps finds no tab for them and scrolls through the changelog to reach them.
   - Recommendation: Make the bar cover every section of the page, or show where the user is when Download and Install are on screen.
6. **Install section, step 1** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - Shown absent: Neither the steps nor the Download section say how to compute the SHA-256 of the downloaded file.
   - User experiences: The user must compare a 64-character value with a second file by eye and works out alone how to compute it.
   - Recommendation: Show in the Install section how the user checks the download, next to the value, so nothing has to be looked up elsewhere.
7. **Install section, Fastest command and Copy install command button** | S3 Minor | R-ux-review-11
   - Evidence: "Fastest: run one command in your project (needs Node.js and git)."
   - User experiences: The user sees Copy install command at the top and, below, a different command called Fastest, and cannot tell which one installs the skill.
   - Recommendation: Give the two commands different names, and make the top button copy the one the page recommends.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Copy install command: what exactly goes to the clipboard? The buttons carry download and SHA-256 attributes, which suggest more than the displayed unzip line. This could change finding 2.
- Every Copy button: what does the user see after the click, and after a failed copy? The script is not shown; the stylesheet defines done and fail looks, and the done look matches the normal border.
- The npx command: does it ask before it changes agent files or overwrites an existing skill? The page says it "gives it to the matching roles" and stops agents editing skills.
- Download link: what does the user see after the click? The file is 38 KB and the page shows nothing about the result.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D, Go back and compare with another skill

Reviewed: Code (page.html, site.css) and the flow description (flows.md) for the skill detail page; the landing page is not in the input.
Main goal: Go back and compare with another skill
Steps to main goal: 1 (All skills link on the design-system page)
Findings: 2 (S1: 0, S2: 0, S3: 2, S4: 0)

### Findings

1. **All skills back link and header Collection link** | S3 Minor | R-ux-review-11
   - Evidence: "<a href="../../index.html"><span data-i18n="back">All skills</span></a>"
   - User experiences: The user clicks All skills to compare and lands at the top of the landing page, not at the list of skills, then scrolls to find it.
   - Recommendation: Use one label for going to the list of skills, and make it return the user to the list itself rather than the top of the landing page.
2. **Header links and All skills link** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - User experiences: The user taps small text links, about 23 px tall (computed from the shown text height, no padding), and may miss them on a phone.
   - Recommendation: Make each header link and the All skills link at least 44 pixels high.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Landing page after All skills: are the search and role filter the user had set kept, and is the scroll position restored? The landing page is not in the input.
- Comparing: what does the landing card show of a skill (roles, tests, what you type), and must the user remember this page's details to compare? The card is not in the input.
- Theme and language buttons: does the choice stay on the landing page? The script is not shown.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
