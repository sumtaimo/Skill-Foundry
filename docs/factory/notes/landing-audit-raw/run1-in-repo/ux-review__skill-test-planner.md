<!-- skill: ux-review | input: skill-test-planner | turns: 13 | cost_usd: 0.531 | permission_denials: 0 | is_error: False -->

## UX review: Skill detail page, Flow A "Decide if this skill is the one I need"

Reviewed: Code and styles of the test-planner page plus the flow list; this review covers the head, "What it does", "What you type" and "What you get".
Main goal: Decide if this skill is the one I need
Steps to main goal: 1 (Skill detail page)
Findings: 2 (S1: 0, S2: 0, S3: 0, S4: 2)

### Findings

1. **Questions bar, the four section links** | S4 Note | R-ux-review-1
   - Evidence: "color: var(--muted); text-decoration: none;"
   - User experiences: The user sees four muted words under the title, takes them for a caption and scrolls instead of jumping.
   - Recommendation: Make the four section links look clickable at a glance.
2. **Questions bar, neighbouring section links** | S4 Note | R-ux-review-9
   - Evidence: "display: flex; gap: 4px;"
   - User experiences: The user moves a finger between two neighbouring section links and can hit the wrong one.
   - Recommendation: Leave at least 8 px between neighbouring section links.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Copy install command and Copy buttons: site.js is not in the input, and ".btn.done" has the same border as the normal button, so it is not shown whether the user sees a change after copying.
- Questions bar: only the first link is marked current in the markup; it is not shown whether the mark follows the user while they scroll.
- Device: not stated, so it is not shown how far down the phone screen the first sentence of "What it does" falls.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, Flow B "Check it is real"

Reviewed: Code and styles of the test-planner page plus the flow list; this review covers the real answer, the test line, the rule counts and the changelog.
Main goal: Check it is real
Steps to main goal: 1 (Skill detail page)
Findings: 2 (S1: 0, S2: 0, S3: 2, S4: 0)

### Findings

1. **Header, Proof link** | S3 Minor | R-ux-review-11
   - Evidence: "../../index.html#proof"
   - User experiences: The user clicks Proof in the header to check this skill, lands on the landing page's section and leaves the skill's own evidence behind.
   - Recommendation: Make the header Proof link lead to this skill's own evidence, or make clear it covers the whole site.
2. **Questions bar, How you know link** | S3 Minor | R-ux-review-4
   - Evidence: "#how-you-know"
   - User experiences: The user clicks How you know to check the skill, finds counts and a changelog, and must scroll back up to the real answer under What you get.
   - Recommendation: Put the real answer, or a link to it, in the same place as the tests and rule counts.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Copy the answer button: site.js is not in the input, so it is not shown whether the user sees a confirmation after copying.
- Real answer box: "max-height: 28rem; overflow: auto;" can cut the answer, and it is not shown whether the user sees a cue that "Possible impact" and "Open questions" lie below.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, Flow C "Install it"

Reviewed: Code and styles of the test-planner page plus the flow list; this review covers the header install button, the Download section and the Install section.
Main goal: Install it
Steps to main goal: 4 (Download the zip, check its SHA-256, unzip it into .claude/skills/, restart Claude Code)
Findings: 4 (S1: 0, S2: 1, S3: 2, S4: 1)

### Findings

1. **Install section, "Or copy one command" box** | S2 Major | R-ux-review-10
   - Evidence: "unzip test-planner-1.0.0.zip -d .claude/skills/" and "It downloads the zip, checks its SHA-256 and unzips it"
   - User experiences: The user reads that one command downloads and checks the zip, copies it, and the command shown only unzips a file the user may not have.
   - Recommendation: Make the shown command and the sentence above it say the same thing, and say where the zip must already be.
2. **Header, Install link** | S3 Minor | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user clicks Install in the header on this skill's page and lands on the landing page, away from this skill's install steps.
   - Recommendation: Make the header Install link lead to this page's install steps, or make clear it is the site-wide install.
3. **Header, Copy install command button** | S3 Minor | R-ux-review-4
   - Evidence: "Copy install command"
   - Shown absent: No command text is shown near this button; the command appears only in the Install section near the end of the page.
   - User experiences: The user clicks Copy install command at the top, cannot see what was copied and pastes a command they have not read.
   - Recommendation: Show the command next to the button, or take the user to where it is shown.
4. **Copy install command, Download and Copy buttons** | S4 Note | R-ux-review-8
   - Evidence: "font: 500 .875rem/1.2 var(--sans);" and "padding: 9px 14px;"
   - User experiences: The user taps a button about 37 px high, and on a phone can miss it and tap again.
   - Recommendation: Make every button at least 44 px high.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Copy install command and the zip command: the markup carries "data-install-zip", so site.js may copy more than the shown text; what reaches the clipboard is not shown, and finding 1 depends on it.
- Copy buttons: it is not shown whether the user sees a confirmation after copying.
- Check SHA-256 step: it is not shown what the user sees when the checksum does not match.
- npx route: it is not shown whether step 3, "Restart Claude Code", also applies to it.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, Flow D "Go back and compare with another skill"

Reviewed: Code and styles of the test-planner page plus the flow list; this review covers the header, the back link and the tags and roles.
Main goal: Go back and compare with another skill
Steps to main goal: 1 (Skill detail page, then the All skills link; the comparison screen is not in the input)
Findings: 3 (S1: 0, S2: 0, S3: 2, S4: 1)

### Findings

1. **Header links and "All skills" back link** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }" and "font: 400 16px/1.6 var(--sans);"
   - User experiences: The user taps the All skills link or a header link, each about 25 px high, and on a phone can miss and tap again.
   - Recommendation: Give the back link and the header links targets of at least 44 by 44 px.
2. **Header, tags and roles** | S3 Minor | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px;"
   - User experiences: The user takes the tags and roles for buttons that filter skills, clicks one to find similar skills and nothing happens.
   - Recommendation: Make tags and roles look different from controls, or make them take the user to matching skills.
3. **Header "Collection" link and "All skills" back link** | S4 Note | R-ux-review-11
   - Evidence: "../../index.html#collection" and "../../index.html"
   - User experiences: The user sees Collection in the header and All skills below it, wonders whether they lead to different lists and tries both.
   - Recommendation: Use one label for the one destination that lists all skills.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- All skills and Collection links: the landing page is not in the input, so it is not shown whether a search or role filter the visitor set earlier is kept when they follow either link.
- Tags and roles: site.js is not in the input, so it is not shown whether script makes them clickable.
- Comparison: the landing page cards are not in the input, so it is not shown whether they give the facts the visitor needs to compare (takeaway, roles, tested count).

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
