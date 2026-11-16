<!-- skill: copy-tight | input: skill-copy-tight | turns: 6 | cost_usd: 0.128 | permission_denials: 0 | is_error: False -->

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
h1	Copy Tight
span	Version
li	ux-writing
li	copy
li	ui
span	For:
span	Business analyst
span	Developer
p	Tested by a real agent: 8 of 8 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	Short, plain UI copy that keeps meaning, numbers, names and legal text intact.
h2	What it does
li	Intent: find the goal and the copy to rewrite.
li	Context: list every number, name, product term and legal phrase.
li	Inputs: what is required and what to do when it is missing.
li	Flow: cut, plain words, fit the UI job, compare.
li	Rules: the MUST / NEVER rules by id.
li	States: legal, mixed, already tight, placeholders.
li	Checks: numbers, names, filler, legal, change list.
li	Output: the exact answer format.
li	Handoff: what the user receives and open items.
li	Evidence: what to keep as proof.
p	Paste this line after installing the skill.
h2	What you type
span	Copy
p	The agent returns these files and a short report.
h2	What you get
li	Rewritten copy
li	Short list of what changed
h3	What a real agent produced
p	A fresh agent got only this skill, in an empty project, and the request below. Its answer, word for word.
span	Request
span	Copy the answer
h3	Files in the package
p	Machines check structure; a reviewer checks the rest.
h2	How you know
p	2 of 9 rules machine-checked
dt	Rules in total
dd	9
dt	Machine-checked
dd	2
dt	Reviewer checklist
dd	7
h3	Changelog
h4	0.2.0 - 2026-11-14
li	Migrate to the ten-layer standard: layers/01-intent.md to layers/10-evidence.md, linked from SKILL.md; behaviour and description unchanged.
li	Four new eval cases for the layer 06 edge cases: mixed legal copy, placeholders, already tight copy, unreachable length limit.
li	Fix: a real agent quoted removed words in the change list ("currently", "for you"); layer 04 now shows a wrong and a right bullet and layer 07 searches each bullet for removed words.
li	Fix: fixed bullet `- Length limit was not met; meaning kept.` so the unmet limit is always stated the same way.
li	Self-contained: the review checklist moved into references/checklist.md; no repository paths left in SKILL.md, layers or references.
li	Fix: keep names with their exact capital letters (a real agent wrote "checkout" for "Checkout").
li	Add a fixed note for legal text and a rule that the change list never quotes removed words.
li	Add exclusions to the description and list the rules in SKILL.md.
h4	0.1.0 - 2026-11-14
li	First version, built by a real agent with skill-smith: rewrite UI copy short and plain.
h2	Download
a	Download copy-tight 0.2.0 (.zip, 12 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the skill .zip and check its SHA-256 against checksums.json.
li	Unzip into .claude/skills/ in your project; keep the folder name.
li	Restart Claude Code to load the skill.
p	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ in the current folder.
h2	Banner to share
p	Drawn from the real output above, with the install command. Updates when the skill is recorded again.
img[alt]	Copy Tight 0.2.0: Short, plain UI copy that keeps meaning, numbers, names and legal text intact.
span	Download SVG
p	Skill Foundry. Static site generated from the skill registry.

What changed:
- Cut filler
- Plainer verbs
- Kept every number, name and file path
- Left changelog entries and already-short strings as they were
