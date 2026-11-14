# copy-tight review (2026-11-14)

Review against `docs/factory/REVIEW.md`. Status: ready at 0.2.0.

## History
- 0.1.0 was built by a real agent using skill-smith. Its own evals passed 3 of 3 on its hand-written examples.
- Real-agent live evals on 0.1.0: 0 of 3. Found: "Checkout" lowercased (rule R-copy-tight-4 broken), change list quoted removed words, no fixed legal note.
- 0.2.0 fixed the skill (not the cases). Real-agent live evals: 3 of 3.

## Clarity
- [x] Procedure numbered, imperative, one action per step
- [x] Rules use MUST or NEVER with ids `R-copy-tight-<n>` and are listed in SKILL.md

## Triggers
- [x] Description says when to use and when not, and names changelog-writer
- [x] Routing evals: a real agent picks copy-tight for wordy UI strings and none for translation and blog posts

## Coverage and examples
- [x] Main path (error, button) and legal path; examples follow the rules
- [x] Every rule in RULES.json has a check or checklist item

## Evals
- [x] 3 cases with unique ids including `notContains` and `maxLines`
- [x] Live evals: 3 of 3 on fresh real-agent recordings in `evals/live/`

## Preview
- [x] Tagline 78 characters, 3 tags; cover redrawn with tokens and currentColor only

## Release
- [x] `node src/factory/lint-skills.mjs copy-tight` exits 0
- [x] Version 0.2.0 matches SKILL.md, CHANGELOG and registry

## Open
- Only 3 cases; more cases would make the evals stronger.
