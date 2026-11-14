# changelog-writer review (2026-11-14)

Review against `docs/factory/REVIEW.md`. Status: ready.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-changelog-writer-<n>`
- [x] No step relies on unstated knowledge (bump table is in references/)
- [x] SKILL.md is at most 150 lines

## Triggers
- [x] Description says when to use and when not (commit messages, docs, marketing; names copy-tight)
- [x] Does not overlap skill-smith or figure-craft

## Coverage
- [x] Main path (MINOR), breaking path (MAJOR) and missing-input path covered
- [x] Every rule in RULES.json has a check or checklist item

## Examples
- [x] Three realistic examples; they follow the skill's own rules

## Evals
- [x] Three cases with unique ids, including negative cases (`notContains`, `maxLines`)
- [x] Pass with `runEvals` in `tests/changelog-writer.test.mjs`

## Preview quality
- [x] Tagline under 90 characters, 3 tags, cover uses only tokens and currentColor

## Visual items
- Not a UI skill; skipped.

## Release
- [x] `node src/factory/lint-skills.mjs changelog-writer` exits 0
- [x] Version 1.0.0 matches SKILL.md, CHANGELOG and registry
- [x] Packed: `changelog-writer-1.0.0.zip`, sha256 `1368c5ce3dc04e9541378c4348776fa7e15436a225834fd9ebc65dd2e1b2957a`
