<!-- skill: ux-review | input: skill-spec-writer | turns: 8 | cost_usd: 0.438 | permission_denials: 0 | is_error: False -->

## UX review: Flow A: Decide if this skill is the one I need

Reviewed: Code (page.html, site.css) and the flow description in flows.md, covering the spec-writer detail page from the head to "What you get".
Main goal: Decide if this skill is the one I need
Steps to main goal: 3 (What it does, What you type, What you get)
Findings: 5 (S1: 0, S2: 0, S3: 3, S4: 2)

### Findings

1. **Skill head, tags and roles** | S3 Minor | R-ux-review-1
   - Evidence: "padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px;"
   - User experiences: The user sees bordered pills like the page's buttons, clicks a tag or role expecting it to filter or open something, and nothing happens.
   - Recommendation: Make tags and roles look like plain labels, clearly unlike the page's buttons.

2. **What it does, list of ten layers** | S3 Minor | R-ux-review-13
   - Evidence: "Rules: the MUST / NEVER rules by id."
   - User experiences: The user reads ten lines about the skill's internal chapters and still has to guess what the skill does for them.
   - Recommendation: Show in this section only what the skill does for the visitor, so the decision needs no reading of its internal structure.

3. **What you get, Files in the package** | S3 Minor | R-ux-review-13
   - Evidence: "spec-writer/evals/live/title-only.json"
   - User experiences: The user scrolls past thirty file paths, including test files, with nothing in them that helps decide.
   - Recommendation: Show the file list only on request, or after the sections the decision needs.

4. **In-page nav "Questions", four tabs** | S4 Note | R-ux-review-1
   - Evidence: "text-decoration: none;"
   - User experiences: The user sees four grey words that look like plain text, and only the current one has an underline.
   - Recommendation: Make each tab look clickable before the user points at it, with a button shape or an underline.

5. **What you get, cover image** | S4 Note | R-ux-review-13
   - Evidence: "Real output from an agent"
   - User experiences: The user meets the same labelled image a second time, a few screens below the first, and learns nothing new.
   - Recommendation: Show each image once on the page.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Copy button beside "What you type": what the user sees after a click, and after a failed copy. The script is not given, and the stylesheet's done state has the same border as the default.
- In-page nav: whether the current tab and the progress line follow scrolling. The markup marks "What it does" as current and the script is not given.
- Cover images: what the two images show. Their drawing content is removed from the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B: Check it is real

Reviewed: Code (page.html, site.css) and the flow description in flows.md, covering the "Tested by a real agent" line, "What a real agent produced" and "How you know".
Main goal: Check it is real
Steps to main goal: 3 (Tested by a real agent line, What a real agent produced, How you know)
Findings: 3 (S1: 0, S2: 1, S3: 1, S4: 1)

### Findings

1. **Header nav, Proof link** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#proof"
   - User experiences: The user looking for this skill's proof clicks Proof, lands on the landing page, and must come back to find "How you know".
   - Recommendation: Use one label for a skill's proof everywhere on the page, and make it lead to this skill's own proof.

2. **How you know, Changelog** | S3 Minor | R-ux-review-13
   - Evidence: "Showcase screenshots retaken."
   - User experiences: The user checking that the skill is real reads eleven dense entries of internal work history to find the lines that prove it.
   - Recommendation: Show the proof first, and the working history only when the user asks for it.

3. **What a real agent produced, Copy the answer button** | S4 Note | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps Copy the answer, a target about 37 px tall, and on a phone can miss it.
   - Recommendation: Make every button on the page at least 44 px tall.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "Tested by a real agent: 12 of 12 cases pass": where a visitor can open the cases. The listed eval files are plain text, not links.
- Header "Proof" link: what index.html#proof shows, and whether it covers this skill. The landing page is not given.
- "Copy the answer": what the user sees after a click, and after a failed copy. The script is not given.
- Cover image: what it shows. Its drawing content is removed from the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C: Install it

Reviewed: Code (page.html, site.css) and the flow description in flows.md, covering the header install button, "Download" and "Install".
Main goal: Install it
Steps to main goal: 3 (Download the zip and check its SHA-256, Unzip it into .claude/skills/, Restart Claude Code)
Findings: 4 (S1: 0, S2: 1, S3: 2, S4: 1)

### Findings

1. **Header nav, Install link** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user wanting to install this skill clicks Install, leaves the skill page for the landing page, and must return to find this page's own Install section.
   - Recommendation: Make the label "Install" lead to the same place everywhere on the page, which is this skill's own install steps.

2. **Head button "Copy install command" and Install section, npx command** | S3 Minor | R-ux-review-11
   - Evidence: "Fastest: run one command in your project (needs Node.js and git)."
   - User experiences: The user copies the top install button, which carries the zip command, and never learns that the page calls the unlabelled npx command the fastest.
   - Recommendation: Make the install button and the command the page calls fastest the same thing, so each install command has one clear label.

3. **Install, step 1** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - User experiences: The user must remember the SHA-256 from the Download section above and carry it to a step that shows no value to compare.
   - Recommendation: Show the SHA-256 and the download control inside this step, where the check happens.

4. **Download button and copy buttons** | S4 Note | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps Download or a Copy button about 37 px tall and on a phone can miss it.
   - Recommendation: Make every button on the page at least 44 px tall.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the head button and the third Install command copy "unzip spec-writer-1.0.0.zip -d .claude/skills/" (data-copy and the visible code), but the paragraph says the command "downloads the zip, checks its SHA-256 and unzips it". The script is not given.
- Header "Install" link: what index.html#install shows, and whether it covers this skill. The landing page is not given.
- npx command: whether it asks before it writes to the project's agent instructions, which the text says it does. Without that, R-ux-review-5 cannot be checked.
- Copy buttons: what the user sees after a click, and after a failed copy. The script is not given.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D: Go back and compare with another skill

Reviewed: Code (page.html, site.css) and the flow description in flows.md, covering the back link, the header links and the end of the page.
Main goal: Go back and compare with another skill
Steps to main goal: not countable from the input
Findings: 3 (S1: 0, S2: 0, S3: 2, S4: 1)

### Findings

1. **"All skills" back link** | S3 Minor | R-ux-review-11
   - Evidence: "../../index.html#collection"
   - User experiences: The user clicks "All skills", lands at the top of the landing page, and scrolls to find the list that the header link "Collection" reaches directly.
   - Recommendation: Make the back link and the "Collection" link reach the same place, the list of skills.

2. **Page end, footer** | S3 Minor | R-ux-review-10
   - Evidence: "Skill Foundry. Static site generated from the skill registry."
   - Shown absent: The footer has no link to other skills, and the page has no way to set this skill beside another.
   - User experiences: The user keeps spec-writer's role, tags and test result in mind while reading another skill, because nothing on either page carries them across.
   - Recommendation: Show, on each skill's page, the few facts a visitor needs for comparing where the visitor can reach other skills.

3. **"All skills" back link** | S4 Note | R-ux-review-8
   - Evidence: "font: 400 16px/1.6 var(--sans)"
   - User experiences: The user taps a text link about 26 px tall and on a phone can miss it.
   - Recommendation: Make the back link a target at least 44 px tall.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Landing page: what the cards show, and whether the user can compare from them. The landing page is not given, so the steps cannot be counted.
- "All skills" link: whether the landing page keeps the user's search and role filter when the user returns. The page has the filter styles but no markup or script.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
