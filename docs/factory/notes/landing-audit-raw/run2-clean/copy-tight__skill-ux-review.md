<!-- skill: copy-tight | input: skill-ux-review | turns: 5 | cost_usd: 0.131 | permission_denials: 0 | is_error: False -->

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
h1	ux-review
span	Version
li	ux
li	usability
li	review
li	qa
li	analysis
span	For:
span	Business analyst
span	QA auditor
p	Tested by a real agent: 11 of 11 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	Reviews a screen or flow and lists usability findings with a rule, a severity and a fix.
h2	What it does
li	Intent: the goal and the defined terms.
li	Context: the input is the only source; an optional design-token file.
li	Inputs: code or a flow description required; asks if missing.
li	Flow: inventory, check each rule, write findings, set severity, order.
li	Rules: the MUST / NEVER rules by id.
li	States and edge cases: nothing to review, fix request, new design, out-of-scope checks, no findings.
li	Checks: evidence search, counts, format, reviewer answers.
li	Output: the exact reply format and its quality bar.
li	Handoff: what the reader receives.
li	Evidence: what to keep as proof.
p	Paste this line after installing the skill.
h2	What you type
span	Copy
p	The agent hands back these files and a short report.
h2	What you get
li	Numbered usability findings with place, evidence, rule id, severity and recommendation
li	Open questions for what the input does not show
h3	What a real agent produced
p	A fresh agent got only this skill, in an empty project, and the request below. Its answer, word for word.
span	Request
span	Copy the answer
h3	Files in the package
p	Machine checks cover structure; a reviewer covers the rest.
h2	How you know
p	4 of 25 rules machine-checked
dt	Rules in total
dd	25
dt	Machine-checked
dd	4
dt	Reviewer checklist
dd	21
h3	Changelog
h4	1.0.0 - 2026-11-15
li	First version: a numbered list of usability findings for an existing screen or flow, from its code, a step-by-step description, or both.
li	Fixed four-level severity scale (S1 Blocker, S2 Major, S3 Minor, S4 Note) set by ordered yes or no questions.
li	Every finding quotes evidence from the input; what the input does not show becomes an open question.
li	Fixed sentences for: nothing to review, a request to fix code, a request to design a new screen, a request to rewrite text, a request for contrast or ARIA checks.
li	After reading the first recorded answers: evidence is plain text with no backticks; a missing thing gets its own "Shown absent:" line; at most 8 open questions, none about code correctness. Every case was recorded again with fresh agents.
li	Ten core layers written as numbered clauses with defined terms; conduct rules R-ux-review-14 to R-ux-review-25 in RULES.json.
h2	Download
a	Download ux-review 1.0.0 (.zip, 22 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the skill .zip and check its SHA-256 against checksums.json.
li	Unzip it into .claude/skills/ in your project, keeping the folder name.
li	Restart Claude Code to load the skill.
p	Or copy one command: it downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ where you run it.
h2	Banner to share
p	Drawn from the real output above, with the install command. Updates when the skill is recorded again.
img[alt]	ux-review 1.0.0: Reviews a screen or flow and lists usability findings with a rule, a severity and a fix.
span	Download SVG
p	Skill Foundry. Static site built from the skill registry.

What changed:
- Cut filler
- Active voice and plainer verbs
- Kept every number, name and capital letter
- Changelog entries returned as they were
- No change needed for the other lines
