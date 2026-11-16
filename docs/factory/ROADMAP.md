# Roadmap: skills

Current state, decisions and the skill backlog: `docs/factory/STATUS.md` (read it first).

The project roadmap is in `docs/PROJECT.md` section 6. This file lists skills.

## Built (status `ready` in `src/factory/registry.json`)

| Skill | Purpose |
|-------|---------|
| skill-smith | Build a new skill as ten layers, portable, proven by a real agent |
| figure-craft | Draw any object the user describes as a detailed isometric figure that opens, turns and labels on hover |
| changelog-writer | Turn a list of changes into a CHANGELOG entry with the correct semver bump |
| copy-tight | Rewrite UI copy to be short and plain without changing meaning (0.2.0) |
| test-planner | Derive a numbered regression checklist from a change description or diff, never adding features the change does not name |
| design-system | One design-token set (colour scales, type, spacing, control heights, radius, shadow, motion, light and dark) from a hex, a style description or existing tokens; five numeric style archetypes |
| ui-polish | Final polish pass on finished UI code: on-scale spacing and type, contrast, one primary action, states; uses the project's design tokens when present; keeps every word and the brand hue |
| spec-writer | Write testable Given-When-Then acceptance criteria as numbered clauses (AC-1 …) from a feature request, user story or requirement, each traced to a source phrase; gaps become open questions. Never a regression checklist (test-planner), test code, UI design, copy, estimates or priorities |
| a11y-audit | Audit pasted HTML or JSX for what users cannot see (names, labels, keyboard access, ARIA, status messages, language, tables, media, zoom): numbered findings with element, rule id, WCAG 2.2 criterion, who is affected and the fix as a diff; a zero-dependency script lists the structural problems. Never contrast, focus style, spacing or target size (ui-polish), flow or usability, visible words (copy-tight) or a conformance certificate |
| ux-review | Review a screen or flow from code or a step description: 18 checkable usability rules (13 on controls and steps, 5 on the shape of a screen; optional measurement sheet), numbered findings with place, evidence, rule id, severity S1 to S4 and one recommendation in words; never fixes code, text, contrast or ARIA |

All ready skills have the ten layer files (`src/factory/migration.json` lists none pending).

## Candidates (not built)

| Skill | Kind | Purpose | Boundary (what it never does) |
|-------|------|---------|-------------------------------|

Merged or dropped on 2026-11-15 (TAIMO approved): `usability-review` and `ux-laws-check` merged into `ux-review` (same input, same output, overlapping findings); `svg-cover` dropped (it is layer 04, step 10 of skill-smith).

## UI/UX family: one job each, in work order

`design-system` (makes the token file) → the team builds the screen → `ui-polish` (fixes what is seen) → `ux-review` (judges the flow) → `a11y-audit` (checks what is not seen) → `copy-tight` (fixes the words). Every UI skill reads the same token file when the project has one.

## Before adding or changing a skill (overlap gate)

Every AI does this whenever TAIMO asks for a new skill or a change, before any work:

1. Compare the request with every row in "Built", "Candidates" and the merged/dropped list above.
2. If it overlaps one, say so and name it; propose an improvement to that skill or a merge instead of a new skill. Do not start a new skill that duplicates one; wait for TAIMO's decision.
3. If it is new, write its row with a Boundary column first, and add routing cases against its nearest neighbours.
