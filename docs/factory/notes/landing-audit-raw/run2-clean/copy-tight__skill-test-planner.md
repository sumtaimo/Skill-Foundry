<!-- skill: copy-tight | input: skill-test-planner | turns: 5 | cost_usd: 0.131 | permission_denials: 0 | is_error: False -->

Rewritten copy:
span	Skip to content
a	Skill Foundry
span	Collection
span	Install
span	For agents
span	Proof
span	Switch to dark theme
span	អានជាភាសាខ្មែរ
span	All skills
span	Real output from an agent
h1	test-planner
span	Version
li	qa
li	regression
li	testing
li	checklist
span	For:
span	Business analyst
span	QA auditor
p	Agent-tested: 9 of 9 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	Turns a change description or diff into a regression checklist grouped by area.
h2	What it does
li	Intent: confirm the goal and what proves success.
li	Context: only the change text names areas and behaviour.
li	Inputs: change text is required; ask if missing.
li	Flow: areas, behaviour changes, items with source phrases, numbering.
li	Rules: the MUST / NEVER rules by id.
li	States and edge cases: empty, vague, diff only, conflicting input.
li	Checks: source phrase match, numbering, format, reviewer answers.
li	Output: checklist format and quality bar.
li	Handoff: what the reader gets and open items.
li	Evidence: what to keep as proof.
p	After installing, paste this line.
h2	What you type
span	Copy
p	The agent returns these files and a short report.
h2	What you get
li	Numbered regression checklist grouped by area
li	Possible impact and open questions
h3	What a real agent produced
p	A fresh agent had only this skill, in an empty project, and the request below. Its answer, word for word.
span	Request
span	Copy the answer
h3	Files in the package
p	Machine checks cover structure; a reviewer covers the rest.
h2	How you know
p	5 of 14 rules machine-checked
dt	Rules in total
dd	14
dt	Machine-checked
dd	5
dt	Reviewer checklist
dd	9
h3	Changelog
h4	1.0.0 - 2026-11-14
li	First version: a numbered regression checklist grouped by area, built only from the change description or diff.
li	Ten core layers; rules R-test-planner-1 to R-test-planner-14 in RULES.json.
li	Asks for the change when it is missing; never adds features the change does not name.
li	Diff input: area headings use the shared name in the changed lines (for example `cart`), never one heading per identifier.
li	Out-of-scope requests (test code, bug review) get one fixed sentence, then the checklist when a change text exists.
li	Area means a screen, feature or service; fields and messages are items inside it. Layer 03 separates "nothing given" from "title only", each with an exact reply.
li	Eval case `checkout-promo-description` expects `### footer` in lower case because the change text writes it that way (rule 4: exact names); the first recording showed the case was wrong on that point.
li	One item per stated result: no second item from the same source phrase to test a result the phrase does not state; that gap is an open question. Found by reading the recorded answers (two items on one phrase, one of them guessed).
h2	Download
a	Download test-planner 1.0.0 (.zip, 15 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the .zip and check its SHA-256 against checksums.json.
li	Unzip into .claude/skills/ in your project; keep the folder name.
li	Restart Claude Code to load the skill.
p	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ where you run it.
h2	Banner to share
p	Drawn from the real output above, with the install command. Updates when the skill is recorded again.
img[alt]	test-planner 1.0.0: Turns a change description or diff into a regression checklist grouped by area.
span	Download SVG
p	Skill Foundry. Static site generated from the skill registry.

What changed:
- Cut filler
- Plainer words
- Left already short strings unchanged
- Left changelog entries unchanged
- Kept names, numbers, file names and product terms exactly
