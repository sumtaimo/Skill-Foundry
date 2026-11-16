<!-- skill: copy-tight | input: skill-changelog-writer | turns: 3 | cost_usd: 0.294 | permission_denials: 0 | is_error: False -->

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
span	Real agent output
h1	changelog-writer
span	Version
li	changelog
li	semver
li	release
span	For:
span	Developer
span	QA auditor
p	Tested by a real agent: 8 of 8 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	Turn merged changes into a correct CHANGELOG entry and semver bump.
h2	What it does
li	Intent: restate the request and decide write or check.
li	Context: read the existing CHANGELOG and every place the version is recorded.
li	Inputs: skill or project, current version ("we are at X" is current), date and changes; ask for what's missing.
li	Flow: sort the changes, choose the bump, write the heading and bullets.
li	Rules: R-changelog-writer-1 to 6, 10 and 11.
li	States and edge cases: missing input, no CHANGELOG, mixed types, check task.
li	Checks: heading, bump, bullets, facts, version match.
li	Output: entry, bump with reason, mismatches.
li	Handoff: where to paste it and which files to update.
li	Evidence: inputs, files read, check results.
p	Paste this line after installing the skill.
h2	What you type
span	Copy
p	The agent returns these files and a short report.
h2	What you get
li	One CHANGELOG entry
li	Version bump with reason
li	Version mismatch list
h3	What a real agent produced
p	A fresh agent got only this skill, in an empty project, and the request below. Its answer, word for word:
span	Request
span	Copy answer
h3	Files in the package
p	Machine checks cover structure and a reviewer covers the rest.
h2	How you know
p	3 of 11 rules machine-checked
dt	Rules in total
dd	11
dt	Machine-checked
dd	3
dt	Reviewer checklist
dd	8
h3	Changelog
h4	1.0.0 - 2026-11-14
li	First release: nine-step procedure, six rules, bump table and three worked examples.
li	Move the procedure into the ten core layers (`layers/01-intent.md` to `layers/10-evidence.md`) and link them from SKILL.md.
li	Make the skill self-contained: the format rules now live in `references/README.md`, and the version check covers any registry or manifest.
li	Add rule R-changelog-writer-10: the entry and the reply follow the language of the request.
li	Add rule R-changelog-writer-11: a bullet adds no fact or qualifier the input does not contain.
li	Add eval cases `english-request-english-entry` and `no-added-qualifier`; keep normal replies at most fifteen lines.
li	Read "we are at X", "is at X" and "currently X" as the current version, so the heading is X bumped; never invent a previous version; ask one question when the version is ambiguous ("version X is ready").
li	Write the entry even when the target changelog is unclear, and ask where to paste it; still ask for the target and current version when neither is given.
li	Add eval cases `we-are-at-current-version` and `ambiguous-version-asks`.
li	Below 1.0.0, bump a breaking change as MINOR (`0.9.4` → `0.10.0`); move to `1.0.0` only when the user asks (owner decision, 2026-11-14).
li	Forbid linking two changes or adding a replacement hint such as "use X instead" that the input does not state.
li	State the `Breaking:` marker and the output parts in SKILL.md, not only in the layers.
li	Add eval case `zero-major-breaking-minor`.
h2	Download
a	Download changelog-writer 1.0.0 (.zip, 15 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the skill .zip and check its SHA-256 against checksums.json.
li	Unzip it into .claude/skills/ in your project, keeping the folder name.
li	Restart Claude Code to load the skill.
p	Or copy one command: it downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ in the current folder.
h2	Banner to share
p	Drawn from the real output above, with the install command. Updates when the skill is recorded again.
img[alt]	changelog-writer 1.0.0: Turn merged changes into a correct CHANGELOG entry and semver bump.
span	Download SVG
p	Skill Foundry. Static site generated from the skill registry.

What changed:
- Cut filler
- Plainer verbs
- Kept names, numbers, paths, versions
- Changelog entries untouched
