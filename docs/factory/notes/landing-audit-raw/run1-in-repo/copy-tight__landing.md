<!-- skill: copy-tight | input: landing | turns: 10 | cost_usd: 0.342 | permission_denials: 1 | is_error: False -->

```
Rewritten copy:
span	Skip to content
a	Skill Foundry
span	Collection
span	Install
span	For agents
span	Proof
span	Switch to dark theme
span	អានជាភាសាខ្មែរ
h1	One line in. A skill out.
p	Type one plain request and a skill turns it into checked, finished work.
label	Find a skill
input[placeholder]	Search by task, name or tag
div[aria-label]	Agent role
span	All roles
span	Product owner / architect
span	Business analyst
span	Developer
span	QA auditor
p	10 of 10 skills shown
p	You type
span	Real agent output
div[aria-label]	Pick a skill
button	a11y-audit
button	changelog-writer
button	Copy Tight
button	design-system
button	figure-craft
button	skill-smith
button	spec-writer
button	test-planner
button	ui-polish
button	ux-review
h2	Ready skills
span	No. 01
li	accessibility
li	a11y
li	wcag
li	aria
li	qa
a	a11y-audit
p	You type:
p	You get: Numbered findings: element, rule id, WCAG 2.2 criterion, who is affected, diff fix, Manual tests that need assistive technology
span	For:
p	Tested by a real agent: 13 of 13 cases pass
p	4 of 16 rules machine-checked
span	Copy install command
a	Download a11y-audit 1.0.0 (.zip, 34 KB)
span	No. 02
li	changelog
li	semver
li	release
a	changelog-writer
p	You get: One CHANGELOG entry, Chosen version bump with reason, Version mismatch list
p	Tested by a real agent: 8 of 8 cases pass
p	3 of 11 rules machine-checked
a	Download changelog-writer 1.0.0 (.zip, 15 KB)
span	No. 03
li	ux-writing
li	copy
li	ui
a	Copy Tight
p	You get: Rewritten copy, Short list of what changed
p	2 of 9 rules machine-checked
a	Download copy-tight 0.2.0 (.zip, 12 KB)
span	No. 04
li	design
li	tokens
li	css
li	color
li	dark mode
a	design-system
p	You get: design-tokens.json in the W3C format, tokens.css with light and dark mode, Report with every contrast ratio
p	Tested by a real agent: 11 of 11 cases pass
p	4 of 18 rules machine-checked
a	Download design-system 1.0.0 (.zip, 38 KB)
span	No. 05
li	diagram
li	isometric
li	svg
li	explainer
li	motion
a	figure-craft
p	You get: Self-contained HTML page: an object you can open, turn and hover, plus the SVG, Lint result for L1 to L19, Checklist outcome, Short report
p	Tested by a real agent: 3 of 3 cases pass
p	21 of 33 rules machine-checked
a	Download figure-craft 1.0.0 (.zip, 330 KB)
span	No. 06
li	meta
li	factory
li	authoring
a	skill-smith
p	You get: Skill folder under src/skills/<name>/, Zip in dist/, Registry entry, Short report
p	11 of 13 rules machine-checked
a	Download skill-smith 1.0.0 (.zip, 9 KB)
span	No. 07
li	ba
li	acceptance-criteria
li	given-when-then
li	spec
a	spec-writer
p	You get: Acceptance criteria AC-1 to AC-N with source phrases, Open questions for the Product Owner, Out of scope
p	Tested by a real agent: 12 of 12 cases pass
p	4 of 15 rules machine-checked
a	Download spec-writer 1.0.0 (.zip, 21 KB)
span	No. 08
li	regression
li	testing
li	checklist
a	test-planner
p	You get: Numbered regression checklist grouped by area, Possible impact and open questions
p	Tested by a real agent: 9 of 9 cases pass
p	5 of 14 rules machine-checked
a	Download test-planner 1.0.0 (.zip, 15 KB)
span	No. 09
li	polish
a	ui-polish
p	You get: Numbered fixes, each tied to a rule, Contrast table with ratios, Full polished code with every word kept
p	5 of 25 rules machine-checked
a	Download ui-polish 1.0.0 (.zip, 31 KB)
span	No. 10
li	ux
li	usability
li	review
li	analysis
a	ux-review
p	You get: Numbered usability findings with place, evidence, rule id, severity and recommendation, Open questions for what the input does not show
p	4 of 25 rules machine-checked
a	Download ux-review 1.0.0 (.zip, 22 KB)
p	No skill matches. Clear the search or pick another role.
h2	Skills working together
p	One request, several skills. A fresh agent with them installed in an empty project used them in the order shown. Its answer, word for word:
h3	Ship a change: retest, release note, error copy
span	Skills used, in order
span	→
span	Request
span	Copy the answer
h3	Make the design tokens, then polish a finished screen with them
h3	Spec a story, then plan the retest of a change
h2	Install a skill
li	Download the skill .zip and check its SHA-256 against checksums.json.
li	Unzip it into your project at .claude/skills/ so the folder keeps its name.
li	Restart Claude Code so it loads the skill.
span	Copy
p	Install all skills or one role's skills, find outdated or changed ones, update them (your edits are kept), or remove one cleanly.
p	Or copy one command: it downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ in the current folder.
a	Download all skills (.zip, 525 KB)
span	checksums.json
h2	For agents
p	An agent can read every ready skill (roles, version, download link, SHA-256) from one file instead of this page.
span	skills.json (machine index)
span	llms.txt (plain text)
h3	Give this to your agent
span	Copy agent prompt
h2	Proof: every ready skill is tested by real agents
p	A skill is listed only if it passes these checks. The numbers come from recorded runs, not claims.
li	Lint: files, rules, preview and changelog meet the standard
li	Evals: example answers meet each case
li	Real agent: a fresh agent with only the skill does the task
li	Routing: an agent picks the right skill from its description
li	Browser: pages render at 1440 and 390 wide, light and dark
li	Review: a person ticks the checklist rules
li	Release: version, changelog, zip and SHA-256 match
th	Skill
th	Real-agent cases
th	Rules machine-checked
td	13 / 13
td	4 / 16
td	8 / 8
td	3 / 11
a	copy-tight
td	2 / 9
td	11 / 11
td	4 / 18
td	3 / 3
td	21 / 33
td	11 / 13
td	12 / 12
td	4 / 15
td	9 / 9
td	5 / 14
td	5 / 25
td	4 / 25
h2	How a skill is made
li	Interview the goal: who uses it, what triggers it, what it must produce.
li	Write the intent and list each rule as one plain sentence.
li	Map every rule to a machine check or a reviewer checklist item.
li	Add examples, evals and a cover, then run the linter and evals.
li	Review, pack into a zip with a SHA-256 checksum, and register it.
h2	Limits
p	A skill guides an agent; it does not guarantee the result. Review the output.
p	Machine checks cover structure. Checklist rules need a human reviewer.
p	Only ready skills are listed here. Drafts are not published.
p	Skill Foundry. Static site generated from the skill registry.

What changed:
- Cut filler
- Shorter headings, intros
- Button label: verb first
- Kept numbers, names, paths, commands exactly
- Legal text is returned unchanged.
```

I rewrote 9 of the 193 strings, on lines 21, 131, 137, 144, 145, 149, 153 and 155. Everything else was already short and plain, so I left it as it was.

I kept the three lines under the "Limits" heading (190–192) exactly as written. They read as a disclaimer, and the skill never rewrites legal or disclaimer text. They're also already short.

The output above isn't saved to a file. Tell me if you want it written over `ui-strings.txt` or saved as a separate file.
