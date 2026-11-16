<!-- skill: ux-review | input: skill-figure-craft | turns: 6 | cost_usd: 0.396 | permission_denials: 0 | is_error: False -->

## UX review: figure-craft skill detail page (Skill Foundry)

Reviewed: the page markup and stylesheet plus the four flows in flows.md (decide, check it is real, install, compare).
Main goal: not stated (flows.md gives four flows: decide, check it is real, install, compare)
Steps to main goal: 3 (Download, Unzip, Restart Claude Code), counted for Flow C from the Install section; Flows A, B and D are read on this one page
Findings: 13 (S1: 0, S2: 2, S3: 7, S4: 4)

### Findings

1. **Header nav, Install and Proof links** | S2 Major | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user reads a skill page, clicks Install in the header expecting this skill's install steps, and lands on the home page instead.
   - Recommendation: Make the header Install and Proof links lead to this skill's own Install and How you know sections, or say clearly that they leave the page.

2. **Head "Copy install command" button and Install section "Copy install command" button** | S2 Major | R-ux-review-10
   - Evidence: "unzip figure-craft-1.0.0.zip -d .claude/skills/"
   - Shown absent: Nothing at the head button says the zip must already be downloaded into the current folder, and the command shown does not fetch it.
   - User experiences: The user copies the command from the top of the page, pastes it before downloading anything, and gets a file-not-found error.
   - Recommendation: Say beside every copy-install control that the zip must already be in the current folder, or let the command fetch it.

3. **Header buttons, Copy buttons, Download link, header nav links** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps pill buttons about 37 px tall and header text links about 23 px tall, and sometimes misses or hits a neighbour.
   - Recommendation: Make every button and link target at least 44 by 44 px, including its padding.

4. **Back link "All skills" (Flow D)** | S3 Minor | R-ux-review-10
   - Evidence: "All skills"
   - Shown absent: The back link has no compare control, related skills or previous/next link beside it.
   - User experiences: The user clicks All skills, lands at the top of the home page rather than the collection, and must remember this skill to compare it with another.
   - Recommendation: Let the visitor keep this skill's key facts in view while looking at another skill, and return to the collection list rather than the page top.

5. **Questions bar, four section links** | S3 Minor | R-ux-review-1
   - Evidence: "flex: none; padding: 12px 10px; font-size: .875rem; color: var(--muted); text-decoration: none;"
   - User experiences: The user sees four grey words in a row with no underline, border or fill, and may take them for a plain label.
   - Recommendation: Make the four section links look clickable at rest, with an underline, border or fill, not only on the current one.

6. **Questions bar, tabs list** | S3 Minor | R-ux-review-3
   - Evidence: "How you know"
   - Shown absent: The bar lists four tabs and none for the Download, Install or Banner sections that follow.
   - User experiences: The user scrolls down to Download or Install and the bar shows no section for where they are.
   - Recommendation: Show the current section in the bar for every section on the page, including Download and Install.

7. **What it does, numbered list** | S3 Minor | R-ux-review-13
   - Evidence: "Where the files go: the figure, its page and its build script are the DELIVERABLE"
   - User experiences: The user reads a numbered list that opens with an instruction to the agent about file folders, then layer names, and cannot tell what the skill does for them.
   - Recommendation: Make every item in What it does something the visitor cares about, and keep agent-only instructions out of the numbered list.

8. **What you get, "Recorded real run" and the real answer** | S3 Minor | R-ux-review-10
   - Evidence: "An agent followed this skill on the prompt above."
   - User experiences: The user reads a kettle request in the answer above, a refrigerator line in What you type and a refrigerator in the frame, and must work out which belongs to which.
   - Recommendation: State beside each real answer and each recorded run which request produced it, so the visitor does not have to match them from memory.

9. **Install steps 1 and 2, Download section** | S3 Minor | R-ux-review-9
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - User experiences: The user reads step 1 in Install, scrolls up to Download for the zip and checksums link, then back down to the unzip command.
   - Recommendation: Put the download link, the checksum and the unzip command in one visible group so the steps are done in sequence without scrolling.

10. **Header nav "Collection" and back link "All skills"** | S4 Note | R-ux-review-11
    - Evidence: "../../index.html#collection"
    - User experiences: The user sees two links, All skills and Collection, that both lead to the skill list, and wonders whether they differ.
    - Recommendation: Use one name for the list of skills across the back link and the header.

11. **Skill head, tags and roles** | S4 Note | R-ux-review-1
    - Evidence: "border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px;"
    - User experiences: The user sees tags and roles drawn as pills like the site's buttons, clicks diagram or Developer, and nothing happens.
    - Recommendation: Draw tags and roles so they read as labels rather than buttons, or make them filter the list.

12. **Questions bar, tab spacing** | S4 Note | R-ux-review-9
    - Evidence: "display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none;"
    - User experiences: The user taps one of four tabs set 4 px apart and sometimes lands on its neighbour.
    - Recommendation: Separate neighbouring section links by at least 8 px of empty space.

13. **Install section, npx command button** | S4 Note | R-ux-review-11
    - Evidence: "Copy install command"
    - User experiences: The user sees Copy beside the npx command and Copy install command beside the unzip command, and cannot tell whether both copy an install command.
    - Recommendation: Give the same action the same label everywhere, and give copy buttons for different things labels that say what they copy.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the Install text says the command "downloads the zip, checks its SHA-256 and unzips it", but the visible command only unzips. Does the install-zip data on the copy buttons change what is copied?
- All Copy buttons, Download link, example frame: what does the user see after the click or while the frame loads? The page script is not in the input.
- Questions bar: which tab shows as current while the user scrolls? The first tab is marked current in the markup and the script is not in the input.
- Phone width: are all four tabs visible, given the hidden scrollbar on the bar? What are the gaps and sizes of the header controls and the Back link?
- Example frame: do the turn buttons and the part labels work by touch inside the frame? The framed page is not in the input.
- Theme and language buttons: does the label or state change after a press to show the current theme and language?
- "Tested by a real agent: 3 of 3 cases pass": where can the visitor see the cases? The package files are listed as plain text, not links.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
