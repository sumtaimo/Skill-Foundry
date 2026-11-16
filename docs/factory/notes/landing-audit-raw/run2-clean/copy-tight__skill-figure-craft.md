<!-- skill: copy-tight | input: skill-figure-craft | turns: 3 | cost_usd: 0.141 | permission_denials: 0 | is_error: False -->

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
h1	figure-craft
span	Version
li	diagram
li	isometric
li	svg
li	explainer
li	motion
span	For:
span	Business analyst
span	Developer
p	Tested by a real agent: 3 of 3 cases pass
span	Copy install command
nav[aria-label]	Questions
span	What it does
span	What you type
span	What you get
span	How you know
p	Any object you describe, drawn full and lit, with real materials and labels on hover.
h2	What it does
li	Intent: start from the stated goal.
li	Context: where the figure will live and what exists.
li	Inputs: what is required and what to ask.
li	Flow: object, parts, details, motion, build.
li	Rules: the MUST and NEVER list.
li	States and edge cases: themes, phone, reduced motion.
li	Checks: lint, checklist, browser.
li	Output: the files and the quality bar.
li	Handoff: what the reader or next skill receives.
li	Evidence: what is recorded as proof.
p	Paste this line after installing the skill.
h2	What you type
span	Copy
p	The agent returns these files and a short report.
h2	What you get
li	Self-contained HTML page: an object you can open, turn and hover, plus the SVG
li	Lint result for L1 to L19
li	Checklist outcome
li	Short report
h3	What a real agent produced
p	A fresh agent had only this skill, installed in an empty project, and the request below. Its answer, word for word.
span	Request
span	Copy the answer
h3	Files in the package
h3	Recorded real run
p	An agent followed this skill on the prompt above. Its output, unedited.
p	Shown in a sandboxed frame.
iframe[title]	figure-craft example
a	Open the example on its own page
p	Machines check structure; a reviewer checks the rest.
h2	How you know
p	21 of 33 rules machine-checked
dt	Rules in total
dd	33
dt	Machine-checked
dd	21
dt	Reviewer checklist
dd	12
h3	Changelog
h4	1.0.0 - 2026-11-14
p	The version stays 1.0.0 until the owner calls it final. Changes are listed as they land.
li	Engine: isometric solids with materials (`steel`, `white`, `dark`, `glass`, `plain`, `ink`, `blue`, `red`, `green`, `amber`), upright and lying cylinders, panels, discs, lines with pipe tones, lamp glow.
li	Style: near-white palette, one hairline outline weight, one light direction, soft cast shadows; the SVG carries its own tokens.
li	Rounded upright edges (`r`). Open bodies (`open: 'x' | 'y' | 'xy'`, back sides `'-x'`, `'-y'`) with contents (`inside`); states (`when`) such as doors open and closed.
li	Orbit: four views a quarter turn apart with turn buttons, drag and arrow keys; back-side details (`face: '-x'`, `'-y'`).
li	Labels: chips that appear on hover, focus or tap; no space reserved for them.
li	Solids read as solid: clearer difference between lit and shaded sides, contact shadows, firmer outlines. Moving parts have a hit area along their path.
li	Cutaways read as solid hollows: the cut through the walls is a section band, the inside is lined like the body and shaded.
li	Top edges carry a rim highlight; views fade into each other. Parts sit where they really are, with the source recorded.
li	Kit: `slots`, `screws`, `repeat` for micro detail in one call.
li	Lint L1 to L19, `lintViews` and `lintStates`.
li	Ten layer files; self-contained; starts from the goal the user states.
li	Reference figure: one refrigerator, drawn whole, that opens, turns and shows its food (`examples/build-demo.mjs`).
li	Rounded top edges: a lit ring and a lit strip under the rim on boxes and cylinders (`edge`); round parts cast round shadows and a lifted part casts none; cylinders outline as cylinders.
li	Orbit: dragging scrubs between the four true views by cross-fade; continuous rotation is not offered and `references/orbit.md` says exactly why.
li	Page: `cardsHtml` and `lintCards` (`engine/page.mjs`) put what each part does, where it sits and the source of that fact in the cards (R-figure-craft-31, `R31-card-location`).
li	Layers: output goes to the current working folder with its path named; the browser check is optional and the report says honestly when it was not run; the report names the engine functions used; page-only checklist items are marked.
h2	Download
a	Download figure-craft 1.0.0 (.zip, 330 KB)
dt	SHA-256
span	checksums.json
h2	Install
li	Download the skill .zip and check its SHA-256 against checksums.json.
li	Unzip it into .claude/skills/ in your project; keep the folder name.
li	Restart Claude Code so it loads the skill.
p	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ in the folder where you run it.
h2	Banner to share
p	Drawn from the real output above, with the install command. Updates when the skill is recorded again.
img[alt]	figure-craft 1.0.0: Any object you describe, drawn full and lit, with real materials and labels on hover.
span	Download SVG
p	Skill Foundry. Static site generated from the skill registry.

What changed:
- Cut filler and passive phrasing in the intro and status lines
- Plainer verbs and shorter sentence openings
- Kept every number, name, file path and version exactly
- Changelog entries left as they were; they are not UI copy (changelog-writer handles those)
- No change needed for the short labels, headings and buttons
