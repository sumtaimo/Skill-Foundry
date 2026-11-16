<!-- skill: ux-review | input: skill-design-system | turns: 13 | cost_usd: 0.439 | permission_denials: 1 | is_error: False -->

## UX review: Skill detail page, Flow A: Decide if this skill is the one I need

Reviewed: The page markup and stylesheet for the design-system detail page, read against Flow A (what it does, what you type, what you get).
Main goal: Decide if this skill is the one I need
Steps to main goal: 3 (What it does, What you type, What you get)
Findings: 4 (S1: 0, S2: 0, S3: 3, S4: 1)

### Findings

1. **Skill head, tags and For: roles** | S3 Minor | R-ux-review-1
   - Evidence: ".tags li { font-size: .75rem; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 2px 10px; }"
   - User experiences: The user sees rounded, bordered pills like the filter chips elsewhere on the site, clicks "dark mode" or "Developer" and nothing happens.
   - Recommendation: Draw tags and roles so they look different from clickable chips, or make them clickable.
2. **Skill head and every button, about 37 px high (14 px text × 1.2 + 18 px padding + 2 px border)** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps a small button on a phone, sometimes misses it and taps again.
   - Recommendation: Make every button at least 44 px high.
3. **Questions bar, tabs** | S3 Minor | R-ux-review-9
   - Evidence: ".qbar-tabs { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }"
   - User experiences: The user taps one tab and sometimes hits its neighbour, which jumps to the wrong section.
   - Recommendation: Leave at least 8 px between neighbouring tabs.
4. **Questions bar, four tab links** | S4 Note | R-ux-review-1
   - Evidence: "flex: none; padding: 12px 10px; font-size: .875rem; color: var(--muted); text-decoration: none;"
   - User experiences: The user sees four plain grey words and may not take them for links that jump down the page.
   - Recommendation: Give the tabs a border, fill or underline so they look clickable.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Script: the page's only script tag holds the comment "see site.js", so no handler is shown for the tab highlight, progress bar, theme button, language button or Copy buttons. What does the user see after each?
- Sizes: the header links, back link and tab widths are not given. Are they at least 44 by 44 px?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, Flow B: Check it is real

Reviewed: The page markup and stylesheet for the design-system detail page, read against Flow B (the real answer, tests, rules counts).
Main goal: Check it is real
Steps to main goal: 3 (Look at the real answer, Look at the tests, Look at the rules counts)
Findings: 1 (S1: 0, S2: 0, S3: 1, S4: 0)

### Findings

1. **What you get, Copy the answer button, about 37 px high** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user tries to copy the long agent answer on a phone, misses the small button and taps again.
   - Recommendation: Make the Copy the answer button at least 44 px high.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Script: no handler is shown for the Copy the answer button. Does the user see a confirmation after copying?
- Cover and colour figures: the drawings were removed from the markup, and a comment calls them "decorative/illustration". What does the user see under the label "Real output from an agent"?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, Flow C: Install it

Reviewed: The page markup and stylesheet for the design-system detail page, read against Flow C (command, zip, checksum).
Main goal: Install it
Steps to main goal: 3 (Download the zip and check its SHA-256, Unzip it into .claude/skills/, Restart Claude Code)
Findings: 3 (S1: 0, S2: 1, S3: 2, S4: 0)

### Findings

1. **Header nav, Install link** | S2 Major | R-ux-review-11
   - Evidence: "<a href="../../index.html#install"><span data-i18n="nav.install">Install</span></a>"
   - User experiences: The user clicks Install in the header to install this skill and lands on a different page, away from this skill's download and commands.
   - Recommendation: Make the header's Install link open this page's own Install section, or give the two destinations different names.
2. **Page head, Copy install command button** | S3 Minor | R-ux-review-4
   - Evidence: "data-copy="unzip design-system-1.0.0.zip -d .claude/skills/""
   - User experiences: The user clicks the button, sees no command beside it, and pastes a command they never read. It is one of three install routes on the page.
   - Recommendation: Show the command the button copies next to the button, so the user can see what is copied.
3. **Page head, Download and Copy buttons, about 37 px high** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: The user taps a small Download or Copy button on a phone, misses it and taps again.
   - Recommendation: Make every install button at least 44 px high.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the Install text says the one command "downloads the zip, checks its SHA-256 and unzips it", but the command shown is only the unzip line. What does the copied command do?
- Script: no handler is shown for the Copy buttons. Does the user see a confirmation after copying?
- Sizes: the width of the buttons, and the size of the checksums.json link, are not given.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Skill detail page, Flow D: Go back and compare with another skill

Reviewed: The page markup and stylesheet for the design-system detail page, read against Flow D. The list page is not in the input.
Main goal: Go back and compare with another skill
Steps to main goal: 1 (All skills)
Findings: 2 (S1: 0, S2: 0, S3: 2, S4: 0)

### Findings

1. **All skills back link** | S3 Minor | R-ux-review-12
   - Evidence: "<a href="../../index.html"><span data-i18n="back">All skills</span></a>"
   - User experiences: The user clicks All skills and lands at the top of the list page, then scrolls to find the skills to compare.
   - Recommendation: Make the back control return the user to the skill list, where they left it.
2. **All skills back link and header nav links** | S3 Minor | R-ux-review-8
   - Evidence: ".tools a { color: var(--muted); font-size: .9rem; }"
   - Shown absent: Neither the header links nor the back link have any padding or minimum height, so each is only as tall as its text.
   - User experiences: The user taps a thin line of text on a phone, misses it and taps again.
   - Recommendation: Give the back link and the header links a tap area at least 44 px high.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Script: no script is shown. Are the list page's search text, role filter and scroll position restored when the user comes back through All skills?
- List page: its cards and finder are not in the input. How does the user compare two skills there?

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
