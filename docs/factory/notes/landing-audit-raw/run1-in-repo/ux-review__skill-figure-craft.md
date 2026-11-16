<!-- skill: ux-review | input: skill-figure-craft | turns: 7 | cost_usd: 0.377 | permission_denials: 0 | is_error: False -->

## UX review: Skill detail page, flow A "Decide if this skill is the one I need"

Reviewed: Code (page.html, site.css) and the flow description (flows.md), covering the figure-craft skill detail page.
Main goal: Decide if this skill is the one I need
Steps to main goal: 1 (Skill detail page)
Findings: 3 (S1: 0, S2: 0, S3: 3, S4: 0)

### Findings

1. **What it does, ordered list** | S3 Minor | R-ux-review-13
   - Evidence: "Intent: start from the goal the user states."
   - User experiences: The visitor wants to learn what the skill does for them and reads eleven chapter names describing how the skill is built.
   - Recommendation: Show in this section only what the visitor gets from the skill, and keep the build chapters for the package details.
2. **What you get, Files in the package** | S3 Minor | R-ux-review-13
   - Evidence: "figure-craft/engine/iso.mjs"
   - User experiences: The visitor scrolls past a long list of file paths to reach the recorded run and the example.
   - Recommendation: Place the file list after the proof, or keep it out of the way, so the decision material comes first.
3. **Skill head, tags and roles** | S3 Minor | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px"
   - User experiences: The visitor sees "diagram" and "Developer" in the same pill shape as the site's filter chips, clicks one and nothing happens.
   - Recommendation: Make tags and roles look different from controls that can be clicked, or make them do something.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "What you type": is the refrigerator line an example to adapt or a line to paste as written? The page says "Paste this one line after you install the skill."
- Questions bar: only the first tab carries aria-current="true" in the markup; does the marked tab follow the visitor's scroll?
- "Tested by a real agent: 3 of 3 cases pass": the page does not show what a case is or where the visitor can see the cases.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, flow B "Check it is real"

Reviewed: Code (page.html, site.css) and the flow description (flows.md), covering the real answer, the tests and the rules counts.
Main goal: Check it is real
Steps to main goal: 1 (Skill detail page)
Findings: 2 (S1: 0, S2: 0, S3: 2, S4: 0)

### Findings

1. **What you get, Recorded real run** | S3 Minor | R-ux-review-10
   - Evidence: "An agent followed this skill on the prompt above."
   - User experiences: The visitor reads a kettle request just above, then sees refrigerator files and a refrigerator prompt elsewhere, and must work out which run is which.
   - Recommendation: State beside each real run which request it answers, so the visitor does not have to compare the requests from memory.
2. **How you know section** | S3 Minor | R-ux-review-4
   - Evidence: "Machine checks cover structure and a reviewer covers the rest."
   - User experiences: The visitor opens "How you know" for proof and finds counts only, while the real answer and the example sit under "What you get".
   - Recommendation: Put the proof the visitor needs for this question in one place, or link the real answer and example from "How you know".

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Example frame: what the visitor can do inside example.html (turn, hover, tap) and whether a hint is shown there; the note only says "Shown in a sandboxed frame."
- "Tested by a real agent: 3 of 3 cases pass": the page does not show what a case is or where the visitor can see the cases.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, flow C "Install it"

Reviewed: Code (page.html, site.css) and the flow description (flows.md), covering the command, the zip and the checksum.
Main goal: Install it
Steps to main goal: 4 (Download the zip, check its SHA-256, unzip into .claude/skills/, restart Claude Code)
Findings: 4 (S1: 0, S2: 1, S3: 3, S4: 0)

### Findings

1. **Header nav, Install link** | S2 Major | R-ux-review-11
   - Evidence: `<a href="../../index.html#install">`
   - User experiences: The visitor clicks "Install" in the header, expecting this skill's install steps, and lands on the home page's install section instead.
   - Recommendation: Make the one label "Install" lead to one place, or name the header link so it does not match this page's Install section.
2. **Head actions and Download, Copy install command and Download buttons** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The visitor taps buttons that are about 37 px tall (padding, one line of text and border), below the 44 px minimum, and can miss them on a phone.
   - Recommendation: Make every button at least 44 px tall.
3. **Install, step 1** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - Shown absent: Neither the SHA-256 value nor the checksums.json link appears at this step; both are in the Download section above.
   - User experiences: The visitor scrolls back up to find the hash and the file, then returns to the steps.
   - Recommendation: Show the hash and the checksums link at the step that asks for the check.
4. **Install, step 3** | S3 Minor | R-ux-review-10
   - Evidence: "Restart Claude Code so it loads the skill."
   - Shown absent: The step does not say what to do next, and "What you type" sits two sections above.
   - User experiences: The visitor finishes the install, does not know the next move and scrolls up to find the line to paste.
   - Recommendation: End the install with the next action, shown beside the steps, so the visitor does not hunt for it.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "Copy install command" (top and in Install): the markup copies only "unzip figure-craft-1.0.0.zip -d .claude/skills/", but the page says the command "downloads the zip, checks its SHA-256 and unzips it". Does the copied text differ (data-install-zip and data-sha256-install are present)? If it is the bare unzip, a visitor who has not downloaded the zip gets an error.
- Copy buttons: what the visitor sees after a click; the styles define done and fail states but not their text.
- Sizes and gaps: header and in-page links and the Download button are computed from the CSS only; no rendered size is given.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, flow D "Go back and compare with another skill"

Reviewed: Code (page.html, site.css) and the flow description (flows.md), covering the way back to the list and the facts to compare.
Main goal: Go back and compare with another skill
Steps to main goal: not countable from the input
Findings: 3 (S1: 0, S2: 0, S3: 3, S4: 0)

### Findings

1. **Header nav links and "All skills" back link** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - User experiences: The visitor taps text links with no padding, about 23 px tall, to get back to the list and can miss them.
   - Recommendation: Give every header link and the back link a target at least 44 px tall.
2. **"All skills" back link, Collection link, brand link** | S3 Minor | R-ux-review-11
   - Evidence: `<a href="../../index.html#collection">`
   - User experiences: The visitor finds "All skills", "Collection" and "Skill Foundry" all leading back to the home page, with different landing spots, and is unsure which shows the list.
   - Recommendation: Use one label and one destination for the way back to the list of skills.
3. **Skill head and How you know, facts to compare** | S3 Minor | R-ux-review-10
   - Evidence: "21 of 33 rules machine-checked"
   - User experiences: The visitor reads the test result near the top and the rules count far below, then must hold both in memory to compare with the next skill.
   - Recommendation: Show the facts used to compare skills together in one place.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "All skills" back link: does the home page keep the visitor's search and role filter, or reload with none? The link is a plain "../../index.html".
- Home page: the input does not include it, so the steps to compare two skills are not countable.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
