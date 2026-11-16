<!-- skill: ux-review | input: skill-spec-writer | turns: 6 | cost_usd: 0.439 | permission_denials: 0 | is_error: False -->

## UX review: Skill detail page, Flow A "Decide if this skill is the one I need"

Reviewed: Both the page markup and stylesheet and the flow description. The page's script is not in the input, so only markup and styles are covered.
Main goal: Decide if this skill is the one I need
Steps to main goal: 3 (What it does, What you type, What you get)
Findings: 3 (S1: 0, S2: 0, S3: 2, S4: 1)

### Findings

1. **What you type step, Copy button** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps the small Copy button beside the sample request, misses it and has to tap again.
   - Recommendation: Make the Copy button, and every other button in the same style, at least 44 by 44 px.

2. **What you get step, "The agent hands back these files" line and "Files in the package" heading** | S3 Minor | R-ux-review-11
   - Evidence: "The agent hands back these files and a short report."
   - User experiences: The user reads that the agent hands back files, then meets a long list of package files and cannot tell which ones they will receive.
   - Recommendation: Use one name for what the agent hands back and a different name for what the download contains, so the two lists are not mixed up.

3. **Question bar, the four tabs** | S4 Note | R-ux-review-9
   - Evidence: "display: flex; gap: 4px; overflow-x: auto"
   - User experiences: The user taps one of four padded tabs that sit 4 px apart and can land on the neighbouring tab.
   - Recommendation: Leave at least 8 px between neighbouring tabs.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Question bar: the markup marks "What it does" as current. Does the mark follow the user while scrolling, and do all four tabs fit at phone width, given the tab row scrolls sideways with no visible scrollbar?
- What you type, sample request: the code is set not to wrap. At what width does the user have to scroll sideways to read it, and is there any cue for that?
- Copy buttons: what does the user see after pressing one? The script is not in the input.
- Cover image tagged "Real output from an agent": what does it show? The markup says only that an illustration was removed.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, Flow B "Check it is real"

Reviewed: Both the page markup and stylesheet and the flow description. The page's script is not in the input, so only markup and styles are covered.
Main goal: Check it is real
Steps to main goal: 3 (Tested-by line under the title, What a real agent produced, How you know)
Findings: 1 (S1: 0, S2: 0, S3: 1, S4: 0)

### Findings

1. **What a real agent produced, "Copy the answer" button** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user finishes reading the answer, taps the small Copy the answer button, misses it and has to tap again.
   - Recommendation: Make this button, and every other button in the same style, at least 44 by 44 px.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Cover image tagged "Real output from an agent": the markup comment calls the drawing decorative. Does the tag say the image is real output, and could the user take it for the proof?
- "Tested by a real agent: 12 of 12 cases pass": the markup shows no link or list of the 12 cases. Can the user open any case from this page?
- Copy the answer button: what does the user see after pressing it? The script is not in the input.
- Answer box: it has a fixed maximum height and scrolls inside the page. Does the user see that the Open questions and Out of scope parts lie below the visible part?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, Flow C "Install it"

Reviewed: Both the page markup and stylesheet and the flow description. The page's script is not in the input, so only markup and styles are covered.
Main goal: Install it
Steps to main goal: 4 (Download the zip, check its SHA-256, unzip into .claude/skills/, restart Claude Code)
Findings: 5 (S1: 0, S2: 2, S3: 3, S4: 0)

### Findings

1. **Header navigation, Install link** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user clicks Install in the header to install this skill and lands on the landing page's own Install area, away from this skill's download and commands.
   - Recommendation: Make the word Install lead to the same kind of place everywhere, or give the header link and this page's Install section different names.

2. **Page head, Copy install command button** | S2 Major | R-ux-review-9
   - Evidence: "unzip spec-writer-1.0.0.zip -d .claude/skills/"
   - User experiences: The user copies the unzip command at the top, pastes it in a terminal before downloading the zip, and gets an error.
   - Recommendation: Put the download and the copy of the unzip command in one visible group, or make the copied command work without a prior download.

3. **Page head and Download section, buttons** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps the small Copy install command and Download buttons, misses one and has to tap again.
   - Recommendation: Make these buttons, and every other button in the same style, at least 44 by 44 px.

4. **Install step 1, SHA-256 check** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - User experiences: The user must carry a 64-character value from the Download section to another file and compare it by eye or retype it.
   - Recommendation: Show, beside the check step, the value to compare and a way to copy it, so the user keeps nothing in mind.

5. **Install section, two copy buttons** | S3 Minor | R-ux-review-11
   - Evidence: "Copy install command"
   - User experiences: The user sees one button named Copy install command and another named only Copy for a different install command, and cannot tell which is the main route.
   - Recommendation: Give the two buttons labels that tell which install route each one copies.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the Install text says one command "downloads the zip, checks its SHA-256 and unzips it", but the command shown is only "unzip spec-writer-1.0.0.zip -d .claude/skills/". The button also carries zip and SHA-256 data. What text does it copy?
- Copy buttons and the Download link: what does the user see after pressing one? The script is not in the input.
- Both install commands: do they overwrite an installed copy of the skill without asking? The behaviour is not in the input.
- Question bar: it has no tab for Download or Install. Is there another way to reach them besides scrolling past the changelog?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, Flow D "Go back and compare with another skill"

Reviewed: Both the page markup and stylesheet and the flow description. The landing page is not in the input, so only this page's way out is covered.
Main goal: Go back and compare with another skill
Steps to main goal: not countable from the input
Findings: 3 (S1: 0, S2: 0, S3: 3, S4: 0)

### Findings

1. **Header navigation Collection link and the All skills back link** | S3 Minor | R-ux-review-11
   - Evidence: "../../index.html#collection"
   - User experiences: The user clicks All skills to see the other skills and lands at the top of the landing page, while Collection in the header goes to the list itself.
   - Recommendation: Give the same destination one name, and send both links to the list of skills.

2. **Header Collection link and the All skills back link, small targets** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - User experiences: The user taps the small text link to go back, misses it and has to tap again.
   - Recommendation: Make the header links and the All skills link at least 44 by 44 px.

3. **Skill head, role and tag pills** | S3 Minor | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px"
   - User experiences: The user sees Business analyst in a bordered pill, clicks it hoping to find similar skills, and nothing happens.
   - Recommendation: Make the role and tag pills look different from clickable controls, or make them lead to the matching skills.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- All skills link: does the landing page keep the user's earlier search, role filter and scroll position? A user who arrived from a search result may not come from the landing page at all.
- Role and tag pills: does the script make them clickable? The markup has only a data-role attribute on the roles.
- The header is not fixed to the top of the screen and the back link is only at the top of the page. How does the user get back after reading far down?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
