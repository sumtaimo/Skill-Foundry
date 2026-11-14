# Quality layers: how a skill is proven to work

A skill is a product for agents. It is not done when its files look right; it is done when a
**real agent, given only the skill folder, does the real job correctly**. Every skill passes
these layers in order. Each layer catches mistakes the layer before it cannot see.

| # | Layer | Question it answers | Tool | Gate |
|---|-------|---------------------|------|------|
| 1 | Standard | Is the folder complete and well formed? | `docs/factory/STANDARD.md` | — |
| 2 | Lint | Do files, frontmatter, rules, links, preview, cover and CHANGELOG meet the standard? | `node src/factory/lint-skills.mjs <name>` | exit 0 |
| 3 | Example evals | Do the hand-written examples meet the eval cases? | `runEvals` in `src/factory/evals.mjs` | 0 failed |
| 4 | **Live evals** | Does a fresh real agent, given only the skill, produce output that meets the cases? | `node src/factory/live-evals.mjs <name>` (`--run` to re-record) | 0 failed, no missing or stale recordings |
| 5 | **Routing evals** | Does a real agent, seeing only names and descriptions, load this skill for its requests and not for its neighbours'? | `node src/factory/routing-evals.mjs` | 0 failed, recording matches current descriptions |
| 6 | Visual | Does UI output render: 1440 and 390 wide, light and dark, reduced motion, no console errors, no sideways scroll? | `checkPage` in `src/factory/visual.mjs` on files in `evals/live/files/` | 0 problems |
| 7 | Review | Does a reviewer tick every item, including the checklist rules a machine cannot check? | `docs/factory/REVIEW.md`, record in `docs/skills/<name>/CHECKLIST.md` | all ticked |
| 8 | Release | Do version, CHANGELOG and registry match, and is the zip packed with a checksum? | `node src/factory/pack.mjs <name>`, `src/factory/registry.json` | status `ready` |

`npm test` enforces layers 2, 4 and 5 for every `ready` skill, so a skill that only passes on
hand-written answers cannot ship.

## Why layer 4 and 5 exist (what they found on 2026-11-14)

| Skill | Example evals | Real agent | What the real agent exposed |
|-------|---------------|-----------|-----------------------------|
| copy-tight 0.1.0 | 3/3 | 0/3 | Lowercased the name "Checkout"; quoted removed words; no fixed legal note |
| figure-craft 1.0.0 | — | 2/3 | Report did not name the engine functions, so the result was not verifiable |
| skill-smith 1.0.1 | — | 1/2 | Eval case asked for a skill that already existed; the case was testing nothing |
| figure-craft checklist | — | — | Two agents blocked by page-only items on a single figure |
| linter | — | — | No check for CHANGELOG dates; `skill-smith` had two undated entries |

## Rules when a layer fails

- Fix the **skill** so agents behave correctly. Change an eval case only when the case itself is wrong, and say why in the CHANGELOG.
- Re-record with a fresh agent after any change to SKILL.md, a case prompt or a description; old recordings fail as stale.
- Keep agent-produced files (HTML, SVG) in `evals/live/files/` as evidence.
