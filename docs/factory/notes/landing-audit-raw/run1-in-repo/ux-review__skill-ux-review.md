<!-- skill: ux-review | input: skill-ux-review | turns: 7 | cost_usd: 0.68 | permission_denials: 1 | is_error: False -->

## UX review: Flow A: Decide if this skill is the one I need

Reviewed: Both the page markup and stylesheet of the "ux-review" skill detail page and the flow description; covers the page head, What it does, What you type and What you get.
Main goal: decide if this skill is the one I need
Steps to main goal: 4 (Page head, What it does, What you type, What you get)
Findings: 4 (S1: 0, S2: 0, S3: 2, S4: 2)

### Findings

1. **What it does, list of ten layers** | S3 Minor | R-ux-review-13
   - Evidence: "Intent: the goal and the defined terms."
   - Shown absent: The section does not say what the skill will not do, which the changelog mentions only as fixed replies.
   - User experiences: The user reads ten lines about the skill's internal procedure and still cannot tell what it will do for their own screen.
   - Recommendation: State in plain terms what the skill does for the visitor and what it does not do, instead of listing its internal steps.

2. **What you get, outputs and files** | S3 Minor | R-ux-review-13
   - Evidence: "The agent hands back these files and a short report."
   - User experiences: The user reads that the agent returns files, then meets a long list of package file names and cannot tell which of them a run returns.
   - Recommendation: Separate what a run returns from what the package contains, and show the result before the file list.

3. **Page head, question tabs (What it does, What you type, What you get, How you know)** | S4 Note | R-ux-review-1
   - Evidence: "flex: none; padding: 12px 10px; font-size: .875rem; color: var(--muted); text-decoration: none;"
   - User experiences: The user sees four grey words, may not realise they jump to sections, and scrolls by hand instead.
   - Recommendation: Make the four tabs look clickable so a first-time visitor sees at once that they jump to sections.

4. **Page head, question tabs** | S4 Note | R-ux-review-9
   - Evidence: ".qbar-tabs { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }"
   - User experiences: The user taps a tab and may land on its neighbour, which jumps to another section.
   - Recommendation: Keep at least 8 px between neighbouring tabs.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- What you type, sample line: the box keeps the whole line on one row, so does the visitor see the full request without sideways scrolling, and is it clear the invoice example is to be replaced with their own flow?
- Question tabs: on a phone the row scrolls sideways with no visible scrollbar, so are all four tabs visible, and does the current tab follow the scroll when the markup marks only the first as current?
- Cover image: the tag says "Real output from an agent", but the drawing is not in the input; what does it show?
- Theme and language buttons: what do they say after the visitor switches, and is there a way back?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B: Check it is real

Reviewed: Both the page markup and stylesheet and the flow description; covers the head claim, the real answer under What you get, and How you know.
Main goal: check the skill is real
Steps to main goal: 3 (Page head, What you get, How you know)
Findings: 1 (S1: 0, S2: 0, S3: 1, S4: 0)

### Findings

1. **How you know, tests and rule counts** | S3 Minor | R-ux-review-13
   - Evidence: "Tested by a real agent: 11 of 11 cases pass"
   - Shown absent: The section shows counts and a changelog, but not the 11 cases, a link to them, or the real answer that sits under What you get.
   - User experiences: The user sees "11 of 11" and "4 of 25 rules machine-checked", cannot open the cases, and cannot tell how much is truly verified.
   - Recommendation: Show or link what the 11 cases are, and explain what machine-checked and reviewer-checked mean, in the section that makes the claim.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Real answer box: it shows a limited height with its own scroll for about 100 lines; does the visitor see any cue that the findings continue below?
- Cover images: both are tagged "Real output from an agent", but the drawings are not in the input; what do they show?
- Copy the answer button: what does the visitor see after clicking, since the script is not in the input?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C: Install it

Reviewed: Both the page markup and stylesheet and the flow description; covers the header, the head button, Download and Install.
Main goal: install it
Steps to main goal: 3 (Download and check the .zip, Unzip into .claude/skills/, Restart Claude Code)
Findings: 7 (S1: 0, S2: 1, S3: 5, S4: 1)

### Findings

1. **Header nav, Install link** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user on the skill page clicks Install, leaves for the landing page, and then has to return to find this skill's own install steps.
   - Recommendation: Make the header Install link reach this skill's install section, or make clear that it leads to install information for the whole collection.

2. **Page head, Copy install command button** | S3 Minor | R-ux-review-2
   - Evidence: ".btn.done { border-color: var(--line-strong); }"
   - Shown absent: The styles give the copied state no visible change from the normal button.
   - User experiences: The user clicks Copy install command, sees no change, and clicks again to be sure before pasting.
   - Recommendation: Show on screen, at the button, that the command was copied.

3. **Copy install command, Copy and Download buttons (about 37 px high)** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps a button on a phone, misses it, and taps again.
   - Recommendation: Give every button a clickable area of at least 44 by 44 px.

4. **Download section, SHA-256** | S3 Minor | R-ux-review-10
   - Evidence: "8a6a73d5ec331c8bdc0f21e282357ec247ec06ddeea472952bf96f79b78b48e2"
   - Shown absent: There is no copy control beside the hash and no command that checks it.
   - User experiences: The user must read 64 characters and compare them by eye with a result they have to work out how to produce.
   - Recommendation: Let the user check the hash without retyping or comparing characters by eye, and say how to run the check.

5. **Install, step 1 (Download the skill .zip)** | S3 Minor | R-ux-review-9
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - User experiences: The user reads step 1, but the Download button, the hash and the commands sit in other sections, so they scroll back and forth.
   - Recommendation: Put the controls of one install path in one visible group, each step next to the thing it names.

6. **Install, step 3 (Restart Claude Code)** | S3 Minor | R-ux-review-10
   - Evidence: "Restart Claude Code so it loads the skill."
   - Shown absent: The step does not say what to do next or show the line to try.
   - User experiences: The user restarts Claude Code and must scroll back up to What you type to find the line to paste.
   - Recommendation: Show the first thing to type, or point to it, at the end of the install steps.

7. **Install section, buttons beside the npx command and the unzip command** | S4 Note | R-ux-review-11
   - Evidence: "Copy install command"
   - User experiences: The user sees two buttons that both copy an install command, one labelled Copy and one Copy install command, and wonders whether they differ.
   - Recommendation: Give the buttons that copy an install command the same label, and make clear which of the three install ways each belongs to.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the Install text says the copied command "downloads the zip, checks its SHA-256 and unzips it", but the button copies only "unzip ux-review-1.0.0.zip -d .claude/skills/"; which is right, and does the script build a longer command from the zip data on the button?
- Copy buttons: what label or message shows after a copy, and what shows when copying fails, since the script is not in the input?
- Header Install link: what is at the landing page's install section, and how does it differ from this page's Install section?
- Unzip command: is the user warned before an existing ux-review folder in .claude/skills/ is overwritten?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D: Go back and compare with another skill

Reviewed: Both the page markup and stylesheet and the flow description; covers the header, the back link and the page head.
Main goal: go back and compare with another skill
Steps to main goal: 3 (Skill detail page, Landing page list, Another skill's page)
Findings: 5 (S1: 0, S2: 1, S3: 3, S4: 1)

### Findings

1. **Page head, tags and roles (ux, usability, QA auditor)** | S2 Major | R-ux-review-1
   - Evidence: ".role { padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg); }"
   - User experiences: The user wants more skills for QA auditors, clicks the QA auditor pill that looks like a filter button, and nothing happens.
   - Recommendation: Make the role and tag pills either lead somewhere, such as the matching skills, or look like plain labels.

2. **Header links and the All skills back link** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - User experiences: The user aims at a small text link to go back, misses it, and tries again.
   - Recommendation: Give the back link and the header links a clickable area of at least 44 by 44 px.

3. **All skills back link** | S3 Minor | R-ux-review-12
   - Evidence: "../../index.html#collection"
   - Shown absent: The back link goes to "../../index.html" with no anchor, unlike the header Collection link, so it opens the top of the landing page.
   - User experiences: The user clicks All skills, lands at the top of the landing page, and scrolls down to the list to find another skill.
   - Recommendation: Take the user back to the list of skills, in the place and with the search or filter they left.

4. **Skill detail page, comparing with another skill** | S3 Minor | R-ux-review-10
   - Evidence: "compare with another skill"
   - Shown absent: The page has no link to another skill and no short summary of this skill's key facts.
   - User experiences: The user leaves to open another skill and must remember what this one does, what it takes as input and how it was tested.
   - Recommendation: Let the visitor reach another skill, or see its key facts, without having to remember this skill's facts.

5. **All skills back link and header Collection link** | S4 Note | R-ux-review-11
   - Evidence: "All skills"
   - User experiences: The user sees All skills at the top of the page and Collection in the header, and wonders whether they lead to the same list.
   - Recommendation: Use one name for the way to the list of skills wherever it appears on the page.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Landing page: does it keep the search and role filter when the visitor returns, and does it scroll to the skill's card?
- Page bottom: the footer shows only text and only the tab row stays fixed on scroll; does any control to go back exist there?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
