<!-- skill: ux-review | input: skill-ui-polish | turns: 7 | cost_usd: 0.444 | permission_denials: 0 | is_error: False -->

## UX review: Flow A, Decide if this skill is the one I need

Reviewed: Code (page.html and site.css) and a flow description, covering the ui-polish skill detail page from the cover to "What you get".
Main goal: decide if this skill is the one I need
Steps to main goal: 3 (What it does, What you type, What you get)
Findings: 4 (S1: 0, S2: 0, S3: 1, S4: 3)

### Findings

1. **What you type, Copy button** | S3 Minor | R-ux-review-2
   - Evidence: ".btn.done { border-color: var(--line-strong); }"
   - Shown absent: the finished state uses the same border colour as the default button (".btn" also sets "var(--line-strong)"), so the styles show no visible change after a copy.
   - User experiences: The user clicks Copy, sees nothing change, and clicks again or pastes to check.
   - Recommendation: Show a visible confirmation at the button after a copy, so the user knows the text is on the clipboard.

2. **Page head, tags and roles** | S4 Note | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px"
   - User experiences: The user sees the tags and role labels in the same pill shape as the header buttons, and may click them expecting a filter.
   - Recommendation: Make labels that cannot be clicked look different from the buttons that can be clicked.

3. **Questions bar, tabs** | S4 Note | R-ux-review-1
   - Evidence: "border-bottom: 2px solid transparent"
   - User experiences: The user sees four muted words with no underline, border or fill, and may not realise they jump to sections.
   - Recommendation: Give the tabs a visible clickable look, such as an underline, a fill or a border.

4. **What you type, Copy button** | S4 Note | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps a button about 37px high, below the 44px minimum, and may miss it on a touch screen.
   - Recommendation: Make every button at least 44px high.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Copy buttons: does the script change the label or add an icon after a copy? Only the styles are shown; the handler is in site.js, which is not shown.
- Questions bar: the markup fixes the current-tab marker on "What it does" and the progress bar starts empty. Does the script update both while the user scrolls?
- Cover image: the drawing was removed from the input, so what it shows is not known.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B, Check it is real

Reviewed: Code (page.html and site.css) and a flow description, covering the real answer, the tests line and the rules counts.
Main goal: check it is real
Steps to main goal: 3 (What a real agent produced, Tested by a real agent line, How you know counts)
Findings: 2 (S1: 0, S2: 0, S3: 1, S4: 1)

### Findings

1. **What you get, Copy the answer button** | S3 Minor | R-ux-review-2
   - Evidence: ".btn.done { border-color: var(--line-strong); }"
   - Shown absent: the finished state uses the same border colour as the default button, so the styles show no visible change after a copy.
   - User experiences: The user clicks "Copy the answer" at the end of a long box, sees nothing change, and cannot tell whether it worked.
   - Recommendation: Show a visible confirmation at the button after a copy.

2. **What you get, Copy the answer button** | S4 Note | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps a button about 37px high, below the 44px minimum, and may miss it.
   - Recommendation: Make every button at least 44px high.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Real answer: the text ends mid-word at "outline:var(--border-width-focus) soli", and the copy button carries the same cut text, yet the page says "word for word". Is the answer cut on the live page, or only in this input?
- Tests line: "Tested by a real agent: 12 of 12 cases pass" has no link in the input. Is there a page where the 12 cases can be inspected?
- Copy buttons: does the script change the label after a copy? The handler is not shown.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C, Install it

Reviewed: Code (page.html and site.css) and a flow description, covering the header button, the Download section and the Install section.
Main goal: install it
Steps to main goal: 4 (Download the zip, check its SHA-256, unzip it, restart Claude Code)
Findings: 6 (S1: 0, S2: 2, S3: 3, S4: 1)

### Findings

1. **Header, Install link** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user on this skill's page clicks Install, expecting this skill's steps, and lands on another page, losing their place.
   - Recommendation: Make the header Install link lead to this skill's own Install section, or label it as the general install page.

2. **Page head, Copy install command button** | S2 Major | R-ux-review-10
   - Evidence: "unzip ui-polish-1.0.0.zip -d .claude/skills/"
   - Shown absent: nothing next to the button shows the command, or says the zip must already be downloaded.
   - User experiences: The user copies the command, pastes it in a terminal, and gets an error because the zip is not there.
   - Recommendation: Show the command beside the button and state what the user must have done first, or make the button's text self-contained.

3. **Install, step 1 and Download section** | S3 Minor | R-ux-review-9
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - Shown absent: the Install section has no download link, and the SHA-256 value and checksums.json link sit in the Download section above.
   - User experiences: The user reads step 1, scrolls up to find the download button and the hash, then scrolls back down.
   - Recommendation: Put the download link, the hash and the checksums link in the same group as the install steps.

4. **Install, two Copy buttons** | S3 Minor | R-ux-review-11
   - Evidence: "Copy install command"
   - User experiences: The user sees "Copy" under the npx command and "Copy install command" under the unzip command, and cannot tell which one is the install command.
   - Recommendation: Label the two buttons so each says which command it copies, and keep the header button's label the same as its twin.

5. **Install, Copy buttons** | S3 Minor | R-ux-review-2
   - Evidence: ".btn.done { border-color: var(--line-strong); }"
   - Shown absent: the finished state uses the same border colour as the default button, so the styles show no visible change after a copy.
   - User experiences: The user clicks Copy on the command, sees nothing change, and clicks again before switching to the terminal.
   - Recommendation: Show a visible confirmation at the button after a copy.

6. **Download section, Download link** | S4 Note | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps a download button about 37px high, below the 44px minimum, and may miss it.
   - Recommendation: Make every button at least 44px high.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the Install paragraph says the single command "downloads the zip, checks its SHA-256 and unzips it", but the command shown and copied only unzips. Does the script copy a longer command than the one displayed?
- Install, npx path: does it need a restart of Claude Code like the manual path? The text does not say.
- Download link: what the user sees after the click is not shown; the browser handles the download.
- Copy buttons: does the script change the label after a copy? The handler is not shown.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D, Go back and compare with another skill

Reviewed: Code (page.html and site.css) and a flow description, covering the back link, the header navigation and the page as a whole.
Main goal: go back and compare with another skill
Steps to main goal: not countable from the input
Findings: 3 (S1: 0, S2: 0, S3: 2, S4: 1)

### Findings

1. **Page, All skills link** | S3 Minor | R-ux-review-10
   - Evidence: "All skills"
   - Shown absent: the page has no list of other skills, no next or previous skill and no way to see two skills together.
   - User experiences: The user leaves this page and must remember what this skill does, needs and shows while looking at the next one.
   - Recommendation: Let the user keep this skill's key facts in view while they open another skill.

2. **Top of page, All skills link and header Collection link** | S3 Minor | R-ux-review-8
   - Evidence: "All skills"
   - User experiences: The user taps plain text links about 23 to 26px high, below the 44px minimum, and may miss them or hit a neighbour.
   - Recommendation: Make the back link and the header links at least 44px high.

3. **Top of page, All skills and Collection links** | S4 Note | R-ux-review-11
   - Evidence: "Collection"
   - User experiences: The user finds two labels for the way back to the list and wonders whether they lead to the same place.
   - Recommendation: Use one label for the way back to the list of skills.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- All skills link: it goes to a fixed address in the input. Does the landing page keep the user's search, role filter and scroll position? The landing page is not in the input.
- Header: it scrolls away with the page and only the questions bar is sticky. Is there another way back to the list when the user is deep in the page?
- Where "All skills" and "Collection" land on the landing page, and whether skills there can be compared, is not shown.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
