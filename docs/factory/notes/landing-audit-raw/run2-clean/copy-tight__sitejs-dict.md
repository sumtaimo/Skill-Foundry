<!-- skill: copy-tight | input: sitejs-dict | turns: 6 | cost_usd: 0.16 | permission_denials: 0 | is_error: False -->

Rewritten copy:
skip	Skip to content
nav.collection	Collection
theme.toDark	Switch to dark theme
theme.toLight	Switch to light theme
lang.toKh	អានជាភាសាខ្មែរ
lang.toEn	Read in English
download.allLabel	Download all skills (.zip, {size})
example.open	Open the example on its own page
hero.title	One line in. A skill out.
hero.sub	Type a plain request. A skill turns it into checked work.
hero.label	You type
hero.chips	Pick a skill
plate.type	You type:
plate.get	You get:
meter.text	{m} of {t} rules machine-checked
download.label	Download {name} {version} (.zip, {size})
q.nav	Questions
q.does	What it does
q.type	What you type
q.get	What you get
q.know	How you know
take.type	Paste this line after installing the skill.
take.get	The agent returns these files and a short report.
take.know	Machine checks cover structure and a reviewer covers the rest.
collection.title	Ready skills
copy.copy	Copy
copy.done	Copied
copy.fail	Copy failed
made.title	How a skill is made
made.s1	Interview the goal: who uses it, what triggers it, what it must produce.
made.s2	Write the intent and list each rule as one plain sentence.
made.s3	Map every rule to a machine check or a reviewer checklist item.
made.s4	Add examples, evals and a cover, then run the linter and evals.
made.s5	Review, pack into a zip with a SHA-256 checksum, and register it.
install.title	Install a skill
install.s1	Download the skill .zip and check its SHA-256 against checksums.json.
install.s2	Unzip it into .claude/skills/ in your project, keeping the folder name.
install.s3	Restart Claude Code so it loads the skill.
limits.title	Limits
limits.p1	A skill guides an agent; it does not guarantee the result. Review the output.
limits.p2	Machine checks cover structure. Checklist rules need a human reviewer.
limits.p3	Only ready skills are listed. Drafts are not published.
rules.total	Rules in total
rules.machine	Machine-checked
rules.checklist	Reviewer checklist
skill.files	Files in the package
skill.download	Download
download.size	Size
download.sha	SHA-256
download.checksums	checksums.json
skill.install	Install
skill.changelog	Changelog
skill.example	Example
cover.real	Real output from an agent
cover.concept	Concept drawing, not real output
answer.title	What a real agent produced
answer.note.portable	A fresh agent had only this skill, in an empty project, and the request below. Its answer, word for word.
answer.note.live	A fresh agent had only this skill and the request below. Its answer, word for word.
answer.asked	Request
answer.more	continues on the page
tokens.title	Colours from the real tokens.css
tokens.note	Colours are read from the tokens.css a fresh agent wrote in a recorded run, in light and dark mode. None is typed by hand.
answer.copy	Copy the answer
banner.title	Banner to share
banner.note	Drawn from the real output above, with the install command. Updates when the skill is recorded again.
banner.svg	Download SVG
banner.png	Download PNG
recipe.title	Skills working together
recipe.note	One request, several skills. A fresh agent had them in an empty project and used them in the order shown. Its answer, word for word.
recipe.used	Skills used, in order
example.note	Shown in a sandboxed frame.
run.title	Recorded real run
run.note	An agent followed this skill on the prompt above. Its output, unedited.
ref.title	Reference figure
ref.note	The figure the skill ships as its detail target. An agent reproduced it exactly from the prompt above.
back	All skills
version	Version
footer	Skill Foundry. Static site generated from the skill registry.
find.label	Find a skill
find.placeholder	Search by task, name or tag
find.count	{n} of {t} skills shown
find.none	No skill matches. Clear the search or pick another role.
role.label	Agent role
role.all	All roles
role.PO_ARCHITECT	Product owner / architect
role.BA_ANALYST	Business analyst
role.DEV_ENGINEER	Developer
role.QA_AUDITOR	QA auditor
plate.roles	For:
live.yes	Tested by a real agent: {p} of {t} cases pass
live.no	Not yet tested by a real agent
install.copy	Copy install command
install.npx	Fastest: run one command in your project (needs Node.js and git). It installs the skill into .claude/skills/ and, if the project has an agentic harness, gives it to the matching roles. It also tells agents to use the skills and not edit or update them; only you update.
install.npx.more	Install all skills or those for one role, check for outdated or changed skills, update them (your changed files are kept), or remove one cleanly.
install.cmd	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ where you run it.
agents.title	For agents
agents.p	An agent can read every ready skill, with roles, version, download link and SHA-256, from one file instead.
agents.json	skills.json (machine index)
agents.txt	llms.txt (plain text)
nav.install	Install
nav.agents	For agents
nav.proof	Proof
agents.promptLabel	Give this to your agent
agents.prompt	Read {site}llms.txt. Pick the skill that fits my task, run its install command here (replace {base} with {site}), then use it.
proof.title	Proof: every ready skill is tested by real agents
proof.p	A skill is listed only if it passes these checks. Numbers come from recorded runs, not claims.
proof.l1	Lint: files, rules, preview and changelog meet the standard
proof.l2	Evals: example answers meet each case
proof.l3	Real agent: a fresh agent with only the skill does the task
proof.l4	Routing: an agent picks the right skill from its description
proof.l5	Browser: pages render at 1440 and 390 wide, light and dark
proof.l6	Review: a person ticks the checklist rules
proof.l7	Release: version, changelog, zip and SHA-256 match
proof.skill	Skill
proof.real	Real-agent cases
proof.rules	Rules machine-checked
proof.notyet	not yet
agents.copyPrompt	Copy prompt for your agent

What changed:
- Cut filler and repeated framing in notes and descriptions
- Shorter phrasing and plainer verbs
- Merged two-step sentences into one
- Kept every placeholder, number, file name and product name
- Left short, plain strings as they were
