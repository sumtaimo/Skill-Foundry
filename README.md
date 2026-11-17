# Skill Foundry

A factory for AI agent skills. Each skill is a folder of instructions written as the same ten layers, with rules, evals and a preview. A linter checks it, a run recorder captures what it really produces, and the showcase site shows only that real output. Node 24, ES modules, no runtime dependencies (Playwright is a dev dependency for browser tests).

The goal, the rules and the roadmap are in `docs/PROJECT.md`. Read it first.

## Check the project

```
npm install
npm test
node src/factory/lint-skills.mjs
```

## Use a skill in your own project (one command)

Needs Node.js and git. Tested on Linux, macOS and Windows with Node 18, 20 and 22.

```
npx github:sumtaimo/Skill-Foundry list                     # what is available
npx github:sumtaimo/Skill-Foundry add test-planner          # one skill
npx github:sumtaimo/Skill-Foundry add --role QA_AUDITOR     # every skill for a role
npx github:sumtaimo/Skill-Foundry add --all                 # every skill
npx github:sumtaimo/Skill-Foundry check                     # out of date, or changed locally?
npx github:sumtaimo/Skill-Foundry update                    # get new content; your edits are kept
npx github:sumtaimo/Skill-Foundry remove test-planner       # remove cleanly
```

What `add` does in your project:

- copies the skill into `.claude/skills/<name>/` (Claude Code picks it by its description);
- if you have an agentic harness (`.harness/skills/`), registers it for the matching roles so workers get it;
- writes one block in `AGENTS.md` listing the skills, so any agent (Codex, Cursor, Gemini) uses them (`--no-rules` to skip);
- adds deny rules to `.claude/settings.json` so agents cannot edit or update the skills; only you do (`--no-protect` to skip).

Your own text and settings are kept. Restart your agent, then state your goal in one line.
Zips with SHA-256 checksums are on the site: https://sumtaimo.github.io/Skill-Foundry/

## Work in this repository (the lab)

Run `npm run setup` once (pre-commit skill guard). The release path:
build on a `claude/...` branch, prove with real agents, `npm run release:check` must print READY, the owner approves, merge to `master`.

## Add a skill

1. Use the `skill-smith` skill and ask it for a new skill; it starts from `src/skills/_template/`.
2. Follow `docs/factory/STANDARD.md`: ten core layers, portable, rules mapped to checks.
3. Record a real run: `node src/factory/run-skill.mjs <name> --case <id>`. This runs a real agent and spends tokens once; the result is cached under `runs/`.
4. Add the skill to `src/factory/registry.json` with status `draft` and review it with `docs/factory/REVIEW.md`.

## Pack and publish

Run `npm run release:check`; it must print READY before a release. Users then get the skills with `npx github:sumtaimo/Skill-Foundry update`.

## License

MIT. See `LICENSE`.
