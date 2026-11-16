<!-- skill: copy-tight | input: skill-test-planner | turns: 9 | cost_usd: 0.131 | permission_denials: 1 | is_error: False -->

Rewritten copy (original order, `element<TAB>text`). I left short, plain strings as they were. I also left the changelog entries (lines 60–69) unchanged, since the skill doesn't cover changelog text.

```
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
p	Tested by a real agent: 9 of 9 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	Turns a change description or diff into a regression checklist grouped by area.
h2	What it does
li	Intent: the goal and what proves success.
li	Context: only the change text sets areas and behaviour.
li	Inputs: change text required; asks if missing.
li	Flow: areas, behaviour changes, items with source phrases, numbering.
li	Rules: the MUST / NEVER rules by id.
li	States and edge cases: empty, vague, diff only, conflicting input.
li	Checks: source phrase match, numbering, format, reviewer answers.
li	Output: checklist format and quality bar.
li	Handoff: what the reader gets, and open items.
li	Evidence: what to keep as proof.
p	Paste this line after installing the skill.
h2	What you type
span	Copy
p	The agent returns these files and a short report.
h2	What you get
li	Numbered regression checklist grouped by area
li	Possible impact and open questions
h3	What a real agent produced
p	A fresh agent in an empty project had only this skill and the request below. Its answer, word for word.
span	Request
span	Copy the answer
h3	Files in the package
p	Machines check structure; a reviewer checks the rest.
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
li	(lines 62–69 unchanged)
h2	Download
a	Download test-planner 1.0.0 (.zip, 15 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the .zip; check its SHA-256 against checksums.json.
li	Unzip into .claude/skills/ in your project; keep the folder name.
li	Restart Claude Code to load the skill.
p	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ where you run it.
h2	Banner to share
p	Drawn from the real output above, with the install command. Updates when the skill is re-recorded.
img[alt]	test-planner 1.0.0: Turns a change description or diff into a regression checklist grouped by area.
span	Download SVG
p	Skill Foundry. Static site generated from the skill registry.
```

What changed:
- Cut filler
- Shortened the long list items and install steps
- Plainer wording
- Kept all numbers, names, file names and capitals
- No change needed for the other strings
