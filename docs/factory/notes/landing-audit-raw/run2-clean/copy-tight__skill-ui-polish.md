<!-- skill: copy-tight | input: skill-ui-polish | turns: 3 | cost_usd: 0.122 | permission_denials: 0 | is_error: False -->

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
h1	ui-polish
span	Version
li	ui
li	design
li	css
li	polish
span	For:
span	Developer
span	QA auditor
p	Tested by a real agent: 12 of 12 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	Final polish pass on finished UI code: spacing, type, contrast, hierarchy and states.
h2	What it does
li	Intent: confirm the goal and the defined terms.
li	Context: the pasted code is the source; find the token file, if any.
li	Inputs: code is required; ask when it is missing.
li	Flow: inventory, check each rule, fix with tokens or default scales, run the contrast script, rebuild the code.
li	Rules: the MUST / NEVER rules by id.
li	States and edge cases: no code, new design, text rewrite, already polished, frameworks, token edge cases.
li	Checks: text kept, numbers on scale, contrast, states, token names, format.
li	Output: the exact reply format and its quality bar.
li	Handoff: what the reader receives.
li	Evidence: what to keep as proof.
p	Paste this line after installing the skill.
h2	What you type
span	Copy
p	The agent returns these files and a short report.
h2	What you get
li	Numbered fixes, each tied to a rule
li	Contrast table with ratios
li	Full polished code with every word kept
h3	What a real agent produced
p	A fresh agent had only this skill, in an empty project, and the request below. Its answer, word for word.
span	Request
span	Copy the answer
h3	Files in the package
p	Machines check structure; a reviewer checks the rest.
h2	How you know
p	5 of 25 rules machine-checked
dt	Rules in total
dd	25
dt	Machine-checked
dd	5
dt	Reviewer checklist
dd	20
h3	Changelog
h4	1.0.0 - 2026-11-15
li	First version: a final polish pass on finished UI code, with numbered fixes tied to rules R-ui-polish-1 to R-ui-polish-19 and the full polished code.
li	Fixed numeric scales for spacing, type, line-height, weight, radius, width and target size; a contrast formula and table in references.
li	Keeps every word of text, every element and every brand hue; works in plain CSS, JSX and utility classes without converting between them.
li	Exact sentences for no code, a new-design request and a text-rewrite request.
li	Eval case `text-rewrite-declined` expected 2.85:1, the ratio on white; the banner background is #f9fafb, so the right ratio is 2.73:1. The first real recording found the case was wrong.
li	Routing: the description now mentions token files and design-system as the neighbour; two routing cases added (`r-uip-1`, `r-uip-2`).
li	Recipe `tokens-then-polish` (design-system, then ui-polish) in `src/factory/recipes.json`, recorded by a real agent.
h2	Download
a	Download ui-polish 1.0.0 (.zip, 31 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the skill .zip and check its SHA-256 against checksums.json.
li	Unzip it into your project at .claude/skills/ so the folder keeps its name.
li	Restart Claude Code so it loads the skill.
p	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ in your current folder.
h2	Banner to share
p	Drawn from the real output above, with the install command. It updates when the skill is recorded again.
img[alt]	ui-polish 1.0.0: Final polish pass on finished UI code: spacing, type, contrast, hierarchy and states.
span	Download SVG
p	Skill Foundry. Static site generated from the skill registry.

What changed:
- Cut filler
- Simpler wording
- Active voice
- No change needed for the other strings
