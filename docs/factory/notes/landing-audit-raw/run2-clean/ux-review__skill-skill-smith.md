<!-- skill: ux-review | input: skill-skill-smith | turns: 9 | cost_usd: 0.372 | permission_denials: 0 | is_error: False -->

I read the skill's layers and rules, then the page and its CSS, and checked each of flows A to D against them. This is the review.

## UX review: skill-smith skill detail page

Reviewed: The page markup and stylesheet of the skill detail page, checked against flows A to D in flows.md (decide, check it is real, install, go back and compare).
Main goal: Decide if this skill is the one I need, then install it
Steps to main goal: 1 (skill detail page)
Findings: 8 (S1: 0, S2: 3, S3: 5, S4: 0)

### Findings

1. **Flow A, What you type, line to paste** | S2 Major | R-ux-review-5
   - Evidence: "Paste this one line after you install the skill."
   - Shown absent: Nothing marks which parts of the line are an example about test-planner and which parts the user replaces.
   - User experiences: The user pastes the line unchanged and gets a skill named test-planner instead of one for their own need.
   - Recommendation: Mark the line as an example and show, before it is copied, which parts the user must replace with their own skill details.
2. **Flow A and C, How you know, Changelog** | S2 Major | R-ux-review-10
   - Evidence: "this skill itself runs inside the Skill Foundry repository"
   - Shown absent: The Install section and the What you type section never say the skill must run inside that repository.
   - User experiences: The user installs into their own project, pastes the line, and learns from a changelog entry that the skill expects another repository.
   - Recommendation: State the repository requirement where the user decides to install, before the install command and steps.
3. **Flow C, Install, one-command paragraph and Copy install command** | S2 Major | R-ux-review-10
   - Evidence: "It downloads the zip, checks its SHA-256 and unzips it"
   - Shown absent: The copied text is only an unzip of skill-smith-1.0.0.zip; it neither downloads the file nor checks its SHA-256.
   - User experiences: The user pastes the command, gets a file-not-found error unless the zip is already in that folder, and goes back to the Download section.
   - Recommendation: Make the description and the copied command agree, and say where the zip must already be before the command runs.
4. **Flow A to C, header buttons and nav links** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px"
   - User experiences: The user taps buttons about 37 px tall and nav links about 23 px tall, and misses more often on a phone.
   - Recommendation: Make every button and nav link at least 44 by 44 px, padding included.
5. **Flow C, header nav, Install link** | S3 Minor | R-ux-review-11
   - Evidence: "../../index.html#install"
   - User experiences: The user clicks Install in the header expecting this page's install steps, lands on the landing page, and finds the same label again further down this page.
   - Recommendation: Make the header Install link and this page's Install section lead to one place, or give them different labels.
6. **Flow A, skill head, tags and roles** | S3 Minor | R-ux-review-1
   - Evidence: "border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px;"
   - User experiences: The user clicks the meta, factory or authoring pill expecting a filter, and nothing happens.
   - Recommendation: Style tags and roles so they read as plain labels, clearly different from the pill-shaped buttons.
7. **Flow B, How you know, test counts** | S3 Minor | R-ux-review-11
   - Evidence: "Tested by a real agent: 3 of 3 cases pass" and "Live evals: 4 passed, 0 failed"
   - User experiences: The user reads "3 of 3", then "4 passed" in the answer, and cannot tell which count belongs to skill-smith.
   - Recommendation: Say which skill and which cases each count belongs to, so only one count describes this skill's tests.
8. **Flow C, Install, step 1** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - Shown absent: The 64-character SHA-256 in the Download section has no copy control, and the Install step does not show it.
   - User experiences: The user scrolls back to Download, reads a 64-character value, and opens a separate checksums.json to compare.
   - Recommendation: Show the expected SHA-256 beside the install step where the user compares it, so nothing is carried from the Download section.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Copy buttons (header, What you type, Copy the answer, Install): what does the user see after a click? The stylesheet has done and fail states, but the script ("see site.js") is not in the input.
- Install, Copy install command: do the data-install-zip and data-sha256-install attributes make the script download and check the zip? The copied text is only the unzip line.
- Question bar: does the highlighted tab follow the scroll position? Which tab is highlighted in Download, Install and Banner, which have no tab?
- Flow D, All skills link: does the landing page keep the search and role filter on return? Do its cards show the same facts (tested count, rules, roles) as this page, so skills can be compared?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
