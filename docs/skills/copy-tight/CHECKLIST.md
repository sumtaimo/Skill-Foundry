# copy-tight review (2026-11-14)

Review against `docs/factory/REVIEW.md`. Status: ready at 0.2.0.

## History
- 0.1.0 was built by a real agent using skill-smith. Its own evals passed 3 of 3 on its hand-written examples.
- Real-agent live evals on 0.1.0: 0 of 3. Found: "Checkout" lowercased (rule R-copy-tight-4 broken), change list quoted removed words, no fixed legal note.
- 0.2.0 fixed the skill (not the cases). Real-agent live evals: 3 of 3.
- 0.2.0 migrated to the ten-layer standard (layers 01-10, references/checklist.md, no repository paths). Removed from src/factory/migration.json, so chk-layers and chk-portable now apply. Re-recorded with fresh real agents (`claude -p`, 2026-11-14): 3 of 3. Description unchanged; routing 12 of 12.
- Added 4 edge-case evals (mixed-legal, placeholders-kept, already-tight, length-limit-not-met). First fresh-agent run: 5 of 7. Real failures: change list quoted removed words (R-copy-tight-7); unmet length limit stated in free words. Fixed the skill (layers 04, 06, 07, 08), not the cases. Second fresh-agent run: 7 of 7, every answer read by hand.

## Layers
- [x] Ten core layers with numbered steps, linked from SKILL.md (chk-layers)
- [x] Self-contained: no src/, docs/ or tests/ paths in SKILL.md, layers or references (chk-portable)

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
- [x] 7 cases with unique ids including `notContains` and `maxLines`
- [x] Live evals: 7 of 7 on fresh real-agent recordings in `evals/live/`

## Preview
- [x] Tagline 78 characters, 3 tags; cover redrawn with tokens and currentColor only

## Release
- [x] `node src/factory/lint-skills.mjs copy-tight` exits 0
- [x] Version 0.2.0 matches SKILL.md, CHANGELOG and registry

## Open
- None.
