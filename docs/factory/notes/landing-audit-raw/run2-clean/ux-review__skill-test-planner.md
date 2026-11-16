<!-- skill: ux-review | input: skill-test-planner | turns: 7 | cost_usd: 0.438 | permission_denials: 0 | is_error: False -->

## UX review: Flow A: Decide if this skill is the one I need

Reviewed: Code (page.html, site.css) of the test-planner detail page, plus the flow note; the part read here is the head of the page and the first three sections.
Main goal: Decide if this skill is the one I need
Steps to main goal: 1 (skill detail page)
Findings: 1 (S1: 0, S2: 0, S3: 1, S4: 0)

### Findings

1. **Page head, tag pills (qa, regression, testing, checklist) and the role pills** | S3 Minor | R-ux-review-1
   - Evidence: ".tags li { font-size: .75rem; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px; }"
   - User experiences: The user sees the tags and roles drawn like the rounded buttons beside them, clicks one expecting a filter and nothing happens.
   - Recommendation: Make the tags and role labels look different from the buttons so that only controls that act look clickable.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Questions bar: whether the highlighted tab and the line under it follow the section being read; the script (site.js) is not shown.
- What you type, Copy button: whether it confirms on screen that the line was copied; the handler is not shown.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B: Check it is real

Reviewed: Code (page.html, site.css) of the test-planner detail page, plus the flow note; it covers What you get and How you know.
Main goal: Check it is real
Steps to main goal: 1 (skill detail page)
Findings: 1 (S1: 0, S2: 0, S3: 1, S4: 0)

### Findings

1. **How you know section, "Tested by a real agent" line** | S3 Minor | R-ux-review-10
   - Evidence: "Tested by a real agent: 9 of 9 cases pass"
   - Shown absent: Nothing at this line links to the real answer or to the nine cases; the answer sits under What you get.
   - User experiences: The user opens How you know to check the claim, finds counts and a changelog, and must remember the real answer is in the section above.
   - Recommendation: Show or link the real agent answer and the test cases where the pass count is stated, so the user carries nothing between sections.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Cover images (page head and What you get): the drawings are removed from the input, so whether the label "Real output from an agent" describes the drawing or the answer below is unknown.
- Copy the answer: whether it confirms on screen that the answer was copied; the handler is not shown.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C: Install it

Reviewed: Code (page.html, site.css) of the test-planner detail page, plus the flow note; it covers the header, Download and Install.
Main goal: Install it
Steps to main goal: 4 (Download, Check SHA-256, Unzip, Restart Claude Code)
Findings: 5 (S1: 0, S2: 2, S3: 3, S4: 0)

### Findings

1. **Header nav, Install link** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user clicks Install in the header to install this skill and lands on the landing page instead of this skill's install steps.
   - Recommendation: Make the header Install link reach this skill's own install steps, or make clear it leads to the general install section.

2. **Page head, Copy install command button** | S2 Major | R-ux-review-10
   - Evidence: "unzip test-planner-1.0.0.zip -d .claude/skills/"
   - Shown absent: The copied command has no download step and no checksum step.
   - User experiences: The user clicks Copy install command at the top, pastes it in a terminal and gets a missing-file error because the zip was never downloaded.
   - Recommendation: Make the copied command and the text that describes it agree, and state beside the button that the zip must be downloaded first.

3. **Copy install command, Copy, Copy the answer, Download and the header theme and language buttons** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps buttons that are about 37 px high (14 px text at line height 1.2, 9 px padding, 1 px border) and can hit a neighbouring control on a phone.
   - Recommendation: Make every button at least 44 px high.

4. **Page head and Install section, copy buttons** | S3 Minor | R-ux-review-11
   - Evidence: "Copy install command"; "Copy"
   - User experiences: The user clicks Copy install command at the top, gets the longer unzip route and never learns that a one-command route, Fastest, exists further down.
   - Recommendation: Make the copy buttons in the header and in the Install section say which install route each one copies.

5. **Install step 1, check the SHA-256** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - Shown absent: This step shows neither the expected SHA-256 nor how to compute it; the value is in the Download section above.
   - User experiences: The user carries a 64-character hash from the Download section to a separate checksums.json file and compares them by hand.
   - Recommendation: Show the expected SHA-256 and the way to check it inside the install step, so nothing is carried over from another section.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the Install text says the one command "downloads the zip, checks its SHA-256 and unzips it", but the copied text is only the unzip line; the script (site.js) may change what is copied.
- Copy buttons (header, npx, unzip): whether each confirms on screen that it copied, or shows a failure; the handler is not shown, only the classes done and fail.
- npx command: whether it asks for confirmation before it changes how the project's agents are set up.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D: Go back and compare with another skill

Reviewed: Code (page.html, site.css) of the test-planner detail page, plus the flow note; the landing page is not part of the input.
Main goal: Go back and compare with another skill
Steps to main goal: not countable from the input
Findings: 1 (S1: 0, S2: 0, S3: 1, S4: 0)

### Findings

1. **Header nav links and the All skills back link** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - User experiences: The user taps All skills or a header link, each about 23 to 26 px high (text at line height 1.6, no padding), and can hit the neighbouring link.
   - Recommendation: Make the back link and the header links at least 44 px high.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- All skills link: whether the landing page keeps the visitor's search text and role filter after the click; the landing page and site.js are not shown.
- Landing page cards: whether they show roles, tags and the pass count, so the visitor can compare without remembering this skill's details.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
