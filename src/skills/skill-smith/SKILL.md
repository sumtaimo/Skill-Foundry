---
name: skill-smith
description: Build a new Skill Foundry skill from the template, as ten layers, portable for other people, so it passes the factory linter, evals and review and has a recorded real run. Use when asked for a new skill or to turn a repeated workflow into a skill. Do not use for a typo fix in an existing skill.
version: 1.1.0
scope: factory
---

# skill-smith

A meta-skill: it walks an agent through making a new skill folder under `src/skills/<name>/`,
starting from `src/skills/_template/`. It runs inside the Skill Foundry repository (`scope: factory`);
the skills it produces are portable and work in any project.

## When to use

- Use when someone asks for a new skill, or to turn a repeated workflow into a skill.
- Do not use when only fixing a typo in an existing skill; edit it directly and bump the patch version.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: interview the goal of the new skill. [layers/01-intent.md](layers/01-intent.md)
2. Context: what the factory already has. [layers/02-context.md](layers/02-context.md)
3. Inputs: what must be known before writing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: write the skill, layer by layer. [layers/04-flow.md](layers/04-flow.md)
5. Rules: what every skill must satisfy. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases. [layers/06-states.md](layers/06-states.md)
7. Checks: lint, evals, review. [layers/07-checks.md](layers/07-checks.md)
8. Output: the skill folder and its recorded run. [layers/08-output.md](layers/08-output.md)
9. Handoff: pack and register. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: the report. [layers/10-evidence.md](layers/10-evidence.md)

## Rules

See `RULES.json`. Every rule maps to a linter check or a reviewer checklist item.

## Checks

- `node src/factory/lint-skills.mjs <name>` prints no problems.
- `node src/factory/run-skill.mjs <name> --case <id>` records a real run with status `pass`.

## Review

Use `docs/factory/REVIEW.md`. Mention docs paths in backticks; never link outside the skill folder.

## Output

A complete skill folder under `src/skills/<name>/`, a recorded real run under `runs/<name>/`, a zip in `dist/`, a registry entry, and a short report.
