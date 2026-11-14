---
name: changelog-writer
description: Turns a list of merged changes into one CHANGELOG.md entry in the Skill Foundry format. Use when asked to write a changelog entry, release notes or a version bump note for a skill. Do not use for commit messages, long-form docs or marketing copy; use copy-tight for wording.
version: 1.0.0
---

# changelog-writer

Takes a list of changes plus a version and a date, and returns one entry that matches
`docs/factory/STANDARD.md` section 10, so the version in SKILL.md, CHANGELOG.md and the registry stay in step.

## When to use

- Use when someone has merged changes to a skill and needs the CHANGELOG entry and the right semver bump.
- Use when asked to check that an existing entry follows the format.
- Do not use for commit messages, pull request text or release marketing.

## Procedure

1. Ask for the skill name, the current version, today's date and the list of changes. Do not guess any of them.
2. Read the skill's `CHANGELOG.md` and keep its existing entries unchanged.
3. Sort each change as breaking, new behaviour or fix, using the table in `references/README.md`.
4. Choose the bump: MAJOR if any change is breaking, else MINOR if any is new behaviour, else PATCH.
5. Write the heading `## <version> - <YYYY-MM-DD>`, with the newest entry above older ones.
6. Write one bullet per change, one idea each, in plain words, starting with a verb.
7. Put the breaking changes first and mark each with `Breaking:`.
8. Check that the new version equals the SKILL.md frontmatter and the registry entry; if not, list the file to fix.
9. Return the entry, the chosen bump with one line of reason, and any mismatch found.

## Rules

- R-changelog-writer-1: The heading MUST be `## <semver> - <YYYY-MM-DD>`.
- R-changelog-writer-2: The bump MUST follow the change types (breaking, new behaviour, fix).
- R-changelog-writer-3: Each bullet MUST hold one idea and start with a verb.
- R-changelog-writer-4: Existing entries MUST NEVER be edited or reordered.
- R-changelog-writer-5: The version MUST match the frontmatter and the registry.
- R-changelog-writer-6: The skill NEVER invents a change, version or date.

See `RULES.json` for the check or checklist item behind each rule.

## Checks

- `node src/factory/lint-skills.mjs changelog-writer` prints no problems.
- All cases in `evals/cases.json` pass.

## Review

Use `docs/factory/REVIEW.md`; the filled checklist is in `docs/skills/changelog-writer/CHECKLIST.md`.

## Output

One CHANGELOG entry in markdown, the chosen bump with its reason, and a list of version mismatches (or "none").
