# copy-tight review (2026-11-14)

Review against `docs/factory/REVIEW.md`. Status: ready at 0.2.0.

## History
- 0.1.0 was built by a real agent using skill-smith. Its own evals passed 3 of 3 on its hand-written examples.
- Real-agent live evals on 0.1.0: 0 of 3. Found: "Checkout" lowercased (rule R-copy-tight-4 broken), change list quoted removed words, no fixed legal note.
- 0.2.0 fixed the skill (not the cases). Real-agent live evals: 3 of 3.
- 0.2.0 migrated to the ten-layer standard (layers 01-10, references/checklist.md, no repository paths). Removed from src/factory/migration.json, so chk-layers and chk-portable now apply. Re-recorded with fresh real agents (`claude -p`, 2026-11-14): 3 of 3. Description unchanged; routing 12 of 12.
- Added 4 edge-case evals (mixed-legal, placeholders-kept, already-tight, length-limit-not-met). First fresh-agent run: 5 of 7. Real failures: change list quoted removed words (R-copy-tight-7); unmet length limit stated in free words. Fixed the skill (layers 04, 06, 07, 08), not the cases. Second fresh-agent run: 7 of 7, every answer read by hand.
- Finding from two fresh portable-check agents (docs/factory/notes/copy-tight-findings.md): one added "Try again." to an error, one did not. Cause in the skill: layer 04 step 5, layer 08 step 5 and checklist item 7 said errors must say "what to do". Added R-copy-tight-9 (answer holds only the rewritten copy and the change list; fresh portable agents had added a note about searching project files and an offer, first after and then before the answer; layer 01 now says the request is the only source of copy) and R-copy-tight-8 (no new action, promise or fact; a next step stays only if the original had one), fixed those three lines, added eval `error-no-new-step`. Fresh-agent live evals 8 of 8, portable check and recipe ship-a-change re-recorded; every answer read by hand. Description unchanged, routing not re-run. Version stays as is.

- S7 (2026-11-16, version stays 0.2.0): fixed table for two or more strings (ID, Before, After, Saved, Reason), no input line dropped (unchanged = `Kept`), concrete reasons, user-marked keep-as-is strings and claim labels unchanged, strings over about 25 words split into sentences. New rules R-copy-tight-10 to 13, checklist items 11-15, four new live cases (list-all-lines with 22 strings, keep-marked-label, long-string-split, list-concrete-reasons). All 12 live cases and the portable check re-recorded with fresh `claude -p` agents; Saved counts checked by script (0 mismatches); every answer read by hand. Description unchanged, routing not re-run.

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
- [x] 12 cases with unique ids including `notContains` and `maxLines`
- [x] Live evals: 12 of 12 on fresh real-agent recordings in `evals/live/`

## Preview
- [x] Tagline 78 characters, 3 tags; cover redrawn with tokens and currentColor only

## Release
- [x] `node src/factory/lint-skills.mjs copy-tight` exits 0
- [x] Version 0.2.0 matches SKILL.md, CHANGELOG and registry

## Open
- None.
