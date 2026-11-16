<!-- skill: ux-review | input: skill-copy-tight | turns: 17 | cost_usd: 0.846 | permission_denials: 1 | is_error: False -->

## UX review: Flow A: "Decide if this skill is the one I need"

Reviewed: Code (page.html and site.css) and the flow description in flows.md, covering the skill head, the Questions bar and the sections "What it does", "What you type" and "What you get" of the Copy Tight detail page.
Main goal: Decide if this skill is the one I need
Steps to main goal: 3 (What it does, What you type, What you get)
Findings: 2 (S1: 0, S2: 0, S3: 2, S4: 0)

### Findings

1. **Skill head, tags ("ux-writing", "copy", "ui") and "For:" roles ("Business analyst", "Developer")** | S3 Minor | R-ux-review-1
   - Evidence: ".role { padding: 2px 8px; border: 1px solid var(--line); border-radius: 999px; color: var(--fg); }"
   - User experiences: The visitor sees the role and tag pills, which look like the landing page's filter chips, clicks "Developer" expecting a filter, and nothing happens.
   - Recommendation: Make the tags and roles look clearly different from clickable chips and buttons, or make them work as the filters they look like.

2. **Questions bar, the four links "What it does", "What you type", "What you get", "How you know"** | S3 Minor | R-ux-review-9
   - Evidence: ".qbar-tabs { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }"
   - User experiences: On a phone the visitor taps "What you type" and sometimes lands on the section next to it, because the tap areas are only 4 px apart.
   - Recommendation: Keep at least 8 px between the tap areas of neighbouring links in the Questions bar.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Questions bar: does the highlighted link and the progress line change as the visitor scrolls? The markup marks "What it does" as current and starts the progress line at zero width, and site.js is not in the input.
- "What you type", "Copy" button: what does the visitor see after clicking it? The handler is not in the input.
- Device: is the main audience on phone or desktop? The answer can change the severity of findings 1 and 2.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow B: "Check it is real"

Reviewed: Code (page.html and site.css) and the flow description in flows.md, covering the covers tagged "Real output from an agent", the section "What a real agent produced", the "Tested by a real agent" lines and the section "How you know".
Main goal: Check it is real
Steps to main goal: 3 (real answer, tests, rules counts)
Findings: 0 (S1: 0, S2: 0, S3: 0, S4: 0)

### Findings

No findings.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Head cover and "What you get" cover: what does each image show? Both are tagged "Real output from an agent", but their drawing was removed from the input.
- "Copy the answer" button: what does the visitor see after clicking it? The handler is not in the input.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow C: "Install it"

Reviewed: Code (page.html and site.css) and the flow description in flows.md, covering the header nav, the head "Copy install command" button and the "Download" and "Install" sections.
Main goal: Install it
Steps to main goal: 4 (Download, check its SHA-256, Unzip it into your project, Restart Claude Code)
Findings: 3 (S1: 0, S2: 1, S3: 2, S4: 0)

### Findings

1. **Header nav, "Install" link** | S2 Major | R-ux-review-11
   - Evidence: "<a href="../../index.html#install"><span data-i18n="nav.install">Install</span></a>"
   - User experiences: The visitor wants to install this skill, clicks "Install" in the header, and leaves for the landing page instead of reaching this page's own Install section.
   - Recommendation: Make the header's Install link go to this page's Install section, or make its label say that it opens the site-wide install guide.

2. **Download section and Install section, buttons "Download copy-tight 0.2.0 (.zip, 12 KB)", "Copy" and "Copy install command" (and every other button with the same style, including the head and header buttons)** | S3 Minor | R-ux-review-8
   - Evidence: "padding: 9px 14px; cursor: pointer; text-decoration: none;"
   - User experiences: On a phone the visitor taps a Download or Copy button that is only about 37 px tall and sometimes misses it.
   - Recommendation: Make every button at least 44 by 44 px, counting its padding, on every screen width.

3. **Install section, step 1** | S3 Minor | R-ux-review-10
   - Evidence: "Download the skill .zip and check its SHA-256 against checksums.json."
   - User experiences: The visitor computes the zip's hash without any instructions, opens checksums.json in another view, finds the copy-tight entry and compares 64 characters by eye.
   - Recommendation: Let the visitor check the hash against the value already shown on this page, and say how to compute the hash right beside it.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- Conflict: the Install section says the copied command "downloads the zip, checks its SHA-256 and unzips it", but both the command shown and the data-copy value of "Copy install command" are only "unzip copy-tight-0.2.0.zip -d .claude/skills/". What does the clipboard actually receive? If it is only the unzip command, the head button sits far from the Download button it depends on.
- "Copy" and "Copy install command" buttons: what does the visitor see after a click or after a failed copy? site.js is not in the input, and the done style in site.css gives the button the same border as before the click.
- "Fastest" npx route: does the visitor also have to restart Claude Code after it, as Install step 3 says for the zip route?
- Device: is the main audience on phone or desktop? The answer can change the severity of finding 2.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.

## UX review: Flow D: "Go back and compare with another skill"

Reviewed: Code (page.html and site.css) and the flow description in flows.md, covering the "All skills" back link and the header's "Skill Foundry" and "Collection" links; the landing page they lead to is not in the input.
Main goal: Go back and compare with another skill
Steps to main goal: not countable from the input
Findings: 2 (S1: 0, S2: 0, S3: 2, S4: 0)

### Findings

1. **"All skills" back link (and the header's "Collection" link)** | S3 Minor | R-ux-review-8
   - Evidence: "<p class="back"><a href="../../index.html"><span data-i18n="back">All skills</span></a></p>"
   - User experiences: On a phone the visitor tries to tap "All skills", a single unpadded line of text about 26 px tall, and needs a second tap.
   - Recommendation: Make the back link and the header links at least 44 by 44 px tap areas.

2. **"All skills" back link and header "Collection" link** | S3 Minor | R-ux-review-11
   - Evidence: "<a href="../../index.html#collection"><span data-i18n="nav.collection">Collection</span></a>"
   - User experiences: The visitor sees two links back to the skill list with different labels, chooses one, and lands either at the top of the landing page or at the collection.
   - Recommendation: Give the action of returning to the skill list one label and one destination.

### Not reviewed

- Contrast, focus styles, spacing and type scales: a visual polish pass.
- Semantics, ARIA and screen-reader output: an accessibility audit.
- Wording of labels and messages: a copy edit.

### Open questions

- "All skills" and "Collection": when the visitor returns, does the landing page keep the search text, role filter and scroll position they had before opening this skill?
- Landing page cards: which facts from this page (version, "8 of 8 cases pass", roles, what it does) appear on the cards, so the visitor can compare without remembering them?
- Steps: how many screens are there from this page to opening a second skill? The landing page is not in the input.
- Device: is the main audience on phone or desktop? The answer can change the severity of finding 1.

### Severity scale

- S1 Blocker: the user cannot complete the main goal, or loses data or money.
- S2 Major: the user completes the main goal only after a wrong action, an error or a second attempt.
- S3 Minor: the user completes the main goal at the first attempt, but more slowly.
- S4 Note: the result and the speed do not change; the place departs from the rule.
