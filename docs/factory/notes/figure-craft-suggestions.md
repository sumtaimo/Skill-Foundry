# Suggestions for figure-craft (for its owner; not applied)

figure-craft is owned by another agent and is locked in `src/factory/locks.json`. A session on
2026-11-14 ran real-agent tests on it, then reverted all of its own figure-craft edits. These are
the findings, for the owner to use or ignore.

1. Live evals case `cdn-edge-cache-explainer` expects the report to contain `renderSvg`. A real agent
   used `renderSvg` but did not name it in the report, so the case failed. Possible fix: in `## Output`,
   ask the report to name the engine functions used.
2. Two agents treated checklist items 7, 8, 10 (contents rail, rail marker, margin notes) and 20c
   (theme toggle) as blocking for a single Figure. Possible fix: mark them "Page only" / "when the page has a toggle".
3. Real install test: Claude Code loaded figure-craft by itself from `.claude/skills/`, but without
   permission to run `node` the agent could not run the engine or lint and stopped. With `Bash(node:*)`
   it finished: lint 0 errors, 0 warnings; `checkPage` 0 problems.
4. Real-agent outputs from these runs passed `checkPage` (1440/390, light/dark, reduced motion). They
   are not kept in the skill folder; re-record with `node src/factory/live-evals.mjs figure-craft --run`
   when the skill is unlocked.

## Findings from the empty-project test (2026-11-14, by the coordinator session)

figure-craft is locked, so these are notes, not edits. A fresh agent got the skill installed with `install.mjs` in an empty project outside the repository, asked "Show how an electric kettle boils water ... open, with the water inside". It used the skill, the lint reported 0 errors and 0 warnings, and the page passed a browser check (four views, open and closed states, hover, no console errors, 390px). Cost about $0.22.

What the picture showed (read by eye, not only by lint):

1. **A round object comes out boxy.** The kettle body is a box, so the result looks like a small cabinet with a lid. The engine can cut open only boxes (`open`), and a cylinder cannot be opened, so an agent that must show the inside of a round thing has no honest option. Possible work: an open cylinder, and a lid that can lift (the agent said it could not show a raised lid because a box top is always solid).
2. **A part drawn as a free slab.** The handle appears as a dark slab inside the cutaway instead of attached to the outside of the body. Possible fix: a lint rule that a part labelled as attached to the outside may not lie inside the opening.
3. **Output location.** The agent wrote the files to its own scratch folder, not to the project folder, because layer 03 says "output folder: the current working folder" but the agent runtime offered a scratch folder. Possible fix: say in layer 03 that the page and script go in the current working folder and the answer names the path.
4. **No screenshot.** A headless browser call was blocked by a permission prompt; the agent said so honestly and relied on lint. Possible fix: layer 07 already says "if no browser is available, say so"; add that this is the normal case for a user without browser permission.

Re-run with `node src/factory/portable-check.mjs figure-craft --prompt "<request>"`.
