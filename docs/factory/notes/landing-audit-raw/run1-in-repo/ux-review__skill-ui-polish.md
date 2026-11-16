<!-- skill: ux-review | input: skill-ui-polish | turns: 15 | cost_usd: 0.512 | permission_denials: 1 | is_error: False -->

## UX review: Flow A: Decide if this skill is the one I need

Reviewed: Code (markup and stylesheet) and a flow description; covers the ui-polish skill detail page.
Main goal: Decide if this skill is the one I need
Steps to main goal: 1 (skill detail page: What it does, What you type, What you get)
Findings: 4 (S1: 0, S2: 0, S3: 2, S4: 2)

### Findings

1. **Questions bar, four section links** | S3 Minor | R-ux-review-1
   - Evidence: "color: var(--muted); text-decoration: none;"
   - Shown absent: Apart from the current one, the four links have no border, fill or underline.
   - User experiences: The user sees four grey words under the title and does not know they jump to sections, so scrolls the long page instead.
   - Recommendation: Make the four section links look clickable at rest, not only the current one.

2. **What it does section, ordered list of ten items** | S3 Minor | R-ux-review-13
   - Evidence: "Handoff: what the reader receives."
   - User experiences: The user reads ten items about the skill's internal chapters and still cannot tell what the skill will do for their own code.
   - Recommendation: Make the What it does section show what the visitor gets done with this skill, not the skill's own build steps.

3. **Header block, For: Developer and QA auditor, and the tags row** | S4 Note | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px;"
   - User experiences: The user sees Developer and QA auditor drawn like the page's rounded buttons, may click one expecting a filter, and nothing happens.
   - Recommendation: Make the role and tag labels look different from clickable buttons, or make them filter the skills.

4. **Questions bar, gap between the four links** | S4 Note | R-ux-review-9
   - Evidence: "display: flex; gap: 4px; overflow-x: auto;"
   - User experiences: The user taps one section link on a phone and sometimes hits its neighbour instead.
   - Recommendation: Keep at least 8 px between neighbouring section links.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Questions bar: whether the current-section mark and the progress line follow the scroll; the markup marks only "What it does" and the script is not shown.
- Copy buttons in What you type and What you get: what the user sees after pressing; the script is not shown.
- Device: whether first-time visitors use a phone or a desktop is not stated.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

---

## UX review: Flow B: Check it is real

Reviewed: Code (markup and stylesheet) and a flow description; covers the ui-polish skill detail page.
Main goal: Check it is real
Steps to main goal: 1 (skill detail page: What you get, How you know)
Findings: 2 (S1: 0, S2: 1, S3: 0, S4: 1)

### Findings

1. **Header navigation, Proof link** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#proof"
   - User experiences: The user clicks Proof to check this skill, leaves for the home page's general proof section, and must come back to find this skill's evidence.
   - Recommendation: Use one name for the evidence, and make the header link that carries it open this skill's evidence instead of the home page.

2. **What you get, Copy the answer button** | S4 Note | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps a small Copy the answer button on a phone and sometimes misses it.
   - Recommendation: Make the Copy the answer button, now about 37 px tall, at least 44 px tall.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Real answer box: whether the user can tell the answer continues below the visible part; the box has a maximum height and scrolls.
- Copy the answer button: what the user sees after pressing; the script is not shown.
- Tested by a real agent line: whether it links to the cases it counts; no link is in the markup.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

---

## UX review: Flow C: Install it

Reviewed: Code (markup and stylesheet) and a flow description; covers the ui-polish skill detail page.
Main goal: Install it
Steps to main goal: 3 (Download the zip, Unzip it into .claude/skills/, Restart Claude Code)
Findings: 5 (S1: 0, S2: 2, S3: 2, S4: 1)

### Findings

1. **Header navigation, Install link** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user clicks Install in the header, lands on the home page's general install section, and has to return to this skill's Install section.
   - Recommendation: Use one name for each destination, and make the header Install link open this skill's install steps instead of the home page.

2. **Page header, Copy install command button** | S2 Major | R-ux-review-10
   - Evidence: "unzip ui-polish-1.0.0.zip -d .claude/skills/"
   - User experiences: The user clicks Copy install command first, pastes it in a terminal, and gets an error because the zip is not downloaded yet.
   - Recommendation: Make clear at the button that the zip must be downloaded first, or have the copied command include the download.

3. **Install section, three copy buttons** | S3 Minor | R-ux-review-11
   - Evidence: "Copy install command"
   - User experiences: The user sees two install commands, one labelled Copy and one labelled Copy install command, and cannot tell which one does the whole install.
   - Recommendation: Give the same action the same label, and make each label say which command it copies.

4. **Install section, numbered steps and the two commands** | S3 Minor | R-ux-review-4
   - Evidence: "Or copy one command."
   - User experiences: The user follows steps 1 to 3, then finds the command for step 2 below an unrelated shortcut and is unsure which to use.
   - Recommendation: Put each command next to the numbered step it performs, and mark the shortcut as a separate path.

5. **Download button and the three Copy buttons** | S4 Note | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps small install buttons on a phone and sometimes misses.
   - Recommendation: Make the Download and Copy buttons, now about 37 px tall, at least 44 px tall.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the Install text says the copied command "downloads the zip, checks its SHA-256 and unzips it", but the shown command and its copy value are only the unzip line; the script is not shown.
- Copy buttons: what the user sees after pressing; the script is not shown.
- Download link: what the user sees after clicking beyond the browser's own download; none is shown.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

---

## UX review: Flow D: Go back and compare with another skill

Reviewed: Code (markup and stylesheet) and a flow description; covers the ui-polish skill detail page.
Main goal: Go back and compare with another skill
Steps to main goal: 3 (skill detail page, All skills, another skill's page)
Findings: 4 (S1: 0, S2: 0, S3: 3, S4: 1)

### Findings

1. **All skills back link** | S3 Minor | R-ux-review-12
   - Evidence: "../../index.html"
   - Shown absent: The link has no anchor to the skill list or to the card the visitor came from.
   - User experiences: The user clicks All skills, lands at the top of the home page instead of the skill list, and scrolls to find their place again.
   - Recommendation: Return the user to the skill list at the place they left, with any search or role filter they set still applied.

2. **All skills back link and header Collection link** | S3 Minor | R-ux-review-11
   - Evidence: "../../index.html#collection"
   - User experiences: The user sees two links, All skills and Collection, that seem to lead to the same list, and hesitates over which to use.
   - Recommendation: Use one name for the way back to the full list of skills, and put it in the same place on every page.

3. **Whole page, leaving to compare** | S3 Minor | R-ux-review-10
   - Evidence: "Tested by a real agent: 12 of 12 cases pass"
   - Shown absent: Nothing on this page lets the visitor see another skill's summary beside this one.
   - User experiences: The user leaves for the skill list and must remember this skill's purpose, role and test result while reading the next skill's page.
   - Recommendation: Show the facts needed to compare skills, such as purpose, role and test result, in the same place on every skill page and in the list.

4. **Header links and All skills back link** | S4 Note | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - User experiences: The user taps narrow text links on a phone, sometimes hits the neighbouring link, and has to tap again.
   - Recommendation: Make each header link and the All skills link at least 44 px tall; they are now under 26 px.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- All skills link: whether the home page keeps the search and role filter the visitor set before; the script is not shown.
- Home page skill cards: which facts they show for comparison; the home page is not in the input.
- Device: whether first-time visitors use a phone or a desktop is not stated.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
