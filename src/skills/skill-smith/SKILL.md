---
name: skill-smith
description: Build a new Skill Foundry skill from the template so it passes the factory linter, evals and review.
version: 1.0.0
---

# skill-smith

A meta-skill: it walks an agent through making a new skill folder under `src/skills/<name>/`,
starting from `src/skills/_template/`.

## When to use

- Use when someone asks for a new skill, or to turn a repeated workflow into a skill.
- Do not use when only fixing a typo in an existing skill; edit it directly and bump the patch version.

## Procedure

1. Interview the goal: ask who uses the skill, what triggers it, what it must produce and what it must never do. Do not invent answers; ask.
2. Write the intent: copy `src/skills/_template/` to `src/skills/<name>/`, set `name` to the folder name, and write the description and `## When to use`.
3. List the rules: write each rule in `RULES.json` with id `R-<name>-<n>` and one plain sentence of text.
4. Map each rule to a check or checklist item: use a linter check id (for example `chk-frontmatter`) when a machine can verify it, otherwise a `checklist` line a reviewer can tick.
5. Write examples and evals: add worked examples to `examples/README.md` and cases to `evals/cases.json` (types contains, notContains, maxLines, fileExists).
6. Draw the cover and write preview.json: `preview/cover.svg` uses only `var(--...)`, `currentColor` or `none` for colours, no scripts and no external links; `preview.json` has a tagline of at most 90 characters and at most 5 tags.
7. Run the linter and evals: `node src/factory/lint-skills.mjs <name>` and the eval runner in `src/factory/evals.mjs`; fix every problem.
8. Review with `docs/factory/REVIEW.md` and record the result.
9. Pack: `node src/factory/pack.mjs <name>` and add the skill to `src/factory/registry.json`.
10. Report: list the files created, lint and eval results, review outcome and anything left open.

## Rules

See `RULES.json`. Every rule maps to a linter check or a reviewer checklist item.

## Checks

- `node src/factory/lint-skills.mjs <name>` prints no problems.
- All cases in `evals/cases.json` pass.

## Review

Use `docs/factory/REVIEW.md`. Mention docs paths in backticks; never link outside the skill folder.

## Output

A complete skill folder under `src/skills/<name>/`, a zip in `dist/`, a registry entry, and a short report.
