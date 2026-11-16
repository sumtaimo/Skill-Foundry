# Landing site audit, 2026-11-16

Scope: UI and UX of the Skill Foundry showcase site (`node src/site/build.mjs`, output `dist/site`), found with the project's own ready skills run by fresh real agents, plus measurements with Playwright. Audit only: no file in `src/site/**` or any skill was changed. TAIMO picks what to fix.

## 0. What was run, and how far to trust it

**Pages built (from the build output: 11 pages, 10 skills):** the landing page `index.html`; ten skill pages `skills/<name>/index.html`; one extra page `skills/figure-craft/example.html`. There is no separate install, for-agents, proof or collection page: those are sections of the landing page (`#collection`, `#together`, `#install`, `#agents`, `#proof`, then "How a skill is made" and "Limits"). Page types: landing, skill page (10 pages, one template), example page.

**Real agents (all `claude -p`, one agent per page per skill, fresh process, `--allowedTools` limited, inputs in a temp folder outside the repo):**

| Skill | Pages | Result files |
|---|---|---|
| ux-review | landing (4 flows) + 10 skill pages (4 flows each) | `landing-audit-raw/run2-clean/ux-review__*.md` |
| a11y-audit | landing + 10 skill pages | `run2-clean/a11y-audit__*.md` |
| design-system | the site's own colours (made the tokens) | `run2-clean/design-system__site-colours.md`, `design-system-attempts/` |
| ui-polish (token mode, using those tokens) | landing + 10 skill pages | `run2-clean/ui-polish__*.md` |
| copy-tight | UI strings of landing + 10 skill pages, plus the English dictionary inside `site.js` | `run2-clean/copy-tight__*.md` |

`example.html` was measured and screenshotted but not given to the skills (it is a sandboxed figure demo, not a UI page). The skill pages are one template, so their findings repeat; the report merges them.

**Honest limits of this run (read these before trusting a number):**

1. **Two rounds.** Round 1 ran the ux-review, a11y-audit and copy-tight agents with their working folder inside this repo. Those agents could see the project `CLAUDE.md`/`AGENTS.md` and the copy-tight agents opened `.claude/skills/copy-tight`, so they were not "only the skill folder". I kept those answers (`run1-in-repo/`, used here only to measure run-to-run consistency) and re-ran everything from copies of the skill folders outside the repo (`run2-clean/`). The findings below come from run 2 unless a line says "run 1". ui-polish and design-system were run clean from the start.
2. **Usage limit.** The account's 5-hour limit stopped 23 agents mid-batch (their answers are the one line "You've hit your 5-hour limit"). They were discarded, not used, and re-run after the reset.
3. **Permission rules of my harness blocked the design-system script twice.** The agent chained `cd …; I=…; node engine/tokens.mjs`, which my `Bash(node:*)` rule refused. Attempts 1 and 2 are kept in `design-system-attempts/`; in both the agent said honestly that it worked by hand and that the ratios were not machine-checked. The third run (Bash allowed, copy of the skill folder) ran the engine. That is a failure of my set-up, not of the skill.
4. **The agents did not see rendered pages.** They got the page HTML with large `<svg>` and `<script>` content removed (size), the real `site.css`, and for ux-review a flow description I wrote (`tools/flows-*.md`, facts taken from the page's own structure). Anything that `site.js` builds at run time was invisible to them. Two findings turned out wrong for that reason (section c).
5. **Screenshots.** All 11 pages × light/dark × 1440/390 were captured (176 PNG slices, ≤ 2400 px). I looked at 7 of them myself (the ones kept in `landing-audit-shots/`). Landing at 390 has 8 slices; only the first 6 were saved. Dark mode: counts are identical to light (same tokens); I looked at one dark slice only.
6. **My own observations are labelled "screenshot" or "measurement".** I did not add any finding that has neither an agent answer nor a measurement behind it.
7. **Cost:** about $29 in agent runs in total (run 1 $12.5, run 2 $15.3, design-system attempts $1.5).

---

## (a) Executive summary: the 10 most important problems, ranked for a first-time visitor

| # | Problem | Page | Evidence | Found by | Proposed fix (in words) |
|---|---|---|---|---|---|
| 1 | **On a skill page the first screen shows a big sample answer, not the skill name.** The name (h1) starts at y = 866 px at 1440 (the window is 900 px high) and y = 597 px at 390. The same sample answer then appears a second time under "What you get". | all 10 skill pages | Measurement: h1 top 866 / 597. Screenshot `skills_ux-review-light-1440-1.png` (cover first, `ux-review` below it, the second copy of the answer at the bottom of the slice). | Measurement + screenshot. No skill found it (see c). | Put name, one-line purpose, test badge and one Install button first, with the cover beside them on wide screens. Show the answer once. |
| 2 | **The hero asks for a decision before it explains anything.** 23 clickable things sit above the fold at 1440 (4 links, 2 toggles, 5 role buttons, 10 skill chips, search). There are four ways to pick a skill (search, role buttons, ten chips, then the ten cards). No sentence says what a "skill" is or who it is for. The "You type" box looks like a field you can type in. | landing | Measurement: 23 controls above the fold at 1440, 13 at 390. Quote: hero is only "One line in. A skill out." + "Type one plain request and a skill turns it into checked, finished work." ux-review run 2, Flow D: *"The visitor reads 'You type' above a bordered box … clicks in to type a request, and nothing happens"* (run 1: S2). Screenshot `landing-light-1440-1.png`. | ux-review R-ux-review-1; measurement | One sentence that defines a skill and its user, one main action, one real example. Move search and filters to the collection toolbar; drop the ten chips. |
| 3 | **The page is long and the part visitors came for is far down.** Landing is 9 822 px (10.9 screens) at 1440 and 17 144 px (20.3 screens) at 390. "Ready skills" is 3 434 px, "Skills working together" 3 035 px (31 % of the page). The "Install" nav link jumps to y = 7 262 (74 % down). | landing | Measurement of section positions: hero 106, collection 766, together 4 200, install 7 262, agents 8 012, proof 8 396. Screenshots `landing-light-1440-3.png`, `-4.png`. | measurement | Collapse the three recipes to one line each (answer behind a "show" control), shorten the cards, bring Install up under the collection. |
| 4 | **The Install section does not work as written.** "Or copy one command. It downloads the zip, checks its SHA-256 and unzips it…" is followed by no command and no copy button. Step 1 says "Download the skill .zip", but this section only offers "all skills". The copy box holds `npx … add <skill>` with a placeholder the visitor must replace. A second code block with five commands has no copy button. The manual 3-step list comes before the "Fastest" way. | landing | Screenshot `landing-light-1440-4.png`. ux-review run 2, Flow C: *"The command this sentence promises must be shown, ready to copy, where the sentence is"*; *"The command the visitor copies must already hold a real skill name"* (run 2, S2 "Copy button of the one-command install"). Also run 1 findings 2, 5, 6. | ux-review R-ux-review-10, -4 | Lead with one pre-filled command; put the zip route in a collapsed "No Node.js?" box; remove the dangling sentence. |
| 5 | **Ten identical dark "Copy install command" buttons plus ten "Download" buttons compete.** Every card repeats the same two actions; there is no single main action. | landing | Measurement: `.btn.primary` count = 10 on the landing page. ui-polish fix 1: *"10 filled btn primary buttons … gave the page ten primary actions. Now only the first card keeps primary."* | ui-polish R-ui-polish-5 | Cards get one action, "View skill". Install lives on the skill page and in one Install section. |
| 6 | **Trust label and hero preview are hard to read.** "Real output from an agent" (the site's main claim) is 11.52 px grey text, the smallest on the page (14 instances on the landing page). The hero preview shows overlapping and clipped text: lines of the answer print on top of each other and "here ran." sits outside the panel (light, 1440 and 390). Layout shift while the demo types: CLS 0.063 at 1440, 0.098 at 390 (limit for "good" is 0.1). | landing | Measurement: `span.cover-tag` 11.52 px × 14. CLS values. Screenshots `landing-light-1440-1.png` and `landing-light-390-1.png`. | measurement; screenshot | Make the claim readable (≥ 14 px, full-contrast); fix the preview box height so the typing animation cannot overflow; reserve its space. |
| 7 | **Small touch targets everywhere.** 77 targets under 44 px at 1440 and 73 at 390 on the landing page, 16–18 on each skill page. Header links are 23 px high, skill chips 32, role buttons 36 above 480 px, copy and download buttons 37, card title links 28, table links 17–21. | all | Measurement. ux-review R-ux-review-8 (run 2: *"Every skill chip must be at least 44 by 44 px"*; run 1 the same). ui-polish fix 13 (target size). | ux-review, ui-polish | One rule: every control at least 44 px high (tokens already have `--size-target-min`). |
| 8 | **Faint text fails contrast.** `--faint` grey (#9c9c97) is 2.62:1 on the page background and 2.76:1 on white (11 text elements on the landing page, the footer on every skill page); dark mode 3.68:1 and 3.94:1. Needs 4.5:1. | landing, all skill pages | Measurement: 11 failures (landing), 1 (skill page). ui-polish fix 3 with ratios from the skill's script (matches the measurement). | ui-polish R-ui-polish-4; measurement | Use `--muted` for that text (4.79:1 / 5.05:1; dark 7.21:1). |
| 9 | **On a skill page the "Install" link in the header leaves the page.** It opens the generic Install section of the landing page, while the skill's own Install section is 81 % down the skill page (y = 5 832 of 7 168); the landing's Install is 74 % down its page (y = 7 262). Visitors who want to install this skill meet two install places. | all 10 skill pages | ux-review run 2, Flow C: *"The user clicks Install to reach this skill's install steps and lands on the home page's general install section"* (S2 on 7 of 10 pages, S3 on a11y-audit, skill-smith and ux-review). Section positions from measurement. | ux-review R-ux-review-11 | In the header on a skill page, link to the page's own install block; put that block right after the head. |
| 10 | **Skill page reading order and column.** The lead-in sentence comes before its heading ("Paste this one line after you install the skill." sits above the h2 "What you type"; same for "What you get"). The content column is 680 px in a 1 088 px area, so the right half of the screen is empty at 1440. The in-page tab bar is cut off at 390 ("How you know" shows as "H"). The ten layers are listed in full under "What it does", before anything the visitor needs. | all 10 skill pages | Screenshots `skills_ux-review-light-1440-1.png`, `skills_ux-review-light-390-1.png`. Measurement: column width 680 of 1 088. ux-review run 2: *"The ten layers list must …"* (R-ux-review-13) on several pages. | ux-review (partly); screenshot | Heading first, then its sentence; show the ten layers collapsed ("How it works"); use the wide screen for the answer next to the text. |

Also real, lower rank: with JavaScript off, the "For agents" prompt shows raw `{site}` and `{base}` (HTML in `index.html`); the Khmer language button has no `lang="km"` (a11y-audit open question); the name "Copy Tight" on chip and card but `copy-tight` elsewhere (ux-review run 1); the rules meter "4 of 16 rules machine-checked" reads like "12 are unchecked" and the explanation is far below (ux-review run 1 and 2); the "Copy" buttons show no visible confirmation in CSS (ux-review run 2).

---

## (b) Full findings per page, grouped by skill

Measurement table first (Playwright, deviceScaleFactor 1, light; dark has the same counts). "Elements <16 px" counts elements with their own text, duplicates included. Raw numbers per page and theme: `landing-audit-raw/measurements-playwright.json`.

| Page | Width | Height px (screens) | Elements <16 px | Targets <44 px | Contrast fails | CLS | Sideways scroll |
|---|---|---|---|---|---|---|---|
| landing | 1440 | 9822 (10.9) | 442 | 77 | 11 | 0.063 | no |
| landing | 390 | 17144 (20.3) | 442 | 73 | 11 | 0.098 | no |
| skills/a11y-audit | 1440 / 390 | 7132 (7.9) / 7716 (9.1) | 111 | 17 | 1 | 0 | no |
| skills/changelog-writer | 1440 / 390 | 6485 (7.2) / 7656 (9.1) | 81 | 17 | 1 | 0 | no |
| skills/copy-tight | 1440 / 390 | 6368 (7.1) / 7351 (8.7) | 83 | 17 | 1 | 0 | no |
| skills/design-system | 1440 / 390 | 8603 (9.6) / 9335 (11.1) | 146 | 17 | 1 | 0 | no |
| skills/figure-craft | 1440 / 390 | 8630 (9.6) / 9941 (11.8) | 101 | 18 | 1 | 0 | no |
| skills/skill-smith | 1440 / 390 | 6116 (6.8) / 6405 (7.6) | 87 | 16 | 1 | 0 | no |
| skills/spec-writer | 1440 / 390 | 7848 (8.7) / 9377 (11.1) | 108 | 17 | 1 | 0 | no |
| skills/test-planner | 1440 / 390 | 6920 (7.7) / 7571 (9.0) | 97 | 17 | 1 | 0 | no |
| skills/ui-polish | 1440 / 390 | 8218 (9.1) / 9731 (11.5) | 116 | 17 | 1 | 0 | no |
| skills/ux-review | 1440 / 390 | 7168 (8.0) / 7926 (9.4) | 106 | 17 | 1 | 0 | no |
| skills/figure-craft/example | 1440 / 390 | 1729 (1.9) / 2639 (3.1) | 70 | 5 | 0 | 0 | no |

Other measurements:

- **First thing seen above the fold.** Landing 1440: the h1 (44.8 px, top 143) is the largest text; next largest is an h2 at 20 px. Landing 390: h1 30.4 px at y = 158; role buttons are the first controls; the preview and chips are below the fold. Skill page 1440: the cover plate (about 680 × 670 px, read from the screenshot) is the first thing seen; h1 at y = 866. Skill page 390: cover, then h1 at y = 597.
- **Competing calls to action above the fold** (links and buttons in view): landing 1440 = 23, landing 390 = 13, skill page 1440 = 9 (skip link, logo, 4 nav links, 2 toggles, back link), skill page 390 = 14.
- **Text under 16 px.** Body text is 16 px; header links 14.4 px; most card text 12.8–14.4 px; labels and tags 11.52 px (cover tag, proof label); SVG text inside covers as small as 7 px (8 `svg text` nodes on the landing page, 70 small elements on `example.html`, whose figure labels are 7 px).
- **Sideways scroll:** none on any page at 1440 or 390.
- **Layout shift:** only the landing page shifts (0.063 and 0.098); all other pages 0.
- **Contrast:** all failures are `--faint` text (card numbers "No. 01" at 2.76:1, search placeholder, list markers, footer). 11 on the landing page, 1 (footer, 2.62:1) on each skill page, 0 on the example page.
- **Page length by page type:** landing 10.9 / 20.3 screens; skill page 6.8–9.6 screens at 1440 and 7.6–11.8 at 390; example 1.9 / 3.1.
- **Sections on the landing page (1440):** hero 660 px · Ready skills 3 434 · Skills working together 3 035 · Install 735 · For agents 384 · Proof 860 · How a skill is made + Limits ≈ 360.
- **Sections on a skill page (ux-review, 1440):** What it does 477 px · What you type 173 · What you get 2 919 (two copies of the answer) · How you know 796 · Download 251 · Install 627 · Banner to share 533.

### b1. ux-review

Run 2 (clean). The rule ids are the skill's own (`R-ux-review-n`; 1 looks clickable but is not, 4 control beside its result, 8 target size, 9 gap between targets, 10 information shown where needed, 11 same name for same thing, 12 back path, 13 long list). Finding counts per page: landing 13 over four flows; skill pages 8 to 15 (a11y-audit 10, changelog-writer 8, copy-tight 8, design-system 13, figure-craft 13, skill-smith 8, spec-writer 15, test-planner 8, ui-polish 15, ux-review 11).

**Landing page** (`ux-review__landing.md`)
- Flow A, find a skill: search and role filter are far from the cards they change (R-4, S3); skill chips and role buttons too small (R-8, S3); card title link 28 px (R-8); tags and "For:" pills look like clickable chips (R-1, S3).
- Flow B, check it is real: the "Real output from an agent" tag looks clickable but is not (R-1, S3); rules meter does not say who checks the rest (R-10, S3); "Proof" link target.
- Flow C, install: **S2** the copy button of the one-command install carries a placeholder (R-10); the five-command block has no copy; "Or copy one command" has no command (R-4, S3); card buttons 37 px (R-8, S4).
- Flow D, understand: "You type" panel looks like an input (R-1, S3 in run 2, S2 in run 1).

**Skill pages** (one template; the same findings repeat)
- **S2** header "Install" link goes to the landing page's Install section (R-11); on 7 of 10 pages it is S2, on the other 3 S3.
- **S2/S3** "Copy install command" in the head and the Install section: what it copies and what comes next is not stated (R-9, R-10).
- S3 header links 23 px, buttons 37 px (R-8) on every page.
- S3 tags and role pills look like filter chips (R-1); the in-page tab bar spacing (R-9, S4).
- S3 the list of ten layers is long and says little to a newcomer (R-13).
- S3 "All skills" back link and header "Collection" are two names for one place (R-12/R-11).
- Page specific: figure-craft "Recorded real run" and the answer explained twice (R-10); ux-review "What you type" example box (R-3).

### b2. a11y-audit

Run 2 (clean). The skill's script ran 38 checks on every page.
- **Landing: 0 findings.** The agent confirmed what the markup does right: one `main`, skip link, h1 → h2 → h3, labelled search field, polite live region for the result count, table `th scope`.
- **Skill pages: 1 advisory each, same on all 10:** `landmark-name`, SC 1.3.1 (A): `<nav class="tools">` has no name while `<nav aria-label="Questions">` has one, so a screen reader lists two unnamed-vs-named navigations. Fix given as a diff (`aria-label="Main"`).
- **Open questions it raised:** the illustrations were removed from the input, so decorative-vs-meaningful SVGs could not be checked; the Khmer button text has no `lang="km"` and the script has no language-of-parts check; whether `aria-pressed` and copy announcements are updated by `site.js`.
- **Manual-test list** (keyboard, screen reader, voice control, zoom 200 % and 400 %, alt text) given every time, as the skill requires.
- Not done, by the skill's rules: contrast, focus style, spacing, target size (these belong to ui-polish; the measurements above cover them).

### b3. ui-polish (token mode)

Tokens first: design-system was run on the site's own colours (section b4). ui-polish then read `tokens.css` + `tokens.supplement.css` and `site.css` for each page (11 runs, 11 to 19 fixes each, 12 to 17 KB answers; I asked for changed rules only).
- **Landing, 16 fixes.** (1) 10 primary buttons → 1 (R-ui-polish-5, -21); (2) base `.btn` becomes the secondary style; (3) `--faint` text fails 4.5:1 → `--muted` (ratios 2.62 → 4.79, 2.76 → 5.05, dark 3.68 → 6.74, 3.94 → 7.21, computed by the skill's script); (4) 20 off-scale font sizes → tokens; (5) line-heights 1.6 → 1.5 body, 1.12 → 1.2 h1, headings 1.25; (6) weights 400/500/700 → 400/600; (7) off-scale spacing → `--space-*`; (8) no line-length limit on paragraphs (about 75 characters) → `max-width: 65ch`; (9) `.proof` styled both the table and the answer figure; (10) the global `:focus-visible` set `border-radius: 4px`, squaring pill buttons while focused; (11) focus outline 3 → 2 px with 2 px offset; (12) `.chip` had no hover style and no control had a disabled style; (13) target size 44 px for nav links, buttons, chips, role chips, title links, table links; (14–15) radii and durations to tokens; (16) reduced motion already handled.
- **Skill pages, 11 to 19 fixes each.** Same families; page-specific: `.qbar`, `.stats`, `dt/dd`, `.files`, `.banner`, `.tokens-*` rules.
- **No invented token names:** I checked every `var(--…)` in all 11 answers against the token files and `site.css`; all exist (two `--space-` matches are the agent writing `--space-*` in prose).
- **Never edited the token file or any text:** confirmed in each answer's own statement; I did not diff the polished code against the HTML.
- What it cannot see: section order, page length, the overlapping hero text, the cover-before-h1 problem (all need rendering or a layout rule).

### b4. design-system (the site's own colours)

- Attempts 1 and 2: blocked by my permission rule (above); answers kept, marked "by hand" by the agent itself. Attempt 1 asked three questions (see below).
- Run 3 (clean copy, Bash allowed): the engine ran. All 19 existing tokens kept with the same values (`--ok` #2f7a4b light, #6cc28f dark). Engine added colour scales (primary around #2f7a4b at 700, neutral, status), type, control heights, shadow, border widths, density. It **skipped** the spacing, radius and motion scales and the dark shadows because `site.css` already had one token in each family (`--gutter`, `--radius`, `--ease`); the agent added them by hand in `tokens.supplement.css` and said so. The engine's neutral scale is green-tinted and does not match the site's existing greys; the agent called the scales optional.
- Questions it asked (attempt 1, same ones apply): site uses weight 500 for headings and buttons but the preset says 600; site line-height 1.6 vs 1.5; pill buttons vs 10 px control radius; failing pairs (`--faint` 2.45:1 on `--surface2`, `--line-strong` 1.41:1 vs 3:1) kept as asked.

### b5. copy-tight

Run 2. 193 strings on the landing page; about 5 to 15 rewritten per page, on all pages 5 to 15 of 78 to 100.
- **Typical edit:** "Restart Claude Code so it loads the skill." → "Restart Claude Code to load the skill."; "Paste this one line after you install the skill." → "Paste this line after installing the skill."; "Machine checks cover structure and a reviewer covers the rest." → "Machines check structure; a reviewer checks the rest." Savings are 3 to 12 characters. Meaning, numbers, names, paths and commands kept; the three "Limits" lines were deliberately left alone.
- **Dictionary of `site.js`** (118 strings, one extra run because my string list missed text injected by script): the longest string, `install.npx` (52 words: "Fastest: run one command … tells your agents to use the skills and stops them from editing or updating the skills (only you update)"), was shortened by only a few words and still holds "agentic harness"; it was not split into short sentences.
- What it did not touch, and I did not ask it about: strings that need a *structure* change, not a rewrite ("Or copy one command." with nothing after it; see problem 4).

---

## (c) How our skills performed

Judged against my own measurements, the screenshots I looked at, the page HTML and `site.js`, and run 1 vs run 2 of the same skill. "Correct" means I could confirm it; "wrong" means I could show it false; "missing" means a real problem in my evidence that the skill did not report.

### ux-review

**Correct (confirmed by measurement or screenshot):**
- Targets too small, R-ux-review-8: its "about 37 px", "about 23 px", "about 32 px" match my measured 37 / 23 / 32 (and 36 for role buttons), computed by the agent from CSS alone.
- "Or copy one command" has no command (Flow C): confirmed in `landing-light-1440-4.png`.
- Install link on a skill page opens the landing's Install section: confirmed in the HTML (`../../index.html#install`).
- Tags and role pills look like filter chips; the "You type" box looks like an input: consistent with the screenshots.
- Evidence quotes are real strings or CSS rules from the input in every finding I spot-checked; open questions are written for what the input did not show (script, SVG).

**Wrong (false positive):**
- Landing Flow C #1 (run 1, S2) and skill-page Flow C (run 2, S2 on 6 pages: a11y-audit, changelog-writer, design-system, figure-craft, skill-smith, ux-review) "Copy install command copies only `unzip …`" (run 2, S2): `site.js` (lines 247-256) replaces `data-copy` with a full `curl … | shasum … | unzip` command and writes it into the visible box. The agent wrote this doubt itself as an open question ("does the copy button put a fuller command on the clipboard?") but still ranked the finding S2.
- Run 1 landing finding 1 (S2, whole card not clickable): the evidence is `.plate:hover { border-color }`; plausible but I did not test the click; treat as unconfirmed.

**Missing (real, in my evidence, not found):**
- Cover/answer before the h1, the first screen of a skill page (problem 1).
- Duplicate content: the same answer twice on a skill page; thumbnail beside the same answer in each recipe.
- Page length and section order (landing 10.9 / 20.3 screens, install at 74 %).
- Overlapping text in the hero preview; 11.52 px trust label; lead-in sentence above its heading; tab bar cut off at 390; empty right half at 1440. These need rendered output.
- Flow D ("understand what the product is") returned one finding about the input-like panel and nothing about the missing definition of "skill".

**Consistency (run 1 in repo vs run 2 clean, landing):** run 1 found 20 findings over four flows, run 2 found 13. Both found small targets, chip-like pills, search far from results, "Real output" tag, meter wording, dangling install sentence, input-like panel. Only run 1: whole card not clickable (S2), "Collection" vs "Ready skills", "Copy Tight" vs "copy-tight", "no match" message position. Only run 2: Proof link target, five-command block. Severity moved for the same finding (input-like panel S2 in run 1, S3 in run 2).

**What ux-review should change (not changed here):** (1) add checkable rules for first screen content, section order, page length, duplicated blocks and number of calls to action (today none of the 13 rules can find problems 1, 2, 3, 10); (2) accept an optional screenshot or measurement sheet so layout is visible; (3) when a script the page needs was not given, cap a finding at S3 or move it to open questions instead of S2; (4) when the same template repeats on many pages, state once and list pages.

### a11y-audit

- **Correct:** the one advisory (two `nav` landmarks, one unnamed) is true on all 10 skill pages and absent on the landing page, which has one `nav`; the clean bill for the landing markup is consistent with the HTML I read. The Khmer-label `lang` question is real. It lists manual tests every time and states what it did not check.
- **Wrong:** none found.
- **Missing:** nothing in scope that I could show. By its rules it does not do contrast, target size or focus style, so 77 small targets and 11 contrast failures appear only in ux-review, ui-polish and my measurements; an owner reading only the a11y report would see "0 findings" on the landing page. No-JS state (`{site}` placeholder text) is outside the skill.
- **Run-to-run:** run 1 and run 2 agree (0 on landing, the same 1 advisory per skill page).
- **What it could change:** add a language-of-parts check (WCAG 3.1.2, AA) so the Khmer button is a finding, not a question; and say in its header when contrast and target size were skipped by rule, so a reader does not read "0" as "clean".

### ui-polish

- **Correct:** contrast ratios match my measurement (2.62:1 and 2.76:1 for `--faint`); "10 primary buttons" matches my count of 10; role buttons 36 px and chips under 44 px match; the `:focus-visible` radius problem and the `.proof` double use are real CSS facts in `site.css`; no token name invented; no word of text changed (by its own check).
- **Wrong:** none that I could prove; I did not apply the CSS, so I cannot say the patched site looks right.
- **Questionable:** it applies token values that differ from the site's own (weights 500 → 600, line-height 1.6 → 1.5, h3 17.6 → 16 px, near-black primary button → brand green). That follows its rules, but it changes how the site looks and conflicts with the questions design-system raised. Eleven separate patches for one shared `site.css` could conflict; not tested.
- **Missing:** it cannot see order, length, duplication, the overlapping hero text or the h1 below the cover. Its answers are 12 to 17 KB per page even when asked for changed rules only.
- **What it could change:** a rule for "text overflowing its box" when given a screenshot or measurement; run once on a shared stylesheet and return one patch plus per-page deltas; ask before replacing site values by token values that differ.

### design-system

- **Correct:** kept every existing value and name; reported the failing pairs of the site's own palette and kept them as asked; asked about weight, line height and radius instead of overwriting; said plainly what was hand-made.
- **Could not do (skill limit):** with a partial token file the engine treats a family as present if one token matches (`--gutter` hides the whole spacing scale), so the agent had to write spacing, radius, motion and dark shadows by hand, unchecked. The generated neutral scale ignored the site's existing greys.
- **What it could change:** detect families by scale (several matching tokens), not by one name; build neutrals from existing greys when they exist.

### copy-tight

- **Correct:** meaning, numbers, names, paths and commands kept in every answer I diffed; legal-like "Limits" lines kept; it says it will not save over the file.
- **Weak (the lowest of the five):**
  - Format is not stable. In run 1, three answers listed only some lines (copy-tight page: 8 of 84 lines; figure-craft: 8 of 100; ui-polish: 10 of 83) and two returned fewer lines than they were given (test-planner 76 of 83, design-system 80 of 86) with no statement of what was dropped. Run 2 returned the full list every time.
  - "What changed" is generic ("Cut filler", "Active voice and plainer words"), not a before and after for each string, so a reviewer has to diff by hand.
  - The edits are tiny (3 to 12 characters); the 52-word install paragraph kept its jargon.
  - Run 1 changed the site's trust label "Real output from an agent" → "Real agent output"; run 2 kept it. Whether a label like that may be reworded is not a rule.
- **Not its job but worth an open question:** strings that point at nothing ("Or copy one command." with no command).
- **What it could change:** fixed output format (a table of id, before, after, characters saved, reason); never drop an input line; allow marking a string "claim label, keep"; split strings longer than about 25 words into sentences.

### Harness findings (not a skill)

- An agent started inside this repo loads `CLAUDE.md`/`AGENTS.md` and can open `.claude/skills/<name>`. "Fresh agent, only the skill folder" needs the folder copied elsewhere (as in `landing-audit-raw/tools/run3.sh`).
- `claude -p … --permission-mode dontAsk --allowedTools "Bash(node:*)"` refuses compound commands (`cd …; node …`) even though the skill's own layers produce them. Skills that run a script need either a note to run it as one plain `node …` command or a broader rule in the runner.

---

## (d) Proposed re-organisation (wireframes in text)

Estimated effect: landing from about 9 800 px to about 4 500 px at 1440 (estimate from section heights above, not measured); skill page from about 7 200 px to about 4 500 px.

### Landing page

```
HEADER   Skill Foundry | Skills | Install | For agents | [theme] [language]      (Proof moves to footer link)

HERO  (fits one screen at 1440 and at 390)
  h1   One line in. A skill out.
  p    A skill is a folder of instructions your AI agent follows. Each one is tested by a real agent.
  [Browse 10 skills]  (primary)     [Copy install command]  (secondary, pre-filled)
  right (wide screens) / below (phone): ONE real example
        request -> answer, label "Real output from an agent" (14 px+), "13 of 13 cases pass"
  CUT from hero: search, role buttons, ten chips, typed "You type" box

SKILLS   h2 Ready skills
  toolbar: [Search] [Role: All v]    "10 of 10"   (directly above the grid)
  grid of 10 cards, each:  cover | name | one line "You type: …" | role pills | "13/13 real-agent cases"
                           ONE button: [View skill]
  CUT from card: rules meter, Download button, per-card Copy install (live on the skill page)

INSTALL  h2 Install a skill
  one box, pre-filled:  npx github:sumtaimo/Skill-Foundry add <first skill>  [Copy]   + skill selector
  3 short lines: needs Node and git · restart Claude Code · only you update skills
  <details> No Node.js? Download the zip and check the SHA-256 </details>
  <details> More commands: add --role, add --all, check, update, remove </details>
  <details> What it does to an agentic harness </details>

TOGETHER h2 Skills working together
  three one-line rows: request | skills used in order | [Show the answer]
  MOVE the full answers behind the button (cut about 2 500 px); CUT the thumbnails

PROOF    h2 Proof
  table of 10 rows (skill | real-agent cases | rules checked)
  <details> The 7 checks </details>      explanation of "rules machine-checked" sits next to the table

AGENTS   h2 For agents: the copy prompt + skills.json + llms.txt  (4 lines)

FOOTER   How a skill is made (5 lines, collapsed) | Limits (3 lines) | Proof | skills.json | llms.txt
```

### Skill page

```
HEADER   same as landing; "Install" link goes to #install on this page
BACK     All skills

HEAD  (two columns at 1440, one column at 390; h1 above y = 400)
  left:  h1 name · one-line purpose · version · roles · "13 of 13 real-agent cases pass"
         [Copy install command] (primary)   Download .zip (text link)
         tags  (plain text, not chip-shaped)
  right: cover, "Real output from an agent"

NAV      Example | What it does | How you know | Install     (scrolls; not cut off at 390)

EXAMPLE  h2 What you type  -> the request + [Copy]
         h2 What you get   -> the real answer ONCE, with request and [Copy the answer]; files in the package
         CUT: the second copy of the answer in the head

INSTALL  h2 Install      <- moved up, right after Example
         pre-filled command + [Copy]; 3 steps; Download + SHA-256 + checksums.json in one block

HOW IT WORKS  h2 What it does  -> the ten layers inside <details> (collapsed)
HOW YOU KNOW  h2 How you know  -> rule counts, tests, <details> Changelog </details>

FOOTER   Banner to share (collapsed) | other skills (2 related) | back to all skills
```

Rules for both pages: every heading comes before its lead-in sentence; every control at least 44 px; no text under 14 px except decorative SVG; `--faint` not used for text; one primary button per screen.

---

## Files

- Report: `docs/factory/notes/landing-audit-2026-11-16.md`
- Agent answers: `docs/factory/notes/landing-audit-raw/run2-clean/` (used), `run1-in-repo/` (consistency only), `design-system-attempts/` (3 runs and the generated tokens), `measurements-playwright.json`, `tools/` (screenshot script, input prep, agent runner, flow descriptions)
- Screenshots cited above: `docs/factory/notes/landing-audit-shots/` (7 PNG slices); the other 169 slices were not kept.
