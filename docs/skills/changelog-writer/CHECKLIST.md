# changelog-writer review (2026-11-14)

Review against `docs/factory/REVIEW.md`. Status: ready. Migrated to the ten-layer standard (STANDARD.md section 12) on 2026-11-14.

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-changelog-writer-<n>`
- [x] No step relies on unstated knowledge (bump table is in references/)
- [x] SKILL.md is at most 150 lines
- [x] Ten core layers `layers/01-intent.md` to `layers/10-evidence.md` with numbered steps, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no `src/`, `docs/` or `tests/` paths in SKILL.md, layers or references (`chk-portable`)

## Triggers
- [x] Description says when to use and when not (commit messages, docs, marketing; names copy-tight)
- [x] Does not overlap skill-smith or figure-craft

## Coverage
- [x] Main path (MINOR), breaking path (MAJOR) and missing-input path covered
- [x] Language path (English request gives an English entry, R-changelog-writer-10) and no-added-qualifier path (R-changelog-writer-11) covered
- [x] Current-version wording ("We are at version 2.3.0" gives `## 2.4.0`) and ambiguous wording ("Version 2.3.0 is ready" gives a question) covered (R-changelog-writer-6)
- [x] Every rule in RULES.json has a check or checklist item

## Examples
- [x] Three realistic examples; they follow the skill's own rules

## Evals
- [x] Seven cases with unique ids, including negative cases (`notContains`, `maxLines`)
- [x] Pass with `runEvals` in `tests/changelog-writer.test.mjs`
- [x] Live evals: 7 of 7 pass on fresh real-agent recordings in `evals/live/` (re-recorded after the migration)
- [x] `new-behaviour-minor` also rejects `## 1.0.0 - 2026-11-14`: a real agent once kept the old version in the heading and only passed because `## 1.1.0` appeared in a side sentence

- [x] Portable check (`src/factory/portable-check.mjs`, empty project outside the repo): "We are at version 2.3.0 ..." gives `## 2.4.0 - 2026-11-14`; "Our app is currently 0.9.4 ... removed the old export API" gives `## 1.0.0 - 2026-11-15`; "Version 2.3.0 is ready ..." gives a question; skill used, no repo rules leaked

## Preview quality
- [x] Tagline under 90 characters, 3 tags, cover uses only tokens and currentColor

## Visual items
- Not a UI skill; skipped.

## Release
- [x] `node src/factory/lint-skills.mjs changelog-writer` exits 0
- [x] Version 1.0.0 matches SKILL.md, CHANGELOG and registry
- [x] Packed: `changelog-writer-1.0.0.zip`, sha256 `708879e0b6fa16187219991b8ac56770a6608efa65e27a73eaf7b6652e13e058`
