<!-- skill: ux-review | input: landing | turns: 19 | cost_usd: 1.388 | permission_denials: 1 | is_error: False -->

## UX review: Flow A: "Find a skill for my task"

Reviewed: Code (page.html, site.css, ui-strings.txt) and a step-by-step description (flows.md) of the Skill Foundry landing page. site.js and the SVG covers are not in the input.
Main goal: find out which skill suits their task and open its card
Steps to main goal: 3 (reads the h1; uses the hero search, the role filters, the skill chips or the card grid; opens a card)
Findings: 10 (S1: 0, S2: 1, S3: 7, S4: 2)

### Findings

1. **Ready skills, skill card (the whole card on hover)** | S2 Major | R-ux-review-1
   - Evidence: ".plate:hover { border-color: var(--line-strong); }"
   - User experiences: The visitor hovers a card, sees its border darken, clicks the large cover, and nothing opens, because only the small title is a link.
   - Recommendation: The whole card, cover included, must open the skill page, because it reacts to the pointer the way a clickable card does.

2. **Hero, "Find a skill" search box and role filter** | S3 Minor | R-ux-review-4
   - Evidence: "ten skill chips); section "Ready skills" (a grid of 10 skill cards"
   - User experiences: The visitor types or picks a role near the top and sees only the count change. They have to scroll past the example, the figure and ten chips to see which cards are left.
   - Recommendation: The cards that the search and role filter change must be in view next to those controls while the visitor filters.

3. **Ready skills, "No skill matches" message** | S3 Minor | R-ux-review-6
   - Evidence: "No skill matches. Clear the search or pick another role."
   - User experiences: The visitor's search finds nothing, and the message telling them what to do shows up far below the search box they are typing in.
   - Recommendation: The no-match message must appear next to the search box and role filter that caused it.

4. **Hero, role filter buttons (about 36 px tall above 480 px width)** | S3 Minor | R-ux-review-8
   - Evidence: "min-height: 36px; padding: 6px 14px;"
   - User experiences: On a tablet the visitor taps between small role buttons and sometimes picks the role next to the one they meant.
   - Recommendation: Every role filter button must be at least 44 px tall at every screen width, not only at 480 px and below.

5. **Hero, skill chips "a11y-audit" to "ux-review" (about 32 px tall)** | S3 Minor | R-ux-review-8
   - Evidence: "font: 500 .85rem/1.2 var(--sans); color: var(--muted); cursor: pointer;"
   - User experiences: On a touch screen the visitor aims at one of ten small chips in a tight row and sometimes taps its neighbour.
   - Recommendation: Every skill chip must be at least 44 by 44 px.

6. **Ready skills card, tags (for example "accessibility", "a11y")** | S3 Minor | R-ux-review-1
   - Evidence: ".tags li { font-size: .75rem; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px; }"
   - User experiences: The visitor clicks a tag that looks just like the clickable chips above, expects matching skills, and nothing happens.
   - Recommendation: Tags must not look like the page's clickable chips unless clicking them filters the skills.

7. **Ready skills card, "For:" role pills** | S3 Minor | R-ux-review-1
   - Evidence: ".role { padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg); }"
   - User experiences: The visitor sees a "Developer" pill shaped like the "Developer" filter button, clicks it to filter, and nothing happens.
   - Recommendation: The role pills on cards must not look like the role filter buttons unless clicking them applies that filter.

8. **Ready skills card, title link (for example "a11y-audit", about 28 px tall)** | S3 Minor | R-ux-review-8
   - Evidence: ".plate h3 { margin: 4px 0 0; font-size: 1.1rem; }"
   - User experiences: On a phone the visitor has to tap a short title link to open the card, and a near miss does nothing.
   - Recommendation: The control that opens a card must be at least 44 by 44 px.

9. **Header, "Collection" link** | S4 Note | R-ux-review-11
   - Evidence: "<a href="index.html#collection"><span data-i18n="nav.collection">Collection</span></a>"
   - User experiences: The visitor clicks Collection, lands on a section titled Ready skills, and stops for a moment to check it is the right place.
   - Recommendation: The nav link and the section it opens must use the same name.

10. **Hero chip and card No. 03, "Copy Tight"** | S4 Note | R-ux-review-11
    - Evidence: "<h3 lang="en"><a href="skills/copy-tight/index.html">Copy Tight</a></h3>"
    - User experiences: The visitor sees "Copy Tight" on the chip and card, but "copy-tight" on the download and in the Proof table, while every other skill keeps one name.
    - Recommendation: The skill must have one name, written the same way, everywhere on the page.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Hero search and role filter: what the grid and the "10 of 10 skills shown" count show while the visitor types or clicks a role, and whether the page brings the results into view. site.js is not in the input.
- Hero skill chips: what a click on a chip does, for example whether it only swaps the "You type" panel and the figure or also leads to the card. The handler is not shown.
- Search: how "Search by task, name or tag" matches a task typed in plain words, because the matching logic is not shown.
- Sizes: the heights in findings 4, 5 and 8 assume the browser's default 16 px root text size and no styles added by script. Rendered sizes would confirm them.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B: "Check it is real"

Reviewed: Code (page.html, site.css, ui-strings.txt) and a step-by-step description (flows.md) of the Skill Foundry landing page. The skill pages and the SVG covers are not in the input.
Main goal: check whether the claims are true
Steps to main goal: 4 (the "Real output from an agent" label; "Tested by a real agent: N of N cases pass"; the rules meter; the Proof section)
Findings: 3 (S1: 0, S2: 0, S3: 3, S4: 0)

### Findings

1. **Card cover, "Real output from an agent" label** | S3 Minor | R-ux-review-1
   - Evidence: ".cover-tag { position: absolute; left: 8px; bottom: 8px; font-size: 0.72rem; line-height: 1.2; padding: 3px 8px; border-radius: 999px; background: var(--surface); border: 1px solid var(--line); color: var(--muted); }"
   - User experiences: The visitor clicks the pill-shaped label to see the real output it mentions, and nothing happens.
   - Recommendation: The label must not look like the page's clickable chips unless clicking it opens the output it names.

2. **Ready skills card, rules meter "4 of 16 rules machine-checked"** | S3 Minor | R-ux-review-10
   - Evidence: "4 of 16 rules machine-checked"
   - Shown absent: The card does not say how the other 12 rules are checked. That is explained only under Proof and Limits, far down the page.
   - User experiences: The visitor sees a quarter-filled bar, thinks most rules go unchecked, and only finds out later on the page that a person checks the rest.
   - Recommendation: Each meter must say, where it is shown, that the rules not checked by machine are checked by a person.

3. **Proof section, skill name links in the table (about 23 px tall)** | S3 Minor | R-ux-review-8
   - Evidence: ".proof { width: 100%; border-collapse: collapse; font-size: .9rem; }"
   - User experiences: On a phone the visitor has to tap a short skill name in a dense table to look deeper, and a near miss does nothing.
   - Recommendation: Every skill link in the Proof table must be at least 44 by 44 px.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Skill pages and the Proof section: whether the recorded runs behind "Tested by a real agent: 13 of 13 cases pass" can be opened anywhere. The Proof section itself links only to the skill pages, and those are not in the input.
- Card and hero covers: whether the "real output" can be read at card size. The SVG content was removed from the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C: "Install it"

Reviewed: Code (page.html, site.css, ui-strings.txt) and a step-by-step description (flows.md) of the Skill Foundry landing page. site.js is not in the input.
Main goal: install a skill to use it
Steps to main goal: 3 (Copy install command, the Install nav link or the Download link; run the command or unzip into .claude/skills/; Restart Claude Code)
Findings: 6 (S1: 0, S2: 2, S3: 4, S4: 0)

### Findings

1. **Ready skills card, "Copy install command"** | S2 Major | R-ux-review-10
   - Evidence: "data-copy="unzip a11y-audit-1.0.0.zip -d .claude/skills/""
   - Shown absent: The card footer does not say where to run the command or that Claude Code must be restarted. Both appear only in "Install a skill".
   - User experiences: The visitor copies the command from a card, runs it, and is never told to run it in the project folder or to restart, so the skill does not load.
   - Recommendation: The card must show, beside its install command, where to run it and what to do afterwards for the skill to load.

2. **Install a skill, "Copy" button of the npx command** | S2 Major | R-ux-review-10
   - Evidence: "data-copy="npx github:sumtaimo/Skill-Foundry add &lt;skill&gt;""
   - User experiences: The visitor copies the command, runs it with the placeholder still in it, gets an error, and scrolls back up to find the skill's exact name.
   - Recommendation: The command the visitor copies must already hold a real skill name, so nothing has to be carried over from the cards.

3. **Header, "Install" nav link (and the other nav links, about 23 px tall)** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - User experiences: On a phone the visitor has to tap short text links in the header to reach Install, and a near miss does nothing.
   - Recommendation: Every header link must be at least 44 by 44 px.

4. **Ready skills card, "Copy install command" and Download buttons; Install section "Copy" (about 37 px tall)** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: On a touch screen the visitor taps two short buttons that sit side by side and sometimes downloads when they meant to copy.
   - Recommendation: Every button and button-styled link must be at least 44 px tall.

5. **Install a skill, step "Download the skill .zip"** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - Shown absent: This section offers only "Download all skills (.zip, 525 KB)". A single skill's zip is linked only on its card.
   - User experiences: The visitor follows step 1, finds no single-skill download here, and scrolls back up to the cards to find it.
   - Recommendation: The Install section must offer the download of a single skill where step 1 asks for it.

6. **Install a skill, "Or copy one command."** | S3 Minor | R-ux-review-10
   - Evidence: "Or copy one command. It downloads the zip, checks its SHA-256"
   - Shown absent: No command and no copy button follow this sentence. The next item is the "Download all skills" link.
   - User experiences: The visitor reads that one command does everything, finds no command under it, and has to guess that it means the button on each card.
   - Recommendation: The command this sentence promises must be shown, ready to copy, where the sentence is.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "Copy install command", "Copy", "Copy the answer" and "Copy prompt for your agent": what the visitor sees after clicking. The handler is not shown. The ".btn.done" and ".btn.fail" styles exist, but no message text does.
- "Copy install command": what text the clipboard actually gets. The markup holds only the unzip command, while "Install a skill" says the one command downloads, checks the SHA-256 and unzips. If only unzip is copied, Download has to come first, which would change finding 1 and the order of the two buttons.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D: "Understand what the product is"

Reviewed: Code (page.html, site.css, ui-strings.txt) and a step-by-step description (flows.md) of the Skill Foundry landing page hero. site.js and the hero SVG are not in the input.
Main goal: say in one sentence what Skill Foundry is and who it is for
Steps to main goal: 1 (reads the hero)
Findings: 1 (S1: 0, S2: 1, S3: 0, S4: 0)

### Findings

1. **Hero, "You type" panel** | S2 Major | R-ux-review-1
   - Evidence: "font-family: var(--mono); background: var(--surface); border: 1px solid var(--line);"
   - User experiences: The visitor reads "You type" above a bordered box just under the search field, clicks in to type a request, and nothing happens.
   - Recommendation: The example panel must not look like a field the visitor can type in, and must make clear where such a request is actually typed.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: flows.md describes "a typing animation panel "You type / You get"", but the hero in page.html has only the "You type" label and no "You get" part.
- Hero figure: whether it shows the result of the example request. The SVG content was removed from the input.
- Typing animation: how long the "You type" panel takes to type the prompt and whether it repeats. site.js is not in the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
