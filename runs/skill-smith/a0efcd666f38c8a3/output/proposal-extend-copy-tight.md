# Proposal: extend `copy-tight` instead of creating a new skill

Request: "Make a skill that rewrites UI copy to be short and plain."
Skill used: skill-smith, layer 06 (States), state 1: the intent overlaps an existing skill, so stop and propose extending that skill.

## What already exists

`copy-tight` (version 0.2.0, status `ready` in `src/factory/registry.json`) already does this job. Its description reads: "Rewrites UI copy (buttons, labels, errors, empty states, tooltips) to be short and plain without changing meaning."

- Its procedure covers cut, plain words, fit the UI job, and compare.
- It keeps numbers, names, product terms and legal text unchanged (rules R-copy-tight-3 to R-copy-tight-7).
- It has a checklist in `docs/skills/copy-tight/CHECKLIST.md` and live-eval recordings in `src/skills/copy-tight/evals/live/`.
- Its exclusions (long-form docs, marketing articles, translation, changelog entries) do not overlap the request, which is for UI strings.

## Checks run in this session

- `node src/factory/lint-skills.mjs copy-tight`: "lint-skills: no problems" (read-only run).
- I did not run the live evals or routing evals myself. The results above come from copy-tight's own review file (`docs/skills/copy-tight/CHECKLIST.md`), which records 3 of 3 live evals on 2026-11-14.

## Proposal

1. Do not create a second UI-copy skill. Two skills with the same trigger would fight in routing.
2. If the request needs more than copy-tight does now, extend `copy-tight` in its own session. Add evals for the new case and bump the version (minor, for new behaviour), then update its CHANGELOG and registry entry together.
3. `src/skills/copy-tight/` is not in `src/factory/locks.json`, so it is open to change. The factory owner still decides when that happens.

## Open questions for the requester

- Does the copy-tight behaviour already cover what you need? Please give one or two real strings that it rewrites badly.
- Is there a kind of UI copy that copy-tight excludes but you want covered, such as onboarding text, help-panel text or notification text? If so, that is the gap to extend.
- Should the extension stay inside the same skill, or do you want a separate skill whose description excludes UI strings entirely? The second option needs a clear split in the descriptions to avoid overlap.

## Not done

- No skill folder was created. Layers 02 to 10 were not written, because layer 06 says to stop at an overlap.
- No files in the repository were changed. Nothing was registered, packed or recorded under `runs/`.
