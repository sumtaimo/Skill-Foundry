<!-- skill: copy-tight | input: skill-a11y-audit | turns: 10 | cost_usd: 0.254 | permission_denials: 1 | is_error: False -->

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
h1	a11y-audit
span	Version
li	accessibility
li	a11y
li	wcag
li	aria
li	qa
span	For:
span	QA auditor
span	Developer
p	Tested by a real agent: 13 of 13 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	Audits pasted HTML or JSX for what users cannot see; each fix is a small code change.
h2	What it does
li	Intent: confirm the goal and the defined terms.
li	Context: the pasted code is the only source.
li	Inputs: code is required; ask when it is missing.
li	Flow: run the script, check each finding, write the fixes.
li	Rules: the MUST / NEVER rules by id.
li	States and edge cases: no code, boundary requests, fragments, JSX, clean code.
li	Checks: element in input, numbers, boundary, format.
li	Output: the exact reply format and its quality bar.
li	Handoff: what the reader receives.
li	Evidence: what to keep as proof.
p	Paste this one line after you install the skill.
h2	What you type
span	Copy
p	The agent hands back these files and a short report.
h2	What you get
li	Numbered findings: element, rule id, WCAG 2.2 criterion, who is affected, diff fix
li	Manual tests that need assistive technology
h3	What a real agent produced
p	A fresh agent in an empty project, with only this skill installed, answered the request below. Here is its answer, word for word.
span	Request
span	Copy the answer
h3	Files in the package
p	Machine checks cover structure and a reviewer covers the rest.
h2	How you know
p	4 of 16 rules machine-checked
dt	Rules in total
dd	16
dt	Machine-checked
dd	4
dt	Reviewer checklist
dd	12
h3	Changelog
h4	1.0.0 - 2026-11-15
li	First version: audits pasted HTML or JSX for what users cannot see and returns numbered findings, each with the element, a rule id, the WCAG 2.2 success criterion and level, who is affected and the fix as a diff.
li	Ten core layers written as defined terms and numbered clauses; rules R-a11y-audit-1 to R-a11y-audit-16 in RULES.json.
h2	Download
a	Download a11y-audit 1.0.0 (.zip, 34 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the skill .zip and check its SHA-256 against checksums.json.
li	Unzip it into your project at .claude/skills/ so the folder keeps its name.
li	Restart Claude Code to load the skill.
p	Or copy one command that downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ in the folder where you run it.
h2	Banner to share
p	Made from the real output above, plus the install command. It updates when the skill is re-recorded.
img[alt]	a11y-audit 1.0.0: Audits pasted HTML or JSX for what users cannot see; each fix is a small code change.
span	Download SVG
p	Skill Foundry. Static site generated from the skill registry.

What changed:
- Rewrote 4 strings (lines 48, 72, 73, 75); the other 74 were already short and plain, so I left them as they were.
- Merged sentences and cut repeats.
- Used plainer, more direct verbs.
- Kept every number, version, path, file name and product name exactly, with the same capitals.
- I didn't touch the two changelog entries (lines 63–64), because this skill doesn't cover changelogs. The image alt text (line 76) still matches the tagline.
