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

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: [layers/01-intent.md](layers/01-intent.md)
2. Context: [layers/02-context.md](layers/02-context.md)
3. Inputs: [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: [layers/04-flow.md](layers/04-flow.md)
5. Rules: [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: [layers/06-states.md](layers/06-states.md)
7. Checks: [layers/07-checks.md](layers/07-checks.md)
8. Output: [layers/08-output.md](layers/08-output.md)
9. Handoff: [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: [layers/10-evidence.md](layers/10-evidence.md)

## Rules

Rules live in `RULES.json`. Each rule has an id `R-<skill>-<n>` and a check or checklist item.

## Checks

- Run `node src/factory/lint-skills.mjs <skill>` and fix every problem.
- Run the evals in `evals/cases.json`.

## Review

Review the skill with `docs/factory/REVIEW.md` before marking it ready.

## Output

Describe exactly what the agent produces (files, text, format).
