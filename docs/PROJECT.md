# Skill Foundry: project goal (read this first)

Owner: TAIMO (Product Owner / UX Engineer). Every agent working in this repository reads this
file before planning or changing anything. Status markers: **[built]** exists and is tested,
**[planned]** approved direction, not built yet. Never describe a planned item as built.

## 1. The goal in one sentence

Skill Foundry is a **factory that builds many AI agent skills**, each written as the same
step-by-step layers, and showcases **the real output each skill produces**, never a mock.

## 2. The four ideas

| Idea | Meaning | Status |
|---|---|---|
| Factory | One standard and one toolchain (lint, evals, pack, install, site) produce many skills, not one | [built] for lint, evals, pack, install, site |
| Layers | Every skill uses the same layer template (10 core layers, more allowed); each layer is a detailed chapter of what the agent does at that step, like a book | [built] standard and template; existing skills not migrated yet |
| Composition | Skills are atoms that combine into larger workflows (for example BA + UX + QA on one feature) | [planned] |
| Real output | The showcase shows only files a skill really produced from a real input, captured with its check results | [built] run recorder; [planned] site shows recorded runs; current covers are hand-authored engine renders |

## 3. Kinds of skills and their output

- **UI / product design skills**: produce real UI output (SVG, HTML, components) with micro detail: spacing, states, breakpoints, light and dark.
- **Analysis skills (BA, system analysis, QA)**: written with legal precision: defined terms, numbered clauses, no ambiguity. Their output is drawn as the real working objects: documents, forms, folders, flow diagrams.
- `figure-craft` is the existing drawing engine (isometric SVG, tokens, geometry lint L1-L8); output skills reuse it instead of drawing by hand.

## 4. Showcase rules (real output, low token cost)

1. A skill appears on the site only when it has at least one recorded real run that passed its checks. [planned]
2. A recorded run is: the input, the files produced, the skill version, the check results and the token cost, saved under `runs/<skill>/<run-id>/` with a manifest. [built] `src/factory/run-skill.mjs`; `maxLines` expectations are not applied to recorded files.
3. A run is made by a real agent following the skill, once. It is cached by input hash and skill version and repeated only when one of them changes. Deterministic steps (render, lint, pack) run as scripts, not as agent work.
4. A failed or incomplete output is shown as it is. Nobody polishes it by hand.
5. Hand-drawn images may only appear labelled as "concept".

## 5. Where things are

| Path | What |
|---|---|
| `docs/factory/STANDARD.md` | The skill standard, including the layer template (section 12) |
| `src/skills/_template/` | Starting folder for a new skill, with all layer files |
| `src/skills/<name>/` | Shipped skills: `skill-smith` (builds skills), `figure-craft` (isometric figures) |
| `src/factory/` | lint, evals, pack, install, `registry.json` |
| `src/site/` | Showcase site generator (`npm run dev`) |
| `tests/` | `npm test` (node --test) |
| `.harness/` | Agent harness; locked unless TAIMO approves in chat |

## 6. Roadmap

1. Layer standard and template. **[built]**
2. Run recorder with cache: `node src/factory/run-skill.mjs <skill> (--case <id> | --input <file>)`. **[built]**
3. Pilot: replace the figure-craft cover with a recorded real run. [planned]
4. Migrate `skill-smith` and `figure-craft` to the layer files. [planned]
5. Recipes for combining skills. [planned]
6. New skills from `docs/factory/ROADMAP.md`, BA and UI skills first. [planned]

## 7. Rules for every agent

- Investigate code, docs and tests yourself; ask TAIMO only for business rules, scope, UX decisions or approvals.
- Cite `file:line`; separate confirmed facts from assumptions.
- A task is done only when `npm test` and `node src/factory/lint-skills.mjs` pass and the real output was checked, not when the code looks right.
- Never change this file's goal, the standard or the charter without TAIMO's approval.
