---
name: changelog-writer
description: Turns a list of merged changes into one CHANGELOG.md entry in the Skill Foundry format. Use when asked to write a changelog entry, release notes or a version bump note for a skill. Do not use for commit messages, long-form docs or marketing copy; use copy-tight for wording.
version: 1.0.0
---

# changelog-writer

Takes a list of changes plus a version and a date, and returns one CHANGELOG entry with the right
semver bump, so the version in `SKILL.md`, `CHANGELOG.md` and any registry or manifest stay in step.
The format and the bump table are in [references/README.md](references/README.md).

## When to use

- Use when someone has merged changes to a skill and needs the CHANGELOG entry and the right semver bump.
- Use when asked to check that an existing entry follows the format.
- Do not use for commit messages, pull request text or release marketing.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: restate the request and decide write or check. [layers/01-intent.md](layers/01-intent.md)
2. Context: read the existing CHANGELOG and every place the version is recorded. [layers/02-context.md](layers/02-context.md)
3. Inputs: skill name, current version, date and changes; ask for any that is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: sort the changes, choose the bump, write the heading and bullets. [layers/04-flow.md](layers/04-flow.md)
5. Rules: R-changelog-writer-1 to 6. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: missing input, no CHANGELOG, mixed types, check task. [layers/06-states.md](layers/06-states.md)
7. Checks: heading, bump, bullets, facts, version match. [layers/07-checks.md](layers/07-checks.md)
8. Output: entry, bump with reason, mismatches. [layers/08-output.md](layers/08-output.md)
9. Handoff: where to paste it and which files to update. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: inputs, files read, check results. [layers/10-evidence.md](layers/10-evidence.md)

## Rules

- R-changelog-writer-1: The heading MUST be `## <semver> - <YYYY-MM-DD>`.
- R-changelog-writer-2: The bump MUST follow the change types (breaking, new behaviour, fix).
- R-changelog-writer-3: Each bullet MUST hold one idea and start with a verb.
- R-changelog-writer-4: Existing entries MUST NEVER be edited or reordered.
- R-changelog-writer-5: The version MUST match the frontmatter and any registry or manifest entry.
- R-changelog-writer-6: The skill NEVER invents a change, version or date.

See `RULES.json` for the check or checklist item behind each rule.

## Checks

- Every item in [layers/07-checks.md](layers/07-checks.md) holds for the returned entry.
- Run the project's changelog linter or tests when it has them, and report the result.

## Review

The maintainer compares the entry with the changes they merged and with the worked cases in
[examples/README.md](examples/README.md). Every path stays inside this skill folder.

## Output

One CHANGELOG entry in markdown, the chosen bump with its reason, and a list of version mismatches (or "none").
