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
