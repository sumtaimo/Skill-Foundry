<!-- skill: copy-tight | input: skill-design-system | turns: 8 | cost_usd: 0.127 | permission_denials: 1 | is_error: False -->

Rewritten copy:
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
h1	design-system
span	Version
li	design
li	tokens
li	css
li	color
li	dark mode
span	For:
span	Developer
span	Business analyst
p	Tested by a real agent: 11 of 11 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	One design-token set from a hex, a style or your tokens: light, dark, contrast-checked.
h2	What it does
li	Intent: find the path (colour, style or existing system) and the defined terms.
li	Context: look for an existing design system in the project.
li	Inputs: colours with roles, archetype, font, product name; ask when nothing is given.
li	Flow: run the engine, or build by hand from the references when it cannot run.
li	Rules: the MUST / NEVER rules by id.
li	States and edge cases: no input, a screen request, "like a brand", many colours, existing files.
li	Checks: hue kept, every pair's ratio, files, no external links.
li	Output: the three files, the reply and the quality bar.
li	Handoff: how the user loads the tokens and what to use next.
li	Evidence: what to keep as proof.
p	Paste this line after installing the skill.
h2	What you type
span	Copy
p	The agent returns these files and a short report.
h2	What you get
li	design-tokens.json in the W3C format
li	tokens.css with light and dark mode
li	Report with every contrast ratio
h3	Colours from the real tokens.css
p	Every colour comes from the tokens.css a fresh agent wrote in a recorded run, in light and dark mode. None is typed by hand.
span	Request
h3	What a real agent produced
p	A fresh agent had only this skill, in an empty project, and the request below. Its answer, word for word.
span	Copy the answer
h3	Files in the package
p	Machines check structure; a reviewer checks the rest.
h2	How you know
p	4 of 18 rules machine-checked
dt	Rules in total
dd	18
dt	Machine-checked
dd	4
dt	Reviewer checklist
dd	14
h3	Changelog
h4	1.0.0 - 2026-11-15
li	(lines 66–72 unchanged: changelog entries)
h2	Download
a	Download design-system 1.0.0 (.zip, 38 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the skill .zip and check its SHA-256 against checksums.json.
li	Unzip it into .claude/skills/ in your project; keep the folder name.
li	Restart Claude Code to load the skill.
p	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ in your current folder.
h2	Banner to share
p	Drawn from the real output above, with the install command. Updates when the skill is recorded again.
img[alt]	design-system 1.0.0: One design-token set from a hex, a style or your tokens: light, dark, contrast-checked.
span	Download SVG
p	Skill Foundry. Static site generated from the skill registry.
```

What changed:
- Cut filler
- Plainer verbs
- Split one long sentence in two
- Kept every number, name, file name and capital letter
- No change needed for the other ~70 strings, which were already short

Notes:
- Lines 66–72 (the changelog entries) are not rewritten, because this skill doesn't cover changelog entries. Use changelog-writer for those. I abbreviated them in the list above, so keep the original text for those lines.
- I haven't edited any files. The list above is the full set in the original order.
