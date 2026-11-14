---
name: _template
description: One sentence saying what this skill does and when an agent should use it.
version: 0.1.0
---

# Skill title

Replace every placeholder in this folder. Keep this file under 150 lines.

## When to use

- Use when: describe the trigger situation.
- Do not use when: describe the near-miss situations.

## Procedure

1. First step the agent takes.
2. Second step.
3. Final step and hand-off.

## Rules

Rules live in `RULES.json`. Each rule has an id `R-<skill>-<n>` and a check or checklist item.

## Checks

- Run `node src/factory/lint-skills.mjs <skill>` and fix every problem.
- Run the evals in `evals/cases.json`.

## Review

Review the skill with `docs/factory/REVIEW.md` before marking it ready.

## Output

Describe exactly what the agent produces (files, text, format).
