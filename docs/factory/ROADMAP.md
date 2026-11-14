# Roadmap: skills

The project roadmap is in `docs/PROJECT.md` section 6. This file lists skills.

## Built (status `ready` in `src/factory/registry.json`)

| Skill | Purpose |
|-------|---------|
| skill-smith | Build a new skill as ten layers, portable, proven by a real agent |
| figure-craft | Draw any object the user describes as a detailed isometric figure that opens, turns and labels on hover |
| changelog-writer | Turn a list of changes into a CHANGELOG entry with the correct semver bump |
| copy-tight | Rewrite UI copy to be short and plain without changing meaning (0.2.0) |
| test-planner | Derive a numbered regression checklist from a change description or diff, never adding features the change does not name |

`changelog-writer` and `copy-tight` do not have the ten layer files yet; they are listed in `src/factory/migration.json` and each is migrated in its own session.

## Candidates (not built)

| Skill | Kind | Purpose |
|-------|------|---------|
| spec-writer | analysis | Write testable Given-When-Then acceptance criteria, as numbered clauses |
| ui-polish | output | Run a final pixel pass on a finished UI |
| a11y-audit | analysis | Check a page against accessibility basics and list fixes |
| svg-cover | output | Create a cover.svg that meets the factory preview limits |
