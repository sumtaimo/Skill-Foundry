> Draft. The owner moves this file to `README.md` at the repository root.

# Skill Foundry

A library and factory for AI agent skills. Each skill is a folder with instructions, rules, evals and a preview, checked by a linter and packed into a zip. Node 24, ES modules, no dependencies.

## Use this template

1. Create a new repository from this template (or copy the folder).
2. Install Node 24.
3. Run the checks: `node --test "tests/**/*.test.mjs"` and `node src/factory/lint-skills.mjs`.

## Install a skill into a project

Run this yourself from the project root:

```
node src/factory/install.mjs <name>
```

This copies the skill to `.claude/skills/<name>/`. Use `--force` to overwrite an existing copy. The skill must be listed in `src/factory/registry.json`. Restart Claude Code afterwards.

## Add a skill

1. Use the `skill-smith` skill and ask it to create a new skill; it starts from `src/skills/_template/`.
2. Follow `docs/factory/STANDARD.md`.
3. Add an entry to `src/factory/registry.json` with status `draft`.
4. Review with `docs/factory/REVIEW.md`.

## Pack and publish

See `docs/factory/PUBLISHING.md`. In short:

```
node src/factory/lint-skills.mjs <name>
node src/factory/pack.mjs <name>
```

The sha256 is printed by pack. Then set status `ready` in the registry.

## License

To be chosen by the owner.
