<!-- skill: ux-review | input: skill-ux-review | turns: 10 | cost_usd: 0.459 | permission_denials: 0 | is_error: False -->

I read the skill's layers and rules, then the page, stylesheet and flows. I'm giving one review per flow, as the skill requires when there is more than one flow.

## UX review: Flow A, Decide if this skill is the one I need

Reviewed: Code (page.html, site.css) and the page-order description, covering the head, "What it does", "What you type" and "What you get".
Main goal: decide if this skill is the one I need
Steps to main goal: 3 (What it does, What you type, What you get)
Findings: 3 (S1: 0, S2: 0, S3: 2, S4: 1)

### Findings

1. **What it does, list of ten layers** | S3 Minor | R-ux-review-13
   - Evidence: "Intent: the goal and the defined terms."
   - User experiences: The user reads ten lines about how the skill is built and still cannot tell what it will do for their work.
   - Recommendation: Make this step show what the skill does for the visitor's own work, and move the build structure out of the deciding path.

2. **What you type, example request box** | S3 Minor | R-ux-review-3
   - Evidence: "pre { margin: 0; overflow-x: auto; max-width: 100%; white-space: pre; }"
   - User experiences: The user sees only the first part of a long request on one line and must scroll sideways to read the rest.
   - Recommendation: Show the whole example request without sideways scrolling, so the visitor can read what to type at a glance.

3. **In-page tabs bar, four section tabs** | S4 Note | R-ux-review-9
   - Evidence: "gap: 4px; overflow-x: auto"
   - User experiences: The user taps a tab and sometimes lands on the neighbouring section, then taps again.
   - Recommendation: Keep at least 8 px between neighbouring tab targets.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Head, cover image: how tall is it at phone width, and is the h1 visible without scrolling? The input gives no cover size.
- In-page tabs bar: does the highlighted tab follow the scroll position? The script is not shown.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B, Check it is real

Reviewed: Code (page.html, site.css) and the page-order description, covering "What you get" (the real answer) and "How you know".
Main goal: check it is real
Steps to main goal: 2 (What you get, How you know)
Findings: 2 (S1: 0, S2: 0, S3: 1, S4: 1)

### Findings

1. **Header nav, Proof link** | S3 Minor | R-ux-review-11
   - Evidence: "<a href="../../index.html#proof">"
   - User experiences: The user looks for evidence for this skill, clicks Proof and leaves for the home page's general proof section.
   - Recommendation: Make the evidence label and destination match this page's own evidence section, or say that the link leaves the skill page.

2. **What a real agent produced, answer box** | S4 Note | R-ux-review-3
   - Evidence: "max-height: 28rem; overflow: auto;"
   - User experiences: The user sees a box cut off partway through the answer, with nothing saying more is hidden below.
   - Recommendation: Show that the answer continues beyond the visible part, or show it in full.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "How you know", "Tested by a real agent: 11 of 11 cases pass": can the 11 cases be opened from the page? The file list shows plain names with no links.
- "Copy the answer" button: does it confirm that the copy worked? The script is not shown.
- In-page tabs bar: does the highlighted tab change when "How you know" is reached? The script is not shown.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C, Install it

Reviewed: Code (page.html, site.css) and the page-order description, covering the head button, "Download" and "Install".
Main goal: install it
Steps to main goal: 2 (Download, Install)
Findings: 4 (S1: 0, S2: 1, S3: 3, S4: 0)

### Findings

1. **Install section, command box (and the head "Copy install command" button)** | S2 Major | R-ux-review-10
   - Evidence: "Or copy one command. It downloads the zip, checks its SHA-256 and unzips it"
   - Shown absent: The command shown, "unzip ux-review-1.0.0.zip -d .claude/skills/", has no download step and no checksum step.
   - User experiences: The user pastes the command, finds no zip in the folder, and has to remember to download the file first and try again.
   - Recommendation: Make the command, or the text beside it, state what must already be done, so the user needs to remember nothing between sections.

2. **Copy install command, Copy and Copy the answer buttons** | S3 Minor | R-ux-review-2
   - Evidence: ".btn.done { border-color: var(--line-strong); }"
   - Shown absent: On a standard button the done state keeps the border colour the button already has, so nothing visible changes.
   - User experiences: The user clicks Copy, sees no change, and clicks again or pastes to check that something was copied.
   - Recommendation: Show a clear on-screen confirmation at the button once the copy has worked.

3. **Header nav, Install link** | S3 Minor | R-ux-review-11
   - Evidence: "<a href="../../index.html#install">"
   - User experiences: The user clicks Install to reach this skill's install steps and lands on the home page's general install section.
   - Recommendation: Make the link go to this page's own install section, or make clear that it leaves the skill page.

4. **Download link, Copy and Copy install command buttons (about 37 px tall); header links (about 23 px); All skills link (about 26 px)** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps small targets on a phone, sometimes misses, and taps again.
   - Recommendation: Give every clickable target a hit area of at least 44 by 44 px.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Install command boxes: does the copy button put a different, fuller command on the clipboard than the one displayed? The button carries zip and checksum data, but the script is not shown (this could remove finding 1).
- Copy buttons: does the label change after a click? The script is not shown (this could remove finding 2).
- Install step 1: does the page say how to check the SHA-256 against checksums.json? No method is shown.
- Header and buttons: are the heights the sizes quoted above, or does the script add padding? The sizes are computed from the stylesheet.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D, Go back and compare with another skill

Reviewed: Code (page.html, site.css) and the page-order description, covering the back link, header nav and the tags and roles in the head. The landing page is not part of the input.
Main goal: go back and compare with another skill
Steps to main goal: 2 (Skill page, All skills)
Findings: 2 (S1: 0, S2: 0, S3: 2, S4: 0)

### Findings

1. **Head, All skills back link** | S3 Minor | R-ux-review-12
   - Evidence: "<a href="../../index.html"><span data-i18n="back">All skills</span></a>"
   - User experiences: The user clicks back, lands at the top of the home page instead of the list of skills, and scrolls to find the cards again.
   - Recommendation: Return the user to the place in the list they came from.

2. **Head, tags (ux, usability, review, qa, analysis) and roles (Business analyst, QA auditor)** | S3 Minor | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px;"
   - User experiences: The user takes the bordered pills for filters, clicks one hoping to see similar skills, and nothing happens.
   - Recommendation: Make the tags and roles either clearly look like plain labels or lead to the matching skills.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- All skills link: does the home page keep the search text and role filter the visitor had set? The landing page and script are not shown.
- All skills link: does the browser restore the scroll position on return? The input does not show it.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
