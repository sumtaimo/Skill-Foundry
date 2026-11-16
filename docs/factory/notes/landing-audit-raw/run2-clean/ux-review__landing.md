<!-- skill: ux-review | input: landing | turns: 14 | cost_usd: 0.772 | permission_denials: 0 | is_error: False -->

Reviewing four flows from the files: I walked the markup and stylesheet, applied the skill's 13 usability rules, and kept anything that depends on the missing `site.js` as an open question. The reviews follow, each with its own numbering. Comprehension issues, such as what a "skill" is or the hero promise versus the Limits section, fall outside the 13 rules, so they are not listed.

## UX review: Flow A, Find a skill for my task

Reviewed: Code (page.html, site.css, ui-strings.txt) and the flow description, covering the hero finder, the chips and the card grid.
Main goal: find out which skill suits their task
Steps to main goal: 3 (Landing hero, Ready skills grid, Skill page)
Findings: 4 (S1: 0, S2: 0, S3: 4, S4: 0)

### Findings

1. **Landing hero, Pick a skill chips and Agent role chips** | S3 Minor | R-ux-review-8
   - Evidence: "border-radius: 999px; padding: 7px 14px;" and "min-height: 36px; padding: 6px 14px;"
   - User experiences: The user taps a chip about 32 px high, or a role chip 36 px high, and sometimes hits its neighbour.
   - Recommendation: Make every skill chip and role chip at least 44 px high at every screen width.

2. **Landing hero, Find a skill search and Agent role filter** | S3 Minor | R-ux-review-4
   - Evidence: "10 of 10 skills shown"
   - User experiences: The user types a task, sees only a count change, and scrolls past the picture and chips to find which cards remain.
   - Recommendation: Show the matching cards, or take the user to them, at the moment the search or role filter changes.

3. **Ready skills, card name link** | S3 Minor | R-ux-review-8
   - Evidence: ".plate h3 { margin: 4px 0 0; font-size: 1.1rem; }"
   - User experiences: The user taps the card's cover or example text, nothing happens, and then hunts for the small name link, about 28 px high.
   - Recommendation: Make the target that opens a skill at least 44 px high, and large enough to include the card's cover.

4. **Ready skills, card "For:" role labels and tag labels** | S3 Minor | R-ux-review-1
   - Evidence: "padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px;"
   - User experiences: The user clicks the "QA auditor" label on a card, expecting it to filter like the role chips above, and nothing happens.
   - Recommendation: Make the role and tag labels on a card look clearly different from the clickable filter chips.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Pick a skill chips (aria-pressed buttons): does a click change the "You type" example, filter the cards or open a skill? The script is not in the input.
- Find a skill search and Agent role filter: after the count changes, does the page scroll to, or mark, the matching cards?
- Card "You type" line: it is cut to one line, so can the full text be read or opened on the card?
- Skill page (skills/a11y-audit/index.html): the last step of the flow is not in the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B, Check it is real

Reviewed: Code (page.html, site.css, ui-strings.txt) and the flow description, covering the cover tags, the card claims and the Proof section.
Main goal: check that the claims are true
Steps to main goal: 2 (Card claims, Proof section)
Findings: 3 (S1: 0, S2: 0, S3: 3, S4: 0)

### Findings

1. **Cover images, "Real output from an agent" tag** | S3 Minor | R-ux-review-1
   - Evidence: "border-radius: 999px; background: var(--surface); border: 1px solid var(--line);"
   - User experiences: The user clicks the "Real output from an agent" pill to see that output, and nothing happens.
   - Recommendation: Make the tag look like a label rather than a chip, or link it to the output it names.

2. **Ready skills, card rules meter** | S3 Minor | R-ux-review-10
   - Evidence: "4 of 16 rules machine-checked"
   - User experiences: The user sees a quarter-full bar beside "13 of 13 cases pass" and must scroll to the Limits section to learn what it means.
   - Recommendation: State beside the meter what "machine-checked" means and what covers the remaining rules.

3. **Header, Proof link** | S3 Minor | R-ux-review-4
   - Evidence: "display: flex; flex-wrap: wrap; gap: 12px; align-items: center;"
   - Shown absent: The header rule has no sticky or fixed position, so the Proof link scrolls away with the page.
   - User experiences: The user reads a claim on a card far down the page and scrolls back to the top to reach Proof.
   - Recommendation: Keep a route to the Proof section reachable from the place where each claim is read.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Proof table rows and "Tested by a real agent" lines: does any link lead to a recorded run? The row links go to skill pages, whose content is not in the input.
- Covers: the drawings were removed from the input, so it is unknown whether each shows real output or an illustration of it.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C, Install it

Reviewed: Code (page.html, site.css, ui-strings.txt) and the flow description, covering the card buttons, the Install section and the For agents section.
Main goal: install a skill in their project
Steps to main goal: 2 (Ready skills card, Install a skill section)
Findings: 5 (S1: 0, S2: 1, S3: 2, S4: 2)

### Findings

1. **Install a skill, Copy button for the one-command install** | S2 Major | R-ux-review-10
   - Evidence: "npx github:sumtaimo/Skill-Foundry add &lt;skill&gt;"
   - User experiences: The user copies the command, pastes it in a terminal and gets an error because the skill name is still a placeholder.
   - Recommendation: Let the user choose a skill beside the command, so the copied text already contains that skill's name.

2. **Install a skill, five-command block** | S3 Minor | R-ux-review-10
   - Evidence: "npx github:sumtaimo/Skill-Foundry add --role QA_AUDITOR"
   - User experiences: A business analyst sees one role name in the example, no list of the other role names, and guesses the right one.
   - Recommendation: Show the role names the command accepts next to the command, matching the names used in the role filter.

3. **Install a skill, "Or copy one command" paragraph** | S3 Minor | R-ux-review-4
   - Evidence: "Or copy one command."
   - Shown absent: No command or Copy button follows this sentence; the next element is the "Download all skills" link.
   - User experiences: The user reads "Or copy one command" and looks for a command that is not there.
   - Recommendation: Put the command this sentence describes, or a pointer to the card button that copies it, next to the sentence.

4. **Ready skills card, Copy install command and Download buttons** | S4 Note | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer;"
   - User experiences: The user taps buttons about 37 px high, a little short of a comfortable touch target.
   - Recommendation: Make card buttons at least 44 px high.

5. **Install a skill, five-command block** | S4 Note | R-ux-review-11
   - Evidence: "npx github:sumtaimo/Skill-Foundry check"
   - Shown absent: The five-command block has no Copy button, while the single-command block above it has one.
   - User experiences: The user copies the first command with a button, then has to select the other commands by hand.
   - Recommendation: Offer the same copy action on every command block in the Install section.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the card button "Copy install command" carries "unzip a11y-audit-1.0.0.zip -d .claude/skills/", which does not download anything, while the Install section says "It downloads the zip, checks its SHA-256 and unzips it". Which text is copied?
- Copy buttons (cards, Install, For agents, recipes): what does the user see after clicking? The script is not in the input, and the done state only changes a border colour.
- For agents, "Give this to your agent": are {site} and {base} replaced before the text is shown and copied?
- Skill page: does it offer an install path of its own? It is not in the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D, Understand what the product is

Reviewed: Code (page.html, site.css, ui-strings.txt) and the flow description, covering the hero only.
Main goal: say in one sentence what Skill Foundry is and who it is for
Steps to main goal: 1 (Landing hero)
Findings: 1 (S1: 0, S2: 0, S3: 1, S4: 0)

### Findings

1. **Landing hero, "You type" panel** | S3 Minor | R-ux-review-1
   - Evidence: "background: var(--surface); border: 1px solid var(--line);"
   - User experiences: The user reads "Type one plain request", clicks the bordered "You type" box, cannot type in it, and then finds the separate "Find a skill" field.
   - Recommendation: Make the demo panel look unlike an input, so it reads as an example rather than a place to type.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Hero typing panel: does it show a "You get" result after the typed request? The strings show only "You type", so the second half of "One line in. A skill out." may not be shown.
- Pick a skill chips: what does a click do to the panel and the picture? The script is not in the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
