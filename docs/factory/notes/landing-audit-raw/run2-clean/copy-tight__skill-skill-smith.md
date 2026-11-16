<!-- skill: copy-tight | input: skill-skill-smith | turns: 3 | cost_usd: 0.116 | permission_denials: 0 | is_error: False -->

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
h1	skill-smith
span	Version
li	meta
li	factory
li	authoring
span	For:
span	Product owner / architect
span	Developer
p	Tested by a real agent: 3 of 3 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	Build a new skill that passes the linter, evals and review.
h2	What it does
li	Intent: interview the goal of the new skill.
li	Context: what the factory already has.
li	Inputs: what must be known before writing.
li	Flow: write the skill, layer by layer.
li	Rules: what every skill must satisfy.
li	States and edge cases.
li	Checks: lint, evals, review.
li	Output: the skill folder and its recorded run.
li	Handoff: pack and register.
li	Evidence: the report.
p	Paste this line after installing the skill.
h2	What you type
span	Copy
p	You get these files and a short report.
h2	What you get
li	Skill folder under src/skills/<name>/
li	Zip in dist/
li	Registry entry
li	Short report
h3	What a real agent produced
p	A fresh agent had only this skill and the request below. Its answer, word for word.
span	Request
span	Copy the answer
h3	Files in the package
p	Machines check structure; a reviewer checks the rest.
h2	How you know
p	11 of 13 rules machine-checked
dt	Rules in total
dd	13
dt	Machine-checked
dd	11
dt	Reviewer checklist
dd	2
h3	Changelog
h4	1.0.0 - 2026-11-14
p	The version stays 1.0.0 until the owner calls it final. Changes are listed as they land.
li	Ten-step procedure from interview to report, as ten layer files; rules mapped to the factory linter.
li	New skills are written as layers, start from the user's goal, are self-contained and need a recorded real run.
li	Live eval step: each case is run by a fresh agent and recorded before review.
li	`scope: factory`: this skill itself runs inside the Skill Foundry repository.
li	Versions of new skills stay at their first number until the owner calls a version final.
li	Replies report safety checks in words, never by quoting forbidden markup, so the reply stays clean under text checks (SKILL.md Review, layers 04 and 10).
h2	Download
a	Download skill-smith 1.0.0 (.zip, 9 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the skill .zip and check its SHA-256 against checksums.json.
li	Unzip it into your project at .claude/skills/ so the folder keeps its name.
li	Restart Claude Code so it loads the skill.
p	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ in the current folder.
h2	Banner to share
p	Drawn from the real output above, with the install command. It updates when the skill is recorded again.
img[alt]	skill-smith 1.0.0: Build a new skill that passes the linter, evals and review.
span	Download SVG
p	Skill Foundry. Static site generated from the skill registry.

What changed:
- Cut filler
- Plainer words
- Active voice
- No change needed for the other strings
- Changelog entries returned unchanged
