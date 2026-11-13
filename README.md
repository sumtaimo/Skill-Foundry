# Skill Foundry

A factory for AI agent skills. Each skill is a folder of instructions written as the same ten layers, with rules, evals and a preview. A linter checks it, a run recorder captures what it really produces, and the showcase site shows only that real output. Node 24, ES modules, no runtime dependencies (Playwright is a dev dependency for browser tests).

The goal, the rules and the roadmap are in `docs/PROJECT.md`. Read it first.

## Check the project

```
npm install
npm test
node src/factory/lint-skills.mjs
```

## Use a skill in your own project

Skills are self-contained, so they work outside this repository.

1. Build the site and downloads: `node src/site/build.mjs` (or `npm run dev` to browse it locally).
2. Unzip a skill from `dist/site/downloads/` into your project at `.claude/skills/<name>/`, or from this repository run `node src/factory/install.mjs <name>` in your project root.
3. Restart Claude Code and state your goal in one line. The skill starts from that goal and asks when something is missing.

## Add a skill

1. Use the `skill-smith` skill and ask it for a new skill; it starts from `src/skills/_template/`.
2. Follow `docs/factory/STANDARD.md`: ten core layers, portable, rules mapped to checks.
3. Record a real run: `node src/factory/run-skill.mjs <name> --case <id>`. This runs a real agent and spends tokens once; the result is cached under `runs/`.
4. Add the skill to `src/factory/registry.json` with status `draft` and review it with `docs/factory/REVIEW.md`.

## Pack and publish

See `docs/factory/PUBLISHING.md`.

## License

MIT. See `LICENSE`.
